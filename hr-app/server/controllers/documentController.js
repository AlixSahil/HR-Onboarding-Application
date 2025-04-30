const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const oracledb = require('oracledb');

// Function to get employee details from Oracle database
const getEmployeeDetails = async (poornataId) => {
    try {
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM employees WHERE poornata_id = :id',
            [poornataId]
        );
        
        if (result.rows.length === 0) {
            await connection.close();
            return null;
        }
        
        // Convert the row data to an object with column names
        const row = result.rows[0];
        const columns = result.metaData.map(col => col.name);
        const employeeData = {};
        columns.forEach((col, index) => {
            employeeData[col] = row[index];
        });
        
        await connection.close();
        return employeeData;
    } catch (err) {
        console.error('Error fetching employee details:', err);
        throw err;
    }
};

const generateNightShiftDeclaration = async (req, res) => {
    try {
        const { poornataId } = req.params;
        
        // Get employee details from database
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM employees WHERE poornata_id = :id',
            [poornataId]
        );
        
        if (result.rows.length === 0) {
            await connection.close();
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        // Convert the row data to an object with column names
        const row = result.rows[0];
        const columns = result.metaData.map(col => col.name);
        const employeeData = {};
        columns.forEach((col, index) => {
            employeeData[col] = row[index];
        });
        
        await connection.close();
        
        // Read the template file
        const templatePath = path.join(__dirname, '../../Night Shift Declaration.docx');
        const content = fs.readFileSync(templatePath, 'binary');
        
        // Create a new document
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        
        // Set the data
        doc.setData({
            employeeName: employeeData.EMPLOYEE_NAME,
            poornataId: employeeData.POORNATA_ID,
            designation: employeeData.DESIGNATION,
            department: employeeData.DEPARTMENT,
            location: employeeData.LOCATION,
            contactNo: employeeData.CONTACT_NO,
            email: employeeData.MAIL_ID,
            gender: employeeData.GENDER,
            bloodGroup: employeeData.BLOOD_GROUP,
            joiningDate: new Date(employeeData.JOINING_DATE).toLocaleDateString(),
            dateOfBirth: new Date(employeeData.DATE_OF_BIRTH).toLocaleDateString(),
            maritalStatus: employeeData.MARITAL_STATUS,
            aadharNo: employeeData.AADHAR_NO,
            panNo: employeeData.PAN_NO,
            bankAccountNo: employeeData.BANK_ACCOUNT_NO,
            monthlyBasicSalary: employeeData.MONTHLY_BASIC_SALARY,
            monthlySpecialAllowance: employeeData.MONTHLY_SPECIAL_ALLOWANCE,
            contributionPercentage: employeeData.CONTRIBUTION_PERCENTAGE,
            // Add more fields as needed based on your template
        });
        
        // Render the document
        doc.render();
        
        // Generate the output
        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=Night_Shift_Declaration_${poornataId}.docx`);
        
        // Send the document
        res.send(buf);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating document' });
    }
};

const generatePOSHDocument = async (req, res) => {
    try {
        const { poornataId } = req.params;
        
        // Get employee details directly from Oracle
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM employees WHERE poornata_id = :id',
            [poornataId]
        );
        
        if (result.rows.length === 0) {
            await connection.close();
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        // Convert the row data to an object with column names
        const row = result.rows[0];
        const columns = result.metaData.map(col => col.name);
        const employee = {};
        columns.forEach((col, index) => {
            employee[col] = row[index];
        });
        
        await connection.close();

        // Read the template file
        const templatePath = path.join(__dirname, '../../29. ABMC728-POSH.docx');
        
        // Check if template file exists
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found at ${templatePath}`);
        }

        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);
        
        // Initialize docxtemplater with the newer API
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: {
                start: '{',
                end: '}'
            }
        });

        // Set the data using the newer API
        doc.render({
            employeeName: employee.EMPLOYEE_NAME || '',
            poornataId: employee.POORNATA_ID || '',
            designation: employee.DESIGNATION || '',
            department: employee.DEPARTMENT || '',
            joiningDate: employee.JOINING_DATE ? new Date(employee.JOINING_DATE).toLocaleDateString() : '',
            contactNo: employee.CONTACT_NO || '',
            email: employee.MAIL_ID || '',
            gender: employee.GENDER || '',
            bloodGroup: employee.BLOOD_GROUP || '',
            dateOfBirth: employee.DATE_OF_BIRTH ? new Date(employee.DATE_OF_BIRTH).toLocaleDateString() : ''
        });

        // Generate the document
        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=POSH_Declaration_${poornataId}.docx`);
        
        // Send the document
        res.send(buf);
    } catch (err) {
        console.error('Document generation error:', err.message);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ 
            error: 'Error generating document',
            details: err.message,
            stack: err.stack
        });
    }
};

module.exports = {
    generateNightShiftDeclaration,
    generatePOSHDocument
}; 