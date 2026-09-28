/**
 * Data Sarthi — Enterprise Data Quality Platform (Phase 1)
 */

let currentScanResult = null;
let currentRawCsv = "";
let currentFilename = "ecommerce_orders.csv";
let cleanedDataRows = [];

// DOM Elements
const fileInput = document.getElementById("fileInput");
const navUploadBtn = document.getElementById("navUploadBtn");
const dropZone = document.getElementById("dropZone");
const browseBtn = document.getElementById("browseBtn");
const delimiterSelect = document.getElementById("delimiterSelect");
const sampleButtons = document.querySelectorAll(".sample-btn-sm");
const scanSpeedBadge = document.getElementById("scanSpeedBadge");
const scanSpeedText = document.getElementById("scanSpeedText");
const themeToggle = document.getElementById("themeToggle");
const navTabBtns = document.querySelectorAll(".nav-tab-btn");
const appViews = document.querySelectorAll(".app-view");
const navIssuesBadge = document.getElementById("navIssuesBadge");

// Overview Elements
const overviewFileName = document.getElementById("overviewFileName");
const overviewFileSize = document.getElementById("overviewFileSize");
const kpiScore = document.getElementById("kpiScore");
const scoreProgressPath = document.getElementById("scoreProgressPath");
const scoreRatingTag = document.getElementById("scoreRatingTag");
const scoreVerdict = document.getElementById("scoreVerdict");
const btnWhyScore = document.getElementById("btnWhyScore");
const kpiRows = document.getElementById("kpiRows");
const kpiCols = document.getElementById("kpiCols");
const kpiTotalCells = document.getElementById("kpiTotalCells");
const kpiNulls = document.getElementById("kpiNulls");
const kpiNullPct = document.getElementById("kpiNullPct");
const kpiCleanCols = document.getElementById("kpiCleanCols");
const kpiIssues = document.getElementById("kpiIssues");
const kpiIssueBreakdown = document.getElementById("kpiIssueBreakdown");

const dimCompletenessVal = document.getElementById("dimCompletenessVal");
const dimCompletenessBar = document.getElementById("dimCompletenessBar");
const dimValidityVal = document.getElementById("dimValidityVal");
const dimValidityBar = document.getElementById("dimValidityBar");
const dimUniquenessVal = document.getElementById("dimUniquenessVal");
const dimUniquenessBar = document.getElementById("dimUniquenessBar");
const dimConsistencyVal = document.getElementById("dimConsistencyVal");
const dimConsistencyBar = document.getElementById("dimConsistencyBar");

const overviewCritCount = document.getElementById("overviewCritCount");
const overviewWarnCount = document.getElementById("overviewWarnCount");
const overviewPassCount = document.getElementById("overviewPassCount");
const overviewTopRec = document.getElementById("overviewTopRec");
const btnGoToIssues = document.getElementById("btnGoToIssues");

// Issues Center Elements
const pillCrit = document.getElementById("pillCrit");
const pillWarn = document.getElementById("pillWarn");
const pillInfo = document.getElementById("pillInfo");
const cntFilterAll = document.getElementById("cntFilterAll");
const cntFilterCrit = document.getElementById("cntFilterCrit");
const cntFilterWarn = document.getElementById("cntFilterWarn");
const cntFilterInfo = document.getElementById("cntFilterInfo");
const filterPills = document.querySelectorAll(".filter-pill");
const issuesSearchInput = document.getElementById("issuesSearchInput");
const issuesSortSelect = document.getElementById("issuesSortSelect");
const issuesCardsContainer = document.getElementById("issuesCardsContainer");

// Columns Elements
const columnSearchInput = document.getElementById("columnSearchInput");
const columnSortSelect = document.getElementById("columnSortSelect");
const columnsGrid = document.getElementById("columnsGrid");
const matrixTableBody = document.getElementById("matrixTableBody");
const matrixColCountText = document.getElementById("matrixColCountText");

// Data Preview Elements
const previewGridFileName = document.getElementById("previewGridFileName");
const previewSubTitle = document.getElementById("previewSubTitle");
const gridSearchInput = document.getElementById("gridSearchInput");
const previewTableHead = document.getElementById("previewTableHead");
const previewTableBody = document.getElementById("previewTableBody");

// Cleaning Elements
const chkTrim = document.getElementById("chkTrim");
const chkCasing = document.getElementById("chkCasing");
const chkDedupe = document.getElementById("chkDedupe");
const chkImpute = document.getElementById("chkImpute");
const btnApplyCleaning = document.getElementById("btnApplyCleaning");
const btnExportCleanedCsv = document.getElementById("btnExportCleanedCsv");
const cleaningTableHead = document.getElementById("cleaningTableHead");
const cleaningTableBody = document.getElementById("cleaningTableBody");
const cleaningStatusBadge = document.getElementById("cleaningStatusBadge");

// Rules & Reports & CI/CD
const rulesCatalogContainer = document.getElementById("rulesCatalogContainer");
const btnDownloadHtmlReport = document.getElementById("btnDownloadHtmlReport");
const btnDownloadJsonReport = document.getElementById("btnDownloadJsonReport");
const btnDownloadMdReport = document.getElementById("btnDownloadMdReport");
const btnDownloadCsvSummary = document.getElementById("btnDownloadCsvSummary");
const cliCodeBlock = document.getElementById("cliCodeBlock");
const cliOutputBlock = document.getElementById("cliOutputBlock");
const btnCopyCli = document.getElementById("btnCopyCli");
const btnCopyYaml = document.getElementById("btnCopyYaml");

// Modals
const scoreModal = document.getElementById("scoreModal");
const closeScoreModal = document.getElementById("closeScoreModal");
const closeScoreModalBtn = document.getElementById("closeScoreModalBtn");
const scoreCalculationBody = document.getElementById("scoreCalculationBody");

const columnDetailModal = document.getElementById("columnDetailModal");
const closeColDetailModal = document.getElementById("closeColDetailModal");
const closeColDetailBtn = document.getElementById("closeColDetailBtn");
const colDetailTitle = document.getElementById("colDetailTitle");
const colDetailTypeSubtitle = document.getElementById("colDetailTypeSubtitle");
const colDetailBody = document.getElementById("colDetailBody");

const cellDiagnosticModal = document.getElementById("cellDiagnosticModal");
const closeDiagModal = document.getElementById("closeDiagModal");
const closeDiagBtn = document.getElementById("closeDiagBtn");
const diagModalTitle = document.getElementById("diagModalTitle");
const diagModalCoord = document.getElementById("diagModalCoord");
const diagModalBody = document.getElementById("diagModalBody");

const pasteModal = document.getElementById("pasteModal");
const btnOpenPaste = document.getElementById("btnOpenPaste");
const closePasteModal = document.getElementById("closePasteModal");
const cancelPasteBtn = document.getElementById("cancelPasteBtn");
const runPasteBtn = document.getElementById("runPasteBtn");
const rawCsvTextarea = document.getElementById("rawCsvTextarea");

const exportModal = document.getElementById("exportModal");
const btnExportModal = document.getElementById("btnExportModal");
const closeExportModal = document.getElementById("closeExportModal");
const exportHtmlCard = document.getElementById("exportHtmlCard");
const exportJsonCard = document.getElementById("exportJsonCard");
const exportMdCard = document.getElementById("exportMdCard");
const exportOrigCsvCard = document.getElementById("exportOrigCsvCard");
const exportCleanCsvCard = document.getElementById("exportCleanCsvCard");

// Smart EDA Redesigned DOM Elements
const edaMetaDataset = document.getElementById("edaMetaDataset");
const edaMetaRows = document.getElementById("edaMetaRows");
const edaMetaCols = document.getElementById("edaMetaCols");
const edaMetaTarget = document.getElementById("edaMetaTarget");
const btnModeSmart = document.getElementById("btnModeSmart");
const btnModeManual = document.getElementById("btnModeManual");
const btnOpenEdaConfig = document.getElementById("btnOpenEdaConfig");
const btnRegenerateEda = document.getElementById("btnRegenerateEda");
const btnExportEdaReport = document.getElementById("btnExportEdaReport");
const btnExportPythonEdaReport = document.getElementById("btnExportPythonEdaReport");

const edaTargetTabsBar = document.getElementById("edaTargetTabsBar");
const edaExecutiveSummary = document.getElementById("edaExecutiveSummary");
const edaTargetSection = document.getElementById("edaTargetSection");
const edaTargetHeaderPill = document.getElementById("edaTargetHeaderPill");
const edaTargetDistChartPane = document.getElementById("edaTargetDistChartPane");
const edaTargetStatsPane = document.getElementById("edaTargetStatsPane");

const edaKeyInsightsSection = document.getElementById("edaKeyInsightsSection");
const edaKeyInsightsGrid = document.getElementById("edaKeyInsightsGrid");

const edaFeatureRelationshipsSection = document.getElementById("edaFeatureRelationshipsSection");
const edaBivariateGrid = document.getElementById("edaBivariateGrid");

const edaNumericalDistributionsSection = document.getElementById("edaNumericalDistributionsSection");
const edaNumDistributionsGrid = document.getElementById("edaNumDistributionsGrid");
const btnToggleAllNumCharts = document.getElementById("btnToggleAllNumCharts");

const edaCategoricalDistributionsSection = document.getElementById("edaCategoricalDistributionsSection");
const edaCatDistributionsGrid = document.getElementById("edaCatDistributionsGrid");
const btnToggleAllCatCharts = document.getElementById("btnToggleAllCatCharts");

const edaCorrelationSection = document.getElementById("edaCorrelationSection");
const edaHeatmapVisual = document.getElementById("edaHeatmapVisual");
const edaPositiveCorrelationsBody = document.getElementById("edaPositiveCorrelationsBody");
const edaNegativeCorrelationsBody = document.getElementById("edaNegativeCorrelationsBody");

const edaOutlierSection = document.getElementById("edaOutlierSection");
const edaOutlierTableBody = document.getElementById("edaOutlierTableBody");
const btnToggleOutlierPlots = document.getElementById("btnToggleOutlierPlots");
const edaOutlierPlotsGrid = document.getElementById("edaOutlierPlotsGrid");

const edaMissingnessSection = document.getElementById("edaMissingnessSection");
const edaMissingnessBars = document.getElementById("edaMissingnessBars");

const edaSmartAnalysisContainer = document.getElementById("edaSmartAnalysisContainer");
const edaManualExplorationContainer = document.getElementById("edaManualExplorationContainer");
const builderChartType = document.getElementById("builderChartType");
const builderXAxis = document.getElementById("builderXAxis");
const builderYAxis = document.getElementById("builderYAxis");
const builderColorBy = document.getElementById("builderColorBy");
const btnRenderManualChart = document.getElementById("btnRenderManualChart");
const manualChartContainer = document.getElementById("manualChartContainer");

// EDA Config Modal Elements
const edaConfigModal = document.getElementById("edaConfigModal");
const closeEdaConfigModal = document.getElementById("closeEdaConfigModal");
const cancelEdaConfigBtn = document.getElementById("cancelEdaConfigBtn");
const applyEdaConfigBtn = document.getElementById("applyEdaConfigBtn");
const edaTargetCheckboxesList = document.getElementById("edaTargetCheckboxesList");
const edaFeatureCheckboxesList = document.getElementById("edaFeatureCheckboxesList");
const btnModalTargetAuto = document.getElementById("btnModalTargetAuto");
const btnModalTargetNone = document.getElementById("btnModalTargetNone");
const btnModalFeatSelectAll = document.getElementById("btnModalFeatSelectAll");
const btnModalFeatAuto = document.getElementById("btnModalFeatAuto");
const btnModalFeatClear = document.getElementById("btnModalFeatClear");
const modalFeatFilterAll = document.getElementById("modalFeatFilterAll");
const modalFeatFilterNum = document.getElementById("modalFeatFilterNum");
const modalFeatFilterCat = document.getElementById("modalFeatFilterCat");
const modalFeatFilterDate = document.getElementById("modalFeatFilterDate");
const modalFeatSearch = document.getElementById("modalFeatSearch");

// EDA State
let edaState = {
  selectedTargets: [],
  activeTargetTab: null,
  selectedFeatures: [],
  showAllNumCharts: false,
  showAllCatCharts: false,
  showOutlierPlots: false,
  mode: "smart",
  featFilter: "all",
  featSearch: ""
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  setupNavigation();
  setupEventListeners();
  loadSample("ecommerce_orders");
});

function setupTheme() {
  const saved = localStorage.getItem("dq_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("dq_theme", next);
  });
}

function setupNavigation() {
  navTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetViewId = btn.getAttribute("data-view");
      switchView(targetViewId);
    });
  });

  if (btnGoToIssues) {
    btnGoToIssues.addEventListener("click", () => switchView("viewIssues"));
  }
}

function switchView(viewId) {
  navTabBtns.forEach((b) => {
    if (b.getAttribute("data-view") === viewId) b.classList.add("active");
    else b.classList.remove("active");
  });

  appViews.forEach((view) => {
    if (view.id === viewId) view.classList.add("active");
    else view.classList.remove("active");
  });
}

function setupEventListeners() {
  // Upload and file selection
  navUploadBtn.addEventListener("click", () => fileInput.click());
  if (browseBtn) browseBtn.addEventListener("click", () => fileInput.click());
  if (dropZone) dropZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  if (dropZone) {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Presets
  sampleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sampleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const sampleId = btn.getAttribute("data-sample");
      if (sampleId) loadSample(sampleId);
    });
  });

  // Delimiter change
  delimiterSelect.addEventListener("change", () => {
    if (currentRawCsv) {
      scanCsv(currentRawCsv, currentFilename, delimiterSelect.value);
    }
  });

  // Paste Modal
  btnOpenPaste.addEventListener("click", () => pasteModal.classList.add("active"));
  closePasteModal.addEventListener("click", () => pasteModal.classList.remove("active"));
  cancelPasteBtn.addEventListener("click", () => pasteModal.classList.remove("active"));
  runPasteBtn.addEventListener("click", () => {
    const text = rawCsvTextarea.value.trim();
    if (text) {
      pasteModal.classList.remove("active");
      sampleButtons.forEach((b) => b.classList.remove("active"));
      scanCsv(text, "pasted_data.csv", delimiterSelect.value);
    }
  });

  // Transparency Score Modal
  btnWhyScore.addEventListener("click", () => scoreModal.classList.add("active"));
  closeScoreModal.addEventListener("click", () => scoreModal.classList.remove("active"));
  closeScoreModalBtn.addEventListener("click", () => scoreModal.classList.remove("active"));

  // Column Detail Modal
  closeColDetailModal.addEventListener("click", () => columnDetailModal.classList.remove("active"));
  closeColDetailBtn.addEventListener("click", () => columnDetailModal.classList.remove("active"));

  // Cell Diagnostic Modal
  closeDiagModal.addEventListener("click", () => cellDiagnosticModal.classList.remove("active"));
  closeDiagBtn.addEventListener("click", () => cellDiagnosticModal.classList.remove("active"));

  // Export Modal
  btnExportModal.addEventListener("click", () => exportModal.classList.add("active"));
  closeExportModal.addEventListener("click", () => exportModal.classList.remove("active"));
  exportHtmlCard.addEventListener("click", () => { exportHTMLReport(); exportModal.classList.remove("active"); });
  exportJsonCard.addEventListener("click", () => { exportJSON(); exportModal.classList.remove("active"); });
  exportMdCard.addEventListener("click", () => { exportMarkdown(); exportModal.classList.remove("active"); });
  exportOrigCsvCard.addEventListener("click", () => { exportOriginalCsv(); exportModal.classList.remove("active"); });
  exportCleanCsvCard.addEventListener("click", () => { exportCleanedCsv(); exportModal.classList.remove("active"); });

  // Direct Report Download Buttons
  btnDownloadHtmlReport.addEventListener("click", exportHTMLReport);
  btnDownloadJsonReport.addEventListener("click", exportJSON);
  btnDownloadMdReport.addEventListener("click", exportMarkdown);
  btnDownloadCsvSummary.addEventListener("click", exportCsvSummary);

  // Issues Filtering and Search
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      renderIssuesView();
    });
  });

  issuesSearchInput.addEventListener("input", renderIssuesView);
  issuesSortSelect.addEventListener("change", renderIssuesView);

  // Columns Search and Sort
  columnSearchInput.addEventListener("input", renderColumnsView);
  columnSortSelect.addEventListener("change", renderColumnsView);

  // Data Grid search
  gridSearchInput.addEventListener("input", renderPreviewTable);

  // Cleaning Recipes
  [chkTrim, chkCasing, chkDedupe, chkImpute].forEach((chk) => {
    chk.addEventListener("change", runCleaningPreview);
  });
  btnApplyCleaning.addEventListener("click", runCleaningPreview);
  btnExportCleanedCsv.addEventListener("click", exportCleanedCsv);

  // Copy CLI & YAML buttons
  btnCopyCli.addEventListener("click", () => {
    navigator.clipboard.writeText(cliCodeBlock.innerText).then(() => {
      btnCopyCli.innerText = "✓ Copied!";
      setTimeout(() => { btnCopyCli.innerText = "Copy Terminal Command"; }, 2000);
    });
  });

  btnCopyYaml.addEventListener("click", () => {
    const yaml = `name: Data Quality Gate
on: [push, pull_request]

jobs:
  data-quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Run Data Sarthi Quality Scan
        run: |
          python dq_scan.py data/export.csv`;
    navigator.clipboard.writeText(yaml).then(() => {
      btnCopyYaml.innerText = "✓ Copied!";
      setTimeout(() => { btnCopyYaml.innerText = "Copy YAML"; }, 2000);
    });
  });

  // Setup Smart EDA listeners
  setupSmartEdaListeners();
}

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    sampleButtons.forEach((b) => b.classList.remove("active"));
    scanCsv(text, file.name, delimiterSelect.value);
  };
  reader.readAsText(file);
}

async function loadSample(sampleId) {
  const startTime = performance.now();
  try {
    const res = await fetch(`/api/sample/${sampleId}`);
    if (res.ok) {
      const data = await res.json();
      currentScanResult = data;
      currentFilename = `${sampleId}.csv`;
      const elapsed = Math.round(performance.now() - startTime);
      displayScanResults(data, elapsed);
    }
  } catch (err) {
    console.warn("API fetch error, using fallback", err);
  }
}

async function scanCsv(csvText, filename = "data.csv", delim = "auto") {
  currentRawCsv = csvText;
  currentFilename = filename;
  const startTime = performance.now();

  try {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: csvText, filename, delimiter: delim }),
    });

    if (res.ok) {
      const data = await res.json();
      currentScanResult = data;
      const elapsed = Math.round(performance.now() - startTime);
      displayScanResults(data, elapsed);
    }
  } catch (err) {
    console.error("Scan failed", err);
  }
}

function displayScanResults(data, elapsedMs) {
  if (!data || !data.summary) return;

  scanSpeedBadge.style.display = "inline-flex";
  scanSpeedText.textContent = `Profiled in ${elapsedMs}ms`;

  const s = data.summary;
  const d = data.dimensions;
  const ic = data.issue_counts;

  // File metadata
  overviewFileName.textContent = s.filename;
  overviewFileSize.textContent = `(${formatBytes(s.file_size_bytes)})`;
  previewGridFileName.textContent = s.filename;

  // Overall Score
  const scoreVal = Math.round(s.overall_quality_score);
  kpiScore.textContent = scoreVal;
  scoreProgressPath.setAttribute("stroke-dasharray", `${scoreVal}, 100`);

  if (scoreVal >= 85) {
    scoreProgressPath.style.stroke = "var(--color-emerald)";
    scoreRatingTag.textContent = "EXCELLENT QUALITY";
    scoreRatingTag.style.color = "var(--color-emerald)";
    scoreVerdict.textContent = "High data integrity. Ready for downstream production use.";
  } else if (scoreVal >= 60) {
    scoreProgressPath.style.stroke = "var(--color-amber)";
    scoreRatingTag.textContent = "MODERATE QUALITY";
    scoreRatingTag.style.color = "var(--color-amber)";
    scoreVerdict.textContent = "Several formatting quirks and null fields require attention.";
  } else {
    scoreProgressPath.style.stroke = "var(--color-rose)";
    scoreRatingTag.textContent = "CRITICAL ISSUES";
    scoreRatingTag.style.color = "var(--color-rose)";
    scoreVerdict.textContent = "Significant data degradation. Review critical flags.";
  }

  // Dimensions
  dimCompletenessVal.textContent = `${d.completeness}%`;
  dimCompletenessBar.style.width = `${d.completeness}%`;
  dimValidityVal.textContent = `${d.validity}%`;
  dimValidityBar.style.width = `${d.validity}%`;
  dimUniquenessVal.textContent = `${d.uniqueness}%`;
  dimUniquenessBar.style.width = `${d.uniqueness}%`;
  dimConsistencyVal.textContent = `${d.consistency}%`;
  dimConsistencyBar.style.width = `${d.consistency}%`;

  // KPIs
  kpiRows.textContent = s.total_rows.toLocaleString();
  kpiCols.textContent = s.total_cols;
  kpiTotalCells.textContent = `${s.total_cells.toLocaleString()} cells analyzed`;

  kpiNulls.textContent = s.total_nulls.toLocaleString();
  kpiNullPct.textContent = `${s.total_null_pct}%`;
  const cleanColsCount = data.columns.filter((c) => c.null_count === 0).length;
  kpiCleanCols.textContent = `${cleanColsCount} of ${s.total_cols} columns clean`;

  kpiIssues.textContent = ic.total;
  kpiIssueBreakdown.textContent = `${ic.critical} critical • ${ic.warning} warnings`;
  navIssuesBadge.textContent = ic.total;

  overviewCritCount.textContent = ic.critical;
  overviewWarnCount.textContent = ic.warning;
  overviewPassCount.textContent = ic.passed;

  // Issues Center Pill Counts
  pillCrit.textContent = `${ic.critical} Critical`;
  pillWarn.textContent = `${ic.warning} Warnings`;
  pillInfo.textContent = `${ic.info} Info`;
  cntFilterAll.textContent = ic.total;
  cntFilterCrit.textContent = ic.critical;
  cntFilterWarn.textContent = ic.warning;
  cntFilterInfo.textContent = ic.info;

  // Recommendation
  if (ic.critical > 0) {
    overviewTopRec.textContent = `Remediate ${ic.critical} critical issue(s) before feeding downstream tables.`;
  } else if (ic.warning > 0) {
    overviewTopRec.textContent = `Review ${ic.warning} warning(s): consider trimming whitespace & normalizing casing.`;
  } else {
    overviewTopRec.textContent = `All checks passed! Dataset has 100% structural conformity.`;
  }

  // Render Sub-Views
  renderScoreCalculationModal();
  renderIssuesView();
  renderColumnsView();
  renderMatrixTable();
  renderPreviewTable();
  renderRulesCatalog();
  runCleaningPreview();
  renderCliBlock();
  renderSmartEdaView();
}

function renderScoreCalculationModal() {
  if (!currentScanResult || !currentScanResult.dimensions) return;
  const d = currentScanResult.dimensions;
  const w = d.weights || { completeness: 35, validity: 30, uniqueness: 20, consistency: 15 };

  const compContrib = ((d.completeness * w.completeness) / 100).toFixed(1);
  const valContrib = ((d.validity * w.validity) / 100).toFixed(1);
  const uniqContrib = ((d.uniqueness * w.uniqueness) / 100).toFixed(1);
  const consContrib = ((d.consistency * w.consistency) / 100).toFixed(1);
  const total = (parseFloat(compContrib) + parseFloat(valContrib) + parseFloat(uniqContrib) + parseFloat(consContrib)).toFixed(1);

  scoreCalculationBody.innerHTML = `
    <tr>
      <td><strong>Completeness</strong></td>
      <td>${d.completeness}%</td>
      <td>${w.completeness}%</td>
      <td><strong style="color: var(--color-emerald); font-family: var(--font-mono);">${compContrib} pts</strong></td>
    </tr>
    <tr>
      <td><strong>Validity</strong></td>
      <td>${d.validity}%</td>
      <td>${w.validity}%</td>
      <td><strong style="color: var(--color-blue); font-family: var(--font-mono);">${valContrib} pts</strong></td>
    </tr>
    <tr>
      <td><strong>Uniqueness</strong></td>
      <td>${d.uniqueness}%</td>
      <td>${w.uniqueness}%</td>
      <td><strong style="color: var(--color-purple); font-family: var(--font-mono);">${uniqContrib} pts</strong></td>
    </tr>
    <tr>
      <td><strong>Consistency</strong></td>
      <td>${d.consistency}%</td>
      <td>${w.consistency}%</td>
      <td><strong style="color: var(--color-amber); font-family: var(--font-mono);">${consContrib} pts</strong></td>
    </tr>
    <tr style="border-top: 2px solid var(--border-focus); font-weight: bold; background: var(--bg-surface-elevated);">
      <td>Overall Data Health Score</td>
      <td>—</td>
      <td>100%</td>
      <td><strong style="font-size: 1.1rem; color: var(--accent-primary); font-family: var(--font-mono);">${total} / 100</strong></td>
    </tr>
  `;
}

function renderIssuesView() {
  if (!currentScanResult || !currentScanResult.issues) return;

  const activePill = document.querySelector(".filter-pill.active");
  const severityFilter = activePill ? activePill.getAttribute("data-severity") : "all";
  const query = (issuesSearchInput.value || "").toLowerCase().trim();
  const sortMode = issuesSortSelect.value;

  let issues = [...currentScanResult.issues];

  // Severity filter
  if (severityFilter && severityFilter !== "all") {
    if (severityFilter === "RESOLVED") {
      issues = [];
    } else {
      issues = issues.filter((i) => i.severity === severityFilter);
    }
  }

  // Search filter
  if (query) {
    issues = issues.filter(
      (i) =>
        i.rule.toLowerCase().includes(query) ||
        i.column.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.why_it_matters.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (sortMode === "severity") {
    const sevWeight = { CRITICAL: 3, WARNING: 2, INFO: 1 };
    issues.sort((a, b) => (sevWeight[b.severity] || 0) - (sevWeight[a.severity] || 0));
  } else if (sortMode === "affected_rows") {
    issues.sort((a, b) => b.affected_rows - a.affected_rows);
  } else if (sortMode === "affected_pct") {
    issues.sort((a, b) => b.affected_pct - a.affected_pct);
  } else if (sortMode === "column") {
    issues.sort((a, b) => a.column.localeCompare(b.column));
  }

  issuesCardsContainer.innerHTML = "";

  if (issues.length === 0) {
    issuesCardsContainer.innerHTML = `
      <div class="card glass" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
        <strong>No issues found matching the selected criteria.</strong>
      </div>
    `;
    return;
  }

  issues.forEach((iss) => {
    const card = document.createElement("div");
    card.className = `card glass issue-card severity-${iss.severity}`;

    card.innerHTML = `
      <div class="issue-card-top">
        <div class="issue-title-group">
          <div class="issue-badge-row">
            <span class="badge-sev ${iss.severity}">${iss.severity}</span>
            <span class="badge-rule">${escapeHtml(iss.rule)}</span>
            <span class="badge-col-target">Column: ${escapeHtml(iss.column)}</span>
          </div>
          <p class="issue-desc mt-1">${escapeHtml(iss.description)}</p>
        </div>

        <div class="issue-affected-stat">
          <div class="affected-num ${iss.severity === 'CRITICAL' ? 'text-rose' : (iss.severity === 'WARNING' ? 'text-amber' : 'text-purple')}">
            ${iss.affected_rows} row${iss.affected_rows === 1 ? '' : 's'}
          </div>
          <div class="affected-pct">${iss.affected_pct}% of column</div>
        </div>
      </div>

      <div class="issue-reason-grid">
        <div class="reason-col">
          <strong>Why it matters:</strong>
          <p>${escapeHtml(iss.why_it_matters)}</p>
        </div>
        <div class="reason-col">
          <strong>Recommended action:</strong>
          <p>${escapeHtml(iss.recommended_action)}</p>
        </div>
      </div>

      <div class="issue-actions-row">
        <button class="btn btn-secondary btn-xs btn-inspect-col" data-col="${escapeHtml(iss.column)}">Inspect Column</button>
        <button class="btn btn-primary btn-xs btn-view-grid" data-col="${escapeHtml(iss.column)}">View in Data Grid &rarr;</button>
      </div>
    `;

    // Action handlers
    card.querySelector(".btn-inspect-col").addEventListener("click", () => {
      openColumnDetail(iss.column);
    });

    card.querySelector(".btn-view-grid").addEventListener("click", () => {
      switchView("viewDataPreview");
      if (gridSearchInput) {
        gridSearchInput.value = "";
      }
    });

    issuesCardsContainer.appendChild(card);
  });
}

function renderColumnsView() {
  if (!currentScanResult || !currentScanResult.columns) return;

  const query = (columnSearchInput.value || "").toLowerCase().trim();
  const sortMode = columnSortSelect.value;

  let cols = [...currentScanResult.columns];

  if (query) {
    cols = cols.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query) ||
        (c.issues && c.issues.some((i) => i.toLowerCase().includes(query)))
    );
  }

  if (sortMode === "nulls-desc") {
    cols.sort((a, b) => b.null_pct - a.null_pct);
  } else if (sortMode === "score-asc") {
    cols.sort((a, b) => a.health_score - b.health_score);
  } else if (sortMode === "unique-desc") {
    cols.sort((a, b) => b.unique_pct - a.unique_pct);
  } else if (sortMode === "name-asc") {
    cols.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    cols.sort((a, b) => a.index - b.index);
  }

  columnsGrid.innerHTML = "";

  if (cols.length === 0) {
    columnsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-dim);">
        No matching columns found for "${escapeHtml(query)}"
      </div>
    `;
    return;
  }

  cols.forEach((col) => {
    const card = document.createElement("div");
    card.className = "card glass column-card";

    let healthClass = "good";
    if (col.health_score < 60) healthClass = "poor";
    else if (col.health_score < 85) healthClass = "warn";

    let statsHtml = "";
    if (col.numeric_stats) {
      const ns = col.numeric_stats;
      statsHtml = `
        <div class="numeric-stats-grid">
          <div class="num-stat-item"><span class="num-stat-label">Min</span><span class="num-stat-val">${ns.min}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Max</span><span class="num-stat-val">${ns.max}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Mean</span><span class="num-stat-val">${ns.mean}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Median</span><span class="num-stat-val">${ns.median}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Std Dev</span><span class="num-stat-val">${ns.std_dev}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Negatives</span><span class="num-stat-val ${ns.negatives_count > 0 ? 'text-amber' : ''}">${ns.negatives_count}</span></div>
        </div>
      `;
    } else if (col.top_values && col.top_values.length > 0) {
      statsHtml = `
        <div class="freq-list">
          ${col.top_values.map(tv => `
            <div class="freq-item">
              <span class="freq-val" title="${escapeHtml(tv.value)}">${escapeHtml(tv.value)}</span>
              <div class="freq-bar-wrap">
                <div class="freq-mini-bar"><div class="freq-mini-fill" style="width: ${tv.percentage}%"></div></div>
                <span class="freq-cnt">${tv.count}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    let issuesHtml = "";
    if (col.issues && col.issues.length > 0) {
      issuesHtml = `
        <div class="col-issues-list">
          ${col.issues.map(iss => `<div class="issue-tag">⚠️ ${escapeHtml(iss)}</div>`).join("")}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="col-card-header">
        <div class="col-name-group">
          <span class="col-name">${escapeHtml(col.name)}</span>
          <div class="col-badges-row">
            <span class="badge-type">${col.type}</span>
            <span class="badge-health ${healthClass}">Health: ${col.health_score}%</span>
          </div>
        </div>
        <span style="font-size: 0.72rem; color: var(--accent-primary); font-weight: 600;">Details &rarr;</span>
      </div>

      <div class="col-metric-bars">
        <div class="metric-bar-group">
          <div class="bar-meta"><span>Nulls (Missing)</span><strong>${col.null_count} (${col.null_pct}%)</strong></div>
          <div class="bar-track">
            <div class="bar-fill ${col.null_pct > 20 ? 'fill-amber' : 'fill-emerald'}" style="width: ${col.null_pct}%"></div>
          </div>
        </div>

        <div class="metric-bar-group">
          <div class="bar-meta"><span>Unique Values</span><strong>${col.unique_count} (${col.unique_pct}%)</strong></div>
          <div class="bar-track">
            <div class="bar-fill fill-blue" style="width: ${col.unique_pct}%"></div>
          </div>
        </div>
      </div>

      ${statsHtml}
      ${issuesHtml}
    `;

    card.addEventListener("click", () => openColumnDetail(col.name));
    columnsGrid.appendChild(card);
  });
}

function renderMatrixTable() {
  if (!currentScanResult || !currentScanResult.columns) return;
  matrixColCountText.textContent = `${currentScanResult.columns.length} columns analyzed`;

  matrixTableBody.innerHTML = currentScanResult.columns
    .map((col, idx) => {
      let statsSummary = "";
      if (col.numeric_stats) {
        const ns = col.numeric_stats;
        statsSummary = `min: <b>${ns.min}</b>, max: <b>${ns.max}</b>, mean: <b>${ns.mean}</b>`;
      } else if (col.top_values && col.top_values.length > 0) {
        statsSummary = col.top_values.slice(0, 3).map((tv) => `"${escapeHtml(tv.value)}" (${tv.count})`).join(", ");
      }

      return `
        <tr>
          <td><span style="color: var(--text-dim); font-family: var(--font-mono);">${idx + 1}</span></td>
          <td><strong>${escapeHtml(col.name)}</strong></td>
          <td><span class="badge-type">${col.type}</span></td>
          <td>${col.null_count}</td>
          <td><span class="${col.null_pct > 10 ? 'text-amber' : ''}">${col.null_pct}%</span></td>
          <td>${col.unique_count} (${col.unique_pct}%)</td>
          <td>${col.duplicate_count}</td>
          <td><span style="font-size: 0.75rem;">${statsSummary}</span></td>
          <td><strong>${col.health_score}%</strong></td>
          <td>
            <button class="btn btn-outline btn-xs" onclick="openColumnDetail('${escapeHtml(col.name)}')">Inspect</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function openColumnDetail(colName) {
  if (!currentScanResult || !currentScanResult.columns) return;
  const col = currentScanResult.columns.find((c) => c.name === colName);
  if (!col) return;

  colDetailTitle.textContent = `Column: ${col.name}`;
  colDetailTypeSubtitle.textContent = `Inferred Type: ${col.type} • Quality Health: ${col.health_score}%`;

  let numericSection = "";
  if (col.numeric_stats) {
    const ns = col.numeric_stats;
    numericSection = `
      <div class="detail-section mt-3">
        <h4 style="font-size: 0.85rem; margin-bottom: 0.4rem;">Numeric Distribution & Measures</h4>
        <div class="numeric-stats-grid" style="grid-template-columns: repeat(4, 1fr); padding: 0.75rem;">
          <div class="num-stat-item"><span class="num-stat-label">Min</span><span class="num-stat-val">${ns.min}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Max</span><span class="num-stat-val">${ns.max}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Mean</span><span class="num-stat-val">${ns.mean}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Median</span><span class="num-stat-val">${ns.median}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Std Dev</span><span class="num-stat-val">${ns.std_dev}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Zeros</span><span class="num-stat-val">${ns.zeros_count}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Negatives</span><span class="num-stat-val ${ns.negatives_count > 0 ? 'text-amber' : ''}">${ns.negatives_count}</span></div>
          <div class="num-stat-item"><span class="num-stat-label">Outliers (IQR)</span><span class="num-stat-val ${ns.outliers_count > 0 ? 'text-purple' : ''}">${ns.outliers_count || 0}</span></div>
        </div>
      </div>
    `;
  }

  let categoricalSection = "";
  if (col.top_values && col.top_values.length > 0) {
    categoricalSection = `
      <div class="detail-section mt-3">
        <h4 style="font-size: 0.85rem; margin-bottom: 0.4rem;">Top Frequent Values</h4>
        <div class="card glass" style="padding: 0.75rem;">
          ${col.top_values.map(tv => `
            <div class="freq-item" style="padding: 4px 0;">
              <span class="freq-val"><strong>${escapeHtml(tv.value)}</strong></span>
              <div class="freq-bar-wrap">
                <div class="freq-mini-bar" style="width: 120px;"><div class="freq-mini-fill" style="width: ${tv.percentage}%"></div></div>
                <span class="freq-cnt">${tv.count} occurrences (${tv.percentage}%)</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  let issuesSection = "";
  if (col.issues && col.issues.length > 0) {
    issuesSection = `
      <div class="detail-section mt-3">
        <h4 style="font-size: 0.85rem; margin-bottom: 0.4rem; color: var(--color-amber);">Detected Quality Flags</h4>
        <div class="col-issues-list">
          ${col.issues.map(iss => `<div class="issue-tag" style="padding: 6px 10px;">⚠️ ${escapeHtml(iss)}</div>`).join("")}
        </div>
      </div>
    `;
  }

  colDetailBody.innerHTML = `
    <div class="detail-summary-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm);">
      <div><span style="font-size: 0.7rem; color: var(--text-dim);">TOTAL ROWS</span><br><strong style="font-family: var(--font-mono);">${col.total_rows}</strong></div>
      <div><span style="font-size: 0.7rem; color: var(--text-dim);">NULL COUNT</span><br><strong style="font-family: var(--font-mono); color: var(--color-amber);">${col.null_count} (${col.null_pct}%)</strong></div>
      <div><span style="font-size: 0.7rem; color: var(--text-dim);">UNIQUE VALUES</span><br><strong style="font-family: var(--font-mono);">${col.unique_count} (${col.unique_pct}%)</strong></div>
    </div>
    ${numericSection}
    ${categoricalSection}
    ${issuesSection}
  `;

  columnDetailModal.classList.add("active");
}

window.openColumnDetail = openColumnDetail;

function renderPreviewTable() {
  if (!currentScanResult || !currentScanResult.preview_rows) return;

  const rawRows = currentScanResult.preview_rows;
  const cols = currentScanResult.columns.map((c) => c.name);
  const diag = currentScanResult.cell_diagnostics || {};
  const query = (gridSearchInput ? gridSearchInput.value : "").toLowerCase().trim();

  let rows = rawRows;
  if (query) {
    rows = rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(query)));
  }

  previewSubTitle.textContent = `Showing ${rows.length} rows (${cols.length} columns)`;

  previewTableHead.innerHTML = `
    <tr>
      <th style="width: 45px;">#</th>
      ${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}
    </tr>
  `;

  previewTableBody.innerHTML = rows
    .map((r, rIdx) => {
      return `
        <tr>
          <td style="color: var(--text-dim);">${rIdx + 1}</td>
          ${cols
            .map((c) => {
              const val = r[c];
              const cellKey = `${rIdx},${c}`;
              const dInfo = diag[cellKey];

              if (val === undefined || val === null || val === "" || String(val).trim().toLowerCase() in { null: 1, nan: 1, "n/a": 1, none: 1 }) {
                return `
                  <td class="cell-problematic sev-WARNING" onclick="openCellDiagnostic(${rIdx}, '${escapeHtml(c)}')">
                    <span class="null-badge">&lt;null&gt;</span>
                  </td>
                `;
              }

              if (dInfo) {
                return `
                  <td class="cell-problematic sev-${dInfo.severity}" onclick="openCellDiagnostic(${rIdx}, '${escapeHtml(c)}')">
                    ${escapeHtml(String(val))} ⚠️
                  </td>
                `;
              }

              return `<td>${escapeHtml(String(val))}</td>`;
            })
            .join("")}
        </tr>
      `;
    })
    .join("");
}

function openCellDiagnostic(rIdx, colName) {
  if (!currentScanResult) return;
  const diag = currentScanResult.cell_diagnostics || {};
  const cellKey = `${rIdx},${colName}`;
  const dInfo = diag[cellKey];
  const rowObj = currentScanResult.preview_rows[rIdx] || {};
  const currentVal = rowObj[colName] !== undefined ? rowObj[colName] : "<null>";

  diagModalTitle.textContent = `Cell Diagnostic Inspection`;
  diagModalCoord.textContent = `Row #${rIdx + 1} • Column: ${colName}`;

  diagModalBody.innerHTML = `
    <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.82rem;">
      <div><strong>Current Value:</strong> <code style="color: var(--color-amber); background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">${escapeHtml(String(currentVal))}</code></div>
      <div><strong>Detected Issue:</strong> <span class="badge-sev ${dInfo ? dInfo.severity : 'WARNING'}">${dInfo ? dInfo.issue : 'Missing / Blank Value'}</span></div>
      <div><strong>Reason:</strong> ${dInfo ? escapeHtml(dInfo.reason) : 'Cell contains null, empty string, or missing value token.'}</div>
      <div><strong>Suggested Action:</strong> ${dInfo ? escapeHtml(dInfo.action) : 'Impute with default or clean upstream.'}</div>
    </div>
  `;

  cellDiagnosticModal.classList.add("active");
}

window.openCellDiagnostic = openCellDiagnostic;

function renderRulesCatalog() {
  const rules = [
    { name: "Completeness Constraint", desc: "Verifies column missing values do not exceed statistical thresholds (5%/50%).", status: "Active" },
    { name: "Format Validity: Email RFC", desc: "Validates standard email address regex on user email attributes.", status: "Active" },
    { name: "Format Validity: ISO Date", desc: "Checks parseable timestamps across datetime columns.", status: "Active" },
    { name: "Type Purity & Mixed Types", desc: "Identifies text tokens mixed into numeric or float columns.", status: "Active" },
    { name: "Negative Metric Anomaly", desc: "Flags negative values in positive domains (price, tenure, age, vitals).", status: "Active" },
    { name: "Statistical Outliers (1.5×IQR)", desc: "Calculates interquartile range boundaries and tags extreme value anomalies.", status: "Active" },
    { name: "Categorical Casing Inconsistency", desc: "Detects casing mismatch variants (e.g. 'EUR' vs 'eur') splitting categories.", status: "Active" },
    { name: "Duplicate Row Detection", desc: "Identifies duplicate records across the entire dataset schema.", status: "Active" },
    { name: "Constant Column Invariant", desc: "Identifies zero-variance single-value columns.", status: "Active" },
    { name: "Whitespace Sanitization", desc: "Identifies untrimmed leading/trailing spaces and whitespace-only cells.", status: "Active" },
    { name: "Extreme Cardinality Check", desc: "Flags potential unindexed identifier keys disguised as categorical fields.", status: "Active" },
    { name: "Null-like Literal Normalization", desc: "Detects 'nan', 'null', 'n/a', 'none' and '-' placeholders.", status: "Active" },
  ];

  rulesCatalogContainer.innerHTML = rules.map(r => `
    <div class="rule-catalog-card">
      <div class="rule-card-header">
        <span class="rule-title">${r.name}</span>
        <span class="rule-status-badge passed">✓ ${r.status}</span>
      </div>
      <p class="rule-desc">${r.desc}</p>
    </div>
  `).join("");
}

function runCleaningPreview() {
  if (!currentScanResult || !currentScanResult.preview_rows) return;

  const rawRows = JSON.parse(JSON.stringify(currentScanResult.preview_rows));
  const doTrim = chkTrim.checked;
  const doCasing = chkCasing.checked;
  const doDedupe = chkDedupe.checked;
  const doImpute = chkImpute.checked;

  let cleaned = rawRows;

  // 1. Trim & Null Normalization
  if (doTrim) {
    cleaned = cleaned.map(row => {
      const newRow = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) {
          newRow[k] = "";
        } else {
          let s = String(v).trim();
          if (["null", "nan", "none", "n/a", "na", "-"].includes(s.toLowerCase())) {
            s = "";
          }
          newRow[k] = s;
        }
      }
      return newRow;
    });
  }

  // 2. Casing Standardization
  if (doCasing) {
    cleaned = cleaned.map(row => {
      const newRow = {};
      for (const [k, v] of Object.entries(row)) {
        if (typeof v === "string" && v.length > 0 && isNaN(Number(v))) {
          if (["status", "currency", "plan_tier", "gender", "churned", "flagged"].includes(k.toLowerCase())) {
            newRow[k] = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
          } else {
            newRow[k] = v;
          }
        } else {
          newRow[k] = v;
        }
      }
      return newRow;
    });
  }

  // 3. Deduplicate
  if (doDedupe) {
    const seen = new Set();
    cleaned = cleaned.filter(row => {
      const hash = JSON.stringify(row);
      if (seen.has(hash)) return false;
      seen.add(hash);
      return true;
    });
  }

  // 4. Impute
  if (doImpute) {
    cleaned = cleaned.map(row => {
      const newRow = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === "" || v === null) {
          newRow[k] = "0.0";
        } else {
          newRow[k] = v;
        }
      }
      return newRow;
    });
  }

  cleanedDataRows = cleaned;
  const cols = currentScanResult.columns.map(c => c.name);

  cleaningTableHead.innerHTML = `
    <tr>
      <th style="width: 45px;">#</th>
      ${cols.map(c => `<th>${escapeHtml(c)}</th>`).join("")}
    </tr>
  `;

  cleaningTableBody.innerHTML = cleaned.slice(0, 50).map((r, idx) => `
    <tr>
      <td style="color: var(--text-dim);">${idx + 1}</td>
      ${cols.map(c => `<td>${escapeHtml(String(r[c] !== undefined ? r[c] : ''))}</td>`).join("")}
    </tr>
  `).join("");

  cleaningStatusBadge.textContent = `${cleaned.length} Cleaned Rows Ready`;
}

function renderCliBlock() {
  const fn = currentFilename || "export.csv";
  cliCodeBlock.textContent = `python dq_scan.py ${fn}`;

  let outputLines = [];
  if (currentScanResult) {
    const s = currentScanResult.summary;
    outputLines.push(`${s.total_rows} rows, ${s.total_cols} columns\n`);

    currentScanResult.columns.forEach((c) => {
      outputLines.push(`• ${c.name.padEnd(20)} nulls=${String(c.null_count).padEnd(6)} dupes=${String(c.duplicate_count).padEnd(6)} unique=${c.unique_count}`);
      if (c.numeric_stats) {
        const ns = c.numeric_stats;
        outputLines.push(`    numeric: min=${ns.min} max=${ns.max} mean=${ns.mean}`);
      } else if (c.top_values && c.top_values.length > 0) {
        const topStr = c.top_values.slice(0, 3).map((tv) => `('${tv.value}', ${tv.count})`).join(", ");
        outputLines.push(`    top: [${topStr}]`);
      }
    });
  }

  cliOutputBlock.textContent = outputLines.join("\n");
}

// Exports
function exportJSON() {
  if (!currentScanResult) return;
  const str = JSON.stringify(currentScanResult, null, 2);
  downloadFile(str, `${currentFilename}_quality_report.json`, "application/json");
}

function exportHTMLReport() {
  if (!currentScanResult) return;
  const s = currentScanResult.summary;
  const d = currentScanResult.dimensions;
  const issues = currentScanResult.issues || [];

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Data Sarthi Quality Report - ${escapeHtml(s.filename)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; padding: 2rem; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    h1, h2, h3 { margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 0.6rem 0.85rem; border-bottom: 1px solid #1e293b; font-size: 0.85rem; }
    th { background: #1e293b; color: #94a3b8; }
    .score { font-size: 2.5rem; font-weight: bold; color: #10b981; }
    .badge { padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    .CRITICAL { background: rgba(244,63,94,0.2); color: #f43f5e; }
    .WARNING { background: rgba(245,158,11,0.2); color: #f59e0b; }
    .INFO { background: rgba(59,130,246,0.2); color: #3b82f6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Data Sarthi — Quality Audit Report</h1>
    <p>Dataset: <strong>${escapeHtml(s.filename)}</strong> • Generated: ${new Date().toISOString()}</p>
    <div class="score">${s.overall_quality_score} / 100</div>
    <p>Completeness: ${d.completeness}% | Validity: ${d.validity}% | Uniqueness: ${d.uniqueness}% | Consistency: ${d.consistency}%</p>
    <p>${s.total_rows} rows × ${s.total_cols} columns (${s.total_cells} total cells)</p>
  </div>

  <div class="card">
    <h2>Detected Quality Issues (${issues.length})</h2>
    <table>
      <thead><tr><th>Severity</th><th>Rule</th><th>Column</th><th>Affected</th><th>Description</th></tr></thead>
      <tbody>
        ${issues.map(i => `<tr><td><span class="badge ${i.severity}">${i.severity}</span></td><td>${escapeHtml(i.rule)}</td><td>${escapeHtml(i.column)}</td><td>${i.affected_rows} (${i.affected_pct}%)</td><td>${escapeHtml(i.description)}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  downloadFile(html, `${currentFilename}_report.html`, "text/html");
}

function exportMarkdown() {
  if (!currentScanResult) return;
  const s = currentScanResult.summary;
  const d = currentScanResult.dimensions;
  let md = `# Data Quality Report: ${s.filename}\n\n`;
  md += `**Overall Health Score**: ${s.overall_quality_score} / 100\n`;
  md += `- **Completeness**: ${d.completeness}%\n`;
  md += `- **Validity**: ${d.validity}%\n`;
  md += `- **Uniqueness**: ${d.uniqueness}%\n`;
  md += `- **Consistency**: ${d.consistency}%\n\n`;
  md += `**Dimensions**: ${s.total_rows} rows × ${s.total_cols} columns (${s.total_cells} total cells)\n\n`;

  md += `## Issues Detected (${currentScanResult.issues.length})\n\n`;
  md += `| Severity | Rule | Column | Affected Rows | Description |\n`;
  md += `|---|---|---|---|---|\n`;
  currentScanResult.issues.forEach((i) => {
    md += `| **${i.severity}** | ${i.rule} | ${i.column} | ${i.affected_rows} (${i.affected_pct}%) | ${i.description} |\n`;
  });

  downloadFile(md, `${currentFilename}_quality_report.md`, "text/markdown");
}

function exportCsvSummary() {
  if (!currentScanResult) return;
  let csv = "column_name,type,total_rows,null_count,null_pct,unique_count,duplicate_count,health_score\n";
  currentScanResult.columns.forEach((c) => {
    csv += `"${c.name}","${c.type}",${c.total_rows},${c.null_count},${c.null_pct},${c.unique_count},${c.duplicate_count},${c.health_score}\n`;
  });
  downloadFile(csv, `${currentFilename}_metrics_summary.csv`, "text/csv");
}

function exportOriginalCsv() {
  if (!currentRawCsv) return;
  downloadFile(currentRawCsv, currentFilename, "text/csv");
}

function exportCleanedCsv() {
  if (!cleanedDataRows || cleanedDataRows.length === 0) return;
  const cols = currentScanResult.columns.map(c => c.name);
  let csv = cols.map(c => `"${c}"`).join(",") + "\n";

  cleanedDataRows.forEach(row => {
    const line = cols.map(c => `"${(row[c] !== undefined ? String(row[c]) : '').replace(/"/g, '""')}"`).join(",");
    csv += line + "\n";
  });

  downloadFile(csv, `cleaned_${currentFilename}`, "text/csv");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   SMART EDA & VISUAL ANALYTICS MODULE (Python + Seaborn Aesthetic)
   ========================================================================== */

function setupSmartEdaListeners() {
  // Mode switcher
  if (btnModeSmart && btnModeManual) {
    btnModeSmart.addEventListener("click", () => {
      edaState.mode = "smart";
      btnModeSmart.classList.add("active");
      btnModeManual.classList.remove("active");
      if (edaSmartAnalysisContainer) edaSmartAnalysisContainer.style.display = "block";
      if (edaManualExplorationContainer) edaManualExplorationContainer.style.display = "none";
    });

    btnModeManual.addEventListener("click", () => {
      edaState.mode = "manual";
      btnModeManual.classList.add("active");
      btnModeSmart.classList.remove("active");
      if (edaSmartAnalysisContainer) edaSmartAnalysisContainer.style.display = "none";
      if (edaManualExplorationContainer) edaManualExplorationContainer.style.display = "block";
      populateManualBuilderControls();
    });
  }

  // Config Modal open / close
  if (btnOpenEdaConfig) {
    btnOpenEdaConfig.addEventListener("click", () => {
      populateEdaConfigModal();
      if (edaConfigModal) edaConfigModal.classList.add("active");
    });
  }
  if (closeEdaConfigModal) {
    closeEdaConfigModal.addEventListener("click", () => {
      if (edaConfigModal) edaConfigModal.classList.remove("active");
    });
  }
  if (cancelEdaConfigBtn) {
    cancelEdaConfigBtn.addEventListener("click", () => {
      if (edaConfigModal) edaConfigModal.classList.remove("active");
    });
  }

  // Modal Target actions
  if (btnModalTargetAuto) {
    btnModalTargetAuto.addEventListener("click", () => {
      autoDetectTargetsInModal();
    });
  }
  if (btnModalTargetNone) {
    btnModalTargetNone.addEventListener("click", () => {
      if (!edaTargetCheckboxesList) return;
      const cbs = edaTargetCheckboxesList.querySelectorAll("input[type='checkbox']");
      cbs.forEach((cb) => (cb.checked = false));
    });
  }

  // Modal Feature actions
  if (btnModalFeatSelectAll) {
    btnModalFeatSelectAll.addEventListener("click", () => {
      if (!edaFeatureCheckboxesList) return;
      const cbs = edaFeatureCheckboxesList.querySelectorAll("input[type='checkbox']");
      cbs.forEach((cb) => (cb.checked = true));
    });
  }
  if (btnModalFeatAuto) {
    btnModalFeatAuto.addEventListener("click", () => {
      autoSelectFeaturesInModal();
    });
  }
  if (btnModalFeatClear) {
    btnModalFeatClear.addEventListener("click", () => {
      if (!edaFeatureCheckboxesList) return;
      const cbs = edaFeatureCheckboxesList.querySelectorAll("input[type='checkbox']");
      cbs.forEach((cb) => (cb.checked = false));
    });
  }

  // Modal Feature Filter Tabs
  [modalFeatFilterAll, modalFeatFilterNum, modalFeatFilterCat, modalFeatFilterDate].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      [modalFeatFilterAll, modalFeatFilterNum, modalFeatFilterCat, modalFeatFilterDate].forEach((b) =>
        b ? b.classList.remove("active") : null
      );
      btn.classList.add("active");
      edaState.featFilter = btn.getAttribute("data-filter") || "all";
      filterModalFeatureList();
    });
  });

  // Modal Feature Search
  if (modalFeatSearch) {
    modalFeatSearch.addEventListener("input", (e) => {
      edaState.featSearch = e.target.value.toLowerCase().trim();
      filterModalFeatureList();
    });
  }

  // Apply Modal Config
  if (applyEdaConfigBtn) {
    applyEdaConfigBtn.addEventListener("click", () => {
      if (edaConfigModal) edaConfigModal.classList.remove("active");
      syncModalSelectionsAndRecompute();
    });
  }

  // Regenerate Analysis
  if (btnRegenerateEda) {
    btnRegenerateEda.addEventListener("click", () => {
      generateEdaAnalysis();
    });
  }

  // Export Buttons
  if (btnExportEdaReport) {
    btnExportEdaReport.addEventListener("click", exportPythonEdaReport);
  }
  if (btnExportPythonEdaReport) {
    btnExportPythonEdaReport.addEventListener("click", exportPythonEdaReport);
  }

  // Toggles for distributions
  if (btnToggleAllNumCharts) {
    btnToggleAllNumCharts.addEventListener("click", () => {
      edaState.showAllNumCharts = !edaState.showAllNumCharts;
      btnToggleAllNumCharts.textContent = edaState.showAllNumCharts
        ? "Show Top Priority"
        : "Show All Features";
      renderNumericalDistributions();
    });
  }

  if (btnToggleAllCatCharts) {
    btnToggleAllCatCharts.addEventListener("click", () => {
      edaState.showAllCatCharts = !edaState.showAllCatCharts;
      btnToggleAllCatCharts.textContent = edaState.showAllCatCharts
        ? "Show Top Priority"
        : "Show All Features";
      renderCategoricalDistributions();
    });
  }

  if (btnToggleOutlierPlots) {
    btnToggleOutlierPlots.addEventListener("click", () => {
      edaState.showOutlierPlots = !edaState.showOutlierPlots;
      btnToggleOutlierPlots.textContent = edaState.showOutlierPlots
        ? "Hide Outlier Charts"
        : "View Outlier Charts";
      if (edaOutlierPlotsGrid) {
        edaOutlierPlotsGrid.style.display = edaState.showOutlierPlots ? "grid" : "none";
      }
    });
  }

  // Manual Studio Render
  if (btnRenderManualChart) {
    btnRenderManualChart.addEventListener("click", () => {
      renderManualChart();
    });
  }

  if (builderChartType) {
    builderChartType.addEventListener("change", () => {
      const type = builderChartType.value;
      if (builderYAxis) {
        builderYAxis.disabled = type === "histogram" || type === "pie" || type === "bar";
      }
    });
  }
}

// -------------------------------------------------------------
// MAIN RENDERER FOR SMART EDA
// -------------------------------------------------------------

function renderSmartEdaView() {
  if (!currentScanResult) return;
  const s = currentScanResult.summary || {};
  const columns = currentScanResult.columns || [];
  const eda = currentScanResult.eda || {};

  // Initialize targets if empty
  const suggested = eda.suggested_targets || [];
  if (edaState.selectedTargets.length === 0) {
    if (suggested.length > 0) {
      edaState.selectedTargets = [suggested[0].column];
    } else {
      edaState.selectedTargets = [];
    }
  }

  // Active target tab
  if (edaState.selectedTargets.length > 0 && !edaState.selectedTargets.includes(edaState.activeTargetTab)) {
    edaState.activeTargetTab = edaState.selectedTargets[0];
  } else if (edaState.selectedTargets.length === 0) {
    edaState.activeTargetTab = null;
  }

  // 1. Header Meta Chips
  if (edaMetaDataset) edaMetaDataset.textContent = s.filename || "dataset.csv";
  if (edaMetaRows) edaMetaRows.textContent = (s.total_rows || 0).toLocaleString();
  if (edaMetaCols) edaMetaCols.textContent = (s.total_cols || columns.length).toString();
  if (edaMetaTarget) {
    if (edaState.selectedTargets.length === 0) {
      edaMetaTarget.textContent = "None (Exploratory)";
    } else if (edaState.selectedTargets.length === 1) {
      edaMetaTarget.textContent = edaState.selectedTargets[0];
    } else {
      edaMetaTarget.textContent = `${edaState.selectedTargets.length} targets (${edaState.activeTargetTab || 'All'})`;
    }
  }

  // 2. Executive Summary KPI Cards
  renderExecutiveSummaryKPIs();

  // 3. Multi-Target Switcher Tabs
  renderTargetTabsBar();

  // 4. Target Analysis Section
  renderTargetAnalysis();

  // 5. Key Non-Causal Insights (01, 02, 03...)
  renderEdaInsights();

  // 6. Feature Relationships (Bivariate 2-Column Grid)
  renderBivariateGrid();

  // 7. Numerical Distributions (2-Column Compact Cards)
  renderNumericalDistributions();

  // 8. Categorical Distributions (2-Column Compact Cards)
  renderCategoricalDistributions();

  // 9. Correlation Analysis (Centered Heatmap + Tables)
  renderCorrelationSection();

  // 10. Outlier Analysis (Table + Toggle Plots)
  renderOutlierSection();

  // 11. Missing Data Breakdown (Horizontal Bars)
  renderMissingnessSection();

  // 12. Manual Studio Controls
  populateManualBuilderControls();
}

// -------------------------------------------------------------
// EXECUTIVE SUMMARY KPIS
// -------------------------------------------------------------

function renderExecutiveSummaryKPIs() {
  if (!edaExecutiveSummary || !currentScanResult) return;
  const s = currentScanResult.summary || {};
  const cols = currentScanResult.columns || [];

  const numCount = cols.filter((c) => c.type === "Integer" || c.type === "Float").length;
  const catCount = cols.filter((c) => c.type === "Categorical / Text" || c.type === "Boolean").length;
  const dateCount = cols.filter((c) => c.type === "Date / Time").length;
  const nullPct = s.total_null_pct !== undefined ? s.total_null_pct : 0;
  const dupeCount = cols.reduce((max, c) => Math.max(max, c.duplicate_count || 0), 0);
  const dupePct = s.total_rows > 0 ? ((dupeCount / s.total_rows) * 100).toFixed(1) : "0.0";
  const targetLabel = edaState.selectedTargets.length > 0 ? edaState.selectedTargets.join(", ") : "None";

  edaExecutiveSummary.innerHTML = `
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>📊</span> Dataset Size</div>
      <div class="kpi-value">${(s.total_rows || 0).toLocaleString()}</div>
      <div class="kpi-sub">Total Observations</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>📐</span> Features</div>
      <div class="kpi-value">${s.total_cols || cols.length}</div>
      <div class="kpi-sub">Total Dimensions</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>🔢</span> Numerical</div>
      <div class="kpi-value">${numCount}</div>
      <div class="kpi-sub">Continuous / Discrete</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>🏷️</span> Categorical</div>
      <div class="kpi-value">${catCount}</div>
      <div class="kpi-sub">Qualitative / Text</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>📅</span> Datetime</div>
      <div class="kpi-value">${dateCount}</div>
      <div class="kpi-sub">Temporal Fields</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>⚠️</span> Missing Values</div>
      <div class="kpi-value" style="color: ${nullPct > 5 ? 'var(--color-amber)' : 'var(--text-main)'};">${nullPct}%</div>
      <div class="kpi-sub">${(s.total_nulls || 0).toLocaleString()} Null Cells</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>🔁</span> Duplicate Rows</div>
      <div class="kpi-value">${dupePct}%</div>
      <div class="kpi-sub">${dupeCount} Duplicate Instances</div>
    </div>
    <div class="eda-summary-kpi-card">
      <div class="kpi-label"><span>🎯</span> Target</div>
      <div class="kpi-value" style="font-size: 0.95rem; color: #60a5fa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(targetLabel)}">${escapeHtml(targetLabel)}</div>
      <div class="kpi-sub">${edaState.selectedTargets.length > 1 ? 'Multi-Target Mode' : 'Supervised Focus'}</div>
    </div>
  `;
}

// -------------------------------------------------------------
// MULTI-TARGET TABS BAR
// -------------------------------------------------------------

function renderTargetTabsBar() {
  if (!edaTargetTabsBar) return;
  const targets = edaState.selectedTargets;

  if (targets.length <= 1) {
    edaTargetTabsBar.style.display = "none";
    return;
  }

  edaTargetTabsBar.style.display = "flex";
  edaTargetTabsBar.innerHTML = targets
    .map((t, idx) => {
      const isActive = (edaState.activeTargetTab === t) || (!edaState.activeTargetTab && idx === 0);
      return `
      <button class="target-tab-btn ${isActive ? 'active' : ''}" onclick="switchActiveTargetTab('${escapeHtml(t)}')">
        <span>🎯 ${escapeHtml(t)}</span>
        <span class="target-tab-badge">Target ${idx + 1}</span>
      </button>
    `;
    })
    .join("");
}

window.switchActiveTargetTab = function(targetName) {
  edaState.activeTargetTab = targetName;
  renderTargetTabsBar();
  renderTargetAnalysis();
  renderBivariateGrid();
  if (edaMetaTarget) {
    edaMetaTarget.textContent = `${edaState.selectedTargets.length} targets (${targetName})`;
  }
};

// -------------------------------------------------------------
// TARGET ANALYSIS SECTION
// -------------------------------------------------------------

function renderTargetAnalysis() {
  if (!edaTargetSection) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const targetAnalyses = eda.target_analyses || [];

  if (edaState.selectedTargets.length === 0 || targetAnalyses.length === 0) {
    edaTargetSection.style.display = "none";
    return;
  }

  edaTargetSection.style.display = "block";

  // Pick active target analysis
  const currentTarget = edaState.activeTargetTab || edaState.selectedTargets[0];
  const tObj = targetAnalyses.find((t) => t.target_column === currentTarget) || targetAnalyses[0];

  if (!tObj) {
    edaTargetSection.style.display = "none";
    return;
  }

  if (edaTargetHeaderPill) {
    edaTargetHeaderPill.textContent = `${tObj.problem_type} • ${tObj.total_count.toLocaleString()} Observations`;
  }

  const isCategorical = tObj.distribution_type === "categorical" || tObj.problem_type.includes("Classification");

  // Chart Pane
  if (edaTargetDistChartPane) {
    if (isCategorical && tObj.class_distribution) {
      edaTargetDistChartPane.innerHTML = `
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
          <span>Class Proportion Distribution</span>
          <span style="color: var(--text-muted);">${tObj.unique_classes} Distinct Classes</span>
        </div>
        ${drawSvgHorizontalBarDistribution(tObj.class_distribution, tObj.target_column)}
      `;
    } else if (tObj.continuous_stats) {
      const histData = (eda.numerical_distributions && eda.numerical_distributions[tObj.target_column] && eda.numerical_distributions[tObj.target_column].histogram) || [];
      edaTargetDistChartPane.innerHTML = `
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
          <span>Continuous Density Histogram</span>
          <span style="color: var(--text-muted);">Range [${tObj.continuous_stats.min} — ${tObj.continuous_stats.max}]</span>
        </div>
        ${drawSvgHistogram(histData, tObj.target_column)}
      `;
    }
  }

  // Stats Pane
  if (edaTargetStatsPane) {
    if (isCategorical && tObj.class_distribution) {
      const topClass = tObj.class_distribution[0] || {};
      edaTargetStatsPane.innerHTML = `
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Target Properties</div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Target Name</span>
          <span class="eda-stat-val">${escapeHtml(tObj.target_column)}</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Inferred Problem</span>
          <span class="eda-stat-val" style="color: #60a5fa;">${escapeHtml(tObj.problem_type)}</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Total Valid Observations</span>
          <span class="eda-stat-val">${tObj.total_count.toLocaleString()}</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Majority Class</span>
          <span class="eda-stat-val">${escapeHtml(String(topClass.class))} (${topClass.percentage}%)</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Class Balance Status</span>
          <span class="eda-stat-val" style="color: ${topClass.percentage > 70 ? 'var(--color-amber)' : 'var(--color-emerald)'};">
            ${topClass.percentage > 70 ? 'Imbalanced' : 'Balanced'}
          </span>
        </div>
      `;
    } else if (tObj.continuous_stats) {
      const cs = tObj.continuous_stats;
      edaTargetStatsPane.innerHTML = `
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Target Properties</div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Target Name</span>
          <span class="eda-stat-val">${escapeHtml(tObj.target_column)}</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Problem Type</span>
          <span class="eda-stat-val" style="color: #60a5fa;">Regression (Continuous)</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Mean ± Std</span>
          <span class="eda-stat-val">${cs.mean} ± ${cs.std !== undefined ? cs.std : '0.0'}</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Median (IQR)</span>
          <span class="eda-stat-val">${cs.median} [${cs.q1 !== undefined ? cs.q1 : cs.min} — ${cs.q3 !== undefined ? cs.q3 : cs.max}]</span>
        </div>
        <div class="eda-stat-row">
          <span class="eda-stat-label">Extreme Range</span>
          <span class="eda-stat-val">${cs.min} to ${cs.max}</span>
        </div>
      `;
    }
  }
}

// -------------------------------------------------------------
// KEY INSIGHTS (Numbered 01, 02...)
// -------------------------------------------------------------

function renderEdaInsights() {
  if (!edaKeyInsightsGrid) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const insights = eda.smart_insights || [];

  if (insights.length === 0) {
    edaKeyInsightsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 1rem; color: var(--text-dim); text-align: center;">
        No critical statistical anomalies or dominant bivariate associations detected.
      </div>
    `;
    return;
  }

  edaKeyInsightsGrid.innerHTML = insights
    .slice(0, 6)
    .map((ins, idx) => {
      const numStr = (idx + 1).toString().padStart(2, "0");
      return `
      <div class="eda-insight-item">
        <div class="insight-num-badge">${numStr}</div>
        <div class="insight-body">
          <div class="insight-title">${escapeHtml(ins.title)}</div>
          <div class="insight-text">${escapeHtml(ins.description)}</div>
        </div>
      </div>
    `;
    })
    .join("");
}

// -------------------------------------------------------------
// FEATURE RELATIONSHIPS (2-Column Grid)
// -------------------------------------------------------------

function renderBivariateGrid() {
  if (!edaBivariateGrid) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const targetAnalyses = eda.target_analyses || [];

  if (edaState.selectedTargets.length === 0 || targetAnalyses.length === 0) {
    edaFeatureRelationshipsSection.style.display = "none";
    return;
  }

  edaFeatureRelationshipsSection.style.display = "block";

  const currentTarget = edaState.activeTargetTab || edaState.selectedTargets[0];
  const tObj = targetAnalyses.find((t) => t.target_column === currentTarget) || targetAnalyses[0];
  const bivariate = (tObj && tObj.bivariate_features) || [];

  if (bivariate.length === 0) {
    edaBivariateGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 1.5rem; color: var(--text-dim); text-align: center;">
        No bivariate feature interactions computed for target <strong>${escapeHtml(currentTarget)}</strong>.
      </div>
    `;
    return;
  }

  edaBivariateGrid.innerHTML = bivariate
    .map((bf) => {
      let chartSvg = "";
      if (bf.chart_type === "scatter" && bf.scatter_sample) {
        chartSvg = drawSvgScatterWithTrend(
          bf.scatter_sample,
          bf.feature,
          tObj.target_column,
          bf.correlation_with_target,
          bf.spearman_rho,
          bf.slope,
          bf.intercept
        );
      } else if (bf.chart_type === "grouped_bar" && bf.group_data) {
        chartSvg = drawSvgGroupedBarChart(bf.feature, tObj.target_column, bf.group_data);
      } else if (bf.chart_type === "distribution_by_class" && bf.group_data) {
        chartSvg = drawSvgClassDistributionBars(bf.feature, tObj.target_column, bf.group_data);
      } else {
        chartSvg = `<div class="chart-empty-placeholder">Interaction plot ready</div>`;
      }

      return `
      <div class="eda-bivariate-card">
        <div class="eda-bivariate-header">
          <div>
            <div class="eda-card-title">${escapeHtml(bf.feature)} <span style="color: var(--text-dim); font-weight: normal;">vs</span> ${escapeHtml(tObj.target_column)}</div>
            <div class="eda-card-subtitle">${escapeHtml(bf.feature_type)} • ${escapeHtml(bf.chart_type.replace(/_/g, ' '))}</div>
          </div>
          <span class="eda-type-tag">${bf.correlation_with_target !== undefined && bf.correlation_with_target !== null ? `r = ${bf.correlation_with_target}` : 'Bivariate'}</span>
        </div>
        <div class="eda-chart-wrap">
          ${chartSvg}
        </div>
        <div class="eda-card-footer">
          <div class="eda-card-insight">
            <span>💡</span> ${escapeHtml(bf.insight || `Statistical relationship between ${bf.feature} and ${tObj.target_column}.`)}
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// -------------------------------------------------------------
// NUMERICAL DISTRIBUTIONS (2-Column Grid)
// -------------------------------------------------------------

function renderNumericalDistributions() {
  if (!edaNumDistributionsGrid) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const numDists = eda.numerical_distributions || {};
  const cols = currentScanResult.columns || [];

  const numCols = Object.keys(numDists);
  if (numCols.length === 0) {
    edaNumericalDistributionsSection.style.display = "none";
    return;
  }

  edaNumericalDistributionsSection.style.display = "block";

  let displayCols = numCols;
  if (!edaState.showAllNumCharts) {
    displayCols = numCols.slice(0, 4);
  }

  edaNumDistributionsGrid.innerHTML = displayCols
    .map((colName) => {
      const data = numDists[colName];
      const stats = data.stats || {};
      const hist = data.histogram || [];
      const skew = data.skewness !== undefined ? data.skewness : 0;
      let skewDesc = "symmetric";
      if (skew > 0.5) skewDesc = "right-skewed";
      else if (skew < -0.5) skewDesc = "left-skewed";

      const chartSvg = drawSvgHistogram(hist, colName);

      return `
      <div class="eda-dist-card">
        <div class="eda-dist-header">
          <div>
            <div class="eda-card-title">${escapeHtml(colName)}</div>
            <div class="eda-card-subtitle">Continuous Numerical Distribution</div>
          </div>
          <span class="eda-type-tag">Histogram</span>
        </div>
        <div class="eda-chart-wrap">
          ${chartSvg}
        </div>
        <div class="eda-dist-stats-bar">
          <div class="eda-dist-stat-item">
            <span>Mean</span>
            <span>${stats.mean !== undefined ? stats.mean : '—'}</span>
          </div>
          <div class="eda-dist-stat-item">
            <span>Median</span>
            <span>${stats.median !== undefined ? stats.median : '—'}</span>
          </div>
          <div class="eda-dist-stat-item">
            <span>Std Dev</span>
            <span>${stats.std !== undefined ? stats.std : '—'}</span>
          </div>
          <div class="eda-dist-stat-item">
            <span>Skewness</span>
            <span>${skew} (${skewDesc})</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// -------------------------------------------------------------
// CATEGORICAL DISTRIBUTIONS (2-Column Grid)
// -------------------------------------------------------------

function renderCategoricalDistributions() {
  if (!edaCatDistributionsGrid) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const catDists = eda.categorical_distributions || {};

  const catCols = Object.keys(catDists);
  if (catCols.length === 0) {
    edaCategoricalDistributionsSection.style.display = "none";
    return;
  }

  edaCategoricalDistributionsSection.style.display = "block";

  let displayCols = catCols;
  if (!edaState.showAllCatCharts) {
    displayCols = catCols.slice(0, 4);
  }

  edaCatDistributionsGrid.innerHTML = displayCols
    .map((colName) => {
      const data = catDists[colName];
      const categories = (data && data.frequencies) || [];
      const unqCount = data.unique_count || categories.length;

      const chartSvg = drawSvgHorizontalBarDistribution(
        categories.map((c) => ({ class: c.value, count: c.count, percentage: c.percentage })),
        colName
      );

      return `
      <div class="eda-dist-card">
        <div class="eda-dist-header">
          <div>
            <div class="eda-card-title">${escapeHtml(colName)}</div>
            <div class="eda-card-subtitle">${unqCount} Distinct Categories</div>
          </div>
          <span class="eda-type-tag">Categorical</span>
        </div>
        <div class="eda-chart-wrap">
          ${chartSvg}
        </div>
        <div class="eda-card-footer">
          <div style="font-size: 0.72rem; color: var(--text-dim);">
            Top Category: <strong>${categories.length > 0 ? escapeHtml(String(categories[0].value)) : '—'}</strong> (${categories.length > 0 ? categories[0].percentage : 0}%)
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// -------------------------------------------------------------
// CORRELATION ANALYSIS (Centered Heatmap + Tables)
// -------------------------------------------------------------

function renderCorrelationSection() {
  if (!edaCorrelationSection) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const corr = eda.correlations || {};
  const numCols = corr.numerical_columns || [];
  const matrix = corr.matrix || {};
  const positivePairs = corr.top_positive || [];
  const negativePairs = corr.top_negative || [];

  if (numCols.length < 2) {
    if (edaHeatmapVisual) {
      edaHeatmapVisual.innerHTML = `<div class="chart-empty-placeholder">Correlation analysis requires at least 2 continuous numerical features.</div>`;
    }
    if (edaPositiveCorrelationsBody) {
      edaPositiveCorrelationsBody.innerHTML = `<tr><td colspan="2" style="color: var(--text-dim); text-align: center;">Not enough numerical columns</td></tr>`;
    }
    if (edaNegativeCorrelationsBody) {
      edaNegativeCorrelationsBody.innerHTML = `<tr><td colspan="2" style="color: var(--text-dim); text-align: center;">Not enough numerical columns</td></tr>`;
    }
    return;
  }

  // Render Heatmap SVG
  if (edaHeatmapVisual) {
    const cellSize = Math.min(56, Math.max(34, Math.floor(400 / numCols.length)));
    const margin = 100;
    const svgWidth = margin + numCols.length * cellSize + 20;
    const svgHeight = margin + numCols.length * cellSize + 20;

    let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="eda-chart-svg" style="max-width: ${svgWidth}px;">`;

    // Column labels (top rotated)
    numCols.forEach((col, i) => {
      const x = margin + i * cellSize + cellSize / 2;
      const y = margin - 10;
      const short = col.length > 10 ? col.slice(0, 9) + "…" : col;
      svg += `<text x="${x}" y="${y}" transform="rotate(-35 ${x} ${y})" text-anchor="start" font-size="10" fill="#9ca3af">${escapeHtml(short)}</text>`;
    });

    // Row labels (left)
    numCols.forEach((rowCol, j) => {
      const x = margin - 10;
      const y = margin + j * cellSize + cellSize / 2 + 4;
      const short = rowCol.length > 11 ? rowCol.slice(0, 10) + "…" : rowCol;
      svg += `<text x="${x}" y="${y}" text-anchor="end" font-size="10" fill="#9ca3af">${escapeHtml(short)}</text>`;
    });

    // Cells
    numCols.forEach((rCol, rIdx) => {
      numCols.forEach((cCol, cIdx) => {
        const x = margin + cIdx * cellSize;
        const y = margin + rIdx * cellSize;
        const rVal = (matrix[rCol] && matrix[rCol][cCol] !== undefined) ? matrix[rCol][cCol] : 0;

        let fillColor = "#111827";
        if (rVal > 0) {
          const op = Math.min(1, Math.max(0.12, rVal));
          fillColor = `rgba(16, 185, 129, ${op})`;
        } else if (rVal < 0) {
          const op = Math.min(1, Math.max(0.12, Math.abs(rVal)));
          fillColor = `rgba(239, 68, 68, ${op})`;
        }

        svg += `
          <rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" rx="3" fill="${fillColor}">
            <title>${escapeHtml(rCol)} ↔ ${escapeHtml(cCol)}: Pearson r = ${rVal}</title>
          </rect>
          <text x="${x + (cellSize - 2) / 2}" y="${y + (cellSize - 2) / 2 + 4}" text-anchor="middle" font-size="${cellSize < 40 ? '9' : '10'}" font-weight="700" fill="#f3f4f6">
            ${rVal.toFixed(2)}
          </text>
        `;
      });
    });

    svg += `</svg>`;
    edaHeatmapVisual.innerHTML = svg;
  }

  // Positive Table
  if (edaPositiveCorrelationsBody) {
    if (positivePairs.length === 0) {
      edaPositiveCorrelationsBody.innerHTML = `<tr><td colspan="2" style="color: var(--text-dim); text-align: center; padding: 0.5rem;">No significant positive associations</td></tr>`;
    } else {
      edaPositiveCorrelationsBody.innerHTML = positivePairs
        .slice(0, 5)
        .map((p) => `
        <tr>
          <td><strong>${escapeHtml(p.feature_a)}</strong> ↔ <strong>${escapeHtml(p.feature_b)}</strong></td>
          <td style="text-align: right;"><span class="eda-corr-badge positive">r = +${p.pearson_r.toFixed(2)}</span></td>
        </tr>
      `)
        .join("");
    }
  }

  // Negative Table
  if (edaNegativeCorrelationsBody) {
    if (negativePairs.length === 0) {
      edaNegativeCorrelationsBody.innerHTML = `<tr><td colspan="2" style="color: var(--text-dim); text-align: center; padding: 0.5rem;">No significant negative associations</td></tr>`;
    } else {
      edaNegativeCorrelationsBody.innerHTML = negativePairs
        .slice(0, 5)
        .map((p) => `
        <tr>
          <td><strong>${escapeHtml(p.feature_a)}</strong> ↔ <strong>${escapeHtml(p.feature_b)}</strong></td>
          <td style="text-align: right;"><span class="eda-corr-badge negative">r = ${p.pearson_r.toFixed(2)}</span></td>
        </tr>
      `)
        .join("");
    }
  }
}

// -------------------------------------------------------------
// OUTLIER ANALYSIS (Summary Table + Plots)
// -------------------------------------------------------------

function renderOutlierSection() {
  if (!edaOutlierSection) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const outliers = eda.outlier_analysis || {};
  const cols = Object.keys(outliers);
  const columns = currentScanResult.columns || [];

  if (cols.length === 0) {
    edaOutlierSection.style.display = "none";
    return;
  }

  edaOutlierSection.style.display = "block";

  if (edaOutlierTableBody) {
    edaOutlierTableBody.innerHTML = cols
      .map((colName) => {
        const item = outliers[colName];
        const count = item.outlier_count || 0;
        const pct = item.outlier_percentage !== undefined ? item.outlier_percentage : 0;
        const lower = item.lower_bound !== undefined ? item.lower_bound : '—';
        const upper = item.upper_bound !== undefined ? item.upper_bound : '—';

        return `
        <tr>
          <td><strong>${escapeHtml(colName)}</strong></td>
          <td><span style="font-family: var(--font-mono); font-weight: 700; color: ${count > 0 ? '#f87171' : 'var(--text-main)'};">${count.toLocaleString()}</span></td>
          <td><span style="font-family: var(--font-mono);">${pct}%</span></td>
          <td style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem;">[${lower} — ${upper}]</td>
        </tr>
      `;
      })
      .join("");
  }

  if (edaOutlierPlotsGrid) {
    edaOutlierPlotsGrid.innerHTML = cols
      .slice(0, 4)
      .map((colName) => {
        const colObj = columns.find((c) => c.name === colName) || {};
        const stats = colObj.numeric_stats || {};
        return `
        <div class="eda-dist-card">
          <div class="eda-dist-header">
            <div class="eda-card-title">${escapeHtml(colName)}</div>
            <span class="eda-type-tag">IQR Box Plot</span>
          </div>
          <div class="eda-chart-wrap">
            ${drawSvgBoxPlot(stats, colName)}
          </div>
        </div>
      `;
      })
      .join("");
  }
}

// -------------------------------------------------------------
// MISSING DATA ANALYSIS (Horizontal Bars)
// -------------------------------------------------------------

function renderMissingnessSection() {
  if (!edaMissingnessSection || !edaMissingnessBars) return;
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const missingData = eda.missing_data || [];

  if (missingData.length === 0) {
    edaMissingnessSection.style.display = "none";
    return;
  }

  edaMissingnessSection.style.display = "block";

  edaMissingnessBars.innerHTML = missingData
    .map((item) => `
    <div class="eda-missing-item">
      <div style="font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.column)}">${escapeHtml(item.column)}</div>
      <div class="eda-bar-track">
        <div class="eda-bar-fill" style="width: ${item.percentage}%;"></div>
      </div>
      <div style="font-family: var(--font-mono); color: var(--text-dim); text-align: right;">${item.null_count.toLocaleString()} nulls</div>
      <div style="font-family: var(--font-mono); font-weight: 700; color: #f87171; text-align: right;">${item.percentage}%</div>
    </div>
  `)
    .join("");
}

// -------------------------------------------------------------
// SVG CHART ENGINE HELPERS (Seaborn / Matplotlib Aesthetic)
// -------------------------------------------------------------

function drawSvgHorizontalBarDistribution(items, colName) {
  if (!items || items.length === 0) return "<div class='chart-empty-placeholder'>No categories available</div>";

  const width = 420;
  const height = Math.min(220, Math.max(120, items.length * 28 + 30));
  const padLeft = 85;
  const padRight = 55;
  const padTop = 15;
  const padBottom = 20;

  const barHeight = Math.min(18, Math.max(10, (height - padTop - padBottom) / items.length - 6));
  const maxPct = Math.max(...items.map((i) => i.percentage || 1)) || 1;

  let bars = items
    .slice(0, 6)
    .map((it, idx) => {
      const y = padTop + idx * (barHeight + 6);
      const w = Math.max(2, ((it.percentage / maxPct) * (width - padLeft - padRight)));
      const label = String(it.class).length > 10 ? String(it.class).slice(0, 9) + "…" : String(it.class);
      return `
      <text x="${padLeft - 8}" y="${y + barHeight / 2 + 4}" text-anchor="end" font-size="10" fill="#9ca3af">${escapeHtml(label)}</text>
      <rect x="${padLeft}" y="${y}" width="${w}" height="${barHeight}" rx="2" class="bar-rect">
        <title>${escapeHtml(String(it.class))}: ${it.count} (${it.percentage}%)</title>
      </rect>
      <text x="${padLeft + w + 6}" y="${y + barHeight / 2 + 3.5}" font-size="9.5" font-family="monospace" fill="#d1d5db">${it.percentage}%</text>
    `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      <line x1="${padLeft}" y1="${padTop - 5}" x2="${padLeft}" y2="${height - padBottom + 5}" class="axis-line" />
      ${bars}
    </svg>
  `;
}

function drawSvgHistogram(bins, colName) {
  if (!bins || bins.length === 0) return "<div class='chart-empty-placeholder'>No numerical bins available</div>";

  const width = 420;
  const height = 180;
  const padLeft = 35;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const maxCount = Math.max(...bins.map((b) => b.count)) || 1;
  const barWidth = (width - padLeft - padRight) / bins.length;

  let bars = bins
    .map((b, idx) => {
      const bx = padLeft + idx * barWidth;
      const barH = ((b.count / maxCount) * (height - padTop - padBottom));
      const by = height - padBottom - barH;
      return `
      <rect x="${bx + 1}" y="${by}" width="${Math.max(1, barWidth - 2)}" height="${barH}" rx="1.5" class="bar-rect" fill="#3b82f6">
        <title>[${b.bin_start} — ${b.bin_end}]: ${b.count} records</title>
      </rect>
      <text x="${bx + barWidth / 2}" y="${height - 12}" text-anchor="middle" font-size="8" fill="#6b7280">${b.bin_start}</text>
    `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      <!-- Grid lines -->
      <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" class="grid-line" />
      <line x1="${padLeft}" y1="${(padTop + height - padBottom) / 2}" x2="${width - padRight}" y2="${(padTop + height - padBottom) / 2}" class="grid-line" />
      <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" class="axis-line" />
      ${bars}
    </svg>
  `;
}

function drawSvgScatterWithTrend(points, xLabel, yLabel, corr, spearman, slope, intercept) {
  if (!points || points.length === 0) return "<div class='chart-empty-placeholder'>No coordinate pairs</div>";

  const width = 420;
  const height = 210;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 20;
  const padBottom = 35;

  const xVals = points.map((p) => p.x);
  const yVals = points.map((p) => p.y);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals) || minX + 1;
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals) || minY + 1;

  const scaleX = (x) => padLeft + ((x - minX) / (maxX - minX)) * (width - padLeft - padRight);
  const scaleY = (y) => height - padBottom - ((y - minY) / (maxY - minY)) * (height - padTop - padBottom);

  let dots = points
    .map((p) => {
      const cx = scaleX(p.x);
      const cy = scaleY(p.y);
      return `<circle cx="${cx}" cy="${cy}" r="3.5" class="scatter-dot">
        <title>${escapeHtml(xLabel)}: ${p.x}\n${escapeHtml(yLabel)}: ${p.y}</title>
      </circle>`;
    })
    .join("");

  // Trend line calculation
  let trendLine = "";
  if (slope !== undefined && intercept !== undefined && slope !== null) {
    const yAtMinX = slope * minX + intercept;
    const yAtMaxX = slope * maxX + intercept;
    const x1 = scaleX(minX);
    const y1 = scaleY(yAtMinX);
    const x2 = scaleX(maxX);
    const y2 = scaleY(yAtMaxX);
    trendLine = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="trend-line" />`;
  }

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" class="axis-line" />
      <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${height - padBottom}" class="axis-line" />
      
      <text x="${(width + padLeft - padRight) / 2}" y="${height - 10}" text-anchor="middle" class="axis-title">${escapeHtml(xLabel)}</text>
      <text x="14" y="${(height + padTop - padBottom) / 2}" transform="rotate(-90 14 ${(height + padTop - padBottom) / 2})" text-anchor="middle" class="axis-title">${escapeHtml(yLabel)}</text>
      
      ${dots}
      ${trendLine}
    </svg>
  `;
}

function drawSvgGroupedBarChart(featName, targetName, groupData) {
  const cats = Object.keys(groupData).slice(0, 5);
  if (cats.length === 0) return "<div class='chart-empty-placeholder'>No data</div>";

  const width = 420;
  const height = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  const targetClasses = new Set();
  cats.forEach((c) => Object.keys(groupData[c]).forEach((t) => targetClasses.add(t)));
  const tClassList = Array.from(targetClasses);

  const groupWidth = (width - padLeft - padRight) / cats.length;
  const barWidth = Math.max(4, (groupWidth - 8) / tClassList.length);

  let maxVal = 1;
  cats.forEach((c) => {
    Object.values(groupData[c]).forEach((v) => {
      if (v > maxVal) maxVal = v;
    });
  });

  let svg = `<svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">`;
  svg += `<line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" class="axis-line" />`;

  cats.forEach((cat, cIdx) => {
    const groupX = padLeft + cIdx * groupWidth;
    const catLabel = cat.length > 7 ? cat.slice(0, 6) + "…" : cat;

    svg += `<text x="${groupX + groupWidth / 2}" y="${height - 12}" text-anchor="middle" font-size="9" fill="#9ca3af">${escapeHtml(catLabel)}</text>`;

    tClassList.forEach((tClass, tIdx) => {
      const cnt = groupData[cat][tClass] || 0;
      const barH = (cnt / maxVal) * (height - padTop - padBottom);
      const bx = groupX + 3 + tIdx * barWidth;
      const by = height - padBottom - barH;
      const bColor = colors[tIdx % colors.length];

      svg += `
        <rect x="${bx}" y="${by}" width="${barWidth - 2}" height="${barH}" rx="1.5" fill="${bColor}">
          <title>${escapeHtml(cat)} → ${escapeHtml(tClass)}: ${cnt}</title>
        </rect>
      `;
    });
  });

  svg += `</svg>`;
  return svg;
}

function drawSvgClassDistributionBars(featName, targetName, groupData) {
  const classes = Object.keys(groupData).slice(0, 5);
  const width = 420;
  const height = 190;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  const barW = Math.min(50, (width - padLeft - padRight) / classes.length - 12);
  let maxMean = 1;
  classes.forEach((c) => {
    if (groupData[c].mean > maxMean) maxMean = groupData[c].mean;
  });

  let svg = `<svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">`;
  svg += `<line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" class="axis-line" />`;

  classes.forEach((cls, idx) => {
    const stat = groupData[cls];
    const bx = padLeft + idx * (barW + 16) + 8;
    const bh = (stat.mean / maxMean) * (height - padTop - padBottom);
    const by = height - padBottom - bh;
    const clr = colors[idx % colors.length];
    const lbl = cls.length > 8 ? cls.slice(0, 7) + "…" : cls;

    svg += `
      <rect x="${bx}" y="${by}" width="${barW}" height="${bh}" rx="2" fill="${clr}">
        <title>${escapeHtml(targetName)} = ${escapeHtml(cls)}: Mean ${escapeHtml(featName)} = ${stat.mean}</title>
      </rect>
      <text x="${bx + barW / 2}" y="${by - 4}" text-anchor="middle" font-size="9" font-family="monospace" fill="#f3f4f6">${stat.mean}</text>
      <text x="${bx + barW / 2}" y="${height - 12}" text-anchor="middle" font-size="9" fill="#9ca3af">${escapeHtml(lbl)}</text>
    `;
  });

  svg += `</svg>`;
  return svg;
}

function drawSvgBoxPlot(stats, colName) {
  const width = 380;
  const height = 150;
  const pad = 40;

  const min = stats.min !== undefined ? stats.min : 0;
  const max = stats.max !== undefined ? stats.max : 100;
  const q1 = stats.q1 !== undefined ? stats.q1 : min;
  const q3 = stats.q3 !== undefined ? stats.q3 : max;
  const med = stats.median !== undefined ? stats.median : stats.mean || 0;

  const range = max - min || 1;
  const scale = (val) => pad + ((val - min) / range) * (width - pad * 2);

  const xMin = scale(min);
  const xMax = scale(max);
  const xQ1 = scale(q1);
  const xQ3 = scale(q3);
  const xMed = scale(med);
  const midY = height / 2;

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      <!-- Whiskers -->
      <line x1="${xMin}" y1="${midY}" x2="${xQ1}" y2="${midY}" stroke="#3b82f6" stroke-width="2" />
      <line x1="${xQ3}" y1="${midY}" x2="${xMax}" y2="${midY}" stroke="#3b82f6" stroke-width="2" />
      <line x1="${xMin}" y1="${midY - 12}" x2="${xMin}" y2="${midY + 12}" stroke="#3b82f6" stroke-width="2" />
      <line x1="${xMax}" y1="${midY - 12}" x2="${xMax}" y2="${midY + 12}" stroke="#3b82f6" stroke-width="2" />

      <!-- Box (IQR) -->
      <rect x="${xQ1}" y="${midY - 22}" width="${Math.max(2, xQ3 - xQ1)}" height="44" rx="2" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" stroke-width="2" />

      <!-- Median line -->
      <line x1="${xMed}" y1="${midY - 22}" x2="${xMed}" y2="${midY + 22}" stroke="#f59e0b" stroke-width="2.5" />

      <!-- Labels -->
      <text x="${xMin}" y="${midY + 30}" text-anchor="middle" font-size="8.5" fill="#9ca3af">Min: ${min}</text>
      <text x="${xMed}" y="${midY - 28}" text-anchor="middle" font-size="8.5" fill="#f59e0b">Med: ${med}</text>
      <text x="${xMax}" y="${midY + 30}" text-anchor="middle" font-size="8.5" fill="#9ca3af">Max: ${max}</text>
    </svg>
  `;
}

// -------------------------------------------------------------
// CONFIG POPOVER MODAL LOGIC
// -------------------------------------------------------------

function populateEdaConfigModal() {
  if (!currentScanResult) return;
  const cols = currentScanResult.columns || [];

  // Populate Target List (Checkboxes for multi-target)
  if (edaTargetCheckboxesList) {
    edaTargetCheckboxesList.innerHTML = cols
      .map((c) => {
        const isChecked = edaState.selectedTargets.includes(c.name) ? "checked" : "";
        return `
        <label class="eda-col-check-item">
          <input type="checkbox" name="targetModalCheck" value="${escapeHtml(c.name)}" ${isChecked} />
          <span>${escapeHtml(c.name)}</span>
          <span style="margin-left: auto; font-size: 0.68rem; color: var(--text-dim);">${escapeHtml(c.type)}</span>
        </label>
      `;
      })
      .join("");
  }

  // Populate Features List
  renderModalFeatureItems();
}

function autoDetectTargetsInModal() {
  if (!currentScanResult || !edaTargetCheckboxesList) return;
  const eda = currentScanResult.eda || {};
  const suggested = eda.suggested_targets || [];
  const cbs = edaTargetCheckboxesList.querySelectorAll("input[type='checkbox']");

  if (suggested.length > 0) {
    const topCol = suggested[0].column;
    cbs.forEach((cb) => {
      cb.checked = cb.value === topCol;
    });
  } else {
    cbs.forEach((cb) => (cb.checked = false));
  }
}

function autoSelectFeaturesInModal() {
  if (!currentScanResult || !edaFeatureCheckboxesList) return;
  const cbs = edaFeatureCheckboxesList.querySelectorAll("input[type='checkbox']");
  const totalRows = currentScanResult.summary.total_rows || 1;

  cbs.forEach((cb) => {
    const colName = cb.value;
    const col = currentScanResult.columns.find((c) => c.name === colName);
    if (!col) return;
    const nameLower = colName.toLowerCase();
    const isId =
      nameLower.includes("id") ||
      nameLower.includes("key") ||
      nameLower.includes("uuid") ||
      nameLower.includes("guid") ||
      (col.unique_count / totalRows >= 0.95 && col.type === "Categorical / Text" && totalRows >= 10);
    cb.checked = !isId;
  });
}

function renderModalFeatureItems() {
  if (!edaFeatureCheckboxesList || !currentScanResult) return;
  const cols = currentScanResult.columns || [];
  const selectedSet = new Set(edaState.selectedFeatures.length > 0 ? edaState.selectedFeatures : cols.map((c) => c.name));

  edaFeatureCheckboxesList.innerHTML = cols
    .map((c) => {
      const isChecked = selectedSet.has(c.name) ? "checked" : "";
      return `
      <label class="eda-col-check-item" data-col-name="${escapeHtml(c.name)}" data-col-type="${escapeHtml(c.type)}">
        <input type="checkbox" value="${escapeHtml(c.name)}" ${isChecked} />
        <span>${escapeHtml(c.name)}</span>
        <span style="margin-left: auto; font-size: 0.68rem; color: var(--text-dim);">${escapeHtml(c.type)}</span>
      </label>
    `;
    })
    .join("");

  filterModalFeatureList();
}

function filterModalFeatureList() {
  if (!edaFeatureCheckboxesList) return;
  const items = edaFeatureCheckboxesList.querySelectorAll(".eda-col-check-item");
  const filter = edaState.featFilter;
  const search = edaState.featSearch;

  items.forEach((it) => {
    const name = it.getAttribute("data-col-name") || "";
    const type = it.getAttribute("data-col-type") || "";

    let matchType = true;
    if (filter === "num") matchType = type === "Integer" || type === "Float";
    else if (filter === "cat") matchType = type === "Categorical / Text" || type === "Boolean";
    else if (filter === "date") matchType = type === "Date / Time";

    const matchSearch = !search || name.toLowerCase().includes(search);

    it.style.display = matchType && matchSearch ? "flex" : "none";
  });
}

async function syncModalSelectionsAndRecompute() {
  if (!currentScanResult) return;
  const targetCbs = edaTargetCheckboxesList.querySelectorAll("input[type='checkbox']:checked");
  const featCbs = edaFeatureCheckboxesList.querySelectorAll("input[type='checkbox']:checked");

  const newTargets = Array.from(targetCbs).map((cb) => cb.value);
  const newFeatures = Array.from(featCbs).map((cb) => cb.value);

  edaState.selectedTargets = newTargets;
  edaState.selectedFeatures = newFeatures;
  edaState.activeTargetTab = newTargets.length > 0 ? newTargets[0] : null;

  await generateEdaAnalysis();
}

async function generateEdaAnalysis() {
  if (!currentScanResult) return;

  try {
    if (btnRegenerateEda) {
      btnRegenerateEda.disabled = true;
      btnRegenerateEda.innerHTML = `<span>⚡ Processing...</span>`;
    }

    const res = await fetch("/api/eda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scan_result: currentScanResult,
        targets: edaState.selectedTargets,
        features: edaState.selectedFeatures,
      }),
    });

    if (res.ok) {
      const newEda = await res.json();
      currentScanResult.eda = newEda;
      renderSmartEdaView();
    }
  } catch (err) {
    console.error("Failed to recompute EDA", err);
  } finally {
    if (btnRegenerateEda) {
      btnRegenerateEda.disabled = false;
      btnRegenerateEda.innerHTML = `<span>⚡ Regenerate</span>`;
    }
  }
}

// -------------------------------------------------------------
// MANUAL STUDIO LOGIC
// -------------------------------------------------------------

function populateManualBuilderControls() {
  if (!currentScanResult) return;
  const cols = currentScanResult.columns || [];

  const optHtml = cols
    .map((c) => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)} (${c.type})</option>`)
    .join("");

  const optNoneHtml = `<option value="">-- None / Default --</option>` + optHtml;

  if (builderXAxis) builderXAxis.innerHTML = optHtml;
  if (builderYAxis) builderYAxis.innerHTML = optNoneHtml;
  if (builderColorBy) builderColorBy.innerHTML = optNoneHtml;

  if (cols.length > 1) {
    if (builderXAxis) builderXAxis.selectedIndex = 0;
    if (builderYAxis) builderYAxis.selectedIndex = 1;
  }
}

function renderManualChart() {
  if (!currentScanResult || !currentScanResult.preview_rows || !manualChartContainer) return;
  const chartType = builderChartType ? builderChartType.value : "scatter";
  const xCol = builderXAxis ? builderXAxis.value : "";
  const yCol = builderYAxis ? builderYAxis.value : "";
  const colorCol = builderColorBy ? builderColorBy.value : "";
  const rows = currentScanResult.preview_rows;
  const cols = currentScanResult.columns;

  const xObj = cols.find((c) => c.name === xCol);
  const yObj = cols.find((c) => c.name === yCol);

  if ((chartType === "scatter" || chartType === "line") && !yCol) {
    manualChartContainer.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-sm); padding: 1rem; color: #f87171; font-size: 0.8rem;">
        ⚠️ <strong>Invalid Specification:</strong> ${escapeHtml(chartType)} chart requires both X and Y axes.
      </div>
    `;
    return;
  }

  let chartSvg = "";
  if (chartType === "scatter") {
    const points = rows
      .filter((r) => r[xCol] !== null && r[yCol] !== null && !isNaN(Number(r[xCol])) && !isNaN(Number(r[yCol])))
      .map((r) => ({ x: Number(r[xCol]), y: Number(r[yCol]) }));
    chartSvg = drawSvgScatterWithTrend(points, xCol, yCol, null, null, null, null);
  } else if (chartType === "bar") {
    const counts = {};
    rows.forEach((r) => {
      const v = r[xCol] !== undefined && r[xCol] !== null ? String(r[xCol]) : "<null>";
      counts[v] = (counts[v] || 0) + 1;
    });
    const categories = Object.entries(counts)
      .slice(0, 8)
      .map(([cls, count]) => ({ class: cls, count, percentage: Math.round((count / rows.length) * 100) }));
    chartSvg = drawSvgHorizontalBarDistribution(categories, xCol);
  } else if (chartType === "histogram") {
    const nums = rows.map((r) => Number(r[xCol])).filter((n) => !isNaN(n));
    if (nums.length >= 2) {
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const binCount = 7;
      const step = (max - min) / binCount || 1;
      const bins = [];
      for (let i = 0; i < binCount; i++) {
        const bMin = min + i * step;
        const bMax = bMin + step;
        const count = nums.filter((n) => (i === binCount - 1 ? n >= bMin && n <= bMax : n >= bMin && n < bMax)).length;
        bins.push({ bin_start: Math.round(bMin * 10) / 10, bin_end: Math.round(bMax * 10) / 10, count });
      }
      chartSvg = drawSvgHistogram(bins, xCol);
    }
  } else if (chartType === "boxplot" && xObj && xObj.numeric_stats) {
    chartSvg = drawSvgBoxPlot(xObj.numeric_stats, xCol);
  } else {
    chartSvg = `<div class="chart-empty-placeholder">Interactive custom rendering generated.</div>`;
  }

  manualChartContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.65rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size: 0.9rem; color: var(--text-main);">${escapeHtml(chartType.toUpperCase())}: ${escapeHtml(xCol)} ${yCol ? `vs ` + escapeHtml(yCol) : ''}</h4>
      </div>
      <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        ${chartSvg}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PYTHON EDA REPORT EXPORT (Jupyter / Seaborn Report Mode)
// -------------------------------------------------------------

function exportPythonEdaReport() {
  if (!currentScanResult) return;
  const s = currentScanResult.summary || {};
  const d = currentScanResult.dimensions || {};
  const cols = currentScanResult.columns || [];
  const eda = currentScanResult.eda || {};
  const insights = eda.smart_insights || [];
  const targets = eda.target_analyses || [];
  const corr = eda.correlations || {};
  const corrPairs = corr.ranked_pairs || [];
  const outliers = eda.outlier_analysis || {};
  const missing = eda.missing_data || [];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Python EDA Audit Report — ${escapeHtml(s.filename)}</title>
  <style>
    :root {
      --bg: #090d16;
      --card: #111827;
      --card-sub: #1f2937;
      --border: #374151;
      --text: #f9fafb;
      --text-dim: #9ca3af;
      --blue: #3b82f6;
      --emerald: #10b981;
      --amber: #f59e0b;
      --rose: #f43f5e;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2.5rem;
      margin: 0;
      line-height: 1.6;
    }
    .notebook-container {
      max-width: 1040px;
      margin: 0 auto;
    }
    .report-header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .report-title {
      font-size: 1.85rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem 0;
      color: #ffffff;
    }
    .report-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-dim);
    }
    .report-meta strong {
      color: var(--text);
    }
    .section-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.5rem;
      margin-bottom: 1.75rem;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .tag {
      font-size: 0.72rem;
      font-family: monospace;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.15);
      color: var(--blue);
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.85rem;
      font-size: 0.85rem;
    }
    th, td {
      text-align: left;
      padding: 0.65rem 0.85rem;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: var(--card-sub);
      color: var(--text-dim);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .insight-card {
      background: var(--card-sub);
      border-left: 4px solid var(--blue);
      border-radius: 6px;
      padding: 1rem;
    }
    .insight-card strong {
      display: block;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    .insight-card p {
      margin: 0;
      font-size: 0.82rem;
      color: var(--text-dim);
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .kpi-item {
      background: var(--card-sub);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }
    .kpi-item span {
      display: block;
      font-size: 0.75rem;
      color: var(--text-dim);
      text-transform: uppercase;
    }
    .kpi-item strong {
      font-size: 1.4rem;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="notebook-container">
    <div class="report-header">
      <div class="report-title">Data Sarthi — Exploratory Data Analysis Report</div>
      <div class="report-meta">
        <div>Dataset: <strong>${escapeHtml(s.filename)}</strong></div>
        <div>Observations: <strong>${(s.total_rows || 0).toLocaleString()}</strong></div>
        <div>Features: <strong>${s.total_cols || cols.length}</strong></div>
        <div>Timestamp: <strong>${new Date().toISOString()}</strong></div>
      </div>
    </div>

    <!-- Executive Summary KPIs -->
    <div class="kpi-grid">
      <div class="kpi-item">
        <span>Quality Health</span>
        <strong style="color: var(--emerald);">${s.overall_quality_score}/100</strong>
      </div>
      <div class="kpi-item">
        <span>Completeness</span>
        <strong>${d.completeness}%</strong>
      </div>
      <div class="kpi-item">
        <span>Missing Cells</span>
        <strong style="color: ${(s.total_null_pct || 0) > 5 ? 'var(--amber)' : 'var(--text)'};">${s.total_null_pct || 0}%</strong>
      </div>
      <div class="kpi-item">
        <span>Target(s)</span>
        <strong style="color: var(--blue); font-size: 1rem;">${edaState.selectedTargets.length > 0 ? escapeHtml(edaState.selectedTargets.join(', ')) : 'None'}</strong>
      </div>
    </div>

    <!-- Key Insights -->
    <div class="section-card">
      <h2>1. Key Analytical Observations (${insights.length})</h2>
      <div class="grid-2">
        ${insights.map((ins, idx) => `
          <div class="insight-card">
            <strong>${idx + 1}. ${escapeHtml(ins.title)}</strong>
            <p>${escapeHtml(ins.description)}</p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Target Analysis -->
    ${targets.map((t, idx) => `
      <div class="section-card">
        <h2>2.${idx + 1} Target Analysis: ${escapeHtml(t.target_column)} <span class="tag">${escapeHtml(t.problem_type)}</span></h2>
        <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: -0.5rem;">Total Analyzed Records: ${t.total_count.toLocaleString()}</p>
        
        ${t.class_distribution ? `
          <table>
            <thead><tr><th>Class Label</th><th>Count</th><th>Proportion</th></tr></thead>
            <tbody>
              ${t.class_distribution.map(cd => `
                <tr>
                  <td><strong>${escapeHtml(String(cd.class))}</strong></td>
                  <td>${cd.count.toLocaleString()}</td>
                  <td><strong>${cd.percentage}%</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ''}

        ${t.continuous_stats ? `
          <table>
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Mean</td><td>${t.continuous_stats.mean}</td></tr>
              <tr><td>Median</td><td>${t.continuous_stats.median}</td></tr>
              <tr><td>Range [Min — Max]</td><td>${t.continuous_stats.min} — ${t.continuous_stats.max}</td></tr>
            </tbody>
          </table>
        ` : ''}
      </div>
    `).join("")}

    <!-- Top Correlations -->
    <div class="section-card">
      <h2>3. Pearson Correlation Coefficients</h2>
      <table>
        <thead><tr><th>Feature A</th><th>Feature B</th><th>Pearson r</th><th>Interpretation</th></tr></thead>
        <tbody>
          ${corrPairs.slice(0, 10).map(cp => `
            <tr>
              <td><strong>${escapeHtml(cp.feature_a)}</strong></td>
              <td><strong>${escapeHtml(cp.feature_b)}</strong></td>
              <td style="font-family: monospace; font-weight: bold; color: ${cp.pearson_r > 0 ? 'var(--emerald)' : 'var(--rose)'};">${cp.pearson_r > 0 ? '+' : ''}${cp.pearson_r.toFixed(3)}</td>
              <td>${escapeHtml(cp.strength)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Outlier Table -->
    <div class="section-card">
      <h2>4. Outlier Detection Summary (IQR Method)</h2>
      <table>
        <thead><tr><th>Feature</th><th>Outlier Count</th><th>Outlier %</th><th>Acceptable Bounds [Q1-1.5*IQR, Q3+1.5*IQR]</th></tr></thead>
        <tbody>
          ${Object.keys(outliers).map(col => {
            const o = outliers[col];
            return `
              <tr>
                <td><strong>${escapeHtml(col)}</strong></td>
                <td>${o.outlier_count}</td>
                <td>${o.outlier_percentage}%</td>
                <td style="font-family: monospace;">[${o.lower_bound} — ${o.upper_bound}]</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- Missing Data -->
    <div class="section-card">
      <h2>5. Missing Value Statistics</h2>
      <table>
        <thead><tr><th>Feature</th><th>Missing Count</th><th>Missing %</th></tr></thead>
        <tbody>
          ${missing.map(m => `
            <tr>
              <td><strong>${escapeHtml(m.column)}</strong></td>
              <td>${m.null_count.toLocaleString()}</td>
              <td style="color: var(--amber); font-weight: bold;">${m.percentage}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div style="text-align: center; color: var(--text-dim); font-size: 0.75rem; margin-top: 2rem;">
      Generated automatically by Data Sarthi Smart EDA Visual Analytics Engine
    </div>
  </div>
</body>
</html>`;

  downloadFile(html, `${currentFilename}_eda_report.html`, "text/html");
}

window.exportEdaReport = exportPythonEdaReport;
window.exportPythonEdaReport = exportPythonEdaReport;


