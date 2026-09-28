"""
Data Sarthi — Target Analyzer Module
Transparent heuristic target scoring, problem type inference, and bivariate target relationships.
"""

import math
import re
import statistics
from collections import Counter, defaultdict

ID_KEYWORDS = {"id", "key", "uuid", "hash", "code", "sku", "guid", "index", "pk"}
TARGET_KEYWORDS = {
    "target", "label", "outcome", "churn", "churned", "status", "flag",
    "flagged", "is_", "has_", "converted", "conversion", "fraud", "default",
    "revenue", "amount", "price", "sales", "salary", "score", "total"
}
REGRESSION_KEYWORDS = {
    "price", "revenue", "amount", "cost", "salary", "sales", "fare",
    "fee", "val", "value", "total", "rate", "income", "tenure", "spend", "balance"
}


def is_id_column(col_name, unique_count, total_rows, col_type):
    """Detect if column is an identifier/key that should be excluded from auto-features."""
    lower = col_name.lower().strip()
    if any(k in lower.split("_") or lower.endswith(f"_{k}") or lower.startswith(f"{k}_") for k in ID_KEYWORDS):
        return True
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

        if null_pct > 60:
            continue
        if is_id_column(col_name, unique_cnt, total_rows, col_type):
            continue

        lower = col_name.lower().strip()
        score = 0
        reasons = []
        problem_type = "Classification"

        if any(k in lower for k in TARGET_KEYWORDS):
            score += 40
            reasons.append(f'Matches target keyword pattern ("{lower}")')

        if unique_cnt == 2:
            score += 35
            problem_type = "Binary Classification"
            reasons.append("Binary outcome with exactly 2 distinct classes")
        elif 3 <= unique_cnt <= 10 and col_type in ("Categorical / Text", "Boolean", "Integer"):
            score += 25
            problem_type = "Multiclass Classification"
            reasons.append(f"Low-cardinality categorical outcome ({unique_cnt} classes)")
        elif col_type in ("Integer", "Float") and unique_cnt > 5:
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
        if col_type == "Integer" and unique_cnt <= 5 and not any(k in col_name for k in REGRESSION_KEYWORDS):
            return "Multiclass Classification"
        return "Regression"
    if col_type in ("Categorical / Text", "Email", "Text"):
        return "Multiclass Classification"
    return "Exploratory Analysis"


def calculate_linear_trend(x_vals, y_vals):
    """Compute slope and intercept for trend line in scatter plots."""
    if len(x_vals) < 2 or len(x_vals) != len(y_vals):
        return None
    try:
        n = len(x_vals)
        mean_x = statistics.mean(x_vals)
        mean_y = statistics.mean(y_vals)
        var_x = sum((x - mean_x) ** 2 for x in x_vals)
        if var_x == 0:
            return None
        cov_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals))
        slope = cov_xy / var_x
        intercept = mean_y - (slope * mean_x)
        return {
            "slope": round(slope, 4),
            "intercept": round(intercept, 4)
        }
    except Exception:
        return None
