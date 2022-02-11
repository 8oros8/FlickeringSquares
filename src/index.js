
// noinspection JSPotentiallyInvalidUsageOfClassThis

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let timeoutStorage = []

class Square extends React.Component {
    state = {
        squareDisabled: this.props.squareDisabled
    }
    activateButton = function (e) {
        if (timeoutStorage.length > 0) {
            return
        }
        if (this.props.flickeringMemory.length > 0) {
            if ((parseInt(this.props.flickeringMemory[0].id[0]) === this.props.coords[0]) && (parseInt(this.props.flickeringMemory[0].id[2]) === this.props.coords[1])) {
                e.target.style.backgroundColor = 'white'
                this.props.flickeringMemory.shift()
                if (this.props.flickeringMemory.length === 0) {
                    this.props.updateLevelStatus(true)
                }
                setTimeout(function () {
                    e.target.style.backgroundColor = '#799E00'
                }, 500)
            }
            else {
                e.target.style.backgroundColor = 'red'
                for (let timeoutId of timeoutStorage) {
                    clearTimeout(timeoutId)
                }
                for (let square of document.querySelectorAll('.square')) {
                    setTimeout(function () {
                        square.style.background = '#799E00'
                    }, 500)
                }
                let updateMistakeStatus = this.props.updateMistakeStatus.bind(this)
                setTimeout(function () {
                    e.target.style.backgroundColor = '#799E00'
                }, 500)
                setTimeout(function () {
                    updateMistakeStatus(true)
                }, 2000)
            }
        }
    }
    activateButton = this.activateButton.bind(this)
    render() {
        return (
            <button disabled={this.state.squareDisabled} className="square" id={this.props.coords[0] + ":" + this.props.coords[1]} onClick={this.activateButton}>
                {this.props.value}
            </button>
        );
    }
}

class Row extends React.Component {
    renderSquares = function (counter, rowNumber) {
        let renderArray = []
        for (let i = 0; i < counter; i++) {
            renderArray.push(<Square key = {i}
                                     coords = {[rowNumber, i]}
                                     flickeringMemory = {this.props.flickeringMemory}
                                     levelPassed = {this.props.levelPassed}
                                     updateLevelStatus = {this.props.updateLevelStatus}
                                     updateMistakeStatus = {this.props.updateMistakeStatus}
                                     squareDisabled = {this.props.squareDisabled}
            />)
        }
        return renderArray
    }
    render() {
        return (
            <div className="board-row">
                {this.renderSquares(this.props.numberColumns, this.props.rowNumber)}
            </div>
        )
    }
}

class Board extends React.Component {
    state = {
        flickeringMemory: [],
        levelPassed: false,
        levelNumber: 0,
        mistakeMade: false,
        squaresArray: [],
        numberRows: 3,
        numberColumns: 3,
        complexity: 2,
        squareDisabled: false
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.mistakeMade === false) && (this.state.mistakeMade === true)) {
            this.updateMistakeStatus(false)
            this.startClickHandler()
        }
        if ((prevState.levelPassed === false) && (this.state.levelPassed === true)) {
            this.incrementLevelNumber(1)
        }
    }

    updateLevelStatus = (value) => {
        this.setState({
            levelPassed: value
        })
    }
    incrementLevelNumber = (value) => {
        let newLevelNumber = this.state.levelNumber + value
        this.setState({
            levelNumber: newLevelNumber,
            complexity: 2 + (Math.ceil(newLevelNumber/2)),
            numberColumns: 3 + (Math.floor(newLevelNumber/5)),
            numberRows: 3 + (Math.floor(newLevelNumber/5)),
        })
        let startClickHandler = this.startClickHandler.bind(this)
        let updateSquaresArray = this.updateSquaresArray.bind(this)
        setTimeout(function () {
            updateSquaresArray()
            startClickHandler()
        }, 2000)
    }
    updateMistakeStatus = (value) => {
        this.setState({
            mistakeMade: value
        })
    }
    updateSquaresArray = () => {
        this.setState({
            squaresArray: Array.from(document.getElementById('root').querySelectorAll('.square'))
        })
    }
    startClickHandler = function () {
        // noinspection JSPotentiallyInvalidUsageOfClassThis
        if ((this.state.levelPassed === true) || (this.state.mistakeMade === true) || (this.state.levelNumber === 0)){
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            this.setState({
                levelPassed: false,
                flickeringMemory: this.startFlickering(),
            })
        }
    }
    startClickHandler = this.startClickHandler.bind(this)
    resetClickHandler = function () {
        for (let timeoutId of timeoutStorage) {
            clearTimeout(timeoutId)
        }
        timeoutStorage.slice(0, timeoutStorage.length)
        for (let square of document.querySelectorAll('.square')) {
            square.style.background = '#799E00'
        }
        this.setState({
            flickeringMemory: [],
            levelPassed: false,
            levelNumber: 0,
            mistakeMade: false,
            complexity: 2,
            numberColumns: 3,
            numberRows: 3,
            squareDisabled: false
        })
    }
    resetClickHandler = this.resetClickHandler.bind(this)
    renderRows = function (counter) {
        let renderArray = []
        for (let i = 0; i < counter; i++) {
            renderArray.push(<Row
                key={i}
                rowNumber = {i}
                flickeringMemory = {this.state.flickeringMemory}
                levelPassed = {this.state.levelPassed}
                updateLevelStatus = {this.updateLevelStatus}
                updateMistakeStatus = {this.updateMistakeStatus}
                numberRows = {this.state.numberRows}
                numberColumns = {this.state.numberColumns}
                squareDisabled = {this.state.squareDisabled}
            />)
        }
        return renderArray
    }
    updateSquaresStatus = (value) => {
        this.setState({
            squaresDisabled: value
        })
    }
    randomFlicker = function (squaresArray) {
        let elementsArray = squaresArray.length === 0 ? Array.from(document.getElementById('root').querySelectorAll('.square')) : squaresArray
        let randomNumbers = []
        let randomFlickeringArray = []
        let min = 0
        let max = this.state.numberColumns*this.state.numberRows - 1
        for (let i = 0; i < this.state.complexity; i++) {
            let randomIndex = Math.floor(Math.random() * (max - min + 1)) + min
            randomNumbers.push(randomIndex)
        }
        for (let index of randomNumbers) {
            randomFlickeringArray.push(elementsArray[index])
        }
        return randomFlickeringArray
    }
    randomFlicker = this.randomFlicker.bind(this)

    startFlickering = function () {
        let flickeringArray = this.randomFlicker(this.state.squaresArray)
        this.updateSquaresStatus(true)
        for (let i = 0; i < flickeringArray.length; i++) {
            let timeout = i === 0? 0 : i * 1500
            let firstTimeoutId = setTimeout(function () {
                flickeringArray[i].style.background = 'white'
            }, timeout)
            timeoutStorage.push(firstTimeoutId)
            let secondTimeoutId = setTimeout(function () {
                flickeringArray[i].style.background = '#799E00'
            }, timeout+900)
            timeoutStorage.push(secondTimeoutId)
        }
        let enableButtonsTimeout = (flickeringArray.length - 1) * 1500 + 900
        setTimeout(function () {
            for (let timeoutId of timeoutStorage) {
                clearTimeout(timeoutId)
            }
            timeoutStorage.splice(0, timeoutStorage.length)
        }, enableButtonsTimeout)
        return flickeringArray
    }
    startFlickering = this.startFlickering.bind(this)
    render() {
        return (
            <div>
                {this.renderRows(this.state.numberRows)}
                <div className={'buttonsWrapper'}>
                    <button className={'mainButton'} onClick={this.startClickHandler}>
                        Start
                    </button>
                    <button className={'mainButton'} onClick={this.resetClickHandler}>
                        Reset
                    </button>
                </div>
                <div className={'levelInfo'}>
                    Level: {this.state.levelNumber}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


