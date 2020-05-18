import React, { Component } from 'react'
import io from 'socket.io-client'
import { USER_CONNECTED, USER_DISCONNECTED, USER_CHANGE, GAME_START, GAME_END, LOG } from '../Events.js'
import Login from "./Login.js"
import ChatContainer from './ChatContainer.js'
import NavBar from './NavBar.js';
import WhiteBoard from './WhiteBoard.js';
import GuessGame from './GuessGame.js';

const socketUrl = "/"
// const socketUrl = "http://192.168.0.11:3001"

class Layout extends Component {
    constructor(props){
        super(props);

        this.state = {
            socket: null,
            user: null,
            roomCode: null,
            roomList: [],
            gameMode: false,
        };
    }

    //Initialises socket
    componentDidMount() {
        this.initSocket()
        
        // Before tab close
        window.onbeforeunload = this.disconnect
    }

    //Create a socket connection with server
    initSocket = () => {
        const socket = io(socketUrl)
        
        socket.on("connect", () => {
            console.log("Connected")
        })
        this.setState({socket: socket})

        socket.on(USER_CHANGE, (roomList) => {
            this.setState({
                roomList: roomList
            })
        })

        socket.on(GAME_START, () => {
            this.setState({
                gameMode: true
            })
        });

        socket.on(GAME_END, () => {
            this.setState({
                gameMode: false
            })
        })

        socket.on(LOG, message => {
            console.log(message)
        })
    }


    disconnect = () => {
        const socket = this.state.socket;
        if(this.state.user !== null){
            socket.emit(USER_DISCONNECTED, this.state.user, this.state.roomCode)
        }
    }

    //Set User
    setUser = (user, roomCode) => {
        const socket = this.state.socket
        
        socket.emit(USER_CONNECTED, user, roomCode)
        console.log(USER_CONNECTED);
        this.setState({
            user: user,
            roomCode: roomCode
        })
    }

    render() {
        const user = this.state.user
        const socket = this.state.socket
        const roomCode = this.state.roomCode
        const roomList = this.state.roomList
        const gameMode = this.state.gameMode
        
        return (
            <div>
                <NavBar roomCode = {roomCode} />
                {user ? 
                    <div>
                        {gameMode ?
                            <GuessGame socket = {socket} user = {user} roomCode = {roomCode}/> : ""
                        }
                        <WhiteBoard socket = {socket} user = {user} roomCode = {roomCode}/>
                        <ChatContainer socket = {socket} user = {user} roomCode = {roomCode} roomList = {roomList}/>
                    </div> :
                    <Login socket = {socket} setUser = {this.setUser}/>
                }
            </div>
        )
    }
}

export default Layout