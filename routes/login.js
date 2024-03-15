const express = require('express');
const route = express.Router()
const con = require('../connection/index')

route.get('/', (req, res, next) => {
    let params = req.query
    let sql = `select *
               from tb_user; `
    con(sql, params)
        .then((result) => {
            res.send({code: 200, msg: '成功', data: result})
        })
        .catch((err) => {
            next(err)
        })
})

route.get('/signup', (req, res, next) => {
    let params = req.query.username
    let sql = `select *
               from tb_user
               where username = ? `
    con(sql, [params]).then(result => {
        let is
        if (result.length > 0) {
            is = false
        } else {
            is = true
        }
        res.send({code: 200, msg: '成功', data: is})
    }).catch((err) => {
        next(err)
    })
})


module.exports = route