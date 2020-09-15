const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'ccc',
});

const query = (sql, callback) => {
  pool.getConnection((error, connection) => {
    connection.query(sql, (err, rows) => {
      callback(err, rows);
      connection.release();
    });
  })
};

exports.query = query;
