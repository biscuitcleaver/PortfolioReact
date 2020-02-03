import React from 'react';
import axios from 'axios';
import styles from './Styles/Scoreboard.less';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      scores: [],
      display: props.display,
      PostSubmit: false
    };

    this.refreshList = () => {

      axios.get('https://wandrsapp.com/scoreboard/').then(res => {

        let allInitials = res.data.map(a => a.initials);
        this.setState({ scores: allInitials });
      });
    };

    let that = this;

    this.handleTextInput = (e) => {
      let answer = e.currentTarget.value;

      let disable = answer.length === 0;
      this.setState({ currentInitials: answer, setBtnDisable: disable });
    }

    this.submitInitials = () => {
      const _initials = this.state.currentInitials;
      const that = this;
      axios.post("https://wandrsapp.com/scoreboard",
        {
          initials: _initials
        }).then(res => {
            that.setState({
              PostSubmit: true
            });

            that.refreshList();

        }).catch(function (error) {

          that.setState({ error: "Initials entry is not valid. Please use 3 letters only" });
        });
    }

    this.refreshList();

  }


  componentDidUpdate(prevProps) {

    if (prevProps.display !== this.props.display) {
      this.setState({ display: this.props.display });
    }
  }

  render() {
    const scoreList = this.state.scores.map(function (item, index) {
      return <li key={index}> {item} </li>;
    });
    return (
      <div  className={this.state.display ? styles.showForm : styles.hideForm}>
        <h2>Scoreboard</h2>
        <p>Congratulations! You're eligible to enter our leaderboard. Here are the most recent winners:</p>
        <ul className={styles.scoreList}>
          {scoreList}
        </ul>

        <div className={this.state.PostSubmit == false ? styles.showForm : styles.hideForm}>
          <input maxLength="26" id="scoreBoard" onChange={this.handleTextInput} className={styles.txtInput} placeholder="Enter Initials" />
          <button onClick={this.submitInitials} disabled={(this.state.setBtnDisable) ? "disabled" : ""} className={styles.enigmaBtn}>Submit</button>
          <p className={styles.error} id="formError">{this.state.error}</p>
        </div>

        <div className={this.state.PostSubmit ? styles.showForm : styles.hideForm}>
            You've been added to the leaderboard! 
        </div>
      </div>
    );
  }
}

export default Scoreboard;
