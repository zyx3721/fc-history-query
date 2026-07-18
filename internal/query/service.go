package query

import (
	"context"
	"fmt"
	"math"
	"net/netip"
	"sort"
	"strconv"
	"strings"
	"time"

	"fc-history-query/internal/domain"
)

type Source interface {
	ListRunningVMs(context.Context) ([]domain.VM, error)
	History(context.Context, string, []domain.HistoryRequest) ([]domain.HistoryItem, error)
}

type Service struct {
	Source       Source
	RequestDelay time.Duration
}

func (s Service) Execute(ctx context.Context, options domain.QueryOptions, report func(domain.Progress)) (domain.QueryResult, error) {
	if err := validateOptions(options); err != nil {
		return domain.QueryResult{}, err
	}
	started := time.Now()
	report(domain.Progress{Phase: "discovering", Message: "正在获取运行中的虚拟机"})
	vms, err := s.Source.ListRunningVMs(ctx)
	if err != nil {
		return domain.QueryResult{}, err
	}
	if len(vms) == 0 {
		return domain.QueryResult{StartedAt: started, FinishedAt: time.Now()}, nil
	}

	batches := chunkVMsBySite(vms, options.BatchSize)
	report(domain.Progress{Phase: "querying", Total: len(batches), Message: "正在分批查询历史指标"})
	byKey := make(map[string]domain.HistoryItem, len(vms)*len(options.Metrics))
	for index, batch := range batches {
		if err := ctx.Err(); err != nil {
			return domain.QueryResult{}, err
		}
		requests := makeRequests(batch.VMs, options)
		items, err := s.Source.History(ctx, batch.SiteURL, requests)
		if err != nil {
			return domain.QueryResult{}, fmt.Errorf("第 %d/%d 批查询失败: %w", index+1, len(batches), err)
		}
		for _, item := range items {
			byKey[item.URN+"\x00"+item.MetricID] = item
		}
		report(domain.Progress{Phase: "querying", Completed: index + 1, Total: len(batches), Message: "正在分批查询历史指标"})
		if s.RequestDelay > 0 && index < len(batches)-1 {
			select {
			case <-ctx.Done():
				return domain.QueryResult{}, ctx.Err()
			case <-time.After(s.RequestDelay):
			}
		}
	}

	report(domain.Progress{Phase: "evaluating", Total: len(vms), Message: "正在计算筛选结果"})
	rows := make([]domain.ResultRow, 0, len(vms))
	matched := 0
	for index, vm := range vms {
		row := domain.ResultRow{URN: vm.URN, Name: vm.Name, Description: vm.Description, IP: vm.IP, ClusterName: vm.ClusterName, HostName: vm.HostName, Metrics: make(map[string]domain.MetricSummary)}
		row.Pass = true
		for _, metric := range options.Metrics {
			summary := summarise(byKey[vm.URN+"\x00"+metric].MetricValue, options.Thresholds[metric], options.MatchMode, options.RequiredRatio)
			row.Metrics[metric] = summary
			row.Pass = row.Pass && summary.Pass && !summary.NoData
		}
		if row.Pass {
			matched++
		}
		rows = append(rows, row)
		report(domain.Progress{Phase: "evaluating", Completed: index + 1, Total: len(vms), Message: "正在计算筛选结果"})
	}
	sortRows(rows, options.SortBy, options.SortDirection)
	return domain.QueryResult{StartedAt: started, FinishedAt: time.Now(), Scanned: len(vms), Matched: matched, Rows: rows}, nil
}

func makeRequests(vms []domain.VM, options domain.QueryOptions) []domain.HistoryRequest {
	requests := make([]domain.HistoryRequest, 0, len(vms)*len(options.Metrics))
	for _, vm := range vms {
		for _, metric := range options.Metrics {
			requests = append(requests, domain.HistoryRequest{URN: vm.URN, MetricID: metric, StartTime: strconv.FormatInt(options.Start.Unix(), 10), EndTime: strconv.FormatInt(options.End.Unix(), 10), Interval: strconv.Itoa(options.IntervalSeconds), StatisticMethod: "average"})
		}
	}
	return requests
}

func summarise(points []domain.MetricPoint, threshold float64, matchMode string, requiredRatio float64) domain.MetricSummary {
	values := make([]float64, 0, len(points))
	for _, point := range points {
		value, err := strconv.ParseFloat(point.Value, 64)
		if err == nil && !math.IsNaN(value) && !math.IsInf(value, 0) {
			values = append(values, value)
		}
	}
	if len(values) == 0 {
		return domain.MetricSummary{NoData: true}
	}
	var total, maximum float64
	low := 0
	for _, value := range values {
		total += value
		if value > maximum {
			maximum = value
		}
		if value <= threshold {
			low++
		}
	}
	ratio := float64(low) / float64(len(values)) * 100
	pass := maximum <= threshold
	if matchMode == "ratio" {
		pass = ratio >= requiredRatio
	}
	return domain.MetricSummary{SampleCount: len(values), Average: total / float64(len(values)), Maximum: maximum, LowRatio: ratio, Pass: pass}
}

func validateOptions(options domain.QueryOptions) error {
	if !options.End.After(options.Start) {
		return fmt.Errorf("结束时间必须晚于开始时间")
	}
	if options.End.Sub(options.Start) > 366*24*time.Hour {
		return fmt.Errorf("单次查询时间范围不能超过 366 天")
	}
	if len(options.Metrics) == 0 {
		return fmt.Errorf("至少选择一个指标")
	}
	if options.BatchSize < 1 || options.BatchSize > 100 {
		return fmt.Errorf("每批虚拟机数量必须在 1 到 100 之间")
	}
	if options.MatchMode != "all" && options.MatchMode != "ratio" {
		return fmt.Errorf("筛选规则无效")
	}
	if options.RequiredRatio < 0 || options.RequiredRatio > 100 {
		return fmt.Errorf("低负载比例必须介于 0 到 100")
	}
	validIntervals := map[int]bool{60: true, 300: true, 1800: true, 3600: true, 86400: true, 604800: true, 2592000: true, 31536000: true}
	if !validIntervals[options.IntervalSeconds] {
		return fmt.Errorf("时间粒度不受支持")
	}
	for _, metric := range options.Metrics {
		threshold, ok := options.Thresholds[metric]
		if !ok || threshold < 0 || threshold > 100 {
			return fmt.Errorf("%s 的阈值必须介于 0 到 100", metric)
		}
	}
	if options.SortBy != "" && !validSortBy(options.SortBy) {
		return fmt.Errorf("排序列无效")
	}
	if options.SortDirection != "" && options.SortDirection != "asc" && options.SortDirection != "desc" {
		return fmt.Errorf("排序方向无效")
	}
	return nil
}

func sortRows(rows []domain.ResultRow, sortBy, direction string) {
	if !validSortBy(sortBy) {
		sortBy = "ip"
	}
	if direction != "desc" {
		direction = "asc"
	}
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Pass != rows[j].Pass {
			return rows[i].Pass
		}
		comparison := compareRows(rows[i], rows[j], sortBy)
		if comparison == 0 {
			comparison = compareIP(rows[i].IP, rows[j].IP)
		}
		if comparison == 0 {
			comparison = strings.Compare(rows[i].URN, rows[j].URN)
		}
		if direction == "desc" {
			return comparison > 0
		}
		return comparison < 0
	})
}

func validSortBy(sortBy string) bool {
	switch sortBy {
	case "", "ip", "name", "description", "cluster", "host", "cpu_max", "cpu_avg", "memory_max", "memory_avg", "disk_max", "disk_avg":
		return true
	default:
		return false
	}
}

func compareRows(left, right domain.ResultRow, sortBy string) int {
	switch sortBy {
	case "name":
		return strings.Compare(left.Name, right.Name)
	case "description":
		return strings.Compare(descriptionParts(left.Description).Purpose, descriptionParts(right.Description).Purpose)
	case "cluster":
		return strings.Compare(left.ClusterName, right.ClusterName)
	case "host":
		return strings.Compare(left.HostName, right.HostName)
	case "cpu_max":
		return compareMetric(left.Metrics[domain.MetricCPU], right.Metrics[domain.MetricCPU], true)
	case "cpu_avg":
		return compareMetric(left.Metrics[domain.MetricCPU], right.Metrics[domain.MetricCPU], false)
	case "memory_max":
		return compareMetric(left.Metrics[domain.MetricMemory], right.Metrics[domain.MetricMemory], true)
	case "memory_avg":
		return compareMetric(left.Metrics[domain.MetricMemory], right.Metrics[domain.MetricMemory], false)
	case "disk_max":
		return compareMetric(left.Metrics[domain.MetricDisk], right.Metrics[domain.MetricDisk], true)
	case "disk_avg":
		return compareMetric(left.Metrics[domain.MetricDisk], right.Metrics[domain.MetricDisk], false)
	default:
		return compareIP(left.IP, right.IP)
	}
}

type descriptionFields struct {
	Purpose string
	Manager string
	Term    string
}

func descriptionParts(description string) descriptionFields {
	parts := strings.Split(strings.NewReplacer("－", "-", "—", "-", "–", "-").Replace(description), "-")
	if len(parts) < 3 {
		return descriptionFields{Purpose: description}
	}
	return descriptionFields{
		Purpose: strings.Join(parts[:len(parts)-2], "-"),
		Manager: strings.TrimSpace(parts[len(parts)-2]),
		Term:    strings.TrimSpace(parts[len(parts)-1]),
	}
}

func compareMetric(left, right domain.MetricSummary, maximum bool) int {
	if left.NoData != right.NoData {
		if left.NoData {
			return 1
		}
		return -1
	}
	leftValue, rightValue := left.Average, right.Average
	if maximum {
		leftValue, rightValue = left.Maximum, right.Maximum
	}
	return compareFloat(leftValue, rightValue)
}

func compareIP(left, right string) int {
	leftIP, leftErr := netip.ParseAddr(strings.TrimSpace(left))
	rightIP, rightErr := netip.ParseAddr(strings.TrimSpace(right))
	if leftErr == nil && rightErr == nil {
		return leftIP.Compare(rightIP)
	}
	if leftErr == nil {
		return -1
	}
	if rightErr == nil {
		return 1
	}
	return strings.Compare(left, right)
}

func compareFloat(left, right float64) int {
	if left < right {
		return -1
	}
	if left > right {
		return 1
	}
	return 0
}

type vmBatch struct {
	SiteURL string
	VMs     []domain.VM
}

func chunkVMsBySite(vms []domain.VM, size int) []vmBatch {
	bySite := make(map[string][]domain.VM)
	siteOrder := make([]string, 0)
	for _, vm := range vms {
		if _, exists := bySite[vm.SiteURL]; !exists {
			siteOrder = append(siteOrder, vm.SiteURL)
		}
		bySite[vm.SiteURL] = append(bySite[vm.SiteURL], vm)
	}
	batches := make([]vmBatch, 0, (len(vms)+size-1)/size)
	for _, siteURL := range siteOrder {
		siteVMs := bySite[siteURL]
		for start := 0; start < len(siteVMs); start += size {
			end := start + size
			if end > len(siteVMs) {
				end = len(siteVMs)
			}
			batches = append(batches, vmBatch{SiteURL: siteURL, VMs: siteVMs[start:end]})
		}
	}
	return batches
}
