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
  const plusMinus = [
    <button className="plus-minus" onClick={() => props.plusMinusOnClick("plus")}>+</button>,
    <button className="plus-minus" onClick={() => props.plusMinusOnClick("minus")}>-</button>
  ];

  return (
    <div className={scoreBoxClass}>
      {teamElement}
      <div
        className="flex-centered score"
        style={scoreHighlight}>
          {props.value}
      </div>
      {props.plusMinus === false ? "" : plusMinus}
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
        plusMinus={this.props.plusMinus}
      />;
    }
    return(
      <div className="flex-centered scoreboard">
        {scoreBoard}
      </div>     
    );
  }
}

function Square(props) {
  return (
    <button 
      class={props.class}
      onClick={props.onClick}
      style = {props.style}
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
        style = {{backgroundColor : this.props.questions[i] ? "white" : "transparent" }}
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
      <Modal id="menu-modal" closeOnClick={this.props.closeOnClick} >
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
                <MenuItem size="small" item="One"  value={this.props.items.one} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("one", plusMinus)}/>
                <MenuItem size="small" item="Two"  value={this.props.items.two} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("two", plusMinus)}/>
                <MenuItem size="small" item="Three"  value={this.props.items.three} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("three", plusMinus)}/>
                <MenuItem size="small" item="Four"  value={this.props.items.four} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("four", plusMinus)}/>
              </div>
            </span>
            <span>
              <div className="menu-grid" >
                <MenuItem size="small" item="Five"  value={this.props.items.five} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("five", plusMinus)}/>
                <MenuItem size="small" item="Steal Three"  value={this.props.items.stealThree} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("stealThree", plusMinus)}/>
                <MenuItem size="small" item="Steal Half"  value={this.props.items.stealHalf} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("stealHalf", plusMinus)}/>
                <MenuItem size="small" item="Enemies Half"  value={this.props.items.enemiesHalf} plusMinusOnClick={(plusMinus) => this.props.plusMinusOnClick("enemiesHalf", plusMinus)}/>
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
class FullText extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fontSize: 200,
      resize: true
    }
  }




  componentDidUpdate(){
    var element = document.getElementById(this.props.id);
    var fontSize = this.state.fontSize;
    if (this.state.resize && (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth))
      this.setState({fontSize: fontSize * 0.8});
    else if (this.state.resize)
      this.setState({resize: false})
  }


  componentDidMount(){
    this.componentDidUpdate(); 
    var oldOnResize = window.onresize;    
    window.onresize=()=> {
      this.setState({
        fontSize: 200,
        resize: true
      });
      if (typeof oldOnResize === "function")
        oldOnResize();
    }
  }

  componentWillUnmount(){
    window.onresize = null;
  }

  render() {
    const fontSize = this.state.fontSize + "px";
    var style = {
      fontSize: fontSize,
      height: "90%",
      width: "90%",
      textAlign: "center",
      whiteSpace: this.props.noWrap ? "nowrap" : "normal",      
    };

    return(
      <div id={this.props.id} class="flex-centered full-text" style={style}>
        <div>{this.props.children}</div>
      </div>
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
  render(){
    const currentQuestion = this.props.currentQuestion;
    const questionsIndex = currentQuestion > 0 ? currentQuestion-1: 0;
    const fontSize = this.state.fontSize + "px";
    var style = {fontSize: fontSize};

    const displayAnswer = (
    <div class="flex fill">
      <div class="flex-centered flex-content9">
        <FullText id="answerSize"> {questionsData[questionsIndex]["answer"]}</FullText>        
      </div>
      <div class="flex-content flex-centered">
        <button onClick={this.props.continueOnClick}>Continue</button>
      </div>
     </div>);

    var answerElement = (!this.state.answerVisible ? 
      <button onClick={() => this.answerOnClick()}>Answer</button> :
      displayAnswer);

    return (
      <Modal closeOnClick= {this.props.closeOnClick}>
        <div id="instructions" class="flex-centered instructions">
          <FullText id="instructionsSize">{questionsData[questionsIndex]["instructions"]}</FullText>
        </div>        
        <div class="flex-centered question">
          <FullText id="questionSize">{questionsData[questionsIndex]["question"]}</FullText>
          <span class="timer">
            <Timer timer={this.props.timer}/>
          </span>
        </div>
        <div class="flex-centered answer">
          {answerElement}
        </div>
        
      </Modal>
    )

  }
}
class TeamList extends React.Component{
  renderTeam(i) {
    return (
      <Square
        value={"Team "+ (i+1)}
        key = {i}
        class = "team-button"
        onClick = {() => this.props.teamOnClick(i)}
        style = {{backgroundColor : this.props.winner == i ? "green" : "white" }}
      />
    );
  }

  render (){
    var emptyTeamList = Array(this.props.teams).fill(null);
    var teamList = emptyTeamList.map((e,teamID) => this.renderTeam(teamID));
    

    return(
      <div class="flex-centered-column padding team-list">
        {teamList}
      </div>
    )
  }
}

class AnswerPage extends React.Component{

  render(){
    const currentQuestion = this.props.currentQuestion;
    const questionsIndex = currentQuestion > 0 ? currentQuestion-1: 0;

    return (
      <Modal closeOnClick= {this.props.closeOnClick}>
        <div class="flex-row">
          <div class="pick-team">
            <div class="flex-centered title"><FullText noWrap={true} id="whatever">Who won?</FullText></div>            
            <TeamList teamOnClick={this.props.teamOnClick} winner={this.props.winner} teams={this.props.teams} />            
          </div>
          <div class='flex-centered content-box'>
            <FullText id="answerSize"> {questionsData[questionsIndex]["answer"]}</FullText>
          </div>
        </div>        
      </Modal>
    )
  }
}

class PrizePage extends React.Component{
  render(){
    return (
      <Modal closeOnClick= {this.props.closeOnClick}>
        <div class="flex-centered-column full-size prize-page">
          <div class='flex-centered prize'>
            <FullText id="prizeSize"> {this.props.prize}</FullText>
          </div>
            <Square
              value={"Continue"}
              class = "team-button"
              onClick = {() => this.props.prizeOnClick()}
            />
        </div>        
      </Modal>
    )
  }
}

class StealPage extends React.Component{
  render(){

    return (
      <Modal closeOnClick= {this.props.closeOnClick}>
        <div class="steal-page flex-row">
          <div class="pick-team">
            <div class="flex-centered title"><FullText id="stealWho">Who won?</FullText></div>            
            <TeamList teamOnClick={this.props.teamOnClick} winner={this.props.winner} teams={this.props.teams} />            
          </div>
          <div class='flex-centered-column content-box'>
            <div class="flex-centered" style={{height: "30%", width: "100%", backgroundColor: "lightblue"}}>
              <ScoreBoard 
                score={this.props.score} 
                teams={this.props.teams}
                plusMinus = {false}
              />
            </div>
              <FullText id="answerSize"> {this.props.prize}</FullText>            
          </div>
          <div class="pick-team">
            <div class="flex-centered title"><FullText id="stealFrom">Steal from?</FullText></div>            
            <TeamList teamOnClick={this.props.stealFromOnClick} teams={this.props.teams} />            
          </div>
        </div>        
      </Modal>
    )
  }
}



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score:  Array(6).fill(0),
      turnNumber:0,                    
      currentTeam: 1,
      currentQuestion: 0, //maybe set to 0 and have a default blank 0 thing cause of async rendering
      questionsToggle: Array(49).fill(true),
      winner: null, 
      prize: null,
      currentModal: null,
      settings: {
        teams: 6,
        timer: 30,
      },
      items: {
        one: 10,
        two: 15,
        three: 20,
        four: 15,
        five: 10,
        stealThree: 10,
        stealHalf: 10,
        enemiesHalf: 5,
      }
    };
  }

  squareHandleClick(i){
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
    var items = Object.assign({},this.state.items);
    var state = {};
    var newState;
    state.score = score;
    state.settings = settings;
    state.items = items;
    
    if (type) 
      newState = score;
    else if (settings[setting])
      newState = settings;
    else
      newState = items;
    
    
    if (plusMinus == "plus")
      newState[setting] = newState[setting] + 1;
    else if (newState[setting] > 0)
      newState[setting] = newState[setting] - 1;
    
    if (setting === "teams" && newState[setting] < 2)
      newState[setting] = 2;

    //make sure score matches teams
    if (state.score.length < state.settings.teams)
      state.score[state.settings.teams-1] = 0;
    if (state.score.length > state.settings.teams)
      state.score.pop();


    this.setState(state);
  }

  navigationHandleClick(plusMinus) {
    var currentTeam = this.state.currentTeam;
    var turnNumber = this.state.turnNumber;

    if (plusMinus == "plus")
    turnNumber += 1;
    else if (turnNumber > 0)
    turnNumber -= 1;

    currentTeam = (turnNumber + 1) % this.state.settings.teams;
    if (currentTeam == 0)
      currentTeam = this.state.settings.teams;

    this.setState({
      currentTeam: currentTeam,
      turnNumber: turnNumber,
    });
  }

  reset() {
    var state = {
      score:  Array(6).fill(0),
      turnNumber:0,
      currentQuestion: 0, 
      questionsToggle: Array(49).fill(true),
      winner: null, 
      currentTeam: 1,
    }
    
    this.setState(state);
  }

  modalOpenCloseHandleClick(modal) {
    this.setState({currentModal: modal});
  }

  teamHandleClick(team){
    if (this.state.winner === team && this.state.currentModal === "answerPage"){
      var prize = this.pickPrize();
      var currentModal;
      

      switch (prize){
        case "stealThree":
        case "stealHalf":
          currentModal = "stealPage";
          break;
        
        default:
          currentModal = "prizePage";
          break;
      }

      this.setState({
        prize: prize,
        currentModal: currentModal
      });
    }
    else
      this.setState({winner: team});    
  }

  pickPrize (){
    
    const itemsState = Object.assign({},this.state.items);    
    var turnNumber = this.state.turnNumber+1;
    var rank = this.rankScore();
    var prize = ai();

    function ai(){
      var items = itemsState;
      const itemsValues = Object.values(items);
      const itemsNames = Object.keys(items);
      const reducer = (d,i) => d + i;
      const itemsTotal = itemsValues.reduce(reducer);
      const prize = Math.floor(Math.random() * itemsTotal);
      var prizeIterator = 0;
      var prizeIndex;

      for (let i=0; prizeIterator <= prize; i++){
        prizeIndex = i;
        prizeIterator = prizeIterator + itemsValues[i];
      }
      return itemsNames[prizeIndex];
    }

    return prize;

  }
  
  rankScore(){
    var scoreRanked = this.state.score.slice();
    scoreRanked.sort();
    scoreRanked.reverse();  

    var rank = this.state.score.map(score => scoreRanked.indexOf(score)+1);

    return rank;
  }

  calcPrize(targetTeam){
    if (this.state.winner === null)
    return;
    const winner = this.state.winner;
    var score = this.state.score.slice();

    var pointsStolen = 0;
    var addPoints = 0;

    switch (this.state.prize){
      case "stealHalf":
        pointsStolen = Math.round(score[targetTeam]/2);
      break;

      case "stealThree":
        pointsStolen = Math.min(3, score[targetTeam]);
      break;

      case "one":
      addPoints = 1;
      break;

      case "two":
        addPoints = 2;
      break;

      case "three":
        addPoints = 3;
      break;

      case "four":
        addPoints = 4;
      break;

      case "five":
        addPoints = 5;
      break;

      case "enemiesHalf":
        score = score.map((points) => Math.round(points/2));
        score[winner] = this.state.score[winner];
      break;  
    }
    score[winner] += addPoints + pointsStolen;
    if (targetTeam !== undefined)      
      score[targetTeam] -= pointsStolen;

    this.setState({
      currentModal: null,
      }, () => 
        setTimeout( () => {
          this.setState({
            score: score,
            winner: null,
            prize: null,
          },this.navigationHandleClick("plus"));
        }
     ,500)
    );
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
          items = {this.state.items}
          closeOnClick={() => this.modalOpenCloseHandleClick(null)}
          plusMinusOnClick = {(setting, plusMinus) => this.plusMinusHandleClick(setting,plusMinus)} />;
  
      case 'questionPage':
        return <QuestionPage
          currentQuestion={this.state.currentQuestion}
          timer = {this.state.settings.timer}
          closeOnClick={() => this.modalOpenCloseHandleClick(null)}
          continueOnClick = {() => this.modalOpenCloseHandleClick("answerPage")} />;

      case 'answerPage':
        return <AnswerPage 
          teams = {this.state.settings.teams}
          currentQuestion={this.state.currentQuestion}
          closeOnClick={() => this.modalOpenCloseHandleClick(null)} 
          teamOnClick = {(team) => this.teamHandleClick(team)}
          winner= {this.state.winner}/>;

      case 'prizePage':
        return <PrizePage
          prize={this.state.prize}
          closeOnClick={() => this.modalOpenCloseHandleClick(null)} 
          prizeOnClick = {() => this.calcPrize()}
          />
      case 'stealPage':
      return <StealPage
        teams = {this.state.settings.teams}
        prize={this.state.prize}
        closeOnClick={() => this.modalOpenCloseHandleClick(null)}
        teamOnClick = {(team) => this.teamHandleClick(team)}
        stealFromOnClick = {(target) => this.calcPrize(target)}
        winner= {this.state.winner}
        score = {this.state.score}        
        />
  
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
        navigationOnClick = {(plusMinus) => this.navigationHandleClick(plusMinus)}
        newGameOnClick = {() => this.reset()}
      />
      <div className="flex top-container">
        <ScoreBoard 
          score={this.state.score} 
          teams={this.state.settings.teams}
          currentTeam = {this.state.currentTeam}
          scoreOnClick = {(setting, plusMinus, score) => this.plusMinusHandleClick(setting,plusMinus,score)} 
        />
      </div>
      <QuestionBoard 
        onClick={(i) => this.squareHandleClick(i)} 
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
  
