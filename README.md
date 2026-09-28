# Data Sarthi

Enterprise Data Quality, Issue Detection & Smart EDA Analytics Platform.

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Tests](https://img.shields.io/badge/Tests-22%20Passing-success)](tests/)

---

## Overview

**Data Sarthi** is a high-performance, enterprise-grade Data Quality Profiling, Validation, and Smart EDA (Exploratory Data Analysis) platform designed for CSV and tabular datasets.

Built with a lightweight, dependency-free architecture, Data Sarthi scans millions of data cells in milliseconds, computes dimensional health scores (Completeness, Validity, Uniqueness, Consistency), pinpoints exact cell-level anomalies, automatically infers modeling targets with transparent heuristics, generates Pearson correlation heatmaps, and provides automated data sanitization recipes.

---

## Key Features

- **⚡ Blazing Fast In-Memory Profiling**: Processes large datasets in milliseconds with zero required external scientific packages.
- **🎯 Smart EDA & Target Inference**: Automated target candidate ranking with transparent rationales and problem type classification.
- **📊 Interactive Visual Analytics**: Built-in SVG charts including Pearson correlation heatmaps, bivariate scatter plots with trend lines, class distributions, and histograms.
- **🛡️ 12+ Enterprise Validation Rules**: Deep cell diagnostics with severity grading (Critical, Warning, Info) and remediation tips.
- **🧹 Data Cleaning Studio**: Instant in-memory data sanitization (whitespace trimming, case standardization, deduplication, missing imputation) with clean CSV export.
- **📋 Multi-Format Export**: Generates standalone executive HTML reports, JSON audit schemas, Markdown summaries, and CSV metrics.
- **🚀 Dual Deployment Architecture**: Run as a local Python multi-threaded server or deploy instantly to Vercel as a zero-dependency static web application.

---

## Smart EDA (Exploratory Data Analysis)

Data Sarthi features a deterministic, non-causal Smart EDA engine that automates statistical dataset exploration:

1. **Target Candidate Scoring**: Transparently scores and suggests likely target variables based on naming conventions, cardinality, and entropy.
2. **Problem Type Inference**: Accurately classifies problems into:
   - **Binary Classification** (e.g. 2-class labels, boolean outcomes)
   - **Multiclass Classification** (e.g. low-cardinality discrete categories)
   - **Regression** (e.g. continuous numerical features)
   - **Time Series** (e.g. chronological datetime features)
3. **Correlation Analysis**: Full pairwise Pearson correlation matrix ($r \in [-1, 1]$) with ranked feature relationships and heatmap visualization.
4. **Bivariate Analysis**:
   - *Numerical × Numerical*: Scatter plots with trend line calculations.
   - *Numerical × Categorical*: Class-stratified statistical distributions (mean, median, min, max).
   - *Categorical × Categorical*: Grouped cross-tabulation distributions.
5. **Statistical Insights**: Non-causal observations summarizing class imbalances, high correlations, distribution skewness, and missingness patterns.

---

## Data Quality Scoring

Data Sarthi computes an overall **Health Score (0–100)** derived from 4 core data quality dimensions:

| Dimension | Weight | Description |
|:---|:---:|:---|
| **Completeness** | **35%** | Evaluates missing values, empty strings, and null-like literals (`null`, `nan`, `n/a`, `-`, `undefined`). |
| **Validity** | **30%** | Validates structural conformity, RFC-compliant emails, ISO dates, and non-negative numeric invariants. |
| **Uniqueness** | **20%** | Identifies duplicate rows and verifies primary key uniqueness and entropy. |
| **Consistency** | **15%** | Detects casing anomalies (`EUR` vs `eur`), whitespace variations, and mixed-type columns. |

---

## Issue Detection

The validation engine systematically inspects datasets against 12+ data quality rules:

- **Missing Values**: Identifies cells containing empty strings or null tokens.
- **Invalid Email Format**: Validates email strings against RFC syntax.
- **Invalid Date Format**: Detects non-standard date formats and unparseable timestamps.
- **Negative Invariant Violation**: Flags negative values in strictly non-negative domains (e.g., price, quantity, age, salary).
- **Duplicate Records**: Discovers identical multi-column rows.
- **Casing Inconsistency**: Surfaces inconsistent categorical representations.
- **Mixed Data Types**: Detects columns with conflicting numeric and textual values.
- **Extreme Cardinality**: Flags high-cardinality text columns acting as pseudo-identifiers.
- **Statistical Outliers**: Detects extreme values beyond interquartile ranges ($IQR$).

---

## Data Profiling

Every column in the dataset is profiled with rich metadata:
- **Inferred Data Type**: `Integer`, `Float`, `Categorical / Text`, `Date / Time`, `Boolean`, `Email`.
- **Completeness & Null Percentage**: Exact counts and fill ratios.
- **Distinct Values & Cardinality**: Unique value counts and top frequency distributions.
- **Numerical Summary**: Mean, median, minimum, maximum, standard deviation, and outlier counts.

---

## Data Cleaning

Data Sarthi provides an interactive data cleaning studio allowing users to:
1. **Trim Whitespace**: Remove leading, trailing, and redundant internal whitespace.
2. **Standardize Casing**: Normalize text to UPPERCASE, lowercase, or Title Case.
3. **Deduplicate Records**: Purge duplicate rows while preserving the first occurrence.
4. **Impute Missing Values**: Fill gaps using mean, median, mode, or custom placeholder tokens.
5. **Export Sanitized CSV**: Download cleaned datasets ready for machine learning pipelines.

---

## Rules

Custom and built-in rules can be configured to enforce strict data contracts:
- Non-null constraints on mandatory columns.
- Regex pattern matching for domain identifiers.
- Value range bounds (`min <= x <= max`).
- Allowed categorical sets (enums).

---

## Reports

Export comprehensive audit reports in multiple formats:
- **Interactive HTML Report**: Self-contained executive report with embedded visual charts and audit tables.
- **JSON Schema Output**: Machine-readable audit payload for integration with data pipelines.
- **Markdown Summary**: Git-friendly changelog and pull request audit comment.
- **CSV Metrics**: Tabular export of column-level statistics.

---

## CI/CD Integration

Automate data quality verification in GitHub Actions:

```yaml
name: Data Sarthi Quality Gate

on: [push, pull_request]

jobs:
  data-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Run Data Sarthi Quality Scan
        run: |
          python dq_scan.py data/input.csv --min-score 85
```

---

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, Vanilla CSS Design System with custom dark/light theme tokens, responsive layouts, micro-animations, and SVG chart rendering.
- **Backend / CLI Engine**: Python 3.8+ Standard Library (`http.server`, `csv`, `statistics`, `json`, `re`, `math`). Zero third-party dependencies required.
- **Testing**: Python `unittest` framework with full test coverage across quality rules, statistics, and EDA routines.
- **Deployment**: Vercel (Static Web Studio) + Local/Docker Multi-threaded Python server.

---

## Project Structure

```
data_sarthi/
├── dq-scan/
│   ├── web/
│   │   ├── index.html            # Luxury enterprise studio interface & view templates
│   │   ├── style.css             # Responsive design system, CSS tokens & animations
│   │   └── app.js                # Client-side profiling, SVG charts, and interactive state
│   ├── eda/                      # Modular Smart EDA statistical package
│   │   ├── __init__.py           # Package exports & public API
│   │   ├── correlation_analyzer.py # Pearson & Spearman correlation matrices
│   │   ├── distribution_analyzer.py# Histograms, skewness & outlier metrics
│   │   ├── insight_generator.py  # Non-causal statistical insight rules
│   │   ├── recommender.py        # Deterministic chart recommendations
│   │   └── target_analyzer.py    # Target scoring & bivariate models
│   ├── tests/
│   │   ├── test_scan.py          # Core scanning unit tests
│   │   ├── test_extended_rules.py# Data quality rule validation tests
│   │   └── test_eda_engine.py    # 12-scenario Smart EDA test suite
│   ├── dq_scan.py                # Standalone terminal CLI scanner
│   ├── eda_engine.py             # Smart EDA root interface module
│   ├── web_server.py             # Multi-threaded HTTP server & REST API
│   ├── vercel.json               # Vercel deployment routing configuration
│   ├── .env.example              # Environment variables template
│   ├── CHANGELOG.md              # Version changelog
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── LICENSE                   # MIT License
└── start_server.py               # Root launcher script
```

---

## Local Development

### 1. Clone Repository & Setup
```bash
git clone https://github.com/ayushrajcodes0407/data_sarthi.git
cd data_sarthi/dq-scan
```

### 2. Run the Web Studio
```bash
# Using the Python server
python web_server.py

# Or with custom port
python web_server.py 8080
```
Navigate to `http://localhost:8000` (or your configured port).

### 3. Run CLI Scanner
```bash
python dq_scan.py examples/sample.csv
```

---

## Environment Variables

Copy `.env.example` to `.env` for local configuration:

```bash
# Web Server Port (Default: 8000)
PORT=8000

# Host binding (Default: 0.0.0.0)
HOST=0.0.0.0

# Environment mode
ENVIRONMENT=production
```

---

## Production Build

Because Data Sarthi utilizes a native, dependency-free Vanilla HTML/CSS/JS frontend, **no compilation or bundling step (such as `npm run build`) is required**.

The production assets in `web/` are optimized and ready for immediate deployment.

---

## Vercel Deployment

Deploy Data Sarthi to Vercel in seconds:

### Option A: Via Vercel Dashboard (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import `data_sarthi` (or `dq-scan`).
3. Set the **Root Directory** to `dq-scan` (or `dq-scan/web`).
4. Framework Preset: **Other**.
5. Build Command: Leave empty (no build step needed).
6. Output Directory: Leave empty (or `web`).
7. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
cd dq-scan
vercel --prod
```

---

## Screenshots

| Enterprise Dashboard | Smart EDA & Heatmap |
|:---:|:---:|
| *Automated dimensional quality scoring & cell issue diagnostics* | *Pearson correlation matrix & bivariate target analysis* |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
