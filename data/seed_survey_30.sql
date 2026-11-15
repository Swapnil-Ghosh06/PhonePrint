-- PhonePrint: Synthetic Campus Survey Database Schema and Seed Script
-- N = 30 Verified Synthetic Student Responses
-- Generated for University Discrete Mathematics & Graph Theory Exploration

DROP TABLE IF EXISTS student_survey_responses;

CREATE TABLE student_survey_responses (
    respondent_id VARCHAR(32) PRIMARY KEY,
    preferred_brand VARCHAR(64) NOT NULL,
    budget_range VARCHAR(64) NOT NULL,
    feature_1 VARCHAR(64) NOT NULL,
    feature_2 VARCHAR(64) NOT NULL,
    feature_3 VARCHAR(64) NOT NULL,
    primary_use VARCHAR(64) NOT NULL,
    os_preference VARCHAR(32) NOT NULL,
    submission_timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

INSERT INTO student_survey_responses (
    respondent_id, preferred_brand, budget_range,
    feature_1, feature_2, feature_3,
    primary_use, os_preference, submission_timestamp
) VALUES
    ('RESP_001', 'Apple', 'Above ₹60,000', 'Display Quality', 'Camera Quality', 'Storage Capacity', 'Photography & Videography', 'iOS', '2026-09-15T09:00:00Z'),
    ('RESP_002', 'Apple', 'Above ₹60,000', 'Display Quality', 'Battery Life', 'Camera Quality', 'Photography & Videography', 'iOS', '2026-09-15T10:10:00Z'),
    ('RESP_003', 'Samsung', 'Above ₹60,000', 'Processing Performance', 'Camera Quality', 'Software & OS Experience', 'Photography & Videography', 'Android', '2026-09-15T11:20:00Z'),
    ('RESP_004', 'Samsung', '₹15,000 - ₹30,000', 'Battery Life', 'Storage Capacity', 'Camera Quality', 'Photography & Videography', 'Android', '2026-09-15T12:30:00Z'),
    ('RESP_005', 'Xiaomi', '₹15,000 - ₹30,000', 'Processing Performance', 'Display Quality', 'Battery Life', 'Gaming', 'Android', '2026-09-15T13:40:00Z'),
    ('RESP_006', 'Motorola', 'Under ₹15,000', 'Storage Capacity', 'Battery Life', 'Display Quality', 'Everyday General Use', 'Android', '2026-09-15T14:50:00Z'),
    ('RESP_007', 'Apple', '₹30,000 - ₹60,000', 'Battery Life', 'Camera Quality', 'Processing Performance', 'Everyday General Use', 'iOS', '2026-09-15T15:00:00Z'),
    ('RESP_008', 'Google', '₹30,000 - ₹60,000', 'Camera Quality', 'Battery Life', 'Build & Design Quality', 'Photography & Videography', 'iOS', '2026-09-15T16:10:00Z'),
    ('RESP_009', 'Apple', '₹15,000 - ₹30,000', 'Battery Life', 'Software & OS Experience', 'Display Quality', 'Business & Productivity', 'iOS', '2026-09-15T17:20:00Z'),
    ('RESP_010', 'Xiaomi', '₹15,000 - ₹30,000', 'Camera Quality', 'Processing Performance', 'Battery Life', 'Gaming', 'Android', '2026-09-15T18:30:00Z'),
    ('RESP_011', 'OnePlus', '₹30,000 - ₹60,000', 'Battery Life', 'Display Quality', 'Processing Performance', 'Everyday General Use', 'iOS', '2026-09-15T19:40:00Z'),
    ('RESP_012', 'Samsung', '₹15,000 - ₹30,000', 'Processing Performance', 'Storage Capacity', 'Display Quality', 'Everyday General Use', 'Android', '2026-09-15T20:50:00Z'),
    ('RESP_013', 'Samsung', 'Under ₹15,000', 'Battery Life', 'Display Quality', 'Storage Capacity', 'Social Media & Content Consumption', 'Android', '2026-09-15T09:00:00Z'),
    ('RESP_014', 'Google', '₹15,000 - ₹30,000', 'Processing Performance', 'Camera Quality', 'Battery Life', 'Business & Productivity', 'Android', '2026-09-15T10:10:00Z'),
    ('RESP_015', 'OnePlus', '₹30,000 - ₹60,000', 'Display Quality', 'Battery Life', 'Processing Performance', 'Gaming', 'Android', '2026-09-15T11:20:00Z'),
    ('RESP_016', 'Apple', '₹30,000 - ₹60,000', 'Display Quality', 'Processing Performance', 'Camera Quality', 'Social Media & Content Consumption', 'iOS', '2026-09-15T12:30:00Z'),
    ('RESP_017', 'Apple', 'Above ₹60,000', 'Camera Quality', 'Processing Performance', 'Display Quality', 'Gaming', 'No Preference', '2026-09-15T13:40:00Z'),
    ('RESP_018', 'Samsung', '₹30,000 - ₹60,000', 'Camera Quality', 'Storage Capacity', 'Battery Life', 'Everyday General Use', 'Android', '2026-09-15T14:50:00Z'),
    ('RESP_019', 'OnePlus', '₹15,000 - ₹30,000', 'Battery Life', 'Software & OS Experience', 'Processing Performance', 'Business & Productivity', 'Android', '2026-09-15T15:00:00Z'),
    ('RESP_020', 'Samsung', '₹15,000 - ₹30,000', 'Camera Quality', 'Processing Performance', 'Storage Capacity', 'Photography & Videography', 'Android', '2026-09-15T16:10:00Z'),
    ('RESP_021', 'Other', 'Under ₹15,000', 'Processing Performance', 'Battery Life', 'Camera Quality', 'Photography & Videography', 'Android', '2026-09-15T17:20:00Z'),
    ('RESP_022', 'Apple', 'Above ₹60,000', 'Camera Quality', 'Processing Performance', 'Build & Design Quality', 'Gaming', 'iOS', '2026-09-15T18:30:00Z'),
    ('RESP_023', 'Xiaomi', '₹15,000 - ₹30,000', 'Processing Performance', 'Display Quality', 'Camera Quality', 'Photography & Videography', 'Android', '2026-09-15T19:40:00Z'),
    ('RESP_024', 'Google', '₹15,000 - ₹30,000', 'Battery Life', 'Camera Quality', 'Software & OS Experience', 'Photography & Videography', 'Android', '2026-09-15T20:50:00Z'),
    ('RESP_025', 'Google', '₹15,000 - ₹30,000', 'Software & OS Experience', 'Storage Capacity', 'Battery Life', 'Business & Productivity', 'Android', '2026-09-15T09:00:00Z'),
    ('RESP_026', 'Apple', 'Above ₹60,000', 'Camera Quality', 'Processing Performance', 'Display Quality', 'Photography & Videography', 'iOS', '2026-09-15T10:10:00Z'),
    ('RESP_027', 'Google', '₹15,000 - ₹30,000', 'Battery Life', 'Storage Capacity', 'Processing Performance', 'Gaming', 'Android', '2026-09-15T11:20:00Z'),
    ('RESP_028', 'Apple', '₹30,000 - ₹60,000', 'Processing Performance', 'Display Quality', 'Battery Life', 'Gaming', 'iOS', '2026-09-15T12:30:00Z'),
    ('RESP_029', 'Xiaomi', '₹15,000 - ₹30,000', 'Storage Capacity', 'Camera Quality', 'Build & Design Quality', 'Photography & Videography', 'No Preference', '2026-09-15T13:40:00Z'),
    ('RESP_030', 'Apple', '₹30,000 - ₹60,000', 'Processing Performance', 'Display Quality', 'Build & Design Quality', 'Social Media & Content Consumption', 'iOS', '2026-09-15T14:50:00Z');
