const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const oracledb = require('oracledb');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

// Define the base directory for templates
const TEMPLATES_DIR = path.join(__dirname, '..', '..');

router.post('/generate', async (req, res) => {
    console.log('Document generation route hit');
    console.log('Request body:', req.body);
    
    try {
        const { poornataId, documentIds } = req.body;
        console.log('Received request to generate documents:', { poornataId, documentIds });
        
        if (!poornataId || !documentIds || !Array.isArray(documentIds)) {
            console.error('Invalid request parameters:', { poornataId, documentIds });
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

        // Get employee data
        let employeeData;
        try {
            employeeData = await getEmployeeData(poornataId);
            console.log('Retrieved employee data:', employeeData);
        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ error: 'Error fetching employee data', details: dbError.message });
        }

        if (!employeeData) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Process each selected document
        for (const docId of documentIds) {
            const document = availableDocuments.find(doc => doc.id === docId);
            if (!document) {
                console.warn(`Document with ID ${docId} not found`);
                continue;
            }

            try {
                // Get the absolute path to the template
                const templatePath = path.join(TEMPLATES_DIR, document.filename);
                console.log('Looking for template at:', templatePath);

                // Check if template exists
                if (!fs.existsSync(templatePath)) {
                    console.error(`Template file not found: ${templatePath}`);
                    return res.status(404).json({ error: `Template file not found: ${document.filename}` });
                }

                // Read the file
                const content = fs.readFileSync(templatePath, 'binary');
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    delimiters: {
                        start: '{',
                        end: '}'
                    }
                });

                // Prepare the data
                const templateData = {
                    employeeName: employeeData.EMPLOYEE_NAME || '',
                    poornataId: employeeData.POORNATA_ID || '',
                    designation: employeeData.DESIGNATION || '',
                    department: employeeData.DEPARTMENT || '',
                    joiningDate: employeeData.JOINING_DATE ? new Date(employeeData.JOINING_DATE).toLocaleDateString() : '',
                    contactNo: employeeData.CONTACT_NO || '',
                    email: employeeData.MAIL_ID || '',
                    gender: employeeData.GENDER || '',
                    bloodGroup: employeeData.BLOOD_GROUP || '',
                    dateOfBirth: employeeData.DATE_OF_BIRTH ? new Date(employeeData.DATE_OF_BIRTH).toLocaleDateString() : '',
                    location: employeeData.LOCATION || '',
                    maritalStatus: employeeData.MARITAL_STATUS || '',
                    aadharNo: employeeData.AADHAR_NO || '',
                    panNo: employeeData.PAN_NO || '',
                    bankAccountNo: employeeData.BANK_ACCOUNT_NO || '',
                    monthlyBasicSalary: employeeData.MONTHLY_BASIC_SALARY || '',
                    monthlySpecialAllowance: employeeData.MONTHLY_SPECIAL_ALLOWANCE || '',
                    contributionPercentage: employeeData.CONTRIBUTION_PERCENTAGE || ''
                };

                console.log('Template data:', templateData);

                try {
                    // Set the data using the newer API
                    doc.render(templateData);
                } catch (renderError) {
                    console.error('Error rendering template:', renderError);
                    return res.status(500).json({ 
                        error: 'Error rendering document template',
                        details: renderError.message,
                        stack: renderError.stack
                    });
                }

                // Generate the output
                const buf = doc.getZip().generate({ type: 'nodebuffer' });

                // Set response headers for file download
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('Content-Disposition', `attachment; filename="${document.name}.docx"`);
                res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
                
                // Send the file
                console.log('Sending document response for:', document.name);
                res.send(buf);
                return; // Exit after sending the first file
            } catch (fileError) {
                console.error(`Error processing file ${document.filename}:`, fileError);
                return res.status(500).json({ 
                    error: `Error processing document: ${fileError.message}`,
                    details: fileError.stack
                });
            }
        }

        // If no documents were processed
        res.status(404).json({ error: 'No valid documents found to process' });

    } catch (error) {
        console.error('Error in document generation:', error);
        res.status(500).json({ 
            error: 'Error generating documents',
            details: error.message,
            stack: error.stack
        });
    }
});

const availableDocuments = [
    { id: 'posh', name: 'POSH Declaration', filename: '29. ABMC728-POSH.docx' },
    { id: 'nischint', name: 'Nischint Form (Officer and Above)', filename: '2. Nischint Form_Officer and Above.docx' }
];

async function getEmployeeData(poornataId) {
    try {
        // Get a connection from the pool
        const connection = await oracledb.getConnection();
        console.log('Database connection established');
        
        // Query the database for employee data
        const result = await connection.execute(
            `SELECT * FROM EMPLOYEES WHERE POORNATA_ID = :id`,
            [poornataId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        console.log('Database query result:', result);

        // Release the connection
        await connection.close();
        console.log('Database connection closed');

        if (result.rows.length === 0) {
            throw new Error('Employee not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching employee data:', error);
        throw error;
    }
}

module.exports = router; 