/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React from 'react';
import EnigmaForm from './Enigma/Form';
import Scoreboard from './Scoreboard/Scoreboard';
import styles from './Styles/home.less';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showEnd: false };

    let that = this;

    this.onFormComplete = function () {
    
      that.setState({ showEnd: true });
    };
  }



  render() {
    return (<div className={styles.homepage}>

      <h1>Enigma Cipher</h1>
      <div id="instructions">
        <p>The enigma cipher was the secure method used to send and receive messages for the German Army. The technology used to enode and decode these messages was an astonishing accomplishment, which is why Alan Turing solving this cipher is an extraoridany achivement.</p>
        <p>The cipher was built in a machine using 3 rotors, each containing 26 letters of the alphabet. To randomize the message, each rotor could be configured to start at a random letter - which was then coordinated by paper flier by the Nazi Army. For this lesson, we only use AAA as the starting values.</p>

        <p>When a letter was typed on the enigma machine, the signal would pass through each of the 3 rotors. Each time the signal passed through a rotor, the letter changes using a simple substitution. After the signal passes through each rotor, the signal is fed through a circuit called the reflector. The reflector would simply feed the signal back through the rotors again. Once the circuit completes, the letter typed has gone through 7 tranformations.
        If that wasn&apos;t enough, the rotors change after each completed circuit. The rotor on the right would spin to the next letter until it completes its revolution and then triggers the middle rotor to do the same. Because of this, typing the same letter multiple times would yield in 3 seperate output values. It was this evolution in cipher encryption technology that made cracking the enigma so difficult.</p>
      </div>
      <EnigmaForm onComplete={this.onFormComplete} />
      <Scoreboard display={this.state.showEnd} />

    </div>
    )
  }
}
export default HomePage;

