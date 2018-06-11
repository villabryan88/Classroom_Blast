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
  return (
    <div className={"scorebox " + ((props.size) || "")}>
      {!props.team ? '' :<div className="flex-centered team-name"> Team {props.team}</div>}
      <div
        className={"flex-centered score " + ((props.size) || "")}
        id="1score"        
        style={props.team == props.currentTeam ? {backgroundColor: "lightGreen"}: {}}>
          {props.settings}
      </div>
      <button className={"plus-minus " + ((props.size) || "")} onClick={() => props.settingsOnClick("plus")}>+</button>
      <button className={"plus-minus " + ((props.size) || "")} onClick={() => props.settingsOnClick("minus")}>-</button>
    </div>
  );
}

class ScoreBoard extends React.Component{
  // renderScoreBox (i){
     
  // }
  render (){
    var scoreBoard = [];

    for (let i=0; i< this.props.teams; i++){
      scoreBoard[i] = <ScoreBox 
        settings={this.props.score[i]} 
        team = {i+1}
        key = {i}
        currentTeam = {this.props.currentTeam}
        settingsOnClick={(plusMinus) => this.props.scoreOnClick(i, plusMinus, "score")}
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
      <div id={this.props.id} className="modal" style={{display: this.props.display}}>
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
      <div><ScoreBox team={0} size={props.size} settings={props.settings} settingsOnClick={props.settingsOnClick}/></div>
    </React.Fragment>
  );
}

class MenuPage extends React.Component {
  render(){
    return(
      <Modal id="menuModal" display={this.props.display} closeOnClick={this.props.closeOnClick} >
        <h1 className="flex">Menu</h1>
          <div className="menu-grid">

            <MenuItem size="medium" item="Teams" settings={this.props.settings.teams} settingsOnClick={(plusMinus) => this.props.settingsOnClick("teams", plusMinus)}/>
            <MenuItem size="medium" item="Timer" settings={this.props.settings.timer} settingsOnClick={(plusMinus) => this.props.settingsOnClick("timer", plusMinus)}/>

            {/* <div><h2>AI</h2></div>
            <div><input type="checkbox" /></div>

            <div><h2>Item Quantity</h2></div>
            <span>
                <button>count</button><br/>
                <button>probability</button>
            </span> */}

            <div style={{gridColumn:"1 / span 2", backgroundColor: "transparent"}}><h2>Item Counts</h2></div>

            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="One"  settings={this.props.settings.one} settingsOnClick={(plusMinus) => this.props.settingsOnClick("one", plusMinus)}/>
                <MenuItem size="small" item="Two"  settings={this.props.settings.two} settingsOnClick={(plusMinus) => this.props.settingsOnClick("two", plusMinus)}/>
                <MenuItem size="small" item="Three"  settings={this.props.settings.three} settingsOnClick={(plusMinus) => this.props.settingsOnClick("three", plusMinus)}/>
                <MenuItem size="small" item="Four"  settings={this.props.settings.four} settingsOnClick={(plusMinus) => this.props.settingsOnClick("four", plusMinus)}/>
              </div>
            </span>
            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="Five"  settings={this.props.settings.five} settingsOnClick={(plusMinus) => this.props.settingsOnClick("five", plusMinus)}/>
                <MenuItem size="small" item="Steal Three"  settings={this.props.settings.stealThree} settingsOnClick={(plusMinus) => this.props.settingsOnClick("stealThree", plusMinus)}/>
                <MenuItem size="small" item="Steal Half"  settings={this.props.settings.stealHalf} settingsOnClick={(plusMinus) => this.props.settingsOnClick("stealHalf", plusMinus)}/>
                <MenuItem size="small" item="Enemies Half"  settings={this.props.settings.enemiesHalf} settingsOnClick={(plusMinus) => this.props.settingsOnClick("enemiesHalf", plusMinus)}/>
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
      answerVisible: false
    }
  }

  answerOnClick(){
    this.setState({answerVisible: true});
  }


  componentWillUnmount() {
    alert("goodbye");
  }

  render(){
    const currentQuestion = this.props.currentQuestion;
    const questionsIndex = currentQuestion > 0 ? currentQuestion-1: 0;

    return (
      <Modal id={this.props.id} display={this.props.display} closeOnClick= {this.props.closeOnClick}>
        <div class="flex instructions">{questionsData[questionsIndex]["instructions"]}</div>
        <span style={{float: "right"}}>{this.props.display == "none" || <Timer timer={this.props.timer}/> } </span>
        <div class="flex question">{questionsData[questionsIndex]["question"]}</div>
        <div class="flex answer">
          {!this.state.answerVisible ?  <button onClick={() => this.answerOnClick()}>Answer</button>
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
      questionPageDisplay: "none",  
      menuPageDisplay: "none",
      settings: {
        teams: 6,
        timer: 30,
        one: 10,
        two: 10,
        three: 10,
        four: 10,
        five: 10,
        stealThree: 10,
        stealHalf: 10,
        enemiesHalf: 10,      
        currentTeam: 1,
      }
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

    if (available){
      this.setState({
        questionPageDisplay: "block"
      });
    }
  }


  settingsHandleClick(setting, plusMinus, type){ //starting to handle too much
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
      currentQuestion: 0, //maybe set to 0 and have a default blank 0 thing cause of async rendering
      questionsToggle: Array(49).fill(true),
      winner: null, 
      questionPageDisplay: "none",  
      menuPageDisplay: "none",
    }
    var settings = Object.assign({},this.state.settings);
    settings.currentTeam = 1;
    state.settings = settings;


    this.setState(state);
  }

  modalOpenCloseHandleClick(modal) {
    var obj = {};
    obj[modal] = this.state[modal] == "none" ? "block" : "none";
    this.setState(obj);
  }

  componentDidMount(){
    window.onclick = (e) => {
      if (e.target.className == "modal") {
        this.setState({
          questionPageDisplay: "none",  
          menuPageDisplay: "none"
        })
      }
    } 
  }

  render() {
    var settings = this.state.settings;
    return(
      <div>
      <MenuBar 
        menuOnClick={() => this.modalOpenCloseHandleClick("menuPageDisplay")}
        navigationOnClick = {(plusMinus) => this.settingsHandleClick("currentTeam",plusMinus)}
        newGameOnClick = {() => this.reset()}
      />
      <ScoreBoard 
        score={this.state.score} 
        teams={this.state.settings.teams}
        currentTeam = {this.state.settings.currentTeam}
        scoreOnClick = {(setting, plusMinus, score) => this.settingsHandleClick(setting,plusMinus,score)} 
      />
      <QuestionBoard 
        onClick={(i) => this.handleClick(i)} 
        questions={this.state.questionsToggle} 
      />
      <MenuPage
        display={this.state.menuPageDisplay}
        settings={settings}
        closeOnClick={() => this.modalOpenCloseHandleClick("menuPageDisplay")}
        settingsOnClick = {(setting, plusMinus) => this.settingsHandleClick(setting,plusMinus)} 
      />
      <QuestionPage
        currentQuestion={this.state.currentQuestion}
        display={this.state.questionPageDisplay}
        timer = {this.state.settings.timer}
        closeOnClick={() => this.modalOpenCloseHandleClick("questionPageDisplay")}/>
      </div> 
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
