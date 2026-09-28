"""
Data Sarthi — Correlation Analyzer Module
Calculates Pearson linear correlation, Spearman monotonic rank correlation,
and ranked pairwise associations.
"""

import math
import re
import statistics


def calculate_pearson_correlation(x_vals, y_vals):
    """Compute Pearson correlation coefficient between two numeric lists."""
    if len(x_vals) != len(y_vals) or len(x_vals) < 3:
        return 0.0

    n = len(x_vals)
    mean_x = sum(x_vals) / n
    mean_y = sum(y_vals) / n

    var_x = sum((x - mean_x) ** 2 for x in x_vals) / (n - 1)
    var_y = sum((y - mean_y) ** 2 for y in y_vals) / (n - 1)

    if var_x <= 0 or var_y <= 0:
        return 0.0

    std_x = math.sqrt(var_x)
    std_y = math.sqrt(var_y)

    cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals)) / (n - 1)
    r = cov / (std_x * std_y)
    return max(-1.0, min(1.0, round(r, 3)))


def _get_ranks(vals):
    """Compute fractional ranks for Spearman correlation."""
    indexed = sorted(enumerate(vals), key=lambda x: x[1])
    ranks = [0.0] * len(vals)
    i = 0
    while i < len(indexed):
        j = i
        while j < len(indexed) - 1 and indexed[j][1] == indexed[j + 1][1]:
            j += 1
        avg_rank = (i + j + 2) / 2.0  # 1-based rank average
        for k in range(i, j + 1):
            ranks[indexed[k][0]] = avg_rank
        i = j + 1
    return ranks


def calculate_spearman_correlation(x_vals, y_vals):
    """Compute Spearman rank correlation coefficient."""
    if len(x_vals) != len(y_vals) or len(x_vals) < 3:
        return 0.0
    try:
        rank_x = _get_ranks(x_vals)
        rank_y = _get_ranks(y_vals)
        return calculate_pearson_correlation(rank_x, rank_y)
    except Exception:
        return 0.0


def build_correlation_matrix(rows, numeric_cols):
    """Compute full pairwise Pearson & Spearman correlation matrices and rank pairs."""
    matrix = {}
    spearman_matrix = {}
    ranked_pairs = []

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
        spearman_matrix[c1] = {}
        for c2 in numeric_cols:
            if c1 == c2:
                matrix[c1][c2] = 1.0
                spearman_matrix[c1][c2] = 1.0
            elif c2 in matrix and c1 in matrix[c2]:
                matrix[c1][c2] = matrix[c2][c1]
                spearman_matrix[c1][c2] = spearman_matrix[c2][c1]
            else:
                pairs = [(x, y) for x, y in zip(col_data[c1], col_data[c2]) if x is not None and y is not None]
                if len(pairs) >= 3:
                    xs, ys = zip(*pairs)
                    r = calculate_pearson_correlation(list(xs), list(ys))
                    rho = calculate_spearman_correlation(list(xs), list(ys))
                else:
                    r = 0.0
                    rho = 0.0
                matrix[c1][c2] = r
                spearman_matrix[c1][c2] = rho

                if abs(r) >= 0.15:
                    strength = "Strong" if abs(r) >= 0.7 else ("Moderate" if abs(r) >= 0.4 else "Weak")
                    direction = "Positive" if r > 0 else "Negative"
                    ranked_pairs.append({
                        "feature_a": c1,
                        "feature_b": c2,
                        "col1": c1,
                        "col2": c2,
                        "pearson_r": r,
                        "correlation": r,
                        "spearman_rho": rho,
                        "abs_corr": abs(r),
                        "direction": direction,
                        "strength": strength
                    })

    ranked_pairs.sort(key=lambda x: x["abs_corr"], reverse=True)

    positive_pairs = [p for p in ranked_pairs if p["pearson_r"] > 0]
    negative_pairs = [p for p in ranked_pairs if p["pearson_r"] < 0]

    return {
        "columns": numeric_cols,
        "numerical_columns": numeric_cols,
        "matrix": matrix,
        "spearman_matrix": spearman_matrix,
        "ranked_pairs": ranked_pairs,
        "strongest_positive": positive_pairs[:5],
        "strongest_negative": negative_pairs[:5]
    }
