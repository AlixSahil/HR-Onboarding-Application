const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const oracledb = require('oracledb');

// Function to get employee details from Oracle database
const getEmployeeDetails = async (personal_email) => {
    try {
        const connection = await oracledb.getConnection();
        
        // Get basic employee information
        const employeeResult = await connection.execute(
            'SELECT * FROM Employee WHERE personal_email = :email',
            [personal_email]
        );
        
        if (employeeResult.rows.length === 0) {
            await connection.close();
            return null;
        }
        
        // Get professional details
        const professionalResult = await connection.execute(
            'SELECT * FROM ProfessionalDetails WHERE personal_email = :email',
            [personal_email]
        );

        // Convert the row data to an object with column names
        const employeeRow = employeeResult.rows[0];
        const employeeColumns = employeeResult.metaData.map(col => col.name);
        const employeeData = {};
        employeeColumns.forEach((col, index) => {
            employeeData[col] = employeeRow[index];
        });

        // Add professional details
        if (professionalResult.rows.length > 0) {
            const professionalRow = professionalResult.rows[0];
            const professionalColumns = professionalResult.metaData.map(col => col.name);
            professionalColumns.forEach((col, index) => {
                employeeData[col] = professionalRow[index];
            });
        }
        
        await connection.close();
        return employeeData;
    } catch (err) {
        console.error('Error fetching employee details:', err);
        throw err;
    }
};

const generateNightShiftDeclaration = async (req, res) => {
    try {
        const { personal_email } = req.params;
        
        // Get employee details from database
        const employeeData = await getEmployeeDetails(personal_email);
        
        if (!employeeData) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
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
            employeeName: `${employeeData.FIRST_NAME} ${employeeData.MIDDLE_NAME || ''} ${employeeData.LAST_NAME}`.trim(),
            poornataId: employeeData.POORNATA_ID,
            designation: employeeData.DESIGNATION,
            department: employeeData.DEPARTMENT,
            location: employeeData.CURRENT_ADDRESS,
            contactNo: employeeData.MOBILE_NO,
            email: employeeData.OFFICIAL_EMAIL,
            gender: employeeData.GENDER,
            bloodGroup: employeeData.BLOOD_GROUP,
            joiningDate: new Date(employeeData.DOJ_UNIT).toLocaleDateString(),
            dateOfBirth: new Date(employeeData.DOB).toLocaleDateString(),
            maritalStatus: employeeData.MARITAL_STATUS,
            aadharNo: employeeData.AADHAR_NO,
            panNo: employeeData.PAN_NO,
            bankAccountNo: employeeData.BANK_ACCOUNT_NO,
            currentCtc: employeeData.CURRENT_CTC
        });
        
        // Render the document
        doc.render();
        
        // Generate the output
        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=Night_Shift_Declaration_${employeeData.POORNATA_ID}.docx`);
        
        // Send the document
        res.send(buf);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating document' });
    }
};

const generatePOSHDocument = async (req, res) => {
    try {
        const { personal_email } = req.params;
        
        // Get employee details from database
        const employeeData = await getEmployeeDetails(personal_email);
        
        if (!employeeData) {
            return res.status(404).json({ error: 'Employee not found' });
        }

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
            employeeName: `${employeeData.FIRST_NAME} ${employeeData.MIDDLE_NAME || ''} ${employeeData.LAST_NAME}`.trim(),
            poornataId: employeeData.POORNATA_ID,
            designation: employeeData.DESIGNATION,
            department: employeeData.DEPARTMENT,
            joiningDate: employeeData.DOJ_UNIT ? new Date(employeeData.DOJ_UNIT).toLocaleDateString() : '',
            contactNo: employeeData.MOBILE_NO,
            email: employeeData.OFFICIAL_EMAIL,
            gender: employeeData.GENDER,
            bloodGroup: employeeData.BLOOD_GROUP,
            dateOfBirth: employeeData.DOB ? new Date(employeeData.DOB).toLocaleDateString() : ''
        });

        // Generate the document
        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=POSH_Declaration_${employeeData.POORNATA_ID}.docx`);
        
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