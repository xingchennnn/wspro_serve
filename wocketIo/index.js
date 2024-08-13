
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

let app = express()
let http_server = http.createServer(app)
http_server.listen(3333)
let io = new Server(http_server, {
  // 允许跨域访问
  cors: {
    origin: '*',
  },
})
http_server.on('listening', () => {
  let addr = http_server.address()
  if (addr) {
    let port = typeof addr === 'string' ? addr : addr.port
  }
})


io.on('connection', (socket) => {
  const { query } = socket.handshake
  // 获取socket连接参数 username和room
  const { username, room } = query
  console.log(`用户 ${username} 进入房间 ${room}`);


  // 房间人数满了 不再加入
  if (members.length === 2) {
    return
  }
  // 连接管理
  let user = { userId: socket.id, username }
  members.push(user)
  // 房间管理
  socket.join(room)
  // 每次连接向房间发送用户列表
  io.to(room).emit('userList', members)


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


  socket.on('disconnect', () => {
    members = members.filter((m) => m.username !== user.username)
    // 断开连接发送用户列表
    io.to(room).emit('userList', members)
  })



})



