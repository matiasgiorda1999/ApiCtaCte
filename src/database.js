require('dotenv').config();
const mysql = require('mysql');

const mysqlConnection = mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
    port: process.env.PORT_DB,
});

module.exports = mysqlConnection;