"""
Setup script — run ONCE to build the processed dataset.
Usage (from project root):
    python -m ml.setup_data
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import pandas as pd
from ml.data_fetcher import fetch_and_generate
from ml.pipeline import analyze_text_advanced

ML_DIR  = os.path.dirname(os.path.abspath(__file__))
RAW_CSV = os.path.join(ML_DIR, "dataset.csv")
PRO_CSV = os.path.join(ML_DIR, "dataset_processed.csv")


def run():
    # Step 1 — fetch
    df = fetch_and_generate()
    df.to_csv(RAW_CSV, index=False)
    print(f"[2/3] Raw dataset saved -> {RAW_CSV}")

    # Step 2 — run ML pipeline on every review
    print("[3/3] Running ML analysis on all reviews ...")
    rows = df.to_dict(orient="records")
    processed = []
    total = len(rows)
    for i, row in enumerate(rows):
        if i % 100 == 0:
            print(f"      ... {i}/{total}", end="\r")
        analysis = analyze_text_advanced(row["review_text"])
        row["sentiment"]    = analysis["sentiment"]
        row["confidence"]   = round(float(analysis["confidence"]), 4)
        row["emotion"]      = analysis["emotion"]
        row["aspects"]      = json.dumps(analysis["aspects"])
        row["is_fake_score"]= round(float(analysis["is_fake_score"]), 4)
        processed.append(row)

    result = pd.DataFrame(processed)
    result.to_csv(PRO_CSV, index=False)
    print(f"\n      [OK] Processed dataset saved -> {PRO_CSV}")
    print(f"\n[DONE] Done! {len(result)} reviews, {result['category'].nunique()} categories.")
    print("   Restart the backend server to load the new data.\n")


if __name__ == "__main__":
    run()
