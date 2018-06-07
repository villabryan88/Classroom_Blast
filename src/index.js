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
      <div className="flex menu-bar-container">
        <div className="flex-centered menu-bar">
          <button>New Game</button>
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
    <div className={"scorebox " + ((props.size) || "")}>
      {props.noTeam ? '' :<div className="flex-centered team-name"> Team 1</div>}
      <div className={"flex-centered score " + ((props.size) || "")} id="1score">99</div>
      <button className={"plus-minus " + ((props.size) || "")} onClick={props.onClick}>+</button>
      <button className={"plus-minus " + ((props.size) || "")} onClick={props.onClick}>-</button>
    </div>
  );
}

function ScoreBoard(props){
  return(
    <div className="flex top-container">
      <div className="flex-centered scoreboard">
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
        onClick = {this.props.onClick}
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
    return (
      <div id={this.props.id} className="modal">
        <div className="modal-content">
          <span className="close" onClick={()=> this.closeHandleClick()}>&times;</span>
          {this.props.children}
        </div>    
      </div>
    );
  }
}

function MenuItem(props){
  const h = props.size == "small" ? 3: 2;
  const Header = `h${h}`;


  return (
    <React.Fragment>
      <div><Header children={props.item}/></div>
      <div><ScoreBox noTeam="1" size={props.size} /></div>
    </React.Fragment>
  );
}

class MenuPage extends React.Component {
  render(){
    return(
      <Modal id={this.props.id}>
        <h1 className="flex">Menu</h1>
          <div className="menu-grid">

            <MenuItem size="medium" item="Teams" />

            <div><h2>AI</h2></div>
            <div><input type="checkbox" /></div>

            <div><h2>Item Quantity</h2></div>
            <div>
                <button>count</button>
                <button>probability</button>
            </div>

            <div style={{gridColumn:"1 / span 2", backgroundColor: "transparent"}}><h2>Item Counts</h2></div>

            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="One" />
                <MenuItem size="small" item="Two" />
                <MenuItem size="small" item="Three" />
                <MenuItem size="small" item="Four" />
              </div>
            </span>
            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="One" />
                <MenuItem size="small" item="Two" />
                <MenuItem size="small" item="Three" />
                <MenuItem size="small" item="Four" />
              </div>
            </span>
          </div>
      </Modal>
    )
  }
}



// class QuestionPage extends React.Component{
//   render(){

//   }
// }

// class AnswerPage extends React.Component{
//   render(){
    
//   }
// }

// class PrizePage extends React.Component{
//   render(){
    
//   }
// }



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfTeams: 6,
      score:  Array(6).fill(0),
      turnNumber:0,
      currentTeam: 1,
      currentQuestion: 1,
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
      <MenuPage id="menuModal" />
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
  
