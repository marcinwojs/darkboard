import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser'

const SERVER_PORT = 3002

const app = express()
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json())
let io

function startServer() {
  const server = http.createServer(app)

  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 10000,
  })

  io.on('connection', (socket) => {
    socket.on('join-room', (roomID) => {
      try {
        socket.join(roomID)
      } catch (e) {
        console.log('join error')
      }
    })

    socket.on('server-change', (elements, roomId, userId) => {
      socket.in(roomId).emit('client-change', elements)
    })
  })
  server.listen(SERVER_PORT, () => console.info(`Listening on port ${SERVER_PORT}.`))
}

export { io }
startServer()
