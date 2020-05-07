const io = require('./index.js').io; 
const { USER_CONNECTED, USER_DISCONNECTED, VERIFY_USER, LOGOUT, MESSAGE_SENT, MESSAGE_RECIEVED, } = require('../Events.js');
//const { useCallback } = require('react');
const create = require('../Factories.js');


// Init User List
let userList = {};

// Server user
const server = create.user({name: "server"});

//
let GlobalChat = create.chat({name: "Global-Chat"})

// Where server listens for events and emits changes based on those events.
module.exports = function(socket){
    console.log("Socket id: " + socket.id);

    // If a Verify_User is heard
    socket.on(VERIFY_USER, (name, callback) => {
        console.log("Verifying User:", name)
        // See is name is taken
        if(isUser(name, userList)){
            callback({isUser: true, user: null});
            console.log("Username taken.")
        }
        else{
            const user = create.user({name});
            callback({isUser: false, user});
        }
    });

    //Add new users
    socket.on(USER_CONNECTED, (user) => {
        userList = addUser(user, userList)
        //socket.user = user;
        GlobalChat.users = addUser(user, GlobalChat.users)
        //io.emit(USER_CONNECTED, (userList))

        let message = user.name + " has joined!"
        message = create.message({message , sender: server});
        GlobalChat.messages.push(message);
        io.emit(MESSAGE_RECIEVED, (message));
        console.log("User connected: ", user, "\nCurrent user list: ", userList, "\n", GlobalChat);
    });

    socket.on("disconnect", (user) => {
        if(user in socket){
            userList = removeUser(socket.user.name, userList);
            io.emit(USER_DISCONNECTED, (userList));
            console.log("User disconnected: ", user, "\nCurrent user list: ", userList);
        }
    });

    socket.on(LOGOUT, (user) => {
        userList = removeUser(socket.user.name, userList);
        io.emit(USER_DISCONNECTED, (userList));
        console.log("User disconnected: ", user, "\nCurrent user list: ", userList);
    });



    socket.on(MESSAGE_SENT, (message, sender) => {
        message = create.message({message, sender});
        GlobalChat.messages.push(message);
        io.emit(MESSAGE_RECIEVED, (message));
    });
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
