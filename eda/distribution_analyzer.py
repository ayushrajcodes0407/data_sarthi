"""
Data Sarthi — Distribution Analyzer Module
Generates compact numerical distribution parameters, histograms, box plots,
categorical frequency charts, outlier matrices, and missingness metrics.
"""

import math
import re
from collections import Counter, defaultdict


def safe_mean(vals):
    if not vals:
        return 0.0
    return round(sum(vals) / len(vals), 2)


def safe_median(vals):
    if not vals:
        return 0.0
    sorted_v = sorted(vals)
    n = len(sorted_v)
    mid = n // 2
    if n % 2 == 1:
        return round(sorted_v[mid], 2)
    return round((sorted_v[mid - 1] + sorted_v[mid]) / 2.0, 2)


def safe_stdev(vals):
    if len(vals) < 2:
        return 0.0
    try:
        m = sum(vals) / len(vals)
        variance = sum((x - m) ** 2 for x in vals) / (len(vals) - 1)
        return round(math.sqrt(max(0.0, variance)), 2)
    except Exception:
        return 0.0


def calculate_skewness(vals):
    """Compute sample skewness coefficient."""
    if len(vals) < 3:
        return 0.0
    try:
        n = len(vals)
        m = sum(vals) / n
        std_v = safe_stdev(vals)
        if std_v == 0:
            return 0.0
        m3 = sum((x - m) ** 3 for x in vals) / n
        s3 = std_v ** 3
        skew = (m3 / s3) * (math.sqrt(n * (n - 1)) / (n - 2)) if n > 2 else (m3 / s3)
        return round(skew, 2)
    except Exception:
        return 0.0


def build_histogram_data(vals, bin_count=8):
    """Build histogram bins for a continuous list of floats."""
    if not vals or len(vals) < 2:
        if vals:
            return [{"bin_start": round(vals[0], 2), "bin_end": round(vals[0], 2), "count": len(vals), "pct": 100.0}]
        return []

    min_v, max_v = min(vals), max(vals)
    if min_v == max_v:
        return [{"bin_start": round(min_v, 2), "bin_end": round(max_v, 2), "count": len(vals), "pct": 100.0}]

    step = (max_v - min_v) / bin_count
    bins = []
    total = len(vals)

    for i in range(bin_count):
        b_start = min_v + i * step
        b_end = b_start + step
        if i == bin_count - 1:
            cnt = sum(1 for v in vals if b_start <= v <= b_end)
        else:
            cnt = sum(1 for v in vals if b_start <= v < b_end)

        bins.append({
            "bin_start": round(b_start, 2),
            "bin_end": round(b_end, 2),
            "count": cnt,
            "pct": round((cnt / total) * 100, 1) if total > 0 else 0
        })

    return bins


def build_numerical_distributions(columns, rows):
    """Generate compact numerical distribution models for all numeric features."""
    num_distributions = []

    for col in columns:
        if col.get("type") not in ("Integer", "Float"):
            continue

        c_name = col["name"]
        ns = col.get("numeric_stats", {})

        # Extract floats
        vals = []
        for r in rows:
            v = r.get(c_name)
            try:
                if v is not None and str(v).strip() != "":
                    cleaned = re.sub(r"^[$\u20ac\u00a3\u00a5]\s*", "", str(v)).replace(",", "")
                    vals.append(float(cleaned))
            except (ValueError, TypeError):
                pass

        if not vals:
            continue

        skew = calculate_skewness(vals)
        skew_desc = (
            "Right-skewed (positive)" if skew >= 0.75
            else ("Left-skewed (negative)" if skew <= -0.75
                  else "Approximately symmetric")
        )

        hist_bins = build_histogram_data(vals, bin_count=8)

        # 5-number summary
        q1 = ns.get("q1", min(vals))
        q3 = ns.get("q3", max(vals))
        iqr = round(q3 - q1, 2)
        mean_val = ns.get("mean", safe_mean(vals))
        median_val = ns.get("median", safe_median(vals))
        std_val = ns.get("std", safe_stdev(vals))

        num_distributions.append({
            "column": c_name,
            "type": col["type"],
            "count": len(vals),
            "mean": mean_val,
            "median": median_val,
            "std": std_val,
            "min": ns.get("min", min(vals)),
            "max": ns.get("max", max(vals)),
            "q1": q1,
            "q3": q3,
            "iqr": iqr,
            "skewness": skew,
            "skew_desc": skew_desc,
            "outliers_count": ns.get("outliers_count", 0),
            "histogram_data": hist_bins,
            "insight": f"{c_name} has mean {mean_val}, median {median_val} and is {skew_desc.lower()}."
        })

    return num_distributions


def build_categorical_distributions(columns):
    """Generate compact horizontal bar frequency distributions for categorical features."""
    cat_distributions = []

    for col in columns:
        if col.get("type") not in ("Categorical / Text", "Boolean", "Email", "Text"):
            continue

        c_name = col["name"]
        top_vals = col.get("top_values", [])
        unique_cnt = col.get("unique_count", 0)

        categories = [
            {
                "value": str(tv["value"]),
                "count": tv["count"],
                "percentage": tv.get("percentage", 0)
            }
            for tv in top_vals[:7]
        ]

        cat_distributions.append({
            "column": c_name,
            "type": col["type"],
            "unique_count": unique_cnt,
            "categories": categories,
            "insight": f"Top category is \"{categories[0]['value']}\" representing {categories[0]['percentage']}% of records." if categories else "Discrete levels."
        })

    return cat_distributions


def build_outlier_summary(columns, total_rows):
    """Generate structured outlier analysis table."""
    outliers = []
    for col in columns:
        ns = col.get("numeric_stats")
        if ns and ns.get("outliers_count", 0) > 0:
            cnt = ns["outliers_count"]
            pct = round((cnt / total_rows) * 100, 2) if total_rows > 0 else 0
            outliers.append({
                "column": col["name"],
                "type": col["type"],
                "outliers_count": cnt,
                "percentage": pct,
                "min": ns.get("min"),
                "max": ns.get("max"),
                "mean": ns.get("mean"),
                "q1": ns.get("q1"),
                "q3": ns.get("q3"),
                "iqr": round(ns.get("q3", 0) - ns.get("q1", 0), 2)
            })

    outliers.sort(key=lambda x: x["outliers_count"], reverse=True)
    return outliers


def build_missingness_summary(columns, total_rows):
    """Generate missingness analysis table."""
    missing = []
    for col in columns:
        if col.get("null_count", 0) > 0:
            missing.append({
                "column": col["name"],
                "type": col["type"],
                "null_count": col["null_count"],
                "null_pct": col["null_pct"]
            })

    missing.sort(key=lambda x: x["null_pct"], reverse=True)
    return missing
