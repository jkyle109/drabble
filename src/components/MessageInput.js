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
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        type = "text" 
                        value = {this.state.message} 
                        placeholder = {this.props.chat.name} 
                        onChange = {this.handleChange}
                    />
                    <input type = "submit" value = "Send"/>
                </form>
            </div>
        )
    }
}

export default MessageInput