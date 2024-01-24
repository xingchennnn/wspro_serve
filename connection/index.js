const mysql = require('mysql')

// 创建连接配置
const dbConfig = {
  host: 'http://116.205.138.78',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'motion',
  multipleStatements: true, //允许多条命令运行
  connectionLimit: 15, // 最大连接数
};

// 创建连接池
const cp = mysql.createPool(dbConfig);


// 连接数据库
function connect(sql, rdata) {
  // console.log('进入数据库连接', rdata)
  return new Promise((resolve, reject) => {
    cp.getConnection((err, connection) => {
      if (err) {
        reject(err)
        return;
      }
      //请求数据
      connection.query(sql, rdata, (error, result) => {
        connection.release();  //释放链接
        if(error){
          reject(error)
          return;
        }
        resolve(result);
      })
    })
  })
}



// 在应用关闭时关闭连接池
process.on('exit', () => {
  console.log('断开连接')
  pool.end();
});

module.exports = connect


// 连接数据库
/*
function connect(pool, u, next, cb) {
  console.log('进入数据库连接池', u)
  cp.getConnection((err, connection) => {
    if (err) return next(err)
    //请求数据
    connection.query(pool, u, (err, result) => {
      connection.release();  //释放链接
      if (err) return next(err)  //连接池错误
      cb && cb(result) //成功回调
    })
  })
}
*/ //使用下面优化