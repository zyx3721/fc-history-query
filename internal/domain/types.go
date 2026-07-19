package domain

import "time"

const (
	MetricCPU    = "cpu_usage"
	MetricMemory = "mem_usage"
	MetricDisk   = "disk_usage"
)

type Connection struct {
	BaseURL            string
	Username           string
	Password           string
	UserType           string
	InsecureSkipVerify bool
}

type VM struct {
	URN         string
	SiteURL     string `json:"-"`
	Name        string
	Description string
	IP          string
	ClusterName string
	HostName    string
	Status      string
}

type HistoryRequest struct {
	URN             string `json:"urn"`
	MetricID        string `json:"metricId"`
	StartTime       string `json:"startTime"`
	EndTime         string `json:"endTime"`
	Interval        string `json:"interval"`
	StatisticMethod string `json:"statisticMethod,omitempty"`
}

type MetricPoint struct {
	Time  string `json:"time"`
	Value string `json:"value"`
}

type HistoryItem struct {
	URN         string        `json:"urn"`
	ObjectName  string        `json:"objectName"`
	MetricID    string        `json:"metricId"`
	MetricName  string        `json:"metricName"`
	Unit        string        `json:"unit"`
	MetricValue []MetricPoint `json:"metricValue"`
}

type QueryOptions struct {
	Start           time.Time
	End             time.Time
	IntervalSeconds int
	Metrics         []string
	Thresholds      map[string]float64
	MatchMode       string
	RequiredRatio   float64
	BatchSize       int
	SortBy          string
	SortDirection   string
}

type MetricSummary struct {
	SampleCount   int        `json:"sampleCount"`
	Average       float64    `json:"average"`
	Maximum       float64    `json:"maximum"`
	LowRatio      float64    `json:"lowRatio"`
	Pass          bool       `json:"pass"`
	NoData        bool       `json:"noData"`
	FirstSampleAt *time.Time `json:"-"`
}

type ResultRow struct {
	URN           string                   `json:"urn"`
	Name          string                   `json:"name"`
	Description   string                   `json:"description"`
	IP            string                   `json:"ip"`
	ClusterName   string                   `json:"clusterName"`
	HostName      string                   `json:"hostName"`
	Metrics       map[string]MetricSummary `json:"metrics"`
	FirstSampleAt *time.Time               `json:"firstSampleAt,omitempty"`
	Pass          bool                     `json:"pass"`
}

type QueryResult struct {
	StartedAt  time.Time   `json:"startedAt"`
	FinishedAt time.Time   `json:"finishedAt"`
	Scanned    int         `json:"scanned"`
	Matched    int         `json:"matched"`
	Rows       []ResultRow `json:"rows"`
}

type Progress struct {
	Phase     string `json:"phase"`
	Completed int    `json:"completed"`
	Total     int    `json:"total"`
	Message   string `json:"message"`
}
