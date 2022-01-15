const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'local',
    database: 'central_prueba',
    port: 3600
});

mysqlConnection.connect((error) => {
    if(error){
        console.log(error);
    }else{
        console.log('DB is connected');
    }
});

module.exports = mysqlConnection;