import React, { Component } from 'react'

class SelectWord extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }



    render() {
        const choices = this.props.wordOptions.map((word) => (
            <input className="wordOption" key={word} onClick={this.props.handleWordChoice} type="button" value = {word} />
        ))

        return (
            <div className="selectWord">{choices}</div>
        )
    }
}

export default SelectWord