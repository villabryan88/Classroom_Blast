import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class  MenuBar extends React.Component {
  menuHandleClick() {
    var modal = document.getElementById(this.props.menuModal);
    modal.style.display = "block";
  }

  render() {
    return (
      <div class="flex menu-bar-container">
        <div class="flex-centered menu-bar">
          <button>forward</button>
          <button>reverse</button>
          <button onClick={()=>this.menuHandleClick()}>menu</button>
        </div>
      </div>
    );
  }
}

function ScoreBox (props){
  return (
    <div class="scorebox">
      <div class="flex-centered team-name"> Team 1</div>
      <div class="flex-centered score" id="1score" key="1score">99</div>
      <button className="plus-minus" onClick={props.onClick}>+</button>
      <button className="plus-minus" onClick={props.onClick}>-</button>
    </div>
  );
}

function ScoreBoard(props){
  return(
    <div class="flex top-container">
      <div class="flex-centered scoreboard">
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

function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick}  >
      {props.value}
    </button>
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
      <div className="flex-centered bottom-container">
        <div className="gameboard-wrapper" id="gameboard">
          {squares}
        </div>
      </div> 
    );
  }
}

class Modal extends React.Component{

  closeHandleClick() {
    var modal = document.getElementById(this.props.id);
    modal.style.display = "none";
  }

  componentDidMount(){
    window.onclick = function(event) {
        if (event.target.className == "modal") {
         event.target.style.display = "none";
        }
    } 
  }


  render() {
    const id= this.props.id;
    return (
      <div id={id} key={id} class="modal">
        <div class="modal-content">
          <span class="close" onClick={()=> this.closeHandleClick()}>&times;</span>
          <p>Some text in the Modal..</p>
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
      <MenuBar menuModal="menuModal"/>
      <ScoreBoard />
      <QuestionBoard />
      <Modal id="menuModal"/>
      <Modal id="questionModal" />
      </div>
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
