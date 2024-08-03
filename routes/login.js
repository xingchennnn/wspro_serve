const express = require('express');
const route = express.Router()
const con = require('../connection/index')

//登录
route.post('/login', (req, res, next) => {
    let {account, password} = req.body;
    console.log(account, "--", password)

    let sql = `select *
               from user
               where account = ?;`
    con(sql, [account])
        .then((result) => {
            if (result.length === 0) return res.send({code: 400, msg: "没有该用户", data: null});
            let userInfo = result[0]
            setTimeout(() => {
                if (userInfo.pwd === password && userInfo.account === account) {
                    res.send({code: 200, msg: '成功', data: result})
                } else {
                    res.send({code: 400, msg: '账号或密码错误', data: null})
                }
            }, 1000)
        })
        .catch((err) => {
            next(err)
        })
})

//更新用户信息
route.post('/upDateById', (req, res, next) => {
    let params = req.body.username
    let sql = `select *
               from ws
               where username = ? `
    con(sql, [params]).then(result => {
        let is
        is = result.length === 0;
        res.send({code: 200, msg: '成功', data: is})
    }).catch((err) => {
        next(err)
    })
})

//注册
route.post('/register',(req,res,next)=>{
    let params = req.body
    console.log(params)
})


module.exports = route