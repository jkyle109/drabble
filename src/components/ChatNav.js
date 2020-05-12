import React, { Component } from 'react'

class ChatNav extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    toggle = (ele) => {
        ele.classList.toggle("down")
    }

    render() {

        const userCount = Object.keys(this.props.roomList).length
        const userList = Object.keys(this.props.roomList).map(user => (
            <div key={user}>{user}</div>
        ))

        return (
            <div className="chatNav">
                <span className="chatNavLeft">
                    <span className="color">Room Code: </span> 
                    <span className="noColor">{this.props.roomCode}</span>
                </span>

                <span className="chatNavRight">
                    <span className="color">Users: </span>
                    <span className="noColor">{userCount}</span>
                    <div
                        onClick={() => {
                            this.toggle(this.viewerChev)
                            this.toggle(this.viewerList)
                        }}
                        className="chevronBorder">
                        <div>
                            <i 
                                className="fas fa-chevron-left rotate"
                                ref={(ele) => {this.viewerChev = ele}}
                            ></i>
                        </div>
                        <div className="userList" ref={(ele) => this.viewerList = ele}> 
                            <div className="noColor">Current Room Users:</div>
                            {userList}
                            </div>
                    </div>
                </span>
            </div>
        )
    }
}

export default ChatNav