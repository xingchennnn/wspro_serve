const express = require('express');
const route = express.Router()
const con = require('../connection/index')

route.get("/getRoomList" , (req , res , next)=>{
  let query = req.query
  let sql = `select room.* from room join r_user  on r_user.room_id = room.room_id  where r_user.user_id  = ?;`
  con(sql,[query.user_id]).then((data)=>{
    console.log(data)
    res.send({code:200 , data})
  }).catch((err)=>{
    next(err)
  })
})


route.post("/createRoom" , (req , res , next)=>{
  let query = req.body
  let columns = Object.keys(query).join(', ');
  let placeholders = Object.keys(query).map(() => '?').join(', ');
  let sql = `INSERT INTO room (${columns}) VALUES (${placeholders});`
  let values = Object.values(query);
  con(sql, values).then((data) => {
      if(data.affectedRows === 1){
        res.send({code:200 , msg:'创建成功'})
      }else {
        res.send({code:400 , msg:'创建失败'})
      }
  }).catch((err)=>{
    next(err)
  });
})







module.exports = route