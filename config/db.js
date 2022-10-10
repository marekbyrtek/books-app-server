const mysql = require("mysql");

const db = mysql.createPool({
    host: "MYSQL5044.site4now.net",
    user: "a8e0b3_append",
    password: "tUN058wlJv",
    database: "db_a8e0b3_append"
});

module.exports = db;
