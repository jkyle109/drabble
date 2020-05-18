const { v4: uuidv4 } = require('uuid');

//Create User
const user = ({name = "", socketId= ""} = {}) => ({
    id: uuidv4(),
    name,
    socketId,
});


//Create Message
const message = ({message = "", sender = ""} = {}) => ({
    id: uuidv4(),
    message,
    sender,
    time: getTime()
});


//Create Chat
const chat = ({messages = [], name = "New Chat", users = []} = {}) => ({
    id: uuidv4(),
    name,
    messages,
    users,
    gameWord: "",
    visableWord: "",
    userQueue: [],
    inGame: false
});


function getTime(){
    const date = new Date(Date.now());
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}:${("0"+date.getSeconds()).slice(-2)}`;
}

module.exports = {
    user,
    message,
    chat
}