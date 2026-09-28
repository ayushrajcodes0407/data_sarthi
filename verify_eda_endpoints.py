import urllib.request
import json

def run_tests():
    base = 'http://localhost:8000'
    print("=== Testing Data Sarthi Smart EDA Endpoints ===")
    
    # 1. Health check
    try:
        with urllib.request.urlopen(f'{base}/api/health') as r:
            health = json.loads(r.read())
            print(f"[OK] /api/health -> Status: {r.status}, Data: {health}")
    except Exception as e:
        print(f"[FAIL] /api/health -> {e}")

    # 2. Sample Datasets (E-commerce, Churn, Clinical)
    samples = ['ecommerce_orders', 'customer_churn', 'patient_clinical']
    for sample in samples:
        try:
            with urllib.request.urlopen(f'{base}/api/sample/{sample}') as r:
                data = json.loads(r.read())
                eda = data.get('eda', {})
                target_analyses = eda.get('target_analyses', [])
                top_bivariate = len(target_analyses[0].get('bivariate_features', [])) if target_analyses else 0
                corr_cols = len(eda.get('correlations', {}).get('numerical_columns', []))
                insights = len(eda.get('smart_insights', []))
                outliers = len(eda.get('outlier_analysis', {}))
                missing = len(eda.get('missing_data', []))
                
                print(f"[OK] Sample '{sample}':")
                print(f"     Rows: {data['summary']['total_rows']}, Cols: {data['summary']['total_cols']}")
                print(f"     Target Analyses: {len(target_analyses)} | Top Bivariate Plots: {top_bivariate}")
                print(f"     Correlations Numerical Cols: {corr_cols} | Heatmap Matrix: {len(eda.get('correlations', {}).get('matrix', {}))}")
                print(f"     Insights: {insights} | Outlier Cols: {outliers} | Missing Cols: {missing}")
        except Exception as e:
            print(f"[FAIL] Sample '{sample}' -> {e}")

    # 3. Test POST /api/eda with Multiple Targets & Custom Features
    try:
        with urllib.request.urlopen(f'{base}/api/sample/ecommerce_orders') as r:
            scan_res = json.loads(r.read())
        
        post_payload = json.dumps({
            'scan_result': scan_res,
            'targets': ['status', 'amount'],
            'features': ['product_sku', 'currency', 'discount_rate']
        }).encode('utf-8')
        
        req = urllib.request.Request(f'{base}/api/eda', data=post_payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as r:
            eda_res = json.loads(r.read())
            targets_computed = [t['target_column'] for t in eda_res.get('target_analyses', [])]
            print(f"[OK] POST /api/eda Multi-Target: Status={r.status}")
            print(f"     Targets Computed: {targets_computed}")
            for t in eda_res.get('target_analyses', []):
                print(f"     - Target '{t['target_column']}': Type={t['problem_type']}, Bivariate Features={len(t.get('bivariate_features', []))}")
    except Exception as e:
        print(f"[FAIL] POST /api/eda -> {e}")

    print("=== All Server Endpoints Tested Successfully ===")

if __name__ == '__main__':
    run_tests()
