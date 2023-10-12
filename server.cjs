const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

io.on('connection', socket => {
    console.log(socket.id)
    socket.emit('chat-message', 'Hello World')
    socket.on('send-message', (message) => {
        // to everyone including sender
        // io.emit('receive-message', message)

        // to everyone except sender
        socket.broadcast.emit('receive-message', message)

        console.log(message)
    })
})