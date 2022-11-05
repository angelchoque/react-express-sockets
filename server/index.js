import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from 'http'
import cors from 'cors'
import { PORT } from "./config.js";
import path from 'path'
import { fileURLToPath } from "url";

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  }
})

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../client/dist')))

io.on('connection', (socket) => {
  console.log(socket.id)

  socket.on('message', message => {
    console.log(message)
    socket.broadcast.emit('message', {
      body: message,
      from: socket.id.slice(8)
    })
  })
})

server.listen(PORT, () => {
  console.log("http://localhost:4000")
})