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
        <div
            className="messageBox"
            style={{backgroundColor: highlight ? "rgb(46, 1, 46)" : "none"}}>
                {/* <hr className="messageBreak"/> */}
                <span className="color">
                    {this.props.sender.name}
                </span>
                <span className="noColor">
                    {": " + this.props.message}
                </span>
                
            </div>
        )
    }
}

export default MessageBox