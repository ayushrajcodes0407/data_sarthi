"""
Data Sarthi — Chart Recommender Module
Deterministic chart recommendation and priority scoring engine.
"""

from eda.distribution_analyzer import build_histogram_data


def recommend_charts(columns, rows, correlations=None):
    """
    Deterministic chart recommendation engine based on feature types and distributions.
    """
    recs = []
    if not columns:
        return recs

    for idx, col in enumerate(columns):
        col_name = col["name"]
        col_type = col.get("type", "")
        unique_cnt = col.get("unique_count", 0)

        if col_type in ("Integer", "Float"):
            ns = col.get("numeric_stats", {})
            vals = []
            for r in rows:
                v = r.get(col_name)
                try:
                    if v is not None and str(v).strip() != "":
                        vals.append(float(str(v).replace(",", "")))
                except (ValueError, TypeError):
                    pass

            hist_data = build_histogram_data(vals, bin_count=8) if vals else []

            recs.append({
                "column": col_name,
                "column_type": col_type,
                "chart_type": "histogram",
                "priority": idx + 1,
                "histogram_data": hist_data,
                "numeric_stats": ns,
                "insight": f"Continuous distribution for {col_name} (Mean: {ns.get('mean', 0)}, Std: {ns.get('std', 0)})."
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
                for tv in top_vals[:7]
            ]
            recs.append({
                "column": col_name,
                "column_type": col_type,
                "chart_type": "bar",
                "priority": idx + 1,
                "categories": categories,
                "insight": f"Discrete category distribution across {unique_cnt} distinct levels."
            })

    return recs
