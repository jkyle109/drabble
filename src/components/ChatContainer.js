import React, { Component } from 'react'
import MessageInput from './MessageInput.js'
import { MESSAGE_SENT, MESSAGE_RECIEVED } from '../Events.js'
import MessageBox from './MessageBox.js'

class ChatContainer extends Component {
    constructor(props) {
        super(props)
        //socket
        //user

        this.state = {
            chatMessages: []
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
    }
    
    componentWillMount(){
        this.addMessage();
    }

    //Chat Box with messages

    //Chat input

    //Typing indicator

    //

    //Send Message
    sendMessage(message){
        const socket = this.props.socket;
        const user = this.props.user;
        socket.emit(MESSAGE_SENT, message, user);
        console.log(MESSAGE_SENT, " : ", message);
    }

    //Recieve Message
    addMessage(){
        const socket = this.props.socket;
        socket.on(MESSAGE_RECIEVED, (message) =>{
            //console.log(MESSAGE_RECIEVED, " : ", message);
            const newList = this.state.chatMessages
            newList.push(message);
            this.setState({
                chatMessages: newList
            })
        });
    }



    render() {
        console.log(this.state.chatMessages)
        const messageBlock = this.state.chatMessages.map(message => (
            <MessageBox 
                key = {message.id}
                message = {message.message}
                sender = {message.sender}
            />
        ));

        return (
            <div>
                <MessageInput 
                    chat = {this.state}
                    sendMessage = {this.sendMessage}
                />
                {messageBlock}
            </div>
        )
    }
}

export default ChatContainer