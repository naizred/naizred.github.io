import styles from "../styles/chardetails.module.css";
import {
  setFirstAttackInRoundSpent,
  chargeWasUsedThisRound,
  chargeWasUsedThisRoundToFalse,
  currentlySelectedWeapon,
  rollOptions,
  checkIfWeaponIsRanged,
  combinationWasUsedThisRoundSetToFalse,
  combinationWasUsedThisRound,
  twoWeaponAttackWasUsedThisRound,
  twoWeaponAttackWasUsedThisRoundToFalse,
  twoWeaponAttackModifiers,
  twoWeaponAttackModifiersIndex,
  toggleAllallActionBarButtonsExceptInitRollDisplay,
  allResultsCleaner,
  numberOfAttacksInTheRoundNullifier,
  modifierFromNumberOfAttacksInTheRoundNullifier,
  modifierFromNumberOfAttacksInTheRound,
  cumulativeCombinationModifierNullifier,
  cumulativeCombinationModifier,
  specialCases2,
  specialCases1,
  specialCases3,
  specialModifiers,
  firstAttackInRoundSpent,
  numberOfClicksAtTwoWeaponAttack,
  combatStatRefresher,
  aptitudeObject,
  updateCharacterSocketData,
} from "../pages";
import { arrayOfAllComplexManeuvers, allActiveBuffs } from "../pages";
import {
  theRoundChiCombatWasUsedIn,
  buffRemoverFromActiveBuffArrayAndTextList,
  psiPointCostCheckerAndSetter,
  chiCombatAtkDefModifier,
  chiCombatAtkDefModifierNullifier,
  dmgReductionByGoldenBellSetter,
  dmgReductionByGoldenBell,
  buffTextChecker,
  innerTimeNegativeModifierNullifier,
  theRoundInnerTimeWasUsedIn,
  innerTimeNegativeModifier,
  setChiCombatDisabledToTrue,
  setChiCombatDisabledToFalse,
} from "./PsiDisciplines";
import {
  chargeToFalse,
  hmoModifiedToFalse,
  hmoModifier,
  totalActionCostOfAttackSetter,
  twoWeaponAttackToFalse,
  findWeakSpotOn,
  findWeakSpotOnToFalse,
  findWeakSpotModifier,
  findWeakSpotModifierNullifier,
  reloadFailed,
  firstAttackIsAttackOfOpportunitySetToFalse,
  firstAttackIsSpellThatNeedsAimRollSetToFalse,
  spellNeedsAimRoll,
  attackRollButtonWasDisabledBeforeSpellCastSetter,
  attackOfOpportunityOn,
  setDefensiveCombatVEObonus,
  defensiveCombatOn,
  defensiveCombatVEObonus,
  defensiveCombatOnSetToFalse,
} from "./ActionsList";
import {
  spellCastingSuccessful,
  spellCastingFailure,
  actionsSpentSinceLastCastAdderCheckerAndNullifier,
  spellIsBeingCast,
  actionsNeededToBeAbleToCastAgainNullifier,
  actionsNeededToBeAbleToCastAgain,
} from "./Spells";
import { skillCheckCalculatedResultFromRoll } from "./SkillCheck";
import { socket } from "../pages";
export let initRolled = false;
export function setInitRolled(trueOrFalse = false) {
  initRolled = trueOrFalse;
}
export let extraReactionLevel = 0;
export let chiCombatEndedDueToLackOfPsiPoints = false;
export let activeBuffsCounter = 0;
let dataForSocket;

export async function updateCharacterData(gameIdUpdate = false) {
  if (charName.innerText == "") {
    return;
  }
  let data = {};
  let activeBuffsStringToSave = "";
  activeBuffsCounter = 0;
  for (let i = 0; i < allActiveBuffs.length; i++) {
    if (allActiveBuffs[i].innerText != "" && !allActiveBuffs[i].innerText.includes("kör")) {
      activeBuffsStringToSave += `${allActiveBuffs[i].innerText}|`;
      activeBuffsCounter++;
    }
  }

  activeBuffsStringToSave = activeBuffsCounter + activeBuffsStringToSave;

  let bodyPartName = bodyPart.innerText;
  if (bodyPart.innerText == "Fegyverforgató kar") {
    bodyPartName = "Jobb kar";
  }
  data = {
    charName: charName.innerText,
    currentFp: parseInt(currentFp.value),
    currentEp: parseInt(currentEp.value),
    currentPp: parseInt(currentPp.value),
    currentMp: parseInt(currentMp.value),
    currentLp: parseInt(currentLp.value),
    activeBuffs: activeBuffsStringToSave,
    numberOfActions: numberOfActions.innerText,
    atkRollResult: parseFloat(charAtkSum.innerText),
    atkRollDice: `${bodyPartName}, Sebzés: ${damageResult.innerText}`,
    skillCheckResult: parseInt(skillCheckResult.innerText),
    skillCheckDice: `Dobás kihatása: ${skillCheckCalculatedResultFromRoll}`,
    initiativeWithRoll: parseInt(initiativeWithRoll.innerText),
  };

  if (gameIdUpdate == true) {
    data.gameId = gameIdInput.value;
  }

  //socket.emit("sending data to update", data);

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
let defensiveCombatContinueSelected = false;
export function defensiveCombatContinueSelectedSetToFalse() {
  defensiveCombatContinueSelected = false;
}

export function checkIfPsiIsUseable() {
  if (parseInt(currentPp.value) >= parseInt(psiPointCostInput.value)) {
    psiActivateButton.disabled = false;
  }
  if (listPsiButton.style.display == "none") {
    psiPointCostCheckerAndSetter();
  }
}
export let firstRoundActionNumberModifierFromInitRoll = 0;
export function setFirstRoundActionNumberModifierFromInitRoll(value = 0) {
  // nevezetes dobás
  firstRoundActionNumberModifierFromInitRoll = value;
}
var MersenneTwister = require("mersenne-twister");
var generator = new MersenneTwister();
let actionsLostWithTacticsUsed = 0;
function CharacterDetails() {
  function handleBonusInitByLP() {
    if (currentLp.value == 0 || parseInt(numberOfCurrentRound.innerText) != 1) {
      return;
    }
    initiativeWithRoll.innerText = parseInt(initiativeWithRoll.innerText) + 6;

    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1;
    adjustActionsPositive.value = parseInt(numberOfActions.innerText); // a adjustActionsPositive gomb value értékébe van elmentve a max cselekedetszám
    numberOfActions.innerText = parseInt(numberOfActions.innerText) + firstRoundActionNumberModifierFromInitRoll; // ez ide azért kell, hogy a mentett max akciók ne változzon, mivel a módosító a nevezetes dobásból csak az első körre vonatkozik
    // az Extra Reackió adottság az első 3 körben +1 akciót is ad. A további körökben ezt a "handleEndOfRound" függvény fogja figyelni
    if (aptitudeObject["Extra reakció"] && extraReactionLevel > 0) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
    }
    currentLp.value -= 1;
    initiativeBonusButton.style.display = "none";
    updateCharacterSocketData();
  }

  function handleInitiativeRoll() {
    if (soundToggleCheckbox.checked) {
      rollDiceSound.play();
    }
    warningWindow.innerText = "";
    numberOfAttacksInTheRoundNullifier();
    modifierFromNumberOfAttacksInTheRoundNullifier();
    cumulativeCombinationModifierNullifier();
    toggleAllallActionBarButtonsExceptInitRollDisplay("grid");
    allResultsCleaner();

    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      if (arrayOfAllComplexManeuvers[i].disabled == true && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
        arrayOfAllComplexManeuvers[i].disabled = false;
        if (weapons.value.includes("kétkézzel") || weapons.value.includes("Kétkezes") || weapons.value.includes("Pallos") || weapons.value.includes("Alabárd")) {
          twoWeaponAttackRadioButton.disabled = true;
        } else {
          twoWeaponAttackRadioButton.disabled = false;
        }
      }
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true) {
        arrayOfAllComplexManeuvers[i].disabled == true;
      }
    }
    reloadButton.disabled = true;
    weapons.disabled = true;
    offHand.disabled = true;
    setFirstAttackInRoundSpent(false);
    tacticsButton.disabled = false;
    let initiativeLightDice = Math.floor(generator.random() * 10);
    let initiativeDarkDice = Math.floor(generator.random() * 10);
    initRolled = true;

    let initiativeLightDicePlusExtraReaction = 0;

    initiativeLightDiceResult.value = initiativeLightDice;
    initiativeDarkDiceResult.value = initiativeDarkDice;

    if (initiativeLightDice == 0) {
      initiativeLightDice = 10;
    }
    if (initiativeDarkDice == 0) {
      initiativeDarkDice = 10;
    }
    if (aptitudeObject["Extra reakció"]) {
      extraReactionLevel = aptitudeObject["Extra reakció"];
    }
    initiativeLightDicePlusExtraReaction = initiativeLightDice + extraReactionLevel;
    if (initiativeLightDicePlusExtraReaction >= 10) {
      initiativeLightDicePlusExtraReaction = 10;
    }
    ///***************** dobás teszteléshez ****************************/
    //initiativeLightDice = 2;
    //initiativeDarkDice = 2;

    console.log("Kezdeményező dobás DM előtt", initiativeLightDice, initiativeDarkDice);
    if (initiativeLightDice == initiativeDarkDice) {
      initiativeLightDicePlusExtraReaction = initiativeLightDice;
    }
    console.log("Kezdeményező dobás DM után", initiativeLightDicePlusExtraReaction, initiativeDarkDice);

    if (initiativeLightDicePlusExtraReaction == initiativeDarkDice && specialCases1.includes(initiativeDarkDice)) {
      specialEffect.innerText = "1 ellenfél veszít 1 cselekedetet";
    } else if (initiativeLightDicePlusExtraReaction == initiativeDarkDice && specialCases2.includes(initiativeDarkDice)) {
      specialEffect.innerText = specialModifiers[2];
      firstRoundActionNumberModifierFromInitRoll = 1;
    } else if (initiativeLightDicePlusExtraReaction == initiativeDarkDice && specialCases3.includes(initiativeDarkDice)) {
      specialEffect.innerText = specialModifiers[3];
      firstRoundActionNumberModifierFromInitRoll = 2;
    } else if (initiativeLightDicePlusExtraReaction == initiativeDarkDice && initiativeDarkDice == 1) {
      specialEffect.innerText = specialModifiers[0];
      firstRoundActionNumberModifierFromInitRoll = -3;
    } else if (initiativeLightDicePlusExtraReaction == initiativeDarkDice && initiativeDarkDice == 10) {
      specialEffect.innerText = specialModifiers[4];
      firstRoundActionNumberModifierFromInitRoll = 3;
    }
    let initModifierFromDiceRoll = initiativeLightDicePlusExtraReaction - initiativeDarkDice; // új változó mert most már a világos kocka értékéből ki kell vonni a sötétet, és ez adódik hozzá a kezdeményezőhöz
    initiativeWithRoll.innerText = parseInt(initiative.innerText) + initModifierFromDiceRoll;

    numberOfActions.innerText = Math.floor(parseInt(parseInt(initiativeWithRoll.innerText)) / 10) + 1;
    adjustActionsPositive.value = parseInt(numberOfActions.innerText); // a adjustActionsPositive gomb value értékébe van elmentve a max cselekedetszám
    // ez ide azért kell, hogy a mentett max akciók ne változzon, mivel a módosító a nevezetes dobásból csak az első körre vonatkozik
    numberOfActions.innerText = parseInt(numberOfActions.innerText) + firstRoundActionNumberModifierFromInitRoll;
    // az Extra Reackió adottság az első 3 körben +1 akciót is ad. A további körökben ezt a "handleEndOfRound" függvény fogja figyelni
    if (aptitudeObject["Extra reakció"] && extraReactionLevel > 0) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
    }

    initRollButton.style.display = "none";
    initiativeLightDiceResult.style.display = "grid";
    initiativeDarkDiceResult.style.display = "grid";
    initiativeBonusButton.style.display = "grid";
    combinationCheckBox.disabled = true;
    //updateCharacterSocketData();

    // // megfigyeli az akciók változását
    // //*********************************** */
    // let observerForActions = new MutationObserver(async () => {
    //   updateCharacterSocketData();
    //   if (initRolled && parseInt(numberOfActions.innerText) <= 0) {
    //     recurringSpellActionButton.disabled = true;
    //   }
    //   if (parseInt(numberOfActions.innerText) < 2) {
    //     tacticsButton.disabled = true;
    //   }
    //   if (
    //     ((initRolled && !spellNeedsAimRoll && parseInt(numberOfActions.innerText) < 2) || (initRolled && firstAttackInRoundSpent && !spellNeedsAimRoll && parseInt(numberOfActions.innerText) < 3)) &&
    //     !attackOfOpportunityOn
    //   ) {
    //     attackRollButton.disabled = true;
    //   }
    //   if (numberOfClicksAtTwoWeaponAttack == 1) {
    //     attackRollButton.disabled = false;
    //   }
    //   if (initRolled && parseInt(numberOfActions.innerText) < 1 && !spellIsBeingCast && actionsNeededToBeAbleToCastAgain != 0) {
    //     spellCastingActionButton.disabled = true;
    //   }
    // });
    // observerForActions.observe(numberOfActions, { childList: true, subtree: true });
    // // a körök számát figyeli, és ez alapján követi nyomon mennyi van hátra az adott buffokból
    // let observerForCurrentRound = new MutationObserver(async () => {
    //   if (initRolled && parseInt(numberOfCurrentRound.innerText) != 1) {
    //     for (let i = 0; i < allActiveBuffs.length; i++) {
    //       if (allActiveBuffs[i].innerText.includes("kör")) {
    //         let numberOfRoundsLeftFromBuff = parseInt(allActiveBuffs[i].innerText);
    //         numberOfRoundsLeftFromBuff--;
    //         let buffNameWithoutNumberOfRounds = allActiveBuffs[i].innerText.slice(1);
    //         allActiveBuffs[i].innerText = numberOfRoundsLeftFromBuff + buffNameWithoutNumberOfRounds;
    //         if (numberOfRoundsLeftFromBuff == 0) {
    //           buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText);
    //         }
    //       }
    //     }
    //   }
    // });
    // observerForCurrentRound.observe(numberOfCurrentRound, { childList: true, subtree: true });
  }

  function handleAdjustActionsPositive() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
      if (parseInt(numberOfActions.innerText) > parseInt(adjustActionsPositive.value) + 1) {
        numberOfActions.innerText = parseInt(adjustActionsPositive.value) + 1;
      }

      if (parseInt(numberOfActions.innerText) >= 2) {
        tacticsButton.disabled = false;
      }
    }
  }

  function handleAdjustActionsNegative() {
    if (initRolled == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
      spellCastingFailure();
      reloadFailed();
    }
  }

  function handleAdjustReactionsPositive() {
    if (parseInt(numberOfActions.innerText) > 0) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      numberOfReactions.innerText = parseInt(numberOfReactions.innerText) + 1;
      actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
      spellCastingFailure();
      reloadFailed();
    }
    if (combinationWasUsedThisRound == true && parseInt(numberOfActions.innerText) < 3) {
      attackRollButton.disabled = true;
    }
  }

  let tacticsUsed = false;
  //**************************************************************** */
  // a kör végének kezelése
  //****************************************************************** */
  function handleEndOfRound() {
    firstAttackIsSpellThatNeedsAimRollSetToFalse();
    if (!defensiveCombatOn) {
      defensiveCombatButton.disabled = false;
      setDefensiveCombatVEObonus(0);
    }
    if (combinationCheckBox.checked == true) {
      totalActionCostOfAttackSetter(-1);
    }
    if (warningWindow.innerText.includes("várható")) {
      // azért csak ebben az esetben, mert ha újra kell tölteni, vagy kell még cselekedet a varázslathoz, akkor az ne tűnjön el
      warningWindow.innerText = "";
    }

    if (chargeWasUsedThisRound == true) {
      chargeWasUsedThisRoundToFalse();
      charDef.value = parseFloat(charDef.value) + 1;
      charDefWithParry.value = parseFloat(charDefWithParry.value) + 1;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1;
      chargeRadioButton.disabled = false;
    }
    if (chargeWasUsedThisRound == false && chargeRadioButton.checked == true) {
      charAtk.value = parseFloat(charAtk.value) - 1;
      charDef.value = parseFloat(charDef.value) + 1;
      charDefWithParry.value = parseFloat(charDefWithParry.value) + 1;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1;
    }
    if (twoWeaponAttackWasUsedThisRound == true) {
      twoWeaponAttackWasUsedThisRoundToFalse();
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
    }
    if (twoWeaponAttackWasUsedThisRound == false && twoWeaponAttackRadioButton.checked == true) {
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
    }
    twoWeaponAttackToFalse();
    chargeToFalse();
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      if (arrayOfAllComplexManeuvers[i].checked == true) {
        arrayOfAllComplexManeuvers[i].checked = false;
      }
    }

    if (parseInt(numberOfActions.innerText) < 0) {
      actionsSpentSinceLastCastAdderCheckerAndNullifier(Math.abs(parseInt(numberOfActions.innerText)));
    }
    if (parseInt(numberOfActions.innerText) > 0) {
      actionsSpentSinceLastCastAdderCheckerAndNullifier(parseInt(numberOfActions.innerText));
    }
    if (parseInt(numberOfActions.innerText) == 0 && tacticsUsed == true) {
      actionsSpentSinceLastCastAdderCheckerAndNullifier(actionsLostWithTacticsUsed);
    }

    // Ha a cselekedetek száma nagyobb mint 0, akkor a varázslat, és újratöltés is megszakad
    spellCastingFailure(parseInt(numberOfActions.innerText) > 0);
    reloadFailed(parseInt(numberOfActions.innerText) > 0);

    numberOfReactions.innerText = 0;
    if (parseInt(numberOfActions.innerText) >= 0) {
      numberOfActions.innerText = adjustActionsPositive.value;
      //****************************************************************************************************** */
      // ha az előző körben Megrendülés vagy dupla 1 miatt negatív az akciók száma, az átvivődik a kövi körre
    } else if (parseInt(numberOfActions.innerText) < 0) {
      numberOfActions.innerText = parseInt(adjustActionsPositive.value) + parseInt(numberOfActions.innerText);
    }
    if (tacticsUsed == true) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
      tacticsUsed = false;
    }
    if (parseInt(numberOfActions.innerText) >= 2) {
      tacticsButton.disabled = false;
    } else if (parseInt(numberOfActions.innerText) < 2) {
      tacticsButton.disabled = true;
    }
    if (warningWindow.innerText == "A varázslat létrejött!") {
      warningWindow.innerText = "";
    }
    if (!defensiveCombatContinueSelected) {
      attackRollButton.disabled = false;
      setFirstAttackInRoundSpent(false);
      combinationCheckBox.checked = false;
      combinationCheckBox.disabled = true;
    }
    if (defensiveCombatContinueSelected) {
      attackRollButton.disabled = true;
      setFirstAttackInRoundSpent(true);
      combinationCheckBox.checked = false;
      combinationCheckBox.disabled = false;
    }

    // ide kerülnek majd az X körig tartó buffok
    if (buffTextChecker("Belső idő")) {
      hmoModifier(-innerTimeNegativeModifier);
      buffRemoverFromActiveBuffArrayAndTextList("Belső idő");
    }
    if (buffTextChecker("ismétlődő")) {
      recurringSpellActionButton.disabled = false;
    }
    if (!spellIsBeingCast) {
      attackRollButtonWasDisabledBeforeSpellCastSetter(false);
    }
    if (parseInt(theRoundChiCombatEnded) + 1 <= parseInt(numberOfCurrentRound.innerText)) {
      setChiCombatDisabledToFalse();
    }
    if (parseInt(theRoundInnerTimeWasUsedIn) + 1 == parseInt(numberOfCurrentRound.innerText)) {
      hmoModifier(+innerTimeNegativeModifier);
      innerTimeNegativeModifierNullifier();
    }

    // itt megnézi, volt-e használva a körben kombináció v kapáslövés, és az új körre nem viszi át a módosítókat
    //******************************************************************************************************* */
    if (combinationCheckBox.checked == true) {
      hmoModifier(cumulativeCombinationModifier);
    }
    combinationWasUsedThisRoundSetToFalse();
    hmoModifiedToFalse();
    allResultsCleaner();
    numberOfAttacksInTheRoundNullifier();
    totalModifierForNextAttack.innerText = "0";
    hmoModifier(modifierFromNumberOfAttacksInTheRound);
    modifierFromNumberOfAttacksInTheRoundNullifier();
    cumulativeCombinationModifierNullifier();
    if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true && currentlySelectedWeapon.w_type != "MÁGIA" && !currentlySelectedWeapon.readyToFireOrThrow) {
      attackRollButton.disabled = true;
    }
    numberOfCurrentRound.innerText = parseInt(numberOfCurrentRound.innerText) + 1 + ".";
    if (extraReactionLevel != 0 && extraReactionLevel >= parseInt(numberOfCurrentRound.innerText)) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
    }
    initiativeBonusButton.style.display = "none"; // a Csa-t csak az első körben lehet módosítani
    firstAttackIsAttackOfOpportunitySetToFalse();
    combatStatRefresher();
  }
  function handleChiCombatBeforeEndOfRound() {
    if (!buffTextChecker("Chi-harc")) {
      return;
    }
    chiCombatContinuePopupWindowText.innerText = "Folytatod a Chi-harcot?";
    psiDisciplinesSelect.value = "Chi-harc";
    psiPointCostInput.value = 3 * Math.pow(2, parseInt(numberOfCurrentRound.innerText) - parseInt(theRoundChiCombatWasUsedIn) + 1);
    chiCombatContinuePopupWindow.style.display = "grid";
    chiCombatContinuePopupWindowNoButton.style.display = "grid";
    chiCombatContinuePopupWindowYesButton.style.display = "grid";
    if (parseInt(currentPp.value) < parseInt(psiPointCostInput.value)) {
      chiCombatContinuePopupWindowText.innerText = "Nincs elég Pszi pontod a Chi-harc folytatásához.";
      chiCombatContinuePopupWindowNoButton.style.display = "none";
      chiCombatContinuePopupWindowYesButton.style.display = "none";
      chiCombatContinuePopupWindowOKButton.style.display = "grid";
    }
  }
  function handleChiCombatContinue() {
    currentPp.value = parseInt(currentPp.value) - parseInt(psiPointCostInput.value);
    handleEndOfRound();
    chiCombatContinuePopupWindow.style.display = "none";
  }
  let theRoundChiCombatEnded = 0;
  function handleChiCombatCancel() {
    theRoundChiCombatEnded = parseInt(numberOfCurrentRound.innerText);
    hmoModifier(-chiCombatAtkDefModifier);
    chiCombatAtkDefModifierNullifier();
    handleEndOfRound();
    chiCombatContinuePopupWindow.style.display = "none";
    chiCombatContinuePopupWindowOKButton.style.display = "none";
    chiCombatEndedDueToLackOfPsiPoints = true;
    psiPointCostInput.value = 3;
    if (parseInt(currentPp.value) < parseInt(psiPointCostInput.value)) {
      psiActivateButton.disabled = true;
    }
    setChiCombatDisabledToTrue();
    buffRemoverFromActiveBuffArrayAndTextList("Chi-harc");
  }
  function handleDefensiveCombatBeforeEndOfRound() {
    if (!defensiveCombatOn) {
      return;
    }
    defensiveCombatContinuePopupWindow.style.display = "grid";
    defensiveCombatPopupWindowNoButton.style.display = "grid";
    defensiveCombatPopupWindowYesButton.style.display = "grid";
  }

  function handleDefensiveCombatContinue() {
    defensiveCombatContinueSelected = true;
    if (!spellIsBeingCast) {
      setDefensiveCombatVEObonus(2);
    }
    handleEndOfRound();
    defensiveCombatContinuePopupWindow.style.display = "none";
  }
  function handleDefensiveCombatCancel() {
    defensiveCombatContinueSelected = false;
    defensiveCombatOnSetToFalse();
    setDefensiveCombatVEObonus(0);
    handleEndOfRound();
    defensiveCombatContinuePopupWindow.style.display = "none";
  }

  function handleWhenTacticsUsed() {
    if (initRolled == true) {
      attackRollButton.disabled = true;
      spellCastingFailure();
      reloadFailed();
      actionsLostWithTacticsUsed = parseInt(numberOfActions.innerText);
      numberOfActions.innerText = 0;
      tacticsUsed = true;
      tacticsButton.disabled = true;
    }
  }

  function handleEndOfCombat() {
    // initiativeBonusButton.disabled = false;
    defensiveCombatButton.disabled = false;
    setDefensiveCombatVEObonus(0);
    defensiveCombatOnSetToFalse();
    attackRollButtonWasDisabledBeforeSpellCastSetter(false);
    firstAttackIsAttackOfOpportunitySetToFalse();
    innerTimeNegativeModifierNullifier();
    toggleAllallActionBarButtonsExceptInitRollDisplay("none");
    initRolled = false;
    warningWindow.innerText = "";
    spellCastingActionButton.disabled = false;
    setFirstAttackInRoundSpent(false);
    if (spellIsBeingCast) {
      spellCastingSuccessful();
    }
    actionsNeededToBeAbleToCastAgainNullifier();
    if (chargeWasUsedThisRound == true) {
      chargeWasUsedThisRoundToFalse();
      charDef.value = parseFloat(charDef.value) + 1;
      charDefWithParry.value = parseFloat(charDefWithParry.value) + 1;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1;
      chargeRadioButton.disabled = false;
    }
    if (twoWeaponAttackWasUsedThisRound == true) {
      twoWeaponAttackWasUsedThisRoundToFalse();
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
    }
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      if (arrayOfAllComplexManeuvers[i].checked == true) {
        arrayOfAllComplexManeuvers[i].checked = false;
      }
    }
    if (combinationCheckBox.checked == true) {
      hmoModifier(cumulativeCombinationModifier);
      totalActionCostOfAttackSetter(-1);
    }
    if (findWeakSpotOn == true) {
      charAtk.value = parseFloat(charAtk.value) - findWeakSpotModifier;
      findWeakSpotModifierNullifier();
      findWeakSpotOnToFalse();
      findWeakSpotButton.disabled = false;
    }

    chargeRadioButton.disabled = false;
    combinationCheckBox.checked = false;
    combinationCheckBox.disabled = true;
    chargeToFalse();
    hmoModifiedToFalse();
    combinationWasUsedThisRoundSetToFalse();
    attackRollButton.disabled = false;
    weapons.disabled = false;
    offHand.disabled = false;
    numberOfReactions.innerText = 0;
    initRollButton.style.display = "grid";
    initiativeLightDiceResult.style.display = "none";
    initiativeDarkDiceResult.style.display = "none";
    initiativeBonusButton.style.display = "none";
    numberOfActions.innerText = "";
    initiativeWithRoll.innerText = "";
    numberOfCurrentRound.innerText = "1.";
    tacticsButton.disabled = true;
    buffRemoverFromActiveBuffArrayAndTextList("Chi-harc");
    hmoModifier(-chiCombatAtkDefModifier);
    chiCombatAtkDefModifierNullifier();
    buffRemoverFromActiveBuffArrayAndTextList("Aranyharang");
    dmgReductionByGoldenBellSetter(-dmgReductionByGoldenBell);
    for (let i = 0; i < allActiveBuffs.length; i++) {
      if (allActiveBuffs[i].innerText.includes("kör")) {
        buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText);
      }
    }
    numberOfAttacksInTheRoundNullifier();
    hmoModifier(modifierFromNumberOfAttacksInTheRound);
    totalModifierForNextAttack.innerText = "0";
    modifierFromNumberOfAttacksInTheRoundNullifier();
    cumulativeCombinationModifierNullifier();
    allResultsCleaner();
    theRoundChiCombatEnded = 0;
    setChiCombatDisabledToFalse();
    firstAttackIsSpellThatNeedsAimRollSetToFalse();
    combatStatRefresher();
    setFirstRoundActionNumberModifierFromInitRoll();
  }

  return (
    <>
      <div id="characterDetails" className={styles["character-details"]}>
        <div>
          <p>Stat</p>
          <p id="maxValues">Max</p>
          <p id="currentValues">Akt</p>
        </div>
        <div>
          <label>Fp:</label>
          <p id="maxFp"></p>
          <input id="currentFp" onBlur={updateCharacterSocketData} />
        </div>
        <div>
          <label>Ép:</label>
          <p id="maxEp"></p>
          <input id="currentEp" onBlur={updateCharacterSocketData} />
        </div>
        <div>
          <label>Pp:</label>
          <p id="maxPp"></p>
          <input
            id="currentPp"
            onBlur={() => {
              checkIfPsiIsUseable();
              updateCharacterSocketData();
            }}
          />
        </div>
        <div>
          <label>Mp:</label>
          <p id="maxMp"></p>
          <input id="currentMp" onBlur={updateCharacterSocketData} />
        </div>
        <div>
          <label>Lp:</label>
          <p id="maxLp"></p>
          <input id="currentLp" onBlur={updateCharacterSocketData} />
        </div>
      </div>
      <div id="actionsWrapper" className={styles.actionsWrapper}>
        <label className={styles.currentRound}>Kör</label>
        <div id="numberOfCurrentRound" className={styles.currentRound}>
          1.
        </div>
        <div className={styles.init}>KÉ:</div>
        <div className={styles.stats}>CSA:</div>
        <div className={styles.stats} id="initiative"></div>
        <div className={styles.stats} id="initiativeWithRoll"></div>
        <div id="numberOfActionsText">CS. száma:</div>
        <div id="numberOfActions" className={styles.numberOfActions}></div>
        <button id="adjustActionsPositive" className={styles.adjustActions} onClick={handleAdjustActionsPositive}>
          +
        </button>
        <button id="adjustActionsNegative" className={styles.adjustActions} onClick={handleAdjustActionsNegative}>
          -
        </button>
        <button type="" id="initRollButton" className={styles.initRollButton} onClick={handleInitiativeRoll} disabled={false}>
          Kezdeményező dobás
        </button>
        <button id="tacticsButton" onClick={handleWhenTacticsUsed} className={styles.endOfCombatButton}>
          Taktika
        </button>
        <button
          onClick={handleEndOfRound}
          className={styles.endOfRoundButton}
          onMouseEnter={() => {
            if (buffTextChecker("Chi-harc")) {
              handleChiCombatBeforeEndOfRound();
            }
            if (defensiveCombatOn) {
              handleDefensiveCombatBeforeEndOfRound();
            }
          }}
        >
          Kör vége
        </button>
        <button className={styles.endOfCombatButton} onClick={handleEndOfCombat}>
          Harc vége
        </button>
        <div id="numberOfReactionsText">Reakc. száma:</div>
        <div id="numberOfReactions" className={styles.numberOfActions}>
          0
        </div>
        <button id="adjustReactionsPositive" className={styles.adjustReactions} onClick={handleAdjustReactionsPositive}>
          Tartalékolás / Készenlét
        </button>
        <select id="initiativeLightDiceResult" className={styles.initiativeLightDiceResult} disabled={true}>
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
        <select id="initiativeDarkDiceResult" className={styles.initiativeDarkDiceResult} disabled={true}>
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
        <button id="initiativeBonusButton" onClick={handleBonusInitByLP} className={styles.initiativeBonusButton}>
          +6 Csa
        </button>
      </div>
      <div id="chiCombatContinuePopupWindow" className={styles.chiCombatContinuePopupWindow} onMouseLeave={() => (chiCombatContinuePopupWindow.style.display = "none")}>
        <div id="chiCombatContinuePopupWindowText" className={styles.chiCombatContinuePopupWindowText}>
          Folytatod a Chi-harcot?
        </div>
        <button id="chiCombatContinuePopupWindowNoButton" className={styles.chiCombatContinuePopupWindowNoButton} onClick={handleChiCombatCancel}>
          Nem
        </button>
        <button id="chiCombatContinuePopupWindowYesButton" className={styles.chiCombatContinuePopupWindowYesButton} onClick={handleChiCombatContinue}>
          Igen
        </button>
        <button id="chiCombatContinuePopupWindowOKButton" className={styles.chiCombatContinuePopupWindowOKButton} onClick={handleChiCombatCancel}>
          OK
        </button>
      </div>
      <div id="defensiveCombatContinuePopupWindow" className={styles.defensiveCombatContinuePopupWindow} onMouseLeave={() => (defensiveCombatContinuePopupWindow.style.display = "none")}>
        <div id="defensiveCombatPopupWindowText" className={styles.defensiveCombatPopupWindowText}>
          Folytatod a Védekező harcot?
        </div>
        <button id="defensiveCombatPopupWindowNoButton" className={styles.defensiveCombatPopupWindowNoButton} onClick={handleDefensiveCombatCancel}>
          Nem
        </button>
        <button id="defensiveCombatPopupWindowYesButton" className={styles.defensiveCombatPopupWindowYesButton} onClick={handleDefensiveCombatContinue}>
          Igen
        </button>
      </div>
    </>
  );
}

export default CharacterDetails;
