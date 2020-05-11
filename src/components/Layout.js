import React, { Component } from 'react'
import io from 'socket.io-client'
import { USER_CONNECTED, USER_DISCONNECTED } from '../Events.js'
import Login from "./Login.js"
import ChatContainer from './ChatContainer.js'
import NavBar from './NavBar.js';
import WhiteBoard from './WhiteBoard.js';

const socketUrl = "/"
// const socketUrl = "http://192.168.0.13:3001"

class Layout extends Component {
    constructor(props){
        super(props);

        this.state = {
            socket: null,
            user: null,
            roomCode: null,
            roomList: [],
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

        socket.on(USER_CONNECTED, (roomList) => {
            this.setState({
                roomList: roomList
            })
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

        if(roomCode === "" || roomCode === null){
            roomCode = "Global-Chat";
        }
        
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
        
        return (
            <div>
                <NavBar roomCode = {roomCode} />
                {user ? 
                    <div>
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