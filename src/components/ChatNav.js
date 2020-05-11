import React, { Component } from 'react'

class ChatNav extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {

        const userCount = Object.keys(this.props.roomList).length

        return (
            <div className="chatNav">
                <span className="chatNavLeft">
                    <span className="color">Room Code: </span> 
                    <span className="noColor">{this.props.roomCode}</span>
                </span>

                <span className="chatNavRight">
                    <span className="color">Users: </span>
                    <span className="noColor">{userCount}</span>
                </span>
            </div>
        )
    }
}

export default ChatNav