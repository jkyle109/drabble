import React, { Component } from 'react'
const colors = require("../colors.js")
const sizes = [2,4,6,10,16];

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
            <span 
                className="outerDot" onClick={() => this.props.setLineWidth(size)}
                style={{borderColor: size === this.props.lineWidth ? "purple" : ""}}
                key={size}>
                <span 
                    className="innerDot"
                    style={{width: size, height: size}}
                />
            </span>
        ))

        return (
            <div className="toolBar">
                <input
                    className="currentColor"
                    type="color"
                    value={this.props.penColor}
                    onChange={(e) => { this.props.setPenColor(e.target.value)}}
                ></input>
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