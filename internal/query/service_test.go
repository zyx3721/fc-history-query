package query

import (
	"strings"
	"testing"
	"time"

	"fc-history-query/internal/domain"
)

func TestValidateOptionsQueryRangeMustExceedInterval(t *testing.T) {
	start := time.Date(2026, time.July, 1, 0, 0, 0, 0, time.UTC)
	tests := []struct {
		name     string
		interval int
		duration time.Duration
		wantErr  string
	}{
		{
			name:     "range equals interval",
			interval: 86400,
			duration: 24 * time.Hour,
			wantErr:  "查询时间范围必须大于时间粒度",
		},
		{
			name:     "range is shorter than interval",
			interval: 86400,
			duration: 23*time.Hour + 59*time.Minute,
			wantErr:  "查询时间范围必须大于时间粒度",
		},
		{
			name:     "ten minute interval is supported",
			interval: 600,
			duration: 11 * time.Minute,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			options := validQueryOptions(start, start.Add(test.duration), test.interval)
			err := validateOptions(options)
			if test.wantErr == "" && err != nil {
				t.Fatalf("validateOptions() error = %v, want nil", err)
			}
			if test.wantErr != "" && (err == nil || !strings.Contains(err.Error(), test.wantErr)) {
				t.Fatalf("validateOptions() error = %v, want %q", err, test.wantErr)
			}
		})
	}
}

func TestSummariseCapturesEarliestValidSampleTime(t *testing.T) {
	summary := summarise([]domain.MetricPoint{
		{Time: "1780185600", Value: "20"},
		{Time: "invalid", Value: "10"},
		{Time: "1780099200", Value: "invalid"},
		{Time: "1780099200", Value: "5"},
	}, 10, "all", 95)

	if summary.FirstSampleAt == nil {
		t.Fatal("summarise() FirstSampleAt = nil, want earliest valid sample time")
	}
	want := time.Unix(1780099200, 0).UTC()
	if !summary.FirstSampleAt.Equal(want) {
		t.Fatalf("summarise() FirstSampleAt = %s, want %s", summary.FirstSampleAt, want)
	}
	if summary.SampleCount != 3 {
		t.Fatalf("summarise() SampleCount = %d, want 3", summary.SampleCount)
	}
}

func TestSortRowsByFirstSampleAt(t *testing.T) {
	later := time.Unix(1780185600, 0).UTC()
	earlier := time.Unix(1780099200, 0).UTC()
	rows := []domain.ResultRow{
		{URN: "later", IP: "10.0.0.2", Pass: true, FirstSampleAt: &later},
		{URN: "missing", IP: "10.0.0.3", Pass: true},
		{URN: "earlier", IP: "10.0.0.1", Pass: true, FirstSampleAt: &earlier},
	}

	sortRows(rows, "first_sample_at", "asc")
	if got, want := []string{rows[0].URN, rows[1].URN, rows[2].URN}, []string{"earlier", "later", "missing"}; strings.Join(got, ",") != strings.Join(want, ",") {
		t.Fatalf("sortRows() order = %v, want %v", got, want)
	}
}

func validQueryOptions(start, end time.Time, intervalSeconds int) domain.QueryOptions {
	return domain.QueryOptions{
		Start:           start,
		End:             end,
		IntervalSeconds: intervalSeconds,
		Metrics:         []string{domain.MetricCPU},
		Thresholds:      map[string]float64{domain.MetricCPU: 10},
		MatchMode:       "all",
		RequiredRatio:   95,
		BatchSize:       100,
		SortBy:          "ip",
		SortDirection:   "asc",
	}
}
