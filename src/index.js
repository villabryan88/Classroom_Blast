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

function MenuBar(props){
  return (
    <div class="menu-bar-container">
      <div class="menu-bar">
        <button>forward</button>
        <button>reverse</button>
        <button>menu</button>
      </div>
    </div>
  )
}

function ScoreBox (props){
return (
  <div class="scorebox">
    <div class="score" id="1score" key="1score">99</div>
    <button className="plus-minus" onClick={props.onClick}>+</button>
    <button className="plus-minus" onClick={props.onClick}>-</button>
  </div>
);
}

function ScoreBoard(props){
  return(
    <div class="top-container">
      <div class="scoreboard">
        <ScoreBox />
        <ScoreBox />
        <ScoreBox />
        <ScoreBox />
        <ScoreBox />
        <ScoreBox />
      </div>
    </div>
  );
}

class QuestionBoard extends React.Component {
  renderSquare(i) {

    return (
      <Square
        value={i}
        key = {i}
        class = "square"
      />
    );
  }

  render() {
    var emptySquares = Array(48).fill(null);
    var squares = emptySquares.map((e,squareID) => this.renderSquare(squareID+1));
  
    return(
      <div className="bottom-container">
        <div className="gameboard-wrapper" id="gameboard">
          {squares}
        </div>
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
      <MenuBar />
      <ScoreBoard />
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
  
