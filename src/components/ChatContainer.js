import React, { Component } from 'react'
import MessageInput from './MessageInput.js'
import { MESSAGE_SENT, MESSAGE_RECIEVED } from '../Events.js'
import MessageBox from './MessageBox.js'
import ServerMessage from './ServerMessage.js';
import ChatNav from './ChatNav.js';

class ChatContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chatMessages: []
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
    }
    
    componentDidMount(){
        this.addMessage();
    }

    componentDidUpdate(){
        this.autoScr()
    }
    

    //Send Message
    sendMessage(message){
        const socket = this.props.socket;
        const user = this.props.user;
        const roomCode = this.props.roomCode;
        socket.emit(MESSAGE_SENT, message, user, roomCode);
        // console.log(MESSAGE_SENT, " : ", message);
    }

    //Recieve Message
    addMessage(){
        const socket = this.props.socket;
        socket.on(MESSAGE_RECIEVED, (message) =>{
            const newList = this.state.chatMessages
            newList.push(message);
            this.setState({
                chatMessages: newList
            })
            // console.log(this.state.chatMessages)
        });
    }

    //Change scroll 
    autoScr(){
        this.messageBox.scrollTop = this.messageBox.scrollHeight
    }


    render() {
        const messageBlock = this.state.chatMessages.map(message => (
            message.sender.name === 'server' ?
            <ServerMessage
                key = {message.id}
                message = {message.message}
            /> :
            <MessageBox
                key = {message.id}
                message = {message.message}
                sender = {message.sender}
                user = {this.props.user}
            /> 


        ));


        return (
            <div>
                <ChatNav roomCode = {this.props.roomCode} roomList = {this.props.roomList}/>
                <MessageInput
                    chat = {this.state}
                    sendMessage = {this.sendMessage}
                />
                <div className="messageBlock" ref={(ele) => this.messageBox = ele}>
                    {messageBlock}
                </div>
            </div>
        )
    }
}

export default ChatContainer