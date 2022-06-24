import http from 'http';
import app from "./app";
import { Server, Socket } from 'socket.io';
import { IList } from './types/todo';
import List from './models/list';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const DB_URI: string = process.env.DB_URI!;
const PORT: string | number = process.env.PORT! || 3001;

const server = http.createServer(app);

mongoose
  .connect(DB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(error => {
    throw error;
  });

const io = new Server(server,
  {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ["GET", "POST"]// dev
      // origin: ['https://mycoolreminders.netlify.app'], // prod
    }
  }
);

io.on('connection', (socket: Socket) => {
  console.log('connected');
  socket.on('getTodos', async (id, room) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const findedList = await List.findById(id);
    const list: IList = findedList!;

    if (room === '') {
      socket.broadcast.emit('newData', { list })
    } else {
      socket.to(room).emit('newData', { list })
    }
  });

  socket.on('join-room', (room, cb) => {
    socket.join(room);
    cb(`joined ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
});