const { instrument } = require('@socket.io/admin-ui')
const httpServer = require("http").createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: ['https://admin.socket.io', 'http://localhost:5173']
    }
})

// ========= all from here only on this middleware ================================
// create namespace + userSocket in script.js
const userIo = io.of('/user')
userIo.on('connection', socket => {
    console.log('connected to user namespace with username ' + socket.username)
})

// setting middleware + {auth: {token:'Test'}} in userSocket in script.js
userIo.use((socket, next) => {
    if (socket.handshake.auth.token) {
        socket.username = getUsernameFromToken(socket.handshake.auth.token)
        next()
    } else {
        next(new Error('Please send token'))
    }
})

// here some authentication stuff in the future
function getUsernameFromToken(token) {
    return token
}

// ======================== end ====================================================

io.on('connection', socket => {
    console.log(socket.id)
    socket.emit('chat-message', 'Hello World')
    socket.on('send-message', (message, room) => {
        if (room === '') {
            // to everyone including sender
            // io.emit('receive-message', message)

            // to everyone except sender
            socket.broadcast.emit('receive-message', message)
        } else {
            // to users in the room except sender | or to specific user if we write receiver-id in room field
            socket.to(room).emit('receive-message', message)
        }

        console.log(message)
    })
    socket.on('join-room', (room, callback) => {
        socket.join(room)
        callback(`Joined ${room}`)
    })
})

instrument(io, { auth: false })

httpServer.listen(3000)