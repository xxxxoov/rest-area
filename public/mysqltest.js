const util = require('util'),
      Promise = require('bluebird');

const Pool = require("../pool");

const sql1 = "select * from user";
const sql2 = "select * from user";

const pool = new Pool();

Promise.using( pool.connect(), conn => {
  conn.beginTransaction( txerr => {

    Promise.all([

      conn.queryAsync(sql1),
      conn.queryAsync(sql2)

    ]).then( r => {
      for (let i = 0; i < r.length; i++) 
        util.log('sql ${i+1}', r[i]);
      pool.end();
      
    }).catch( err => {
      conn.rollback();
      pool.end();
    });    

  });
    
});

// Promise.using( pool.connect(), conn => {
//   conn.queryAsync(sql1)
//       .then(util.log)
//       .catch( err => {
//         util.log("err>> ", err);
//       });

//   pool.end();
// });

// Promise.using( pool.connect(), conn => {
//   conn.queryAsync(sql1, (err, ret) => {
//     util.log("sql1= ", ret);
//   });

//   pool.end();
// });


