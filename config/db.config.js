const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  multipleStatements: true,
});

console.log("Connected sent");
module.exports = connection;
