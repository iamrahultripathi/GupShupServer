const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const cors = require('cors');

const morgan = require('morgan');
dotenv.config({
  path: './config.env',
});
const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection Success!');
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(cors());
const roomRoute = require('./roomRoutes');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', roomRoute);

const server = http.Server(app);

const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  let roomid;
  let userName;
  socket.on('create', ({ room, name }) => {
    socket.join(room);
    roomid = room;
    userName = name;
    socket.broadcast.to(room).emit('user-joined', name);
  });
  socket.on('toServer', ({ room, name, message }) => {
    socket.broadcast.to(room).emit('toClient', { name, message });
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
    socket.broadcast.to(roomid).emit('user-left', userName);
  });
  socket.on('force-disconnect', () => {
    socket.disconnect();
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server Litsen on Port ${PORT}`);
});
