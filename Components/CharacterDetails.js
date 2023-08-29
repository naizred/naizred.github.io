// components/CharacterDetails.js
import styles from '../styles/styles.module.css';

var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

function CharacterDetails() {
  let initRolled = false
  function handleInitiativeRoll() {
    let initiativeRollResult = Math.floor(generator.random() * 10)
    if (initiativeRollResult == 0) {
      initiativeRollResult = 10;
    }
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + initiativeRollResult;
    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiative.innerText) + initiativeRollResult) / 10) + 1
    adjustActionsPositive.value = parseInt(numberOfActions.innerText) // a dobógomb value értékébe van elmentve a max cselekedetszám
    rollInitButton.style.display = "none"
    initRolled = true
  }

  function handleAdjustActionsPositive() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1
      if (parseInt(numberOfActions.innerText) > adjustActionsPositive.value) {
        numberOfActions.innerText = adjustActionsPositive.value
      }
    }
  }
  function handleAdjustActionsNegative() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
    }
  }

  function handleEndOfRound() {
    if (initRolled == true) {
      if (parseInt(numberOfActions.innerText) >= 0) {
        numberOfActions.innerText = adjustActionsPositive.value
      } else if (parseInt(numberOfActions.innerText) < 0) {
        numberOfActions.innerText = parseInt(adjustActionsPositive.value) + parseInt(numberOfActions.innerText)
      }
    }
  }

  function handleEndOfCombat() {
    rollInitButton.style.display = "grid"
    numberOfActions.innerText = ""
    initiativeWithRoll.innerText = ""
}

  async function handleDataToBeSent(event) {
    event.preventDefault();
    const data = {
      charName: charName.innerText,
      currentFp: parseInt(event.target.currentFp.value),
      currentEp: parseInt(event.target.currentEp.value),
      currentPp: parseInt(event.target.currentPp.value),
      currentMp: parseInt(event.target.currentMp.value),
      currentLp: parseInt(event.target.currentLp.value)
    };

    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/updateCharacter";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };  
    await fetch(endpoint, options);  
}
  return (
    <>
    <form id='characterDetails' onSubmit={handleDataToBeSent} className={styles['character-details']}>
      <div>
        <button className={styles.saveButton} type='submit' form='characterDetails'>Adatok mentése</button>
        <p id='maxValues'>Max</p>
        <p id='currentValues'>Akt</p>
        </div>
      <div>
        <label>Fp:</label>
        <p id='maxFp'></p>
        <input id='currentFp' />
        </div>
      <div>
        <label>Ép:</label>
        <p id='maxEp'></p>
        <input id='currentEp' />
      </div>
      <div>
        <label>Pp:</label>
        <p id='maxPp'></p>
        <input id='currentPp' />
      </div>
      <div>
        <label>Mp:</label>
        <p id='maxMp'></p>
        <input id='currentMp' />
      </div>
      <div>
        <label>Lp:</label>
        <p id='maxLp'></p>
        <input id='currentLp' />
      </div>
    </form>
    <div id="actionsWrapper" className={styles.actionsWrapper}>
        <div className={styles.init}>KÉ:</div>
        <div className={styles.stats}>CSA:</div>
        <div className={styles.stats} id='initiative'></div>
        <div className={styles.stats} id='initiativeWithRoll'></div>
        <div >CS. száma:</div>
        <div id="numberOfActions" className={styles.numberOfActions}></div>
        <button id='adjustActionsPositive' className={styles.adjustActions} onClick={handleAdjustActionsPositive}>+</button>
        <button id='adjustActionsNegative' className={styles.adjustActions} onClick={handleAdjustActionsNegative}>-</button>
        <button type=""
          id="rollInitButton"
          className={styles.rollButton}
          onClick={handleInitiativeRoll}
          disabled = {false}
        >
          Dobj
        </button>
        <button onClick={handleEndOfRound}>Kör vége</button>
        <button className={styles.endOfCombatButton} onClick={handleEndOfCombat}>Harc vége</button>
    </div>
    </>
  );
}

export default CharacterDetails;