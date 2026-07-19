const $ = (selector) => document.querySelector(selector);

const translations = {
  zh: {
    documentTitle: "FusionCompute 历史低负载查询",
    appName: "历史低负载查询",
    appSubtitle: "FusionCompute 资源洞察",
    pageSettings: "页面设置",
    switchToEnglish: "切换到英文",
    switchToChinese: "切换到中文",
    switchToLight: "切换到浅色主题",
    switchToDark: "切换到深色主题",
    lightTheme: "浅色",
    darkTheme: "深色",
    connectionTitle: "VRM 连接",
    baseUrl: "私有云平台地址",
    username: "用户名",
    accountType: "账号类型",
    localUser: "本地用户",
    domainUser: "域用户",
    password: "密码",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    filterTitle: "筛选条件",
    queryStart: "查询开始",
    queryEnd: "查询结束",
    interval: "时间粒度",
    oneMinute: "1 分钟",
    fiveMinutes: "5 分钟",
    tenMinutes: "10 分钟",
    thirtyMinutes: "30 分钟",
    oneHour: "1 小时",
    oneDay: "1 天",
    thirtyDays: "30 天",
    batchSize: "每批虚拟机",
    tenVMs: "10 台",
    twentyVMs: "20 台",
    thirtyVMs: "30 台",
    fiftyVMs: "50 台",
    hundredVMs: "100 台",
    metricGroup: "监控指标与阈值",
    cpuUsage: "CPU 占用率",
    memoryUsage: "内存占用率",
    diskUsage: "磁盘占用率",
    matchRule: "判定规则",
    allSamples: "所有采样点均低于阈值",
    sampleRatio: "低于阈值的采样点比例",
    minimumRatio: "最低比例",
    sortBy: "同结论内排序",
    sortDirection: "排序方向",
    sortIP: "IP 地址",
    sortName: "虚拟机名称",
    sortDescription: "用途",
    sortCluster: "集群",
    sortHost: "主机",
    sortCPUMax: "CPU 最大值",
    sortCPUAvg: "CPU 平均值",
    sortMemoryMax: "内存最大值",
    sortMemoryAvg: "内存平均值",
    sortDiskMax: "磁盘最大值",
    sortDiskAvg: "磁盘平均值",
    ascending: "升序",
    descending: "降序",
    queryActions: "查询操作",
    runQuery: "执行历史查询",
    running: "查询执行中...",
    cancelQuery: "取消查询",
    exportExcel: "导出 Excel",
    resultsTitle: "查询结果",
    notQueried: "尚未执行查询",
    resultFilters: "查询结果筛选",
    resultMetricFilters: "资源指标筛选",
    searchAll: "搜索全部内容",
    searchAllPlaceholder: "输入虚拟机、IP、用途等内容",
    filterConclusion: "结论",
    filterManager: "管理人",
    filterCluster: "集群",
    filterHost: "主机",
    allConclusions: "全部结论",
    allManagers: "全部管理人",
    allClusters: "全部集群",
    allHosts: "全部主机",
    resetFilters: "重置筛选",
    filterCPU: "CPU",
    filterMemory: "内存",
    filterDisk: "磁盘",
    maximum: "最大值",
    average: "平均值",
    greaterThan: "超过",
    notGreaterThan: "不超过",
    metricValuePlaceholder: "阈值 %",
    cpuStatistic: "CPU 统计值",
    memoryStatistic: "内存统计值",
    diskStatistic: "磁盘统计值",
    cpuOperator: "CPU 比较条件",
    memoryOperator: "内存比较条件",
    diskOperator: "磁盘比较条件",
    cpuThreshold: "CPU 阈值",
    memoryThreshold: "内存阈值",
    diskThreshold: "磁盘阈值",
    filteredSummary:
      "已扫描 {scanned} 台运行中虚拟机，符合条件 {matched} 台｜当前显示 {visible} 台",
    visibleResults: "当前显示 {visible} / {total} 条结果",
    noFilteredResults: "没有符合当前筛选条件的结果",
    conclusion: "结论",
    virtualMachine: "虚拟机",
    description: "描述",
    purpose: "用途",
    manager: "管理人",
    term: "使用期限",
    clusterHost: "集群 / 主机",
    cpuMaxAvg: "CPU 最大 / 平均",
    memoryMaxAvg: "内存最大 / 平均",
    diskMaxAvg: "磁盘最大 / 平均",
    lowLoadRatio: "低负载比例",
    emptyPrompt: "输入连接信息与筛选条件后执行查询",
    selectMetric: "至少选择一个监控指标",
    queryRangeMustExceedInterval: "查询时间范围必须大于所选时间粒度",
    requestFailed: "请求失败 ({status})",
    querying: "正在查询",
    preparing: "正在准备查询",
    loadingData: "正在从 VRM 获取历史监控数据...",
    queryFailed: "查询失败",
    queryCancelled: "查询已取消",
    cancelDetail: "查询已取消，未生成结果。",
    noRunningVMs: "未发现运行中的虚拟机",
    scannedSummary: "已扫描 {scanned} 台运行中虚拟机，符合条件 {matched} 台",
    pass: "符合",
    fail: "不符合",
    notSelected: "未选择",
    noData: "无数据",
    queued: "查询任务已创建",
    authenticating: "正在登录并获取站点信息",
    discovering: "正在获取运行中的虚拟机",
    queryingHistory: "正在分批查询历史指标",
    evaluating: "正在计算筛选结果",
    completed: "查询完成",
    csvConclusion: "结论",
    csvVm: "虚拟机",
    csvDescription: "描述",
    csvPurpose: "用途",
    csvManager: "管理人",
    csvTerm: "使用期限",
    csvCluster: "集群",
    csvHost: "主机",
    csvCpuMax: "CPU 最大值",
    csvCpuAvg: "CPU 平均值",
    csvMemoryMax: "内存最大值",
    csvMemoryAvg: "内存平均值",
    csvDiskMax: "磁盘最大值",
    csvDiskAvg: "磁盘平均值",
    exportSummary:
      "导出时间：{time}｜已扫描 {scanned} 台｜符合 {matched} 台｜实际导出 {exported} 台",
  },
  en: {
    documentTitle: "FusionCompute Historical Low-Load Query",
    appName: "Historical Low-Load Query",
    appSubtitle: "FusionCompute Resource Insights",
    pageSettings: "Page settings",
    switchToEnglish: "Switch to English",
    switchToChinese: "Switch to Chinese",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    connectionTitle: "VRM Connection",
    baseUrl: "Private cloud platform URL",
    username: "Username",
    accountType: "Account type",
    localUser: "Local user",
    domainUser: "Domain user",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    filterTitle: "Filter Conditions",
    queryStart: "Start time",
    queryEnd: "End time",
    interval: "Interval",
    oneMinute: "1 minute",
    fiveMinutes: "5 minutes",
    tenMinutes: "10 minutes",
    thirtyMinutes: "30 minutes",
    oneHour: "1 hour",
    oneDay: "1 day",
    thirtyDays: "30 days",
    batchSize: "VMs per batch",
    tenVMs: "10 VMs",
    twentyVMs: "20 VMs",
    thirtyVMs: "30 VMs",
    fiftyVMs: "50 VMs",
    hundredVMs: "100 VMs",
    metricGroup: "Monitoring metrics and thresholds",
    cpuUsage: "CPU usage",
    memoryUsage: "Memory usage",
    diskUsage: "Disk usage",
    matchRule: "Match rule",
    allSamples: "All samples are below threshold",
    sampleRatio: "Ratio of samples below threshold",
    minimumRatio: "Minimum ratio",
    sortBy: "Sort within result",
    sortDirection: "Sort direction",
    sortIP: "IP address",
    sortName: "Virtual machine name",
    sortDescription: "Purpose",
    sortCluster: "Cluster",
    sortHost: "Host",
    sortCPUMax: "CPU maximum",
    sortCPUAvg: "CPU average",
    sortMemoryMax: "Memory maximum",
    sortMemoryAvg: "Memory average",
    sortDiskMax: "Disk maximum",
    sortDiskAvg: "Disk average",
    ascending: "Ascending",
    descending: "Descending",
    queryActions: "Query actions",
    runQuery: "Run Historical Query",
    running: "Query running...",
    cancelQuery: "Cancel",
    exportExcel: "Export Excel",
    resultsTitle: "Query Results",
    notQueried: "No query run yet",
    resultFilters: "Query result filters",
    resultMetricFilters: "Resource metric filters",
    searchAll: "Search all content",
    searchAllPlaceholder: "Search VM, IP, purpose, and more",
    filterConclusion: "Result",
    filterManager: "Manager",
    filterCluster: "Cluster",
    filterHost: "Host",
    allConclusions: "All results",
    allManagers: "All managers",
    allClusters: "All clusters",
    allHosts: "All hosts",
    resetFilters: "Reset filters",
    filterCPU: "CPU",
    filterMemory: "Memory",
    filterDisk: "Disk",
    maximum: "Maximum",
    average: "Average",
    greaterThan: "Greater than",
    notGreaterThan: "At most",
    metricValuePlaceholder: "Threshold %",
    cpuStatistic: "CPU statistic",
    memoryStatistic: "Memory statistic",
    diskStatistic: "Disk statistic",
    cpuOperator: "CPU comparison",
    memoryOperator: "Memory comparison",
    diskOperator: "Disk comparison",
    cpuThreshold: "CPU threshold",
    memoryThreshold: "Memory threshold",
    diskThreshold: "Disk threshold",
    filteredSummary:
      "Scanned {scanned} running VMs; {matched} matched | showing {visible}",
    visibleResults: "Showing {visible} / {total} results",
    noFilteredResults: "No results match the current filters",
    conclusion: "Result",
    virtualMachine: "Virtual machine",
    description: "Description",
    purpose: "Purpose",
    manager: "Manager",
    term: "Term",
    clusterHost: "Cluster / Host",
    cpuMaxAvg: "CPU max / avg",
    memoryMaxAvg: "Memory max / avg",
    diskMaxAvg: "Disk max / avg",
    lowLoadRatio: "Low-load ratio",
    emptyPrompt: "Enter connection details and filters to run a query",
    selectMetric: "Select at least one monitoring metric",
    queryRangeMustExceedInterval:
      "The query time range must be greater than the selected interval",
    requestFailed: "Request failed ({status})",
    querying: "Querying",
    preparing: "Preparing query",
    loadingData: "Loading historical monitoring data from VRM...",
    queryFailed: "Query failed",
    queryCancelled: "Query cancelled",
    cancelDetail: "The query was cancelled and no result was generated.",
    noRunningVMs: "No running virtual machines found",
    scannedSummary: "Scanned {scanned} running VMs; {matched} matched",
    pass: "Match",
    fail: "No match",
    notSelected: "Not selected",
    noData: "No data",
    queued: "Query job created",
    authenticating: "Signing in and loading site information",
    discovering: "Finding running virtual machines",
    queryingHistory: "Querying historical metrics in batches",
    evaluating: "Evaluating filter results",
    completed: "Query complete",
    csvConclusion: "Result",
    csvVm: "Virtual machine",
    csvDescription: "Description",
    csvPurpose: "Purpose",
    csvManager: "Manager",
    csvTerm: "Term",
    csvCluster: "Cluster",
    csvHost: "Host",
    csvCpuMax: "CPU maximum",
    csvCpuAvg: "CPU average",
    csvMemoryMax: "Memory maximum",
    csvMemoryAvg: "Memory average",
    csvDiskMax: "Disk maximum",
    csvDiskAvg: "Disk average",
    exportSummary:
      "Exported: {time} | Scanned {scanned} | Matched {matched} | Rows exported {exported}",
  },
};

const phaseTranslation = {
  queued: "queued",
  authenticating: "authenticating",
  discovering: "discovering",
  querying: "queryingHistory",
  evaluating: "evaluating",
  completed: "completed",
};

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} preference`, error);
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Unable to save ${key} preference`, error);
  }
}

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
const storedLocale = readPreference("fc-history-locale", "zh");
const storedTheme = readPreference("fc-history-theme", preferredTheme);
const state = {
  jobId: null,
  poller: null,
  result: null,
  currentJob: null,
  terminal: null,
  locale: storedLocale === "en" ? "en" : "zh",
  theme: storedTheme === "dark" ? "dark" : "light",
  running: false,
};

function t(key, values = {}) {
  const template =
    translations[state.locale][key] || translations.zh[key] || key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function renderThemeControl() {
  const switchToLight = state.theme === "dark";
  $("#themeIcon").src =
    state.theme === "dark" ? "/theme-icon-dark.png" : "/theme-icon-light.png";
  $("#themeToggle").setAttribute(
    "aria-label",
    t(switchToLight ? "switchToLight" : "switchToDark"),
  );
}

function renderPasswordToggle() {
  const visible = $("#password").type === "text";
  $("#passwordIcon").src = visible
    ? "/password-hide.svg"
    : "/password-show.svg";
  $("#passwordToggle").setAttribute(
    "aria-label",
    t(visible ? "hidePassword" : "showPassword"),
  );
  $("#passwordToggle").setAttribute("aria-pressed", String(visible));
}

function togglePasswordVisibility() {
  const password = $("#password");
  password.type = password.type === "password" ? "text" : "password";
  renderPasswordToggle();
  password.focus();
}

function closeSelectControls(except) {
  document.querySelectorAll(".select-control.is-open").forEach((control) => {
    if (control !== except) control.classList.remove("is-open");
  });
}

function setupSelectControls() {
  document.querySelectorAll(".select-control").forEach((control) => {
    const select = control.querySelector("select");
    select.addEventListener("pointerdown", () => {
      const willOpen = !control.classList.contains("is-open");
      closeSelectControls(control);
      control.classList.toggle("is-open", willOpen);
    });
    select.addEventListener("change", () =>
      control.classList.remove("is-open"),
    );
    select.addEventListener("blur", () => control.classList.remove("is-open"));
    select.addEventListener("keydown", (event) => {
      if (event.key === "Escape") control.classList.remove("is-open");
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        closeSelectControls(control);
        control.classList.add("is-open");
      }
    });
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".select-control")) closeSelectControls();
  });
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  savePreference("fc-history-theme", theme);
  renderThemeControl();
}

function applyLocale(locale) {
  state.locale = locale;
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  document.title = t("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  $("#languageToggle").textContent = locale === "zh" ? "EN" : "中";
  $("#languageToggle").setAttribute(
    "aria-label",
    t(locale === "zh" ? "switchToEnglish" : "switchToChinese"),
  );
  savePreference("fc-history-locale", locale);
  renderThemeControl();
  renderPasswordToggle();
  setRunning(state.running);
  if (state.currentJob) renderJob(state.currentJob);
  if (state.result) renderResults(state.result);
  else if (state.terminal) renderTerminalState();
}

function toLocalInputValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function setDefaultDates() {
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  $("#start").value = toLocalInputValue(start);
  $("#end").value = toLocalInputValue(end);
}

function hasValidQueryRange() {
  const start = new Date($("#start").value);
  const end = new Date($("#end").value);
  const intervalMilliseconds = Number($("#intervalSeconds").value) * 1000;
  return (
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    end.getTime() - start.getTime() > intervalMilliseconds
  );
}

function selectedMetrics() {
  return [...document.querySelectorAll(".metric-enabled:checked")].map(
    (item) => item.value,
  );
}

function payload() {
  const thresholds = {};
  document.querySelectorAll(".threshold").forEach((input) => {
    thresholds[input.dataset.metric] = Number(input.value);
  });
  return {
    baseUrl: $("#baseUrl").value.trim(),
    username: $("#username").value.trim(),
    userType: $("#userType").value,
    password: $("#password").value,
    start: new Date($("#start").value).toISOString(),
    end: new Date($("#end").value).toISOString(),
    intervalSeconds: Number($("#intervalSeconds").value),
    metrics: selectedMetrics(),
    thresholds,
    matchMode: $("#matchMode").value,
    requiredRatio: Number($("#requiredRatio").value),
    batchSize: Number($("#batchSize").value),
    sortBy: $("#sortBy").value,
    sortDirection: $("#sortDirection").value,
  };
}

async function readJSON(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.error || t("requestFailed", { status: response.status }),
    );
  return data;
}

async function runQuery(event) {
  event.preventDefault();
  if (!$("#queryForm").reportValidity()) return;
  if (!selectedMetrics().length) {
    toast(t("selectMetric"));
    return;
  }
  if (!hasValidQueryRange()) {
    toast(t("queryRangeMustExceedInterval"));
    return;
  }
  clearResults();
  setRunning(true);
  try {
    const response = await fetch("/api/queries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload()),
    });
    const job = await readJSON(response);
    state.jobId = job.id;
    renderJob(job);
    state.poller = window.setInterval(pollJob, 700);
  } catch (error) {
    finishWithError(error.message);
  }
}

async function pollJob() {
  if (!state.jobId) return;
  try {
    const job = await readJSON(await fetch(`/api/queries/${state.jobId}`));
    renderJob(job);
    if (["completed", "failed", "cancelled"].includes(job.status)) {
      window.clearInterval(state.poller);
      state.poller = null;
      state.jobId = null;
      setRunning(false);
      if (job.status === "completed") {
        state.result = job.result;
        state.terminal = null;
        renderResults(job.result);
        $("#exportButton").disabled = false;
      } else if (job.status === "failed")
        finishWithError(job.error || t("queryFailed"));
      else showTerminalState("queryCancelled", "cancelDetail");
    }
  } catch (error) {
    finishWithError(error.message);
  }
}

async function cancelQuery() {
  if (!state.jobId) return;
  try {
    await readJSON(
      await fetch(`/api/queries/${state.jobId}`, { method: "DELETE" }),
    );
    $("#cancelButton").disabled = true;
  } catch (error) {
    toast(error.message);
  }
}

function renderJob(job) {
  state.currentJob = job;
  $("#status").hidden = false;
  const progressKey = phaseTranslation[job.progress.phase];
  $("#statusText").textContent = progressKey
    ? t(progressKey)
    : job.progress.message || t("querying");
  const total = job.progress.total || 0;
  const completed = job.progress.completed || 0;
  $("#statusCount").textContent = total ? `${completed} / ${total}` : "";
  $("#progressFill").style.width = total
    ? `${Math.min(100, (completed / total) * 100)}%`
    : "18%";
}

function setRunning(running) {
  state.running = running;
  $("#runButton").disabled = running;
  $("#runButton").textContent = t(running ? "running" : "runQuery");
  $("#cancelButton").disabled = !running;
  if (!running) $("#status").hidden = true;
}

function finishWithError(message) {
  if (state.poller) window.clearInterval(state.poller);
  state.poller = null;
  state.jobId = null;
  state.currentJob = null;
  setRunning(false);
  showTerminalState("queryFailed", null, message);
  toast(message);
}

function showTerminalState(summaryKey, detailKey, detail = "") {
  state.result = null;
  state.terminal = { summaryKey, detailKey, detail };
  renderTerminalState();
}

function renderTerminalState() {
  if (!state.terminal) return;
  $("#resultSummary").textContent = t(state.terminal.summaryKey);
  const detail = state.terminal.detailKey
    ? t(state.terminal.detailKey)
    : state.terminal.detail;
  $("#resultBody").innerHTML =
    `<tr class="empty"><td colspan="11">${esc(detail)}</td></tr>`;
}

function metricText(metrics, id) {
  const metric = metrics[id];
  if (!metric) return t("notSelected");
  if (metric.noData) return t("noData");
  return `${format(metric.maximum)}% / ${format(metric.average)}%`;
}

function ratioText(metrics) {
  const chosen = selectedMetrics()
    .map((id) => metrics[id])
    .filter(Boolean)
    .filter((item) => !item.noData);
  if (!chosen.length) return t("noData");
  return chosen.map((item) => `${format(item.lowRatio)}%`).join(" / ");
}

function format(value) {
  return Number(value).toLocaleString(
    state.locale === "zh" ? "zh-CN" : "en-US",
    { maximumFractionDigits: 2 },
  );
}

function esc(value) {
  return String(value || "").replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );
}

const resultCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function splitDescription(value) {
  const parts = String(value || "")
    .replaceAll("－", "-")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .split("-");
  if (parts.length < 3) {
    return { purpose: String(value || "-"), manager: "-", term: "-" };
  }
  return {
    purpose: parts.slice(0, -2).join("-").trim() || "-",
    manager: parts[parts.length - 2].trim() || "-",
    term: parts[parts.length - 1].trim() || "-",
  };
}

const resultMetricFilterDefinitions = [
  { metricID: "cpu_usage", prefix: "cpu" },
  { metricID: "mem_usage", prefix: "memory" },
  { metricID: "disk_usage", prefix: "disk" },
];

function updateResultSelectOptions(selector, values, allLabelKey) {
  const select = $(selector);
  const selectedValue = select.value;
  select.replaceChildren(new Option(t(allLabelKey), ""));
  [...new Set(values.map((value) => String(value || "-").trim() || "-"))]
    .sort(resultCollator.compare)
    .forEach((value) => select.add(new Option(value, value)));
  select.value = [...select.options].some(
    (option) => option.value === selectedValue,
  )
    ? selectedValue
    : "";
}

function populateResultFilterOptions(rows) {
  updateResultSelectOptions(
    "#resultManager",
    rows.map((row) => splitDescription(row.description).manager),
    "allManagers",
  );
  updateResultSelectOptions(
    "#resultCluster",
    rows.map((row) => row.clusterName),
    "allClusters",
  );
  updateResultSelectOptions(
    "#resultHost",
    rows.map((row) => row.hostName),
    "allHosts",
  );
}

function metricFilterValue(prefix) {
  const value = $(`#${prefix}FilterValue`).value.trim();
  if (!value) return null;
  const threshold = Number(value);
  if (!Number.isFinite(threshold)) return null;
  return {
    statistic: $(`#${prefix}FilterStatistic`).value,
    operator: $(`#${prefix}FilterOperator`).value,
    threshold,
  };
}

function rowSearchText(row) {
  const description = splitDescription(row.description);
  const metrics = Object.values(row.metrics || {}).flatMap((metric) =>
    metric ? [metric.maximum, metric.average, metric.lowRatio] : [],
  );
  return [
    row.pass ? t("pass") : t("fail"),
    row.name,
    row.urn,
    row.ip,
    row.description,
    description.purpose,
    description.manager,
    description.term,
    row.clusterName,
    row.hostName,
    ...metrics,
  ]
    .join(" ")
    .toLocaleLowerCase();
}

function rowMatchesMetricFilter(row, definition) {
  const filter = metricFilterValue(definition.prefix);
  if (!filter) return true;
  const metric = row.metrics?.[definition.metricID];
  if (!metric || metric.noData) return false;
  const value = Number(metric[filter.statistic]);
  return filter.operator === "gt"
    ? value > filter.threshold
    : value <= filter.threshold;
}

function filteredResultRows(rows) {
  const searchTerm = $("#resultSearch").value.trim().toLocaleLowerCase();
  const conclusion = $("#resultConclusion").value;
  const manager = $("#resultManager").value;
  const cluster = $("#resultCluster").value;
  const host = $("#resultHost").value;
  return rows.filter((row) => {
    const description = splitDescription(row.description);
    if (searchTerm && !rowSearchText(row).includes(searchTerm)) return false;
    if (conclusion && conclusion !== (row.pass ? "pass" : "fail")) return false;
    if (manager && manager !== description.manager) return false;
    if (cluster && cluster !== String(row.clusterName || "-").trim())
      return false;
    if (host && host !== String(row.hostName || "-").trim()) return false;
    return resultMetricFilterDefinitions.every((definition) =>
      rowMatchesMetricFilter(row, definition),
    );
  });
}

function resetResultFilters() {
  $("#resultSearch").value = "";
  $("#resultConclusion").value = "";
  $("#resultManager").value = "";
  $("#resultCluster").value = "";
  $("#resultHost").value = "";
  resultMetricFilterDefinitions.forEach(({ prefix }) => {
    $(`#${prefix}FilterStatistic`).value = "maximum";
    $(`#${prefix}FilterOperator`).value = "gt";
    $(`#${prefix}FilterValue`).value = "";
  });
}

function sortedResultRows(rows) {
  const sortBy = $("#sortBy").value;
  const direction = $("#sortDirection").value === "desc" ? -1 : 1;
  return [...rows].sort((left, right) => {
    if (left.pass !== right.pass) return left.pass ? -1 : 1;
    const comparison = compareResultRows(left, right, sortBy);
    if (comparison !== 0) return comparison * direction;
    const ipComparison = resultCollator.compare(left.ip || "", right.ip || "");
    if (ipComparison !== 0) return ipComparison * direction;
    return resultCollator.compare(left.urn || "", right.urn || "") * direction;
  });
}

function compareResultRows(left, right, sortBy) {
  const metricSort = {
    cpu_max: ["cpu_usage", "maximum"],
    cpu_avg: ["cpu_usage", "average"],
    memory_max: ["mem_usage", "maximum"],
    memory_avg: ["mem_usage", "average"],
    disk_max: ["disk_usage", "maximum"],
    disk_avg: ["disk_usage", "average"],
  };
  if (metricSort[sortBy]) {
    const [metricID, field] = metricSort[sortBy];
    const leftMetric = left.metrics[metricID];
    const rightMetric = right.metrics[metricID];
    const leftMissing = !leftMetric || leftMetric.noData;
    const rightMissing = !rightMetric || rightMetric.noData;
    if (leftMissing !== rightMissing) return leftMissing ? 1 : -1;
    return Number(leftMetric?.[field] || 0) - Number(rightMetric?.[field] || 0);
  }
  const fields = {
    ip: "ip",
    name: "name",
    cluster: "clusterName",
    host: "hostName",
  };
  if (sortBy === "description") {
    return resultCollator.compare(
      splitDescription(left.description).purpose,
      splitDescription(right.description).purpose,
    );
  }
  return resultCollator.compare(
    left[fields[sortBy] || "ip"] || "",
    right[fields[sortBy] || "ip"] || "",
  );
}

function renderResults(result) {
  state.result = result;
  state.terminal = null;
  const allRows = result.rows || [];
  populateResultFilterOptions(allRows);
  $("#resultFilters").hidden = false;
  const rows = sortedResultRows(filteredResultRows(allRows));
  $("#resultSummary").textContent = t("filteredSummary", {
    scanned: result.scanned,
    matched: result.matched,
    visible: rows.length,
  });
  $("#resultFilterCount").textContent = t("visibleResults", {
    visible: rows.length,
    total: allRows.length,
  });
  $("#resultBody").innerHTML = rows.length
    ? rows
        .map(
          (row) => `
    <tr><td><span class="badge ${row.pass ? "pass" : "fail"}">${t(row.pass ? "pass" : "fail")}</span></td>
    <td><strong class="vm-name" title="${esc(row.name || "-")}">${esc(row.name || "-")}</strong><small class="vm-urn" title="${esc(row.urn || "-")}">${esc(row.urn || "-")}</small></td><td>${esc(row.ip || "-")}</td><td class="purpose-cell">${esc(splitDescription(row.description).purpose)}</td><td class="manager-cell">${esc(splitDescription(row.description).manager)}</td><td class="term-cell">${esc(splitDescription(row.description).term)}</td>
    <td>${esc(row.clusterName || "-")}<small>${esc(row.hostName || "")}</small></td>
    <td>${metricText(row.metrics, "cpu_usage")}</td><td>${metricText(row.metrics, "mem_usage")}</td><td>${metricText(row.metrics, "disk_usage")}</td><td>${ratioText(row.metrics)}</td></tr>`,
        )
        .join("")
    : `<tr class="empty"><td colspan="11">${t(allRows.length ? "noFilteredResults" : "noRunningVMs")}</td></tr>`;
}

function clearResults() {
  state.result = null;
  state.currentJob = null;
  resetResultFilters();
  $("#resultFilters").hidden = true;
  $("#exportButton").disabled = true;
  showTerminalState("preparing", "loadingData");
}

function exportExcel() {
  if (!state.result) return;
  const rows = sortedResultRows(filteredResultRows(state.result.rows || []));
  const header = [
    t("csvConclusion"),
    t("csvVm"),
    "IP",
    t("csvPurpose"),
    t("csvManager"),
    t("csvTerm"),
    t("csvCluster"),
    t("csvHost"),
    t("csvCpuMax"),
    t("csvCpuAvg"),
    t("csvMemoryMax"),
    t("csvMemoryAvg"),
    t("csvDiskMax"),
    t("csvDiskAvg"),
  ];
  const value = (row, id, key) =>
    row.metrics[id] && !row.metrics[id].noData
      ? `${format(row.metrics[id][key])}%`
      : "";
  const lines = rows.map((row) => [
    row.pass ? t("pass") : t("fail"),
    row.name,
    row.ip,
    splitDescription(row.description).purpose,
    splitDescription(row.description).manager,
    splitDescription(row.description).term,
    row.clusterName,
    row.hostName,
    value(row, "cpu_usage", "maximum"),
    value(row, "cpu_usage", "average"),
    value(row, "mem_usage", "maximum"),
    value(row, "mem_usage", "average"),
    value(row, "disk_usage", "maximum"),
    value(row, "disk_usage", "average"),
  ]);
  window.exportQueryWorkbook({
    title: t("documentTitle"),
    subtitle: t("exportSummary", {
      time: new Date().toLocaleString(
        state.locale === "zh" ? "zh-CN" : "en-US",
      ),
      scanned: state.result.scanned,
      matched: state.result.matched,
      exported: rows.length,
    }),
    headers: header,
    rows: lines,
    fileName: `fc-history-query-${new Date().toISOString().slice(0, 10)}.xlsx`,
    columnWidths: [11, 16, 16, 34, 14, 14, 18, 18, 14, 14, 14, 14, 14, 14],
  });
}

function toast(message) {
  const item = $("#toastTemplate").content.firstElementChild.cloneNode(true);
  item.textContent = message;
  document.body.append(item);
  window.setTimeout(() => item.remove(), 5000);
}

$("#queryForm").addEventListener("submit", runQuery);
$("#cancelButton").addEventListener("click", cancelQuery);
$("#exportButton").addEventListener("click", exportExcel);
$("#matchMode").addEventListener("change", () => {
  $("#ratioWrap").hidden = $("#matchMode").value !== "ratio";
});
$("#sortBy").addEventListener("change", () => {
  if (state.result) renderResults(state.result);
});
$("#sortDirection").addEventListener("change", () => {
  if (state.result) renderResults(state.result);
});
document
  .querySelectorAll("#resultFilters input, #resultFilters select")
  .forEach((input) => {
    input.addEventListener(
      input.type === "search" || input.type === "number" ? "input" : "change",
      () => {
        if (state.result) renderResults(state.result);
      },
    );
  });
$("#resetResultFilters").addEventListener("click", () => {
  resetResultFilters();
  if (state.result) renderResults(state.result);
});
$("#languageToggle").addEventListener("click", () =>
  applyLocale(state.locale === "zh" ? "en" : "zh"),
);
$("#themeToggle").addEventListener("click", () =>
  applyTheme(state.theme === "dark" ? "light" : "dark"),
);
$("#passwordToggle").addEventListener("click", togglePasswordVisibility);

setupSelectControls();
applyTheme(state.theme);
applyLocale(state.locale);
setDefaultDates();
