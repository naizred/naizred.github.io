import styles from '../styles/kalandmester.module.css';
import { fetchCharacterData } from '.';
    
function Kalandmester() {
    function handleCharacterNameSubmit(event) {
        event.preventDefault()
        fetchCharacterData(characterName.value)
    }
    return (
<form id='characterDetails' className={styles['character-details']}>
                <label htmlFor='characterName' id='characterNameLabel'>Keresett karakter neve:</label>
                <input id='characterName' className={styles.characterName} name='characterName'/>
            <div>
        <button className={styles.saveButton} onClick={handleCharacterNameSubmit} type='button' form='characterDetails'>Adatok lekérése</button>
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
      <div>
        <label className={styles.skillCheckResultLabel}>Támadó dobás eredménye:</label>
        <input id='atkRollResult' />
      </div>
      <div>
        <label className={styles.skillCheckResultLabel}>Képzettségpróba végeredménye:</label>
        <input id='skillCheckResult' />
      </div>
    </form>
    )
}

export default Kalandmester

