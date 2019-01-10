const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const rn_bridge = require('rn-bridge')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
  rn_bridge.channel.post('message', 'a user connected')
  socket.on('disconnect', function(){
    rn_bridge.channel.post('message', 'user disconnected')
  })
  socket.on('chat message', function(msg){
    rn_bridge.channel.post('message', 'message: ' + msg)
    io.emit('chat message', msg)
  });
})

http.listen(3000, function(){
  rn_bridge.channel.post('message', 'listening on *:3000')
})
