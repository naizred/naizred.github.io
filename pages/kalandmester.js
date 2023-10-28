import styles from '../styles/kalandmester.module.css';
import { fetchCharacterDataForAdventureMaster, returnedData } from '.';
    
function Kalandmester() {

  function handleCharacterNameSubmit(event) {

    fetchCharacterDataForAdventureMaster(parseInt(event.target.parentElement.firstChild.value))

}
    
  return (<>
      <div className={styles.namesOfPlayers}>
      <input id='gameIdRequest' className={styles.characterName}/>
      <button className={styles.saveButton} onClick={handleCharacterNameSubmit} type='button'>Adatok lekérése</button>
      </div>
    <div className={styles.adventureMaster}>
      <div id='characterDetailsSection' className={styles.characterDetailsSection}>
      <div id='characterDetails1' className={styles.characterDetails}>
          <div>
            <label htmlFor='characterName' id='characterNameLabel' className={styles.characterNameLabel}>Keresett karakter neve:</label>
            <input id='characterName' className={styles.characterName} name='characterName' />
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
        <div id='characterDetails2' className={styles.characterDetailsForInit}>

            <span>
            <input id='characterNameForInit' className={styles.characterNameForInit} />
            <div id='initiativeWithRoll' className={styles.initiativeWithRoll}>
              </div>
              <div id='numberOfActionsAllPlayers' className={styles.numberOfActions}>
              </div>
            </span>
            <span>
            <input id='characterNameForInit' className={styles.characterNameForInit} />
            <div id='initiativeWithRoll' className={styles.initiativeWithRoll}>
              </div>
              <div id='numberOfActionsAllPlayers' className={styles.numberOfActions}>
              </div>
            </span>
            <span>
            <input id='characterNameForInit' className={styles.characterNameForInit} />
            <div id='initiativeWithRoll' className={styles.initiativeWithRoll}>
              </div>
              <div id='numberOfActionsAllPlayers' className={styles.numberOfActions}>
              </div>
            </span>
            <span>
            <input id='characterNameForInit' className={styles.characterNameForInit} />
            <div id='initiativeWithRoll' className={styles.initiativeWithRoll}>
              </div>
              <div id='numberOfActionsAllPlayers' className={styles.numberOfActions}>
              </div>
            </span>
        </div>
      </div>
      </div>
      </>) 
}

export default Kalandmester

