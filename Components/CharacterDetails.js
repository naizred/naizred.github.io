import styles from '../styles/chardetails.module.css';
import { setDiceRolledToFalse, chargeWasUsedThisRound, chargeWasUsedThisRoundToFalse, currentlySelectedWeapon, rollOptions, checkIfWeaponIsRanged, combinationWasUsedThisRoundSetToFalse, combinationWasUsedThisRound, twoWeaponAttackWasUsedThisRound, twoWeaponAttackWasUsedThisRoundToFalse, twoWeaponAttackModifiers, twoWeaponAttackModifiersIndex, reloadIsNeeded, reloadIsNeededSetToFalse, toggleAllallActionBarButtonsExceptInitRollDisplay, allResultsCleaner } from '../pages';
import { filteredArrayIfHasExtraReaction, arrayOfAllComplexMaeuvers, quickShotModifiers, quickShotModifiersIndex, combinationModifiers, combinationModifiersIndex, allActiveBuffs} from '../pages';
import { theRoundChiCombatWasUsedIn, activeBuffsArray, buffRemoverFromActiveBuffArrayAndTextList, psiPointCostCheckerAndSetter, chiCombatAtkDefModifier, chiCombatAtkDefModifierNullifier } from './PsiDisciplines';
import {
  chargeToFalse, hmoModified, hmoModifiedToFalse, hmoModifier, totalActionCostOfAttackSetter, twoWeaponAttackToFalse, findWeakSpotOn, findWeakSpotOnToFalse, findWeakSpotModifier, findWeakSpotModifierNullifier
} from './ActionsList';
import { spellCastingSuccessful, spellCastingFailure, actionsSpentSinceLastCastAdderCheckerAndNullifier, spellIsBeingCast } from './Spells';
export let initRolled = false
export let chiCombatEndedDueToLackOfPsiPoints = false
export let activeBuffsCounter = 0
export async function updateCharacterData(gameIdUpdate=false) {

  let activeBuffsStringToSave = ""
  activeBuffsCounter = 0
  for (let i = 0; i < allActiveBuffs.length; i++) {
    if (allActiveBuffs[i].innerText!="") {
      activeBuffsStringToSave += `${allActiveBuffs[i].innerText}|`
      activeBuffsCounter++
    }
  }

  activeBuffsStringToSave = activeBuffsCounter + activeBuffsStringToSave

  let data = {
      charName: charName.innerText,
      currentFp: parseInt(currentFp.value),
      currentEp: parseInt(currentEp.value),
      currentPp: parseInt(currentPp.value),
      currentMp: parseInt(currentMp.value),
      currentLp: parseInt(currentLp.value),
      activeBuffs: activeBuffsStringToSave,
      numberOfActions: numberOfActions.innerText,
      initiativeWithRoll: parseInt(initiativeWithRoll.innerText)
    };
  
  if (gameIdUpdate == true) {
    data = {
      charName: charName.innerText,
      gameId: parseInt(gameIdInput.value)
    };
  }



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
var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();
let actionsLostWithTacticsUsed = 0
function CharacterDetails() {
  function handleInitiativeRoll() {

    toggleAllallActionBarButtonsExceptInitRollDisplay('grid')
    allResultsCleaner()

    for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
      if (arrayOfAllComplexMaeuvers[i].disabled == true && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==false) {
        arrayOfAllComplexMaeuvers[i].disabled = false
        if (weapons.value.includes('kétkézzel') || weapons.value.includes('Kétkezes') || weapons.value.includes('Pallos') || weapons.value.includes('Alabárd')) {
          twoWeaponAttackRadioButton.disabled = true
        } else {
          twoWeaponAttackRadioButton.disabled = false
        }
      } 
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==true) {
        arrayOfAllComplexMaeuvers[i].disabled == true
      }
      if (!weapons.value.includes('Ököl')) {
        wrestlingRadioButton.disabled = true
      }
      if (weapons.value.includes('Ököl')) {
        wrestlingRadioButton.disabled = false
      }
    }

    initiativeRerollByCounterLP.style.display = 'none'
    reloadButton.disabled = true
    weapons.disabled = true
    offHand.disabled = true
    setDiceRolledToFalse()
    tacticsButton.disabled = false
    initiativeRollLegendPointCheckBox.style.display = 'grid'
    initiativeRollLegendPointCheckBox.checked = false
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
    adjustActionsPositive.value = parseInt(numberOfActions.innerText) // a adjustActionsPositive gomb value értékébe van elmentve a max cselekedetszám
    initRollButton.style.display = "none"
    initRolled = true
    updateCharacterData()

    // megfigyeli az akciók változását
    //*********************************** */
    let observer = new MutationObserver(async() => {
      updateCharacterData()
    })
    observer.observe(numberOfActions, {childList:true, subtree:true});
  }
  
  function handleInitWhenLPisUsed() {
    initiativeRerollByCounterLP.style.display = 'grid'
    let initRollChangedByLP = parseInt(initiativeRollResultSelect.value)
    if (initRollChangedByLP == 0) {
      initRollChangedByLP = 10
    }
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + parseInt(initRollChangedByLP)
    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1
    adjustActionsPositive.value = parseInt(numberOfActions.innerText)
    initiativeRollResultSelect.disabled = true
    initiativeRollLegendPointCheckBox.style.display = 'none'
  }

  function handleBossInitCounterLP() {
    let rerolledValue = Math.floor(generator.random() * 10)
    initiativeRollResultSelect.value = rerolledValue
    if (rerolledValue == 0) {
      rerolledValue = 10
    }
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + parseInt(rerolledValue)
    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1
    adjustActionsPositive.value = parseInt(numberOfActions.innerText)
    initiativeRerollByCounterLP.style.display = 'none'
  }

  function handleInitLPCheckBox() {
    if (initiativeRollLegendPointCheckBox.checked == true)
    {
      initiativeRollResultSelect.disabled = false
    }
    if (initiativeRollLegendPointCheckBox.checked == false) {
      initiativeRollResultSelect.disabled = true
    }
  }

  function handleAdjustActionsPositive() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1
      if (parseInt(numberOfActions.innerText) > parseInt(adjustActionsPositive.value) + 1) {
        numberOfActions.innerText = parseInt(adjustActionsPositive.value) + 1
      }
    
      if (parseInt(numberOfActions.innerText) >= 2) {
        tacticsButton.disabled = false
      }
    }
  }

  function handleAdjustActionsNegative() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
      if (parseInt(numberOfActions.innerText) < 2) {
        tacticsButton.disabled = true
        attackRollButton.disabled = true
      }
      if (combinationWasUsedThisRound == true && parseInt(numberOfActions.innerText) < 3) {
        attackRollButton.disabled = true
      }
      actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
      spellCastingFailure()
    }
    }
    
  function handleAdjustReactionsPositive() {
      if (parseInt(numberOfActions.innerText)>0) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
        numberOfReactions.innerText = parseInt(numberOfReactions.innerText) + 1
        actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
        spellCastingFailure()
    }
    if (parseInt(numberOfActions.innerText) < 2) {
      attackRollButton.disabled = true
      tacticsButton.disabled = true
    }
    if (combinationWasUsedThisRound == true && parseInt(numberOfActions.innerText) < 3) {
      attackRollButton.disabled = true
    }
    }
  
  let tacticsUsed = false
  //**************************************************************** */
  // a köt végének kezelése
  //****************************************************************** */
  function handleEndOfRound() {
    if (combinationRadioButton.checked == true || quickShotRadioButton.checked == true) {
      totalActionCostOfAttackSetter(-1)
    }

    if (chargeWasUsedThisRound == true) {
      chargeWasUsedThisRoundToFalse()
      charDef.value = parseFloat(charDef.value) +1
      charDefWithParry.value = parseFloat(charDefWithParry.value) +1
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1
      chargeRadioButton.disabled = false
    }
    if (chargeWasUsedThisRound == false && chargeRadioButton.checked == true) {
      charAtk.value = parseFloat(charAtk.value) -1
      charDef.value = parseFloat(charDef.value) +1
      charDefWithParry.value = parseFloat(charDefWithParry.value) +1
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1
    }
    if (twoWeaponAttackWasUsedThisRound == true) {
      twoWeaponAttackWasUsedThisRoundToFalse()
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
    }
    if (twoWeaponAttackWasUsedThisRound == false && twoWeaponAttackRadioButton.checked == true) {
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
    }
    twoWeaponAttackToFalse()
    chargeToFalse()
    setDiceRolledToFalse()
    for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
      if (arrayOfAllComplexMaeuvers[i].checked == true) {
        arrayOfAllComplexMaeuvers[i].checked = false
      }     
    }
   
    if (parseInt(numberOfActions.innerText)<0) {
      actionsSpentSinceLastCastAdderCheckerAndNullifier(Math.abs(parseInt(numberOfActions.innerText)))
    }
    if (parseInt(numberOfActions.innerText) > 0) {
      actionsSpentSinceLastCastAdderCheckerAndNullifier(parseInt(numberOfActions.innerText))
    }
    if (parseInt(numberOfActions.innerText) == 0 && tacticsUsed == true) {
      actionsSpentSinceLastCastAdderCheckerAndNullifier(actionsLostWithTacticsUsed)
    }

    // Ha a cselekedetek száma nagyobb mint 0, akkor a varázslat megszakad
      spellCastingFailure((parseInt(numberOfActions.innerText) > 0 && spellIsBeingCast == true))

    numberOfReactions.innerText = 0
    initiativeRollLegendPointCheckBox.style.display = 'none'
    initiativeRerollByCounterLP.style.display = 'none'
    attackRollUseLegendPointCheckBox.style.display = "none"
    if (initRolled == true) {
      if (parseInt(numberOfActions.innerText) >= 0) {
        numberOfActions.innerText = adjustActionsPositive.value
        //****************************************************************************************************** */
        // ha az előző körben Megrendülés vagy dupla 1 miatt negatív az akciók száma, az átvivődik a kövi körre
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
      numberOfCurrentRound.innerText = parseInt(numberOfCurrentRound.innerText) + 1 + "."
      attackRollButton.disabled = false
      
      // itt megnézi, volt-e használva a körben kombináció v kapáslövés, és az új körre nem viszi át a módosítókat
      //******************************************************************************************************* */
      if(combinationRadioButton.checked == true){
        hmoModifier(-combinationModifiers[combinationModifiersIndex])
      }
      if(quickShotRadioButton.checked == true){
        hmoModifier(-quickShotModifiers[quickShotModifiersIndex])
      }
      combinationRadioButton.checked = false
      quickShotRadioButton.checked = false
      quickShotRadioButton.disabled = true
      combinationRadioButton.disabled = true
      combinationWasUsedThisRoundSetToFalse()
      hmoModifiedToFalse()
allResultsCleaner()
      if (warningWindow.innerText == "A varázslat létrejött!") {
        warningWindow.innerText = ""
      }
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==true && currentlySelectedWeapon.w_type != "MÁGIA" && reloadIsNeeded == true) {
        attackRollButton.disabled = true
      }
    }
  }
  function handleChiCombatBeforeEndOfRound() {
    if (activeBuffsArray.includes('Chi-harc') && initRolled == true) {
      chiCombatContinuePopupWindowText.innerText = 'Folytatod a Chi-harcot?'
      psiDisciplinesSelect.value = "Chi-harc"
      psiPointCostInput.value = Math.pow(2, (parseInt(numberOfCurrentRound.innerText) - parseInt(theRoundChiCombatWasUsedIn)) + 1)
      chiCombatContinuePopupWindow.style.display = "grid"
      chiCombatContinuePopupWindowNoButton.style.display = "grid"
      chiCombatContinuePopupWindowYesButton.style.display = "grid"
      if (parseInt(currentPp.value) < parseInt(psiPointCostInput.value)) {
        chiCombatContinuePopupWindowText.innerText = 'Nincs elég Pszi pontod a Chi-harc folytatásához.'
        chiCombatContinuePopupWindowNoButton.style.display = "none"
        chiCombatContinuePopupWindowYesButton.style.display = "none"
        chiCombatContinuePopupWindowOKButton.style.display = "grid"
      }
    }
  }
  function handleChiCombatContinue(){
    currentPp.value = parseInt(currentPp.value) - parseInt(psiPointCostInput.value)
    handleEndOfRound()
    chiCombatContinuePopupWindow.style.display = "none"
  }
  function handleChiCombatCancel() {
    buffRemoverFromActiveBuffArrayAndTextList('Chi-harc')
    hmoModifier(-chiCombatAtkDefModifier)
    chiCombatAtkDefModifierNullifier()
    handleEndOfRound()
    chiCombatContinuePopupWindow.style.display = "none"
    chiCombatContinuePopupWindowOKButton.style.display = "none"
    chiCombatEndedDueToLackOfPsiPoints = true
    psiPointCostInput.value = 1
    if (parseInt(currentPp.value) < parseInt(psiPointCostInput.value)) {
      psiActivateButton.disabled = true
    }
  }

  function handleWhenTacticsUsed() {
    if (initRolled == true) {
      attackRollButton.disabled = true
      spellCastingFailure()
      actionsLostWithTacticsUsed = parseInt(numberOfActions.innerText)
      numberOfActions.innerText = 0
      tacticsUsed = true
      tacticsButton.disabled = true
      if(combinationRadioButton.checked == true && combinationWasUsedThisRound == false){
        hmoModifier(-combinationModifiers[combinationModifiersIndex])
      }
      if(quickShotRadioButton.checked == true && combinationWasUsedThisRound == false){
        hmoModifier(-quickShotModifiers[quickShotModifiersIndex])
      }
    }
  }

  function handleEndOfCombat() {
    toggleAllallActionBarButtonsExceptInitRollDisplay('none')
    initRolled = false
    warningWindow.innerText = ""
    spellCastingActionButton.disabled = false
    initiativeRerollByCounterLP.style.display = 'none'
    attackRollUseLegendPointCheckBox.style.display = "none"
    setDiceRolledToFalse()
    reloadIsNeededSetToFalse()
    spellCastingSuccessful()
    if (chargeWasUsedThisRound == true) {
      chargeWasUsedThisRoundToFalse()
      charDef.value = parseFloat(charDef.value) +1
      charDefWithParry.value = parseFloat(charDefWithParry.value) +1
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1
      chargeRadioButton.disabled = false
    }
    if (twoWeaponAttackWasUsedThisRound == true) {
      twoWeaponAttackWasUsedThisRoundToFalse()
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
    }
    for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
      if (arrayOfAllComplexMaeuvers[i].checked == true) {
        arrayOfAllComplexMaeuvers[i].checked = false
      }     
    }
    if(hmoModified == true){
      hmoModifier(-combinationModifiers[combinationModifiersIndex])
    }
    if (findWeakSpotOn==true) {
      charAtk.value = parseFloat(charAtk.value) - findWeakSpotModifier
      findWeakSpotModifierNullifier()
      findWeakSpotOnToFalse()
      findWeakSpotButton.disabled = false
    }
    if (combinationRadioButton.checked == true || combinationRadioButton.checked == true) {
      totalActionCostOfAttackSetter(-1)
    }
    chargeRadioButton.disabled = false
    combinationRadioButton.checked = false
    quickShotRadioButton.checked = false
    combinationRadioButton.disabled = true
    quickShotRadioButton.disabled = true
    chargeToFalse()
    hmoModifiedToFalse()
    combinationWasUsedThisRoundSetToFalse()
    attackRollButton.disabled = false
    weapons.disabled = false
    offHand.disabled = false
    numberOfReactions.innerText = 0
    initRollButton.style.display = "grid"
    numberOfActions.innerText = ""
    initiativeWithRoll.innerText = ""
    numberOfCurrentRound.innerText = "1."
    tacticsButton.disabled = true
allResultsCleaner()
  }
  
  function checkIfPsiIsUseable() {
    if (parseInt(currentPp.value) >= parseInt(psiPointCostInput.value)) {
      psiActivateButton.disabled = false
    }
    if (listPsiButton.style.display == 'none') {
      psiPointCostCheckerAndSetter()
      
    }
  }

  return (
    <>
    <div id='characterDetails' className={styles['character-details']}>
      <div>
        <button className={styles.saveButton} onClick={updateCharacterData}>Adatok mentése</button>
        <p id='maxValues'>Max</p>
        <p id='currentValues'>Akt</p>
        </div>
      <div>
        <label>Fp:</label>
        <p id='maxFp'></p>
        <input id='currentFp' type='number'/>
        </div>
      <div>
        <label>Ép:</label>
        <p id='maxEp'></p>
        <input id='currentEp' type='number'/>
      </div>
      <div>
        <label>Pp:</label>
        <p id='maxPp'></p>
        <input id='currentPp' onBlur={checkIfPsiIsUseable} type='number'/>
      </div>
      <div>
        <label>Mp:</label>
        <p id='maxMp'></p>
        <input id='currentMp' type='number'/>
      </div>
      <div>
        <label>Lp:</label>
        <p id='maxLp'></p>
        <input id='currentLp' type='number'/>
      </div>
      </div>
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
          id="initRollButton"
          className={styles.initRollButton}
          onClick={handleInitiativeRoll}
          disabled = {false}
        >
          Kezdeményező dobás
        </button>
        <button id='tacticsButton' onClick={handleWhenTacticsUsed} className={styles.endOfCombatButton}>Taktika</button>
        <button onClick={handleEndOfRound} className={styles.endOfRoundButton} onMouseEnter={handleChiCombatBeforeEndOfRound} >Kör vége</button>
        <button id='initiativeRerollByCounterLP' onClick={handleBossInitCounterLP} className={styles.initiativeRerollByCounterLP}></button>
        <button className={styles.endOfCombatButton} onClick={handleEndOfCombat}>Harc vége</button>
        <div >Reakc. száma:</div>
        <div id="numberOfReactions" className={styles.numberOfActions}>0</div>
        <button id='adjustReactionsPositive' className={styles.adjustReactions} onClick={handleAdjustReactionsPositive}>Tartalékolás / Készenlét</button>
        {/* <button id='adjustReactionsNegative' className={styles.adjustReactions} onClick={handleAdjustReactionsNegative}>-</button> */}
        <label className={styles.useLegendPointForInitiativeRollLabel}>Lp-t használok!</label>
        <select onChange={handleInitWhenLPisUsed} id='initiativeRollResultSelect' className={styles.initiativeRollResultSelect} disabled = {true}>
        {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
        </select>
        <input type='checkbox' id='initiativeRollLegendPointCheckBox' className={styles.initiativeRollLegendPointCheckBox} onChange={handleInitLPCheckBox}/>
      </div>
      <div id='chiCombatContinuePopupWindow' className={styles.chiCombatContinuePopupWindow} onMouseLeave={() => chiCombatContinuePopupWindow.style.display = "none"}>
        <div id='chiCombatContinuePopupWindowText' className={styles.chiCombatContinuePopupWindowText}>Folytatod a Chi-harcot?</div> 
        <button id='chiCombatContinuePopupWindowNoButton' className={styles.chiCombatContinuePopupWindowNoButton} onClick={handleChiCombatCancel}>Nem</button>
        <button id='chiCombatContinuePopupWindowYesButton' className={styles.chiCombatContinuePopupWindowYesButton} onClick={handleChiCombatContinue}>Igen</button>
        <button id='chiCombatContinuePopupWindowOKButton' className={styles.chiCombatContinuePopupWindowOKButton} onClick={handleChiCombatCancel}>OK</button>
      </div>
    </>
  );
}

export default CharacterDetails;