const io = require('./index.js').io; 
const { USER_CONNECTED, USER_DISCONNECTED, VERIFY_USER, MESSAGE_SENT, MESSAGE_RECIEVED, LINEDRAWN, SCREENCLEAR, LOG, USER_CHANGE, GAME_START, WORD_CHANGE, WORD_CHOSEN, ROUND_START, ROUND_END, GAME_END } = require('../Events.js');
//const { useCallback } = require('react');
const create = require('../Factories.js');
const wordList = require('../wordList.js')

// Round time
let roundTime = 2400000

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
        if(!validString(roomCode)){
            roomCode = "Global-Chat"
        }
        // See is name is taken
        if(isUser(name, userList) || !validString(name)){
            callback({isUser: true, user: null});
            console.log("Username taken.")
        }
        else{
            const user = create.user({name: name, socketId: socket.id});
            callback({isUser: false, user, roomCode});
        }
    });



    // Add new users
    socket.on(USER_CONNECTED, (user, roomCode) => {
        let mirror = "  " + roomCode
        userList = addUser(user, userList);
        
        // Main room
        socket.join(roomCode);
        if(!(roomCode in chatList)){
            const chat = create.chat({name: roomCode})
            chatList[roomCode] = chat;
        }

        // Mirror Room
        if(!(mirror in chatList)){
            const chat = create.chat({name: mirror})
            chatList[mirror] = chat;
        }


        chatList[roomCode].users = addUser(user, chatList[roomCode].users);

        io.to(roomCode).emit(USER_CHANGE, chatList[roomCode].users)

        // If in game 
        if(chatList[roomCode].inGame){
            chatList[roomCode].userQueue.push({user: user, guessed: true})
            io.to(user.socketId).emit(GAME_START)
            socket.join(mirror)
        }

        // Chat User Connect Message
        let message = user.name + " has joined!"
        sendMessage(message, server, roomCode)
    });



    // Disconnect users
    socket.on(USER_DISCONNECTED, (user, roomCode) => {
        userList = removeUser(user, userList);
        // Todo: Make sure you don't regret this
        chatList[roomCode].users = removeUser(user, chatList[roomCode].users);

        io.to(roomCode).emit(USER_CHANGE, chatList[roomCode].users)
        
        // If in game
        if(chatList[roomCode].inGame){
            let newQueue = []
            for(let position of chatList[roomCode].userQueue){
                if(!(position.user.name === user.name)){
                    newQueue.push(position)
                }
            }
            chatList[roomCode].userQueue = newQueue

            if(allGuessed(chatList[roomCode].userQueue)){
                gameReset(roomCode)
            }
        }

        // Chat User Disconnet Message
        let message = user.name + " has left!"
        sendMessage(message, server, roomCode)

        //console.log("User disconnected: ", user, "\nCurrent user list: ", GlobalChat);
    });



    // 
    socket.on(MESSAGE_SENT, (message, sender, roomCode) => {
        // Moderation!

        // Game Stuff
        if(message === "/start"){
            if(chatList[roomCode].inGame){
                sendMessage("There is already a game in progress!",server, roomCode)
            } else {
                io.to(roomCode).emit(GAME_START)
                sendMessage("The Game Is Starting!", server, roomCode)
                startRound(roomCode)
            }
            
        }else if(message === "/end"){
            if(!chatList[roomCode].inGame){
                sendMessage("There is no game in progress!", server, roomCode)
            } else {
                io.to(roomCode).emit(ROUND_END)
                io.to(roomCode).emit(GAME_END)
                endGame(roomCode)
                sendMessage("Game Is Ending!", server, roomCode)
            }
        } else if(chatList[roomCode].gameWord.toUpperCase() === message.toUpperCase()){
            setGuessed(sender.name, chatList[roomCode].userQueue, roomCode)
            socket.join("  " + roomCode)
            
            if(allGuessed(chatList[roomCode].userQueue)){
                gameReset(roomCode)
            }
        }else if(chatList[roomCode].inGame && hasGuessed(sender, roomCode)){
            sendMessage(message, sender, "  " + roomCode)
        } else {
            sendMessage(message, sender, roomCode)
        }
    });


    // User Selects the next word
    socket.on(WORD_CHOSEN, (word,roomCode) => {
        console.log(WORD_CHOSEN)
        chatList[roomCode].gameWord = word
        chatList[roomCode].visableWord = getSkele(word)
        let delay = (roundTime * 1.5) / lettersLeft(chatList[roomCode].visableWord)
        console.log(delay)
        io.to(roomCode).emit(WORD_CHOSEN, chatList[roomCode].visableWord, roundTime, delay, roomCode)
        // Timer Start
        // Repeat until everyone guessed it or timmer runs out
    })

    // On word change
    socket.on(WORD_CHANGE, (roomCode) => {
        console.log(WORD_CHANGE)
        updateSkele(roomCode)
        console.log(chatList[roomCode].visableWord)
        io.to(roomCode).emit(WORD_CHANGE, chatList[roomCode].visableWord)
    })

    socket.on(ROUND_END, (roomCode) => {
        console.log(ROUND_END)
        gameReset(roomCode)
    })

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
    console.log(sender.name + " sent a message to room: " + roomCode)
    io.emit(LOG, io.sockets.adapter.rooms)
}

function validString(string){
    
    if(string.includes("  ") || string === "" || string[0] === " "){
        return false
    }

    return true
}

function randomNumber(max){
    return Math.floor(Math.random() * max)
}

function generateOptions(){
    return [wordList[randomNumber(wordList.length)], wordList[randomNumber(wordList.length)], wordList[randomNumber(wordList.length)]]
}

function getSkele(word){
    let skele = ""
    let count = 0
    for(let i=0;  i<word.length; i++){
        if(word[i] !== " "){
            skele = skele + "_"
            count = count + 1
        } else {
            skele = skele + " "
        }
    }
    return skele
}

function updateSkele(roomCode){
    let count = 0
    let skele = chatList[roomCode].visableWord
    let word = chatList[roomCode].gameWord
    let newLetterIndex = randomNumber(lettersLeft(skele))
    let result = ""
    for(let i=0; i<word.length; i++){
        if(skele[i] === "_"){
            console.log(count, newLetterIndex)
            if(count === newLetterIndex){
                result = result + word[i]
            } else {
                result = result + skele[i] 
            }
            count = count + 1
        } else {
            result = result + skele[i] 
        }
    }
    chatList[roomCode].visableWord = result
}

function lettersLeft(skele){
    let count = 0
    for(let letter of skele){
        if(letter === "_"){
            count = count + 1
        }
    }
    return count
}

function initQueue(object){
    let queue = []
    let keys = Object.keys(object)
    for(let username of keys){
        let position = {
            user: object[username],
            guessed: false
        }
        queue.push(position)
    }
    return queue
}

function allGuessed(queue){
    for(let position of queue){
        if(!position.guessed){
            return false
        }
    }
    return true
}

function setGuessed(username, queue, roomCode){
    for(let position of queue){
        if(position.user.name === username && !position.guessed){
            position.guessed = true
            sendMessage(username + " guessed the word!", server, roomCode)
        }
    }
}

async function gameReset(roomCode){
    for(let position of chatList[roomCode].userQueue){
        let user = position.user
        let sockets = io.sockets.connected
        let socket = sockets[user.socketId]
        let test  = "  " + roomCode
        await socket.leave(test, console.log(user.name + " has left the mirror: " + roomCode))
    }
    chatList[roomCode].gameWord = ""
    chatList[roomCode].visableWord = ""
    io.to(roomCode).emit(ROUND_END)
    startRound(roomCode)

    // chatList[roomCode].userQueue = []
    // chatList[roomCode].inGame = false
}

function hasGuessed(sender, roomCode){
    for(let position of chatList[roomCode].userQueue){
        if(position.user.name === sender.name){
            return position.guessed
        }
    }
    return false
}

async function startRound(roomCode){
    if(!chatList[roomCode].inGame){
        chatList[roomCode].inGame = true
        chatList[roomCode].userQueue = initQueue(chatList[roomCode].users)
    }

    for(let position of chatList[roomCode].userQueue){
        position.guessed = false
    }

    const nextPlayer = chatList[roomCode].userQueue.shift()
    nextPlayer.guessed = true
    chatList[roomCode].userQueue.push(nextPlayer)

    let socket = io.sockets.connected[nextPlayer.user.socketId]
    let test = "  " + roomCode
    await socket.join(test, console.log(nextPlayer.user.name + " has joined room: " + test))
    

    io.to(nextPlayer.user.socketId).emit(ROUND_START, generateOptions(), nextPlayer.user)
    sendMessage("It's " + nextPlayer.user.name + "'s Turn!", server, roomCode)
}

function endGame(roomCode){
    chatList[roomCode].gameWord = ""
    chatList[roomCode].visableWord = ""
    chatList[roomCode].userQueue = []
    chatList[roomCode].inGame = false
}