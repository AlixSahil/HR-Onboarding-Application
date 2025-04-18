import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employee_name: '',
    poornata_id: '',
    date: new Date().toISOString().split('T')[0],
    signature: '',
    date_of_birth: '',
    role: '',
    designation: '',
    department: '',
    location: '',
    nominee: '',
    relation_with_applicant: '',
    age_of_nominee: '',
    employee_code: '',
    title: '',
    joining_date: '',
    job_band: '',
    contact_no: '',
    gender: '',
    marital_status: '',
    blood_group: '',
    dependent_name: '',
    dependent_dob: '',
    dependent_gender: '',
    dependent_age: '',
    dependent_contact: '',
    dependent_relation: '',
    dependent_marital_status: '',
    mail_id: '',
    monthly_basic_salary: '',
    monthly_special_allowance: '',
    contribution_percentage: '',
    category: '',
    aadhar_no: '',
    pan_no: '',
    bank_account_no: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/employees', formData);
      setMessage({ type: 'success', text: 'Employee details submitted successfully!' });
      // Reset form after successful submission
      setFormData({
        employee_name: '',
        poornata_id: '',
        date: new Date().toISOString().split('T')[0],
        signature: '',
        date_of_birth: '',
        role: '',
        designation: '',
        department: '',
        location: '',
        nominee: '',
        relation_with_applicant: '',
        age_of_nominee: '',
        employee_code: '',
        title: '',
        joining_date: '',
        job_band: '',
        contact_no: '',
        gender: '',
        marital_status: '',
        blood_group: '',
        dependent_name: '',
        dependent_dob: '',
        dependent_gender: '',
        dependent_age: '',
        dependent_contact: '',
        dependent_relation: '',
        dependent_marital_status: '',
        mail_id: '',
        monthly_basic_salary: '',
        monthly_special_allowance: '',
        contribution_percentage: '',
        category: '',
        aadhar_no: '',
        pan_no: '',
        bank_account_no: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error submitting employee details. Please try again.',
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New Employee Registration
      </Typography>
      
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Employee Name"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Poornata ID"
              name="poornata_id"
              value={formData.poornata_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Designation/Title"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location/Place"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nominee"
              name="nominee"
              value={formData.nominee}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Relation with Applicant"
              name="relation_with_applicant"
              value={formData.relation_with_applicant}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age of Nominee"
              name="age_of_nominee"
              type="number"
              value={formData.age_of_nominee}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee Code/EC"
              name="employee_code"
              value={formData.employee_code}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Joining Date"
              name="joining_date"
              type="date"
              value={formData.joining_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Band"
              name="job_band"
              value={formData.job_band}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact No."
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Marital Status</InputLabel>
              <Select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                label="Marital Status"
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Blood Group"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Dependent Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dependent Name"
              name="dependent_name"
              value={formData.dependent_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dependent DOB"
              name="dependent_dob"
              type="date"
              value={formData.dependent_dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Dependent Gender</InputLabel>
              <Select
                name="dependent_gender"
                value={formData.dependent_gender}
                onChange={handleChange}
                label="Dependent Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dependent Age"
              name="dependent_age"
              type="number"
              value={formData.dependent_age}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dependent Contact"
              name="dependent_contact"
              value={formData.dependent_contact}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dependent Relation"
              name="dependent_relation"
              value={formData.dependent_relation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Additional Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mail ID"
              name="mail_id"
              type="email"
              value={formData.mail_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Basic Salary"
              name="monthly_basic_salary"
              type="number"
              value={formData.monthly_basic_salary}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Special Allowance"
              name="monthly_special_allowance"
              type="number"
              value={formData.monthly_special_allowance}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="% of Contribution"
              name="contribution_percentage"
              type="number"
              value={formData.contribution_percentage}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Aadhar No"
              name="aadhar_no"
              value={formData.aadhar_no}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PAN No"
              name="pan_no"
              value={formData.pan_no}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank A/C No"
              name="bank_account_no"
              value={formData.bank_account_no}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EmployeeForm; 