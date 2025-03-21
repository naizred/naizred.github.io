import styles from "../styles/kalandmester.module.css";
import { CharacterDetailsForAdventureMaster } from "../Components/CharacterDetailsForAdventureMaster";
import io from "socket.io-client";
import { socket } from ".";

let currentCharNameNodes;
let currentFpNodes;
let currentEpNodes;
let currentPpNodes;
let currentMpNodes;
let currentLpNodes;
let atkRollResultNodes;
let skillCheckResultDmNodes;
let atkRollDiceNodes;
let skillCheckDiceNodes;
let numberOfActionsAllPlayers;
let initiativeWithRollNodes;
let characterNameForInitNodes;

function Kalandmester() {
  let socket = io();
  let gameIdInterval;

  socket.on("character updated from server", (updatedCharName) => {
    currentCharNameNodes = document.querySelectorAll("div#characterName");
    currentFpNodes = document.querySelectorAll("input#currentFp");
    currentEpNodes = document.querySelectorAll("input#currentEp");
    currentPpNodes = document.querySelectorAll("input#currentPp");
    currentMpNodes = document.querySelectorAll("input#currentMp");
    currentLpNodes = document.querySelectorAll("input#currentLp");
    atkRollResultNodes = document.querySelectorAll("input#atkRollResult");
    skillCheckResultDmNodes = document.querySelectorAll("input#skillCheckResultDm");
    atkRollDiceNodes = document.querySelectorAll("input#atkRollDice");
    skillCheckDiceNodes = document.querySelectorAll("input#skillCheckDice");
    numberOfActionsAllPlayers = document.querySelectorAll("div#numberOfActionsAllPlayers");
    initiativeWithRollNodes = document.querySelectorAll("div#initiativeWithRoll");
    characterNameForInitNodes = document.querySelectorAll("div#characterNameForInit");
    socket.emit("need sockets", gameIdRequest.value);
    socket.on("there you go", (allPlayersArray) => {
      console.log(allPlayersArray);
      let arrayToSortCharacterSequence = [];
      allPlayersArray.sort((a, b) => a.charId - b.charId);
      for (let i = 0; i < allPlayersArray.length; i++) {
        if (allPlayersArray[i].charName == updatedCharName) {
          //először karakter Id szerint sorba rendezzük
          for (let j = 0; j < currentCharNameNodes.length; j++) {
            if (updatedCharName == currentCharNameNodes[j].innerText) {
              let innerTextVariable = currentCharNameNodes[j].innerText;
              // currentCharNameNodes[j].animate([{ color: "white" }, { color: "black" }], 300);
              currentFpNodes[j].value = allPlayersArray[i].currentFp;
              currentEpNodes[j].value = allPlayersArray[i].currentEp;
              currentPpNodes[j].value = allPlayersArray[i].currentPp;
              currentMpNodes[j].value = allPlayersArray[i].currentMp;
              currentLpNodes[j].value = allPlayersArray[i].currentLp;
              atkRollResultNodes[j].value = allPlayersArray[i].atkRollResult;
              atkRollDiceNodes[j].value = allPlayersArray[i].atkRollDice;
              skillCheckResultDmNodes[j].value = allPlayersArray[i].skillCheckResult;
              skillCheckDiceNodes[j].value = allPlayersArray[i].skillCheckDice;
            }
          }
          // utána sorba rendezem kezdeményező és cselekedet szám szerint is
          for (let k = 0; k < characterNameForInitNodes.length; k++) {
            if (allPlayersArray[i].charName == characterNameForInitNodes[k].innerText) {
              characterNameForInitNodes[k].innerText = allPlayersArray[i].charName;
              numberOfActionsAllPlayers[k].innerText = `CS: ${allPlayersArray[i].numberOfActions}`;
              initiativeWithRollNodes[k].innerText = `CSA: ${allPlayersArray[i].initiativeWithRoll}`;
            }
          }
        }
      }
      for (let l = 0; l < characterNameForInitNodes.length; l++) {
        if (characterNameForInitNodes[l].innerText) {
          arrayToSortCharacterSequence.push({
            charName: characterNameForInitNodes[l].innerText,
            initiativeWithRoll: parseInt(initiativeWithRollNodes[l].innerText.slice(4)),
            numberOfActions: parseInt(numberOfActionsAllPlayers[l].innerText.slice(3)),
          });
        }
      }
      arrayToSortCharacterSequence.sort((a, b) => b.initiativeWithRoll - a.initiativeWithRoll);
      arrayToSortCharacterSequence.sort((a, b) => b.numberOfActions - a.numberOfActions);

      for (let m = 0; m < characterNameForInitNodes.length; m++) {
        if (characterNameForInitNodes[m].innerText) {
          if (characterNameForInitNodes[0].innerText != arrayToSortCharacterSequence[0].charName) {
            characterNameForInitNodes[0].parentElement.animate([{ backgroundColor: "white" }, { backgroundColor: "black" }], 300);
            setTimeout(() => {
              characterNameForInitNodes[0].parentElement.animate([{ backgroundColor: "white" }, { backgroundColor: "black" }], 300);
            }, 300);
          }
          if (characterNameForInitNodes[m].innerText != arrayToSortCharacterSequence[m].charName) {
            characterNameForInitNodes[m].innerText = arrayToSortCharacterSequence[m].charName;
            numberOfActionsAllPlayers[m].innerText = `CS: ${arrayToSortCharacterSequence[m].numberOfActions}`;
            initiativeWithRollNodes[m].innerText = `CSA: ${arrayToSortCharacterSequence[m].initiativeWithRoll}`;
          }
        } else {
          break;
        }
      }
    });
  });
  //setIntervalButton.disabled = true;

  function removeGameIdInputInterval() {
    clearInterval(gameIdInterval);
    setIntervalButton.disabled = false;
  }
  function handleFirstIteration() {
    currentCharNameNodes = document.querySelectorAll("div#characterName");
    currentFpNodes = document.querySelectorAll("input#currentFp");
    currentEpNodes = document.querySelectorAll("input#currentEp");
    currentPpNodes = document.querySelectorAll("input#currentPp");
    currentMpNodes = document.querySelectorAll("input#currentMp");
    currentLpNodes = document.querySelectorAll("input#currentLp");
    atkRollResultNodes = document.querySelectorAll("input#atkRollResult");
    skillCheckResultDmNodes = document.querySelectorAll("input#skillCheckResultDm");
    atkRollDiceNodes = document.querySelectorAll("input#atkRollDice");
    skillCheckDiceNodes = document.querySelectorAll("input#skillCheckDice");
    numberOfActionsAllPlayers = document.querySelectorAll("div#numberOfActionsAllPlayers");
    initiativeWithRollNodes = document.querySelectorAll("div#initiativeWithRoll");
    characterNameForInitNodes = document.querySelectorAll("div#characterNameForInit");
    socket.emit("need sockets", gameIdRequest.value);
    socket.on("there you go", (allPlayersArray) => {
      let data = {
        gameId: gameIdRequest.value,
      };
      socket.emit("create new player", data);
      for (let i = 0; i < allPlayersArray.length; i++) {
        //először karakter Id szerint sorba rendezzük
        if (!allPlayersArray[i].charName) {
          continue;
        }
        allPlayersArray.sort((a, b) => a.charId - b.charId);
        currentCharNameNodes[i].innerText = allPlayersArray[i].charName;
        currentFpNodes[i].value = allPlayersArray[i].currentFp;
        currentEpNodes[i].value = allPlayersArray[i].currentEp;
        currentPpNodes[i].value = allPlayersArray[i].currentPp;
        currentMpNodes[i].value = allPlayersArray[i].currentMp;
        currentLpNodes[i].value = allPlayersArray[i].currentLp;
        atkRollResultNodes[i].value = allPlayersArray[i].atkRollResult;
        atkRollDiceNodes[i].value = allPlayersArray[i].atkRollDice;
        skillCheckResultDmNodes[i].value = allPlayersArray[i].skillCheckResult;
        skillCheckDiceNodes[i].value = allPlayersArray[i].skillCheckDice;
        // utána sorba rendezem kezdeményező és cselekedet szám szerint is
        allPlayersArray.sort((a, b) => b.initiativeWithRoll - a.initiativeWithRoll);
        allPlayersArray.sort((a, b) => b.numberOfActions - a.numberOfActions);
        characterNameForInitNodes[i].innerText = allPlayersArray[i].charName;
        numberOfActionsAllPlayers[i].innerText = `CS: ${allPlayersArray[i].numberOfActions}`;
        initiativeWithRollNodes[i].innerText = `CSA: ${allPlayersArray[i].initiativeWithRoll}`;
      }
    });
    //fetchCharacterDataForAdventureMasterFirstIteration(gameIdRequest.value);
  }
  return (
    <>
      <div>
        <div className={styles.namesOfPlayers}>
          <input id="gameIdRequest" className={styles.characterName} />
          <li id="dataStorageLi"></li>
          <button id="setIntervalButton" className={styles.saveButton} type="button">
            Harc!
          </button>
          <button id="removeIntervalButton" className={styles.saveButton} onClick={removeGameIdInputInterval} type="button">
            Harc vége!
          </button>
          <button id="firstIteraionButton" className={styles.saveButton} onClick={handleFirstIteration} type="button">
            Betöltés
          </button>
        </div>
        <div id="characterDetailsSection" className={styles.characterDetailsSection}>
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <CharacterDetailsForAdventureMaster />
          <div id="characterDetailsForInit" className={styles.characterDetailsForInit}>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
            <span>
              <div id="characterNameForInit" className={styles.characterNameForInit}></div>
              <div id="initiativeWithRoll" className={styles.initiativeWithRoll}></div>
              <div id="numberOfActionsAllPlayers" className={styles.numberOfActions}></div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Kalandmester;
