import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Grid,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    InputAdornment,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon, Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';

const DocumentGenerator = () => {
    const [poornataId, setPoornataId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState(null);
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    const availableDocuments = [
        { id: 'posh', name: 'POSH Declaration', filename: '29. ABMC728-POSH.docx' },
        { id: 'nischint', name: 'Nischint Form (Officer and Above)', filename: '2. Nischint Form_Officer and Above.docx' }
    ];

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError('');
            setEmployeeData(null);
            setSelectedDocuments([]);
            
            const response = await axios.get(`http://localhost:5000/api/employees/${poornataId}`);
            setEmployeeData(response.data);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching employee details');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPoornataId('');
        setEmployeeData(null);
        setError('');
        setSelectedDocuments([]);
    };

    const handleDocumentSelect = (documentId) => {
        setSelectedDocuments(prev => 
            prev.includes(documentId)
                ? prev.filter(id => id !== documentId)
                : [...prev, documentId]
        );
    };

    const handleDownload = async () => {
        if (selectedDocuments.length === 0) {
            setError('Please select at least one document to download');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Create a zip file containing all selected documents
            const response = await axios.post('http://localhost:5000/api/documents/generate', {
                poornataId,
                documentIds: selectedDocuments
            }, {
                responseType: 'blob'
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `employee_documents_${poornataId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
        } catch (err) {
            setError(err.response?.data?.error || 'Error generating documents');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Header Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Employee Search Dashboard
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Enter Poornata ID to search for employee details
                        </Typography>
                    </Paper>
                </Grid>

                {/* Search Section */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Poornata ID"
                                    value={poornataId}
                                    onChange={(e) => setPoornataId(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSearch}
                                    disabled={loading || !poornataId}
                                    startIcon={<SearchIcon />}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleReset}
                                    startIcon={<RefreshIcon />}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Error Message */}
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}

                {/* Employee Details */}
                {employeeData && (
                    <>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader 
                                    title="Employee Details"
                                    subheader={`Poornata ID: ${employeeData.POORNATA_ID}`}
                                />
                                <CardContent>
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>Employee Name</strong></TableCell>
                                                    <TableCell>{employeeData.EMPLOYEE_NAME || 'N/A'}</TableCell>
                                                    <TableCell><strong>Designation</strong></TableCell>
                                                    <TableCell>{employeeData.DESIGNATION || 'N/A'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Department</strong></TableCell>
                                                    <TableCell>{employeeData.DEPARTMENT || 'N/A'}</TableCell>
                                                    <TableCell><strong>Joining Date</strong></TableCell>
                                                    <TableCell>{formatDate(employeeData.JOINING_DATE)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Contact Number</strong></TableCell>
                                                    <TableCell>{employeeData.CONTACT_NO || 'N/A'}</TableCell>
                                                    <TableCell><strong>Email</strong></TableCell>
                                                    <TableCell>{employeeData.MAIL_ID || 'N/A'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Gender</strong></TableCell>
                                                    <TableCell>{employeeData.GENDER || 'N/A'}</TableCell>
                                                    <TableCell><strong>Blood Group</strong></TableCell>
                                                    <TableCell>{employeeData.BLOOD_GROUP || 'N/A'}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Document Selection Section */}
                        <Grid item xs={12}>
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
                                            onClick={handleDownload}
                                            disabled={loading || selectedDocuments.length === 0}
                                            startIcon={<DownloadIcon />}
                                        >
                                            {loading ? 'Generating...' : 'Download Selected Documents'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
};

export default DocumentGenerator; 