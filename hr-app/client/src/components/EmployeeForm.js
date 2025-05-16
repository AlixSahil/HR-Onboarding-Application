import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  FormHelperText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';

const steps = [
  'Personal Details',
  'Professional Details',
  'Nominee & Dependents',
  'Family Information',
  'Emergency Contact',
  'Education & Work History',
  'Language Skills',
  'Additional Information',
  'Performance & Benefits'
];

const EmployeeForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  
  const formatDateForOracle = (dateStr) => {
    if (!dateStr) return null;
    try {
      // Try parsing with moment using multiple formats
      const formats = [
        'YYYY-MM-DD',
        'DD-MM-YYYY',
        'MM-DD-YYYY',
        'YYYY/MM/DD',
        'DD/MM/YYYY',
        'MM/DD/YYYY'
      ];
      
      let parsedDate = null;
      for (const format of formats) {
        const momentDate = moment(dateStr, format, true);
        if (momentDate.isValid()) {
          parsedDate = momentDate;
          break;
        }
      }

      if (!parsedDate) {
        // Try parsing as ISO string
        const isoDate = moment(dateStr, moment.ISO_8601, true);
        if (isoDate.isValid()) {
          parsedDate = isoDate;
        }
      }

      if (!parsedDate || !parsedDate.isValid()) {
        throw new Error(`Invalid date format: ${dateStr}`);
      }

      return parsedDate.format('YYYY-MM-DD');
    } catch (error) {
      console.error('Error formatting date:', error);
      throw new Error(`Invalid date format: ${dateStr}`);
    }
  };

  const formatNumber = (value, decimals = 2) => {
    if (!value) return null;
    return Number(value).toFixed(decimals);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateAadhar = (aadhar) => {
    return /^\d{12}$/.test(aadhar);
  };

  const validatePAN = (pan) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  };

  const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  const validateCTC = (ctc) => {
    return /^\d+(\.\d{1,2})?$/.test(ctc);
  };

  const [formData, setFormData] = useState({
    // Employee table fields
    personal_email: '',
    official_email: '',
    joining_reference_id: '',
    poornata_id: '',
    employee_code: '',
    prefix: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    fathers_name: '',
    mothers_name: '',
    dob: '',
    gender: '',
    marital_status: '',
    blood_group: '',
    nationality: '',
    birth_state: '',
    birth_location: '',
    religion: '',
    caste: '',
    permanent_address: '',
    current_address: '',
    quarter_no: '',
    pan_no: '',
    aadhar_no: '',
    bank_name: '',
    bank_account_no: '',
    ifsc_code: '',
    mobile_no: '',

    // ProfessionalDetails table fields
    professionalDetails: {
      doj_unit: '',
      doj_group: '',
      department: '',
      designation: '',
      job_band: '',
      loi_issue_date: '',
      confirmation_date: '',
      current_ctc: '',
      supervisor_name: ''
    },

    // Nominee information
    gpaNominee: {
      name: '',
      relation: '',
      dob: '',
      age: ''
    },
    nishchintNominee: {
      name: '',
      relation: '',
      dob: '',
      age: ''
    },

    // Dependents (will be stored in Dependent table)
    mediclaimDependents: [],

    // Family information
    spouse: {
      name: '',
      dob: '',
      occupation: '',
      marriage_anniversary: ''
    },
    familyMembers: [],

    // Emergency contacts
    emergencyContacts: [],

    // Education (will be stored in Education table)
    education: [],

    // Work History (will be stored in WorkHistory table)
    workHistory: [],

    // Language Skills (will be stored in LanguageSkill table)
    languageSkills: [],

    // Additional Info (will be stored in AdditionalInfo table)
    additionalInfo: {
      hobbies: '',
      total_experience: '',
      last_promotion_date: '',
      performance_ratings: '',
      special_abilities: ''
    },

    // Performance Rating (will be stored in PerformanceRating table)
    performanceRating: {
      last_year: '',
      second_last_year: '',
      third_last_year: ''
    }
  });

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfessionalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      professionalDetails: {
        ...prev.professionalDetails,
        [name]: value
      }
    }));
  };

  const addMediclaimDependent = () => {
    setFormData({
      ...formData,
      mediclaimDependents: [
        ...formData.mediclaimDependents,
        {
          name: '',
          gender: '',
          relation: '',
          dob: '',
          age: '',
          birth_state: '',
          address: '',
          aadhar_no: '',
          marital_status: '',
        },
      ],
    });
  };

  const handleMediclaimDependentChange = (index, e) => {
    const updatedDependents = [...formData.mediclaimDependents];
    updatedDependents[index] = {
      ...updatedDependents[index],
      [e.target.name]: e.target.value,
    };
    setFormData({
      ...formData,
      mediclaimDependents: updatedDependents,
    });
  };

  const removeMediclaimDependent = (index) => {
    const updatedDependents = formData.mediclaimDependents.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      mediclaimDependents: updatedDependents,
    });
  };

  const validateBasicInfo = () => {
    const errors = {};
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.mobile_no) errors.mobile_no = 'Mobile number is required';
    if (!formData.official_email) errors.official_email = 'Official email is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.marital_status) errors.marital_status = 'Marital status is required';
    if (!formData.nationality) errors.nationality = 'Nationality is required';
    if (!formData.fathers_name) errors.fathers_name = 'Father\'s name is required';
    if (!formData.mothers_name) errors.mothers_name = 'Mother\'s name is required';
    if (!formData.permanent_address) errors.permanent_address = 'Permanent address is required';
    if (!formData.current_address) errors.current_address = 'Current address is required';
    if (!formData.aadhar_no) errors.aadhar_no = 'Aadhar number is required';
    if (!formData.pan_no) errors.pan_no = 'PAN number is required';
    
    console.log('Basic Info Validation Errors:', errors);
    return errors;
  };

  const validateProfessionalDetails = () => {
    const errors = {};
    console.log('Validating professional details:', formData.professionalDetails);
    
    if (!formData.professionalDetails.doj_unit) {
      errors.doj_unit = 'Date of joining (Unit) is required';
    }
    if (!formData.professionalDetails.doj_group) {
      errors.doj_group = 'Date of joining (Group) is required';
    }
    if (!formData.professionalDetails.department) {
      errors.department = 'Department is required';
    }
    if (!formData.professionalDetails.designation) {
      errors.designation = 'Designation is required';
    }
    if (!formData.professionalDetails.job_band) {
      errors.job_band = 'Job band is required';
    }
    
    console.log('Professional details validation errors:', errors);
    return errors;
  };

  const validateNomineeAndDependents = () => {
    const errors = {};
    if (!formData.gpaNominee.name) errors.gpaNominee_name = 'GPA nominee name is required';
    if (!formData.gpaNominee.relation) errors.gpaNominee_relation = 'GPA nominee relation is required';
    if (!formData.gpaNominee.dob) errors.gpaNominee_dob = 'GPA nominee date of birth is required';
    if (!formData.nishchintNominee.name) errors.nishchintNominee_name = 'Nishchint nominee name is required';
    if (!formData.nishchintNominee.relation) errors.nishchintNominee_relation = 'Nishchint nominee relation is required';
    if (!formData.nishchintNominee.dob) errors.nishchintNominee_dob = 'Nishchint nominee date of birth is required';
    return errors;
  };

  const validateFamilyInfo = () => {
    const errors = {};
    if (!formData.spouse.name) errors.spouse_name = 'Spouse name is required';
    if (!formData.spouse.dob) errors.spouse_dob = 'Spouse date of birth is required';
    if (!formData.spouse.marriage_anniversary) errors.spouse_marriage_anniversary = 'Marriage anniversary is required';
    return errors;
  };

  const validateEmergencyContact = () => {
    const errors = {};
    if (formData.emergencyContacts.length === 0) {
      errors.emergencyContacts = 'At least one emergency contact is required';
    } else {
      formData.emergencyContacts.forEach((contact, index) => {
        if (!contact.name) errors[`emergencyContact_${index}_name`] = 'Contact name is required';
        if (!contact.relation) errors[`emergencyContact_${index}_relation`] = 'Contact relation is required';
        if (!contact.mobile_no) errors[`emergencyContact_${index}_mobile_no`] = 'Contact mobile number is required';
      });
    }
    return errors;
  };

  const validateEducationAndWorkHistory = () => {
    const errors = {};
    if (formData.education.length === 0) {
      errors.education = 'At least one education record is required';
    } else {
      formData.education.forEach((edu, index) => {
        if (!edu.qualification) errors[`education_${index}_qualification`] = 'Qualification is required';
        if (!edu.institution) errors[`education_${index}_institution`] = 'Institution is required';
        if (!edu.major) errors[`education_${index}_major`] = 'Major is required';
        if (!edu.completion_date) errors[`education_${index}_completion_date`] = 'Completion date is required';
        if (!edu.percentage) errors[`education_${index}_percentage`] = 'Percentage is required';
        if (!edu.state) errors[`education_${index}_state`] = 'State is required';
      });
    }
    return errors;
  };

  const validatePerformanceAndBenefits = () => {
    const errors = {};
    if (!formData.providentFund.uan_no) errors.uan_no = 'UAN number is required';
    if (!formData.providentFund.nominee_name) errors.pf_nominee_name = 'PF nominee name is required';
    if (!formData.providentFund.nominee_relation) errors.pf_nominee_relation = 'PF nominee relation is required';
    if (!formData.gratuityNominee.name) errors.gratuity_nominee_name = 'Gratuity nominee name is required';
    if (!formData.gratuityNominee.relation) errors.gratuity_nominee_relation = 'Gratuity nominee relation is required';
    if (!formData.superannuation.name) errors.superannuation_nominee_name = 'Superannuation nominee name is required';
    if (!formData.superannuation.relation) errors.superannuation_nominee_relation = 'Superannuation nominee relation is required';
    return errors;
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return validateBasicInfo();
      case 1:
        return validateProfessionalDetails();
      case 2:
        return validateNomineeAndDependents();
      case 3:
        return validateFamilyInfo();
      case 4:
        return validateEmergencyContact();
      case 5:
        return validateEducationAndWorkHistory();
      case 6:
        return {}; // Language skills are optional
      case 7:
        return {}; // Additional info is optional
      case 8:
        return validatePerformanceAndBenefits();
      default:
        return {};
    }
  };

  const handleNext = () => {
    console.log('Current Step:', activeStep);
    const stepErrors = validateStep(activeStep);
    console.log('Step Errors:', stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      console.log('Moving to next step');
      setActiveStep((prevStep) => prevStep + 1);
      setErrors({}); // Clear errors when moving to next step
    } else {
      console.log('Validation failed, showing errors');
      setErrors(stepErrors);
      // Scroll to the first error
      const firstErrorField = document.querySelector('[error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting form submission...');
    
    try {
        // Validate all sections
        const basicInfoErrors = validateBasicInfo();
        const professionalErrors = validateProfessionalDetails();
        const nomineeErrors = validateNomineeAndDependents();
        const familyErrors = validateFamilyInfo();

        if (Object.keys(basicInfoErrors).length > 0 ||
            Object.keys(professionalErrors).length > 0 ||
            Object.keys(nomineeErrors).length > 0 ||
            Object.keys(familyErrors).length > 0) {
            setErrors({
                ...basicInfoErrors,
                ...professionalErrors,
                ...nomineeErrors,
                ...familyErrors
            });
            console.error('Validation errors:', {
                basicInfoErrors,
                professionalErrors,
                nomineeErrors,
                familyErrors
            });
            return;
        }

        // Format and validate data before submission
        const formattedData = {
            basicInfo: {
                personal_email: formData.personal_email,
                official_email: formData.official_email,
                joining_reference_id: formData.joining_reference_id,
                poornata_id: formData.poornata_id,
                employee_code: formData.employee_code,
                prefix: formData.prefix,
                first_name: formData.first_name,
                middle_name: formData.middle_name,
                last_name: formData.last_name,
                fathers_name: formData.fathers_name,
                mothers_name: formData.mothers_name,
                dob: formatDateForOracle(formData.dob),
                gender: formData.gender,
                marital_status: formData.marital_status,
                blood_group: formData.blood_group,
                nationality: formData.nationality,
                birth_state: formData.birth_state,
                birth_location: formData.birth_location,
                religion: formData.religion,
                caste: formData.caste,
                permanent_address: formData.permanent_address,
                current_address: formData.current_address,
                quarter_no: formData.quarter_no,
                pan_no: formData.pan_no,
                aadhar_no: formData.aadhar_no,
                bank_name: formData.bank_name,
                bank_account_no: formData.bank_account_no,
                ifsc_code: formData.ifsc_code,
                mobile_no: formData.mobile_no
            },
            professionalDetails: {
                doj_unit: formatDateForOracle(formData.professionalDetails.doj_unit),
                doj_group: formatDateForOracle(formData.professionalDetails.doj_group),
                department: formData.professionalDetails.department,
                designation: formData.professionalDetails.designation,
                job_band: formData.professionalDetails.job_band,
                loi_issue_date: formatDateForOracle(formData.professionalDetails.loi_issue_date),
                confirmation_date: formatDateForOracle(formData.professionalDetails.confirmation_date),
                current_ctc: formatNumber(formData.professionalDetails.current_ctc),
                supervisor_name: formData.professionalDetails.supervisor_name
            },
            dependents: [
                // GPA Nominee
                {
                    dependent_type: 'NOMINEE',
                    name: formData.gpaNominee.name,
                    relation: formData.gpaNominee.relation,
                    dob: formatDateForOracle(formData.gpaNominee.dob),
                    age: formatNumber(formData.gpaNominee.age, 0),
                    is_primary: 'Y'
                },
                // Nishchint Nominee
                {
                    dependent_type: 'NOMINEE',
                    name: formData.nishchintNominee.name,
                    relation: formData.nishchintNominee.relation,
                    dob: formatDateForOracle(formData.nishchintNominee.dob),
                    age: formatNumber(formData.nishchintNominee.age, 0),
                    is_primary: 'N'
                },
                // Mediclaim Dependents
                ...formData.mediclaimDependents.map(dep => ({
                    dependent_type: 'MEDICLAIM',
                    name: dep.name,
                    relation: dep.relation,
                    dob: formatDateForOracle(dep.dob),
                    age: formatNumber(dep.age, 0),
                    is_primary: 'N'
                }))
            ],
            education: formData.education.map(edu => ({
                qualification: edu.qualification,
                institution: edu.institution,
                major: edu.major,
                completion_date: formatDateForOracle(edu.completion_date),
                percentage: formatNumber(edu.percentage),
                state: edu.state
            })),
            workHistory: formData.workHistory.map(work => ({
                is_in_group: work.is_in_group,
                organization: work.organization,
                job_title: work.job_title,
                start_date: formatDateForOracle(work.start_date),
                end_date: formatDateForOracle(work.end_date),
                location: work.location,
                ctc: formatNumber(work.ctc)
            })),
            languageSkills: formData.languageSkills.map(skill => ({
                language: skill.language,
                speak_level: skill.speak_level,
                read_level: skill.read_level,
                write_level: skill.write_level
            })),
            additionalInfo: {
                hobbies: formData.additionalInfo.hobbies,
                total_experience: formatNumber(formData.additionalInfo.total_experience),
                last_promotion_date: formatDateForOracle(formData.additionalInfo.last_promotion_date),
                special_abilities: formData.additionalInfo.special_abilities
            },
            performanceRating: {
                last_year: formData.performanceRating.last_year,
                second_last_year: formData.performanceRating.second_last_year,
                third_last_year: formData.performanceRating.third_last_year
            }
        };

        // Validate formatted data
        if (!validateEmail(formattedData.basicInfo.personal_email)) {
            throw new Error('Invalid personal email format');
        }
        if (!validateEmail(formattedData.basicInfo.official_email)) {
            throw new Error('Invalid official email format');
        }
        if (!validateAadhar(formattedData.basicInfo.aadhar_no)) {
            throw new Error('Aadhar number must be 12 digits');
        }
        if (formattedData.basicInfo.pan_no && !validatePAN(formattedData.basicInfo.pan_no)) {
            throw new Error('Invalid PAN number format');
        }
        if (!validateMobile(formattedData.basicInfo.mobile_no)) {
            throw new Error('Mobile number must be 10 digits');
        }
        if (formattedData.professionalDetails.current_ctc && 
            !validateCTC(formattedData.professionalDetails.current_ctc)) {
            throw new Error('Invalid CTC format');
        }

        console.log('Submitting formatted data:', formattedData);

        const response = await fetch('http://localhost:5000/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create employee');
        }

        // Reset form and show success message
        setFormData({
            personal_email: '',
            official_email: '',
            joining_reference_id: '',
            poornata_id: '',
            employee_code: '',
            prefix: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            fathers_name: '',
            mothers_name: '',
            dob: '',
            gender: '',
            marital_status: '',
            blood_group: '',
            nationality: '',
            birth_state: '',
            birth_location: '',
            religion: '',
            caste: '',
            permanent_address: '',
            current_address: '',
            quarter_no: '',
            pan_no: '',
            aadhar_no: '',
            bank_name: '',
            bank_account_no: '',
            ifsc_code: '',
            mobile_no: '',
            professionalDetails: {
                doj_unit: '',
                doj_group: '',
                department: '',
                designation: '',
                job_band: '',
                loi_issue_date: '',
                confirmation_date: '',
                current_ctc: '',
                supervisor_name: ''
            },
            dependents: [],
            education: [],
            workHistory: [],
            languageSkills: [],
            additionalInfo: {
                hobbies: '',
                total_experience: '',
                last_promotion_date: '',
                special_abilities: ''
            },
            performanceRating: {
                last_year: '',
                second_last_year: '',
                third_last_year: ''
            }
        });
        setActiveStep(0);
        setErrors({});
        alert('Employee created successfully!');
    } catch (error) {
        console.error('Form submission error:', error);
        setErrors(prev => ({
            ...prev,
            submit: error.message || 'Failed to create employee'
        }));
    }
  };

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Basic Information</Typography>
      </Grid>
      
      {/* Employee Identification */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Personal Email"
          name="personal_email"
          value={formData.personal_email}
          onChange={handleBasicInfoChange}
          error={!!errors.personal_email}
          helperText={errors.personal_email}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Official Email"
          name="official_email"
          value={formData.official_email}
          onChange={handleBasicInfoChange}
          error={!!errors.official_email}
          helperText={errors.official_email}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Joining Reference ID"
          name="joining_reference_id"
          value={formData.joining_reference_id}
          onChange={handleBasicInfoChange}
          error={!!errors.joining_reference_id}
          helperText={errors.joining_reference_id}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Poornata ID"
          name="poornata_id"
          value={formData.poornata_id}
          onChange={handleBasicInfoChange}
          error={!!errors.poornata_id}
          helperText={errors.poornata_id}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Employee Code"
          name="employee_code"
          value={formData.employee_code}
          onChange={handleBasicInfoChange}
          error={!!errors.employee_code}
          helperText={errors.employee_code}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Prefix"
          name="prefix"
          value={formData.prefix}
          onChange={handleBasicInfoChange}
        />
      </Grid>

      {/* Name Information */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleBasicInfoChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Middle Name"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleBasicInfoChange}
          error={!!errors.last_name}
          helperText={errors.last_name}
        />
      </Grid>

      {/* Parent Information */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Father's Name"
          name="fathers_name"
          value={formData.fathers_name}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mother's Name"
          name="mothers_name"
          value={formData.mothers_name}
          onChange={handleBasicInfoChange}
        />
      </Grid>

      {/* Personal Information */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          type="date"
          label="Date of Birth"
          name="dob"
          value={formData.dob}
          onChange={handleBasicInfoChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.dob}
          helperText={errors.dob}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth required error={!!errors.gender}>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleBasicInfoChange}
            label="Gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth required error={!!errors.marital_status}>
          <InputLabel>Marital Status</InputLabel>
          <Select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleBasicInfoChange}
            label="Marital Status"
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </Select>
          {errors.marital_status && <FormHelperText>{errors.marital_status}</FormHelperText>}
        </FormControl>
      </Grid>

      {/* Additional Personal Information */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Blood Group"
          name="blood_group"
          value={formData.blood_group}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Birth State"
          name="birth_state"
          value={formData.birth_state}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Birth Location"
          name="birth_location"
          value={formData.birth_location}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Religion"
          name="religion"
          value={formData.religion}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Caste"
          name="caste"
          value={formData.caste}
          onChange={handleBasicInfoChange}
        />
      </Grid>

      {/* Address Information */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Permanent Address"
          name="permanent_address"
          multiline
          rows={3}
          value={formData.permanent_address}
          onChange={handleBasicInfoChange}
          error={!!errors.permanent_address}
          helperText={errors.permanent_address}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current Address"
          name="current_address"
          multiline
          rows={3}
          value={formData.current_address}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Quarter No"
          name="quarter_no"
          value={formData.quarter_no}
          onChange={handleBasicInfoChange}
        />
      </Grid>

      {/* ID & Bank Details */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="PAN Number"
          name="pan_no"
          value={formData.pan_no}
          onChange={handleBasicInfoChange}
          error={!!errors.pan_no}
          helperText={errors.pan_no}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Aadhar Number"
          name="aadhar_no"
          value={formData.aadhar_no}
          onChange={handleBasicInfoChange}
          error={!!errors.aadhar_no}
          helperText={errors.aadhar_no}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Bank Name"
          name="bank_name"
          value={formData.bank_name}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Bank Account Number"
          name="bank_account_no"
          value={formData.bank_account_no}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="IFSC Code"
          name="ifsc_code"
          value={formData.ifsc_code}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Mobile Number"
          name="mobile_no"
          value={formData.mobile_no}
          onChange={handleBasicInfoChange}
          error={!!errors.mobile_no}
          helperText={errors.mobile_no}
        />
      </Grid>
    </Grid>
  );

  const renderProfessionalDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Professional Details</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          type="date"
          label="Date of Joining (Unit)"
          name="doj_unit"
          value={formData.professionalDetails.doj_unit}
          onChange={handleProfessionalDetailsChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.doj_unit}
          helperText={errors.doj_unit}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Date of Joining (Group)"
          name="doj_group"
          value={formData.professionalDetails.doj_group}
          onChange={handleProfessionalDetailsChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Department"
          name="department"
          value={formData.professionalDetails.department}
          onChange={handleProfessionalDetailsChange}
          error={!!errors.department}
          helperText={errors.department}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Designation"
          name="designation"
          value={formData.professionalDetails.designation}
          onChange={handleProfessionalDetailsChange}
          error={!!errors.designation}
          helperText={errors.designation}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Job Band"
          name="job_band"
          value={formData.professionalDetails.job_band}
          onChange={handleProfessionalDetailsChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="LOI Issue Date"
          name="loi_issue_date"
          value={formData.professionalDetails.loi_issue_date}
          onChange={handleProfessionalDetailsChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Confirmation Date"
          name="confirmation_date"
          value={formData.professionalDetails.confirmation_date}
          onChange={handleProfessionalDetailsChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current CTC"
          name="current_ctc"
          type="number"
          value={formData.professionalDetails.current_ctc}
          onChange={handleProfessionalDetailsChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Supervisor Name"
          name="supervisor_name"
          value={formData.professionalDetails.supervisor_name}
          onChange={handleProfessionalDetailsChange}
        />
      </Grid>
    </Grid>
  );

  const renderNomineeAndDependents = () => (
    <Grid container spacing={3}>
      {/* GPA Nominee */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>GPA Nominee</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Name"
          name="name"
          value={formData.gpaNominee.name}
          onChange={(e) => setFormData({
            ...formData,
            gpaNominee: { ...formData.gpaNominee, name: e.target.value }
          })}
          error={!!errors.gpaNominee_name}
          helperText={errors.gpaNominee_name}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Relation"
          name="relation"
          value={formData.gpaNominee.relation}
          onChange={(e) => setFormData({
            ...formData,
            gpaNominee: { ...formData.gpaNominee, relation: e.target.value }
          })}
          error={!!errors.gpaNominee_relation}
          helperText={errors.gpaNominee_relation}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          type="date"
          label="Date of Birth"
          name="dob"
          value={formData.gpaNominee.dob}
          onChange={(e) => setFormData({
            ...formData,
            gpaNominee: { ...formData.gpaNominee, dob: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
          error={!!errors.gpaNominee_dob}
          helperText={errors.gpaNominee_dob}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Age"
          name="age"
          value={formData.gpaNominee.age}
          onChange={(e) => setFormData({
            ...formData,
            gpaNominee: { ...formData.gpaNominee, age: e.target.value }
          })}
        />
      </Grid>

      {/* Nishchint Nominee */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Nishchint Nominee</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Name"
          name="name"
          value={formData.nishchintNominee.name}
          onChange={(e) => setFormData({
            ...formData,
            nishchintNominee: { ...formData.nishchintNominee, name: e.target.value }
          })}
          error={!!errors.nishchintNominee_name}
          helperText={errors.nishchintNominee_name}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Relation"
          name="relation"
          value={formData.nishchintNominee.relation}
          onChange={(e) => setFormData({
            ...formData,
            nishchintNominee: { ...formData.nishchintNominee, relation: e.target.value }
          })}
          error={!!errors.nishchintNominee_relation}
          helperText={errors.nishchintNominee_relation}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          type="date"
          label="Date of Birth"
          name="dob"
          value={formData.nishchintNominee.dob}
          onChange={(e) => setFormData({
            ...formData,
            nishchintNominee: { ...formData.nishchintNominee, dob: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
          error={!!errors.nishchintNominee_dob}
          helperText={errors.nishchintNominee_dob}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Age"
          name="age"
          value={formData.nishchintNominee.age}
          onChange={(e) => setFormData({
            ...formData,
            nishchintNominee: { ...formData.nishchintNominee, age: e.target.value }
          })}
        />
      </Grid>

      {/* Mediclaim Dependents */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Mediclaim Dependents</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              mediclaimDependents: [...formData.mediclaimDependents, {
                name: '',
                relation: '',
                dob: '',
                age: ''
              }]
            })}
            variant="contained"
            color="primary"
          >
            Add Dependent
          </Button>
        </Box>
        {formData.mediclaimDependents.map((dependent, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Dependent {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => {
                  const updatedDependents = formData.mediclaimDependents.filter((_, i) => i !== index);
                  setFormData({ ...formData, mediclaimDependents: updatedDependents });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={dependent.name}
                  onChange={(e) => {
                    const updatedDependents = [...formData.mediclaimDependents];
                    updatedDependents[index] = { ...dependent, name: e.target.value };
                    setFormData({ ...formData, mediclaimDependents: updatedDependents });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Relation"
                  value={dependent.relation}
                  onChange={(e) => {
                    const updatedDependents = [...formData.mediclaimDependents];
                    updatedDependents[index] = { ...dependent, relation: e.target.value };
                    setFormData({ ...formData, mediclaimDependents: updatedDependents });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  value={dependent.dob}
                  onChange={(e) => {
                    const updatedDependents = [...formData.mediclaimDependents];
                    updatedDependents[index] = { ...dependent, dob: e.target.value };
                    setFormData({ ...formData, mediclaimDependents: updatedDependents });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Age"
                  value={dependent.age}
                  onChange={(e) => {
                    const updatedDependents = [...formData.mediclaimDependents];
                    updatedDependents[index] = { ...dependent, age: e.target.value };
                    setFormData({ ...formData, mediclaimDependents: updatedDependents });
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderFamilyInfo = () => (
    <Grid container spacing={3}>
      {/* Spouse Information */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Spouse Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.spouse.name}
              onChange={(e) => setFormData({
                ...formData,
                spouse: { ...formData.spouse, name: e.target.value }
              })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              name="dob"
              value={formData.spouse.dob}
              onChange={(e) => setFormData({
                ...formData,
                spouse: { ...formData.spouse, dob: e.target.value }
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={formData.spouse.occupation}
              onChange={(e) => setFormData({
                ...formData,
                spouse: { ...formData.spouse, occupation: e.target.value }
              })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Marriage Anniversary"
              name="marriage_anniversary"
              value={formData.spouse.marriage_anniversary}
              onChange={(e) => setFormData({
                ...formData,
                spouse: { ...formData.spouse, marriage_anniversary: e.target.value }
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Family Members */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Family Members</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              familyMembers: [...formData.familyMembers, {
                name: '',
                relation: '',
                dob: '',
                occupation: '',
                mobile_no: ''
              }]
            })}
            variant="contained"
            color="primary"
          >
            Add Family Member
          </Button>
        </Box>
        {formData.familyMembers.map((member, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Family Member {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => {
                  const updatedMembers = formData.familyMembers.filter((_, i) => i !== index);
                  setFormData({ ...formData, familyMembers: updatedMembers });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={member.name}
                  onChange={(e) => {
                    const updatedMembers = [...formData.familyMembers];
                    updatedMembers[index] = { ...member, name: e.target.value };
                    setFormData({ ...formData, familyMembers: updatedMembers });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Relation"
                  value={member.relation}
                  onChange={(e) => {
                    const updatedMembers = [...formData.familyMembers];
                    updatedMembers[index] = { ...member, relation: e.target.value };
                    setFormData({ ...formData, familyMembers: updatedMembers });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  value={member.dob}
                  onChange={(e) => {
                    const updatedMembers = [...formData.familyMembers];
                    updatedMembers[index] = { ...member, dob: e.target.value };
                    setFormData({ ...formData, familyMembers: updatedMembers });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={member.occupation}
                  onChange={(e) => {
                    const updatedMembers = [...formData.familyMembers];
                    updatedMembers[index] = { ...member, occupation: e.target.value };
                    setFormData({ ...formData, familyMembers: updatedMembers });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={member.mobile_no}
                  onChange={(e) => {
                    const updatedMembers = [...formData.familyMembers];
                    updatedMembers[index] = { ...member, mobile_no: e.target.value };
                    setFormData({ ...formData, familyMembers: updatedMembers });
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderEmergencyContact = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Emergency Contacts</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              emergencyContacts: [...formData.emergencyContacts, { name: '', relation: '', mobile_no: '' }]
            })}
            variant="contained"
            color="primary"
          >
            Add Contact
          </Button>
        </Box>
        {formData.emergencyContacts.map((contact, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Contact {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => {
                  const updatedContacts = formData.emergencyContacts.filter((_, i) => i !== index);
                  setFormData({ ...formData, emergencyContacts: updatedContacts });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={contact.name}
                  onChange={(e) => {
                    const updatedContacts = [...formData.emergencyContacts];
                    updatedContacts[index] = { ...contact, name: e.target.value };
                    setFormData({ ...formData, emergencyContacts: updatedContacts });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Relation"
                  value={contact.relation}
                  onChange={(e) => {
                    const updatedContacts = [...formData.emergencyContacts];
                    updatedContacts[index] = { ...contact, relation: e.target.value };
                    setFormData({ ...formData, emergencyContacts: updatedContacts });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={contact.mobile_no}
                  onChange={(e) => {
                    const updatedContacts = [...formData.emergencyContacts];
                    updatedContacts[index] = { ...contact, mobile_no: e.target.value };
                    setFormData({ ...formData, emergencyContacts: updatedContacts });
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderEducation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Education History</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              education: [...formData.education, {
                qualification: '',
                institution: '',
                major: '',
                completion_date: '',
                percentage: '',
                state: ''
              }]
            })}
            variant="contained"
            color="primary"
          >
            Add Education
          </Button>
        </Box>
        {formData.education.map((edu, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Education {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => {
                  const updatedEducation = formData.education.filter((_, i) => i !== index);
                  setFormData({ ...formData, education: updatedEducation });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Qualification</InputLabel>
                  <Select
                    value={edu.qualification}
                    label="Qualification"
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index] = { ...edu, qualification: e.target.value };
                      setFormData({ ...formData, education: updatedEducation });
                    }}
                  >
                    <MenuItem value="10th">10th</MenuItem>
                    <MenuItem value="12th">12th</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Graduate">Graduate</MenuItem>
                    <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                    <MenuItem value="PhD">PhD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, institution: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Major"
                  value={edu.major}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, major: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Completion Date"
                  value={edu.completion_date}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, completion_date: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Percentage"
                  value={edu.percentage}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, percentage: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={edu.state}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, state: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderWorkHistory = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Work History</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              workHistory: [...formData.workHistory, {
                is_in_group: 'N',
                organization: '',
                job_title: '',
                start_date: '',
                end_date: '',
                location: '',
                ctc: ''
              }]
            })}
            variant="contained"
            color="primary"
          >
            Add Work History
          </Button>
        </Box>
        {formData.workHistory.map((work, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Work History {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => {
                  const updatedWorkHistory = formData.workHistory.filter((_, i) => i !== index);
                  setFormData({ ...formData, workHistory: updatedWorkHistory });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Is In Group</InputLabel>
                  <Select
                    value={work.is_in_group}
                    label="Is In Group"
                    onChange={(e) => {
                      const updatedWorkHistory = [...formData.workHistory];
                      updatedWorkHistory[index] = { ...work, is_in_group: e.target.value };
                      setFormData({ ...formData, workHistory: updatedWorkHistory });
                    }}
                  >
                    <MenuItem value="Y">Yes</MenuItem>
                    <MenuItem value="N">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Organization"
                  value={work.organization}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, organization: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={work.job_title}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, job_title: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Start Date"
                  value={work.start_date}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, start_date: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={work.end_date}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, end_date: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  value={work.location}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, location: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="CTC"
                  value={work.ctc}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, ctc: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderLanguageSkills = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Language Skills</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              languageSkills: [...formData.languageSkills, {
                language: '',
                speak_level: '',
                read_level: '',
                write_level: ''
              }]
            })}
            variant="contained"
            color="primary"
          >
            Add Language
          </Button>
        </Box>
        {formData.languageSkills.map((skill, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Language {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => {
                  const updatedSkills = formData.languageSkills.filter((_, i) => i !== index);
                  setFormData({ ...formData, languageSkills: updatedSkills });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  label="Language"
                  value={skill.language}
                  onChange={(e) => {
                    const updatedSkills = [...formData.languageSkills];
                    updatedSkills[index] = { ...skill, language: e.target.value };
                    setFormData({ ...formData, languageSkills: updatedSkills });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth required>
                  <InputLabel>Speak Level</InputLabel>
                  <Select
                    value={skill.speak_level}
                    label="Speak Level"
                    onChange={(e) => {
                      const updatedSkills = [...formData.languageSkills];
                      updatedSkills[index] = { ...skill, speak_level: e.target.value };
                      setFormData({ ...formData, languageSkills: updatedSkills });
                    }}
                  >
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Fluent">Fluent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth required>
                  <InputLabel>Read Level</InputLabel>
                  <Select
                    value={skill.read_level}
                    label="Read Level"
                    onChange={(e) => {
                      const updatedSkills = [...formData.languageSkills];
                      updatedSkills[index] = { ...skill, read_level: e.target.value };
                      setFormData({ ...formData, languageSkills: updatedSkills });
                    }}
                  >
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Fluent">Fluent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth required>
                  <InputLabel>Write Level</InputLabel>
                  <Select
                    value={skill.write_level}
                    label="Write Level"
                    onChange={(e) => {
                      const updatedSkills = [...formData.languageSkills];
                      updatedSkills[index] = { ...skill, write_level: e.target.value };
                      setFormData({ ...formData, languageSkills: updatedSkills });
                    }}
                  >
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Fluent">Fluent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderAdditionalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Additional Information</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Hobbies"
          name="hobbies"
          value={formData.additionalInfo.hobbies}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: {
              ...formData.additionalInfo,
              hobbies: e.target.value
            }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Total Experience"
          name="total_experience"
          value={formData.additionalInfo.total_experience}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: {
              ...formData.additionalInfo,
              total_experience: e.target.value
            }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Last Promotion Date"
          name="last_promotion_date"
          value={formData.additionalInfo.last_promotion_date}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: {
              ...formData.additionalInfo,
              last_promotion_date: e.target.value
            }
          })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Performance Ratings"
          name="performance_ratings"
          value={formData.additionalInfo.performance_ratings}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: {
              ...formData.additionalInfo,
              performance_ratings: e.target.value
            }
          })}
          helperText="Enter in format: {'2023':'A', '2022':'B+', '2021':'A'}"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Special Abilities"
          name="special_abilities"
          value={formData.additionalInfo.special_abilities}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: {
              ...formData.additionalInfo,
              special_abilities: e.target.value
            }
          })}
        />
      </Grid>
    </Grid>
  );

  const renderPerformanceRating = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Performance Ratings</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Last Year Rating"
          name="last_year"
          value={formData.performanceRating.last_year}
          onChange={(e) => setFormData({
            ...formData,
            performanceRating: {
              ...formData.performanceRating,
              last_year: e.target.value
            }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Second Last Year Rating"
          name="second_last_year"
          value={formData.performanceRating.second_last_year}
          onChange={(e) => setFormData({
            ...formData,
            performanceRating: {
              ...formData.performanceRating,
              second_last_year: e.target.value
            }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Third Last Year Rating"
          name="third_last_year"
          value={formData.performanceRating.third_last_year}
          onChange={(e) => setFormData({
            ...formData,
            performanceRating: {
              ...formData.performanceRating,
              third_last_year: e.target.value
            }
          })}
        />
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderProfessionalDetails();
      case 2:
        return renderNomineeAndDependents();
      case 3:
        return renderFamilyInfo();
      case 4:
        return renderEmergencyContact();
      case 5:
        return renderEducation();
      case 6:
        return renderWorkHistory();
      case 7:
        return renderAdditionalInfo();
      case 8:
        return renderLanguageSkills();
      case 9:
        return renderPerformanceRating();
      default:
        return 'Unknown step';
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Employee Registration Form
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm; 