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
                {this.props.sender.name + " : " + this.props.message}
            </div>
        )
    }
}

export default MessageBox