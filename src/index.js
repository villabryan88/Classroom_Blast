import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import questionsData from './json/questionsData.json';



class  MenuBar extends React.Component {
  render() {
    return (
      <div className="flex menu-bar-container">
        <div className="flex-centered menu-bar">
          <button>New Game</button>
          <button>forward</button>
          <button>reverse</button>
          <button onClick={this.props.onClick}>menu</button>
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
    onClick={props.onClick}
    style = {{backgroundColor : props.available ? "white" : "transparent" }}
    >
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
        onClick = {() => this.props.onClick(i)}
        available = {this.props.questions[i]}
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
    // window.onclick = function(event) {
    //     if (event.target.className == "modal") {
    //      event.target.style.display = "none";
    //     }
    // } 
  }


  render() {
    return (
      <div id={this.props.id} className="modal" style={{display: this.props.display}}>
        <div className="modal-content">
          <span className="close" onClick={this.props.onClick}>&times;</span>
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
      <Modal id={this.props.id} display={this.props.display} onClick={this.props.onClick} >
        <h1 className="flex">Menu</h1>
          <div className="menu-grid">

            <MenuItem size="medium" item="Teams" />

            <div><h2>AI</h2></div>
            <div><input type="checkbox" /></div>

            <div><h2>Item Quantity</h2></div>
            <span>
                <button>count</button><br/>
                <button>probability</button>
            </span>

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

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {timer: 30}; 
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  
  tick() {
    if (this.state.date==0){
      clearInterval(this.timerID);
      return;
    }

    const time = this.state.timer-1;
    this.setState({
      timer: time
    });
  }

  render() {
    return (
      <span class="timer">{this.state.timer}</span>
    );
  }
}

class QuestionPage extends React.Component{




  componentWillUnmount() {
    alert("goodbye");
  }

  render(){
    const currentQuestion = this.props.currentQuestion;
    const questionsIndex = currentQuestion > 0 ? currentQuestion-1: 0;

    return (
      <Modal id={this.props.id} display={this.props.display} onClick= {this.props.onClick}>
        <div class="flex instructions">{questionsData[questionsIndex]["instructions"]}</div>
        <span style={{float: "right"}}>{this.props.display == "none" || <Timer /> } </span>
        <div class="flex question">{questionsData[questionsIndex]["question"]}</div>
        <div class="flex answer">{questionsData[questionsIndex]["answer"]}</div>
        
      </Modal>
    )

  }
}

// class AnswerPage extends React.Component{
//   render(){
      // return (
      //   <Modal id={this.props.id}>
      //   </Modal>
      // )
//   }
// }

// class PrizePage extends React.Component{
//   render(){
      // return (
      //   <Modal id={this.props.id}>
      //   </Modal>
      // )
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
      currentQuestion: 0, //maybe set to 0 and have a default blank 0 thing cause of async rendering
      questionsToggle: Array(49).fill(true),
      winner: null,
      timer: 0,    
      questionPageDisplay: "none",  
      menuPageDisplay: "none"
    };
  }

  handleClick(i){  //I don't like how dirty this looks
    var questionsToggle = this.state.questionsToggle;
    const available = questionsToggle[i];
    questionsToggle[i] = !questionsToggle[i];
 
    this.setState ({
      currentQuestion: i,
      questionsToggle: questionsToggle
    }); 

    if (available)
      this.state.questionPageDisplay = "block";
  }

  modalHandleClick(modal) {
    var obj = {};
    obj[modal] = this.state[modal] == "none" ? "block" : "none";
    this.setState(obj);
  }

  render() {
    return(
      <div>
      <MenuBar onClick={() => this.modalHandleClick("menuPageDisplay")}/>
      <ScoreBoard />
      <QuestionBoard onClick={(i) => this.handleClick(i)} questions={this.state.questionsToggle} />
      <MenuPage display={this.state.menuPageDisplay} onClick={() => this.modalHandleClick("menuPageDisplay")}/>
      <QuestionPage currentQuestion={this.state.currentQuestion} display={this.state.questionPageDisplay} onClick={() => this.modalHandleClick("questionPageDisplay")}/>
      </div>
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
