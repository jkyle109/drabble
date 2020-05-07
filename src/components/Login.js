import React, { Component }from 'react'
import { VERIFY_USER } from '../Events.js';

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            error: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    setUser({user, isUser}){
        if(isUser){
            this.setError("Username is taken.");
        } else {
            this.props.setUser(user);
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
        const username = e.target.value
        this.setState({
            username: username
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const socket = this.props.socket;

        socket.emit(VERIFY_USER, this.state.username, this.setUser);
        console.log(VERIFY_USER, this.state.username);
    }


    render() {
        return (
            <div className="loginForm">
                <form onSubmit = {this.handleSubmit}>
                    <label className="loginText">Enter Username</label>
                    <input
                    type = "text"
                    value = {this.state.username}
                    placeholder = "Username"
                    onChange = {this.handleChange}
                    className="loginUser"

                    />
                    <input
                    type = "submit"
                    value = "Login"
                    className="loginSubmit"
                    />
                </form>
            </div>
        )
    }
}

export default Login