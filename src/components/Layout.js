import React, { Component } from 'react'
import io from 'socket.io-client'

const socketUrl = "http://192.168.0.13:3001"

class Layout extends Component {
    constructor(props){
        super(props);

        this.state = {
            socket: null,
        };
    }

    componentWillMount() {
        this.initSocket()
    }

    initSocket(){
        const socket = io(socketUrl)
        
        socket.on("connect", () => {
            console.log("Connected")
        })
        this.setState({socket: socket})
    }

    render() {
        const { title } = this.props
        return (
            <div>
                {title}
            </div>
        )
    }
}

export default Layout