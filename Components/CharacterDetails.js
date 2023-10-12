import styles from '../styles/chardetails.module.css';
import { setDiceRolledToFalse, chargeWasUsedThisRound, chargeWasUsedThisRoundToFalse, currentlySelectedWeapon, rollOptions, checkIfWeaponIsRanged, combinationWasUsedThisRoundSetToFalse, combinationWasUsedThisRound, twoWeaponAttackWasUsedThisRound, twoWeaponAttackWasUsedThisRoundToFalse, twoWeaponAttackModifiers, twoWeaponAttackModifiersIndex, reloadIsNeeded, reloadIsNeededSetToFalse, toggleAllallActionBarButtonsExceptInitRollDisplay } from '../pages';
import { filteredArrayIfHasExtraReaction, arrayOfAllComplexMaeuvers, quickShotModifiers, quickShotModifiersIndex, combinationModifiers, combinationModifiersIndex, tempImg} from '../pages';
import { psiAtkDefModifier, theRoundChiCombatWasUsedIn, activeBuffsArray, buffRemoverFromActiveBuffArrayAndTextList, psiPointCostChecker } from './PsiDisciplines';
import { chargeToFalse, hmoModified, hmoModifiedToFalse, hmoModifier, totalActionCostSetter, twoWeaponAttackToFalse, actionsSpentSinceLastCastAdder, actionsSpentSinceLastCastAdderCheckerAndNullifier, spellCastingSuccessful, spellCastingFailure } from './ActionsList';
export let initRolled = false
export let chiCombatEndedDueToLackOfPsiPoints = false
var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();
let actionsLostWithTacticsUsed = 0
function CharacterDetails() {
  function handleInitiativeRoll() {
    toggleAllallActionBarButtonsExceptInitRollDisplay('grid')
    rollResult.innerText = ""
    damageResult.innerText = ""
    bodyPart.innerText = ""
    charAtkSum.innerText = ""
    specialEffect.innerText = "nincs"
    if (tempImg) {
      tempImg.style.opacity = 0
    }
    for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
      if (arrayOfAllComplexMaeuvers[i].disabled == true && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==false) {
        arrayOfAllComplexMaeuvers[i].disabled = false
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
    adjustActionsPositive.value = parseInt(numberOfActions.innerText) // a adjustActionsPositive gomb value értékébe van elmentve a max cselekedetszám
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
    adjustActionsPositive.value = parseInt(numberOfActions.innerText)
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
    adjustActionsPositive.value = parseInt(numberOfActions.innerText)
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
        rollButton.disabled = true
      }
      if (combinationWasUsedThisRound == true && parseInt(numberOfActions.innerText) < 3) {
        rollButton.disabled = true
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
      rollButton.disabled = true
      tacticsButton.disabled = true
    }
    if (combinationWasUsedThisRound == true && parseInt(numberOfActions.innerText) < 3) {
      rollButton.disabled = true
    }
    }
  
  let tacticsUsed = false
  //**************************************************************** */
  // a köt végének kezelése
  //****************************************************************** */
  function handleEndOfRound() {
    if (combinationRadioButton.checked == true || quickShotRadioButton.checked == true) {
      totalActionCostSetter(-1)
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
      actionsSpentSinceLastCastAdder(Math.abs(parseInt(numberOfActions.innerText)))
    }
    if (parseInt(numberOfActions.innerText) > 0) {
      actionsSpentSinceLastCastAdder(parseInt(numberOfActions.innerText))
    }
    if (parseInt(numberOfActions.innerText) == 0 && tacticsUsed ==true) {
      actionsSpentSinceLastCastAdder(parseInt(actionsLostWithTacticsUsed))
    }
actionsSpentSinceLastCastAdderCheckerAndNullifier()
    numberOfReactions.innerText = 0
    useLegendPointForInitiativeRollCheckBox.style.display = 'none'
    initiativeRerollByCounterLP.style.display = 'none'
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
      rollButton.disabled = false
      
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
      rollResult.innerText = ""
      damageResult.innerText = ""
      bodyPart.innerText = ""
      charAtkSum.innerText = ""
      specialEffect.innerText = "nincs"
      if (tempImg) {
        tempImg.style.opacity = 0
      }
      if (warningWindow.innerText == "A varázslat létrejött!") {
        warningWindow.innerText = ""
      }
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==true && currentlySelectedWeapon.w_type != "MÁGIA" && reloadIsNeeded == true) {
        rollButton.disabled = true
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
    charAtk.value = parseFloat(charAtk.value) - psiAtkDefModifier;
    charDef.value = parseFloat(charDef.value) - psiAtkDefModifier;
    charDefWithParry.value = parseFloat(charDefWithParry.value) - psiAtkDefModifier;
    charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - psiAtkDefModifier;
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
      rollButton.disabled = true
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
    if (combinationRadioButton.checked == true || combinationRadioButton.checked == true) {
      totalActionCostSetter(-1)
    }
    chargeRadioButton.disabled = false
    combinationRadioButton.checked = false
    combinationRadioButton.checked = false
    combinationRadioButton.disabled = true
    combinationRadioButton.disabled = true
    chargeToFalse()
    hmoModifiedToFalse()
    combinationWasUsedThisRoundSetToFalse()
    rollButton.disabled = false
    weapons.disabled = false
    offHand.disabled = false
    numberOfReactions.innerText = 0
    rollInitButton.style.display = "grid"
    numberOfActions.innerText = ""
    initiativeWithRoll.innerText = ""
    numberOfCurrentRound.innerText = "1."
    tacticsButton.disabled = true
    rollResult.innerText = ""
    damageResult.innerText = ""
    bodyPart.innerText = ""
    charAtkSum.innerText = ""
    specialEffect.innerText = "nincs"
    if (tempImg) {
      tempImg.style.opacity = 0
    }
  }
  
  function checkIfPsiIsUseable() {
    if (parseInt(currentPp.value) >= parseInt(psiPointCostInput.value)) {
      psiActivateButton.disabled = false
    }
    if (listPsiButton.style.display == 'none') {
      psiPointCostChecker()
      
    }
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
        <input id='currentPp' onBlur={checkIfPsiIsUseable}/>
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
        <input type='checkbox' id='useLegendPointForInitiativeRollCheckBox' className={styles.useLegendPointForInitiativeRollCheckBox} onChange={handleInitLPCheckBox}/>
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