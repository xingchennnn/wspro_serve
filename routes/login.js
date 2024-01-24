const express = require('express');
const route = express.Router()
const con = require('../connection/index')

route.get('/login',(req,res ,next)=>{
  let params = req.query
  sql = `select * from user where ?`
  con(sql,params)
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    next(err)
  })
})


module.exports = route