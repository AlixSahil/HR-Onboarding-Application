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
  Stack,
} from '@mui/material';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

const HRDashboard = () => {
  const [poornataId, setPoornataId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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

  const handleGenerateDocument = async () => {
    if (!employee) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/employees/${poornataId}/generate-posh`,
        { responseType: 'blob' }
      );
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `POSH_Declaration_${poornataId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setMessage({ type: 'success', text: 'Document generated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error generating document. Please try again.',
      });
    } finally {
      setLoading(false);
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                fullWidth
              >
                Search
              </Button>
              {employee && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateDocument}
                  disabled={loading}
                  startIcon={<DownloadIcon />}
                >
                  {loading ? 'Generating...' : 'Generate Document'}
                </Button>
              )}
            </Stack>
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
              {Object.entries(employee).map(([key, value]) => {
                // Check if the value is a date field
                const isDateField = key.toLowerCase().includes('date') || 
                                  key.toLowerCase().includes('dob');
                
                return (
                  <TableRow key={key}>
                    <TableCell>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                    <TableCell>
                      {isDateField ? formatDate(value) : (value || 'N/A')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default HRDashboard; 