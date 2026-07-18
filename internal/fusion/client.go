package fusion

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"fc-history-query/internal/domain"
)

type Client struct {
	connection domain.Connection
	httpClient *http.Client
	token      string
	siteURLs   []string
}

func NewClient(connection domain.Connection) (*Client, error) {
	if err := validateURL(connection.BaseURL); err != nil {
		return nil, fmt.Errorf("私有云平台地址无效: %w", err)
	}
	if strings.TrimSpace(connection.Username) == "" || connection.Password == "" {
		return nil, fmt.Errorf("用户名和密码不能为空")
	}
	if connection.UserType != "0" && connection.UserType != "1" {
		return nil, fmt.Errorf("账号类型无效")
	}

	transport := http.DefaultTransport.(*http.Transport).Clone()
	transport.TLSClientConfig = &tls.Config{InsecureSkipVerify: connection.InsecureSkipVerify} // #nosec G402 -- explicit operator choice for self-signed VRM certificates.
	return &Client{
		connection: connection,
		httpClient: &http.Client{Transport: transport, Timeout: 45 * time.Second},
	}, nil
}

func (c *Client) Prepare(ctx context.Context) error {
	if err := c.authenticate(ctx); err != nil {
		return err
	}
	if err := c.resolveSites(ctx); err != nil {
		return err
	}
	return nil
}

func (c *Client) ClearCredentials() {
	c.connection.Password = ""
	c.connection.Username = ""
	c.token = ""
}

func (c *Client) ListRunningVMs(ctx context.Context) ([]domain.VM, error) {
	const pageSize = 100
	var vms []domain.VM
	for _, siteURL := range c.siteURLs {
		siteVMs, err := c.listRunningVMsAtSite(ctx, siteURL, pageSize)
		if err != nil {
			return nil, err
		}
		vms = append(vms, siteVMs...)
	}
	return vms, nil
}

func (c *Client) listRunningVMsAtSite(ctx context.Context, siteURL string, pageSize int) ([]domain.VM, error) {
	var vms []domain.VM
	for offset := 0; ; offset += pageSize {
		endpoint := fmt.Sprintf("%s/vms?limit=%d&offset=%d&status=running&detail=1", trimURL(siteURL), pageSize, offset)
		var page vmListResponse
		if err := c.doJSON(ctx, http.MethodGet, endpoint, nil, &page); err != nil {
			return nil, fmt.Errorf("获取虚拟机列表失败: %w", err)
		}
		for _, item := range page.VMs {
			vms = append(vms, domain.VM{URN: item.URN, SiteURL: siteURL, Name: item.Name, Description: item.Description, IP: firstIP(item.VMConfig.Nics), ClusterName: item.ClusterName, HostName: item.HostName, Status: item.Status})
		}
		if len(page.VMs) < pageSize || len(vms) >= page.Total {
			return vms, nil
		}
	}
}

func (c *Client) History(ctx context.Context, siteURL string, requests []domain.HistoryRequest) ([]domain.HistoryItem, error) {
	endpoint, err := historyEndpoint(siteURL)
	if err != nil {
		return nil, err
	}
	var response struct {
		Result string               `json:"result"`
		Items  []domain.HistoryItem `json:"items"`
	}
	if err := c.doJSON(ctx, http.MethodPost, endpoint, requests, &response); err != nil {
		return nil, fmt.Errorf("查询历史指标失败: %w", err)
	}
	return response.Items, nil
}

func (c *Client) doJSON(ctx context.Context, method, endpoint string, body any, destination any) error {
	var reader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("编码请求参数失败: %w", err)
		}
		reader = bytes.NewReader(data)
	}
	req, err := http.NewRequestWithContext(ctx, method, endpoint, reader)
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/json;charset=UTF-8")
	req.Header.Set("Accept-Language", "zh_CN")
	req.Header.Set("X-Auth-Token", c.token)
	if body != nil {
		req.Header.Set("Content-Type", "application/json; charset=UTF-8")
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		message, _ := io.ReadAll(io.LimitReader(resp.Body, 4<<10))
		return fmt.Errorf("VRM 返回 HTTP %d: %s", resp.StatusCode, strings.TrimSpace(string(message)))
	}
	if err := json.NewDecoder(resp.Body).Decode(destination); err != nil {
		return fmt.Errorf("解析 VRM 响应失败: %w", err)
	}
	return nil
}

func (c *Client) authenticate(ctx context.Context) error {
	authKey := c.connection.Password
	algorithm := "1"
	if c.connection.UserType == "0" {
		passwordHash := sha256.Sum256([]byte(c.connection.Password))
		authKey = hex.EncodeToString(passwordHash[:])
		algorithm = "0"
	}
	c.connection.Password = ""
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, trimURL(c.connection.BaseURL)+"/service/session", nil)
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/json;charset=UTF-8")
	req.Header.Set("Content-Type", "application/json;charset=UTF-8")
	req.Header.Set("Accept-Language", "zh_CN")
	req.Header.Set("X-Auth-User", c.connection.Username)
	req.Header.Set("X-Auth-Key", authKey)
	req.Header.Set("X-Auth-UserType", c.connection.UserType)
	req.Header.Set("X-Auth-AuthType", "0")
	req.Header.Set("X-ENCRIPT-ALGORITHM", algorithm)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("登录私有云平台失败: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		message, _ := io.ReadAll(io.LimitReader(resp.Body, 4<<10))
		return fmt.Errorf("登录失败，VRM 返回 HTTP %d: %s", resp.StatusCode, strings.TrimSpace(string(message)))
	}
	c.token = resp.Header.Get("X-Auth-Token")
	if c.token == "" {
		return fmt.Errorf("登录响应中未返回 X-Auth-Token")
	}
	return nil
}

func (c *Client) resolveSites(ctx context.Context) error {
	var response struct {
		Sites []site `json:"sites"`
	}
	if err := c.doJSON(ctx, http.MethodGet, trimURL(c.connection.BaseURL)+"/service/sites", nil, &response); err != nil {
		return fmt.Errorf("查询站点列表失败: %w", err)
	}
	if len(response.Sites) == 0 {
		return fmt.Errorf("当前账号未查询到可访问站点")
	}
	seen := make(map[string]struct{}, len(response.Sites))
	for _, item := range response.Sites {
		if item.URI == "" {
			continue
		}
		resolved := resolveURL(c.connection.BaseURL, item.URI)
		if _, exists := seen[resolved]; !exists {
			seen[resolved] = struct{}{}
			c.siteURLs = append(c.siteURLs, resolved)
		}
	}
	if len(c.siteURLs) == 0 {
		return fmt.Errorf("站点响应未包含有效 URI")
	}
	return nil
}

func validateURL(raw string) error {
	parsed, err := url.ParseRequestURI(strings.TrimSpace(raw))
	if err != nil || parsed.Host == "" || (parsed.Scheme != "https" && parsed.Scheme != "http") {
		return fmt.Errorf("必须是完整的 http 或 https URL")
	}
	return nil
}

func trimURL(raw string) string { return strings.TrimRight(strings.TrimSpace(raw), "/") }

func resolveURL(baseURL, uri string) string {
	if parsed, err := url.Parse(uri); err == nil && parsed.IsAbs() {
		return uri
	}
	return trimURL(baseURL) + "/" + strings.TrimLeft(uri, "/")
}

func historyEndpoint(siteURL string) (string, error) {
	parsed, err := url.Parse(siteURL)
	if err != nil {
		return "", fmt.Errorf("站点地址无效: %w", err)
	}
	pathParts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	if len(pathParts) == 0 || pathParts[len(pathParts)-1] == "" {
		return "", fmt.Errorf("站点地址未包含站点 ID")
	}
	return trimURL(siteURL) + "/monitors/objectmetric-curvedata?siteID=" + url.QueryEscape(pathParts[len(pathParts)-1]), nil
}

func firstIP(nics []nic) string {
	for _, item := range nics {
		if item.IP != "" {
			return item.IP
		}
	}
	return ""
}

type vmListResponse struct {
	Total int  `json:"total"`
	VMs   []vm `json:"vms"`
}

type vm struct {
	URN         string `json:"urn"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
	ClusterName string `json:"clusterName"`
	HostName    string `json:"hostName"`
	VMConfig    struct {
		Nics []nic `json:"nics"`
	} `json:"vmConfig"`
}

type nic struct {
	IP string `json:"ip"`
}

type site struct {
	URI string `json:"uri"`
}
