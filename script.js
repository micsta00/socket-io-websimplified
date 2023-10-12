const joinRoomButton = document.getElementById("room-button")
const messageInput = document.getElementById("message-input")
const roomInput = document.getElementById("room-input")
const form = document.getElementById("form")

const socket = io('http://localhost:3000')
// connecting to user namespace
const userSocket = io('http://localhost:3000/user', { auth: { token: 'Test' } })

// if no authentication passed
userSocket.on('connect_error', error => {
    displayMessage(error)
})

socket.on('chat-message', data => {
    console.log(data)
})


socket.on('connect', () => {
    displayMessage(`You connected with id: ${socket.id}`)
})

socket.on('receive-message', message => {
    displayMessage(message)
})

form.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value
    const room = roomInput.value

    if (message === "") return
    displayMessage(message)
    socket.emit('send-message', message, room)
    messageInput.value = ""
})

joinRoomButton.addEventListener("click", () => {
    const room = roomInput.value
    // message = callback function - return message from server if ok !!must by the last one!!
    socket.emit('join-room', room, message => {
        displayMessage(message)
    })
})

function displayMessage(message) {
    const div = document.createElement("div")
    div.textContent = message
    document.getElementById("message-container").append(div)
}
// ==== some test for checking what if disconnected  ========
let count = 0
// no volatile = as soon as connected, deliver all 'pings' gathered while disconnected
// setInterval(() => {
//     socket.emit('ping', ++count)
// }, 1000)

//volatile - if cant send 'ping' count but after connection dont send all gathered pings = dont gather it
setInterval(() => {
    socket.volatile.emit('ping', ++count)
}, 1000)

// ================= keyboard ===============================
document.addEventListener('keydown', e => {
    if (e.target.matches('input')) return

    if (e.key === "c") socket.connect()
    if (e.key === "d") socket.disconnect()

})