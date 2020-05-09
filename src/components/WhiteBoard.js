import React, { Component } from 'react'
import ToolBar from './ToolBar.js';
const { LINEDRAWN } = require("../Events.js")


class WhiteBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            penColor: "#000000",
            lineWidth: 2,
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

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineCap = "round";
        ctx.strokeStyle = ratio.penColor;
        ctx.lineWidth = ratio.lineWidth;
        ctx.stroke();
        ctx.closePath();
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
            penColor: this.state.penColor,
            lineWidth: this.state.lineWidth
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
    startTrackMouse = (e) => {
        if(e.button === 0){
            this.startX = this.currentX;
            this.startY = this.currentY;
            this.drawing = setInterval(this.handleDraw, 20);
        }
    }

    // Stops the drawing process
    stopTrackMouse = () => {
        clearInterval(this.drawing);
    }

    // Set Pen Color
    setPenColor = (color) => {
        console.log(color)
        this.setState({
            penColor: color
        });
    }

    // Set Line Width
    setLineWidth = (width) => {
        this.setState({
            lineWidth: width
        });
    }

    clearCanvas = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        const penColor = this.state.penColor
        return (
            <div>
                <div className="whiteBoard" ref={(ele) => this.d = ele}>
                    <canvas 
                        ref={(ele) => this.canvas = ele}
                        onMouseDown={this.startTrackMouse}
                        onMouseLeave={this.stopTrackMouse}
                        onMouseUp={this.stopTrackMouse}
                        onMouseMove={this.trackMouse}
                        onContextMenu={(e) => {e.preventDefault()}}
                    > </canvas>
                </div>
                <ToolBar penColor = { penColor } setPenColor = {this.setPenColor} setLineWidth = {this.setLineWidth} clearCanvas = {this.clearCanvas}/>
            </div>
        )
    }
}

export default WhiteBoard