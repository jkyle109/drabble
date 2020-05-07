import React, { Component } from 'react'
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT  } from '../Events.js'
import Login from "./Login.js"
import ChatContainer from './ChatContainer.js'

const socketUrl = "/"

class Layout extends Component {
    constructor(props){
        super(props);

        this.state = {
            socket: null,
            user: null,
        };

        this.setUser = this.setUser.bind(this);
    }

    //Initialises socket
    componentWillMount() {
        this.initSocket()
    }

    //Leave page ???
    componentWillUnmount() {
        //const socket = this.state.socket;
        //socket.emit("disconnect", (this.user))
    }

    //Create a socket connection with server
    initSocket(){
        const socket = io(socketUrl)
        
        socket.on("connect", () => {
            console.log("Connected")
        })
        this.setState({socket: socket})
    }

    //Set User
    setUser(user){
        const socket = this.state.socket
        
        socket.emit(USER_CONNECTED, user)
        console.log(USER_CONNECTED);
        this.setState({
            user: user
        })
    }

    //Logout
    logout(){
        const socket = this.state.socket;
        const user = this.state.user;

        //For future proofing check to see if user is logged in
        if(user == null){
            //Error message container???
        } else {
            socket.emit(LOGOUT, user)
        }
    }


    render() {
        const { title } = this.props
        const user = this.state.user
        const socket = this.state.socket
        return (
            <div>
                {title}
                {user ? 
                    <ChatContainer socket = {socket} user = {user}/> :
                    <Login socket = {socket} setUser = {this.setUser}/>
                }
            </div>
        )
    }
}

export default Layout