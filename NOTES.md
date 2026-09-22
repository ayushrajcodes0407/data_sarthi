# Data Sarthi — Technical Reference & Edge Cases

## Null & Empty String Detection
- `csv.DictReader` returns `""` for empty fields rather than `None`.
- Null-like string tokens (`"null"`, `"nan"`, `"n/a"`, `"none"`, `"-"`) are normalized and surfaced in completeness profiling.
- BOM (`\ufeff`) handling is accounted for during UTF-8 stream decoding.

## Outlier Detection
- Computed using the standard 1.5× Interquartile Range ($IQR = Q_3 - Q_1$) methodology.
- Outlier boundaries: $[\max(\min, Q_1 - 1.5 \times IQR), \min(\max, Q_3 + 1.5 \times IQR)]$.

## Large Dataset Handling
- Preview grids and scatter visualizations sample intelligently (e.g. 50–100 rows) to keep browser DOM rendering smooth and performant, while exact statistical summaries are computed across all dataset rows.
