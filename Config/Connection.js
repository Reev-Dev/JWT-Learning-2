const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  waitForConnections: false,
  connectionLimit: 10,
  queueLimit: 0,
  database: 'bazma_jwt_auth_2'
});

module.exports = connection ;