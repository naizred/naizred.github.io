import styles from '../styles/kalandmester.module.css';
import { fetchCharacterData } from '.';
    
function Kalandmester() {
    function handleCharacterNameSubmit(event) {
        fetchCharacterData(characterName.value)
    }
    return (
<div id='characterDetails' className={styles['character-details']}>
        <div>
                <label htmlFor='characterName' id='characterNameLabel'className={styles.characterNameLabel}>Keresett karakter neve:</label>
                <input id='characterName' className={styles.characterName} name='characterName'/>
          <span>
        <button className={styles.saveButton} onClick={handleCharacterNameSubmit} type='button'>Adatok lekérése</button>
        </span>
      <span>
        <label >Fp:</label>
        <input id='currentFp' name='currentFp' className={styles.currentPlayerInput}/>
        </span>
      <span>
        <label>Ép:</label>
        <input id='currentEp' name='currentEp' className={styles.currentPlayerInput}/>
      </span>
      <span>
        <label>Pp:</label>
        <input id='currentPp' name='currentPp' className={styles.currentPlayerInput}/>
      </span>
      <span>
        <label>Mp:</label>
        <input id='currentMp' name='currentMp' className={styles.currentPlayerInput}/>
      </span>
      <span>
        <label>Lp:</label>
            <input id='currentLp' name='currentLp' className={styles.currentPlayerInput} />
            <label className={styles.diceLabel}>Kockák:</label>
      </span>
      <span>
        <label className={styles.skillCheckResultLabel}>Támadó dobás eredménye:</label>
        <input id='atkRollResult'  />
            <input id='atkRollDice'  className={styles.lastRollDice } />
          </span>
          <span>
        <label className={styles.skillCheckResultLabel}>Támadó dobás eredménye 5sec múlva:</label>
        <input id='atkRollResultAfter5sec'  />
            <input id='atkRollDiceAfter5sec'  className={styles.lastRollDice } />
      </span>
      <span>
        <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye:</label>
        <input id='skillCheckResultOfCurrentPlayer'/>
        <input id='skillCheckDice' className={styles.lastRollDice }/>
          </span>
      <span>
        <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye 5sec múlva:</label>
        <input id='skillCheckResultAfter5sec'/>
        <input id='skillCheckDiceAfter5sec' className={styles.lastRollDice }/>
          </span>
        </div>
    </div>
    )
}

export default Kalandmester

