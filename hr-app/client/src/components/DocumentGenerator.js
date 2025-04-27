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
    InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const DocumentGenerator = () => {
    const [poornataId, setPoornataId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState(null);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError('');
            setEmployeeData(null);
            
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
                )}
            </Grid>
        </Box>
    );
};

export default DocumentGenerator; 