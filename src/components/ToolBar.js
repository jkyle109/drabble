import React, { Component } from 'react'
const colors = require("../colors.js")
const sizes = [2,5,10,15];

class ToolBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        const colorBoxes = colors.map(color => (
            <div
                key={color.hex}
                className="colorBox" 
                style={{backgroundColor: color.hex}}
                onClick={() => this.props.setPenColor(color.hex)}
            />
        ))

        const pointCircles = sizes.map(size => (
            <span className="outerDot" onClick={() => this.props.setLineWidth(size)}>
                <span 
                    className="innerDot"
                    style={{width: size, height: size}}
                    key={size}
                />
            </span>
        ))

        return (
            <div className="toolBar">
                <div className="currentColor" style={{backgroundColor: this.props.penColor}}/>
                <div className="colorGrid">
                    {colorBoxes}
                </div>
                {pointCircles}
                <div
                    className="colorClear" 
                    onClick={this.props.clearCanvas}
                >Clear</div>
            </div>
        )
    }
}

export default ToolBar