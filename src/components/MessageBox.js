import React, { Component } from 'react'

class MessageBox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }
    //Need messages

    render() {
        return (
            <div>
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