-- Create Employee table
CREATE TABLE employees (
    poornata_id VARCHAR2(20) PRIMARY KEY,
    employee_name VARCHAR2(100) NOT NULL,
    date_of_birth DATE,
    joining_date DATE,
    signature BLOB,
    role VARCHAR2(50),
    designation VARCHAR2(50),
    department VARCHAR2(50),
    location VARCHAR2(100),
    nominee VARCHAR2(100),
    relation_with_applicant VARCHAR2(50),
    age_of_nominee NUMBER(3),
    employee_code VARCHAR2(20),
    title VARCHAR2(50),
    job_band VARCHAR2(50),
    contact_no VARCHAR2(15),
    gender VARCHAR2(10),
    marital_status VARCHAR2(20),
    blood_group VARCHAR2(5),
    dependent_name VARCHAR2(100),
    dependent_dob DATE,
    dependent_gender VARCHAR2(10),
    dependent_age NUMBER(3),
    dependent_contact VARCHAR2(15),
    dependent_relation VARCHAR2(50),
    dependent_marital_status VARCHAR2(20),
    mail_id VARCHAR2(100),
    monthly_basic_salary NUMBER(12,2),
    monthly_special_allowance NUMBER(12,2),
    contribution_percentage NUMBER(5,2),
    category VARCHAR2(50),
    aadhar_no VARCHAR2(12),
    pan_no VARCHAR2(10),
    bank_account_no VARCHAR2(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_poornata_id ON employees(poornata_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE TRIGGER update_employee_timestamp
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/ 