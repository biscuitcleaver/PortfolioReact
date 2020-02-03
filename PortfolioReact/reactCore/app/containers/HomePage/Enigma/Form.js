import React from 'react';
import axios from 'axios';
import styles from './Styles/enigma.less';

class Form extends React.Component {

  constructor(props) {
    super(props);
    this.rotor1 = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
    this.rotor2 = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
    this.rotor3 = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
    this.state = { round: 0, currentPuzzle: "", error: "", currentAnswer: "", setBtnDisable: true };
    this.handleStep0 = this.handleStep0.bind(this);
    this.handleQuizStep = this.handleQuizStep.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);

    this.onFormComplete = props.onComplete;
    
  }

  handleStep0() {
    document.getElementById("instructions").style.display = "none";
    document.getElementById("enigmaChart").style.display = "flex";

    axios.get('https://wandrsapp.com/puzzle/1')
      .then(res => {
        const puzzle1 = res.data;
        this.setState({ currentPuzzle: puzzle1, round: 1 });
      })
  }

  handleQuizStep() {
  
    const answer = this.state.currentAnswer;
    const that = this;
    axios.post("https://wandrsapp.com/puzzle",
      {
        Round: this.state.round,
        Answer: answer
      }).then(res => {
        if (res.hasOwnProperty("data")) {

          const data = res.data;
          if (data.isCorrect === false) {
            this.setState({ error: data.returnMsg + " answer correct. Try again!" });
          } else {
            this.setState({ error: null });
            let newRound = parseInt(that.state.round + 1);

            if (newRound <= 4) {

              axios.get('https://wandrsapp.com/puzzle/' + newRound)
                .then(res => {
                  document.getElementById("stepTwoAnswer").value = "";
                  this.setState({ currentPuzzle: res.data, round: newRound, currentAnswer: "" });
                });

            } else {
              this.setState({ round: 5 });
              document.getElementById("enigmaChart").style.display = "none";
              this.onFormComplete();
            }
          }
        }
      });
  }

  handleTextInput(e) {
    let answer = e.currentTarget.value;

    let disable = answer.length === 0;
    this.setState({ currentAnswer: answer, setBtnDisable: disable });
  }

  enigmaForm(props) {
    switch (props.round) {
      case 0:
        return (<button onClick={props.handleStep0} className={styles.enigmaBtn}>Begin</button>);
        break;
      case 1:
      case 2:
      case 3:
      case 4:
        return (
          <div className={styles.step2}>

            <div className={styles.formEntry}>
              <div className={styles.puzzle}> {props.currentPuzzle}</div>
              <input maxLength="26" id="stepTwoAnswer" onChange={props.handleTextInput} className={styles.txtInput} placeholder="Enter Answer" />
              <button onClick={props.handleStep1} disabled={(props.disabled) ? "disabled" : ""} className={styles.enigmaBtn}>Guess</button>
            </div>
          </div>
        );
        break;
      case 5:
        return (<div><h2>Congratulations!</h2><p>You have completed all 4 challenges.</p></div>);
        break;
    }

  }

  enigmaChart(props) {
    const code = (ch) => { return ch ? ch.toUpperCase().charCodeAt(0) - 65 : ""; };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

    const reflectedRotor3 = "UWYGADFPVZBECKMTHXSLRINQOJ";
    const reflectedRotor2 = "AJPCZWRLFBDKOTYUQGENHXMIVS";
    const reflectedRotor1 = "TAGBPCSDQEUFVNZHYIXJWLRKOM";



    const rotor = (chr, r, offset) => {
      const key = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIWGAKMUSQO",
        "ESOVPZJAYQUIRHXLNFTGKDCMWB", "VZBRGITYUPSDNHLXAWMJQOFECK", "JPGVOUMFYQBENHZRDKASXLICTW",
        "NZJHGRCXMYSWBOUFAIVLPEKQDT", "FKQHTLXOCBJSPDZRAMEWNIUYGV",
        "UWYGADFPVZBECKMTHXSLRINQOJ", "AJPCZWRLFBDKOTYUQGENHXMIVS", "TAGBPCSDQEUFVNZHYIXJWLRKOM",
        "HZWVARTNLGUPXQCEJMBSKDYOIF", "QCYLXWENFTZOSMVJUDKGIARPHB", "SKXQLHCNWARVGMEBJPTYFDZUIO",
        "QMGYVPEDRCWTIANUXFKZOSLHJB", "QJINSAYDVKBFRUHMCPLEWZTGXO"];
      var chcode = (code(chr) + 26 + offset) % 26;
      var mapch = (code(key[r].charAt(chcode)) + 26 - offset) % 26 + 65;
      return String.fromCharCode(mapch);
    };


    const ansNoSpce = props.answer.toUpperCase().replace(/ /g, "");
    const wrappedStr = props.rotor1.slice(0, ansNoSpce.length - 1);
    let updatedRotor = props.rotor1.replace(wrappedStr, "");
    const lstKey = ansNoSpce[ansNoSpce.length - 1];
    updatedRotor = props.rotor1;

    const rotors = [0, 1, 2];
    const key = [0, 0, ansNoSpce.length];
    const ring = [0, 0, 0];

    const rotor1Let = rotor(lstKey, rotors[2], key[2] - ring[2]);
    const rotor2Let = rotor(rotor1Let, rotors[1], key[1] - ring[1]);
    const rotor3Let = rotor(rotor2Let, rotors[0], key[0] - ring[0]);

    const refIndx = alphabet.indexOf(rotor3Let);
    const refLet = reflector[refIndx];

    const refRot3Let = rotor(refLet, rotors[0] + 8, key[0] - ring[0]);
    const refRot2Let = rotor(refRot3Let, rotors[1] + 8, key[1] - ring[1]);

    const refRot1Let = rotor(refRot2Let, rotors[2] + 8, key[2] - ring[2]);


    const alphaRen = alphabet.replace(lstKey, "<u>" + lstKey + "</u>");
    const rotor1Ren = updatedRotor.replace(rotor1Let, "<u>" + rotor1Let + "</u>");
    const rotor2Ren = props.rotor2.replace(rotor2Let, "<u>" + rotor2Let + "</u>");
    const rotor3Ren = props.rotor3.replace(rotor3Let, "<u>" + rotor3Let + "</u>");
    const refRen = reflector.replace(refLet, "<u>" + refLet + "</u>");
    const refRotor3Ren = reflectedRotor3.replace(refRot3Let, "<u>" + refRot3Let + "</u>");
    const refRotor2Ren = reflectedRotor2.replace(refRot2Let, "<u>" + refRot2Let + "</u>");
    const refRotor1Ren = reflectedRotor1.replace(refRot1Let, "<u>" + refRot1Let + "</u>");

    return (<div id="enigmaChart" className={styles.chartFlex}>
      <div className={styles.chart}>
        <div><strong>Rotors #1</strong></div>
        <div><strong>Rotors :</strong> <span dangerouslySetInnerHTML={{ __html: alphaRen }} /> </div>
        <div><strong>Rotor 1:</strong> <span dangerouslySetInnerHTML={{ __html: rotor1Ren }} /></div>
        <div><strong>Rotor 2:</strong> <span dangerouslySetInnerHTML={{ __html: rotor2Ren }} /></div>
        <div><strong>Rotor 3:</strong> <span dangerouslySetInnerHTML={{ __html: rotor3Ren }} /></div>
      </div>

      <div className={styles.chart}>
        <div><strong>Reflector</strong></div>
        <div><span dangerouslySetInnerHTML={{ __html: refRen }} /></div>
      </div>

      <div className={styles.chart}>
        <div><strong>Rotors #2</strong></div>
        <div><strong>Rotor 3:</strong> <span dangerouslySetInnerHTML={{ __html: refRotor3Ren }} /></div>
        <div><strong>Rotor 2:</strong> <span dangerouslySetInnerHTML={{ __html: refRotor2Ren }} /></div>
        <div><strong>Rotor 1:</strong> <span dangerouslySetInnerHTML={{ __html: refRotor1Ren }} /></div>
      </div>

    </div>);
  };

  render() {
    return (<div>
      <h2 style={(this.state.round === 0 || this.state.round === 5) ? { display: 'none' } : { display: 'block' }}>Round {this.state.round}</h2> <br />

      <this.enigmaChart
        rotor1={this.rotor1}
        rotor2={this.rotor2}
        rotor3={this.rotor3}
        className={styles.enigmaChart} answer={this.state.currentAnswer} />

      <this.enigmaForm round={this.state.round}
        disabled={this.state.setBtnDisable}
        currentPuzzle={this.state.currentPuzzle}
        handleTextInput={this.handleTextInput}
        handleStep0={this.handleStep0}
        handleStep1={this.handleQuizStep}
        round={this.state.round}
      />

      <p className={styles.error} id="formError">{this.state.error}</p>
    </div>);
  }
}


export default Form;
