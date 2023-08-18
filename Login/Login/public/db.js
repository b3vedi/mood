const mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'CreativeSun',
	database: 'MHEALTHTRACK',
	password: 'Bhuvanesh@06'
});
module.exports = con;