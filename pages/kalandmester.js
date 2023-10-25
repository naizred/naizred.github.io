import styles from '../styles/kalandmester.module.css';
import { fetchCharacterDataForAdventureMaster } from '.';
    
function Kalandmester() {

  function handleCharacterNameSubmit(event) {

    let currentFpNodes = document.querySelectorAll('input#currentFp')
    let currentEpNodes = document.querySelectorAll('input#currentEp')
    let currentPpNodes = document.querySelectorAll('input#currentPp')
    let currentMpNodes = document.querySelectorAll('input#currentMp')
    let currentLpNodes = document.querySelectorAll('input#currentLp')
    let numberOfActionsAllPlayers = document.querySelectorAll('div#numberOfActionsAllPlayers');
    
 
    fetchCharacterDataForAdventureMaster(parseInt(event.target.parentElement.firstChild.value))
    
}
    
  return (
    <div className={styles.adventureMaster}>
      <div className={styles.namesOfPlayers}>
      <input id='characterName' className={styles.characterName} name='characterName'/>
      <button className={styles.saveButton} onClick={handleCharacterNameSubmit} type='button'>Adatok lekérése</button>
      </div>
      <div id='characterDetailsSection' className={styles.characterDetailsSection}>
      <div id='characterDetails1' className={styles.characterDetails}>
          <div>
            <label htmlFor='characterName' id='characterNameLabel' className={styles.characterNameLabel}>Keresett karakter neve:</label>
            <input id='characterName' className={styles.characterName} name='characterName' />
            <span>
              <div id='numberOfActionsAllPlayers' className={styles.numberOfActions}>
              </div>
            </span>
            <span>
              <label >Fp:</label>
              <input id='currentFp' name='currentFp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Ép:</label>
              <input id='currentEp' name='currentEp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Pp:</label>
              <input id='currentPp' name='currentPp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Mp:</label>
              <input id='currentMp' name='currentMp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Lp:</label>
              <input id='currentLp' name='currentLp' className={styles.currentPlayerInput} />
              <label className={styles.diceLabel}>Kockák:</label>
            </span>
            <span>
              <label className={styles.skillCheckResultLabel}>Támadó dobás eredménye:</label>
              <input id='atkRollResult' />
              <input id='atkRollDice' className={styles.lastRollDice} />
            </span>
            <span>
              <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye:</label>
              <input id='skillCheckResultOfCurrentPlayer' />
              <input id='skillCheckDice' className={styles.lastRollDice} />
            </span>
            <span>
              <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye 5sec múlva:</label>
              <input id='skillCheckResultAfter5sec' />
              <input id='skillCheckDiceAfter5sec' className={styles.lastRollDice} />
            </span>
          </div>
        </div>
        <div id='characterDetails2' className={styles.characterDetails}>
          <div>
            <label htmlFor='characterName' id='characterNameLabel' className={styles.characterNameLabel}>Keresett karakter neve:</label>
            <input id='characterName' className={styles.characterName} name='characterName' />
            <span>
              <div id='numberOfActionsAllPlayers' className={styles.numberOfActions}>
              </div>
            </span>
            <span>
              <label >Fp:</label>
              <input id='currentFp' name='currentFp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Ép:</label>
              <input id='currentEp' name='currentEp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Pp:</label>
              <input id='currentPp' name='currentPp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Mp:</label>
              <input id='currentMp' name='currentMp' className={styles.currentPlayerInput} />
            </span>
            <span>
              <label>Lp:</label>
              <input id='currentLp' name='currentLp' className={styles.currentPlayerInput} />
              <label className={styles.diceLabel}>Kockák:</label>
            </span>
            <span>
              <label className={styles.skillCheckResultLabel}>Támadó dobás eredménye:</label>
              <input id='atkRollResult' />
              <input id='atkRollDice' className={styles.lastRollDice} />
            </span>
            <span>
              <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye:</label>
              <input id='skillCheckResultOfCurrentPlayer' />
              <input id='skillCheckDice' className={styles.lastRollDice} />
            </span>
            <span>
              <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye 5sec múlva:</label>
              <input id='skillCheckResultAfter5sec' />
              <input id='skillCheckDiceAfter5sec' className={styles.lastRollDice} />
            </span>
          </div>
        </div>
      </div>
      </div>
  ) 
}

export default Kalandmester

