import React, { Component } from 'react'
const { LINEDRAWN } = require("../Events.js")

class WhiteBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount(){
        // Set canavs context
        this.ctx = this.canvas.getContext("2d")

        // Get size from parent div
        const cw = this.d.offsetWidth;
        const ch = this.d.offsetHeight;

        // Set canvas attribute size
        this.canvas.width = cw
        this.canvas.height = ch

        // Set canvas styles size
        this.canvas.style.width = cw + "px"
        this.canvas.style.height = ch + "px"
        
        const socket = this.props.socket
        socket.on(LINEDRAWN, this.drawLine)
        
        window.addEventListener("resize", this.resizeCanvas, false)
    }

    // Canvas size needs to be updated
    resizeCanvas = () => {
        // Todo: Try taking a snapshot of the canvas and resize to new canvas

        // Get new size from resized parent div
        const cw = this.d.offsetWidth;
        const ch = this.d.offsetHeight;

        // Set canvas attributes to new size
        this.canvas.width = cw;
        this.canvas.height = ch;
        
        // Set canvas styles to new size
        this.canvas.style.width = cw + "px";
        this.canvas.style.height = ch + "px";
    }

    // Draw Line
    drawLine = (ratio) => {
        const ctx = this.ctx;

        const cw = this.canvas.width;
        const ch = this.canvas.height;

        const x1 = ratio.x1 * cw;
        const y1 = ratio.y1 * ch;
        const x2 = ratio.x2 * cw;
        const y2 = ratio.y2 * ch;

        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
    }

    handleDraw = () => {
        const socket = this.props.socket;

        const cw = this.canvas.width;
        const ch = this.canvas.height;

        const ratio = {
            x1: this.startX/cw,
            y1: this.startY/ch,
            x2: this.currentX/cw,
            y2: this.currentY/ch,
        };
        this.startX = this.currentX;
        this.startY = this.currentY;
        socket.emit(LINEDRAWN, ratio);
    }

    // Track Mouse Movement
    trackMouse = (e) => {
        // Used nativeEvent because some mouse events don't return offset
        this.currentX = e.nativeEvent.offsetX;
        this.currentY = e.nativeEvent.offsetY;
    }

    // Starts the drawing process
    startTrackMouse = () => {
        this.startX = this.currentX;
        this.startY = this.currentY;
        this.drawing = setInterval(this.handleDraw, 20);
    }

    // Stops the drawing process
    stopTrackMouse = () => {
        clearInterval(this.drawing);
    }

    render() {
        return (
            <div className="whiteBoard" ref={(ele) => this.d = ele}>
                <canvas 
                    ref={(ele) => this.canvas = ele}
                    onMouseDown={this.startTrackMouse}
                    onMouseLeave={this.stopTrackMouse}
                    onMouseUp={this.stopTrackMouse}
                    onMouseMove={this.trackMouse}
                > </canvas>
            </div>
            
        )
    }
}

export default WhiteBoard