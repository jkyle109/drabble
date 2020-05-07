import React, { Component } from 'react'

class MessageInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Need chat.name
    //Need sendMessage

    handleChange(e){
        const message = e.target.value;
        this.setState({
            message: message
        });
    }

    handleSubmit(e){
        e.preventDefault();
        const message = this.state.message;
        if(message !== ""){
            this.props.sendMessage(message);
            this.setState({
                message: ""
            });
        }

        this.input.focus();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}> 
                    <input className="messageInput"
                        type = "text" 
                        value = {this.state.message} 
                        placeholder = "Type here to chat!" 
                        onChange = {this.handleChange}
                        ref={(ele) => this.input = ele}
                    />
                    <input 
                        type = "submit" 
                        value = "Send"
                        className="messageSend"
                        />
                </form>
            </div>
        )
    }
}

export default MessageInput