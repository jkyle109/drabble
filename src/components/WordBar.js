import React, { Component } from 'react'

class WordBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    

    render() {
        return (
            <pre className="Word">
                {this.props.main ? this.props.word : this.props.visableWord}
            </pre>
        )
    }
}

export default WordBar