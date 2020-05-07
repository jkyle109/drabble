import React, { Component } from 'react'

class MessageBox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }
    //Need messages

    render() {
        let highlight = this.props.message.includes("@"+this.props.user.name)

        return (
        <div style={{backgroundColor: highlight ? "rgb(25, 9, 42)" : "none"}}>
                {/* <hr className="messageBreak"/> */}
                <span className="username">
                    {this.props.sender.name}
                </span>
                <span className="message">
                    {": " + this.props.message}
                </span>
                
            </div>
        )
    }
}

export default MessageBox