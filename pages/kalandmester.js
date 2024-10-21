import styles from "../styles/kalandmester.module.css";
import { fetchCharacterDataForAdventureMaster, fetchCharacterDataForAdventureMasterFirstIteration } from ".";
import { CharacterDetailsForAdventureMaster } from "../Components/CharacterDetailsForAdventureMaster";

function Kalandmester() {
  let gameIdInterval;
  function setGameIdInputInterval() {
    gameIdInterval = setInterval(() => {
      fetchCharacterDataForAdventureMaster(gameIdRequest.value)
    }, 500);
    setIntervalButton.disabled = true;
  }

  function removeGameIdInputInterval() {
    clearInterval(gameIdInterval);
    setIntervalButton.disabled = false;
  }
  function handleFirstIteration(){
    fetchCharacterDataForAdventureMasterFirstIteration(gameIdRequest.value)
  }
  return (
    <>
      <div className={styles.namesOfPlayers}>
        <input id="gameIdRequest" className={styles.characterName} />
        <li id="dataStorageLi"></li>
        <button
          id="setIntervalButton"
          className={styles.saveButton}
          onClick={setGameIdInputInterval}
          type="button">
          Harc!
        </button>
        <button
          id="removeIntervalButton"
          className={styles.saveButton}
          onClick={removeGameIdInputInterval}
          type="button">
          Harc vége!
        </button>
        <button
          id="firstIteraionButton"
          className={styles.saveButton}
          onClick={handleFirstIteration}
          type="button">
          Betöltés
        </button>
      </div>
        <div
          id="characterDetailsSection"
          className={styles.characterDetailsSection}>
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <div
            id="characterDetailsForInit"
            className={styles.characterDetailsForInit}>
            <span>
              <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
            <span>
            <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
            <span>
              <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
            <span>
              <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
            <span>
              <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
            <span>
              <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
            <span>
              <div
                id="characterNameForInit"
                className={styles.characterNameForInit}>
                </div>
              <div
                id="initiativeWithRoll"
                className={styles.initiativeWithRoll}></div>
              <div
                id="numberOfActionsAllPlayers"
                className={styles.numberOfActions}></div>
            </span>
          </div>
        </div>
    </>
  );
}

export default Kalandmester;
