const oracledb = require('oracledb');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM employees ORDER BY created_at DESC'
        );
        await connection.close();
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching employees' });
    }
};

// Get employee by Poornata ID
const getEmployeeByPoornataId = async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM employees WHERE poornata_id = :id',
            [req.params.poornataId]
        );
        await connection.close();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        // Convert the row data to an object with column names
        const row = result.rows[0];
        const columns = result.metaData.map(col => col.name);
        const employeeData = {};
        columns.forEach((col, index) => {
            employeeData[col] = row[index];
        });
        
        res.json(employeeData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching employee' });
    }
};

// Create new employee
const createEmployee = async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const employee = req.body;
        
        // Convert date strings to YYYY-MM-DD format
        const dateFields = ['date_of_birth', 'joining_date', 'dependent_dob'];
        for (const field of dateFields) {
            if (employee[field]) {
                const d = new Date(employee[field]);
                employee[field] = d.toISOString().split('T')[0];
            }
        }
        
        const result = await connection.execute(
            `INSERT INTO employees (
                poornata_id, employee_name, date_of_birth, joining_date,
                role, designation, department, location, nominee,
                relation_with_applicant, age_of_nominee, employee_code,
                title, job_band, contact_no, gender, marital_status,
                blood_group, dependent_name, dependent_dob, dependent_gender,
                dependent_age, dependent_contact, dependent_relation,
                dependent_marital_status, mail_id, monthly_basic_salary,
                monthly_special_allowance, contribution_percentage, category,
                aadhar_no, pan_no, bank_account_no
            ) VALUES (
                :poornata_id, :employee_name, TO_DATE(:date_of_birth, 'YYYY-MM-DD'), TO_DATE(:joining_date, 'YYYY-MM-DD'),
                :role, :designation, :department, :location, :nominee,
                :relation_with_applicant, :age_of_nominee, :employee_code,
                :title, :job_band, :contact_no, :gender, :marital_status,
                :blood_group, :dependent_name, TO_DATE(:dependent_dob, 'YYYY-MM-DD'), :dependent_gender,
                :dependent_age, :dependent_contact, :dependent_relation,
                :dependent_marital_status, :mail_id, :monthly_basic_salary,
                :monthly_special_allowance, :contribution_percentage, :category,
                :aadhar_no, :pan_no, :bank_account_no
            )`,
            {
                poornata_id: employee.poornata_id || null,
                employee_name: employee.employee_name || null,
                date_of_birth: employee.date_of_birth || null,
                joining_date: employee.joining_date || null,
                role: employee.role || null,
                designation: employee.designation || null,
                department: employee.department || null,
                location: employee.location || null,
                nominee: employee.nominee || null,
                relation_with_applicant: employee.relation_with_applicant || null,
                age_of_nominee: employee.age_of_nominee || null,
                employee_code: employee.employee_code || null,
                title: employee.title || null,
                job_band: employee.job_band || null,
                contact_no: employee.contact_no || null,
                gender: employee.gender || null,
                marital_status: employee.marital_status || null,
                blood_group: employee.blood_group || null,
                dependent_name: employee.dependent_name || null,
                dependent_dob: employee.dependent_dob || null,
                dependent_gender: employee.dependent_gender || null,
                dependent_age: employee.dependent_age || null,
                dependent_contact: employee.dependent_contact || null,
                dependent_relation: employee.dependent_relation || null,
                dependent_marital_status: employee.dependent_marital_status || null,
                mail_id: employee.mail_id || null,
                monthly_basic_salary: employee.monthly_basic_salary || null,
                monthly_special_allowance: employee.monthly_special_allowance || null,
                contribution_percentage: employee.contribution_percentage || null,
                category: employee.category || null,
                aadhar_no: employee.aadhar_no || null,
                pan_no: employee.pan_no || null,
                bank_account_no: employee.bank_account_no || null
            }
        );
        
        await connection.commit();
        await connection.close();
        
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating employee' });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const employee = req.body;
        employee.poornata_id = req.params.poornataId;
        
        const result = await connection.execute(
            `UPDATE employees SET
                first_name = :first_name,
                last_name = :last_name,
                email = :email,
                phone_number = :phone_number,
                date_of_birth = :date_of_birth,
                address = :address,
                city = :city,
                state = :state,
                postal_code = :postal_code,
                country = :country,
                joining_date = :joining_date,
                department = :department,
                designation = :designation,
                emergency_contact_name = :emergency_contact_name,
                emergency_contact_phone = :emergency_contact_phone
            WHERE poornata_id = :poornata_id`,
            employee
        );
        
        await connection.commit();
        await connection.close();
        
        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating employee' });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'DELETE FROM employees WHERE poornata_id = :id',
            [req.params.poornataId]
        );
        
        if (result.rowsAffected === 0) {
            await connection.close();
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        await connection.commit();
        await connection.close();
        
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting employee' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeByPoornataId,
    createEmployee,
    updateEmployee,
    deleteEmployee
}; 