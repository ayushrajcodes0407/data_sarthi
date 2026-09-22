"""
Unit Tests for Data Sarthi — Smart EDA & Visual Analytics Engine
Covers all 12 dataset scenarios:
1. Pure numerical dataset
2. Pure categorical dataset
3. Mixed dataset
4. Binary classification dataset
5. Multiclass classification dataset
6. Regression dataset
7. Datetime dataset
8. Dataset with missing values
9. Dataset containing ID columns
10. Dataset with multiple target columns
11. Very small dataset (2-3 rows)
12. Empty / invalid dataset
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from web_server import analyze_csv_data
from eda_engine import (
    build_smart_eda_payload,
    build_correlation_matrix,
    detect_target_candidates,
    generate_smart_insights,
    is_id_column,
    recommend_charts,
)


class TestSmartEDAEngine(unittest.TestCase):

    # 1. Pure Numerical Dataset
    def test_pure_numerical_dataset(self):
        csv_data = """height,weight,age,income
170,65,25,50000
180,80,35,75000
165,55,22,42000
175,70,29,60000
185,85,42,90000
160,50,20,38000
"""
        scan = analyze_csv_data(csv_data, "pure_numeric.csv")
        eda = build_smart_eda_payload(scan)

        self.assertIn("correlations", eda)
        corr = eda["correlations"]
        self.assertGreaterEqual(len(corr["numerical_columns"]), 3)
        self.assertIn("matrix", corr)
        # Check height vs weight correlation is calculated and close to 1.0
        r_hw = corr["matrix"]["height"]["weight"]
        self.assertGreater(r_hw, 0.8)

        # Check chart recommendations for numeric columns
        recs = eda["recommended_charts"]
        self.assertTrue(any(r["chart_type"] == "histogram" for r in recs))

    # 2. Pure Categorical Dataset
    def test_pure_categorical_dataset(self):
        csv_data = """country,tier,department,status
USA,Gold,Sales,Active
UK,Silver,Engineering,Active
Germany,Bronze,Support,Inactive
USA,Gold,Engineering,Active
Canada,Silver,Sales,Pending
"""
        scan = analyze_csv_data(csv_data, "pure_cat.csv")
        eda = build_smart_eda_payload(scan)

        corr = eda["correlations"]
        # No numeric columns, should handle gracefully with empty matrix
        self.assertEqual(len(corr["numerical_columns"]), 0)
        self.assertEqual(len(corr["ranked_pairs"]), 0)

        # Chart recommendations should be bar charts
        recs = eda["recommended_charts"]
        self.assertTrue(all(r["chart_type"] in ("bar", "frequency") for r in recs))

    # 3. Mixed Dataset
    def test_mixed_dataset(self):
        csv_data = """age,city,spend,is_member
25,New York,150.50,True
35,London,320.00,True
45,Paris,85.20,False
55,Tokyo,410.00,True
20,New York,60.00,False
"""
        scan = analyze_csv_data(csv_data, "mixed.csv")
        eda = build_smart_eda_payload(scan)

        self.assertIn("smart_insights", eda)
        self.assertIn("suggested_targets", eda)
        self.assertGreater(len(eda["recommended_charts"]), 0)

    # 4. Binary Classification Dataset
    def test_binary_classification_dataset(self):
        csv_data = """tenure,monthly_charges,total_charges,churned
12,65.5,780.0,0
24,80.0,1920.0,0
3,70.2,210.6,1
48,95.0,4560.0,0
1,55.0,55.0,1
6,75.0,450.0,1
"""
        scan = analyze_csv_data(csv_data, "binary_churn.csv")
        eda = build_smart_eda_payload(scan, selected_targets=["churned"])

        self.assertGreater(len(eda["target_analyses"]), 0)
        t_analysis = eda["target_analyses"][0]
        self.assertEqual(t_analysis["target_column"], "churned")
        self.assertEqual(t_analysis["problem_type"], "Binary Classification")
        self.assertEqual(t_analysis["unique_classes"], 2)
        self.assertIn("class_distribution", t_analysis)
        self.assertEqual(len(t_analysis["class_distribution"]), 2)

    # 5. Multiclass Classification Dataset
    def test_multiclass_classification_dataset(self):
        csv_data = """age,income,subscription_tier
22,30000,Free
30,55000,Pro
45,120000,Enterprise
28,45000,Pro
19,20000,Free
50,150000,Enterprise
34,60000,Pro
"""
        scan = analyze_csv_data(csv_data, "multiclass.csv")
        eda = build_smart_eda_payload(scan, selected_targets=["subscription_tier"])

        t_analysis = eda["target_analyses"][0]
        self.assertEqual(t_analysis["problem_type"], "Multiclass Classification")
        self.assertEqual(t_analysis["unique_classes"], 3)

    # 6. Regression Dataset
    def test_regression_dataset(self):
        csv_data = """square_feet,bedrooms,bathrooms,price
1200,2,1.5,250000
1800,3,2.0,380000
2400,4,3.0,520000
900,1,1.0,190000
3100,5,4.0,680000
1500,3,2.0,320000
"""
        scan = analyze_csv_data(csv_data, "housing_regression.csv")
        eda = build_smart_eda_payload(scan, selected_targets=["price"])

        t_analysis = eda["target_analyses"][0]
        self.assertEqual(t_analysis["problem_type"], "Regression")
        self.assertIn("continuous_stats", t_analysis)
        self.assertGreater(t_analysis["continuous_stats"]["mean"], 0)
        self.assertTrue(any(bf["chart_type"] == "scatter" for bf in t_analysis["bivariate_features"]))

    # 7. Datetime Dataset
    def test_datetime_dataset(self):
        csv_data = """timestamp,temperature,humidity
2026-09-01,22.5,60
2026-09-02,23.1,58
2026-09-03,21.8,65
2026-09-04,24.0,55
2026-09-05,25.2,50
"""
        scan = analyze_csv_data(csv_data, "timeseries.csv")
        eda = build_smart_eda_payload(scan)

        date_recs = [r for r in eda["recommended_charts"] if r["column"] == "timestamp"]
        self.assertTrue(len(date_recs) > 0)
        self.assertEqual(date_recs[0]["chart_type"], "line")

    # 8. Dataset with Missing Values
    def test_dataset_with_missing_values(self):
        csv_data = """user,score,age,flag
Alice,100,,1
Bob,,30,0
Charlie,null,40,1
David,85,nan,
Eve,,50,0
"""
        scan = analyze_csv_data(csv_data, "missing.csv")
        eda = build_smart_eda_payload(scan)

        # Insights should capture missingness without throwing errors
        self.assertIn("smart_insights", eda)
        missing_insights = [i for i in eda["smart_insights"] if i["type"] == "Missing Data"]
        self.assertGreaterEqual(len(missing_insights), 1)

    # 9. Dataset containing ID Columns
    def test_dataset_with_id_columns(self):
        csv_data = """customer_id,account_uuid,sku_code,amount,rating
CUST-001,550e8400-e29b-41d4-a716-446655440000,SKU-99,100,5
CUST-002,550e8400-e29b-41d4-a716-446655440001,SKU-98,200,4
CUST-003,550e8400-e29b-41d4-a716-446655440002,SKU-97,300,3
CUST-004,550e8400-e29b-41d4-a716-446655440003,SKU-96,400,5
"""
        self.assertTrue(is_id_column("customer_id", 4, 4, "Categorical / Text"))
        self.assertTrue(is_id_column("account_uuid", 4, 4, "Categorical / Text"))
        self.assertTrue(is_id_column("sku_code", 4, 4, "Categorical / Text"))
        self.assertFalse(is_id_column("amount", 4, 4, "Integer"))

        scan = analyze_csv_data(csv_data, "ids.csv")
        eda = build_smart_eda_payload(scan)

        # ID columns should NOT be suggested as primary targets
        suggested_cols = [s["column"] for s in eda["suggested_targets"]]
        self.assertNotIn("customer_id", suggested_cols)
        self.assertNotIn("account_uuid", suggested_cols)

    # 10. Dataset with Multiple Target Columns
    def test_multiple_target_columns(self):
        csv_data = """user_id,tenure,age,churned,expected_revenue
U1,12,30,0,1200.50
U2,24,45,0,2400.00
U3,2,22,1,150.00
U4,36,55,0,3600.00
U5,6,28,1,450.00
"""
        scan = analyze_csv_data(csv_data, "multi_target.csv")
        eda = build_smart_eda_payload(scan, selected_targets=["churned", "expected_revenue"])

        self.assertEqual(len(eda["target_analyses"]), 2)
        t_names = [t["target_column"] for t in eda["target_analyses"]]
        self.assertIn("churned", t_names)
        self.assertIn("expected_revenue", t_names)

        # Check respective problem types
        churn_t = next(t for t in eda["target_analyses"] if t["target_column"] == "churned")
        rev_t = next(t for t in eda["target_analyses"] if t["target_column"] == "expected_revenue")
        self.assertEqual(churn_t["problem_type"], "Binary Classification")
        self.assertEqual(rev_t["problem_type"], "Regression")

    # 11. Very Small Dataset (2-3 rows)
    def test_very_small_dataset(self):
        csv_data = """x,y,tag
1,10,A
2,20,B
"""
        scan = analyze_csv_data(csv_data, "small.csv")
        eda = build_smart_eda_payload(scan)

        self.assertIsNotNone(eda)
        self.assertIn("correlations", eda)
        self.assertIn("recommended_charts", eda)
        # Should execute safely without division by zero or crashing

    # 12. Empty or Invalid Dataset
    def test_empty_or_invalid_dataset(self):
        scan = analyze_csv_data("", "empty.csv")
        eda = build_smart_eda_payload(scan)

        self.assertEqual(len(eda["suggested_targets"]), 0)
        self.assertEqual(len(eda["smart_insights"]), 0)
        self.assertEqual(len(eda["target_analyses"]), 0)
        self.assertEqual(len(eda["recommended_charts"]), 0)

    # 13. Non-Causal Language Check
    def test_non_causal_language(self):
        csv_data = """x,y
1,10
2,20
3,30
4,40
5,50
"""
        scan = analyze_csv_data(csv_data, "corr.csv")
        eda = build_smart_eda_payload(scan)

        for ins in eda["smart_insights"]:
            text = ins["description"].lower()
            self.assertNotIn("causes", text)
            self.assertNotIn("impacts", text)
            self.assertNotIn("guarantees", text)


if __name__ == "__main__":
    unittest.main()
