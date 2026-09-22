# Data Sarthi

**Data Sarthi** is a high-performance, dependency-free Data Quality Profiling, Validation, and Smart EDA (Exploratory Data Analysis) platform for CSV and tabular datasets.

Designed to be lightning-fast, transparent, and developer-friendly, Data Sarthi scans millions of data cells in milliseconds, computes comprehensive health dimensions, surfaces statistical anomalies, suggests targets with transparent heuristics, and visualizes analytical relationships.

---

## Key Features

### 1. Enterprise Data Quality Profiling & Scoring
- **Automated Health Score (0–100)**: Transparent weighted score derived from 4 core data quality dimensions:
  - **Completeness (35%)**: Missing values, empty cells, and null-like token detection (`null`, `nan`, `n/a`, `-`).
  - **Validity (30%)**: Strict data type compliance, email RFC checks, date ISO parsing, non-negative domain invariants.
  - **Uniqueness (20%)**: Duplicate record identification and primary key cardinality analysis.
  - **Consistency (15%)**: Categorical casing variations (`EUR` vs `eur`), whitespace anomalies, mixed type tokens.
- **Cell Diagnostics**: Clickable interactive grid cells detailing the exact root cause, severity, and remediation recipe.

### 2. Smart EDA & Visual Analytics
- **Transparent Target Heuristics**: Deterministic target suggestions with clear explanations (*"Why it was suggested"*).
- **Multi-Target Analysis**: Analyze multiple classification and regression targets simultaneously.
- **Automatic Problem Type Detection**: Detects *Binary Classification*, *Multiclass Classification*, *Regression*, and *Time Series* with manual override.
- **Deterministic Chart Recommendation**:
  - **Numerical × Numerical**: Scatter plots with Pearson $r$ correlation and trend lines.
  - **Numerical × Categorical**: Box plots, quartile boundaries, and group statistics.
  - **Categorical × Categorical**: Grouped and stacked cross-tabulations.
  - **Distributions**: Histograms with binning and categorical frequency distributions.
- **Correlation Heatmap**: Pairwise Pearson correlation matrix with interactive color scale and ranked relationship table.
- **Statistical Insights**: Strictly non-causal observations describing distribution differences, correlations, and class imbalances.
- **Manual Chart Builder**: Interactive visual studio for custom bivariate and distribution plotting.

### 3. Data Cleaning Recipes
- In-memory data sanitization preview:
  - Trim leading/trailing whitespace and normalize null literals.
  - Standardize casing variants.
  - Deduplicate identical records.
  - Impute missing numeric values.
- Export cleaned CSV directly from the browser.

### 4. CI/CD & Automated Quality Gates
- Built-in terminal CLI (`dq_scan.py`) for automated build pipelines.
- Copy-ready GitHub Actions workflow template for pre-merge data validation gates.
- Multi-format report export: Standalone HTML reports, JSON schema outputs, Markdown audit summaries, and CSV metrics.

---

## Quick Start & Running Locally

### Prerequisites
- Python 3.8+ (Standard Library only — no heavy scientific packages required to run!)

### 1. Launch the Web Studio
From the project directory:
```bash
python web_server.py
```
Or from the root launcher:
```bash
python start_server.py
```
Open your browser and navigate to:
```
http://localhost:8000
```

### 2. Run the CLI Scanner
Scan any CSV dataset directly from your terminal:
```bash
python dq_scan.py examples/sample.csv
```

---

## Project Architecture

```
data_sarthi/
├── dq-scan/
│   ├── web/
│   │   ├── index.html       # Single-page studio interface & modular views
│   │   ├── style.css        # Responsive dark/light theme design system
│   │   └── app.js           # Client-side state, SVG charts, and interactivity
│   ├── tests/
│   │   ├── test_scan.py           # Core scanning unit tests
│   │   ├── test_extended_rules.py # Data quality rule validation tests
│   │   └── test_eda_engine.py     # 12-scenario EDA & visual analytics test suite
│   ├── dq_scan.py           # Standalone terminal CLI scanner
│   ├── eda_engine.py        # Smart EDA statistical & recommendation engine
│   ├── web_server.py        # Local HTTP server, REST endpoints, and profiler
│   ├── CHANGELOG.md         # Release history
│   ├── CONTRIBUTING.md      # Contribution guide
│   └── LICENSE              # Project licensing & attribution
└── start_server.py          # Root entrypoint launcher
```

---

## Running Tests

Execute the automated test suite covering Data Quality rules and Smart EDA scenarios:
```bash
python -m unittest discover tests
```

---

## Roadmap
- [x] Initial Data Quality profiler & health scoring engine
- [x] 12+ enterprise validation rules & cell diagnostics
- [x] Smart EDA & Pearson correlation matrix heatmap
- [x] Multi-target bivariate analysis & manual chart studio
- [ ] Spearman rank correlation for monotonic non-linear features
- [ ] Mutual Information (MI) feature importance scoring
- [ ] SQL / Parquet streaming ingestion adapters

---

## License
MIT License. See [LICENSE](LICENSE) for details.
