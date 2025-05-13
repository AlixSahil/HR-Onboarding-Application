import React, { useState } from 'react';
import axios from 'axios';
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
  const [formData, setFormData] = useState({
    basicInfo: {
      joining_reference_id: '',
      employee_code: '',
      first_name: '',
      last_name: '',
      dob: '',
      mobile_no: '',
      official_email: '',
      personal_email: '',
      blood_group: '',
      gender: '',
      marital_status: '',
      religion: '',
      nationality: '',
      father_name: '',
      mother_name: '',
      current_address: '',
      permanent_address: '',
      aadhar_no: '',
      pan_no: '',
      bank_name: '',
      bank_account_no: '',
      ifsc_code: ''
    },
    professionalDetails: {
      date_of_joining: '',
      doj_group: '',
      department: '',
      new_position: '',
      designation: '',
      job_band: '',
      loi_issue_date: ''
    },
    gpaNominee: {
      name: '',
      relation: '',
      dob: '',
      age: ''
    },
    mediclaimDependents: [],
    nishchintNominee: {
      name: '',
      relation: '',
      dob: '',
      age: ''
    },
    spouse: {
      name: '',
      dob: '',
      occupation: '',
      marriage_anniversary: ''
    },
    familyMembers: [],
    emergencyContacts: [],
    education: [],
    workHistory: [],
    languageSkills: [],
    additionalInfo: {
      hobbies: '',
      total_experience: '',
      current_unit: '',
      last_jb_change_date: '',
      last_designation_change_date: '',
      dac_attended: 'N',
      dac_date: ''
    },
    performanceRating: {
      last_year: '',
      second_last_year: '',
      third_last_year: ''
    },
    providentFund: {
      uan_no: '',
      pf_no: '',
      eps_no: '',
      nominee_name: '',
      nominee_relation: '',
      nominee_share: ''
    },
    gratuityNominee: {
      name: '',
      relation: '',
      share: '',
      employee_age: '',
      confirmation_date: ''
    },
    superannuation: {
      name: '',
      relation: '',
      share: '',
      marriage_date: '',
      confirmation_date: ''
    }
  });

  const handleBasicInfoChange = (e) => {
    setFormData({
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleProfessionalDetailsChange = (e) => {
    setFormData({
      ...formData,
      professionalDetails: {
        ...formData.professionalDetails,
        [e.target.name]: e.target.value,
      },
    });
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
    if (!formData.basicInfo.first_name) errors.first_name = 'First name is required';
    if (!formData.basicInfo.last_name) errors.last_name = 'Last name is required';
    if (!formData.basicInfo.dob) errors.dob = 'Date of birth is required';
    if (!formData.basicInfo.mobile_no) errors.mobile_no = 'Mobile number is required';
    if (!formData.basicInfo.official_email) errors.official_email = 'Official email is required';
    if (!formData.basicInfo.gender) errors.gender = 'Gender is required';
    if (!formData.basicInfo.marital_status) errors.marital_status = 'Marital status is required';
    if (!formData.basicInfo.nationality) errors.nationality = 'Nationality is required';
    if (!formData.basicInfo.father_name) errors.father_name = 'Father\'s name is required';
    if (!formData.basicInfo.mother_name) errors.mother_name = 'Mother\'s name is required';
    if (!formData.basicInfo.current_address) errors.current_address = 'Current address is required';
    if (!formData.basicInfo.permanent_address) errors.permanent_address = 'Permanent address is required';
    if (!formData.basicInfo.aadhar_no) errors.aadhar_no = 'Aadhar number is required';
    if (!formData.basicInfo.pan_no) errors.pan_no = 'PAN number is required';
    
    console.log('Basic Info Validation Errors:', errors);
    return errors;
  };

  const validateProfessionalDetails = () => {
    const errors = {};
    if (!formData.professionalDetails.date_of_joining) errors.date_of_joining = 'Date of joining is required';
    if (!formData.professionalDetails.doj_group) errors.doj_group = 'DOJ group is required';
    if (!formData.professionalDetails.department) errors.department = 'Department is required';
    if (!formData.professionalDetails.designation) errors.designation = 'Designation is required';
    if (!formData.professionalDetails.job_band) errors.job_band = 'Job band is required';
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
        if (!edu.degree) errors[`education_${index}_degree`] = 'Degree is required';
        if (!edu.institution) errors[`education_${index}_institution`] = 'Institution is required';
        if (!edu.year_of_passing) errors[`education_${index}_year_of_passing`] = 'Year of passing is required';
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
    const allErrors = {};
    for (let i = 0; i < steps.length; i++) {
      const stepErrors = validateStep(i);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length === 0) {
      try {
        // Helper function to format date for Oracle
        const formatDateForOracle = (dateStr) => {
          if (!dateStr) return '';
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        };

        // Format the data according to server's expected structure
        const formattedData = {
          basicInfo: {
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            poornata_id: formData.basicInfo.employee_code || '',
            employee_code: formData.basicInfo.employee_code || '',
            prefix: '',
            first_name: formData.basicInfo.first_name || '',
            middle_name: '',
            last_name: formData.basicInfo.last_name || '',
            fathers_name: formData.basicInfo.father_name || '',
            mothers_name: formData.basicInfo.mother_name || '',
            dob: formatDateForOracle(formData.basicInfo.dob),
            gender: formData.basicInfo.gender || '',
            marital_status: formData.basicInfo.marital_status || '',
            blood_group: formData.basicInfo.blood_group || '',
            nationality: formData.basicInfo.nationality || '',
            birth_state: '',
            birth_location: '',
            religion: formData.basicInfo.religion || '',
            caste: '',
            permanent_address: formData.basicInfo.permanent_address || '',
            quarter_no: '',
            qualification: '',
            pan_no: formData.basicInfo.pan_no || '',
            aadhar_no: formData.basicInfo.aadhar_no || '',
            bank_name: formData.basicInfo.bank_name || '',
            bank_account_no: formData.basicInfo.bank_account_no || '',
            ifsc_code: formData.basicInfo.ifsc_code || '',
            mobile_no: formData.basicInfo.mobile_no || '',
            official_email: formData.basicInfo.official_email || '',
            personal_email: formData.basicInfo.personal_email || ''
          },
          professionalDetails: {
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            doj_unit: formatDateForOracle(formData.professionalDetails.date_of_joining),
            doj_group: formData.professionalDetails.doj_group || '',
            department: formData.professionalDetails.department || '',
            new_position: formData.professionalDetails.new_position || '',
            new_designation: formData.professionalDetails.designation || '',
            job_band: formData.professionalDetails.job_band || '',
            loi_issue_date: formatDateForOracle(formData.professionalDetails.loi_issue_date)
          },
          gpaNominee: {
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            name: formData.gpaNominee.name || '',
            relation: formData.gpaNominee.relation || '',
            dob: formatDateForOracle(formData.gpaNominee.dob),
            age: formData.gpaNominee.age || '',
            contribution_percent: '100'
          },
          mediclaimDependents: formData.mediclaimDependents.map(dep => ({
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            name: dep.name || '',
            gender: dep.gender || '',
            relation: dep.relation || '',
            dob: formatDateForOracle(dep.dob),
            age: dep.age || '',
            birth_state: dep.birth_state || '',
            address: dep.address || '',
            aadhar_no: dep.aadhar_no || '',
            marital_status: dep.marital_status || ''
          })),
          spouse: {
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            name: formData.spouse.name || '',
            dob: formatDateForOracle(formData.spouse.dob),
            occupation: formData.spouse.occupation || '',
            marriage_anniversary: formatDateForOracle(formData.spouse.marriage_anniversary),
            mobile_no: formData.spouse.mobile_no || ''
          },
          emergencyContacts: formData.emergencyContacts.map(contact => ({
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            name: contact.name || '',
            relation: contact.relation || '',
            mobile_no: contact.mobile_no || ''
          })),
          education: formData.education.map(edu => ({
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            lvl: edu.degree || '',
            institution: edu.institution || '',
            major: edu.specialization || '',
            degree: edu.degree || '',
            date_acquired: formatDateForOracle(edu.year_of_passing),
            percentage_grade: edu.percentage || '',
            state: ''
          })),
          workHistory: formData.workHistory.map(work => ({
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            is_in_group: 'N',
            organization_name: work.company_name || '',
            job_title: work.designation || '',
            from_date: formatDateForOracle(work.from_date),
            to_date: formatDateForOracle(work.to_date),
            state: '',
            ending_ctc: ''
          })),
          additionalInfo: {
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            hobbies: formData.additionalInfo.hobbies || '',
            total_experience: formData.additionalInfo.total_experience || '',
            current_unit: formData.additionalInfo.current_unit || '',
            last_jb_change_date: formatDateForOracle(formData.additionalInfo.last_jb_change_date),
            last_designation_change_date: formatDateForOracle(formData.additionalInfo.last_designation_change_date),
            dac_attended: formData.additionalInfo.dac_attended || 'N',
            dac_date: formatDateForOracle(formData.additionalInfo.dac_date)
          },
          performanceRating: {
            joining_reference_id: formData.basicInfo.joining_reference_id || '',
            last_year: formData.performanceRating.last_year || '',
            second_last_year: formData.performanceRating.second_last_year || '',
            third_last_year: formData.performanceRating.third_last_year || ''
          }
        };

        console.log('Submitting data:', formattedData);
        const response = await axios.post('http://localhost:5000/api/employees', formattedData);
        console.log('Employee created successfully:', response.data);
        
        // Show success message
        alert('Employee created successfully!');
        // Reset form and go back to first step
        setFormData({
          basicInfo: {
            joining_reference_id: '',
            employee_code: '',
            first_name: '',
            last_name: '',
            dob: '',
            mobile_no: '',
            official_email: '',
            personal_email: '',
            blood_group: '',
            gender: '',
            marital_status: '',
            religion: '',
            nationality: '',
            father_name: '',
            mother_name: '',
            current_address: '',
            permanent_address: '',
            aadhar_no: '',
            pan_no: '',
            bank_name: '',
            bank_account_no: '',
            ifsc_code: ''
          },
          professionalDetails: {
            date_of_joining: '',
            doj_group: '',
            department: '',
            new_position: '',
            designation: '',
            job_band: '',
            loi_issue_date: ''
          },
          gpaNominee: {
            name: '',
            relation: '',
            dob: '',
            age: ''
          },
          mediclaimDependents: [],
          nishchintNominee: {
            name: '',
            relation: '',
            dob: '',
            age: ''
          },
          spouse: {
            name: '',
            dob: '',
            occupation: '',
            marriage_anniversary: ''
          },
          familyMembers: [],
          emergencyContacts: [],
          education: [],
          workHistory: [],
          languageSkills: [],
          additionalInfo: {
            hobbies: '',
            total_experience: '',
            current_unit: '',
            last_jb_change_date: '',
            last_designation_change_date: '',
            dac_attended: 'N',
            dac_date: ''
          },
          performanceRating: {
            last_year: '',
            second_last_year: '',
            third_last_year: ''
          }
        });
        setActiveStep(0);
        setErrors({});
      } catch (error) {
        console.error('Error creating employee:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          alert(`Error: ${error.response.data.error || 'Failed to create employee'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('Error: No response from server. Please try again.');
        } else {
          console.error('Error setting up request:', error.message);
          alert('Error: Failed to submit form. Please try again.');
        }
      }
    } else {
      setErrors(allErrors);
      // Scroll to the first error
      const firstErrorField = document.querySelector('[error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      {/* Basic Identification */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Basic Identification</Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Joining Reference ID"
          name="joining_reference_id"
          value={formData.basicInfo.joining_reference_id || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.joining_reference_id}
          helperText={errors.joining_reference_id}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Employee Code"
          name="employee_code"
          value={formData.basicInfo.employee_code || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.employee_code}
          helperText={errors.employee_code}
        />
      </Grid>

      {/* Name */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Name</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="First Name"
          name="first_name"
          value={formData.basicInfo.first_name || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Last Name"
          name="last_name"
          value={formData.basicInfo.last_name || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.last_name}
          helperText={errors.last_name}
        />
      </Grid>

      {/* Personal Info */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Personal Info</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          type="date"
          label="Date of Birth"
          name="dob"
          value={formData.basicInfo.dob || ''}
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
            value={formData.basicInfo.gender || ''}
            onChange={handleBasicInfoChange}
            label="Gender"
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="O">Other</MenuItem>
          </Select>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth required error={!!errors.marital_status}>
          <InputLabel>Marital Status</InputLabel>
          <Select
            name="marital_status"
            value={formData.basicInfo.marital_status || ''}
            onChange={handleBasicInfoChange}
            label="Marital Status"
          >
            <MenuItem value="S">Single</MenuItem>
            <MenuItem value="M">Married</MenuItem>
            <MenuItem value="D">Divorced</MenuItem>
            <MenuItem value="W">Widowed</MenuItem>
          </Select>
          {errors.marital_status && <FormHelperText>{errors.marital_status}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Nationality"
          name="nationality"
          value={formData.basicInfo.nationality || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.nationality}
          helperText={errors.nationality}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Father's Name"
          name="father_name"
          value={formData.basicInfo.father_name || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.father_name}
          helperText={errors.father_name}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Mother's Name"
          name="mother_name"
          value={formData.basicInfo.mother_name || ''}
          onChange={handleBasicInfoChange}
          error={!!errors.mother_name}
          helperText={errors.mother_name}
        />
      </Grid>

      {/* Contact Details */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Contact Details</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Mobile Number"
          name="mobile_no"
          value={formData.basicInfo.mobile_no}
          onChange={handleBasicInfoChange}
          error={!!errors.mobile_no}
          helperText={errors.mobile_no}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Official Email"
          name="official_email"
          type="email"
          value={formData.basicInfo.official_email}
          onChange={handleBasicInfoChange}
          error={!!errors.official_email}
          helperText={errors.official_email}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Personal Email"
          name="personal_email"
          type="email"
          value={formData.basicInfo.personal_email}
          onChange={handleBasicInfoChange}
        />
      </Grid>

      {/* Address */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Address</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Current Address"
          name="current_address"
          multiline
          rows={3}
          value={formData.basicInfo.current_address}
          onChange={handleBasicInfoChange}
          error={!!errors.current_address}
          helperText={errors.current_address}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Permanent Address"
          name="permanent_address"
          multiline
          rows={3}
          value={formData.basicInfo.permanent_address}
          onChange={handleBasicInfoChange}
          error={!!errors.permanent_address}
          helperText={errors.permanent_address}
        />
      </Grid>

      {/* ID & Bank Details */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>ID & Bank Details</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Aadhar Number"
          name="aadhar_no"
          value={formData.basicInfo.aadhar_no}
          onChange={handleBasicInfoChange}
          error={!!errors.aadhar_no}
          helperText={errors.aadhar_no}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="PAN Number"
          name="pan_no"
          value={formData.basicInfo.pan_no}
          onChange={handleBasicInfoChange}
          error={!!errors.pan_no}
          helperText={errors.pan_no}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Bank Name"
          name="bank_name"
          value={formData.basicInfo.bank_name}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Bank Account Number"
          name="bank_account_no"
          value={formData.basicInfo.bank_account_no}
          onChange={handleBasicInfoChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="IFSC Code"
          name="ifsc_code"
          value={formData.basicInfo.ifsc_code}
          onChange={handleBasicInfoChange}
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
          label="Date of Joining"
          name="date_of_joining"
          value={formData.professionalDetails.date_of_joining}
          onChange={handleProfessionalDetailsChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.date_of_joining}
          helperText={errors.date_of_joining}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="DOJ Group"
          name="doj_group"
          value={formData.professionalDetails.doj_group}
          onChange={handleProfessionalDetailsChange}
          error={!!errors.doj_group}
          helperText={errors.doj_group}
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
          label="New Position"
          name="new_position"
          value={formData.professionalDetails.new_position}
          onChange={handleProfessionalDetailsChange}
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
          required
          label="Job Band"
          name="job_band"
          value={formData.professionalDetails.job_band}
          onChange={handleProfessionalDetailsChange}
          error={!!errors.job_band}
          helperText={errors.job_band}
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

  const renderEducationAndWorkHistory = () => (
    <Grid container spacing={3}>
      {/* Education History */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Education History</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              education: [...formData.education, {
                degree: '',
                institution: '',
                year_of_passing: '',
                percentage: '',
                specialization: ''
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, degree: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, institution: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year of Passing"
                  value={edu.year_of_passing}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, year_of_passing: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Percentage"
                  value={edu.percentage}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, percentage: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  value={edu.specialization}
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index] = { ...edu, specialization: e.target.value };
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>

      {/* Work History */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Work History</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setFormData({
              ...formData,
              workHistory: [...formData.workHistory, {
                company_name: '',
                designation: '',
                from_date: '',
                to_date: '',
                reason_for_leaving: ''
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={work.company_name}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, company_name: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={work.designation}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, designation: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  value={work.from_date}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, from_date: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  value={work.to_date}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, to_date: e.target.value };
                    setFormData({ ...formData, workHistory: updatedWorkHistory });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Reason for Leaving"
                  value={work.reason_for_leaving}
                  onChange={(e) => {
                    const updatedWorkHistory = [...formData.workHistory];
                    updatedWorkHistory[index] = { ...work, reason_for_leaving: e.target.value };
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

  const renderAdditionalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Additional Information</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Hobbies"
          value={formData.additionalInfo.hobbies}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: { ...formData.additionalInfo, hobbies: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Total Experience"
          value={formData.additionalInfo.total_experience}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: { ...formData.additionalInfo, total_experience: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current Unit"
          value={formData.additionalInfo.current_unit}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: { ...formData.additionalInfo, current_unit: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Last Job Band Change Date"
          value={formData.additionalInfo.last_jb_change_date}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: { ...formData.additionalInfo, last_jb_change_date: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Last Designation Change Date"
          value={formData.additionalInfo.last_designation_change_date}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: { ...formData.additionalInfo, last_designation_change_date: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>DAC Attended</InputLabel>
          <Select
            value={formData.additionalInfo.dac_attended}
            label="DAC Attended"
            onChange={(e) => setFormData({
              ...formData,
              additionalInfo: { ...formData.additionalInfo, dac_attended: e.target.value }
            })}
          >
            <MenuItem value="Y">Yes</MenuItem>
            <MenuItem value="N">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="DAC Date"
          value={formData.additionalInfo.dac_date}
          onChange={(e) => setFormData({
            ...formData,
            additionalInfo: { ...formData.additionalInfo, dac_date: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
        />
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
                <FormControl fullWidth>
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
                    <MenuItem value="Advanced">Advanced</MenuItem>
                    <MenuItem value="Native">Native</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
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
                    <MenuItem value="Advanced">Advanced</MenuItem>
                    <MenuItem value="Native">Native</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
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
                    <MenuItem value="Advanced">Advanced</MenuItem>
                    <MenuItem value="Native">Native</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );

  const renderPerformanceAndBenefits = () => (
    <Grid container spacing={3}>
      {/* Performance Rating */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Performance Rating</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Last Year"
          value={formData.performanceRating.last_year}
          onChange={(e) => setFormData({
            ...formData,
            performanceRating: { ...formData.performanceRating, last_year: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Second Last Year"
          value={formData.performanceRating.second_last_year}
          onChange={(e) => setFormData({
            ...formData,
            performanceRating: { ...formData.performanceRating, second_last_year: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Third Last Year"
          value={formData.performanceRating.third_last_year}
          onChange={(e) => setFormData({
            ...formData,
            performanceRating: { ...formData.performanceRating, third_last_year: e.target.value }
          })}
        />
      </Grid>

      {/* PF Details */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Provident Fund Details</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="UAN No"
          value={formData.providentFund.uan_no}
          onChange={(e) => setFormData({
            ...formData,
            providentFund: { ...formData.providentFund, uan_no: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="PF No"
          value={formData.providentFund.pf_no}
          onChange={(e) => setFormData({
            ...formData,
            providentFund: { ...formData.providentFund, pf_no: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="EPS No"
          value={formData.providentFund.eps_no}
          onChange={(e) => setFormData({
            ...formData,
            providentFund: { ...formData.providentFund, eps_no: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Name"
          value={formData.providentFund.nominee_name}
          onChange={(e) => setFormData({
            ...formData,
            providentFund: { ...formData.providentFund, nominee_name: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Relation"
          value={formData.providentFund.nominee_relation}
          onChange={(e) => setFormData({
            ...formData,
            providentFund: { ...formData.providentFund, nominee_relation: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Share %"
          value={formData.providentFund.nominee_share}
          onChange={(e) => setFormData({
            ...formData,
            providentFund: { ...formData.providentFund, nominee_share: e.target.value }
          })}
        />
      </Grid>

      {/* Gratuity Nominee */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Gratuity Nominee</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Name"
          value={formData.gratuityNominee.name}
          onChange={(e) => setFormData({
            ...formData,
            gratuityNominee: { ...formData.gratuityNominee, name: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Relation"
          value={formData.gratuityNominee.relation}
          onChange={(e) => setFormData({
            ...formData,
            gratuityNominee: { ...formData.gratuityNominee, relation: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Share %"
          value={formData.gratuityNominee.share}
          onChange={(e) => setFormData({
            ...formData,
            gratuityNominee: { ...formData.gratuityNominee, share: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Employee Age"
          value={formData.gratuityNominee.employee_age}
          onChange={(e) => setFormData({
            ...formData,
            gratuityNominee: { ...formData.gratuityNominee, employee_age: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Confirmation Date"
          value={formData.gratuityNominee.confirmation_date}
          onChange={(e) => setFormData({
            ...formData,
            gratuityNominee: { ...formData.gratuityNominee, confirmation_date: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* Superannuation */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Superannuation</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Name"
          value={formData.superannuation.name}
          onChange={(e) => setFormData({
            ...formData,
            superannuation: { ...formData.superannuation, name: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Nominee Relation"
          value={formData.superannuation.relation}
          onChange={(e) => setFormData({
            ...formData,
            superannuation: { ...formData.superannuation, relation: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Share %"
          value={formData.superannuation.share}
          onChange={(e) => setFormData({
            ...formData,
            superannuation: { ...formData.superannuation, share: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Marriage Date"
          value={formData.superannuation.marriage_date}
          onChange={(e) => setFormData({
            ...formData,
            superannuation: { ...formData.superannuation, marriage_date: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Confirmation Date"
          value={formData.superannuation.confirmation_date}
          onChange={(e) => setFormData({
            ...formData,
            superannuation: { ...formData.superannuation, confirmation_date: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
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
        return renderEducationAndWorkHistory();
      case 6:
        return renderLanguageSkills();
      case 7:
        return renderAdditionalInfo();
      case 8:
        return renderPerformanceAndBenefits();
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