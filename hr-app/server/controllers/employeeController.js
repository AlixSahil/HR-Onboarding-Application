const oracledb = require('oracledb');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM Employee ORDER BY personal_email'
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
        
        // Get basic employee information
        const employeeResult = await connection.execute(
            'SELECT * FROM Employee WHERE poornata_id = :id',
            [req.params.poornataId]
        );
        
        if (employeeResult.rows.length === 0) {
            await connection.close();
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Get all related information
        const personalEmail = employeeResult.rows[0][0]; // personal_email is first column
        
        const [
            professionalDetails,
            dependents,
            education,
            workHistory,
            languageSkills,
            additionalInfo,
            performanceRating
        ] = await Promise.all([
            connection.execute('SELECT * FROM ProfessionalDetails WHERE personal_email = :email', [personalEmail]),
            connection.execute('SELECT * FROM Dependent WHERE personal_email = :email', [personalEmail]),
            connection.execute('SELECT * FROM Education WHERE personal_email = :email', [personalEmail]),
            connection.execute('SELECT * FROM WorkHistory WHERE personal_email = :email', [personalEmail]),
            connection.execute('SELECT * FROM LanguageSkill WHERE personal_email = :email', [personalEmail]),
            connection.execute('SELECT * FROM AdditionalInfo WHERE personal_email = :email', [personalEmail]),
            connection.execute('SELECT * FROM PerformanceRating WHERE personal_email = :email', [personalEmail])
        ]);

        await connection.close();

        // Combine all the data
        const employeeData = {
            basicInfo: employeeResult.rows[0],
            professionalDetails: professionalDetails.rows[0],
            dependents: dependents.rows,
            education: education.rows,
            workHistory: workHistory.rows,
            languageSkills: languageSkills.rows,
            additionalInfo: additionalInfo.rows[0],
            performanceRating: performanceRating.rows[0]
        };

        res.json(employeeData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching employee' });
    }
};

// Create new employee
const createEmployee = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const data = req.body;
        
        console.log('Received employee data:', data);

        // Helper function to validate and format dates
        const formatDate = (dateStr) => {
            if (!dateStr) return null;
            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    console.error('Invalid date format:', dateStr);
                    return null;
                }
                return date.toISOString().split('T')[0];
            } catch (err) {
                console.error('Error formatting date:', err);
                return null;
            }
        };

        // Validate required fields
        const requiredFields = [
            'personal_email', 'official_email', 'joining_reference_id', 'poornata_id',
            'employee_code', 'first_name', 'last_name', 'dob', 'permanent_address',
            'aadhar_no', 'mobile_no'
        ];
        
        const missingFields = requiredFields.filter(field => !data.basicInfo[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate required professional details
        if (!data.professionalDetails) {
            throw new Error('Professional details are required');
        }

        const requiredProfessionalFields = [
            'department',
            'designation',
            'job_band',
            'doj_unit',
            'doj_group'
        ];

        const missingProfessionalFields = requiredProfessionalFields.filter(
            field => !data.professionalDetails[field]
        );
        if (missingProfessionalFields.length > 0) {
            throw new Error(`Missing required professional fields: ${missingProfessionalFields.join(', ')}`);
        }

        // Format all date fields
        const formattedData = {
            basicInfo: {
                ...data.basicInfo,
                dob: formatDate(data.basicInfo.dob)
            },
            professionalDetails: {
                ...data.professionalDetails,
                doj_unit: formatDate(data.professionalDetails.doj_unit),
                doj_group: formatDate(data.professionalDetails.doj_group),
                loi_issue_date: formatDate(data.professionalDetails.loi_issue_date),
                confirmation_date: formatDate(data.professionalDetails.confirmation_date)
            }
        };

        console.log('Formatted data for database:', formattedData);

        // Insert into Employee table
        const employeeResult = await connection.execute(
            `INSERT INTO Employee (
                personal_email, official_email, joining_reference_id, poornata_id,
                employee_code, prefix, first_name, middle_name, last_name,
                fathers_name, mothers_name, dob, gender, marital_status,
                blood_group, nationality, birth_state, birth_location,
                religion, caste, permanent_address, current_address,
                quarter_no, pan_no, aadhar_no, bank_name,
                bank_account_no, ifsc_code, mobile_no
            ) VALUES (
                :personal_email, :official_email, :joining_reference_id, :poornata_id,
                :employee_code, :prefix, :first_name, :middle_name, :last_name,
                :fathers_name, :mothers_name, TO_DATE(:dob, 'YYYY-MM-DD'), :gender, :marital_status,
                :blood_group, :nationality, :birth_state, :birth_location,
                :religion, :caste, :permanent_address, :current_address,
                :quarter_no, :pan_no, :aadhar_no, :bank_name,
                :bank_account_no, :ifsc_code, :mobile_no
            ) RETURNING personal_email INTO :out_email`,
            {
                personal_email: formattedData.basicInfo.personal_email,
                official_email: formattedData.basicInfo.official_email,
                joining_reference_id: formattedData.basicInfo.joining_reference_id,
                poornata_id: formattedData.basicInfo.poornata_id,
                employee_code: formattedData.basicInfo.employee_code,
                prefix: formattedData.basicInfo.prefix || null,
                first_name: formattedData.basicInfo.first_name,
                middle_name: formattedData.basicInfo.middle_name || null,
                last_name: formattedData.basicInfo.last_name,
                fathers_name: formattedData.basicInfo.fathers_name || null,
                mothers_name: formattedData.basicInfo.mothers_name || null,
                dob: formattedData.basicInfo.dob,
                gender: formattedData.basicInfo.gender || null,
                marital_status: formattedData.basicInfo.marital_status || null,
                blood_group: formattedData.basicInfo.blood_group || null,
                nationality: formattedData.basicInfo.nationality || null,
                birth_state: formattedData.basicInfo.birth_state || null,
                birth_location: formattedData.basicInfo.birth_location || null,
                religion: formattedData.basicInfo.religion || null,
                caste: formattedData.basicInfo.caste || null,
                permanent_address: formattedData.basicInfo.permanent_address,
                current_address: formattedData.basicInfo.current_address || null,
                quarter_no: formattedData.basicInfo.quarter_no || null,
                pan_no: formattedData.basicInfo.pan_no || null,
                aadhar_no: formattedData.basicInfo.aadhar_no,
                bank_name: formattedData.basicInfo.bank_name || null,
                bank_account_no: formattedData.basicInfo.bank_account_no || null,
                ifsc_code: formattedData.basicInfo.ifsc_code || null,
                mobile_no: formattedData.basicInfo.mobile_no,
                out_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            },
            { autoCommit: false }
        );

        const personalEmail = employeeResult.outBinds.out_email[0];
        console.log('Employee record created with email:', personalEmail);

        // Insert Professional Details
        await connection.execute(
            `INSERT INTO ProfessionalDetails (
                personal_email, doj_unit, doj_group, department,
                designation, job_band, loi_issue_date, confirmation_date,
                current_ctc, supervisor_name
            ) VALUES (
                :personal_email, TO_DATE(:doj_unit, 'YYYY-MM-DD'), TO_DATE(:doj_group, 'YYYY-MM-DD'),
                :department, :designation, :job_band, TO_DATE(:loi_issue_date, 'YYYY-MM-DD'),
                TO_DATE(:confirmation_date, 'YYYY-MM-DD'), :current_ctc, :supervisor_name
            )`,
            {
                personal_email: personalEmail,
                doj_unit: formattedData.professionalDetails.doj_unit,
                doj_group: formattedData.professionalDetails.doj_group,
                department: formattedData.professionalDetails.department,
                designation: formattedData.professionalDetails.designation,
                job_band: formattedData.professionalDetails.job_band,
                loi_issue_date: formattedData.professionalDetails.loi_issue_date,
                confirmation_date: formattedData.professionalDetails.confirmation_date,
                current_ctc: formattedData.professionalDetails.current_ctc || null,
                supervisor_name: formattedData.professionalDetails.supervisor_name || null
            },
            { autoCommit: false }
        );

        console.log('Professional details inserted successfully');

        // Insert Dependents
        if (data.dependents && data.dependents.length > 0) {
            for (const dependent of data.dependents) {
                await connection.execute(
                    `INSERT INTO Dependent (
                        personal_email, dependent_type, name, relation, dob,
                        age, share_percentage, address, aadhar_no, marital_status,
                        occupation, mobile_no, is_primary
                    ) VALUES (
                        :personal_email, :dependent_type, :name, :relation, TO_DATE(:dob, 'YYYY-MM-DD'),
                        :age, :share_percentage, :address, :aadhar_no, :marital_status,
                        :occupation, :mobile_no, :is_primary
                    )`,
                    {
                        personal_email: personalEmail,
                        dependent_type: dependent.dependent_type,
                        name: dependent.name,
                        relation: dependent.relation,
                        dob: formatDate(dependent.dob),
                        age: dependent.age || null,
                        share_percentage: dependent.share_percentage || null,
                        address: dependent.address || null,
                        aadhar_no: dependent.aadhar_no || null,
                        marital_status: dependent.marital_status || null,
                        occupation: dependent.occupation || null,
                        mobile_no: dependent.mobile_no || null,
                        is_primary: dependent.is_primary || 'N'
                    },
                    { autoCommit: false }
                );
            }
            console.log('Dependents inserted successfully');
        }

        // Insert Education History
        if (data.education && data.education.length > 0) {
            for (const edu of data.education) {
                await connection.execute(
                    `INSERT INTO Education (
                        personal_email, qualification, institution, major,
                        completion_date, percentage, state
                    ) VALUES (
                        :personal_email, :qualification, :institution, :major,
                        TO_DATE(:completion_date, 'YYYY-MM-DD'), :percentage, :state
                    )`,
                    {
                        personal_email: personalEmail,
                        qualification: edu.qualification,
                        institution: edu.institution,
                        major: edu.major || null,
                        completion_date: formatDate(edu.completion_date),
                        percentage: edu.percentage || null,
                        state: edu.state || null
                    },
                    { autoCommit: false }
                );
            }
            console.log('Education history inserted successfully');
        }

        // Insert Work History
        if (data.workHistory && data.workHistory.length > 0) {
            for (const work of data.workHistory) {
                await connection.execute(
                    `INSERT INTO WorkHistory (
                        personal_email, is_in_group, organization, job_title,
                        start_date, end_date, location, ctc
                    ) VALUES (
                        :personal_email, :is_in_group, :organization, :job_title,
                        TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'),
                        :location, :ctc
                    )`,
                    {
                        personal_email: personalEmail,
                        is_in_group: work.is_in_group,
                        organization: work.organization,
                        job_title: work.job_title || null,
                        start_date: formatDate(work.start_date),
                        end_date: formatDate(work.end_date),
                        location: work.location || null,
                        ctc: work.ctc || null
                    },
                    { autoCommit: false }
                );
            }
            console.log('Work history inserted successfully');
        }

        // Insert Language Skills
        if (data.languageSkills && data.languageSkills.length > 0) {
            for (const skill of data.languageSkills) {
                await connection.execute(
                    `INSERT INTO LanguageSkill (
                        personal_email, language, speak_level, read_level, write_level
                    ) VALUES (
                        :personal_email, :language, :speak_level, :read_level, :write_level
                    )`,
                    {
                        personal_email: personalEmail,
                        language: skill.language,
                        speak_level: skill.speak_level,
                        read_level: skill.read_level,
                        write_level: skill.write_level
                    },
                    { autoCommit: false }
                );
            }
            console.log('Language skills inserted successfully');
        }

        // Insert Additional Info
        if (data.additionalInfo) {
            await connection.execute(
                `INSERT INTO AdditionalInfo (
                    personal_email, hobbies, total_experience,
                    last_promotion_date, performance_ratings, special_abilities
                ) VALUES (
                    :personal_email, :hobbies, :total_experience,
                    TO_DATE(:last_promotion_date, 'YYYY-MM-DD'), :performance_ratings, :special_abilities
                )`,
                {
                    personal_email: personalEmail,
                    hobbies: data.additionalInfo.hobbies || null,
                    total_experience: data.additionalInfo.total_experience || null,
                    last_promotion_date: formatDate(data.additionalInfo.last_promotion_date),
                    performance_ratings: data.additionalInfo.performance_ratings || null,
                    special_abilities: data.additionalInfo.special_abilities || null
                },
                { autoCommit: false }
            );
            console.log('Additional info inserted successfully');
        }

        // Insert Performance Rating
        if (data.performanceRating) {
            await connection.execute(
                `INSERT INTO PerformanceRating (
                    personal_email, last_year, second_last_year, third_last_year
                ) VALUES (
                    :personal_email, :last_year, :second_last_year, :third_last_year
                )`,
                {
                    personal_email: personalEmail,
                    last_year: data.performanceRating.last_year || null,
                    second_last_year: data.performanceRating.second_last_year || null,
                    third_last_year: data.performanceRating.third_last_year || null
                },
                { autoCommit: false }
            );
            console.log('Performance rating inserted successfully');
        }

        await connection.commit();
        res.status(201).json({ 
            message: 'Employee created successfully', 
            personal_email: personalEmail 
        });
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error creating employee:', err);
        res.status(500).json({ 
            error: err.message || 'Error creating employee',
            details: err.stack
        });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const { personal_email } = req.params;
        const data = req.body;

        // Update Employee table
        await connection.execute(
            `UPDATE Employee SET
                official_email = :official_email,
                joining_reference_id = :joining_reference_id,
                poornata_id = :poornata_id,
                employee_code = :employee_code,
                prefix = :prefix,
                first_name = :first_name,
                middle_name = :middle_name,
                last_name = :last_name,
                fathers_name = :fathers_name,
                mothers_name = :mothers_name,
                dob = TO_DATE(:dob, 'YYYY-MM-DD'),
                gender = :gender,
                marital_status = :marital_status,
                blood_group = :blood_group,
                nationality = :nationality,
                birth_state = :birth_state,
                birth_location = :birth_location,
                religion = :religion,
                caste = :caste,
                permanent_address = :permanent_address,
                current_address = :current_address,
                quarter_no = :quarter_no,
                pan_no = :pan_no,
                aadhar_no = :aadhar_no,
                bank_name = :bank_name,
                bank_account_no = :bank_account_no,
                ifsc_code = :ifsc_code,
                mobile_no = :mobile_no
            WHERE personal_email = :personal_email`,
            { ...data.basicInfo, personal_email },
            { autoCommit: false }
        );

        // Update Professional Details
        if (data.professionalDetails) {
            await connection.execute(
                `UPDATE ProfessionalDetails SET
                    doj_unit = TO_DATE(:doj_unit, 'YYYY-MM-DD'),
                    doj_group = TO_DATE(:doj_group, 'YYYY-MM-DD'),
                    department = :department,
                    designation = :designation,
                    job_band = :job_band,
                    loi_issue_date = TO_DATE(:loi_issue_date, 'YYYY-MM-DD'),
                    confirmation_date = TO_DATE(:confirmation_date, 'YYYY-MM-DD'),
                    current_ctc = :current_ctc,
                    supervisor_name = :supervisor_name
                WHERE personal_email = :personal_email`,
                { ...data.professionalDetails, personal_email },
                { autoCommit: false }
            );
        }

        // Update Dependents
        if (data.dependents) {
            // First delete existing dependents
            await connection.execute(
                'DELETE FROM Dependent WHERE personal_email = :personal_email',
                [personal_email],
                { autoCommit: false }
            );

            // Then insert new dependents
            for (const dependent of data.dependents) {
                await connection.execute(
                    `INSERT INTO Dependent (
                        personal_email, dependent_type, name, relation, dob,
                        age, share_percentage, address, aadhar_no, marital_status,
                        occupation, mobile_no, is_primary
                    ) VALUES (
                        :personal_email, :dependent_type, :name, :relation, TO_DATE(:dob, 'YYYY-MM-DD'),
                        :age, :share_percentage, :address, :aadhar_no, :marital_status,
                        :occupation, :mobile_no, :is_primary
                    )`,
                    { ...dependent, personal_email },
                    { autoCommit: false }
                );
            }
        }

        // Update Education History
        if (data.education) {
            // First delete existing education records
            await connection.execute(
                'DELETE FROM Education WHERE personal_email = :personal_email',
                [personal_email],
                { autoCommit: false }
            );

            // Then insert new education records
            for (const edu of data.education) {
                await connection.execute(
                    `INSERT INTO Education (
                        personal_email, qualification, institution, major,
                        completion_date, percentage, state
                    ) VALUES (
                        :personal_email, :qualification, :institution, :major,
                        TO_DATE(:completion_date, 'YYYY-MM-DD'), :percentage, :state
                    )`,
                    { ...edu, personal_email },
                    { autoCommit: false }
                );
            }
        }

        // Update Work History
        if (data.workHistory) {
            // First delete existing work history
            await connection.execute(
                'DELETE FROM WorkHistory WHERE personal_email = :personal_email',
                [personal_email],
                { autoCommit: false }
            );

            // Then insert new work history
            for (const work of data.workHistory) {
                await connection.execute(
                    `INSERT INTO WorkHistory (
                        personal_email, is_in_group, organization, job_title,
                        start_date, end_date, location, ctc
                    ) VALUES (
                        :personal_email, :is_in_group, :organization, :job_title,
                        TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'),
                        :location, :ctc
                    )`,
                    { ...work, personal_email },
                    { autoCommit: false }
                );
            }
        }

        // Update Language Skills
        if (data.languageSkills) {
            // First delete existing language skills
            await connection.execute(
                'DELETE FROM LanguageSkill WHERE personal_email = :personal_email',
                [personal_email],
                { autoCommit: false }
            );

            // Then insert new language skills
            for (const skill of data.languageSkills) {
                await connection.execute(
                    `INSERT INTO LanguageSkill (
                        personal_email, language, speak_level, read_level, write_level
                    ) VALUES (
                        :personal_email, :language, :speak_level, :read_level, :write_level
                    )`,
                    { ...skill, personal_email },
                    { autoCommit: false }
                );
            }
        }

        // Update Additional Info
        if (data.additionalInfo) {
            await connection.execute(
                `UPDATE AdditionalInfo SET
                    hobbies = :hobbies,
                    total_experience = :total_experience,
                    last_promotion_date = TO_DATE(:last_promotion_date, 'YYYY-MM-DD'),
                    performance_ratings = :performance_ratings,
                    special_abilities = :special_abilities
                WHERE personal_email = :personal_email`,
                { ...data.additionalInfo, personal_email },
                { autoCommit: false }
            );
        }

        // Update Performance Rating
        if (data.performanceRating) {
            await connection.execute(
                `UPDATE PerformanceRating SET
                    last_year = :last_year,
                    second_last_year = :second_last_year,
                    third_last_year = :third_last_year
                WHERE personal_email = :personal_email`,
                { ...data.performanceRating, personal_email },
                { autoCommit: false }
            );
        }

        await connection.commit();
        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        if (connection) {
                await connection.rollback();
        }
        console.error(err);
        res.status(500).json({ error: 'Error updating employee' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const { personal_email } = req.params;

        // Delete all related records first
        await connection.execute('DELETE FROM Dependent WHERE personal_email = :personal_email', [personal_email]);
        await connection.execute('DELETE FROM Education WHERE personal_email = :personal_email', [personal_email]);
        await connection.execute('DELETE FROM WorkHistory WHERE personal_email = :personal_email', [personal_email]);
        await connection.execute('DELETE FROM LanguageSkill WHERE personal_email = :personal_email', [personal_email]);
        await connection.execute('DELETE FROM AdditionalInfo WHERE personal_email = :personal_email', [personal_email]);
        await connection.execute('DELETE FROM PerformanceRating WHERE personal_email = :personal_email', [personal_email]);
        await connection.execute('DELETE FROM ProfessionalDetails WHERE personal_email = :personal_email', [personal_email]);
        
        // Finally delete the employee record
        const result = await connection.execute(
            'DELETE FROM Employee WHERE personal_email = :personal_email',
            [personal_email]
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }

        await connection.commit();
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        if (connection) {
                await connection.rollback();
        }
        console.error(err);
        res.status(500).json({ error: 'Error deleting employee' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeByPoornataId,
    createEmployee,
    updateEmployee,
    deleteEmployee
}; 