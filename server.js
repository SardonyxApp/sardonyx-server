const app = require('./app');
const db = require('./db');

const http = require('http').Server(app);
const io = require('socket.io')(http);

db.connect(err => {
  if (err) {
    console.error('There was an error connecting to MySQL. ' + err);
    process.exit(1);
  }
  
  const listener = http.listen(process.env.PORT, (process.env.HOST || 'localhost'), () => {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});

io.on('connection', socket => {
  socket.emit('new', 'New user connected');
  socket.on('confirm', msg => console.log(msg));

  socket.on('join room', tasklist => {
    socket.join(tasklist);
  });
  socket.on('leave room', tasklist => {
    socket.leave(tasklist);
  });

  socket.on('tasks', tasklist => {
    socket.to(tasklist).emit('tasks');
  });
  socket.on('labels', (type, tasklist) => {
    socket.to(tasklist).emit('labels', type);
  });
});