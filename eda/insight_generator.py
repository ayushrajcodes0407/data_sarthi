"""
Data Sarthi — Statistical Insight Generator Module
Produces concise, numbered, non-causal observations describing distribution differences,
correlations, target relationships, and anomalies.
"""


def generate_smart_insights(target_cols, correlations, columns, total_rows):
    """
    Generate deterministic, statistically grounded non-causal insights.
    Uses strictly non-causal phrasing ('association', 'relationship', 'distribution difference').
    """
    insights = []

    # 1. Strongest Linear Correlations
    ranked_pairs = correlations.get("ranked_pairs", [])
    if ranked_pairs:
        top_pair = ranked_pairs[0]
        c1, c2, r = top_pair["col1"], top_pair["col2"], top_pair["pearson_r"]
        if abs(r) >= 0.6:
            direction = "positive" if r > 0 else "inverse (negative)"
            insights.append({
                "type": "Strong Association",
                "severity": "INFO",
                "title": f"Strong Association: {c1} ↔ {c2}",
                "column": f"{c1}, {c2}",
                "description": f'"{c1}" and "{c2}" show a strong {direction} relationship (Pearson r = {r:.2f}, Spearman ρ = {top_pair.get("spearman_rho", r):.2f}).'
            })
        elif abs(r) >= 0.35:
            insights.append({
                "type": "Moderate Relationship",
                "severity": "INFO",
                "title": f"Moderate Relationship: {c1} ↔ {c2}",
                "column": f"{c1}, {c2}",
                "description": f'"{c1}" shows a moderate linear association with "{c2}" (Pearson r = {r:.2f}).'
            })

    # 2. Target Specific Insights
    for target in target_cols:
        t_col = next((c for c in columns if c["name"] == target), None)
        if not t_col:
            continue

        if t_col["type"] in ("Integer", "Float"):
            target_corrs = [p for p in ranked_pairs if p["col1"] == target or p["col2"] == target]
            if target_corrs:
                best = target_corrs[0]
                other = best["col2"] if best["col1"] == target else best["col1"]
                insights.append({
                    "type": "Target Relationship",
                    "severity": "INFO",
                    "title": f"Target Relationship: {other} → {target}",
                    "column": target,
                    "description": f'"{other}" shows the highest linear correlation with target "{target}" (Pearson r = {best["pearson_r"]:.2f}).'
                })
        elif t_col.get("top_values"):
            top_vals = t_col["top_values"]
            if len(top_vals) >= 2:
                v1, v2 = top_vals[0], top_vals[1]
                ratio = round(v1["count"] / max(1, v2["count"]), 1)
                if ratio >= 2.5:
                    insights.append({
                        "type": "Target Imbalance",
                        "severity": "WARNING",
                        "title": f"Target Imbalance: {target}",
                        "column": target,
                        "description": f'"{v1["value"]}" represents {v1.get("percentage", 0)}% of observations ({ratio}× more frequent than "{v2["value"]}").'
                    })
                else:
                    insights.append({
                        "type": "Target Distribution",
                        "severity": "INFO",
                        "title": f"Balanced Classes: {target}",
                        "column": target,
                        "description": f'Target "{target}" shows balanced class distribution between "{v1["value"]}" ({v1.get("percentage", 0)}%) and "{v2["value"]}" ({v2.get("percentage", 0)}%).'
                    })

    # 3. Outlier Insights
    for col in columns:
        ns = col.get("numeric_stats")
        if ns and ns.get("outliers_count", 0) > 0 and total_rows > 0:
            out_cnt = ns["outliers_count"]
            out_pct = round((out_cnt / total_rows) * 100, 1)
            if out_pct >= 4.0:
                insights.append({
                    "type": "Potential Outliers",
                    "severity": "WARNING",
                    "title": f"Potential Outliers: {col['name']}",
                    "column": col["name"],
                    "description": f'"{col["name"]}" contains {out_cnt} IQR-based outliers ({out_pct}%), extending to maximum boundary {ns["max"]}.'
                })

    # 4. Missing Data Insights
    for col in columns:
        if col.get("null_pct", 0) >= 10.0:
            insights.append({
                "type": "Missing Data",
                "severity": "WARNING" if col["null_pct"] >= 35 else "INFO",
                "title": f"Missing Data: {col['name']}",
                "column": col["name"],
                "description": f'"{col["name"]}" contains {col["null_count"]} missing observations ({col["null_pct"]}%), which may require imputation.'
            })

    return insights
