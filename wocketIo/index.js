
const express = require('express')
const http = require('http')
const socketIo = require('socket.io');
const {ER_CANNOT_LOG_PARTIAL_DROP_DATABASE_WITH_GTID} = require("mysql/lib/protocol/constants/errors");

let app = express()
let http_server = http.createServer(app)
// 在 HTTP 服务器上附加 Socket.IO
const io = socketIo(http_server, {
  path: '/socket', // 设置路径
  cors: {
    origin: '*', // 允许所有来源
    methods: ["GET", "POST"]
  }
});


/**
 *  所有用户
 */
let members = [];
/**
 *  监听连接
 */
io.on('connection', (socket) => {
  const { query } = socket.handshake
  // 获取socket连接参数 username和room
  const { username, room, id  } = query

  // 房间 人数满了 不再加入
  // if (members.length === 4) {
  //   return  socket.emit('message', '房间已满')
  // }

  // 连接管理
  let user = { socketId: socket.id, username , room , userId: id }
  // 用户管理
  members.push(user)
  // 房间管理
  socket.join(room)
  // 监听用户加入
  console.log(`用户 ${username} 进入房间 ${room},当前房间人数 ${members.length}`);
  // 每次连接向房间发送用户列表
  io.to(room).emit('userList', JSON.stringify(members.filter((m) => m.room === room)))


  // 断开连接
  socket.on('disconnect', () => {
    members = members.filter((m) => m.username !== user.username && m.room === user.room)
    // 断开连接发送用户列表
    io.to(room).emit('userList', JSON.stringify(members));
    socket.leave(room)
  })
  // 链接错误
  socket.on('error', (err) => {
    console.log(err);
  })
  // 接收消息
  socket.on('message', (msg) => {
    io.to(room).emit('message', msg)
  })

  // 接收到单人的消息
  socket.on('privateMessage', (msgs) => {
    const  msg = JSON.parse(msgs)

    // 获取发送消息的用户
    let user = members.find((m) => m.username === msg.from)




    // 获取接收消息的用户
    let toUser = members.find((m) => m.username === msg.to)
    let message = {
      from: user.username,
      to: toUser.username,
      msg: msg.msg
    }
    console.log(toUser.room)
    // 发送消息
    io.to(toUser.room).emit('privateMessage', JSON.stringify(message))
  })


  // 接收到《接收者》发送candidate连接成功消息，转发给《接收者》
  socket.on('candidate', (room, candidate) => {
    socket.to(room).emit('candidate', candidate)
  })
  // 接收到《发起者》发送offer，转发给《接收者》
  socket.on('offer', (room, offer) => {
    socket.to(room).emit('offer', offer)
  })
  // 接收到《接收者》发送answer，转发给《发起者》
  socket.on('answer', (room, answer) => {
    socket.to(room).emit('answer', answer)
  })

})



module.exports = http_server

