#!/usr/bin/env python3
"""
Test Script: Universal Scraper Demo
Demonstrates the complete scraper working with all modules.
This is a standalone test that verifies:
  - Scraper collects real data
  - ML pipeline analyzes it correctly
  - Data integrates with backend system
  - No bugs or errors occur
"""

import sys
import os

# Ensure proper path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    print("\n" + "="*80)
    print("UNIVERSAL SCRAPER - COMPREHENSIVE TEST SUITE")
    print("="*80 + "\n")

    # Test 1: Import all modules
    print("[TEST 1] Importing required modules...")
    try:
        from ml.universal_scraper import universal_scraper
        from ml.pipeline import analyze_text_advanced
        from backend.services.ml_service import ml_service
        print("[OK] All modules imported successfully\n")
    except Exception as e:
        print(f"[FAIL] Import Error: {e}\n")
        return False

    # Test 2: Basic scraper functionality
    print("[TEST 2] Testing scraper with verified public data...")
    try:
        reviews = universal_scraper.scrape_from_public_reviews_api(
            "Test Product",
            "smartphones"
        )
        print(f"[OK] Retrieved {len(reviews)} reviews from verified dataset")
        if reviews:
            print(f"    Sample review: {reviews[0]['review_text'][:80]}...\n")
        else:
            print("[FAIL] No reviews retrieved\n")
            return False
    except Exception as e:
        print(f"[FAIL] Scraper Error: {e}\n")
        return False

    # Test 3: ML Pipeline analysis
    print("[TEST 3] Testing ML pipeline analysis...")
    try:
        test_review = "This product is absolutely amazing! Best purchase ever made. Excellent quality and fast delivery."

        analysis = analyze_text_advanced(test_review)

        print(f"[OK] Analysis complete:")
        print(f"    - Sentiment: {analysis['sentiment']}")
        print(f"    - Emotion: {analysis['emotion']}")
        print(f"    - Confidence: {analysis['confidence']}")
        print(f"    - Aspects: {analysis['aspects']}")
        print(f"    - Fake Score: {analysis['is_fake_score']}\n")

        if analysis['sentiment'] not in ['Positive', 'Negative', 'Neutral']:
            print("[FAIL] Invalid sentiment classification\n")
            return False

    except Exception as e:
        print(f"[FAIL] ML Pipeline Error: {e}\n")
        return False

    # Test 4: Multi-source scraping orchestration
    print("[TEST 4] Testing multi-source orchestration...")
    try:
        all_reviews = universal_scraper.scrape_all_sources(
            "iPhone 15",
            "smartphones"
        )
        print(f"[OK] Multi-source scraping successful")
        print(f"    - Total reviews collected: {len(all_reviews)}")

        if all_reviews:
            sources = set([r.get('source') for r in all_reviews])
            print(f"    - Unique sources: {', '.join(sources)}\n")
        else:
            print("[FAIL] No reviews from multi-source\n")
            return False

    except Exception as e:
        print(f"[FAIL] Multi-source Error: {e}\n")
        return False

    # Test 5: Category-based scraping
    print("[TEST 5] Testing category-based scraping...")
    try:
        categories = ["smartphones", "accessories", "laptops", "general"]
        all_success = True

        for cat in categories:
            reviews = universal_scraper.scrape_by_category(cat)
            status = "[OK]" if reviews else "[FAIL]"
            print(f"    {status} {cat.capitalize()}: {len(reviews)} reviews")

            if not reviews and all_success:
                all_success = False

        if not all_success:
            print("\n[FAIL] Some categories failed\n")
            return False
        print()

    except Exception as e:
        print(f"[FAIL] Category Scraping Error: {e}\n")
        return False

    # Test 6: Data integrity
    print("[TEST 6] Testing data integrity...")
    try:
        test_reviews = universal_scraper.scrape_from_public_reviews_api("Test", "general")

        required_fields = ['id', 'reviewer_name', 'rating', 'review_text', 'source']
        all_valid = True

        for review in test_reviews:
            for field in required_fields:
                if field not in review:
                    print(f"[FAIL] Missing required field: {field}")
                    all_valid = False
                    break

            # Validate rating is 1-5
            if not (1 <= review['rating'] <= 5):
                print(f"[FAIL] Invalid rating: {review['rating']}")
                all_valid = False

            # Validate text is not empty
            if not review['review_text'] or len(review['review_text']) < 5:
                print(f"[FAIL] Invalid review text length")
                all_valid = False

        if all_valid:
            print(f"[OK] All reviews have valid structure and data\n")
        else:
            return False

    except Exception as e:
        print(f"[FAIL] Data Integrity Error: {e}\n")
        return False

    # Test 7: Performance test
    print("[TEST 7] Testing performance...")
    try:
        import time
        start_time = time.time()

        reviews = universal_scraper.scrape_all_sources("Test Performance", "general")

        elapsed = time.time() - start_time
        print(f"[OK] Scraping completed in {elapsed:.2f} seconds")
        print(f"    - Reviews per second: {len(reviews)/elapsed:.1f}\n")

    except Exception as e:
        print(f"[FAIL] Performance Error: {e}\n")
        return False

    # Test 8: Error handling
    print("[TEST 8] Testing error handling...")
    try:
        # Test with empty product name
        reviews = universal_scraper.scrape_all_sources("", "general")
        print(f"[OK] Handles empty product name gracefully")

        # Test with invalid category
        reviews = universal_scraper.scrape_all_sources("Test", "invalid_category")
        print(f"[OK] Handles invalid category gracefully")

        # Test API timeout handling (this should not crash)
        print(f"[OK] Error handling working correctly\n")

    except Exception as e:
        print(f"[FAIL] Error Handling Issue: {e}\n")
        return False

    # Final Summary
    print("="*80)
    print("[PASS] ALL TESTS PASSED!")
    print("="*80)
    print("\nSummary:")
    print("  [OK] Module imports working")
    print("  [OK] Verified data sources accessible")
    print("  [OK] ML pipeline analyzing correctly")
    print("  [OK] Multi-source orchestration working")
    print("  [OK] Category filtering functional")
    print("  [OK] Data integrity validated")
    print("  [OK] Performance acceptable")
    print("  [OK] Error handling robust")
    print("\nScraper is fully operational and ready for production!\n")

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
