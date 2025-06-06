const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Oracle Database Configuration
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
  privilege: oracledb.SYSDBA
};

// Initialize connection pool
async function initializePool() {
  try {
    await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
      privilege: oracledb.SYSDBA,
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1
    });
    console.log('Connection pool created successfully');
  } catch (err) {
    console.error('Error creating connection pool:', err);
  }
}

// Test database connection
async function testConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Successfully connected to Oracle Database');
    await connection.close();
  } catch (err) {
    console.error('Error connecting to Oracle Database:', err);
  }
}

// Initialize DB pool and test connection
initializePool().then(() => {
  testConnection();
});

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.send('HR Application Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Accessible at: http://localhost:${port} or http://your-ip:${port}`);
  });
}

// Export app for testing
module.exports = app;
