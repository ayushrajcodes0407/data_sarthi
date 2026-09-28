"""
Data Sarthi — Smart EDA & Visual Analytics Package
Orchestrates Target Analysis, Pearson/Spearman Correlations, Compact Distributions,
Non-Causal Insights, and Seaborn-inspired specs.
"""

from collections import defaultdict
import statistics

from eda.target_analyzer import (
    is_id_column,
    detect_target_candidates,
    infer_problem_type,
    calculate_linear_trend,
    ID_KEYWORDS,
    TARGET_KEYWORDS,
    REGRESSION_KEYWORDS,
)
from eda.correlation_analyzer import (
    calculate_pearson_correlation,
    calculate_spearman_correlation,
    build_correlation_matrix,
)
from eda.distribution_analyzer import (
    calculate_skewness,
    build_histogram_data,
    build_numerical_distributions,
    build_categorical_distributions,
    build_outlier_summary,
    build_missingness_summary,
)
from eda.insight_generator import generate_smart_insights
from eda.recommender import recommend_charts


def build_smart_eda_payload(scan_result, selected_targets=None, selected_features=None):
    """
    Main orchestrator for Smart EDA analysis.
    Produces high-fidelity analytical specs and data points for Python EDA-style dashboards.
    """
    summary = scan_result.get("summary", {})
    columns = scan_result.get("columns", [])
    rows = scan_result.get("preview_rows", [])
    total_rows = summary.get("total_rows", len(rows))
    total_cols = summary.get("total_cols", len(columns))

    # Auto detect target candidates
    target_candidates = detect_target_candidates(columns, total_rows)

    # Determine Active Targets
    if selected_targets is None or not selected_targets:
        if target_candidates:
            active_targets = [target_candidates[0]["column"]]
        else:
            active_targets = []
    else:
        active_targets = [t for t in selected_targets if any(c["name"] == t for c in columns)]

    # Determine Feature Columns (exclude IDs unless explicitly chosen)
    all_col_names = [c["name"] for c in columns]
    if selected_features is None:
        active_features = [
            c["name"] for c in columns
            if not is_id_column(c["name"], c.get("unique_count", 0), total_rows, c.get("type", ""))
            and c["name"] not in active_targets
        ]
    else:
        active_features = [f for f in selected_features if f in all_col_names and f not in active_targets]

    # Numeric columns for correlation
    numeric_cols = [
        c["name"] for c in columns
        if c.get("type") in ("Integer", "Float") and not is_id_column(c["name"], c.get("unique_count", 0), total_rows, c.get("type"))
    ]

    # Build Correlation Matrix
    correlations = build_correlation_matrix(rows, numeric_cols)

    # Numerical & Categorical Distributions
    numerical_distributions = build_numerical_distributions(columns, rows)
    categorical_distributions = build_categorical_distributions(columns)

    # Target Analysis Models
    target_analyses = []
    for t_name in active_targets:
        t_col = next((c for c in columns if c["name"] == t_name), None)
        if not t_col:
            continue

        prob_type = infer_problem_type(t_col)
        t_analysis = {
            "target_column": t_name,
            "target": t_name,
            "problem_type": prob_type,
            "column_info": t_col,
            "unique_classes": t_col.get("unique_count", 0),
            "total_count": total_rows,
            "distribution_type": "categorical" if prob_type.endswith("Classification") else "numeric",
            "bivariate_features": []
        }

        # Target Distribution
        if prob_type in ("Binary Classification", "Multiclass Classification"):
            top_vals = t_col.get("top_values", [])
            t_analysis["class_distribution"] = [
                {
                    "class": str(tv["value"]),
                    "count": tv["count"],
                    "percentage": tv.get("percentage", 0)
                }
                for tv in top_vals
            ]
        elif prob_type == "Regression" and t_col.get("numeric_stats"):
            ns = t_col["numeric_stats"]
            t_analysis["continuous_stats"] = {
                "mean": ns.get("mean", 0),
                "median": ns.get("median", 0),
                "min": ns.get("min", 0),
                "max": ns.get("max", 0),
                "std": ns.get("std", 0)
            }

        # Bivariate feature relationships
        for f_name in active_features:
            f_col = next((c for c in columns if c["name"] == f_name), None)
            if not f_col:
                continue

            # 1. Numerical Feature × Numerical Target (Regression)
            if t_col["type"] in ("Integer", "Float") and f_col["type"] in ("Integer", "Float"):
                r = correlations["matrix"].get(t_name, {}).get(f_name, 0.0)
                rho = correlations.get("spearman_matrix", {}).get(t_name, {}).get(f_name, r)

                scatter_points = []
                x_pts = []
                y_pts = []
                for r_item in rows[:60]:
                    try:
                        x_val = float(str(r_item.get(f_name, "")).replace(",", ""))
                        y_val = float(str(r_item.get(t_name, "")).replace(",", ""))
                        scatter_points.append({"x": x_val, "y": y_val})
                        x_pts.append(x_val)
                        y_pts.append(y_val)
                    except (ValueError, TypeError):
                        pass

                trend = calculate_linear_trend(x_pts, y_pts)

                t_analysis["bivariate_features"].append({
                    "feature": f_name,
                    "feature_type": f_col["type"],
                    "chart_type": "scatter",
                    "relationship_type": "Numerical × Numerical",
                    "correlation_with_target": r,
                    "pearson_r": r,
                    "spearman_rho": rho,
                    "trend_line": trend,
                    "strength": "Strong" if abs(r) >= 0.6 else ("Moderate" if abs(r) >= 0.3 else "Weak"),
                    "scatter_sample": scatter_points,
                    "insight": f'Pearson r = {r:.2f}, Spearman ρ = {rho:.2f} between "{f_name}" and "{t_name}".'
                })

            # 2. Categorical Feature × Categorical Target (Classification)
            elif t_col["type"] in ("Categorical / Text", "Boolean", "Email", "Text") and f_col["type"] in ("Categorical / Text", "Boolean", "Email", "Text"):
                crosstab = defaultdict(lambda: defaultdict(int))
                for r_item in rows:
                    f_val = str(r_item.get(f_name, "<null>"))
                    t_val = str(r_item.get(t_name, "<null>"))
                    crosstab[f_val][t_val] += 1

                t_analysis["bivariate_features"].append({
                    "feature": f_name,
                    "feature_type": f_col["type"],
                    "chart_type": "grouped_bar",
                    "relationship_type": "Categorical × Categorical",
                    "group_data": dict(crosstab),
                    "insight": f'Category proportions of target "{t_name}" across "{f_name}" levels.'
                })

            # 3. Numerical Feature × Categorical Target (Classification)
            elif t_col["type"] in ("Categorical / Text", "Boolean", "Email", "Text") and f_col["type"] in ("Integer", "Float"):
                group_stats = defaultdict(list)
                for r_item in rows:
                    t_val = str(r_item.get(t_name, "<null>"))
                    try:
                        f_val = float(str(r_item.get(f_name, "")).replace(",", ""))
                        group_stats[t_val].append(f_val)
                    except (ValueError, TypeError):
                        pass

                formatted_groups = {}
                for g_val, nums_list in group_stats.items():
                    if nums_list:
                        s_nums = sorted(nums_list)
                        n_cnt = len(s_nums)
                        q1_idx = int(n_cnt * 0.25)
                        q3_idx = int(n_cnt * 0.75)
                        formatted_groups[g_val] = {
                            "count": n_cnt,
                            "mean": round(statistics.mean(nums_list), 2),
                            "median": round(statistics.median(nums_list), 2),
                            "min": min(nums_list),
                            "max": max(nums_list),
                            "q1": s_nums[q1_idx],
                            "q3": s_nums[q3_idx]
                        }

                t_analysis["bivariate_features"].append({
                    "feature": f_name,
                    "feature_type": f_col["type"],
                    "chart_type": "distribution_by_class",
                    "relationship_type": "Numerical × Categorical Target",
                    "group_data": formatted_groups,
                    "insight": f'Statistical distribution of "{f_name}" across target "{t_name}" classes.'
                })

        target_analyses.append(t_analysis)

    # Executive Summary
    num_count = len([c for c in columns if c.get("type") in ("Integer", "Float")])
    cat_count = len([c for c in columns if c.get("type") in ("Categorical / Text", "Boolean", "Email", "Text")])
    date_count = len([c for c in columns if c.get("type") == "Date / Time"])

    primary_target_col = next((c for c in columns if c["name"] == active_targets[0]), None) if active_targets else None
    primary_problem_type = infer_problem_type(primary_target_col) if primary_target_col else "Unsupervised / Exploratory"

    executive_summary = {
        "dataset_name": summary.get("filename", "dataset.csv"),
        "total_rows": total_rows,
        "total_cols": total_cols,
        "numerical_count": num_count,
        "categorical_count": cat_count,
        "datetime_count": date_count,
        "missing_pct": summary.get("total_null_pct", 0),
        "missing_count": summary.get("total_nulls", 0),
        "duplicate_rows_pct": summary.get("duplicate_row_pct", 0),
        "duplicate_rows_count": summary.get("total_duplicate_rows", 0),
        "active_targets": active_targets,
        "primary_target": active_targets[0] if active_targets else None,
        "primary_problem_type": primary_problem_type
    }

    # Statistical Insights
    insights = generate_smart_insights(active_targets, correlations, columns, total_rows)

    # Outliers Summary
    outliers = build_outlier_summary(columns, total_rows)

    # Missingness Summary
    missingness = build_missingness_summary(columns, total_rows)

    # Recommended Charts
    recommended = recommend_charts(columns, rows, correlations)

    return {
        "dataset_name": summary.get("filename", "dataset.csv"),
        "total_rows": total_rows,
        "total_cols": total_cols,
        "executive_summary": executive_summary,
        "target_candidates": target_candidates,
        "suggested_targets": target_candidates,
        "active_targets": active_targets,
        "active_features": active_features,
        "target_analyses": target_analyses,
        "correlations": correlations,
        "numerical_distributions": numerical_distributions,
        "categorical_distributions": categorical_distributions,
        "insights": insights,
        "smart_insights": insights,
        "recommended_charts": recommended,
        "missingness": missingness,
        "outliers": outliers,
        "columns_metadata": columns
    }
