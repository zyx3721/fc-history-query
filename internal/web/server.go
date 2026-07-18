package web

import (
	"context"
	"crypto/rand"
	"embed"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io/fs"
	"net/http"
	"strings"
	"sync"
	"time"

	"fc-history-query/internal/domain"
	"fc-history-query/internal/fusion"
	"fc-history-query/internal/query"
)

//go:embed static/*
var assets embed.FS

type Server struct {
	mux  *http.ServeMux
	jobs *jobStore
}

func NewServer() *Server {
	server := &Server{mux: http.NewServeMux(), jobs: newJobStore()}
	server.mux.HandleFunc("/api/queries", server.handleQueries)
	server.mux.HandleFunc("/api/queries/", server.handleQuery)
	static, _ := fs.Sub(assets, "static")
	server.mux.Handle("/", http.FileServer(http.FS(static)))
	return server
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Referrer-Policy", "no-referrer")
	s.mux.ServeHTTP(w, r)
}

func (s *Server) handleQueries(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "仅支持 POST 请求")
		return
	}
	defer r.Body.Close()
	var input apiQueryRequest
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 64<<10))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "请求格式无效: "+err.Error())
		return
	}
	connection := input.connection()
	client, err := fusion.NewClient(connection)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	options, err := input.options()
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	job := s.jobs.create()
	go s.runQuery(job, client, options)
	writeJSON(w, http.StatusAccepted, job.snapshot())
}

func (s *Server) handleQuery(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/queries/")
	if id == "" || strings.Contains(id, "/") {
		writeError(w, http.StatusNotFound, "查询任务不存在")
		return
	}
	job, ok := s.jobs.get(id)
	if !ok {
		writeError(w, http.StatusNotFound, "查询任务不存在或已过期")
		return
	}
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, job.snapshot())
	case http.MethodDelete:
		job.cancel()
		writeJSON(w, http.StatusOK, job.snapshot())
	default:
		writeError(w, http.StatusMethodNotAllowed, "不支持的请求方法")
	}
}

func (s *Server) runQuery(job *job, client *fusion.Client, options domain.QueryOptions) {
	defer client.ClearCredentials()
	job.updateProgress(domain.Progress{Phase: "authenticating", Message: "正在登录并获取站点信息"})
	if err := client.Prepare(job.context); err != nil {
		job.finish(domain.QueryResult{}, err)
		s.jobs.expireLater(job.id)
		return
	}
	service := query.Service{Source: client, RequestDelay: 250 * time.Millisecond}
	result, err := service.Execute(job.context, options, job.updateProgress)
	job.finish(result, err)
	s.jobs.expireLater(job.id)
}

type apiQueryRequest struct {
	BaseURL         string             `json:"baseUrl"`
	Username        string             `json:"username"`
	Password        string             `json:"password"`
	UserType        string             `json:"userType"`
	Start           time.Time          `json:"start"`
	End             time.Time          `json:"end"`
	IntervalSeconds int                `json:"intervalSeconds"`
	Metrics         []string           `json:"metrics"`
	Thresholds      map[string]float64 `json:"thresholds"`
	MatchMode       string             `json:"matchMode"`
	RequiredRatio   float64            `json:"requiredRatio"`
	BatchSize       int                `json:"batchSize"`
	SortBy          string             `json:"sortBy"`
	SortDirection   string             `json:"sortDirection"`
}

func (r apiQueryRequest) connection() domain.Connection {
	return domain.Connection{BaseURL: r.BaseURL, Username: r.Username, Password: r.Password, UserType: r.UserType, InsecureSkipVerify: true}
}

func (r apiQueryRequest) options() (domain.QueryOptions, error) {
	return domain.QueryOptions{Start: r.Start, End: r.End, IntervalSeconds: r.IntervalSeconds, Metrics: r.Metrics, Thresholds: r.Thresholds, MatchMode: r.MatchMode, RequiredRatio: r.RequiredRatio, BatchSize: r.BatchSize, SortBy: r.SortBy, SortDirection: r.SortDirection}, nil
}

type jobStore struct {
	mu   sync.RWMutex
	jobs map[string]*job
}

func newJobStore() *jobStore { return &jobStore{jobs: make(map[string]*job)} }

func (s *jobStore) create() *job {
	id := newID()
	ctx, cancel := context.WithCancel(context.Background())
	job := &job{id: id, context: ctx, cancelFunc: cancel, status: "running", startedAt: time.Now(), progress: domain.Progress{Phase: "queued", Message: "查询任务已创建"}}
	s.mu.Lock()
	s.jobs[id] = job
	s.mu.Unlock()
	return job
}

func (s *jobStore) get(id string) (*job, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	job, ok := s.jobs[id]
	return job, ok
}

func (s *jobStore) expireLater(id string) {
	time.AfterFunc(15*time.Minute, func() { s.mu.Lock(); delete(s.jobs, id); s.mu.Unlock() })
}

type job struct {
	id         string
	context    context.Context
	cancelFunc context.CancelFunc
	mu         sync.RWMutex
	status     string
	startedAt  time.Time
	progress   domain.Progress
	result     *domain.QueryResult
	errorText  string
}

func (j *job) updateProgress(progress domain.Progress) {
	j.mu.Lock()
	j.progress = progress
	j.mu.Unlock()
}
func (j *job) cancel() {
	j.cancelFunc()
	j.mu.Lock()
	if j.status == "running" {
		j.status = "cancelling"
	}
	j.mu.Unlock()
}
func (j *job) finish(result domain.QueryResult, err error) {
	j.mu.Lock()
	defer j.mu.Unlock()
	if err != nil {
		if errors.Is(err, context.Canceled) {
			j.status = "cancelled"
			j.errorText = "查询已取消"
		} else {
			j.status = "failed"
			j.errorText = err.Error()
		}
		return
	}
	j.status = "completed"
	j.progress = domain.Progress{Phase: "completed", Completed: j.progress.Total, Total: j.progress.Total, Message: "查询完成"}
	j.result = &result
}

func (j *job) snapshot() jobResponse {
	j.mu.RLock()
	defer j.mu.RUnlock()
	return jobResponse{ID: j.id, Status: j.status, StartedAt: j.startedAt, Progress: j.progress, Result: j.result, Error: j.errorText}
}

type jobResponse struct {
	ID        string              `json:"id"`
	Status    string              `json:"status"`
	StartedAt time.Time           `json:"startedAt"`
	Progress  domain.Progress     `json:"progress"`
	Result    *domain.QueryResult `json:"result,omitempty"`
	Error     string              `json:"error,omitempty"`
}

func newID() string {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}
	return hex.EncodeToString(bytes)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
