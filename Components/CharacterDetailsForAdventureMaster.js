import styles from '../styles/kalandmester.module.css';

export function CharacterDetailsForAdventureMaster (){
    return (
        <>       
        <div id="characterDetails1" className={styles.characterDetails}>
          <div
            id="characterName"
            className={styles.characterName}>
            </div>
          <div className={styles.currentPlayerWrapper}>
            <label>Fp:</label>
            <label>Ép:</label>
            <label>Pp:</label>
            <label>Mp:</label>
            <label>Lp:</label>
            <input
              id="currentFp"
              name="currentFp"
              className={styles.currentPlayerInput}
            />                           
            <input
              id="currentEp"
              name="currentEp"
              className={styles.currentPlayerInput}
            />                            
            <input
              id="currentPp"
              name="currentPp"
              className={styles.currentPlayerInput}
            />                            
            <input
              id="currentMp"
              name="currentMp"
              className={styles.currentPlayerInput}
            />              
            <input
              id="currentLp"
              name="currentLp"
              className={styles.currentPlayerInput}
            />                
          </div>
          <span>
            <label className={styles.skillCheckResultLabel}>TÉO:</label>
            <input id="atkRollResult" className={styles.resultInput}/>
            <input id="atkRollDice" className={styles.lastRollDice} />
          </span>
          <span>
            <label className={styles.skillCheckResultLabel}>Próba:</label>
            <input id="skillCheckResultDm" className={styles.resultInput}/>
            <input id="skillCheckDice" className={styles.lastRollDice} />
          </span>
      </div>
        </>
    )
}