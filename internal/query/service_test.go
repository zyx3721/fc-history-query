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
