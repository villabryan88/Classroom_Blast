import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick}  >
      {props.value}
    </button>
  );
}

function PlusMinus (props){

}

function Score (props){

}

function ScoreBox (props){
return (
  <div class="grid-wrapper">
    <div class="item1">One</div>
    <div>Two</div>
    <div>Three</div>
  </div>
)
}

// function ScoreBoard(props){
//   return();
// }

class QuestionBoard extends React.Component {
  renderSquare(i) {

    return (
      <Square
        value={i+1}
        key = {i}
        class = "square"
      />
    );
  }

  render() {
    var emptyBoard = Array(6).fill(Array(8).fill(null));
    var gameBoard = emptyBoard.map((rows,rowNum)=> {
      var row= rows.map((empty,squareID) => this.renderSquare(rowNum*8+squareID));
      return (
        <div key={rowNum} className="board-row">
          {row}
        </div>
      );
    });   
    return(
      <div className="container" id="game-board">
        {gameBoard}
      </div> 
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfTeams: 6,
      score:  Array(6).fill(0),
      turnNumber:0,
      currentTeam: 1,
      questionsToggle: Array(48).fill(true),
      winner: null,      
    };
  }

  render() {
    return(
      <div>
      <ScoreBox />
      <QuestionBoard />
      </div>
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
