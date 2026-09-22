"""
Unit Tests for Data Sarthi Extended Scanner & Quality Rules
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from web_server import analyze_csv_data


class TestExtendedScannerRules(unittest.TestCase):

    def test_empty_dataset(self):
        result = analyze_csv_data("", filename="empty.csv")
        self.assertIn("error", result)
        self.assertEqual(result["summary"]["total_rows"], 0)

    def test_missing_values_and_null_literals(self):
        csv_data = """id,score,category
1,10.5,A
2,,B
3,null,C
4,nan,D
5,N/A,E
"""
        result = analyze_csv_data(csv_data)
        summary = result["summary"]
        self.assertEqual(summary["total_rows"], 5)
        # 4 rows have missing score (empty, null, nan, N/A)
        score_col = next(c for c in result["columns"] if c["name"] == "score")
        self.assertEqual(score_col["null_count"], 4)
        self.assertGreater(score_col["null_pct"], 50)
        # Must detect severe missing value issue
        has_null_issue = any(i["rule"] == "Severe Missing Values" for i in result["issues"])
        self.assertTrue(has_null_issue)

    def test_duplicate_rows(self):
        csv_data = """id,val
1,apple
1,apple
2,orange
"""
        result = analyze_csv_data(csv_data)
        self.assertEqual(result["summary"]["total_duplicate_rows"], 1)
        has_dupe_issue = any(i["rule"] == "Duplicate Records" for i in result["issues"])
        self.assertTrue(has_dupe_issue)

    def test_categorical_inconsistency(self):
        csv_data = """order_id,currency
1,EUR
2,eur
3,Eur
4,USD
"""
        result = analyze_csv_data(csv_data)
        has_casing_issue = any(i["rule"] == "Categorical Inconsistency" for i in result["issues"])
        self.assertTrue(has_casing_issue)

    def test_invalid_email_format(self):
        csv_data = """user_id,email
1,john@example.com
2,not-a-valid-email
3,admin@corp.io
"""
        result = analyze_csv_data(csv_data)
        has_email_issue = any(i["rule"] == "Invalid Email Format" for i in result["issues"])
        self.assertTrue(has_email_issue)

    def test_invalid_date_format(self):
        csv_data = """id,created_at
1,2026-09-01
2,2026-09-02
3,not-a-date-string
"""
        result = analyze_csv_data(csv_data)
        has_date_issue = any(i["rule"] == "Invalid Date Format" for i in result["issues"])
        self.assertTrue(has_date_issue)

    def test_numeric_outliers(self):
        # 9 normal numbers around 10, one extreme outlier at 1000
        csv_data = """id,amount
1,10.0
2,10.2
3,9.8
4,10.1
5,10.0
6,9.9
7,10.3
8,10.0
9,1000.0
"""
        result = analyze_csv_data(csv_data)
        has_outlier_issue = any(i["rule"] == "Statistical Outliers (IQR)" for i in result["issues"])
        self.assertTrue(has_outlier_issue)

    def test_mixed_data_types(self):
        csv_data = """id,amount
1,100.50
2,200.00
3,350.25
4,unknown_value
5,TBD
"""
        result = analyze_csv_data(csv_data)
        has_mixed_issue = any(i["rule"] == "Mixed Data Types" for i in result["issues"])
        self.assertTrue(has_mixed_issue)

    def test_quality_dimensions_and_score(self):
        csv_data = """id,name,email,amount
1,Alice,alice@corp.com,100
2,Bob,bob@corp.com,200
3,Charlie,charlie@corp.com,300
"""
        result = analyze_csv_data(csv_data)
        dims = result["dimensions"]
        self.assertEqual(dims["completeness"], 100.0)
        self.assertEqual(dims["validity"], 100.0)
        self.assertEqual(dims["uniqueness"], 100.0)
        self.assertEqual(dims["consistency"], 100.0)
        self.assertEqual(result["summary"]["overall_quality_score"], 100.0)


if __name__ == "__main__":
    unittest.main()
