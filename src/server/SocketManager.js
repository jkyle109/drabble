const io = require('./index.js').io; 
const { USER_CONNECTED, USER_DISCONNECTED, VERIFY_USER, MESSAGE_SENT, MESSAGE_RECIEVED, LINEDRAWN, SCREENCLEAR, LOG, USER_CHANGE } = require('../Events.js');
//const { useCallback } = require('react');
const create = require('../Factories.js');


// Init User List
let userList = {};

// Init Chat List
let chatList = {};

// Server user
const server = create.user({name: "server"});

//
let GlobalChat = create.chat({name: "Global-Chat"})
chatList["Global-Chat"] = GlobalChat;

// Where server listens for events and emits changes based on those events.
module.exports = function(socket){
    console.log("Socket id: " + socket.id);



    // If a Verify_User is heard
    socket.on(VERIFY_USER, (name, roomCode, callback) => {
        console.log("Verifying User:", name)
        // See is name is taken
        if(isUser(name, userList)){
            callback({isUser: true, user: null});
            console.log("Username taken.")
        }
        else{
            const user = create.user({name});
            callback({isUser: false, user, roomCode});
        }
    });



    // Add new users
    socket.on(USER_CONNECTED, (user, roomCode) => {
        userList = addUser(user, userList);

        socket.join(roomCode);
        if(!(roomCode in chatList)){
            const chat = create.chat({name: roomCode})
            chatList[roomCode] = chat;
        }
        chatList[roomCode].users = addUser(user, chatList[roomCode].users);

        io.emit(USER_CHANGE, chatList[roomCode].users)


        //GlobalChat.users = addUser(user, GlobalChat.users);

        // Chat User Connect Message
        let message = user.name + " has joined!"
        sendMessage(message, server, roomCode)
        
        console.log("User connected: ", user, "\nCurrent user list: ", GlobalChat);
    });



    // Disconnect users
    socket.on(USER_DISCONNECTED, (user, roomCode) => {
        userList = removeUser(user, userList);
        // Todo: Make sure you don't regret this
        chatList[roomCode].users = removeUser(user, chatList[roomCode].users);

        io.emit(USER_CHANGE, chatList[roomCode].users)
        
        // Chat User Disconnet Message
        let message = user.name + " has left!"
        sendMessage(message, server, roomCode)

        console.log("User disconnected: ", user, "\nCurrent user list: ", GlobalChat);
    });



    // 
    socket.on(MESSAGE_SENT, (message, sender, roomCode) => {
        sendMessage(message, sender, roomCode)
    });



    // Canvas Events
    socket.on(LINEDRAWN, (ratio, roomCode) => {
        io.to(roomCode).emit(LINEDRAWN, ratio);
    });



    //
    socket.on(SCREENCLEAR, (user, roomCode) => {
        io.to(roomCode).emit(SCREENCLEAR)
        let message = user.name + " has cleared the screen!"
        sendMessage(message, server, roomCode)
    })



    //
    socket.on(LOG, (message) => {
        console.log(message)
    })
}


/**
 * Adds a user to a user list
 * @param {*} user 
 * @param {*} list 
 */
function addUser(user, list){
    // Clone List
    const newList = Object.assign({}, list);

    // Add new user
    newList[user.name] = user;

    // Return new list
    return newList;
}

/**
 * Removes a user from a user list
 * @param {*} user 
 * @param {*} list 
 */
function removeUser(user, list){
    // Clone List
    const newList = Object.assign({}, list);

    // Remove user
    delete newList[user.name];

    // Return new list
    return newList;
}

/**
 * Return if user name is in a user list
 * @param {*} name 
 * @param {*} userList 
 */
function isUser(name, userList){
    return name in userList || name === "server";
}

function sendMessage(message, sender, roomCode){
    message = create.message({message, sender});
    chatList[roomCode].messages.push(message);
    //GlobalChat.messages.push(message);
    io.to(roomCode).emit(MESSAGE_RECIEVED, (message));
}
