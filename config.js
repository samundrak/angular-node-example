var mysql = require('mysql');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'samundra',
    database: 'sparks'
});

connection.connect();
module.exports = function(query, cb) {;
    connection.query(query, cb);
}
