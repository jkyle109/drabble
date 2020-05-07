//const appServer = require('http').createServer();
const express = require('express')
const app = express()
const appServer = require('http').createServer();
const io = module.exports.io = require('socket.io')(appServer);

const PORT = process.env.PORT || 3001;

const SocketManager = require('./SocketManager');

app.use(express.static(__dirname + '/../../build'))

io.on("connect", SocketManager)

appServer.listen(PORT, () => {
    console.log("Listening to Port: " + PORT);
})