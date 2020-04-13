const app = require('http').createServer();
const io = module.exports.io = require('socket.io')(app);

const PORT = process.env.PORT || 3001;

const SocketManager = require('./SocketManager');

io.on("connect", SocketManager)

app.listen(PORT, () => {
    console.log("Listening to Port: " + PORT);
})