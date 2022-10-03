const mysql = require("mysql");

exports.db = mysql.createConnection({
    host: "eu-cdbr-west-03.cleardb.net",
    user: "ba0d59e62b737f",
    password: "bccb4163",
    database: "heroku_efcda53ee95023f"
});
