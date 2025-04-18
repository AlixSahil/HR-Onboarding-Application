const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Initialize database connection
initializePool().then(() => {
  testConnection();
});

// Routes
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('HR Application Server is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 