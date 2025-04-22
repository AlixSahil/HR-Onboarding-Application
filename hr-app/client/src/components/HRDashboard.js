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
              {Object.entries(employee).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                  <TableCell>{value || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default HRDashboard; 