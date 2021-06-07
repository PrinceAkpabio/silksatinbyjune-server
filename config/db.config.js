const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
});

// open the MySQL connection
connection.connect((error) => {
  if (error) {
    console.log("DB Connection Error", error);
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;
