"""
Unit and integration tests for the PhonePrint Python pipeline.
Verifies data ingestion, validation rules, normalization, Google Forms mapping,
PII stripping, duplicate detection (with/without timestamps), unmapped column warnings,
atomic dataset activation, failure recovery, and rollback mechanisms.
"""

from __future__ import annotations

import io
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from pipeline.process_survey import (
    process_survey_csv,
    ValidationError,
    parse_and_validate_features,
    resolve_column_mapping,
    detect_duplicates,
)
from pipeline.activate_dataset import (
    validate_dataset_invariants,
    activate_dataset,
    rollback_dataset,
    get_dataset_config,
    save_dataset_config,
    ACTIVE_DATA_PATH,
    CONFIG_PATH,
    BACKUPS_DIR,
)


class TestPhonePrintPipeline(unittest.TestCase):

    def test_process_valid_demo_data(self):
        """Verifies ingestion, normalization, and JSON output of valid demo CSV data."""
        csv_path = Path("pipeline/data/survey_demo_data.csv")
        self.assertTrue(csv_path.exists(), "Demo CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(csv_path, tmp_path, is_demo=True)
            self.assertTrue(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 30)
            self.assertEqual(len(dataset["responses"]), 30)

            first = dataset["responses"][0]
            self.assertEqual(first["response_id"], "RESP_001")
            self.assertEqual(first["preferred_brand"], "Apple")
            self.assertEqual(first["budget_range"], "Above ₹60,000")
            self.assertEqual(len(first["preferred_features"]), 3)
            self.assertIn("Camera Quality", first["preferred_features"])
            self.assertEqual(first["os_preference"], "iOS")
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_rejects_duplicate_respondent_ids(self):
        """Verifies that duplicate respondent IDs in the CSV are detected and rejected."""
        duplicate_csv = '''response_id,preferred_brand,budget_range,preferred_features,primary_use,os_preference
RESP_001,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
RESP_001,Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(duplicate_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("Duplicate respondent ID detected 'RESP_001'", str(ctx.exception.errors))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_rejects_fewer_than_three_features(self):
        """Verifies that selections with fewer than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features("Camera Quality; Battery Life", row_idx=1)
        self.assertIn("Exactly 3 distinct features must be selected; received 2", str(ctx.exception))

    def test_rejects_more_than_three_features(self):
        """Verifies that selections with more than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Processing Performance; Display Quality", row_idx=1
            )
        self.assertIn("Exactly 3 distinct features must be selected; received 4", str(ctx.exception))

    def test_rejects_duplicate_features_in_selection(self):
        """Verifies that duplicate features within the same respondent selection are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Camera Quality", row_idx=2
            )
        self.assertIn("Duplicate feature 'Camera Quality'", str(ctx.exception))

    def test_rejects_unrecognized_features(self):
        """Verifies that removed or unrecognized features (e.g. 5G, Fast Charging) are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; 5G Connectivity", row_idx=3
            )
        self.assertIn("Unrecognized feature '5G Connectivity'", str(ctx.exception))

    def test_rejects_missing_required_columns(self):
        """Verifies that CSV files missing required header columns are rejected."""
        incomplete_csv = """response_id,preferred_brand,budget_range
RESP_001,Apple,Over $1,000
"""
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(incomplete_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("missing required canonical survey fields", str(ctx.exception))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_google_forms_template_mapping(self):
        """Verifies that the Google Forms template CSV with full question headers maps correctly."""
        template_path = Path("data/templates/google_forms_survey_template.csv")
        self.assertTrue(template_path.exists(), "Template CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(template_path, tmp_path, is_demo=False)
            self.assertFalse(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 8)
            # Verify pseudonymized sequential IDs
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][7]["response_id"], "RESP_008")
            # Verify canonical features mapped from comma/semicolon strings
            for resp in dataset["responses"]:
                self.assertEqual(len(resp["preferred_features"]), 3)
                self.assertIsInstance(resp["preferred_brand"], str)
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_pii_stripping_guarantee(self):
        """Verifies that sensitive PII columns (e.g. Email Address) are strictly stripped."""
        csv_with_pii = '''Timestamp,Email Address,Username,Student Name,What is your preferred smartphone brand?,What is your budget range for a new smartphone?,Which 3 features matter most to you when choosing a smartphone?,What is your primary use for your smartphone?,What smartphone operating system do you prefer?
2026-11-06 10:00:00,student@university.edu,student1,Jane Doe,Apple,"Over $1,000","Camera Quality, Battery Life, Build & Design Quality",Social Media & Content Consumption,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_pii)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            json_text = tmp_json_path.read_text(encoding="utf-8")

            # Check that PII values never appear in the JSON output
            self.assertNotIn("student@university.edu", json_text)
            self.assertNotIn("student1", json_text)
            self.assertNotIn("Jane Doe", json_text)
            self.assertNotIn("Email Address", json_text)

            # Response structure only contains canonical fields
            resp = dataset["responses"][0]
            self.assertEqual(resp["response_id"], "RESP_001")
            self.assertEqual(resp["preferred_brand"], "Apple")
            self.assertNotIn("email", resp)
            self.assertNotIn("name", resp)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_blank_row_handling(self):
        """Verifies that blank or whitespace-only lines are ignored and counted cleanly."""
        csv_with_blanks = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS

   
Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android


'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_blanks)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(len(dataset["responses"]), 2)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_encoding_fallback_utf8_bom_and_latin1(self):
        """Verifies that UTF-8 with BOM and Latin-1 encodings are handled cleanly."""
        csv_content = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Google,"$400 - $700",Camera Quality; Battery Life; Software & OS Experience,Everyday Communication & Browsing,Android
'''
        # Test UTF-8 with BOM (common Excel export from Google Forms)
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8-sig") as f:
            f.write(csv_content)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
            self.assertEqual(dataset["responses"][0]["preferred_brand"], "Google")
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 1: Duplicate Detection With & Without Timestamps
    # -------------------------------------------------------------------------

    def test_duplicate_detection_missing_timestamp_retains_identical_preferences(self):
        """
        ISSUE 1 (A): When timestamp column is omitted, two valid respondents with
        identical preferences MUST both be retained, no exact duplicate excluded,
        and a clear warning emitted to sys.stderr.
        """
        csv_no_timestamp = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_no_timestamp)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            # Both respondents retained as distinct students
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][1]["response_id"], "RESP_002")

            # Warning captured
            stderr_output = stderr_capture.getvalue()
            self.assertIn("WARNING: Exact duplicate submission detection skipped", stderr_output)
            self.assertIn("no usable timestamp column was available", stderr_output)

            # Audit report confirms 0 exact duplicates excluded, 1 identical profile retained
            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 0)
                self.assertEqual(rep.get("identical_profiles_retained"), 1)
                self.assertEqual(rep.get("accepted_records"), 2)
                self.assertEqual(rep.get("rejected_records"), 0)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_duplicate_detection_available_timestamp_exact_duplicate_excluded(self):
        """
        ISSUE 1 (B): When timestamp is available, identical timestamps and identical answers
        trigger exact duplicate exclusion: first occurrence kept, second excluded.
        """
        csv_with_timestamp = '''Timestamp,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_timestamp)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            # Only first instance retained
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")

            # Audit report confirms exclusion
            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 1)
                self.assertEqual(rep.get("accepted_records"), 1)
                self.assertEqual(rep.get("rejected_records"), 1)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_duplicate_detection_distinct_timestamps_retains_both(self):
        """
        ISSUE 1 (C & D): When timestamps are distinct, identical preferences represent
        independent legitimate student choices. BOTH are retained as separate respondents.
        """
        csv_distinct_ts = '''Timestamp,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
2026-11-06 10:15:30,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_distinct_ts)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][1]["response_id"], "RESP_002")

            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 0)
                self.assertEqual(rep.get("identical_profiles_retained"), 1)
                self.assertEqual(rep.get("accepted_records"), 2)
                self.assertEqual(rep.get("rejected_records"), 0)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_accounting_invariant_holds(self):
        """ISSUE 1 (E): Verifies evaluated_rows == accepted_records + rejected_records."""
        csv_content = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS

InvalidBrand,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
Samsung,"$700 - $1,000",Camera Quality,Gaming,Android
Google,"$400 - $700",Camera Quality; Battery Life; Software & OS Experience,Everyday General Use,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_content)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(
                temp_csv_path,
                tmp_json_path,
                is_demo=False,
                filter_invalid=True,
            )
            self.assertEqual(dataset["metadata"]["total_responses"], 2)

            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(
                    rep.get("total_raw_rows"),
                    rep.get("blank_rows") + rep.get("accepted_records") + rep.get("rejected_records"),
                )
                self.assertEqual(
                    rep.get("evaluated_rows"),
                    rep.get("accepted_records") + rep.get("rejected_records"),
                )
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 3: Unmapped CSV Columns Warning
    # -------------------------------------------------------------------------

    def test_unmapped_csv_column_triggers_warning(self):
        """
        ISSUE 3: An unmapped non-PII column triggers a clear warning to sys.stderr
        identifying column names only, not respondent values.
        """
        csv_extra_col = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference,Additional Research Question
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS,SecretStudentOpinionValue123
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_extra_col)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            stderr_text = stderr_capture.getvalue()
            # Warning must identify column name
            self.assertIn("WARNING: Unmapped CSV columns will be ignored", stderr_text)
            self.assertIn("Additional Research Question", stderr_text)

            # Warning MUST NOT leak cell contents / respondent values
            self.assertNotIn("SecretStudentOpinionValue123", stderr_text)

            # Processing continues safely
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_explicitly_mapped_columns_do_not_trigger_unmapped_warning(self):
        """
        ISSUE 3: Columns that are explicitly mapped (canonical, PII, timestamp)
        do not trigger unmapped warnings.
        """
        csv_standard = '''Timestamp,Email Address,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,test@uni.edu,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_standard)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            stderr_text = stderr_capture.getvalue()
            self.assertNotIn("WARNING: Unmapped CSV columns will be ignored", stderr_text)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 2: Atomic Replacement & Failure Path Recovery Tests
    # -------------------------------------------------------------------------

    def test_activation_checklist_invariants_pass_on_valid_data(self):
        """Verifies that validate_dataset_invariants passes cleanly on demo data."""
        with open("src/data/survey_demo_data.json", "r", encoding="utf-8") as f:
            demo_data = json.load(f)
        errors = validate_dataset_invariants(demo_data)
        self.assertEqual(len(errors), 0, f"Valid demo data must have 0 invariant errors: {errors}")

    def test_activation_checklist_rejects_corrupted_dataset(self):
        """Verifies that validate_dataset_invariants catches duplicate IDs, count mismatch, and invalid features."""
        corrupted_data = {
            "metadata": {
                "version": "1.0.0",
                "total_responses": 3,
                "is_demo": False,
            },
            "responses": [
                {
                    "response_id": "RESP_001",
                    "preferred_brand": "Apple",
                    "budget_range": "Above ₹60,000",
                    "preferred_features": ["Camera Quality", "Battery Life", "Build & Design Quality"],
                    "primary_use": "Gaming",
                    "os_preference": "iOS",
                    "email": "leaked_pii@uni.edu",
                },
                {
                    "response_id": "RESP_001",
                    "preferred_brand": "UnknownBrand",
                    "budget_range": "Above ₹60,000",
                    "preferred_features": ["Camera Quality"],
                    "primary_use": "Gaming",
                    "os_preference": "iOS",
                },
            ],
        }
        errors = validate_dataset_invariants(corrupted_data)
        self.assertTrue(any("Metadata total_responses" in e for e in errors))
        self.assertTrue(any("Duplicate response_id" in e for e in errors))
        self.assertTrue(any("Prohibited PII field" in e for e in errors))
        self.assertTrue(any("Unknown brand" in e for e in errors))
        self.assertTrue(any("Expected exactly 3 features" in e for e in errors))

    def test_activation_failure_candidate_validation_leaves_active_unchanged(self):
        """
        ISSUE 2: Candidate validation failure prevents activation and leaves active dataset untouched.
        """
        # Save snapshot of current active dataset and config
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        # Create invalid candidate JSON
        invalid_candidate = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
        with tempfile.NamedTemporaryFile("w+", suffix=".json", delete=False, encoding="utf-8") as f:
            json.dump(invalid_candidate, f)
            invalid_path = Path(f.name)

        try:
            success = activate_dataset(str(invalid_path))
            self.assertFalse(success, "Activation must fail on empty / invalid dataset")

            # Active file and config must remain identical
            if orig_active:
                self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
            self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])
        finally:
            if invalid_path.exists():
                invalid_path.unlink()

    def test_activation_failure_backup_prevents_activation(self):
        """
        ISSUE 2: If backup creation fails, activation MUST abort and leave active dataset unchanged.
        """
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("pipeline.activate_dataset.backup_active_dataset", side_effect=RuntimeError("Disk write simulated failure")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must abort if backup creation fails")

        if orig_active:
            self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
        self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])

    def test_activation_failure_atomic_replacement_preserves_previous_dataset(self):
        """
        ISSUE 2: If os.replace fails during atomic deployment, the previous active dataset is preserved.
        """
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("os.replace", side_effect=OSError("Simulated filesystem lock")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must fail if atomic replace fails")

        if orig_active:
            self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
        self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])

    def test_activation_failure_config_update_triggers_recovery(self):
        """
        ISSUE 2: If atomic JSON replacement succeeds but configuration update fails,
        recovery restores the previous active dataset to prevent inconsistent state.
        """
        # Ensure we have a populated initial active dataset for backup
        initial_data = {
            "metadata": {"version": "1.0.0", "total_responses": 1, "is_demo": False},
            "responses": [{
                "response_id": "RESP_INIT",
                "preferred_brand": "Apple",
                "budget_range": "Above ₹60,000",
                "preferred_features": ["Camera Quality", "Battery Life", "Build & Design Quality"],
                "primary_use": "Gaming",
                "os_preference": "iOS"
            }]
        }
        ACTIVE_DATA_PATH.write_text(json.dumps(initial_data, indent=2), encoding="utf-8")
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("pipeline.activate_dataset.save_dataset_config", side_effect=IOError("Simulated config disk error")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must report failure if config save fails")

        # Verify recovery restored the initial data from backup
        curr_active_data = json.loads(ACTIVE_DATA_PATH.read_text(encoding="utf-8"))
        self.assertEqual(curr_active_data["responses"][0]["response_id"], "RESP_INIT")

        # Clean up and restore demo placeholder
        placeholder = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
        ACTIVE_DATA_PATH.write_text(json.dumps(placeholder, indent=2), encoding="utf-8")
        save_dataset_config(orig_config)
        for b in BACKUPS_DIR.glob("dataset_backup_*.json"):
            try:
                b.unlink()
            except Exception:
                pass

    def test_activation_success_and_rollback_flow(self):
        """
        ISSUE 2: Verifies end-to-end atomic activation of template data followed by clean rollback.
        """
        orig_config = get_dataset_config()
        template_path = Path("data/templates/google_forms_survey_template.csv")

        try:
            # 1. Activate
            success = activate_dataset(str(template_path))
            self.assertTrue(success, "Template activation should succeed")

            config_after = get_dataset_config()
            self.assertEqual(config_after["active_dataset"], "real")
            self.assertFalse(config_after["is_demo"])
            self.assertEqual(config_after["total_responses"], 8)

            active_json = json.loads(ACTIVE_DATA_PATH.read_text(encoding="utf-8"))
            self.assertEqual(len(active_json["responses"]), 8)

            # 2. Rollback
            rollback_success = rollback_dataset()
            self.assertTrue(rollback_success, "Rollback must succeed")

        finally:
            # Guarantee environment returns to canonical demo mode
            save_dataset_config(orig_config)
            placeholder = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
            ACTIVE_DATA_PATH.write_text(json.dumps(placeholder, indent=2), encoding="utf-8")
            for b in BACKUPS_DIR.glob("dataset_backup_*.json"):
                try:
                    b.unlink()
                except Exception:
                    pass

    def test_temporary_files_are_cleaned_up(self):
        """
        ISSUE 2: Verifies no temporary staging files linger in src/data or pipeline/data.
        """
        staging_files = list(ACTIVE_DATA_PATH.parent.glob("tmp_active_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_config_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_recovery_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_rollback_*.json"))
        self.assertEqual(len(staging_files), 0, f"Found lingering temporary files: {staging_files}")


if __name__ == "__main__":
    unittest.main()
