"""
Data Sarthi — Smart EDA & Visual Analytics Engine
Modular statistical analysis, target inference, deterministic chart recommendation,
correlation matrices, and non-causal insight generation.
"""

import math
import re
import statistics
from collections import Counter, defaultdict
from datetime import datetime

ID_KEYWORDS = {"id", "key", "uuid", "hash", "code", "sku", "guid", "index", "pk"}
TARGET_KEYWORDS = {
    "target", "label", "outcome", "churn", "churned", "status", "flag",
    "flagged", "is_", "has_", "converted", "conversion", "fraud", "default",
    "revenue", "amount", "price", "sales", "salary", "score", "total"
}


def is_id_column(col_name, unique_count, total_rows, col_type):
    """Detect if column is an identifier/key that should be excluded from auto-features."""
    lower = col_name.lower().strip()
    # Name match
    if any(k in lower.split("_") or lower.endswith(f"_{k}") or lower.startswith(f"{k}_") for k in ID_KEYWORDS):
        return True
    # Extreme cardinality in text
    if col_type in ("Categorical / Text", "Text") and total_rows >= 10:
        if (unique_count / total_rows) >= 0.95:
            return True
    return False


def detect_target_candidates(columns, total_rows):
    """
    Transparently score and suggest likely target columns with rationale.
    Returns sorted list of candidates: [{ column, score, reason, problem_type }]
    """
    candidates = []

    for col in columns:
        col_name = col["name"]
        col_type = col.get("type", "")
        unique_cnt = col.get("unique_count", 0)
        null_pct = col.get("null_pct", 0)

        # Skip obvious IDs or near-empty columns
        if null_pct > 60:
            continue
        if is_id_column(col_name, unique_cnt, total_rows, col_type):
            continue

        lower = col_name.lower().strip()
        score = 0
        reasons = []
        problem_type = "Classification"

        # Keyword match
        if any(k in lower for k in TARGET_KEYWORDS):
            score += 40
            reasons.append(f'Matches standard target keyword pattern ("{lower}")')

        # Binary columns (prime classification targets)
        if unique_cnt == 2:
            score += 35
            problem_type = "Binary Classification"
            reasons.append("Binary feature with exactly 2 distinct classes")
        elif 3 <= unique_cnt <= 10 and col_type in ("Categorical / Text", "Boolean", "Integer"):
            score += 25
            problem_type = "Multiclass Classification"
            reasons.append(f"Low-cardinality categorical outcome ({unique_cnt} distinct classes)")
        elif col_type in ("Integer", "Float") and unique_cnt > 10:
            # Continuous numerical suitable for regression
            score += 20
            problem_type = "Regression"
            reasons.append("Continuous numeric distribution suitable for regression")

        if score > 0:
            candidates.append({
                "column": col_name,
                "score": score,
                "problem_type": problem_type,
                "reason": "; ".join(reasons)
            })

    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates


def infer_problem_type(target_col_info):
    """Determine problem type for a selected target column."""
    if not target_col_info:
        return "Unsupervised / Exploratory"

    col_type = target_col_info.get("type", "")
    col_name = target_col_info.get("name", "").lower()
    unique_cnt = target_col_info.get("unique_count", 0)

    if col_type == "Date / Time":
        return "Time Series"
    if unique_cnt == 2 or col_type == "Boolean":
        return "Binary Classification"
    if col_type in ("Float", "Integer"):
        reg_keywords = {"price", "revenue", "amount", "cost", "salary", "sales", "fare", "fee", "val", "value", "total", "rate", "income"}
        if col_type == "Integer" and unique_cnt <= 5 and not any(k in col_name for k in reg_keywords):
            return "Multiclass Classification"
        return "Regression"
    if col_type in ("Categorical / Text", "Email", "Text"):
        return "Multiclass Classification"
    return "Exploratory Analysis"


def calculate_pearson_correlation(x_vals, y_vals):
    """Compute Pearson correlation coefficient between two numeric lists."""
    if len(x_vals) != len(y_vals) or len(x_vals) < 3:
        return 0.0

    n = len(x_vals)
    mean_x = statistics.mean(x_vals)
    mean_y = statistics.mean(y_vals)

    std_x = statistics.stdev(x_vals) if n > 1 else 0
    std_y = statistics.stdev(y_vals) if n > 1 else 0

    if std_x == 0 or std_y == 0:
        return 0.0

    cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals)) / (n - 1)
    r = cov / (std_x * std_y)
    return max(-1.0, min(1.0, round(r, 3)))


def build_correlation_matrix(rows, numeric_cols):
    """Compute full correlation matrix and rank strongest pairs."""
    matrix = {}
    strong_correlations = []

    # Extract clean floats
    col_data = {}
    for c in numeric_cols:
        vals = []
        for r in rows:
            v = r.get(c)
            try:
                if v is not None and str(v).strip() != "":
                    cleaned = re.sub(r"^[$\u20ac\u00a3\u00a5]\s*", "", str(v)).replace(",", "")
                    vals.append(float(cleaned))
                else:
                    vals.append(None)
            except (ValueError, TypeError):
                vals.append(None)
        col_data[c] = vals

    for c1 in numeric_cols:
        matrix[c1] = {}
        for c2 in numeric_cols:
            if c1 == c2:
                matrix[c1][c2] = 1.0
            elif c2 in matrix and c1 in matrix[c2]:
                matrix[c1][c2] = matrix[c2][c1]
            else:
                # Pairwise complete rows
                pairs = [(x, y) for x, y in zip(col_data[c1], col_data[c2]) if x is not None and y is not None]
                if len(pairs) >= 3:
                    xs, ys = zip(*pairs)
                    r = calculate_pearson_correlation(list(xs), list(ys))
                else:
                    r = 0.0
                matrix[c1][c2] = r

                # Track non-trivial relationships
                if abs(r) >= 0.2:
                    strength = "Strong" if abs(r) >= 0.7 else ("Moderate" if abs(r) >= 0.4 else "Weak")
                    direction = "Positive" if r > 0 else "Negative"
                    strong_correlations.append({
                        "feature_a": c1,
                        "feature_b": c2,
                        "col1": c1,
                        "col2": c2,
                        "pearson_r": r,
                        "correlation": r,
                        "abs_corr": abs(r),
                        "direction": direction,
                        "strength": strength
                    })

    strong_correlations.sort(key=lambda x: x["abs_corr"], reverse=True)

    return {
        "columns": numeric_cols,
        "numerical_columns": numeric_cols,
        "matrix": matrix,
        "ranked_pairs": strong_correlations
    }


def generate_smart_insights(target_cols, correlations, column_profiles, total_rows):
    """
    Generate deterministic, statistically grounded non-causal insights.
    Uses strictly non-causal terms like 'correlation', 'relationship', 'distribution difference', 'association'.
    """
    insights = []

    # 1. Strongest Correlations Insight
    ranked_pairs = correlations.get("ranked_pairs", [])
    if ranked_pairs:
        top_pair = ranked_pairs[0]
        c1, c2, r = top_pair["col1"], top_pair["col2"], top_pair["correlation"]
        if abs(r) >= 0.6:
            direction = "positive" if r > 0 else "inverse (negative)"
            insights.append({
                "type": "Correlation",
                "severity": "INFO",
                "title": f"Strong Linear Association: {c1} ↔ {c2}",
                "column": f"{c1}, {c2}",
                "description": f'"{c1}" and "{c2}" exhibit a strong {direction} statistical relationship (Pearson r = {r:.2f}).'
            })
        elif abs(r) >= 0.35:
            insights.append({
                "type": "Correlation",
                "severity": "INFO",
                "title": f"Moderate Relationship: {c1} ↔ {c2}",
                "column": f"{c1}, {c2}",
                "description": f'"{c1}" shows a moderate linear association with "{c2}" (Pearson r = {r:.2f}).'
            })

    # 2. Target Specific Insights
    for target in target_cols:
        t_col = next((c for c in column_profiles if c["name"] == target), None)
        if not t_col:
            continue

        if t_col["type"] in ("Integer", "Float"):
            # Target correlations
            target_corrs = [p for p in ranked_pairs if p["col1"] == target or p["col2"] == target]
            if target_corrs:
                best = target_corrs[0]
                other = best["col2"] if best["col1"] == target else best["col1"]
                insights.append({
                    "type": "Target Relationship",
                    "severity": "INFO",
                    "title": f"Highest Target Correlation: {other} → {target}",
                    "column": target,
                    "description": f'Feature "{other}" shows the highest linear correlation with target "{target}" (Pearson r = {best["correlation"]:.2f}).'
                })
        elif t_col.get("top_values"):
            # Classification target balance
            top_vals = t_col["top_values"]
            if len(top_vals) >= 2:
                v1, v2 = top_vals[0], top_vals[1]
                ratio = round(v1["count"] / max(1, v2["count"]), 1)
                if ratio >= 3.0:
                    insights.append({
                        "type": "Class Imbalance",
                        "severity": "WARNING",
                        "title": f"Target Imbalance: {target}",
                        "column": target,
                        "description": f'Target "{target}" exhibits noticeable class imbalance: category "{v1["value"]}" is {ratio}× more frequent than "{v2["value"]}".'
                    })
                else:
                    insights.append({
                        "type": "Target Distribution",
                        "severity": "INFO",
                        "title": f"Balanced Classes: {target}",
                        "column": target,
                        "description": f'Target "{target}" shows a relatively balanced class distribution between "{v1["value"]}" ({v1["percentage"]}%) and "{v2["value"]}" ({v2["percentage"]}%).'
                    })

    # 3. Distribution & Outlier Insights
    for col in column_profiles:
        ns = col.get("numeric_stats")
        if ns and ns.get("outliers_count", 0) > 0 and total_rows > 0:
            out_cnt = ns["outliers_count"]
            out_pct = round((out_cnt / total_rows) * 100, 1)
            if out_pct >= 5.0:
                insights.append({
                    "type": "Outlier Distribution",
                    "severity": "WARNING",
                    "title": f"Distribution Anomaly: {col['name']}",
                    "column": col["name"],
                    "description": f'"{col["name"]}" contains {out_cnt} statistical outlier values ({out_pct}%), extending to maximum boundary {ns["max"]}.'
                })

    # 4. Missing Data Insights
    for col in column_profiles:
        if col.get("null_pct", 0) >= 15.0:
            insights.append({
                "type": "Missing Data",
                "severity": "WARNING" if col["null_pct"] >= 40 else "INFO",
                "title": f"Missingness Incurred: {col['name']}",
                "column": col["name"],
                "description": f'Feature "{col["name"]}" has {col["null_count"]} missing records ({col["null_pct"]}%), which may require imputation during model ingestion.'
            })

    return insights


def recommend_charts(columns, rows, correlations=None):
    """
    Deterministic chart recommendation engine based on data types and distributions.
    """
    recs = []
    if not columns:
        return recs

    for idx, col in enumerate(columns):
        col_name = col["name"]
        col_type = col.get("type", "")
        unique_cnt = col.get("unique_count", 0)

        if col_type in ("Integer", "Float"):
            ns = col.get("numeric_stats")
            # Build histogram bins
            vals = []
            for r in rows:
                v = r.get(col_name)
                try:
                    if v is not None and str(v).strip() != "":
                        vals.append(float(re.sub(r"^[$\u20ac\u00a3\u00a5]\s*", "", str(v)).replace(",", "")))
                except (ValueError, TypeError):
                    pass

            histogram_data = []
            if vals and len(vals) >= 2:
                min_v, max_v = min(vals), max(vals)
                bin_count = 6
                step = (max_v - min_v) / bin_count if max_v > min_v else 1.0
                for b_i in range(bin_count):
                    b_start = min_v + b_i * step
                    b_end = b_start + step
                    b_cnt = sum(1 for v in vals if (b_start <= v <= b_end if b_i == bin_count - 1 else b_start <= v < b_end))
                    histogram_data.append({
                        "bin_start": round(b_start, 1),
                        "bin_end": round(b_end, 1),
                        "count": b_cnt
                    })

            recs.append({
                "column": col_name,
                "column_type": col_type,
                "chart_type": "histogram",
                "priority": idx + 1,
                "histogram_data": histogram_data,
                "insight": f"Continuous distribution for {col_name} with mean {ns.get('mean') if ns else 'N/A'}."
            })

        elif col_type == "Date / Time":
            recs.append({
                "column": col_name,
                "column_type": col_type,
                "chart_type": "line",
                "priority": 1,
                "insight": f"Time-series chronologically ordered progression across {col_name}."
            })

        elif col_type in ("Categorical / Text", "Boolean", "Email"):
            top_vals = col.get("top_values", [])
            categories = [
                {"value": str(tv["value"]), "count": tv["count"], "percentage": tv.get("percentage", 0)}
                for tv in top_vals[:6]
            ]
            recs.append({
                "column": col_name,
                "column_type": col_type,
                "chart_type": "bar",
                "priority": idx + 1,
                "categories": categories,
                "insight": f"Discrete category frequency distribution for {col_name} across {unique_cnt} distinct levels."
            })

    return recs


def build_smart_eda_payload(scan_result, selected_targets=None, selected_features=None):
    """
    Main orchestrator for Smart EDA analysis.
    Takes data quality scan result and returns complete visual analytics payload.
    """
    summary = scan_result.get("summary", {})
    columns = scan_result.get("columns", [])
    rows = scan_result.get("preview_rows", [])
    total_rows = summary.get("total_rows", len(rows))

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

    # Determine Feature Columns (exclude IDs unless chosen)
    all_col_names = [c["name"] for c in columns]
    if selected_features is None:
        active_features = [
            c["name"] for c in columns
            if not is_id_column(c["name"], c.get("unique_count", 0), total_rows, c.get("type", ""))
            and c["name"] not in active_targets
        ]
    else:
        active_features = [f for f in selected_features if f in all_col_names and f not in active_targets]

    # Numeric Columns for correlation
    numeric_cols = [
        c["name"] for c in columns
        if c.get("type") in ("Integer", "Float") and not is_id_column(c["name"], c.get("unique_count", 0), total_rows, c.get("type"))
    ]

    # Correlation Matrix
    correlations = build_correlation_matrix(rows, numeric_cols)

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

        if prob_type in ("Binary Classification", "Multiclass Classification"):
            top_vals = t_col.get("top_values", [])
            t_analysis["class_distribution"] = [
                {"class": tv["value"], "count": tv["count"], "percentage": tv.get("percentage", 0)}
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

        # Compute feature relationships with target
        for f_name in active_features:
            f_col = next((c for c in columns if c["name"] == f_name), None)
            if not f_col:
                continue

            # Numerical × Numerical (Target is Numeric, Feature is Numeric)
            if t_col["type"] in ("Integer", "Float") and f_col["type"] in ("Integer", "Float"):
                r = correlations["matrix"].get(t_name, {}).get(f_name, 0.0)
                scatter_points = []
                for r_item in rows[:50]:
                    try:
                        x_val = float(str(r_item.get(f_name, "")).replace(",", ""))
                        y_val = float(str(r_item.get(t_name, "")).replace(",", ""))
                        scatter_points.append({"x": x_val, "y": y_val})
                    except (ValueError, TypeError):
                        pass

                t_analysis["bivariate_features"].append({
                    "feature": f_name,
                    "feature_type": f_col["type"],
                    "chart_type": "scatter",
                    "relationship_type": "Numerical × Numerical",
                    "correlation_with_target": r,
                    "strength": "Strong" if abs(r) >= 0.6 else ("Moderate" if abs(r) >= 0.3 else "Weak"),
                    "scatter_sample": scatter_points,
                    "insight": f'Pearson linear correlation r = {r:.2f} between "{f_name}" and target "{t_name}".'
                })

            # Categorical Feature × Categorical Target
            elif t_col["type"] in ("Categorical / Text", "Boolean") and f_col["type"] in ("Categorical / Text", "Boolean"):
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
                    "insight": f'Distribution proportions of target "{t_name}" across "{f_name}" levels.'
                })

            # Numerical Feature × Categorical Target
            elif t_col["type"] in ("Categorical / Text", "Boolean") and f_col["type"] in ("Integer", "Float"):
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
                        formatted_groups[g_val] = {
                            "count": len(nums_list),
                            "mean": round(statistics.mean(nums_list), 2),
                            "median": round(statistics.median(nums_list), 2),
                            "min": min(nums_list),
                            "max": max(nums_list)
                        }

                t_analysis["bivariate_features"].append({
                    "feature": f_name,
                    "feature_type": f_col["type"],
                    "chart_type": "distribution_by_class",
                    "relationship_type": "Numerical × Categorical Target",
                    "group_data": formatted_groups,
                    "insight": f'Comparison of "{f_name}" statistical distributions across target "{t_name}" classes.'
                })

        target_analyses.append(t_analysis)

    # Statistical Insights
    insights = generate_smart_insights(active_targets, correlations, columns, total_rows)

    # Missingness Distribution
    missingness = [
        {
            "column": c["name"],
            "type": c["type"],
            "null_count": c["null_count"],
            "null_pct": c["null_pct"]
        }
        for c in columns
        if c["null_count"] > 0
    ]
    missingness.sort(key=lambda x: x["null_pct"], reverse=True)

    # Outliers Summary
    outliers = [
        {
            "column": c["name"],
            "type": c["type"],
            "outliers_count": c["numeric_stats"]["outliers_count"],
            "outliers_pct": round((c["numeric_stats"]["outliers_count"] / total_rows) * 100, 1) if total_rows > 0 else 0,
            "min": c["numeric_stats"]["min"],
            "max": c["numeric_stats"]["max"],
            "mean": c["numeric_stats"]["mean"]
        }
        for c in columns
        if c.get("numeric_stats") and c["numeric_stats"].get("outliers_count", 0) > 0
    ]
    outliers.sort(key=lambda x: x["outliers_count"], reverse=True)

    # Recommended Charts
    recommended = recommend_charts(columns, rows, correlations)

    return {
        "dataset_name": summary.get("filename", "dataset.csv"),
        "total_rows": total_rows,
        "total_cols": summary.get("total_cols", len(columns)),
        "target_candidates": target_candidates,
        "suggested_targets": target_candidates,
        "active_targets": active_targets,
        "active_features": active_features,
        "target_analyses": target_analyses,
        "correlations": correlations,
        "insights": insights,
        "smart_insights": insights,
        "recommended_charts": recommended,
        "missingness": missingness,
        "outliers": outliers,
        "columns_metadata": columns
    }
