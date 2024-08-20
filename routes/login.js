const express = require('express');
const route = express.Router()
const con = require('../connection/index')
const svgCaptcha = require('svg-captcha')
//登录
route.post('/login', (req, res, next) => {
    let {account, password} = req.body;
    console.log(account, "--", password)

    let sql = `select *  from user where account = ?;`
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
    let sql = `select * from ws where username = ? `
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
    //查询是否存在该用户
    let sql = `select * from user where account = ? `
    con(sql, [params.account]).then(result => {
        if(result.length !== 0){
            res.send({code: 400, msg: '该用户已存在', data: null})
        }else{
            //写入数据库
            let witerSql = `insert into user(account,name,pwd) values(?,?,?)`
            con(witerSql, [params.account,'用户',params.password]).then(result=>{
                res.send({code:200,msg:'注册成功',data:null})
            }).catch((err)=>{
                next(err)
            })
        }
    }).catch((err) => {
        next(err)
    })
})

//图形验证码
route.get('/code',(req,res,next)=>{
     // 下面这行代码是随机生成验证码图片和文本并返回给客户端 
  const img = svgCaptcha.create({ 
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    color: true, // 验证码是否有彩色
    noise: 1, //干扰线
    background: '#666', // 背景颜色
      width: 150, // 宽度
    height: 40, // 高度
  })
  res.send({code:200 , msg:"请求成功" , data:img});
})


module.exports = route