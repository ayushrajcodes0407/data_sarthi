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

// Smart EDA Elements
const modeSmartRadio = document.getElementById("modeSmartRadio");
const modeManualRadio = document.getElementById("modeManualRadio");
const btnEdaAutoDetect = document.getElementById("btnEdaAutoDetect");
const btnEdaNoTarget = document.getElementById("btnEdaNoTarget");
const targetSuggestionBox = document.getElementById("targetSuggestionBox");
const targetSuggestionText = document.getElementById("targetSuggestionText");
const edaTargetCheckboxes = document.getElementById("edaTargetCheckboxes");
const edaProblemTypeBadge = document.getElementById("edaProblemTypeBadge");
const btnEdaSelectAllFeatures = document.getElementById("btnEdaSelectAllFeatures");
const btnEdaAutoFeatures = document.getElementById("btnEdaAutoFeatures");
const btnEdaClearFeatures = document.getElementById("btnEdaClearFeatures");
const edaFeatureCheckboxes = document.getElementById("edaFeatureCheckboxes");
const btnGenerateEda = document.getElementById("btnGenerateEda");
const btnExportEdaReport = document.getElementById("btnExportEdaReport");
const edaSmartAnalysisContainer = document.getElementById("edaSmartAnalysisContainer");
const edaManualExplorationContainer = document.getElementById("edaManualExplorationContainer");
const edaInsightsCountBadge = document.getElementById("edaInsightsCountBadge");
const edaInsightsContainer = document.getElementById("edaInsightsContainer");
const edaTargetSection = document.getElementById("edaTargetSection");
const edaTargetHeaderPill = document.getElementById("edaTargetHeaderPill");
const edaTargetChartsGrid = document.getElementById("edaTargetChartsGrid");
const edaHeatmapVisual = document.getElementById("edaHeatmapVisual");
const edaTopCorrelationsBody = document.getElementById("edaTopCorrelationsBody");
const btnToggleAllCharts = document.getElementById("btnToggleAllCharts");
const edaDistributionsGrid = document.getElementById("edaDistributionsGrid");

// Manual Chart Builder Elements
const builderChartType = document.getElementById("builderChartType");
const builderXAxis = document.getElementById("builderXAxis");
const builderYAxis = document.getElementById("builderYAxis");
const builderColorBy = document.getElementById("builderColorBy");
const btnRenderManualChart = document.getElementById("btnRenderManualChart");
const manualChartContainer = document.getElementById("manualChartContainer");

// EDA State
let edaState = {
  selectedTargets: [],
  selectedFeatures: [],
  showAllCharts: false,
  mode: "smart"
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
   SMART EDA & VISUAL ANALYTICS MODULE
   ========================================================================== */

function setupSmartEdaListeners() {
  if (!modeSmartRadio) return;

  // Mode radio toggle
  modeSmartRadio.addEventListener("change", () => {
    edaState.mode = "smart";
    edaSmartAnalysisContainer.style.display = "block";
    edaManualExplorationContainer.style.display = "none";
  });

  modeManualRadio.addEventListener("change", () => {
    edaState.mode = "manual";
    edaSmartAnalysisContainer.style.display = "none";
    edaManualExplorationContainer.style.display = "block";
    populateManualBuilderControls();
  });

  // Target quick buttons
  btnEdaAutoDetect.addEventListener("click", () => {
    autoDetectTargets();
  });

  btnEdaNoTarget.addEventListener("click", () => {
    const tCheckboxes = edaTargetCheckboxes.querySelectorAll("input[type='checkbox']");
    tCheckboxes.forEach((cb) => (cb.checked = false));
    syncSelectedTargetsFromCheckboxes();
  });

  // Feature quick buttons
  btnEdaSelectAllFeatures.addEventListener("click", () => {
    const fCheckboxes = edaFeatureCheckboxes.querySelectorAll("input[type='checkbox']");
    fCheckboxes.forEach((cb) => (cb.checked = true));
  });

  btnEdaAutoFeatures.addEventListener("click", () => {
    autoSelectFeatures();
  });

  btnEdaClearFeatures.addEventListener("click", () => {
    const fCheckboxes = edaFeatureCheckboxes.querySelectorAll("input[type='checkbox']");
    fCheckboxes.forEach((cb) => (cb.checked = false));
  });

  // Generate EDA Action
  btnGenerateEda.addEventListener("click", () => {
    generateEdaAnalysis();
  });

  // Export EDA Report
  btnExportEdaReport.addEventListener("click", () => {
    exportEdaReport();
  });

  // Toggle all charts
  btnToggleAllCharts.addEventListener("click", () => {
    edaState.showAllCharts = !edaState.showAllCharts;
    btnToggleAllCharts.textContent = edaState.showAllCharts
      ? "Show Priority Recommended Only"
      : "Show All Available Charts";
    renderDistributionCharts();
  });

  // Manual Builder Render
  btnRenderManualChart.addEventListener("click", () => {
    renderManualChart();
  });

  // Auto-populate Y & Color depending on chart type
  builderChartType.addEventListener("change", () => {
    const type = builderChartType.value;
    if (type === "histogram" || type === "pie") {
      builderYAxis.disabled = true;
    } else {
      builderYAxis.disabled = false;
    }
  });
}

function autoDetectTargets() {
  if (!currentScanResult) return;
  const eda = currentScanResult.eda;
  const suggested = eda && eda.suggested_targets ? eda.suggested_targets : [];
  const tCheckboxes = edaTargetCheckboxes.querySelectorAll("input[type='checkbox']");

  if (suggested.length > 0) {
    const topCol = suggested[0].column;
    tCheckboxes.forEach((cb) => {
      cb.checked = cb.value === topCol;
    });
  } else {
    tCheckboxes.forEach((cb) => (cb.checked = false));
  }
  syncSelectedTargetsFromCheckboxes();
}

function autoSelectFeatures() {
  if (!currentScanResult) return;
  const fCheckboxes = edaFeatureCheckboxes.querySelectorAll("input[type='checkbox']");
  const eda = currentScanResult.eda;
  const idCols = new Set();

  currentScanResult.columns.forEach((c) => {
    const nameLower = c.name.toLowerCase();
    if (
      nameLower.includes("id") ||
      nameLower.includes("key") ||
      nameLower.includes("uuid") ||
      nameLower.includes("guid") ||
      (c.unique_count / (currentScanResult.summary.total_rows || 1) >= 0.95 &&
        c.type === "Categorical / Text" &&
        currentScanResult.summary.total_rows >= 10)
    ) {
      idCols.add(c.name);
    }
  });

  fCheckboxes.forEach((cb) => {
    cb.checked = !idCols.has(cb.value);
  });
}

function syncSelectedTargetsFromCheckboxes() {
  const tCheckboxes = edaTargetCheckboxes.querySelectorAll("input[type='checkbox']");
  const selected = [];
  tCheckboxes.forEach((cb) => {
    if (cb.checked) selected.push(cb.value);
  });
  edaState.selectedTargets = selected;
  updateProblemTypeDisplay();
}

function updateProblemTypeDisplay() {
  if (!currentScanResult) return;
  const targets = edaState.selectedTargets;

  if (targets.length === 0) {
    edaProblemTypeBadge.innerHTML = `Problem Type: <strong>Unsupervised / Exploratory</strong>`;
    edaProblemTypeBadge.className = "problem-type-pill";
    return;
  }

  const firstCol = currentScanResult.columns.find((c) => c.name === targets[0]);
  if (!firstCol) return;

  let pType = "Classification";
  const nameLower = firstCol.name.toLowerCase();
  const regKeywords = ["price", "revenue", "amount", "cost", "salary", "sales", "fare", "fee", "val", "value", "total", "rate", "income"];

  if (firstCol.type === "Date / Time") pType = "Time Series";
  else if (firstCol.unique_count === 2 || firstCol.type === "Boolean") pType = "Binary Classification";
  else if (firstCol.type === "Integer" || firstCol.type === "Float") {
    if (firstCol.type === "Integer" && firstCol.unique_count <= 5 && !regKeywords.some((k) => nameLower.includes(k))) {
      pType = "Multiclass Classification";
    } else {
      pType = "Regression";
    }
  } else if (firstCol.type === "Categorical / Text") pType = "Multiclass Classification";

  if (targets.length > 1) {
    pType = `Multi-Target (${targets.length}): ${pType}`;
  }

  edaProblemTypeBadge.innerHTML = `Problem Type: <strong>${escapeHtml(pType)}</strong>`;
  edaProblemTypeBadge.className = "problem-type-pill active";
}

function renderSmartEdaView() {
  if (!currentScanResult) return;
  const eda = currentScanResult.eda || {};
  const columns = currentScanResult.columns || [];

  // 1. Suggestion Banner
  const suggested = eda.suggested_targets || [];
  if (suggested.length > 0) {
    const top = suggested[0];
    targetSuggestionBox.style.display = "block";
    targetSuggestionText.innerHTML = `💡 Suggested Target: <strong>${escapeHtml(
      top.column
    )}</strong> (${escapeHtml(top.problem_type)}) — <span style="opacity: 0.85">${escapeHtml(
      top.reason
    )}</span>`;
  } else {
    targetSuggestionBox.style.display = "none";
  }

  // 2. Render Target Checkboxes
  const currentSelectedTargets = new Set(
    edaState.selectedTargets.length > 0
      ? edaState.selectedTargets
      : suggested.length > 0
      ? [suggested[0].column]
      : []
  );
  edaState.selectedTargets = Array.from(currentSelectedTargets);

  edaTargetCheckboxes.innerHTML = columns
    .map((c) => {
      const isChecked = currentSelectedTargets.has(c.name) ? "checked" : "";
      return `
      <label class="checkbox-label">
        <input type="checkbox" value="${escapeHtml(c.name)}" ${isChecked} onchange="syncSelectedTargetsFromCheckboxes()" />
        <span class="chk-text">${escapeHtml(c.name)}</span>
        <span class="chk-meta">${escapeHtml(c.type)} • ${c.unique_count} unq</span>
      </label>
    `;
    })
    .join("");

  // 3. Render Feature Checkboxes
  const featureCols = columns.filter((c) => {
    const nameLower = c.name.toLowerCase();
    const isId =
      nameLower.includes("id") ||
      nameLower.includes("key") ||
      nameLower.includes("uuid") ||
      nameLower.includes("guid") ||
      (c.unique_count / (currentScanResult.summary.total_rows || 1) >= 0.95 &&
        c.type === "Categorical / Text" &&
        currentScanResult.summary.total_rows >= 10);
    return true; // render all but check default
  });

  edaFeatureCheckboxes.innerHTML = featureCols
    .map((c) => {
      const nameLower = c.name.toLowerCase();
      const isId =
        nameLower.includes("id") ||
        nameLower.includes("key") ||
        nameLower.includes("uuid") ||
        nameLower.includes("guid") ||
        (c.unique_count / (currentScanResult.summary.total_rows || 1) >= 0.95 &&
          c.type === "Categorical / Text" &&
          currentScanResult.summary.total_rows >= 10);
      const isChecked = !isId ? "checked" : "";
      return `
      <label class="checkbox-label">
        <input type="checkbox" value="${escapeHtml(c.name)}" ${isChecked} />
        <span class="chk-text">${escapeHtml(c.name)}</span>
        <span class="chk-meta">${escapeHtml(c.type)}${isId ? " (ID-like)" : ""}</span>
      </label>
    `;
    })
    .join("");

  updateProblemTypeDisplay();
  renderEdaInsights();
  renderTargetAnalysis();
  renderCorrelationHeatmap();
  renderDistributionCharts();
  populateManualBuilderControls();
}

window.syncSelectedTargetsFromCheckboxes = syncSelectedTargetsFromCheckboxes;

async function generateEdaAnalysis() {
  if (!currentScanResult) return;

  const tCheckboxes = edaTargetCheckboxes.querySelectorAll("input[type='checkbox']:checked");
  const selectedTargets = Array.from(tCheckboxes).map((cb) => cb.value);

  const fCheckboxes = edaFeatureCheckboxes.querySelectorAll("input[type='checkbox']:checked");
  const selectedFeatures = Array.from(fCheckboxes).map((cb) => cb.value);

  edaState.selectedTargets = selectedTargets;
  edaState.selectedFeatures = selectedFeatures;

  try {
    btnGenerateEda.disabled = true;
    btnGenerateEda.innerHTML = `<span>⚡ Generating Analytics...</span>`;

    const res = await fetch("/api/eda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scan_result: currentScanResult,
        targets: selectedTargets,
        features: selectedFeatures,
      }),
    });

    if (res.ok) {
      const newEda = await res.json();
      currentScanResult.eda = newEda;
      renderEdaInsights();
      renderTargetAnalysis();
      renderCorrelationHeatmap();
      renderDistributionCharts();
    }
  } catch (err) {
    console.error("Failed to generate EDA", err);
  } finally {
    btnGenerateEda.disabled = false;
    btnGenerateEda.innerHTML = `<span>⚡ Generate Smart EDA</span>`;
  }
}

function renderEdaInsights() {
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const insights = eda.smart_insights || [];

  edaInsightsCountBadge.textContent = `${insights.length} Statistical Insights`;

  if (insights.length === 0) {
    edaInsightsContainer.innerHTML = `
      <div class="insight-empty">No statistical anomalies or significant relationships detected with current feature selection.</div>
    `;
    return;
  }

  edaInsightsContainer.innerHTML = insights
    .map((ins) => {
      const sevClass = ins.severity || "INFO";
      return `
      <div class="insight-card-item sev-${sevClass}">
        <div class="insight-card-header">
          <div class="insight-type-tag">${escapeHtml(ins.type)}</div>
          <span class="badge-sev ${sevClass}">${sevClass}</span>
        </div>
        <div class="insight-title">${escapeHtml(ins.title)}</div>
        <p class="insight-text">${escapeHtml(ins.description)}</p>
        <div class="insight-col-tag">${escapeHtml(ins.column)}</div>
      </div>
    `;
    })
    .join("");
}

function renderTargetAnalysis() {
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const targetAnalyses = eda.target_analyses || [];

  if (targetAnalyses.length === 0) {
    edaTargetSection.style.display = "none";
    return;
  }

  edaTargetSection.style.display = "block";
  const targetNames = targetAnalyses.map((t) => t.target_column).join(", ");
  edaTargetHeaderPill.textContent = `Target(s): ${targetNames}`;

  let html = "";
  targetAnalyses.forEach((t) => {
    const isClassification =
      t.problem_type.includes("Classification") || t.distribution_type === "categorical";

    // Summary Card
    let summaryHtml = "";
    if (isClassification && t.class_distribution) {
      summaryHtml = `
        <div class="target-summary-row">
          <div class="target-stat-item">
            <span class="stat-label">Target Name</span>
            <strong class="stat-val">${escapeHtml(t.target_column)}</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Type</span>
            <strong class="stat-val">${escapeHtml(t.problem_type)}</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Distinct Classes</span>
            <strong class="stat-val">${t.unique_classes}</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Total Analyzed</span>
            <strong class="stat-val">${t.total_count}</strong>
          </div>
        </div>
        <div class="target-classes-bar mt-2">
          ${t.class_distribution
            .map(
              (cd, idx) => `
            <div class="class-segment" style="flex: ${cd.count}; background: ${
                ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][idx % 5]
              };" title="${escapeHtml(String(cd.class))}: ${cd.count} (${cd.percentage}%)">
              <span>${escapeHtml(String(cd.class))} (${cd.percentage}%)</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (t.continuous_stats) {
      const cs = t.continuous_stats;
      summaryHtml = `
        <div class="target-summary-row">
          <div class="target-stat-item">
            <span class="stat-label">Target Name</span>
            <strong class="stat-val">${escapeHtml(t.target_column)}</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Problem Type</span>
            <strong class="stat-val">Regression</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Mean</span>
            <strong class="stat-val">${cs.mean}</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Median</span>
            <strong class="stat-val">${cs.median}</strong>
          </div>
          <div class="target-stat-item">
            <span class="stat-label">Range [Min - Max]</span>
            <strong class="stat-val">${cs.min} - ${cs.max}</strong>
          </div>
        </div>
      `;
    }

    // Bivariate feature charts
    const bivariateCharts = (t.bivariate_features || []).map((bf) => {
      let chartSvg = "";
      if (bf.chart_type === "grouped_bar" && bf.group_data) {
        chartSvg = drawSvgGroupedBarChart(bf.feature, t.target_column, bf.group_data);
      } else if (bf.chart_type === "scatter" && bf.scatter_sample) {
        chartSvg = drawSvgScatterPlot(
          bf.scatter_sample,
          bf.feature,
          t.target_column,
          bf.correlation_with_target
        );
      } else if (bf.chart_type === "distribution_by_class" && bf.group_data) {
        chartSvg = drawSvgClassDistributionBars(bf.feature, t.target_column, bf.group_data);
      }

      return `
        <div class="target-bivariate-card">
          <div class="bivariate-card-header">
            <div>
              <strong>${escapeHtml(bf.feature)}</strong> vs <strong>${escapeHtml(
        t.target_column
      )}</strong>
              <span class="bivariate-type-pill">${escapeHtml(bf.feature_type)}</span>
            </div>
            ${
              bf.correlation_with_target !== undefined && bf.correlation_with_target !== null
                ? `<span class="badge-pill">r = ${bf.correlation_with_target}</span>`
                : ""
            }
          </div>
          <div class="bivariate-chart-canvas">
            ${chartSvg}
          </div>
          ${
            bf.insight
              ? `<div class="bivariate-insight-note">💡 ${escapeHtml(bf.insight)}</div>`
              : ""
          }
        </div>
      `;
    });

    html += `
      <div class="target-analysis-block mb-4">
        <div class="target-meta-card glass p-3 mb-3">
          ${summaryHtml}
        </div>
        <div class="bivariate-grid">
          ${bivariateCharts.join("")}
        </div>
      </div>
    `;
  });

  edaTargetChartsGrid.innerHTML = html;
}

function renderCorrelationHeatmap() {
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const corr = eda.correlations || {};
  const matrix = corr.matrix || {};
  const numCols = corr.numerical_columns || [];
  const ranked = corr.ranked_pairs || [];

  // Ranked table
  if (ranked.length === 0) {
    edaTopCorrelationsBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-dim); padding: 1rem;">Not enough continuous numeric columns to calculate correlations.</td></tr>`;
  } else {
    edaTopCorrelationsBody.innerHTML = ranked
      .slice(0, 10)
      .map((rp) => {
        const rVal = rp.pearson_r;
        const color =
          rVal > 0.5
            ? "var(--color-emerald)"
            : rVal < -0.5
            ? "var(--color-cyan)"
            : "var(--text-main)";
        return `
        <tr>
          <td><strong>${escapeHtml(rp.feature_a)}</strong> ↔ <strong>${escapeHtml(
          rp.feature_b
        )}</strong></td>
          <td style="color: ${color}; font-weight: 600;">${rVal > 0 ? "+" : ""}${rVal.toFixed(
          3
        )}</td>
          <td><span class="badge-pill">${escapeHtml(rp.strength)}</span></td>
        </tr>
      `;
      })
      .join("");
  }

  // Heatmap SVG
  if (numCols.length < 2) {
    edaHeatmapVisual.innerHTML = `<div class="chart-empty-placeholder">Requires at least 2 numeric continuous columns for correlation matrix.</div>`;
    return;
  }

  const cellSize = Math.min(65, Math.max(38, Math.floor(360 / numCols.length)));
  const margin = 100;
  const svgWidth = margin + numCols.length * cellSize + 20;
  const svgHeight = margin + numCols.length * cellSize + 20;

  let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="heatmap-svg" style="width: 100%; max-width: ${svgWidth}px;">`;

  // Col labels (top/rotated)
  numCols.forEach((col, i) => {
    const x = margin + i * cellSize + cellSize / 2;
    const y = margin - 10;
    const shortName = col.length > 10 ? col.slice(0, 9) + "…" : col;
    svg += `<text x="${x}" y="${y}" transform="rotate(-40 ${x} ${y})" text-anchor="start" font-size="10" fill="var(--text-muted)">${escapeHtml(
      shortName
    )}</text>`;
  });

  // Row labels (left)
  numCols.forEach((rowCol, j) => {
    const x = margin - 10;
    const y = margin + j * cellSize + cellSize / 2 + 4;
    const shortName = rowCol.length > 11 ? rowCol.slice(0, 10) + "…" : rowCol;
    svg += `<text x="${x}" y="${y}" text-anchor="end" font-size="10" fill="var(--text-muted)">${escapeHtml(
      shortName
    )}</text>`;
  });

  // Heatmap cells
  numCols.forEach((rowCol, rIdx) => {
    numCols.forEach((colCol, cIdx) => {
      const x = margin + cIdx * cellSize;
      const y = margin + rIdx * cellSize;
      const rVal = matrix[rowCol] && matrix[rowCol][colCol] !== undefined ? matrix[rowCol][colCol] : 0;

      // Color mapping (-1.0 to +1.0)
      let fillColor = "#1e293b";
      let textFill = "#f8fafc";
      if (rVal > 0) {
        const opacity = Math.min(1, Math.max(0.1, rVal));
        fillColor = `rgba(16, 185, 129, ${opacity})`; // emerald
      } else if (rVal < 0) {
        const opacity = Math.min(1, Math.max(0.1, Math.abs(rVal)));
        fillColor = `rgba(59, 130, 246, ${opacity})`; // blue/cyan
      } else {
        fillColor = "#1e293b";
      }

      svg += `
        <rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" rx="3" fill="${fillColor}">
          <title>${escapeHtml(rowCol)} vs ${escapeHtml(colCol)}: Pearson r = ${rVal}</title>
        </rect>
        <text x="${x + (cellSize - 2) / 2}" y="${y + (cellSize - 2) / 2 + 4}" text-anchor="middle" font-size="${
        cellSize < 45 ? "9" : "11"
      }" font-weight="600" fill="${textFill}">
          ${rVal.toFixed(2)}
        </text>
      `;
    });
  });

  svg += `</svg>`;
  edaHeatmapVisual.innerHTML = svg;
}

function renderDistributionCharts() {
  const eda = (currentScanResult && currentScanResult.eda) || {};
  const recs = eda.recommended_charts || [];
  const columns = currentScanResult.columns || [];

  let chartsToRender = recs;
  if (!edaState.showAllCharts) {
    chartsToRender = recs.slice(0, 6);
  }

  if (chartsToRender.length === 0) {
    edaDistributionsGrid.innerHTML = `<div class="chart-empty-placeholder">No distribution charts to display.</div>`;
    return;
  }

  edaDistributionsGrid.innerHTML = chartsToRender
    .map((rc) => {
      const colObj = columns.find((c) => c.name === rc.column) || {};
      let chartSvg = "";

      if (rc.chart_type === "histogram" && rc.histogram_data) {
        chartSvg = drawSvgHistogram(rc.histogram_data, rc.column);
      } else if (rc.chart_type === "bar" && rc.categories) {
        chartSvg = drawSvgBarChart(rc.categories, rc.column);
      } else if (rc.chart_type === "box_plot" && colObj.numeric_stats) {
        chartSvg = drawSvgBoxPlot(colObj.numeric_stats, rc.column);
      }

      return `
      <div class="distribution-chart-card glass">
        <div class="dist-card-header">
          <div>
            <h4 class="dist-card-title">${escapeHtml(rc.column)}</h4>
            <span class="dist-card-type">${escapeHtml(rc.column_type)} • ${escapeHtml(
        rc.chart_type
      )}</span>
          </div>
          <span class="dist-card-priority">Priority #${rc.priority}</span>
        </div>
        <div class="dist-card-canvas">
          ${chartSvg}
        </div>
        ${
          rc.insight
            ? `<div class="dist-card-insight">💡 ${escapeHtml(rc.insight)}</div>`
            : ""
        }
      </div>
    `;
    })
    .join("");
}

/* ==========================================================================
   MANUAL CHART BUILDER LOGIC & RENDERER
   ========================================================================== */

function populateManualBuilderControls() {
  if (!currentScanResult) return;
  const cols = currentScanResult.columns || [];

  const optHtml = cols
    .map((c) => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)} (${c.type})</option>`)
    .join("");

  const optNoneHtml = `<option value="">-- None / Default --</option>` + optHtml;

  builderXAxis.innerHTML = optHtml;
  builderYAxis.innerHTML = optNoneHtml;
  builderColorBy.innerHTML = optNoneHtml;

  if (cols.length > 1) {
    builderXAxis.selectedIndex = 0;
    builderYAxis.selectedIndex = 1;
  }
}

function renderManualChart() {
  if (!currentScanResult || !currentScanResult.preview_rows) return;
  const chartType = builderChartType.value;
  const xCol = builderXAxis.value;
  const yCol = builderYAxis.value;
  const colorCol = builderColorBy.value;
  const rows = currentScanResult.preview_rows;
  const cols = currentScanResult.columns;

  const xObj = cols.find((c) => c.name === xCol);
  const yObj = cols.find((c) => c.name === yCol);

  // Incompatibility validation
  if ((chartType === "scatter" || chartType === "line") && !yCol) {
    manualChartContainer.innerHTML = `
      <div class="chart-error-box">
        ⚠️ <strong>Invalid Configuration:</strong> ${escapeHtml(
          chartType
        )} plot requires both an X-Axis feature and a Y-Axis numerical feature.
      </div>
    `;
    return;
  }

  let chartSvg = "";
  let insightText = "";

  if (chartType === "scatter") {
    const points = rows
      .filter((r) => r[xCol] !== null && r[yCol] !== null && !isNaN(Number(r[xCol])) && !isNaN(Number(r[yCol])))
      .map((r) => ({
        x: Number(r[xCol]),
        y: Number(r[yCol]),
        group: colorCol && r[colorCol] !== undefined ? String(r[colorCol]) : null,
      }));

    if (points.length < 2) {
      manualChartContainer.innerHTML = `<div class="chart-error-box">Not enough valid numeric coordinates for Scatter plot.</div>`;
      return;
    }
    chartSvg = drawSvgScatterPlotManual(points, xCol, yCol, colorCol);
    insightText = `Scatter analysis visualizes individual record points along ${escapeHtml(
      xCol
    )} and ${escapeHtml(yCol)}.`;
  } else if (chartType === "bar") {
    const counts = {};
    rows.forEach((r) => {
      const v = r[xCol] !== undefined && r[xCol] !== null ? String(r[xCol]) : "<null>";
      counts[v] = (counts[v] || 0) + 1;
    });
    const categories = Object.entries(counts)
      .slice(0, 10)
      .map(([value, count]) => ({ value, count, percentage: Math.round((count / rows.length) * 100) }));
    chartSvg = drawSvgBarChart(categories, xCol);
    insightText = `Frequency distribution for categories in ${escapeHtml(xCol)}.`;
  } else if (chartType === "histogram") {
    const nums = rows
      .map((r) => Number(r[xCol]))
      .filter((n) => !isNaN(n));
    if (nums.length < 2) {
      manualChartContainer.innerHTML = `<div class="chart-error-box">Histogram requires numeric values in X-Axis.</div>`;
      return;
    }
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const binCount = 7;
    const step = (max - min) / binCount || 1;
    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const bMin = min + i * step;
      const bMax = bMin + step;
      const count = nums.filter((n) => (i === binCount - 1 ? n >= bMin && n <= bMax : n >= bMin && n < bMax)).length;
      bins.push({
        bin_start: Math.round(bMin * 10) / 10,
        bin_end: Math.round(bMax * 10) / 10,
        count,
      });
    }
    chartSvg = drawSvgHistogram(bins, xCol);
    insightText = `Continuous distribution histogram of ${escapeHtml(xCol)} across ${binCount} bins.`;
  } else if (chartType === "boxplot") {
    if (!xObj || !xObj.numeric_stats) {
      manualChartContainer.innerHTML = `<div class="chart-error-box">Box plot requires a numerical column for X-Axis.</div>`;
      return;
    }
    chartSvg = drawSvgBoxPlot(xObj.numeric_stats, xCol);
    insightText = `Five-number summary box plot displaying median, quartiles, and IQR boundaries for ${escapeHtml(
      xCol
    )}.`;
  } else if (chartType === "pie") {
    const counts = {};
    rows.forEach((r) => {
      const v = r[xCol] !== undefined && r[xCol] !== null ? String(r[xCol]) : "<null>";
      counts[v] = (counts[v] || 0) + 1;
    });
    const slices = Object.entries(counts)
      .slice(0, 6)
      .map(([label, count]) => ({ label, count }));
    chartSvg = drawSvgPieChart(slices, xCol);
    insightText = `Proportional donut breakdown for ${escapeHtml(xCol)}.`;
  } else {
    // Fallback simple bar
    chartSvg = `<div class="chart-empty-placeholder">Selected chart type rendering is ready.</div>`;
  }

  manualChartContainer.innerHTML = `
    <div class="manual-chart-rendered-wrap">
      <div class="rendered-chart-header mb-2">
        <h3 style="font-size: 1rem; color: var(--text-main);">${escapeHtml(
          chartType.toUpperCase()
        )}: ${escapeHtml(xCol)} ${yCol ? `vs ` + escapeHtml(yCol) : ""}</h3>
        ${colorCol ? `<span class="badge-pill">Grouped by: ${escapeHtml(colorCol)}</span>` : ""}
      </div>
      <div class="rendered-chart-body" style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        ${chartSvg}
      </div>
      ${insightText ? `<div class="manual-chart-insight-bar mt-2">💡 ${escapeHtml(insightText)}</div>` : ""}
    </div>
  `;
}

/* ==========================================================================
   SVG CHART DRAWING HELPERS
   ========================================================================== */

function drawSvgScatterPlot(samplePoints, xLabel, yLabel, corrVal) {
  if (!samplePoints || samplePoints.length === 0) return "<div class='no-data'>No points</div>";

  const width = 340;
  const height = 190;
  const pad = 35;

  const xVals = samplePoints.map((p) => p.x);
  const yVals = samplePoints.map((p) => p.y);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals) || minX + 1;
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals) || minY + 1;

  const scaleX = (x) => pad + ((x - minX) / (maxX - minX)) * (width - pad * 2);
  const scaleY = (y) => height - pad - ((y - minY) / (maxY - minY)) * (height - pad * 2);

  let dots = samplePoints
    .map((p) => {
      const cx = scaleX(p.x);
      const cy = scaleY(p.y);
      return `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--color-primary)" opacity="0.8">
      <title>${escapeHtml(xLabel)}: ${p.x}, ${escapeHtml(yLabel)}: ${p.y}</title>
    </circle>`;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      <!-- Axes -->
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />
      
      <!-- Axis Labels -->
      <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-size="10" fill="var(--text-dim)">${escapeHtml(
    xLabel
  )}</text>
      <text x="10" y="${height / 2}" transform="rotate(-90 10 ${height / 2})" text-anchor="middle" font-size="10" fill="var(--text-dim)">${escapeHtml(
    yLabel
  )}</text>
      
      <!-- Data Points -->
      ${dots}
    </svg>
  `;
}

function drawSvgScatterPlotManual(points, xLabel, yLabel, groupCol) {
  const width = 500;
  const height = 260;
  const pad = 45;

  const xVals = points.map((p) => p.x);
  const yVals = points.map((p) => p.y);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals) || minX + 1;
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals) || minY + 1;

  const scaleX = (x) => pad + ((x - minX) / (maxX - minX)) * (width - pad * 2);
  const scaleY = (y) => height - pad - ((y - minY) / (maxY - minY)) * (height - pad * 2);

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
  const groupMap = {};
  let gIdx = 0;

  let dots = points
    .map((p) => {
      let dotColor = "var(--color-primary)";
      if (p.group) {
        if (!groupMap[p.group]) {
          groupMap[p.group] = colors[gIdx % colors.length];
          gIdx++;
        }
        dotColor = groupMap[p.group];
      }
      const cx = scaleX(p.x);
      const cy = scaleY(p.y);
      return `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${dotColor}" opacity="0.85">
        <title>${p.group ? `${escapeHtml(groupCol)}: ${p.group}\n` : ""}${xLabel}: ${p.x}, ${yLabel}: ${p.y}</title>
      </circle>`;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-height: 280px;">
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />
      <text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="11" fill="var(--text-dim)">${escapeHtml(
    xLabel
  )}</text>
      <text x="15" y="${height / 2}" transform="rotate(-90 15 ${height / 2})" text-anchor="middle" font-size="11" fill="var(--text-dim)">${escapeHtml(
    yLabel
  )}</text>
      ${dots}
    </svg>
  `;
}

function drawSvgBarChart(categories, colName) {
  if (!categories || categories.length === 0) return "<div class='no-data'>No categories</div>";

  const width = 340;
  const height = 180;
  const padLeft = 70;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;

  const barHeight = Math.min(22, Math.max(12, (height - padTop - padBottom) / categories.length - 5));
  const maxCount = Math.max(...categories.map((c) => c.count)) || 1;

  let bars = categories
    .map((c, idx) => {
      const y = padTop + idx * (barHeight + 5);
      const w = ((c.count / maxCount) * (width - padLeft - padRight)).toFixed(1);
      const label = c.value.length > 9 ? c.value.slice(0, 8) + "…" : c.value;
      return `
      <text x="${padLeft - 8}" y="${y + barHeight / 2 + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${escapeHtml(
        label
      )}</text>
      <rect x="${padLeft}" y="${y}" width="${w}" height="${barHeight}" rx="3" fill="var(--color-primary)" opacity="0.85">
        <title>${escapeHtml(c.value)}: ${c.count} (${c.percentage || 0}%)</title>
      </rect>
      <text x="${padLeft + Number(w) + 6}" y="${y + barHeight / 2 + 3}" font-size="9" fill="var(--text-dim)">${
        c.count
      }</text>
    `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      ${bars}
    </svg>
  `;
}

function drawSvgGroupedBarChart(featName, targetName, groupData) {
  const cats = Object.keys(groupData).slice(0, 6);
  if (cats.length === 0) return "<div class='no-data'>No data</div>";

  const width = 340;
  const height = 190;
  const pad = 35;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

  // collect target classes
  const targetClasses = new Set();
  cats.forEach((c) => {
    Object.keys(groupData[c]).forEach((t) => targetClasses.add(t));
  });
  const tClassList = Array.from(targetClasses);

  const groupWidth = (width - pad * 2) / cats.length;
  const barWidth = Math.max(6, (groupWidth - 8) / tClassList.length);

  let maxVal = 1;
  cats.forEach((c) => {
    Object.values(groupData[c]).forEach((v) => {
      if (v > maxVal) maxVal = v;
    });
  });

  let svg = `<svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">`;
  svg += `<line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />`;

  cats.forEach((cat, cIdx) => {
    const groupX = pad + cIdx * groupWidth;
    const catLabel = cat.length > 7 ? cat.slice(0, 6) + "…" : cat;

    svg += `<text x="${groupX + groupWidth / 2}" y="${height - 10}" text-anchor="middle" font-size="9" fill="var(--text-dim)">${escapeHtml(
      catLabel
    )}</text>`;

    tClassList.forEach((tClass, tIdx) => {
      const cnt = groupData[cat][tClass] || 0;
      const barH = (cnt / maxVal) * (height - pad * 2 - 10);
      const bx = groupX + 4 + tIdx * barWidth;
      const by = height - pad - barH;
      const bColor = colors[tIdx % colors.length];

      svg += `
        <rect x="${bx}" y="${by}" width="${barWidth - 2}" height="${barH}" rx="2" fill="${bColor}">
          <title>${escapeHtml(cat)} → ${escapeHtml(tClass)}: ${cnt}</title>
        </rect>
      `;
    });
  });

  svg += `</svg>`;
  return svg;
}

function drawSvgClassDistributionBars(featName, targetName, groupData) {
  const classes = Object.keys(groupData).slice(0, 6);
  const width = 340;
  const height = 180;
  const pad = 35;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

  const barW = Math.min(45, (width - pad * 2) / classes.length - 10);
  let maxMean = 1;
  classes.forEach((c) => {
    if (groupData[c].mean > maxMean) maxMean = groupData[c].mean;
  });

  let svg = `<svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">`;
  svg += `<line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />`;

  classes.forEach((cls, idx) => {
    const stat = groupData[cls];
    const bx = pad + idx * (barW + 15) + 10;
    const bh = (stat.mean / maxMean) * (height - pad * 2 - 10);
    const by = height - pad - bh;
    const clr = colors[idx % colors.length];
    const lbl = cls.length > 8 ? cls.slice(0, 7) + "…" : cls;

    svg += `
      <rect x="${bx}" y="${by}" width="${barW}" height="${bh}" rx="3" fill="${clr}">
        <title>${escapeHtml(targetName)} = ${escapeHtml(cls)}: Mean ${escapeHtml(featName)} = ${
      stat.mean
    }</title>
      </rect>
      <text x="${bx + barW / 2}" y="${by - 4}" text-anchor="middle" font-size="9" fill="var(--text-main)">${
      stat.mean
    }</text>
      <text x="${bx + barW / 2}" y="${height - 10}" text-anchor="middle" font-size="9" fill="var(--text-dim)">${escapeHtml(
      lbl
    )}</text>
    `;
  });

  svg += `</svg>`;
  return svg;
}

function drawSvgHistogram(bins, colName) {
  if (!bins || bins.length === 0) return "<div class='no-data'>No bins</div>";

  const width = 340;
  const height = 180;
  const pad = 30;
  const maxCount = Math.max(...bins.map((b) => b.count)) || 1;
  const barWidth = (width - pad * 2) / bins.length;

  let bars = bins
    .map((b, idx) => {
      const bx = pad + idx * barWidth;
      const barHeight = ((b.count / maxCount) * (height - pad * 2 - 15)).toFixed(1);
      const by = height - pad - barHeight;
      return `
      <rect x="${bx + 1}" y="${by}" width="${barWidth - 2}" height="${barHeight}" rx="2" fill="var(--color-primary)" opacity="0.85">
        <title>Range [${b.bin_start} - ${b.bin_end}]: ${b.count} records</title>
      </rect>
      <text x="${bx + barWidth / 2}" y="${height - 10}" text-anchor="middle" font-size="8" fill="var(--text-dim)">${
        b.bin_start
      }</text>
    `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="eda-chart-svg">
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="var(--border-subtle)" stroke-width="1.5" />
      ${bars}
    </svg>
  `;
}

function drawSvgBoxPlot(stats, colName) {
  const width = 340;
  const height = 180;
  const pad = 40;

  const min = stats.min;
  const max = stats.max;
  const q1 = stats.q1 !== undefined ? stats.q1 : stats.min;
  const q3 = stats.q3 !== undefined ? stats.q3 : stats.max;
  const med = stats.median !== undefined ? stats.median : stats.mean;

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
      <line x1="${xMin}" y1="${midY}" x2="${xQ1}" y2="${midY}" stroke="var(--color-primary)" stroke-width="2" />
      <line x1="${xQ3}" y1="${midY}" x2="${xMax}" y2="${midY}" stroke="var(--color-primary)" stroke-width="2" />
      <line x1="${xMin}" y1="${midY - 15}" x2="${xMin}" y2="${midY + 15}" stroke="var(--color-primary)" stroke-width="2" />
      <line x1="${xMax}" y1="${midY - 15}" x2="${xMax}" y2="${midY + 15}" stroke="var(--color-primary)" stroke-width="2" />

      <!-- Box (IQR) -->
      <rect x="${xQ1}" y="${midY - 25}" width="${xQ3 - xQ1 || 2}" height="50" rx="3" fill="rgba(59, 130, 246, 0.25)" stroke="var(--color-primary)" stroke-width="2" />

      <!-- Median line -->
      <line x1="${xMed}" y1="${midY - 25}" x2="${xMed}" y2="${midY + 25}" stroke="var(--color-amber)" stroke-width="2.5" />

      <!-- Labels -->
      <text x="${xMin}" y="${midY + 35}" text-anchor="middle" font-size="9" fill="var(--text-dim)">Min: ${min}</text>
      <text x="${xMed}" y="${midY - 32}" text-anchor="middle" font-size="9" fill="var(--color-amber)">Med: ${med}</text>
      <text x="${xMax}" y="${midY + 35}" text-anchor="middle" font-size="9" fill="var(--text-dim)">Max: ${max}</text>
    </svg>
  `;
}

function drawSvgPieChart(slices, colName) {
  const width = 340;
  const height = 200;
  const cx = width / 2 - 30;
  const cy = height / 2;
  const radius = 65;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

  const total = slices.reduce((sum, s) => sum + s.count, 0) || 1;
  let startAngle = 0;

  let pathEls = slices
    .map((s, idx) => {
      const angle = (s.count / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const largeArc = angle > Math.PI ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;

      return `
      <path d="${pathData}" fill="${colors[idx % colors.length]}" opacity="0.85">
        <title>${escapeHtml(s.label)}: ${s.count} (${Math.round((s.count / total) * 100)}%)</title>
      </path>
    `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-height: 220px;">
      ${pathEls}
      <!-- Inner donut cut -->
      <circle cx="${cx}" cy="${cy}" r="32" fill="var(--bg-surface-elevated)" />
    </svg>
  `;
}

/* ==========================================================================
   EDA REPORT EXPORT (HTML & JSON)
   ========================================================================== */

function exportEdaReport() {
  if (!currentScanResult) return;
  const s = currentScanResult.summary;
  const eda = currentScanResult.eda || {};
  const insights = eda.smart_insights || [];
  const corrPairs = (eda.correlations && eda.correlations.ranked_pairs) || [];
  const targets = eda.target_analyses || [];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Data Sarthi — Smart EDA Report: ${escapeHtml(s.filename)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; padding: 2.5rem; line-height: 1.5; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    h1, h2, h3, h4 { margin-top: 0; color: #ffffff; }
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; }
    .badge-primary { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .badge-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.8rem; }
    th, td { text-align: left; padding: 0.65rem 0.85rem; border-bottom: 1px solid #1e293b; font-size: 0.85rem; }
    th { background: #1e293b; color: #94a3b8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .insight-item { background: #1a233a; border-left: 4px solid #3b82f6; padding: 1rem; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Data Sarthi — Smart EDA & Visual Analytics Audit</h1>
    <p>Dataset: <strong>${escapeHtml(s.filename)}</strong> • Generated: ${new Date().toISOString()}</p>
    <p>${s.total_rows} rows × ${s.total_cols} columns • Overall Quality Health Score: <strong>${
    s.overall_quality_score
  }/100</strong></p>
  </div>

  <div class="card">
    <h2>1. Key Non-Causal Statistical Insights (${insights.length})</h2>
    <div class="grid">
      ${insights
        .map(
          (ins) => `
        <div class="insight-item">
          <strong>${escapeHtml(ins.title)}</strong> [${escapeHtml(ins.type)}]
          <p style="margin: 0.5rem 0 0 0; color: #cbd5e1; font-size: 0.85rem;">${escapeHtml(
            ins.description
          )}</p>
        </div>
      `
        )
        .join("")}
    </div>
  </div>

  <div class="card">
    <h2>2. Top Pearson Correlations</h2>
    <table>
      <thead><tr><th>Feature Pair</th><th>Correlation (r)</th><th>Strength</th></tr></thead>
      <tbody>
        ${corrPairs
          .slice(0, 10)
          .map(
            (cp) => `
          <tr>
            <td><strong>${escapeHtml(cp.feature_a)}</strong> ↔ <strong>${escapeHtml(
              cp.feature_b
            )}</strong></td>
            <td>${cp.pearson_r.toFixed(3)}</td>
            <td><span class="badge badge-primary">${escapeHtml(cp.strength)}</span></td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  downloadFile(html, `${currentFilename}_smart_eda_report.html`, "text/html");
}

window.exportEdaReport = exportEdaReport;

