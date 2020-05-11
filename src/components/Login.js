import React, { Component }from 'react'
import { VERIFY_USER } from '../Events.js';

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            roomCode: "",
            error: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    setUser({user, isUser, roomCode}){
        if(isUser){
            this.setError("Username is taken.");
        } else {
            this.props.setUser(user, roomCode);
        }
    }

    //Replace with a window alert component later
    setError(message){
        this.setState({
            error: message
        });
        console.log(message);
    }

    handleChange(e){
        const name = e.target.name
        const value = e.target.value
        this.setState({
            [name]: value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const socket = this.props.socket;

        socket.emit(VERIFY_USER, this.state.username, this.state.roomCode, this.setUser);
        console.log(VERIFY_USER, this.state.username);
    }


    render() {
        return (
            <div className="loginForm">
                <form onSubmit = {this.handleSubmit} autoComplete = "off">
                    <span>
                        <label className="loginText">Username: </label>
                        <input
                            type = "text"
                            name = "username"
                            value = {this.state.username}
                            placeholder = "Username"
                            onChange = {this.handleChange}
                            className="loginField"
                        />
                    </span>
                    <span>
                        <label className="loginText">Room Code: </label>
                        <input
                            type = "text"
                            name = "roomCode"
                            value = {this.state.roomCode}
                            placeholder = "Room"
                            onChange = {this.handleChange}
                            className="loginField"
                        />
                    </span>
                    
                    <input
                        type = "submit"
                        value = "Join!"
                        className="loginSubmit"
                        />
                </form>
            </div>
        )
    }
}

export default Login