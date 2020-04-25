const express = require('express'),
      util = require('util'),
      app = express();

const Pool = require('./lib/pool'),
      Mydb = require('./lib/mydb');      

const pool = new Pool();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    //res.send("Hello NodeJS");
    res.render('index', {name: '홍길동'});
});

app.get('/test/:email', (req, res) => {
    //res.send("Hello NodeJS");
    res.render('index', {name: '홍길동'});
});

app.get('/dbtest/:user', (req, res) => {
  
  let user = req.params.user;
  let mydb = new Mydb(pool);
  util.log("eeeeeeeeee : ", user);
  mydb.execute( conn => {
    conn.query("select * from user where id = ?", [user], (err, ret) => {
      res.json(ret);
    });
  });

  //res.render('index', {name: '홍길동'});
});

const server = app.listen(7000, function() {
  util.log("Express's started on port 7000");
});

const io = require('socket.io').listen(server, {
  log: false,
  origins: '*:*',
  pingInterval: 3000,
  pingTimeout: 5000
});

io.sockets.on('connection', (socket, opt) => {
  socket.emit('message', {msg: 'Welcome ' + socket.id});

  util.log("connection>>", socket.id, socket.handshake.query);

  socket.on('join', function(roomId, fn) {
    socket.join(roomId, function() {
      util.log("Join", roomId, Object.keys(socket.rooms));
      if (fn)
        fn();
    });
  });

  socket.on('leave', function(roomId, fn) {
    socket.leave(roomId, function(){ 
        if (fn)
          fn();
    });    
  });

  socket.on('rooms', function(fn) {
    if (fn)
      fn(Object.keys(socket.rooms));
  });

  // data : {room: 'roomid, msg: 'msg' 내용}
  socket.on('message', (data, fn) => {
    util.log("message>>", data.msg, Object.keys(socket.rooms));

    if (fn) 
      fn(data.msg);

    if (data.room)
      socket.broadcast.to(data.room).emit('message', {room: data.roomId, msg: data.msg});
    
  });

  socket.on('disconnecting', function(data) {
    util.log("disconnecting>>", socket.id, Object.keys(socket.rooms));
  });

  socket.on('disconnect', function(data) {
    util.log("disconnect>>", socket.id, Object.keys(socket.rooms));
  });
});