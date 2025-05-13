const request = require('supertest');
const app = require('../server');
const oracledb = require('oracledb');

describe('Data Storage Tests', () => {
    let testEmployeeData;
    let createdEmployeeEmail;

    beforeAll(() => {
        // Test data setup
        testEmployeeData = {
            basicInfo: {
                personal_email: 'test.employee@company.com',
                official_email: 'test.employee@company.com',
                joining_reference_id: 'TEST001',
                poornata_id: 'P001',
                employee_code: 'EMP001',
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
                pan_no: 'ABCDE1234F',
                aadhar_no: '123456789012',
                bank_name: 'Test Bank',
                bank_account_no: '1234567890',
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
    });

    afterAll(async () => {
        // Cleanup test data
        if (createdEmployeeEmail) {
            const connection = await oracledb.getConnection();
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
    });

    // Test Case 1: Create Employee and Verify Storage
    test('should store employee data correctly in the database', async () => {
        // Create employee
        const createResponse = await request(app)
            .post('/api/employees')
            .send(testEmployeeData);

        expect(createResponse.status).toBe(201);
        createdEmployeeEmail = createResponse.body.personal_email;

        // Verify data in database
        const connection = await oracledb.getConnection();
        try {
            // Check Employee table
            const employeeResult = await connection.execute(
                'SELECT * FROM Employee WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(employeeResult.rows.length).toBe(1);
            const storedEmployee = employeeResult.rows[0];
            expect(storedEmployee[1]).toBe(testEmployeeData.basicInfo.personal_email);
            expect(storedEmployee[2]).toBe(testEmployeeData.basicInfo.first_name);
            expect(storedEmployee[3]).toBe(testEmployeeData.basicInfo.last_name);

            // Check ProfessionalDetails table
            const profResult = await connection.execute(
                'SELECT * FROM ProfessionalDetails WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(profResult.rows.length).toBe(1);
            const storedProf = profResult.rows[0];
            expect(storedProf[1]).toBe(testEmployeeData.professionalDetails.department);
            expect(storedProf[2]).toBe(testEmployeeData.professionalDetails.designation);
        } finally {
            await connection.close();
        }
    });

    // Test Case 2: Update Employee and Verify Storage
    test('should update employee data correctly in the database', async () => {
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
        const connection = await oracledb.getConnection();
        try {
            // Check Employee table
            const employeeResult = await connection.execute(
                'SELECT * FROM Employee WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(employeeResult.rows.length).toBe(1);
            const storedEmployee = employeeResult.rows[0];
            expect(storedEmployee[2]).toBe('Updated');
            expect(storedEmployee[3]).toBe('Name');

            // Check ProfessionalDetails table
            const profResult = await connection.execute(
                'SELECT * FROM ProfessionalDetails WHERE personal_email = :email',
                [createdEmployeeEmail]
            );
            expect(profResult.rows.length).toBe(1);
            const storedProf = profResult.rows[0];
            expect(storedProf[2]).toBe('Senior Software Engineer');
        } finally {
            await connection.close();
        }
    });

    // Test Case 3: Delete Employee and Verify Storage
    test('should delete employee data correctly from the database', async () => {
        // Delete employee
        const deleteResponse = await request(app)
            .delete(`/api/employees/${createdEmployeeEmail}`);

        expect(deleteResponse.status).toBe(200);

        // Verify deletion in database
        const connection = await oracledb.getConnection();
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
    });
}); 