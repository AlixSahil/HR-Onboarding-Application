import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import axios from 'axios';

const HRDashboard = () => {
  const [poornataId, setPoornataId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${poornataId}`);
      setEmployee(response.data);
      setMessage({ type: 'success', text: 'Employee found!' });
    } catch (error) {
      setEmployee(null);
      setMessage({
        type: 'error',
        text: 'Employee not found. Please check the Poornata ID.',
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        HR Dashboard
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Enter Poornata ID"
              value={poornataId}
              onChange={(e) => setPoornataId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {employee && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>{employee.EMPLOYEE_NAME}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Poornata ID</TableCell>
                <TableCell>{employee.POORNATA_ID}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>{employee.DATE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date of Birth</TableCell>
                <TableCell>{employee.DATE_OF_BIRTH}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>{employee.ROLE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Designation/Title</TableCell>
                <TableCell>{employee.DESIGNATION}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Department</TableCell>
                <TableCell>{employee.DEPARTMENT}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>{employee.LOCATION}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee</TableCell>
                <TableCell>{employee.NOMINEE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Relation with Applicant</TableCell>
                <TableCell>{employee.RELATION_WITH_APPLICANT}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Age of Nominee</TableCell>
                <TableCell>{employee.AGE_OF_NOMINEE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Employee Code/EC</TableCell>
                <TableCell>{employee.EMPLOYEE_CODE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>{employee.TITLE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Joining Date</TableCell>
                <TableCell>{employee.JOINING_DATE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Job Band</TableCell>
                <TableCell>{employee.JOB_BAND}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contact No</TableCell>
                <TableCell>{employee.CONTACT_NO}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell>{employee.GENDER}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Marital Status</TableCell>
                <TableCell>{employee.MARITAL_STATUS}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Blood Group</TableCell>
                <TableCell>{employee.BLOOD_GROUP}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h6" gutterBottom>
                    Dependent Information
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent Name</TableCell>
                <TableCell>{employee.DEPENDENT_NAME}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent DOB</TableCell>
                <TableCell>{employee.DEPENDENT_DOB}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent Gender</TableCell>
                <TableCell>{employee.DEPENDENT_GENDER}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent Age</TableCell>
                <TableCell>{employee.DEPENDENT_AGE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent Contact</TableCell>
                <TableCell>{employee.DEPENDENT_CONTACT}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent Relation</TableCell>
                <TableCell>{employee.DEPENDENT_RELATION}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dependent Marital Status</TableCell>
                <TableCell>{employee.DEPENDENT_MARITAL_STATUS}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mail ID</TableCell>
                <TableCell>{employee.MAIL_ID}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Basic Salary</TableCell>
                <TableCell>{employee.MONTHLY_BASIC_SALARY}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Special Allowance</TableCell>
                <TableCell>{employee.MONTHLY_SPECIAL_ALLOWANCE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>% of Contribution</TableCell>
                <TableCell>{employee.CONTRIBUTION_PERCENTAGE}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>{employee.CATEGORY}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Aadhar No</TableCell>
                <TableCell>{employee.AADHAR_NO}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PAN No</TableCell>
                <TableCell>{employee.PAN_NO}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bank A/C No</TableCell>
                <TableCell>{employee.BANK_ACCOUNT_NO}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default HRDashboard; 