import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import questionsData from './json/questionsData.json';


class  MenuBar extends React.Component {
  render() {
    return (
      <div className="flex menu-bar-container">
        <div className="flex-centered menu-bar">
          <div className="flex-content">
            <button onClick={this.props.newGameOnClick}>New Game</button>
          </div>
          <div className="flex-content flex flex-right">
            <button onClick={() => this.props.navigationOnClick("plus")}>forward</button>
            <button onClick={() => this.props.navigationOnClick("minus")}>reverse</button>
            <button onClick={this.props.menuOnClick}>menu</button>
          </div>
        </div>
      </div>
    );
  }
}

function ScoreBox (props){
  const scoreBoxClass = "scorebox " + ((props.size) || "");
  const teamElement = !props.team ? '' :<div className="flex-centered team-name"> Team {props.team}</div>;
  const scoreHighlight = props.team == props.currentTeam ? {backgroundColor: "lightGreen"}: {};

  return (
    <div className={scoreBoxClass}>
      {teamElement}
      <div
        className="flex-centered score"
        style={scoreHighlight}>
          {props.value}
      </div>
      <button className="plus-minus" onClick={() => props.plusMinusOnClick("plus")}>+</button>
      <button className="plus-minus" onClick={() => props.plusMinusOnClick("minus")}>-</button>
    </div>
  );
}

class ScoreBoard extends React.Component{

  render (){
    var scoreBoard = [];

    for (let i=0; i< this.props.teams; i++){
      scoreBoard[i] = <ScoreBox 
        value={this.props.score[i]} 
        team = {i+1}
        key = {i}
        currentTeam = {this.props.currentTeam}
        plusMinusOnClick={(plusMinus) => this.props.scoreOnClick(i, plusMinus, "score")}
      />;
    }
    return(
      <div className="flex top-container">
        <div className="flex-centered scoreboard">
          {scoreBoard}
        </div>
      </div>
    );
  }
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
  render() {
    return (
      <div id={this.props.id} className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.props.closeOnClick}>&times;</span>
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
      <div><ScoreBox team={0} size={props.size} value={props.value} plusMinusOnClick={props.plusMinusOnClick}/></div>
    </React.Fragment>
  );
}

class MenuPage extends React.Component {
  render(){
    return(
      <Modal id="menuModal" closeOnClick={this.props.closeOnClick} >
        <h1 className="flex">Menu</h1>
          <div className="menu-grid">

            <MenuItem size="medium" item="Teams" value={this.props.settings.teams} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("teams", plusMinus)}/>
            <MenuItem size="medium" item="Timer" value={this.props.settings.timer} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("timer", plusMinus)}/>

            {/* <div><h2>AI</h2></div>
            <div><input type="checkbox" /></div>

            <div><h2>Item Quantity</h2></div>
            <span>
                <button>count</button><br/>
                <button>probability</button>
            </span> */}

            <div style={{gridColumn:"1 / span 2", backgroundColor: "transparent"}}><h2>Item Counts</h2></div>
            {/* would like to automate this part. create a items in game state, if in settings avoid adding new prop to pass down
                but then have to see reprecussions of having object in object. probably will have to deep clone somwhere.  
                if new state object then have to add another state to pass down. kinda lame
                will hold off for now */}
            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="One"  value={this.props.settings.one} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("one", plusMinus)}/>
                <MenuItem size="small" item="Two"  value={this.props.settings.two} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("two", plusMinus)}/>
                <MenuItem size="small" item="Three"  value={this.props.settings.three} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("three", plusMinus)}/>
                <MenuItem size="small" item="Four"  value={this.props.settings.four} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("four", plusMinus)}/>
              </div>
            </span>
            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="Five"  value={this.props.settings.five} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("five", plusMinus)}/>
                <MenuItem size="small" item="Steal Three"  value={this.props.settings.stealThree} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("stealThree", plusMinus)}/>
                <MenuItem size="small" item="Steal Half"  value={this.props.settings.stealHalf} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("stealHalf", plusMinus)}/>
                <MenuItem size="small" item="Enemies Half"  value={this.props.settings.enemiesHalf} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("enemiesHalf", plusMinus)}/>
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
    this.state = {timer: props.timer}; 
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
    if (this.state.timer==0){
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
  constructor(props){
    super(props);
    this.state = {
      answerVisible: false,
      fontSize: 200
    }
  }

  answerOnClick(){
    this.setState({answerVisible: true});
  }

  fitSize() {
    var instructions = document.getElementById("instructions");
      var fontSize = this.state.fontSize;
    
    this.componentDidUpdate = () => {
      var instructions = document.getElementById("instructions");
      var fontSize = this.state.fontSize;
      if (instructions.offsetHeight < instructions.scrollHeight)
        this.setState({fontSize: fontSize-5});
    }
    if (instructions.offsetHeight < instructions.scrollHeight)
      this.setState({fontSize: fontSize-5});
  }

  componentDidMount(){
    this.fitSize();
  }



  render(){
    const currentQuestion = this.props.currentQuestion;
    const questionsIndex = currentQuestion > 0 ? currentQuestion-1: 0;
    const fontSize = this.state.fontSize + "px";
    var style = {fontSize: fontSize};


    return (
      <Modal id={this.props.id}  closeOnClick= {this.props.closeOnClick}>
        <div id="instructions" style={style} class="flex-centered instructions">
          {questionsData[questionsIndex]["instructions"]}
        </div>
        <span style={{float: "right"}}>
          <Timer timer={this.props.timer}/>
        </span>
        <div class="flex-centered question">
          {questionsData[questionsIndex]["question"]}
        </div>
        <div class="flex-centered answer">
          {!this.state.answerVisible ?  
            <button onClick={() => this.answerOnClick()}>Answer</button>
          : questionsData[questionsIndex]["answer"]}
        </div>
        
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
      score:  Array(6).fill(0),
      turnNumber:0,
      currentQuestion: 0, //maybe set to 0 and have a default blank 0 thing cause of async rendering
      questionsToggle: Array(49).fill(true),
      winner: null, 
      currentModal: null,
      settings: {
        teams: 6,
        timer: 30,              
        currentTeam: 1,
        one: 10,
        two: 10,
        three: 10,
        four: 10,
        five: 10,
        stealThree: 10,
        stealHalf: 10,
        enemiesHalf: 10,
      }
    };
  }

  handleClick(i){
    var questionsToggle = this.state.questionsToggle;
    const available = questionsToggle[i];
    var currentModal= null;

    if (available)
      currentModal = "questionPage";

    questionsToggle[i] = !questionsToggle[i];
 
    this.setState ({
      currentQuestion: i,
      questionsToggle: questionsToggle,
      currentModal: currentModal
    }); 
 }


  plusMinusHandleClick(setting, plusMinus, type){ //starting to handle too much
    var score = this.state.score.slice();
    var settings = Object.assign({},this.state.settings);
    var state = {};
    state.score = score;
    state.settings = settings;
    
    if (type) 
      var newState = score;
    else 
      var newState = settings;
    
    
    if (plusMinus == "plus")
      newState[setting] = newState[setting] + 1;
    else if (newState[setting] > 0)
      newState[setting] = newState[setting] - 1;

    if (state.score.length < state.settings.teams)
      state.score[state.settings.teams-1] = 0;

    state.settings.currentTeam = state.settings.currentTeam % state.settings.teams;
    if (state.settings.currentTeam == 0)
      state.settings.currentTeam = state.settings.teams;

    this.setState(state);
  }

  reset() {
    var state = {
      score:  Array(6).fill(0),
      turnNumber:0,
      currentQuestion: 0, 
      questionsToggle: Array(49).fill(true),
      winner: null, 
    }
    var settings = Object.assign({},this.state.settings);
    settings.currentTeam = 1;
    state.settings = settings;


    this.setState(state);
  }

  modalOpenCloseHandleClick(modal) {
    this.setState({currentModal: modal});
  }

  componentDidMount(){
    window.onclick = (e) => {
      if (e.target.className == "modal") 
        this.setState({currentModal: null});      
    } 
  }

  renderModal() {
    var settings = this.state.settings;
    const currentModal = this.state.currentModal;

    const modal = (currentModal) =>{ switch (currentModal) {
      case 'menuPage':
        return <MenuPage
          settings={settings}
          closeOnClick={() => this.modalOpenCloseHandleClick(null)}
          plusMinusOnClick = {(setting, plusMinus) => this.plusMinusHandleClick(setting,plusMinus)} />;
  
      case 'questionPage':
        return <QuestionPage
          currentQuestion={this.state.currentQuestion}
          timer = {this.state.settings.timer}
          closeOnClick={() => this.modalOpenCloseHandleClick(null)}/>;
  
      default:
        return null;
    }};

    return (modal(currentModal));
  }

  render() {
    var modal = this.renderModal();    
    return(
      <div>
      <MenuBar 
        menuOnClick={() => this.modalOpenCloseHandleClick("menuPage")}
        navigationOnClick = {(plusMinus) => this.plusMinusHandleClick("currentTeam",plusMinus)}
        newGameOnClick = {() => this.reset()}
      />
      <ScoreBoard 
        score={this.state.score} 
        teams={this.state.settings.teams}
        currentTeam = {this.state.settings.currentTeam}
        scoreOnClick = {(setting, plusMinus, score) => this.plusMinusHandleClick(setting,plusMinus,score)} 
      />
      <QuestionBoard 
        onClick={(i) => this.handleClick(i)} 
        questions={this.state.questionsToggle} 
      />
      {modal}
      </div> 
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
