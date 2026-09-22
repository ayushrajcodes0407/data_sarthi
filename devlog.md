# Data Sarthi Development Log

## Engineering Notes & Design Decisions

### Architecture Principles
- **Zero Heavy Dependencies**: The scanning engine relies exclusively on Python standard libraries (`csv`, `statistics`, `re`, `http.server`), ensuring immediate startup times and portability across air-gapped or lightweight CI runners.
- **Deterministic Recommendations**: The Smart EDA chart engine uses explicit type-driven logic (e.g. numeric $\times$ numeric $\rightarrow$ scatter, numeric $\times$ categorical $\rightarrow$ boxplot/distribution) rather than stochastic generators.
- **Non-Causal Insights**: All statistical narrative generators strictly utilize association phrasing (`"shows strong linear association"`, `"exhibits class imbalance"`) to maintain statistical rigor without asserting unproven causality.
