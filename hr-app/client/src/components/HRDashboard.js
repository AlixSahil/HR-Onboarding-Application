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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

const HRDashboard = () => {
  const [poornataId, setPoornataId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const availableDocuments = [
    { id: 'posh', name: 'POSH Declaration', filename: '29. ABMC728-POSH.docx' },
    { id: 'nischint', name: 'Nischint Form (Officer and Above)', filename: '2. Nischint Form_Officer and Above.docx' }
  ];

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
      setSelectedDocuments([]);
    } catch (error) {
      setEmployee(null);
      setMessage({
        type: 'error',
        text: 'Employee not found. Please check the Poornata ID.',
      });
    }
  };

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleGenerateDocument = async () => {
    if (selectedDocuments.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select at least one document to generate.',
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Process each selected document
      for (const docId of selectedDocuments) {
        const doc = availableDocuments.find(d => d.id === docId);
        if (!doc) continue;

        const response = await axios.post(
          'http://localhost:5000/api/documents/generate',
          {
            poornataId,
            documentIds: [docId] // Send only one document at a time
          },
          { 
            responseType: 'blob',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${doc.name}.docx`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        link.remove();
      }
      
      setMessage({ type: 'success', text: 'Documents generated successfully!' });
    } catch (error) {
      console.error('Document generation error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error generating documents. Please try again.',
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
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
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

          {/* Document Selection Section */}
          <Card>
            <CardHeader 
              title="Select Documents to Generate"
              subheader="Choose the documents you want to download"
            />
            <CardContent>
              <List>
                {availableDocuments.map((doc) => (
                  <React.Fragment key={doc.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleDocumentSelect(doc.id)}
                        />
                      </ListItemIcon>
                      <ListItemText primary={doc.name} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateDocument}
                  disabled={loading || selectedDocuments.length === 0}
                  startIcon={<DownloadIcon />}
                >
                  {loading ? 'Generating...' : 'Download Selected Documents'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Paper>
  );
};

export default HRDashboard; 