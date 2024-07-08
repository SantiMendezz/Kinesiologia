const mysql = require('mysql2/promise');
const {DB_HOST,DB_USER,DB_PASS,DB_PORT,DB_NAME} = require('./config');

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  port: DB_PORT,
  database: DB_NAME
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0
});

module.exports = pool;