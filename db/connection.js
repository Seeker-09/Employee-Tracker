const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "2218",
        database: "work_force"
    },
    console.log("connected")
)

module.exports = db;