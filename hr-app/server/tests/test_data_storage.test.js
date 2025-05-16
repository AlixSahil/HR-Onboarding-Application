const request = require('supertest');
const express = require('express');
const app = express();
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
require('dotenv').config();

// Middleware
app.use(bodyParser.json());

// Import routes
const employeeRoutes = require('../routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

describe('Data Storage Tests', () => {
    let testEmployeeData;
    let createdEmployeeEmail;
    let server;
    let pool;

    beforeAll(async () => {
        // Initialize database pool
        try {
            pool = await oracledb.createPool({
                user: process.env.ORACLE_USER,
                password: process.env.ORACLE_PASSWORD,
                connectString: process.env.ORACLE_CONNECTION_STRING,
                privilege: oracledb.SYSDBA,
                poolMin: 1,
                poolMax: 5,
                poolIncrement: 1
            });
            console.log('Database pool created successfully');
        } catch (err) {
            console.error('Error creating database pool:', err);
            throw err;
        }

        // Test data setup
        testEmployeeData = {
            basicInfo: {
                personal_email: `test.employee.${Date.now()}@company.com`,
                official_email: `test.employee.${Date.now()}@company.com`,
                joining_reference_id: `TEST${Date.now()}`,
                poornata_id: `P${Date.now()}`,
                employee_code: `EMP${Date.now()}`,
                prefix: 'Mr.',
                first_name: 'Test',
                middle_name: 'User',
                last_name: 'Employee',
                fathers_name: 'Father Name',
                mothers_name: 'Mother Name',
                dob: '1990-01-01',
                gender: 'Male',
                marital_status: 'Single',
                blood_group: 'O+',
                nationality: 'Indian',
                birth_state: 'Karnataka',
                birth_location: 'Bangalore',
                religion: 'Hindu',
                caste: 'General',
                permanent_address: '123 Test Street, Bangalore',
                current_address: '123 Test Street, Bangalore',
                quarter_no: 'Q001',
                pan_no: `ABCDE${Date.now()}F`,
                aadhar_no: `${Date.now()}`,
                bank_name: 'Test Bank',
                bank_account_no: `${Date.now()}`,
                ifsc_code: 'TEST0001234',
                mobile_no: '9876543210'
            },
            professionalDetails: {
                doj_unit: '2024-01-01',
                doj_group: '2024-01-01',
                department: 'IT',
                designation: 'Software Engineer',
                job_band: 'B1',
                loi_issue_date: '2023-12-01',
                confirmation_date: '2024-07-01',
                current_ctc: 1000000,
                supervisor_name: 'Test Supervisor'
            }
        };

        // Start server
        server = app.listen(5000);
    }, 30000); // Increased timeout for beforeAll

    afterAll(async () => {
        // Cleanup test data
        if (createdEmployeeEmail) {
            const connection = await pool.getConnection();
            try {
                await connection.execute('DELETE FROM ProfessionalDetails WHERE personal_email = :email', [createdEmployeeEmail]);
                await connection.execute('DELETE FROM Employee WHERE personal_email = :email', [createdEmployeeEmail]);
                await connection.commit();
            } catch (err) {
                console.error('Error cleaning up test data:', err);
                await connection.rollback();
            } finally {
                await connection.close();
            }
        }

        // Close server
        await new Promise((resolve) => server.close(resolve));

        // Close database pool
        try {
            if (pool) {
                await pool.close(0); // Force close with 0 timeout
            }
        } catch (err) {
            console.error('Error closing pool:', err);
        }
    }, 30000); // Increased timeout for afterAll

    // Test Case 1: Create Employee and Verify Storage
    test('should store employee data correctly in the database', async () => {
        // Create employee
        const createResponse = await request(app)
            .post('/api/employees')
            .send(testEmployeeData);

        expect(createResponse.status).toBe(201);
        createdEmployeeEmail = createResponse.body.personal_email;

        // Verify data in database
        const connection = await pool.getConnection();
        try {
            // Check Employee table
            const employeeResult = await connection.execute(
                'SELECT * FROM Employee WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(employeeResult.rows.length).toBe(1);
            const storedEmployee = employeeResult.rows[0];
            // Column order: personal_email, official_email, joining_reference_id, poornata_id, employee_code, prefix, first_name, middle_name, last_name, ...
            expect(storedEmployee[0]).toBe(testEmployeeData.basicInfo.personal_email);
            expect(storedEmployee[6]).toBe(testEmployeeData.basicInfo.first_name);
            expect(storedEmployee[8]).toBe(testEmployeeData.basicInfo.last_name);

            // Check ProfessionalDetails table
            const profResult = await connection.execute(
                'SELECT * FROM ProfessionalDetails WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(profResult.rows.length).toBe(1);
            const storedProf = profResult.rows[0];
            // Column order: personal_email, doj_unit, doj_group, department, designation, ...
            expect(storedProf[3]).toBe(testEmployeeData.professionalDetails.department);
            expect(storedProf[4]).toBe(testEmployeeData.professionalDetails.designation);
        } finally {
            await connection.close();
        }
    }, 30000); // Increased timeout for test

    // Test Case 2: Update Employee and Verify Storage
    test('should update employee data correctly in the database', async () => {
        // Ensure we have an employee to update
        if (!createdEmployeeEmail) {
            throw new Error('No employee created to update');
        }

        const updateData = {
            ...testEmployeeData,
            basicInfo: {
                ...testEmployeeData.basicInfo,
                first_name: 'Updated',
                last_name: 'Name'
            },
            professionalDetails: {
                ...testEmployeeData.professionalDetails,
                designation: 'Senior Software Engineer'
            }
        };

        // Update employee
        const updateResponse = await request(app)
            .put(`/api/employees/${createdEmployeeEmail}`)
            .send(updateData);

        expect(updateResponse.status).toBe(200);

        // Verify updated data in database
        const connection = await pool.getConnection();
        try {
            // Check Employee table
            const employeeResult = await connection.execute(
                'SELECT * FROM Employee WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(employeeResult.rows.length).toBe(1);
            const storedEmployee = employeeResult.rows[0];
            expect(storedEmployee[6]).toBe('Updated');
            expect(storedEmployee[8]).toBe('Name');

            // Check ProfessionalDetails table
            const profResult = await connection.execute(
                'SELECT * FROM ProfessionalDetails WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(profResult.rows.length).toBe(1);
            const storedProf = profResult.rows[0];
            expect(storedProf[4]).toBe('Senior Software Engineer');
        } finally {
            await connection.close();
        }
    }, 30000); // Increased timeout for test

    // Test Case 3: Delete Employee and Verify Storage
    test('should delete employee data correctly from the database', async () => {
        // Ensure we have an employee to delete
        if (!createdEmployeeEmail) {
            throw new Error('No employee created to delete');
        }

        // Delete employee
        const deleteResponse = await request(app)
            .delete(`/api/employees/${createdEmployeeEmail}`);

        expect(deleteResponse.status).toBe(200);

        // Verify deletion in database
        const connection = await pool.getConnection();
        try {
            // Check Employee table
            const employeeResult = await connection.execute(
                'SELECT * FROM Employee WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(employeeResult.rows.length).toBe(0);

            // Check ProfessionalDetails table
            const profResult = await connection.execute(
                'SELECT * FROM ProfessionalDetails WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(profResult.rows.length).toBe(0);
        } finally {
            await connection.close();
        }
    }, 30000); // Increased timeout for test
}); 