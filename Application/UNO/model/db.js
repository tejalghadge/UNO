// Data base connection
var mysql = require('mysql');



var connection = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "team5",
    port:3306
  });

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...');

})


module.exports = connection;


