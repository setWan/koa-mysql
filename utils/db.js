const mysql = require("mysql");
const fs = require('fs')

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PSWD,
  database: process.env.SQL_DB,
  port: process.env.SQL_PORT,
});

function queryDB (sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject({ err })
      } else {
        conn.query(sql, function (qerr, rows, fields) {
          //释放连接  
          conn.release();
          //事件驱动回调  
          resolve({ qerr, rows, fields })
        });
      }
    });
  })
};

module.exports = {
  queryDB
}
