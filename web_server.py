#!/usr/bin/env python3
"""
Data Sarthi — Enterprise Data Quality & Smart EDA Web Server
"""

import csv
import io
import json
import math
import os
import re
import statistics
import sys
from collections import Counter, defaultdict
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

from eda_engine import build_smart_eda_payload, detect_target_candidates, is_id_column

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "web")

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
NULL_LITERALS = {"null", "none", "nan", "n/a", "na", "undefined", "-", "--", "#n/a", "nil", "missing", "?"}
NON_NEGATIVE_KEYWORDS = {"amount", "price", "fee", "cost", "age", "tenure", "rate", "count", "tickets", "hours", "rate", "salary", "bp", "heart_rate", "temp", "quantity", "qty"}


def parse_date_safe(val):
    """Attempt to parse common date formats safely."""
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d", "%Y-%m-%d %H:%M:%S", "%d-%m-%Y"):
        try:
            return datetime.strptime(val.strip(), fmt)
        except (ValueError, TypeError):
            continue
    return None


def analyze_csv_data(content_str, filename="data.csv", delim="auto"):
    """
    Comprehensive Data Quality Profiler and Issue Detector for CSV.
    Computes Completeness, Validity, Uniqueness, Consistency, Column Profiles,
    and Structured Issues.
    """
    try:
        if delim == "auto" or not delim:
            first_line = content_str.split("\n")[0] if content_str else ""
            if "\t" in first_line:
                delim = "\t"
            elif ";" in first_line:
                delim = ";"
            elif "|" in first_line:
                delim = "|"
            else:
                delim = ","

        f = io.StringIO(content_str)
        reader = csv.DictReader(f, delimiter=delim)
        raw_fieldnames = reader.fieldnames or []
        rows = list(reader)
    except Exception as e:
        return {"error": f"Failed to parse CSV: {str(e)}"}

    if not rows or not raw_fieldnames:
        return {
            "summary": {
                "filename": filename,
                "total_rows": 0,
                "total_cols": len(raw_fieldnames),
                "total_cells": 0,
                "total_nulls": 0,
                "total_null_pct": 0,
                "overall_quality_score": 0,
                "file_size_bytes": len(content_str.encode("utf-8")),
                "delimiter": delim,
            },
            "dimensions": {
                "completeness": 0,
                "validity": 0,
                "uniqueness": 0,
                "consistency": 0,
            },
            "issues": [],
            "columns": [],
            "preview_rows": [],
            "cell_diagnostics": {},
            "error": "Dataset is empty or missing header row."
        }

    cols = raw_fieldnames
    total_rows = len(rows)
    total_cols = len(cols)
    total_cells = total_rows * total_cols

    total_nulls_count = 0
    total_invalid_cells = 0
    total_inconsistent_cells = 0
    all_issues = []
    columns_analysis = []
    cell_diagnostics = {}

    row_strings = [json.dumps(r, sort_keys=True) for r in rows]
    total_unique_rows = len(set(row_strings))
    total_duplicate_rows = total_rows - total_unique_rows
    duplicate_row_pct = round((total_duplicate_rows / total_rows) * 100, 2) if total_rows > 0 else 0

    if total_duplicate_rows > 0:
        all_issues.append({
            "id": "dataset-dupe-rows",
            "severity": "CRITICAL" if duplicate_row_pct > 10 else "WARNING",
            "rule": "Duplicate Records",
            "column": "(All Columns)",
            "affected_rows": total_duplicate_rows,
            "affected_pct": duplicate_row_pct,
            "description": f"Found {total_duplicate_rows} duplicate record(s) with identical values across all columns.",
            "why_it_matters": "Duplicate rows skew aggregate calculations, machine learning models, and customer metric reports.",
            "recommended_action": "Deduplicate records based on primary business keys."
        })

    for col_idx, col_name in enumerate(cols):
        raw_vals = [r.get(col_name) for r in rows]
        
        empty_str_count = 0
        whitespace_only_count = 0
        null_literal_count = 0
        valid_nonempty_vals = []
        raw_nonempty_indices = []

        for r_idx, v in enumerate(raw_vals):
            if v is None:
                null_literal_count += 1
                cell_diagnostics[f"{r_idx},{col_name}"] = {
                    "issue": "Missing Value",
                    "severity": "WARNING",
                    "value": "<null>",
                    "reason": "Field contains null value",
                    "action": "Impute or provide default"
                }
            elif v == "":
                empty_str_count += 1
                cell_diagnostics[f"{r_idx},{col_name}"] = {
                    "issue": "Empty String",
                    "severity": "WARNING",
                    "value": "<empty>",
                    "reason": "Value is an empty string",
                    "action": "Fill with missing value placeholder or default"
                }
            elif v.strip() == "":
                whitespace_only_count += 1
                total_inconsistent_cells += 1
                cell_diagnostics[f"{r_idx},{col_name}"] = {
                    "issue": "Whitespace Only",
                    "severity": "WARNING",
                    "value": f'"{v}"',
                    "reason": "Cell contains only spaces or tabs",
                    "action": "Trim whitespace and treat as missing"
                }
            elif v.strip().lower() in NULL_LITERALS:
                null_literal_count += 1
                total_inconsistent_cells += 1
                cell_diagnostics[f"{r_idx},{col_name}"] = {
                    "issue": "Null-like Literal",
                    "severity": "WARNING",
                    "value": v,
                    "reason": f'Value "{v}" is a text representation of null',
                    "action": "Standardize to genuine null / empty"
                }
            else:
                cleaned = v.strip()
                valid_nonempty_vals.append(cleaned)
                raw_nonempty_indices.append(r_idx)

        total_col_nulls = empty_str_count + whitespace_only_count + null_literal_count
        total_nulls_count += total_col_nulls
        null_pct = round((total_col_nulls / total_rows) * 100, 2) if total_rows > 0 else 0

        unique_vals = set(valid_nonempty_vals)
        unique_count = len(unique_vals)
        unique_pct = round((unique_count / len(valid_nonempty_vals)) * 100, 2) if valid_nonempty_vals else 0
        col_dupes = len(valid_nonempty_vals) - unique_count

        nums = []
        num_indices = []
        for orig_idx, v in zip(raw_nonempty_indices, valid_nonempty_vals):
            clean_v = re.sub(r"^[$\u20ac\u00a3\u00a5]\s*", "", v).replace(",", "")
            try:
                num_val = float(clean_v)
                nums.append(num_val)
                num_indices.append(orig_idx)
            except (ValueError, TypeError):
                pass

        email_matches = sum(1 for v in valid_nonempty_vals if EMAIL_REGEX.match(v))
        is_email_col = (
            "email" in col_name.lower() or 
            (valid_nonempty_vals and (email_matches / len(valid_nonempty_vals)) >= 0.6)
        )

        date_matches = sum(1 for v in valid_nonempty_vals if parse_date_safe(v) is not None)
        is_date_col = (
            any(k in col_name.lower() for k in ("date", "created", "updated", "time", "timestamp", "birth")) or
            (valid_nonempty_vals and (date_matches / len(valid_nonempty_vals)) >= 0.6)
        )

        bool_literals = {"true", "false", "1", "0", "yes", "no", "y", "n", "t", "f"}
        is_bool_col = bool(valid_nonempty_vals and all(v.lower() in bool_literals for v in valid_nonempty_vals))

        if is_bool_col:
            inferred_type = "Boolean"
        elif valid_nonempty_vals and (len(nums) >= len(valid_nonempty_vals) * 0.5):
            inferred_type = "Integer" if (nums and all(n.is_integer() for n in nums)) else "Float"
        elif is_date_col:
            inferred_type = "Date / Time"
        elif is_email_col:
            inferred_type = "Email"
        else:
            inferred_type = "Categorical / Text"

        col_issues = []

        if null_pct > 50:
            issue = {
                "id": f"issue-nulls-crit-{col_idx}",
                "severity": "CRITICAL",
                "rule": "Severe Missing Values",
                "column": col_name,
                "affected_rows": total_col_nulls,
                "affected_pct": null_pct,
                "description": f"Column is {null_pct}% missing ({total_col_nulls} out of {total_rows} rows).",
                "why_it_matters": "Columns with over 50% missing data degrade feature reliability and cause statistical bias.",
                "recommended_action": "Consider column removal or investigate upstream data pipeline export."
            }
            all_issues.append(issue)
            col_issues.append(issue["description"])
        elif null_pct > 5:
            issue = {
                "id": f"issue-nulls-warn-{col_idx}",
                "severity": "WARNING",
                "rule": "Missing Values",
                "column": col_name,
                "affected_rows": total_col_nulls,
                "affected_pct": null_pct,
                "description": f"{total_col_nulls} missing or blank value(s) ({null_pct}%).",
                "why_it_matters": "Missing values can cause errors in analytics pipelines and require imputation.",
                "recommended_action": "Impute with mean/median (numeric) or mode (categorical), or filter rows."
            }
            all_issues.append(issue)
            col_issues.append(issue["description"])

        if inferred_type in ("Integer", "Float") and len(nums) < len(valid_nonempty_vals):
            mixed_count = len(valid_nonempty_vals) - len(nums)
            mixed_pct = round((mixed_count / total_rows) * 100, 1)
            total_invalid_cells += mixed_count
            issue = {
                "id": f"issue-mixed-type-{col_idx}",
                "severity": "CRITICAL",
                "rule": "Mixed Data Types",
                "column": col_name,
                "affected_rows": mixed_count,
                "affected_pct": mixed_pct,
                "description": f"Found {mixed_count} non-numeric text value(s) in a predominantly numeric column.",
                "why_it_matters": "Mixed types cause type casting exceptions, DB ingestion failures, and silent parsing bugs.",
                "recommended_action": "Cleanse string tokens ('unknown', 'TBD', '-') before casting."
            }
            all_issues.append(issue)
            col_issues.append(issue["description"])

            for orig_idx, v in zip(raw_nonempty_indices, valid_nonempty_vals):
                if orig_idx not in num_indices:
                    cell_diagnostics[f"{orig_idx},{col_name}"] = {
                        "issue": "Invalid Type Format",
                        "severity": "CRITICAL",
                        "value": v,
                        "reason": f'Expected number, got string "{v}"',
                        "action": "Convert to numeric or replace with null"
                    }

        if is_email_col and valid_nonempty_vals:
            invalid_emails = [
                (orig_idx, v) for orig_idx, v in zip(raw_nonempty_indices, valid_nonempty_vals)
                if not EMAIL_REGEX.match(v)
            ]
            if invalid_emails:
                total_invalid_cells += len(invalid_emails)
                issue = {
                    "id": f"issue-invalid-email-{col_idx}",
                    "severity": "WARNING",
                    "rule": "Invalid Email Format",
                    "column": col_name,
                    "affected_rows": len(invalid_emails),
                    "affected_pct": round((len(invalid_emails) / total_rows) * 100, 1),
                    "description": f"{len(invalid_emails)} value(s) do not match standard email RFC format.",
                    "why_it_matters": "Invalid emails result in bounced messages, delivery failures, and corrupt user profiles.",
                    "recommended_action": "Sanitize email addresses with standard regex cleaning."
                }
                all_issues.append(issue)
                col_issues.append(issue["description"])
                for orig_idx, v in invalid_emails:
                    cell_diagnostics[f"{orig_idx},{col_name}"] = {
                        "issue": "Malformed Email",
                        "severity": "WARNING",
                        "value": v,
                        "reason": "Does not conform to user@domain.com pattern",
                        "action": "Fix spelling or remove domain errors"
                    }

        if is_date_col and valid_nonempty_vals:
            invalid_dates = [
                (orig_idx, v) for orig_idx, v in zip(raw_nonempty_indices, valid_nonempty_vals)
                if parse_date_safe(v) is None
            ]
            if invalid_dates:
                total_invalid_cells += len(invalid_dates)
                issue = {
                    "id": f"issue-invalid-date-{col_idx}",
                    "severity": "WARNING",
                    "rule": "Invalid Date Format",
                    "column": col_name,
                    "affected_rows": len(invalid_dates),
                    "affected_pct": round((len(invalid_dates) / total_rows) * 100, 1),
                    "description": f"{len(invalid_dates)} unparseable date values found.",
                    "why_it_matters": "Inconsistent date formats break time-series sorting, date math, and partitioning.",
                    "recommended_action": "Standardize to ISO 8601 (YYYY-MM-DD)."
                }
                all_issues.append(issue)
                col_issues.append(issue["description"])
                for orig_idx, v in invalid_dates:
                    cell_diagnostics[f"{orig_idx},{col_name}"] = {
                        "issue": "Unparseable Date",
                        "severity": "WARNING",
                        "value": v,
                        "reason": "Date string format is unrecognized",
                        "action": "Standardize to YYYY-MM-DD"
                    }

        if unique_count == 1 and total_rows > 1:
            issue = {
                "id": f"issue-constant-col-{col_idx}",
                "severity": "INFO",
                "rule": "Constant Column",
                "column": col_name,
                "affected_rows": total_rows,
                "affected_pct": 100.0,
                "description": f'Contains only 1 unique constant value ("{valid_nonempty_vals[0]}").',
                "why_it_matters": "Zero variance columns provide zero information gain for modeling and waste memory.",
                "recommended_action": "Drop column if not required for audit constants."
            }
            all_issues.append(issue)
            col_issues.append(issue["description"])

        if inferred_type == "Categorical / Text" and valid_nonempty_vals:
            case_map = defaultdict(set)
            for v in valid_nonempty_vals:
                case_map[v.lower().strip()].add(v)
            inconsistent_cases = {k: list(v) for k, v in case_map.items() if len(v) > 1}

            if inconsistent_cases:
                total_inconsistent_cells += sum(len(v) for v in inconsistent_cases.values())
                sample_variants = list(inconsistent_cases.values())[0]
                issue = {
                    "id": f"issue-casing-inconsistency-{col_idx}",
                    "severity": "WARNING",
                    "rule": "Categorical Inconsistency",
                    "column": col_name,
                    "affected_rows": sum(len(v) for v in inconsistent_cases.values()),
                    "affected_pct": round((sum(len(v) for v in inconsistent_cases.values()) / total_rows) * 100, 1),
                    "description": f"Found inconsistent casing variants (e.g. {sample_variants}).",
                    "why_it_matters": "Case mismatch splits identical categorical categories into separate groups in dashboards.",
                    "recommended_action": "Normalize text with uppercase or lowercase standardization."
                }
                all_issues.append(issue)
                col_issues.append(issue["description"])

        if inferred_type == "Categorical / Text" and unique_pct > 95 and total_rows > 25:
            if not is_id_column(col_name, unique_count, total_rows, inferred_type):
                issue = {
                    "id": f"issue-high-cardinality-{col_idx}",
                    "severity": "INFO",
                    "rule": "High Cardinality",
                    "column": col_name,
                    "affected_rows": unique_count,
                    "affected_pct": unique_pct,
                    "description": f"Very high cardinality: {unique_pct}% unique values.",
                    "why_it_matters": "High cardinality categorical features can cause memory bloat and overfitting.",
                    "recommended_action": "Inspect if column is an identifier or unstructured text."
                }
                all_issues.append(issue)
                col_issues.append(issue["description"])

        numeric_stats = None
        if nums and inferred_type in ("Integer", "Float"):
            min_val = min(nums)
            max_val = max(nums)
            mean_val = statistics.mean(nums)
            median_val = statistics.median(nums)
            std_val = statistics.stdev(nums) if len(nums) > 1 else 0.0
            zeros_cnt = sum(1 for n in nums if n == 0)
            neg_cnt = sum(1 for n in nums if n < 0)

            is_pos_domain = any(k in col_name.lower() for k in NON_NEGATIVE_KEYWORDS)
            if neg_cnt > 0 and is_pos_domain:
                total_invalid_cells += neg_cnt
                issue = {
                    "id": f"issue-neg-val-{col_idx}",
                    "severity": "WARNING",
                    "rule": "Negative Values in Positive Domain",
                    "column": col_name,
                    "affected_rows": neg_cnt,
                    "affected_pct": round((neg_cnt / total_rows) * 100, 1),
                    "description": f"Contains {neg_cnt} negative value(s) (min: {min_val}) in a field typically non-negative.",
                    "why_it_matters": "Negative values in metrics like price, age, or quantity often indicate refunds or logging bugs.",
                    "recommended_action": "Verify if negative values represent offsets/refunds or invalid data."
                }
                all_issues.append(issue)
                col_issues.append(issue["description"])

                for orig_idx, v_num in zip(num_indices, nums):
                    if v_num < 0:
                        cell_diagnostics[f"{orig_idx},{col_name}"] = {
                            "issue": "Negative Value Anomaly",
                            "severity": "WARNING",
                            "value": str(v_num),
                            "reason": f"Negative value ({v_num}) in expected positive metric",
                            "action": "Check if sign flip or refund record"
                        }

            outliers_count = 0
            if len(nums) >= 6:
                sorted_nums = sorted(nums)
                q1 = sorted_nums[int(len(sorted_nums) * 0.25)]
                q3 = sorted_nums[int(len(sorted_nums) * 0.75)]
                iqr = q3 - q1
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr

                outlier_indices = [
                    orig_idx for orig_idx, n in zip(num_indices, nums)
                    if (n < lower_bound or n > upper_bound)
                ]
                outliers_count = len(outlier_indices)
                if outliers_count > 0:
                    issue = {
                        "id": f"issue-outliers-{col_idx}",
                        "severity": "INFO",
                        "rule": "Statistical Outliers (IQR)",
                        "column": col_name,
                        "affected_rows": outliers_count,
                        "affected_pct": round((outliers_count / len(nums)) * 100, 1),
                        "description": f"Detected {outliers_count} statistical outlier(s) outside 1.5×IQR boundary.",
                        "why_it_matters": "Extreme outliers distort means, variances, and regression weights.",
                        "recommended_action": "Inspect if outliers are valid extreme events or measurement errors."
                    }
                    all_issues.append(issue)
                    col_issues.append(issue["description"])

                    for o_idx in outlier_indices:
                        if f"{o_idx},{col_name}" not in cell_diagnostics:
                            cell_diagnostics[f"{o_idx},{col_name}"] = {
                                "issue": "Statistical Outlier",
                                "severity": "INFO",
                                "value": str(raw_vals[o_idx]),
                                "reason": f"Value falls outside IQR boundary [{lower_bound:.2f}, {upper_bound:.2f}]",
                                "action": "Verify if natural extreme or entry error"
                            }

            hist = []
            if min_val != max_val:
                bin_count = min(7, len(nums))
                bin_width = (max_val - min_val) / bin_count
                bins = [0] * bin_count
                for n in nums:
                    idx = min(int((n - min_val) / bin_width), bin_count - 1)
                    bins[idx] += 1
                for b_i in range(bin_count):
                    hist.append({
                        "label": f"{min_val + b_i*bin_width:.1f} - {min_val + (b_i+1)*bin_width:.1f}",
                        "count": bins[b_i]
                    })
            else:
                hist.append({"label": str(min_val), "count": len(nums)})

            numeric_stats = {
                "min": round(min_val, 4),
                "max": round(max_val, 4),
                "mean": round(mean_val, 4),
                "median": round(median_val, 4),
                "std_dev": round(std_val, 4),
                "zeros_count": zeros_cnt,
                "negatives_count": neg_cnt,
                "outliers_count": outliers_count,
                "histogram": hist
            }

        top_values = []
        if valid_nonempty_vals:
            counter = Counter(valid_nonempty_vals)
            for val, cnt in counter.most_common(5):
                top_values.append({
                    "value": str(val),
                    "count": cnt,
                    "percentage": round((cnt / len(valid_nonempty_vals)) * 100, 1)
                })

        col_penalties = 0
        if null_pct > 50:
            col_penalties += 40
        elif null_pct > 5:
            col_penalties += min(25, int(null_pct))
        
        if inferred_type in ("Integer", "Float") and len(nums) < len(valid_nonempty_vals):
            col_penalties += 25
        
        col_health = max(0, min(100, 100 - col_penalties))

        col_data = {
            "name": col_name,
            "index": col_idx,
            "total_rows": total_rows,
            "nonempty_count": len(valid_nonempty_vals),
            "null_count": total_col_nulls,
            "null_pct": null_pct,
            "empty_str_count": empty_str_count,
            "whitespace_only_count": whitespace_only_count,
            "null_literal_count": null_literal_count,
            "unique_count": unique_count,
            "unique_pct": unique_pct,
            "duplicate_count": col_dupes,
            "type": inferred_type,
            "numeric_stats": numeric_stats,
            "top_values": top_values,
            "issues": col_issues,
            "health_score": col_health,
        }
        columns_analysis.append(col_data)

    overall_null_pct = round((total_nulls_count / total_cells) * 100, 2) if total_cells > 0 else 0
    dim_completeness = max(0.0, min(100.0, round(100.0 - overall_null_pct, 1)))

    invalid_pct = round((total_invalid_cells / total_cells) * 100, 2) if total_cells > 0 else 0
    dim_validity = max(0.0, min(100.0, round(100.0 - (invalid_pct * 3), 1)))

    dim_uniqueness = max(0.0, min(100.0, round(100.0 - duplicate_row_pct, 1)))

    inconsistent_pct = round((total_inconsistent_cells / total_cells) * 100, 2) if total_cells > 0 else 0
    dim_consistency = max(0.0, min(100.0, round(100.0 - (inconsistent_pct * 2), 1)))

    overall_score = round(
        (0.35 * dim_completeness) + 
        (0.30 * dim_validity) + 
        (0.20 * dim_uniqueness) + 
        (0.15 * dim_consistency), 
        1
    )

    critical_count = sum(1 for i in all_issues if i["severity"] == "CRITICAL")
    warning_count = sum(1 for i in all_issues if i["severity"] == "WARNING")
    info_count = sum(1 for i in all_issues if i["severity"] == "INFO")
    passed_checks_count = max(0, (total_cols * 5) - len(all_issues))

    scan_result = {
        "summary": {
            "filename": filename,
            "total_rows": total_rows,
            "total_cols": total_cols,
            "total_cells": total_cells,
            "total_nulls": total_nulls_count,
            "total_null_pct": overall_null_pct,
            "total_duplicate_rows": total_duplicate_rows,
            "duplicate_row_pct": duplicate_row_pct,
            "overall_quality_score": overall_score,
            "file_size_bytes": len(content_str.encode("utf-8")),
            "delimiter": delim,
        },
        "dimensions": {
            "completeness": dim_completeness,
            "validity": dim_validity,
            "uniqueness": dim_uniqueness,
            "consistency": dim_consistency,
            "weights": {
                "completeness": 35,
                "validity": 30,
                "uniqueness": 20,
                "consistency": 15
            }
        },
        "issue_counts": {
            "critical": critical_count,
            "warning": warning_count,
            "info": info_count,
            "passed": passed_checks_count,
            "total": len(all_issues)
        },
        "issues": all_issues,
        "columns": columns_analysis,
        "preview_rows": rows[:100],
        "cell_diagnostics": cell_diagnostics,
    }

    # Attach Smart EDA default payload
    scan_result["eda"] = build_smart_eda_payload(scan_result)

    return scan_result


SAMPLE_DATASETS = {
    "ecommerce_orders": {
        "name": "E-Commerce Orders & Shipments",
        "description": "Realistic order exports with missing currencies, negative discounts, invalid emails, and duplicate customer entries.",
        "csv": """order_id,customer_name,email,product_sku,amount,currency,discount_rate,status,created_at
ORD-1001,John Doe,john@example.com,SKU-A99,129.50,USD,0.10,Completed,2026-09-01
ORD-1002,Jane Smith,jane@work.org,SKU-B12,45.00,USD,0.00,Completed,2026-09-01
ORD-1003,Alex Rivera,bad-email-format,SKU-C33,null,EUR,0.15,Pending,2026-09-02
ORD-1004,Maria Garcia,maria@test.com,SKU-A99,129.50,USD,0.00,completed,2026-09-02
ORD-1005,Liam Chen,liam@example.com,SKU-D01,-15.00,USD,-0.05,Refunded,2026-09-03
ORD-1006,Sophia Patel,,SKU-B12,45.00,eur,0.00,Completed,2026-09-03
ORD-1007,Noah Taylor,noah@domain.com,SKU-E99,950.00,GBP,0.25,Completed,2026-09-04
ORD-1008,Emma Wilson,emma@web.co,SKU-A99,129.50,USD,0.00,Processing,2026-09-04
ORD-1009,James Brown,james@sample.io,SKU-F44,0.00,USD,1.00,Cancelled,2026-09-05
ORD-1010,Olivia Davis,,SKU-A99,N/A,USD,0.00,Pending,2026-09-05
ORD-1011,William Evans,w.evans@test.org,SKU-B12,45.00,USD,0.00,Completed,2026-09-06
ORD-1012,Ava Martinez,ava.m@home.net,SKU-K11,320.75,EUR,0.05,Completed,2026-09-06
"""
    },
    "customer_churn": {
        "name": "SaaS Customer Churn & Usage",
        "description": "Subscription metrics with missing usage hours, age outliers, and billing cycles.",
        "csv": """customer_id,plan_tier,monthly_fee,tenure_months,support_tickets,usage_hours_weekly,churned
CUST-001,Pro,49.99,14,2,38.5,No
CUST-002,Starter,19.99,3,5,,Yes
CUST-003,Enterprise,299.00,36,0,85.2,No
CUST-004,Starter,19.99,1,8,4.1,Yes
CUST-005,Pro,49.99,22,1,44.0,no
CUST-006,Enterprise,299.00,12,3,92.6,No
CUST-007,Starter,19.99,6,None,12.0,Yes
CUST-008,Pro,49.99,9,2,31.4,No
CUST-009,Starter,19.99,-4,1,8.9,No
CUST-010,Enterprise,299.00,48,0,120.5,No
CUST-011,Pro,49.99,18,4,   ,Yes
CUST-012,Starter,19.99,2,7,3.0,Yes
"""
    },
    "patient_clinical": {
        "name": "Clinical Vitals & Lab Measurements",
        "description": "Healthcare dataset showing blood pressure, heart rate, null values, and temperature variations.",
        "csv": """patient_id,age,gender,systolic_bp,diastolic_bp,heart_rate,temperature_c,blood_group,flagged
P-901,45,M,120,80,72,36.6,O+,Normal
P-902,62,F,142,92,85,37.1,A+,High BP
P-903,29,F,115,75,,36.8,B+,Normal
P-904,71,M,160,100,90,38.4,O-,Critical
P-905,53,F,NaN,82,76,36.5,AB+,Normal
P-906,38,M,118,78,68,36.7,O+,Normal
P-907,80,M,155,95,94,,A-,High BP
P-908,33,F,110,70,64,36.6,B-,Normal
P-909,67,M,148,90,82,37.0,O+,High BP
P-910,24,F,108,72,70,36.5,A+,Normal
"""
    }
}


class DQScanHTTPHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "app": "Data Sarthi Platform"}).encode("utf-8"))
            return

        elif parsed.path == "/api/samples":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            sample_list = [
                {"id": k, "name": v["name"], "description": v["description"]}
                for k, v in SAMPLE_DATASETS.items()
            ]
            self.wfile.write(json.dumps({"samples": sample_list}).encode("utf-8"))
            return

        elif parsed.path.startswith("/api/sample/"):
            sample_id = parsed.path.replace("/api/sample/", "").strip("/")
            if sample_id in SAMPLE_DATASETS:
                sample = SAMPLE_DATASETS[sample_id]
                result = analyze_csv_data(sample["csv"], filename=f"{sample_id}.csv")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))
            else:
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Sample dataset not found"}).encode("utf-8"))
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/scan":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            try:
                content_type = self.headers.get("Content-Type", "")
                if "application/json" in content_type:
                    data = json.loads(body.decode("utf-8", errors="replace"))
                    csv_text = data.get("csv", "")
                    filename = data.get("filename", "uploaded.csv")
                    delim = data.get("delimiter", "auto")
                else:
                    csv_text = body.decode("utf-8", errors="replace")
                    filename = "uploaded.csv"
                    delim = "auto"

                result = analyze_csv_data(csv_text, filename=filename, delim=delim)
                response_json = json.dumps(result).encode("utf-8")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(response_json)
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif parsed.path == "/api/eda":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            try:
                data = json.loads(body.decode("utf-8", errors="replace"))
                scan_data = data.get("scan_result")
                targets = data.get("targets", [])
                features = data.get("features", None)

                if not scan_data:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Missing scan_result"}).encode("utf-8"))
                    return

                eda_result = build_smart_eda_payload(scan_data, selected_targets=targets, selected_features=features)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(eda_result).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


def run_server(port=PORT):
    os.makedirs(STATIC_DIR, exist_ok=True)
    server_address = ("", port)
    httpd = HTTPServer(server_address, DQScanHTTPHandler)
    print(f"\n==================================================")
    print(f"  DATA SARTHI Platform + Smart EDA Server Running")
    print(f"  Local URL: http://localhost:{port}")
    print(f"  Network:   http://127.0.0.1:{port}")
    print(f"==================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()


if __name__ == "__main__":
    p = PORT
    if len(sys.argv) > 1:
        try:
            p = int(sys.argv[1])
        except ValueError:
            pass
    run_server(p)
