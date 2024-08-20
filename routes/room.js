const express = require('express');
const route = express.Router()
const con = require('../connection/index')

route.get("/getRoomList" , (req , res , next)=>{
  let query = req.params.query
  console.log(query)
})







module.exports = route