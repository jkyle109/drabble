import React, { Component } from 'react'

class ServerMessage extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        return (
            <div className="serverMessage">
                {this.props.message}
            </div>
        )
    }
}

export default ServerMessage