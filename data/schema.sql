-- ============================================================================
-- BloodConnect — Healthcare Blood Bank Management System
-- Relational Database Schema (PostgreSQL / SQLite / MySQL Compatible)
-- ============================================================================

-- 1. BLOOD INVENTORY
CREATE TABLE IF NOT EXISTS blood_inventory (
    id VARCHAR(32) PRIMARY KEY,
    blood_group VARCHAR(10) NOT NULL,
    rh_factor VARCHAR(20) NOT NULL,
    available_units INTEGER NOT NULL DEFAULT 0,
    reserved_units INTEGER NOT NULL DEFAULT 0,
    critical_threshold INTEGER NOT NULL DEFAULT 50,
    capacity_percent INTEGER NOT NULL DEFAULT 0,
    expiry_risk VARCHAR(50) DEFAULT 'Low',
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    vault_location VARCHAR(100) DEFAULT 'Central Vault 1',
    storage_temp_celsius NUMERIC(4, 2) DEFAULT 3.8,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VOLUNTARY DONORS
CREATE TABLE IF NOT EXISTS donors (
    id VARCHAR(32) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(200) NOT NULL,
    last_donation_date DATE,
    cooldown_expiry DATE,
    eligibility_status VARCHAR(50) DEFAULT 'Eligible',
    active_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CONNECTED HOSPITALS
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(32) PRIMARY KEY,
    hospital_name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    trauma_level VARCHAR(50) DEFAULT 'Level 1',
    demand_units INTEGER NOT NULL DEFAULT 0,
    current_stock_units INTEGER NOT NULL DEFAULT 0,
    emergency_status VARCHAR(50) DEFAULT 'Normal',
    hl7_node_endpoint VARCHAR(255),
    connected_since DATE DEFAULT CURRENT_DATE
);

-- 4. BLOOD REQUISITIONS / DISPATCHES
CREATE TABLE IF NOT EXISTS blood_requests (
    id VARCHAR(32) PRIMARY KEY,
    hospital_id VARCHAR(32) REFERENCES hospitals(id),
    patient_id VARCHAR(50) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    units_requested INTEGER NOT NULL,
    priority_level VARCHAR(20) NOT NULL CHECK (priority_level IN ('Critical', 'Urgent', 'Standard')),
    department VARCHAR(100),
    attending_physician VARCHAR(150),
    clinical_notes TEXT,
    needed_within_hours VARCHAR(50),
    request_status VARCHAR(50) NOT NULL DEFAULT 'Matching',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. AUDIT & DISPATCH ACTIVITY TIMELINE
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(32) PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL
);

-- INDEXES FOR RAPID CROSS-MATCH SEARCHES
CREATE INDEX IF NOT EXISTS idx_inventory_blood_group ON blood_inventory(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON blood_requests(priority_level);
CREATE INDEX IF NOT EXISTS idx_requests_status ON blood_requests(request_status);
