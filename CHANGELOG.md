# Changelog

All notable changes to the Data Sarthi platform will be documented in this file.

## [0.1.0] — 2026-09-23 — Initial Data Sarthi Release

### Added
- **Core Profiler & Quality Score**: Automated data completeness, validity, uniqueness, and consistency dimensional scoring (0–100).
- **Enterprise Issue Detector**: 12+ statistical validation rules detecting null tokens, casing inconsistencies, email RFC violations, date format mismatches, negative metric anomalies, and extreme cardinality.
- **Data Grid Preview & Cell Diagnostics**: Interactive grid with highlighted problematic cells and actionable remediation hints.
- **Smart EDA & Visual Analytics**:
  - Target auto-detection heuristic with problem type inference (*Binary/Multiclass Classification*, *Regression*, *Time Series*).
  - Multi-target selection support and dedicated bivariate feature breakdowns.
  - Pairwise Pearson correlation matrix heatmap with ranked strongest associations table.
  - Deterministic chart recommendations (histograms, box plots, grouped/stacked bars, scatter plots).
  - Strictly non-causal statistical insights generation.
  - Interactive manual chart builder with configuration validation.
- **Data Cleaning Hub**: In-browser recipes for whitespace trimming, casing standardization, deduplication, and missing value imputation with CSV export.
- **CLI & Multi-Format Reporting**: Terminal CLI scanner (`dq_scan.py`), GitHub Actions CI/CD template, and HTML/JSON/Markdown report export.
