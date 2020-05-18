import React, { Component } from 'react'
import ScoreBoard from './ScoreBoard.js';
import WordBar from './WordBar.js';
import SelectWord from './SelectWord.js';
import { WORD_CHANGE, WORD_CHOSEN, ROUND_START, ROUND_END, GAME_END } from "../Events.js"

class GuessGame extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visableWord: " ",
            choosingWord: false,
            wordOptions: [],
            delay: null,
            main: false,
        }
    }

    componentDidMount(){
        const socket = this.props.socket
        const roomCode = this.props.roomCode

        socket.on(ROUND_START, (words, leader) => {
            const username = this.props.user.name
            if(username === leader.name){
                this.setState({
                    wordOptions: words,
                    choosingWord : true,
                    main: true
                })
                this.selectWord = setTimeout(() => {
                    const socket = this.props.socket
                    this.setState({
                        choosingWord: false,
                    })
                    socket.emit(WORD_CHOSEN, words[1] , roomCode)
                    this.word = this.formatWord(words[1])
                },10000)
            }
        });

        socket.on(WORD_CHOSEN, (visableWord, roundLength, delay, roomCode) => {
            visableWord = this.formatWord(visableWord)
            this.setState({
                visableWord: visableWord,
                delay: delay
            });
            if(this.state.main){
                this.small = setInterval(() => {
                    socket.emit(WORD_CHANGE, roomCode)
                }, delay)
                this.large = setTimeout(() => {
                    clearInterval(this.small)
                    socket.emit(ROUND_END, roomCode)
                },roundLength)
            }
        })

        socket.on(WORD_CHANGE, (visableWord) => {
            visableWord = this.formatWord(visableWord)
            this.setState({
                visableWord: visableWord
            });
        });

        socket.on(ROUND_END, () => {
            clearInterval(this.small)
            clearTimeout(this.large)
            this.word = ""
            this.setState({
                visableWord: "",
                choosingWord: false,
                wordOptions: [],
                delay: null,
                main: false,
            })
        })

        socket.on(GAME_END, () => {
            // Clear Score Board
        })
    }

    formatWord = (word) => {
        let result = ""
        for(let i=0; i<word.length; i++){
            result = result + word[i] +" "
        }
        return result
    }

    handleWordChoice = (e) => {
        const socket = this.props.socket
        const roomCode = this.props.roomCode
        const word = e.target.value
        this.setState({
            choosingWord: false
        })
        socket.emit(WORD_CHOSEN, word , roomCode)
        clearTimeout(this.selectWord)
        this.word = this.formatWord(word)
    }

    render() {
        const visableWord = this.state.visableWord
        const choosingWord = this.state.choosingWord
        const wordOptions = this.state.wordOptions
        const main = this.state.main
        return (
            <div>
                {choosingWord ? <SelectWord wordOptions = {wordOptions} handleWordChoice = {this.handleWordChoice}/> : ""}
                <WordBar visableWord = {visableWord} main = {main} word = {this.word} />
                <ScoreBoard />
            </div>
        )
    }
}

export default GuessGame