"""
Data Sarthi — Smart EDA & Visual Analytics Engine
Root module exporting functions from the modular `eda` package.
"""

from eda import (
    build_smart_eda_payload,
    is_id_column,
    detect_target_candidates,
    infer_problem_type,
    calculate_linear_trend,
    calculate_pearson_correlation,
    calculate_spearman_correlation,
    build_correlation_matrix,
    calculate_skewness,
    build_histogram_data,
    build_numerical_distributions,
    build_categorical_distributions,
    build_outlier_summary,
    build_missingness_summary,
    generate_smart_insights,
    recommend_charts,
    ID_KEYWORDS,
    TARGET_KEYWORDS,
    REGRESSION_KEYWORDS,
)

__all__ = [
    "build_smart_eda_payload",
    "is_id_column",
    "detect_target_candidates",
    "infer_problem_type",
    "calculate_linear_trend",
    "calculate_pearson_correlation",
    "calculate_spearman_correlation",
    "build_correlation_matrix",
    "calculate_skewness",
    "build_histogram_data",
    "build_numerical_distributions",
    "build_categorical_distributions",
    "build_outlier_summary",
    "build_missingness_summary",
    "generate_smart_insights",
    "recommend_charts",
    "ID_KEYWORDS",
    "TARGET_KEYWORDS",
    "REGRESSION_KEYWORDS",
]
