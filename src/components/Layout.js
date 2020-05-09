import React, { Component } from 'react'
import io from 'socket.io-client'
import { USER_CONNECTED, USER_DISCONNECTED } from '../Events.js'
import Login from "./Login.js"
import ChatContainer from './ChatContainer.js'
import NavBar from './NavBar.js';
import WhiteBoard from './WhiteBoard.js';

const socketUrl = "/"
// const socketUrl = "http://localhost:3001"

class Layout extends Component {
    constructor(props){
        super(props);

        this.state = {
            socket: null,
            user: null,
        };
    }

    //Initialises socket
    componentDidMount() {
        this.initSocket()

        // Before tab close
        window.onbeforeunload = this.disconnect
    }

    disconnect = () => {
        const socket = this.state.socket;
        if(this.state.user !== null){
            socket.emit(USER_DISCONNECTED, (this.state.user))
        }
    }


    //Create a socket connection with server
    initSocket = () => {
        const socket = io(socketUrl)
        
        socket.on("connect", () => {
            console.log("Connected")
        })
        this.setState({socket: socket})
    }

    //Set User
    setUser = (user) => {
        const socket = this.state.socket
        
        socket.emit(USER_CONNECTED, user)
        console.log(USER_CONNECTED);
        this.setState({
            user: user
        })
    }

    render() {
        const user = this.state.user
        const socket = this.state.socket
        
        return (
            <div>
                <NavBar />
                {user ? 
                    <div>
                        <WhiteBoard socket = {socket}/>
                        <ChatContainer socket = {socket} user = {user}/>
                    </div> :
                    <Login socket = {socket} setUser = {this.setUser}/>
                }
            </div>
        )
    }
}

export default Layout