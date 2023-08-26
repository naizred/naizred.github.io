// components/CharacterDetails.js
import styles from '../styles/styles.module.css';

function CharacterDetails() {     
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
    <form id='characterDetails' onSubmit={handleDataToBeSent} className={styles['character-details']}>
      <div>
        <p></p>
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
      <button type='submit'>Karakteradatok mentése</button> 
    </form>
  );
}

export default CharacterDetails;