import React from 'react'
import { VERIFY_USER } from '../Events.js';

class Login extends React.Component {
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

    setError(message){
        this.setState({
            error: message
        });
        console.log(message);
    }

    handleChange(e){
        this.setState({
            username: e.target.value
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
            <div>
                <form onSubmit = {this.handleSubmit}>
                    <label>Enter Username: </label>
                    <input
                    type = "text"
                    value = {this.state.username}
                    placeholder = "Username"
                    onChange = {this.handleChange}

                    />
                    <input
                    type = "submit"
                    value = "Login"
                    />
                </form>
            </div>
        )
    }
}

export default Login