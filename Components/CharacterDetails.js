// components/CharacterDetails.js
import styles from '../styles/styles.module.css';
import { rollOptions } from '../pages';
import { filteredArrayIfHasExtraReaction } from '../pages';
var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

function CharacterDetails() {
  let initRolled = false
  function handleInitiativeRoll() {
    useLegendPointForInitiativeRollCheckBox.style.display = 'grid'
    useLegendPointForInitiativeRollCheckBox.checked = false
    let initiativeRollResult = Math.floor(generator.random() * 10)
    let extraReaction = false
    if (filteredArrayIfHasExtraReaction.length!=0) {
      let extraReactionLevel = parseInt(filteredArrayIfHasExtraReaction[0].level);
      if (extraReactionLevel == 1) {
        if ([1, 2].includes(initiativeRollResult)) {
          extraReaction = true
        }
      } else if (extraReactionLevel == 2) {
        if ([1, 2, 3, 4].includes(initiativeRollResult)) {
          extraReaction = true
        }
      } else if (extraReactionLevel == 3) {
        if ([1, 2, 3, 4, 5, 6].includes(initiativeRollResult)) {
          extraReaction = true
        }
      }
    } else {
      extraReaction = false
    }
    initiativeRollResultSelect.value = initiativeRollResult
    if (initiativeRollResult == 0 || extraReaction == true) {
      initiativeRollResult = 10;
    }
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + initiativeRollResult;
    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1
    adjustActionsPositive.value = parseInt(numberOfActions.innerText) // a dobógomb value értékébe van elmentve a max cselekedetszám
    rollInitButton.style.display = "none"
    initRolled = true
  }

  function handleInitWhenLPisUsed() {
    initiativeRerollByCounterLP.style.display = 'grid'
    let initRollChangedByLP = parseInt(initiativeRollResultSelect.value)
    if (initRollChangedByLP == 0) {
      initRollChangedByLP = 10
    }
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + parseInt(initRollChangedByLP)
    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1
    initiativeRollResultSelect.disabled = true
    useLegendPointForInitiativeRollCheckBox.style.display = 'none'
  }

  function handleBossInitCounterLP() {
    let rerolledValue = Math.floor(generator.random() * 10)
    initiativeRollResultSelect.value = rerolledValue
    if (rerolledValue == 0) {
      rerolledValue = 10
    }
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + parseInt(rerolledValue)
    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1
    initiativeRerollByCounterLP.style.display = 'none'
  }

  function handleInitLPCheckBox() {
    if (useLegendPointForInitiativeRollCheckBox.checked == true)
    {
      initiativeRollResultSelect.disabled = false
    }
    if (useLegendPointForInitiativeRollCheckBox.checked == false) {
      initiativeRollResultSelect.disabled = true
    }
  }

  function handleAdjustActionsPositive() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1
      if (parseInt(numberOfActions.innerText) > parseInt(adjustActionsPositive.value) + 1) {
        numberOfActions.innerText = parseInt(adjustActionsPositive.value) + 1
      }
    }
    if (parseInt(numberOfActions.innerText) >= 2) {
      tacticsButton.disabled = false
    }
  }

  function handleAdjustActionsNegative() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
    }
    if (parseInt(numberOfActions.innerText) < 2) {
      tacticsButton.disabled = true
    }
    }
    
  function handleAdjustReactionsPositive() {
      if (parseInt(numberOfActions.innerText)>0) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
        numberOfReactions.innerText = parseInt(numberOfReactions.innerText) + 1
      }
    }

    function handleAdjustReactionsNegative() {
      if (parseInt(numberOfReactions.innerText)>0) {
        numberOfReactions.innerText = parseInt(numberOfReactions.innerText) - 1
      }
    }
let tacticsUsed = false
  function handleEndOfRound() {
    numberOfReactions.innerText = 0
    useLegendPointForInitiativeRollCheckBox.style.display = 'none'
    initiativeRerollByCounterLP.style.display = 'none'
    if (initRolled == true) {
      if (parseInt(numberOfActions.innerText) >= 0) {
        numberOfActions.innerText = adjustActionsPositive.value
      } else if (parseInt(numberOfActions.innerText) < 0) {
        numberOfActions.innerText = parseInt(adjustActionsPositive.value) + parseInt(numberOfActions.innerText)
      }
      if (tacticsUsed == true) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1
        tacticsUsed = false
      }
      if (parseInt(numberOfActions.innerText) >= 2) {
        tacticsButton.disabled = false
      } else if (parseInt(numberOfActions.innerText) < 2) {
        tacticsButton.disabled = true
      }
    }
    numberOfCurrentRound.innerText = parseInt(numberOfCurrentRound.innerText) + 1 + "."
  }

  function handleWhenTacticsUsed() {
    numberOfActions.innerText = 0
    tacticsUsed = true
    tacticsButton.disabled = true
  }

  function handleEndOfCombat() {
    numberOfReactions.innerText = 0
    rollInitButton.style.display = "grid"
    numberOfActions.innerText = ""
    initiativeWithRoll.innerText = ""
    numberOfCurrentRound.innerText = 1.
    tacticsButton.disabled = false
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
        <label className={styles.currentRound}>Kör</label>
        <div id='numberOfCurrentRound' className={styles.currentRound}>1.</div>
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
          className={styles.rollInitButton}
          onClick={handleInitiativeRoll}
          disabled = {false}
        >
          Dobj
        </button>
        <button id='tacticsButton' onClick={handleWhenTacticsUsed} className={styles.endOfCombatButton}>Taktika</button>
        <button onClick={handleEndOfRound}>Kör vége</button>
        <button id='initiativeRerollByCounterLP' onClick={handleBossInitCounterLP} className={styles.initiativeRerollByCounterLP}></button>
        <button className={styles.endOfCombatButton} onClick={handleEndOfCombat}>Harc vége</button>
        <div >Reakc. száma:</div>
        <div id="numberOfReactions" className={styles.numberOfActions}>0</div>
        <button id='adjustReactionsPositive' className={styles.adjustActions} onClick={handleAdjustReactionsPositive}>+</button>
        <button id='adjustReactionsNegative' className={styles.adjustActions} onClick={handleAdjustReactionsNegative}>-</button>
        <label className={styles.useLegendPointForInitiativeRollLabel}>Lp-t használok!</label>
        <select onChange={handleInitWhenLPisUsed} id='initiativeRollResultSelect' className={styles.initiativeRollResultSelect} disabled = {true}>
        {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
        </select>
        <input type='checkbox' id='useLegendPointForInitiativeRollCheckBox' className={styles.useLegendPointForInitiativeRollCheckBox} onChange={handleInitLPCheckBox}/>
    </div>
    </>
  );
}

export default CharacterDetails;