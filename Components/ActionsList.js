import {
  firstAttackInRoundSpent,
  chargeWasUsedThisRound,
  combinationWasUsedThisRound,
  twoWeaponAttackModifiers,
  twoWeaponAttackModifiersIndex,
  twoWeaponAttackWasUsedThisRound,
  currentlySelectedWeapon,
  weaponsOptions,
  filteredArrayIfHasAssassination,
  arrayOfAllComplexManeuvers,
  baseAimWithTeoCalculator,
  currentlySelectedWeaponChanger,
  fetchCharacterDataOnlyGameId,
  handleWhenWeaponHasMultipleTypes,
  checkWhatBonusYouGetForSelectedManeuver,
  setSkillForManeuver,
  baseAtkWithTeoCalculator,
  baseDefWithTeoCalculator,
  allActiveBuffs,
  combinationModifiersIndex,
  combinationModifiersIndexChanger,
  setFirstAttackInRoundSpent,
  checkIfWeaponIsRanged,
  combatStatRefresher,
  commonModifiers,
  currentAimedSpellModifier,
  currentAimedSpellModifierSetter,
  updateCharacterSocketData,
  socket,
} from "../pages";
import styles from "../styles/actionlist.module.css";
import { initRolled, updateCharacterData } from "./CharacterDetails";
import Spells, {
  actionsSpentSinceLastCastAdderCheckerAndNullifier,
  checkIfCurrentSpellNeedsAimOrAttackRollAndReturnTheModifier,
  currentCombatSpell,
  currentCombatSpellChanger,
  spellsThatModifyCombatStatsObject,
} from "./Spells";
import { spellCastingFailure } from "./Spells";

export let activeFormsTableBase = {
  // formasablon táblázat
  power: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  Ép: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  init: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
  atkPerRound: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6],
  atk: [-2, -0.5, 1, 2.5, 4, 5.5, 7, 8.5, 10, 11.5, 13, 14.5],
  def: [4, 5.5, 7, 8.5, 10, 11.5, 13, 14.5, 16, 17.5, 19, 20.5],
  SFÉ: [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  movement: [12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100],
  physicalResist: [3, 5, 7, 9, 11, 13, 15, 16, 17, 18, 19, 20],
  evasiveResist: [3, 5, 7, 9, 11, 13, 15, 16, 17, 18, 19, 20],
  spiritualResist: [3, 5, 7, 9, 11, 13, 15, 16, 17, 18, 19, 20],
  professionLevel: [0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4],
};
export let activeFormsElementalCreatures = {
  fire: { atk: 1, SFÉ: false, spiritualResist: -1 },
  water: { def: 1, SFÉ: false, evasiveResist: -1 },
  earth: { maxDmg: 2, SFÉ: true, movement: -4, evasiveResist: -2 },
  air: { maxDmg: -2, SFÉ: false, movement: 4, physicalResist: -1, evasiveResist: 1 },
};
export let activeFormsElementalWeapons = {
  fire: { atk: 0.5, SFÉ: false, spiritualResist: -1 },
  water: { atk: 0.5, def: 0.5, SFÉ: false, evasiveResist: -1 },
  earth: { maxDmg: 3, SFÉ: true, movement: -6, evasiveResist: -2 },
  air: { maxDmg: -3, SFÉ: false, movement: 6, physicalResist: -1, evasiveResist: 1 },
};

export let attackRollButtonWasDisabledBeforeSpellCast = false;
export function attackRollButtonWasDisabledBeforeSpellCastSetter(boolean) {
  attackRollButtonWasDisabledBeforeSpellCast = boolean;
}
export let chargeOn = false;
export function chargeToFalse() {
  chargeOn = false;
}
export let numberOfDiceFromSpellCastWindow = 0;
export let assassinationOn = false;
export function assassinationToFalse() {
  assassinationOn = false;
}
export let twoWeaponAttackOn = false;
export function twoWeaponAttackToFalse() {
  twoWeaponAttackOn = false;
}
export let findWeakSpotOn = false;
export function findWeakSpotOnToFalse() {
  findWeakSpotOn = false;
}
export let attackOfOpportunityOn = false;
export function attackOfOpportunityOnSetToFalse() {
  attackOfOpportunityOn = false;
}
export let defensiveCombatOn = false;
export function defensiveCombatOnSetToFalse() {
  defensiveCombatOn = false;
}
export let defensiveCombatVEObonus = 0;
export function setDefensiveCombatVEObonus(amount) {
  defensiveCombatVEObonus = amount;
}
export let theRoundDefensiveCombatWasUsedIn;
export let totalActionCostOfAttack = 2;
export function totalActionCostOfAttackSetter(amount) {
  totalActionCostOfAttack += amount;
}
export let hmoModified = false;
export function hmoModifiedToFalse() {
  hmoModified = false;
}
export function hmoModifier(amount) {
  charAtk.value = parseFloat(charAtk.value) + amount;
  charDef.value = parseFloat(charDef.value) + amount;
  charDefWithParry.value = parseFloat(charDefWithParry.value) + amount;
  charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + amount;
}
export let numberOfActionsSpentReloading = 0;

export let spellNeedsAimRoll = false;
export function spellNeedsAimRollSetToFalse() {
  spellNeedsAimRoll = false;
}
export let charAtkValueSave = 0;
export let charDefValueSave = 0;
export let combinationModifiersIndexSave = 0;
export let atkPerRoundSave = 0;
export let weaponBeforeCasting;
export function blinkingText(elementId, text) {
  elementId.innerText = text;
  elementId.animate([{ color: "white" }, { color: "black" }], 300);
  setTimeout(() => {
    elementId.animate([{ color: "white" }, { color: "black" }], 300);
  }, 300);
  setTimeout(() => {
    elementId.animate([{ color: "white" }, { color: "black" }], 300);
  }, 600);
}

export function disableAllActionButtons() {
  document.querySelectorAll();
}
export function toggleTwoHandedWeaponsDisplay(display) {
  for (let i = 0; i < weaponsOptions.length; i++) {
    if (
      weaponsOptions[i].innerText.includes("kétkézzel") ||
      weaponsOptions[i].innerText.includes("Kétkezes") ||
      weaponsOptions[i].innerText.includes("Pallos") ||
      weaponsOptions[i].innerText.includes("Alabárd")
    ) {
      weaponsOptions[i].style.display = display;
    }
  }
}
export let findWeakSpotModifier = 0;
export function findWeakSpotModifierNullifier() {
  findWeakSpotModifier = 0;
}
export function reloadFailed(anyCondition = true) {
  if (anyCondition && numberOfActionsSpentReloading >= 1 && !currentlySelectedWeapon.readyToFireOrThrow) {
    numberOfActionsSpentReloading = 0;
    if (currentlySelectedWeapon.w_type == "VET" || currentlySelectedWeapon.w_type == "NYD" || currentlySelectedWeapon.w_type == "PD") {
      blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`);
    } else {
      blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`);
    }
  }
}
export let firstAttackIsSpellThatNeedsAimRoll = false;
export function firstAttackIsSpellThatNeedsAimRollSetToFalse() {
  firstAttackIsSpellThatNeedsAimRoll = false;
}
export let firstAttackIsAttackOfOpportunity = false;
export function firstAttackIsAttackOfOpportunitySetToFalse() {
  firstAttackIsAttackOfOpportunity = false;
}

export function elementalModifierAdder(activeFormsObjToModify, spellName) {
  if (spellName.toLowerCase().includes("tűz")) {
    let activeFormsFireCreaturesModifierKeys = Object.keys(activeFormsElementalCreatures.fire);
    let activeFormsFireCreaturesModifierValues = Object.values(activeFormsElementalCreatures.fire);
    for (let i = 0; i < activeFormsFireCreaturesModifierKeys.length; i++) {
      let ts = activeFormsObjToModify[activeFormsFireCreaturesModifierKeys[i]];
      if (activeFormsFireCreaturesModifierValues[i] === false) {
        activeFormsObjToModify[activeFormsFireCreaturesModifierKeys[i]] = "nincs";
      } else {
        activeFormsObjToModify[activeFormsFireCreaturesModifierKeys[i]] += activeFormsFireCreaturesModifierValues[i];
      }
    }
  }
}

let powerIndex = 0;
export function guidedSpellActiveFormLoader() {
  // aktív formák adatait betöltő függvény
  for (let i = 0; i < allActiveBuffs.length; i++) {
    if (allActiveBuffs[i].innerText.includes("irányított")) {
      powerIndex = parseInt(allActiveBuffs[i].innerText.slice(allActiveBuffs[i].innerText.lastIndexOf("E") - 2));
      for (let j = 0; j < spellsThatModifyCombatStatsObject.length; j++) {
        if (allActiveBuffs[i].innerText.includes(spellsThatModifyCombatStatsObject[j].spellName) && !currentCombatSpell.length) {
          currentCombatSpellChanger(spellsThatModifyCombatStatsObject[j]);
          break;
        }
      }
      break;
    }
  }
  numberOfDiceInput.value = (powerIndex - 1) * 2;
  let currentActiveFormObj = {};
  let activeFormsTableBaseKeys = Object.keys(activeFormsTableBase);
  let activeFormsTableBaseValue = Object.values(activeFormsTableBase);

  for (let k = 0; k < activeFormsTableBaseKeys.length; k++) {
    currentActiveFormObj[activeFormsTableBaseKeys[k]] = activeFormsTableBaseValue[k][powerIndex - 1];
  }
  elementalModifierAdder(currentActiveFormObj, currentCombatSpell.spellName);

  if (baseAtkWithTeoCalculator > currentActiveFormObj.atk) {
    // ha a varázshasználó alap statja nagyobb, mint amit a varázslat a formasablon tábla alapján kapna
    currentActiveFormObj.atk = baseAtkWithTeoCalculator;
    currentActiveFormObj.def = baseDefWithTeoCalculator;
  }
  guidedSpellRevealButton.style.display = "grid";
  guidedSpellName.innerText = currentCombatSpell.spellName;
  guidedSpellEp.value = currentActiveFormObj.Ép;
  guidedSpellInit.innerText = currentActiveFormObj.init;
  guidedSpellAttackPerRound.innerText = currentActiveFormObj.atkPerRound;
  guidedSpellAttack.innerText = currentActiveFormObj.atk + currentCombatSpell.modifier;
  guidedSpellDefense.innerText = currentActiveFormObj.def + currentCombatSpell.modifier;
  guidedSpellMovement.innerText = currentActiveFormObj.movement;
  guidedSpellSFE.innerText = currentActiveFormObj.SFÉ;
  guidedSpellPhysical.innerText = currentActiveFormObj.physicalResist;
  guidedSpellEvasion.innerText = currentActiveFormObj.evasiveResist;
  guidedSpellSpiritual.innerText = currentActiveFormObj.spiritualResist;
  guidedSpellProfession.innerText = currentActiveFormObj.professionLevel;
}
export function handleIfSpellDoesNotNeedAimRoll() {
  if (currentCombatSpell.isGuided) {
    guidedSpellActiveFormLoader();
  }
  // spellTypeQuestionWindow.style.display = "none";
  if (attackRollButtonWasDisabledBeforeSpellCast) {
    attackRollButton.disabled = true;
  } else if (!attackRollButtonWasDisabledBeforeSpellCast) {
    attackRollButton.disabled = false;
  }
  numberOfDiceInput.disabled = false;
}
export function handleIfSpellNeedsAimRoll() {
  spellNeedsAimRoll = true;
  weaponBeforeCasting = currentlySelectedWeapon;
  currentlySelectedWeaponChanger("Célzott mágia");
  if (currentCombatSpell.whatDoesItModify && currentCombatSpell.whatDoesItModify.includes("CÉO")) {
    // 0.index: melyik spell, 1.index: mire ad pluszt, 2.index: mennyit
    currentAimedSpellModifierSetter(parseFloat(currentCombatSpell.modifier));
    combatStatRefresher();
  } else if (spellAimInput.value) {
    charAtk.value = baseAimWithTeoCalculator + commonModifiers + parseFloat(spellAimInput.value);
  }
  combinationCheckBox.disabled = true;
  if (initRolled == true) {
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      arrayOfAllComplexManeuvers[i].disabled = true;
    }
  }
  attackRollButton.disabled = false;
  if (initRolled && !firstAttackInRoundSpent) {
    firstAttackIsSpellThatNeedsAimRoll = true;
  }
  // spellTypeQuestionWindow.style.display = "none";
}
let currentActionExtraCost = 0;
function ActionList() {
  function handleRecurringActionButton() {
    for (let i = 0; i < allActiveBuffs.length; i++) {
      if (allActiveBuffs[i].innerText.includes("ismétlődő")) {
        currentCombatSpellChanger(checkIfCurrentSpellNeedsAimOrAttackRollAndReturnTheModifier(allActiveBuffs[i].innerText));
        numberOfDiceInput.value = parseInt(parseInt(allActiveBuffs[i].innerText.slice(allActiveBuffs[i].innerText.lastIndexOf("E") - 2)) - 1) * 2;
        break;
      }
    }
    handleIfSpellNeedsAimRoll();
    if (initRolled) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      recurringSpellActionButton.disabled = true;
    }
  }

  function handleExtraAttackRadio(event) {
    if (firstAttackInRoundSpent == false) {
      event.target.checked = false;
      return;
    }
    if (firstAttackInRoundSpent && initRolled) {
      if (event.target.checked == true) {
        totalActionCostOfAttack = 3;
        attackRollButtonWasDisabledBeforeSpellCastSetter(false);
        // ha 3-nál kevesebb cselekedeted van, akkor ne világosodjon ki a támadó gomb.
        if (parseInt(numberOfActions.innerText) >= 3) {
          attackRollButton.disabled = false;
        }
        if (currentlySelectedWeapon.w_type != "MÁGIA" && !currentlySelectedWeapon.readyToFireOrThrow) {
          attackRollButton.disabled = true;
        }
      }
      if (event.target.checked == false) {
        totalActionCostOfAttack = 2;
        attackRollButton.disabled = true;
      }
    }
  }
  function handleComplexManeuverRadio(event) {
    if (initRolled) {
      let professionLevelIndex = handleWhenWeaponHasMultipleTypes(currentlySelectedWeapon.w_type, event.target.value)[1]; // 1-es indexen adja vissza a képzettség szintjét
      // kiírja, hogy milyen bónusz várható
      checkWhatBonusYouGetForSelectedManeuver(event.target.value, professionLevelIndex);
      setSkillForManeuver();
    }
    currentActionExtraCost = event.target.parentElement.value;
    if (parseInt(numberOfActions.innerText) < 4 && combinationWasUsedThisRound == false) {
      combinationCheckBox.disabled = true;
    }
    if (initRolled == true && parseInt(numberOfActions.innerText) < totalActionCostOfAttack + currentActionExtraCost) {
      attackRollButton.disabled = true;
    }
    if (initRolled == true && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack + currentActionExtraCost && combinationCheckBox.checked == true) {
      attackRollButton.disabled = false;
    }
    if (
      (event.target.value == "Kétkezes harc" && parseInt(numberOfActions.innerText) < 4) ||
      (event.target.value == "Kétkezes harc" && combinationCheckBox.checked == true && parseInt(numberOfActions.innerText) < 5)
    ) {
      attackRollButton.disabled = true;
    }
    if (initRolled == true && event.target.value == "Roham" && chargeOn == false && chargeWasUsedThisRound == false) {
      chargeOn = true;
      charAtk.value = parseFloat(charAtk.value) + 1;
      charDef.value = parseFloat(charDef.value) - 1;
      charDefWithParry.value = parseFloat(charDefWithParry.value) - 1;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - 1;
    }
    if (event.target.value != "Roham" && chargeOn == true && chargeWasUsedThisRound == false) {
      chargeOn = false;
      charAtk.value = parseFloat(charAtk.value) - 1;
      charDef.value = parseFloat(charDef.value) + 1;
      charDefWithParry.value = parseFloat(charDefWithParry.value) + 1;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1;
    }
    if (initRolled == true && event.target.value == "Kétkezes harc" && twoWeaponAttackOn == false && twoWeaponAttackWasUsedThisRound == false) {
      twoWeaponAttackOn = true;
      hmoModifier(twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
      toggleTwoHandedWeaponsDisplay("none");
    }
    if (initRolled == true && event.target.value != "Kétkezes harc" && twoWeaponAttackOn == true && twoWeaponAttackWasUsedThisRound == false) {
      twoWeaponAttackOn = false;
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
      toggleTwoHandedWeaponsDisplay("grid");
    }

    if (event.target.value == "Orvtámadás" && assassinationOn == false && filteredArrayIfHasAssassination.length != 0) {
      charAtk.value = parseFloat(charAtk.value) + filteredArrayIfHasAssassination[0].level + 3;
      assassinationOn = true;
    }
    if (event.target.value != "Orvtámadás" && assassinationOn == true && filteredArrayIfHasAssassination.length != 0) {
      charAtk.value = parseFloat(charAtk.value) - filteredArrayIfHasAssassination[0].level - 3;
      assassinationOn = false;
    }
  }

  //****************************************************************************** *************************************************/
  // dupla kattintásra kiszedi a radio kijelölést. Több helyen disabled lesz a dobó gomb, mivel az első dobás után csak kombináció/kapáslövéssel lehet újra dobni
  //**************************************************************************************************************************** */

  function handleRadioUnselect(event) {
    event.target.checked = false;
    if (initRolled == true && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack - event.target.parentElement.value) {
      attackRollButton.disabled = false;
    }
    if (event.target.value == "Kétkezes harc" && initRolled == true && twoWeaponAttackOn == true && twoWeaponAttackWasUsedThisRound == false) {
      hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
      twoWeaponAttackOn = false;
      toggleTwoHandedWeaponsDisplay("grid");
    }
    if (event.target.value == "Roham" && chargeOn == true) {
      chargeOn = false;
      charAtk.value = parseFloat(charAtk.value) - 1;
      charDef.value = parseFloat(charDef.value) + 1;
      charDefWithParry.value = parseFloat(charDefWithParry.value) + 1;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1;
    }
    if (event.target.value == "Orvtámadás" && filteredArrayIfHasAssassination.length != 0 && assassinationOn == true) {
      charAtk.value = parseFloat(charAtk.value) - filteredArrayIfHasAssassination[0].level - 3;
      assassinationOn = false;
    }
  }
  function handleOtherManeuvers(event) {
    let nameOfManeuver = event.target.parentElement.firstChild.innerText;
    if (initRolled == true) {
      if (totalActionCostOfAttack <= parseInt(numberOfActions.innerText)) {
        attackRollButton.disabled == true;
      }
      if (nameOfManeuver.includes("Fegyverváltás") && parseInt(numberOfActions.innerText) != 0) {
        weapons.disabled = false;
        offHand.disabled = false;
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
        actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
        event.target.disabled = true;
        for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
          arrayOfAllComplexManeuvers[i].checked = false;
        }
      }
      if (
        nameOfManeuver.includes("Gyenge") &&
        parseInt(numberOfActions.innerText) != 0 &&
        findWeakSpotOn == false &&
        !checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) // távolsági fegyverre nem mehet gyenge pontok felmérése
      ) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
        actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
        findWeakSpotModifier = 0.5;
        findWeakSpotOn = true;
        findWeakSpotButton.disabled = true;
        combatStatRefresher();
      }
      if ((nameOfManeuver.includes("töltés") && parseInt(numberOfActions.innerText) != 0) || (nameOfManeuver.includes("töltés") && currentlySelectedWeapon.reloadTime == 0)) {
        if (currentlySelectedWeapon.reloadTime != 0) {
          numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
          numberOfActionsSpentReloading++;
        }

        if (
          currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading > 0 ||
          (firstAttackInRoundSpent == true && combinationCheckBox.checked == false) ||
          parseInt(numberOfActions.innerText) < totalActionCostOfAttack
        ) {
          attackRollButton.disabled = true;
          reloadButton.disabled = false;
          if (currentlySelectedWeapon.w_type == "VET" || currentlySelectedWeapon.w_type == "NYD" || currentlySelectedWeapon.w_type == "PD") {
            blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`);
          } else {
            blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`);
          }
        }
        if (currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading <= 0) {
          currentlySelectedWeapon.readyToFireOrThrow = true;
          reloadButton.disabled = true;
          warningWindow.innerText = "";
          numberOfActionsSpentReloading = 0;
          if (firstAttackInRoundSpent == true && combinationCheckBox.checked == true && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack) {
            attackRollButton.disabled = false;
          }
          if (firstAttackInRoundSpent == false && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack) {
            attackRollButton.disabled = false;
          }
        }
      }
      reloadFailed(!nameOfManeuver.includes("töltés"));
    }
    // ************************* Ha az akció, amire kattintottak nem varázslás, és épp van varázslás folyamatban, akkor a varázslat megszakad
    //*********************************************************************************** */
    spellCastingFailure(!nameOfManeuver.includes("Varázslás"));

    if ((initRolled == true && parseInt(numberOfActions.innerText) != 0 && (nameOfManeuver.includes("Elterelés") || nameOfManeuver.includes("Mozgás"))) || nameOfManeuver.includes("Manipuláció")) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
    }
    if (
      initRolled == true &&
      (parseInt(numberOfActions.innerText) != 0 || parseInt(numberOfReactions.innerText) != 0) &&
      (nameOfManeuver.includes("Hárítás") || nameOfManeuver.includes("Kitérés") || nameOfManeuver.includes("ösztön") || nameOfManeuver.includes("rutin"))
    ) {
      if (parseInt(numberOfReactions.innerText) >= 1) {
        numberOfReactions.innerText = parseInt(numberOfReactions.innerText) - 1;
      } else {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
        actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
      }
    }
    if (initRolled == true && (parseInt(numberOfActions.innerText) != 0 || parseInt(numberOfReactions.innerText) != 0) && nameOfManeuver.includes("Közbevágás") && attackOfOpportunityOn == false) {
      attackOfOpportunityOn = true;
      if (parseInt(numberOfReactions.innerText) >= 1) {
        numberOfReactions.innerText = parseInt(numberOfReactions.innerText) - 1;
      } else {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
        actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
      }
      attackOfOpportunityButton.disabled = true;
      if (firstAttackInRoundSpent == false) {
        firstAttackIsAttackOfOpportunity = true;
      }
      attackRollButton.disabled = false;
    }
    if (initRolled && parseInt(numberOfActions.innerText) != 0 && nameOfManeuver.includes("Védekező") && firstAttackInRoundSpent == false && !defensiveCombatButton.disabled) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      actionsSpentSinceLastCastAdderCheckerAndNullifier(1);
      setFirstAttackInRoundSpent(true);
      attackRollButton.disabled = true;
      combinationCheckBox.disabled = false;
      defensiveCombatButton.disabled = true;
      defensiveCombatOn = true;
      defensiveCombatVEObonus = 2;
      combatStatRefresher();
    }
  }

  function handleGameIdWrapperClose() {
    gameIdWrapper.style.display = "none";
    gameIdWrapperRevealButton.style.display = "grid";
  }

  function handleGameIdInput() {
    if (gameIdInput.value == "") {
      return;
    }
    socket.emit("join room", gameIdInput.value);
    updateCharacterData(true);
    // az update után kell egy kis késleltetés hogy legyen ideje megjönni az adatnak
    setTimeout(() => {
      fetchCharacterDataOnlyGameId(charName.innerText);
    }, 500);
    gameIdWrapper.style.display = "none";
    gameIdWrapperRevealButton.style.display = "grid";
    socket.emit("leave room", gameIdLabel.innerText);
    //updateCharacterSocketData();
    // socket.emit("create new player");
  }
  function handleGameIdWrapperRevealButton() {
    gameIdWrapper.style.display = "grid";
    gameIdWrapperRevealButton.style.display = "none";
  }

  function handleGuidedSpellCheckbox() {
    if (guidedSpellCombatStatChangerCheckbox.checked) {
      weaponBeforeCasting = currentlySelectedWeapon;
      //  atkPerRoundSave = currentlySelectedWeapon.atkPerRound
      currentlySelectedWeaponChanger("Irányított mágia");
      currentlySelectedWeapon.atkPerRound = parseInt(guidedSpellAttackPerRound.innerText);
      numberOfDiceInput.value = (powerIndex - 1) * 2;
      // charAtkValueSave = charAtk.value;
      // charDefValueSave = charDef.value
      // combinationModifiersIndexSave = combinationModifiersIndex
      charAtk.value = parseFloat(guidedSpellAttack.innerText);
      charDef.value = parseFloat(guidedSpellDefense.innerText);
    } else if (!guidedSpellCombatStatChangerCheckbox.checked && weaponBeforeCasting) {
      currentlySelectedWeaponChanger(weaponBeforeCasting.w_name);
      // combinationModifiersIndexChanger(combinationModifiersIndexSave)
      //  charAtk.value = charAtkValueSave
      //  charDef.value = charDefValueSave
    }
    combatStatRefresher();
  }

  return (
    <>
      <div className={styles.actionsWrapper}>
        Manőverek listája
        <li>
          <span id="gameIdLabel" className={styles.gameIdLabel}></span>
        </li>
        <li>
          <span>Kombináció/Kapáslövés/Kapásdobás - Akció - +1 CS </span>
          <input value="Kombináció" id="combinationCheckBox" name="extraAttackInRound" type="checkbox" onChange={handleExtraAttackRadio} />
        </li>
        <ul id="selectableComplexManeuversList" className={styles.selectableComplexManeuversList}>
          Csatolható stílusok:
          <li value={1}>
            <span>Belharc - Akció - +1 CS </span>
            <input id="closeCombat" value="Belharc" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Birkózás - Akció - +1 CS </span>
            <input id="wrestlingRadioButton" value="Birkózás" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Fegyvertörés - Akció - +1 CS </span>
            <input id="weaponBreakRadioButton" value="Fegyvertörés" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Kínokozás - Akció - +1 CS </span>
            <input value="Kínokozás" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Lefegyverzés - Akció - +1 CS </span>
            <input id="disarmRadioButton" value="Lefegyverzés" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Pusztítás - Akció - +1 CS </span>
            <input value="Pusztítás" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Taszítás - Akció - +1 CS </span>
            <input value="Taszítás" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Távoltartás - Akció - +1 CS </span>
            <input value="Távoltartás" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <span>---------------------------------------------------------------------</span>
          <li value={1}>
            <span>Roham - Akció - +1 CS </span>
            <input id="chargeRadioButton" value="Roham" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={1}>
            <span>Orvtámadás - Akció - +1 CS </span>
            <input id="assassinationRadioButton" value="Orvtámadás" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
          <li value={0}>
            <span>Kétkezes harc - Akció - +2 CS </span>
            <input id="twoWeaponAttackRadioButton" value="Kétkezes harc" name="selectableComplexManeuvers" type="radio" onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio} />
          </li>
        </ul>
        <ul>
          <span className={styles.otherManeuversLabel}>További manőverek:</span>
        </ul>
        {/* <li id='aimAction'><span>Célzás - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='combatTrick'><span>Harci csel - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='groupFightingStyle'><span>Közös harcmodor - Reakció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='battleRage'><span>Harci láz - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li> */}
        <li>
          <span>Közbevágás - Reakció - 1 CS </span>
          <button id="attackOfOpportunityButton" onClick={handleOtherManeuvers}>
            Végrehajt
          </button>
        </li>
        <li>
          <span>Védekező harc - Akció - 1/0 CS </span>
          <button id="defensiveCombatButton" onClick={handleOtherManeuvers}>
            Végrehajt
          </button>
        </li>
        <li>
          <span>Gyenge pont - Akció - 1 CS </span>
          <button id="findWeakSpotButton" onClick={handleOtherManeuvers}>
            Végrehajt
          </button>
        </li>
        <li>
          <span>Elterelés - Akció - 1 CS </span>
          <button onClick={handleOtherManeuvers}>Végrehajt</button>
        </li>
        <li>
          <span>Harci rutin - Reakció - 1/0 CS </span>
          <button onClick={handleOtherManeuvers}>Végrehajt</button>
        </li>
        <li>
          <span>Harci ösztön - Reakció - 1/0 CS </span>
          <button onClick={handleOtherManeuvers}>Végrehajt</button>
        </li>
        <li id="parryAction">
          <span>Hárítás - Reakció - 1 CS </span>
          <button onClick={handleOtherManeuvers}>Végrehajt</button>
        </li>
        <li>
          <span>Kitérés - Reakció - 1 CS </span>
          <button onClick={handleOtherManeuvers}>Végrehajt</button>
        </li>
        <li>
          <span>Mozgás - Akció - 1 CS </span>
          <button onClick={handleOtherManeuvers}>Végrehajt</button>
        </li>
        <li>
          <span>Újratöltés / Dobófegyver előkészítése - Akció - X CS </span>
          <button id="reloadButton" onClick={handleOtherManeuvers}>
            Végrehajt
          </button>
        </li>
        <li>
          <span>Fegyverváltás - Akció - 1 CS </span>
          <button id="weaponChangeButton" onClick={handleOtherManeuvers}>
            Végrehajt
          </button>
        </li>
        <li>
          <span>Manipuláció - Akció - 1 CS </span>
          <button id="manipulationButton" onClick={handleOtherManeuvers}>
            Végrehajt
          </button>
        </li>
      </div>
      <div className={styles.ammoWrapper}>
        Lőszer:
        <input id="ammoAmountInput" type="number" />
        <button>Összeszed</button>
      </div>
      <div id="gameIdWrapper" className={styles.gameIdWrapper}>
        <span>
          Játék azonosítója:
          <button onClick={handleGameIdWrapperClose}>Eltüntet</button>
        </span>
        <span>
          <input id="gameIdInput" />
          <button onClick={handleGameIdInput}>Csatlakozás</button>
        </span>
      </div>
      <button id="gameIdWrapperRevealButton" onClick={handleGameIdWrapperRevealButton} className={styles.gameIdWrapperRevealButton}>
        Csatlakozás Új Játékhoz
      </button>
      <button id="recurringSpellActionButton" onClick={handleRecurringActionButton} className={styles.recurringSpellActionButton}>
        {" "}
        Ismétlődő varázslat
      </button>
      <button
        id="guidedSpellRevealButton"
        onClick={() => {
          guidedSpellWrapper.style.display = "grid";
          spellCastButtonWrapper.style.display = "none";
        }}
        className={styles.guidedSpellRevealButton}
      >
        {" "}
        Irányított varázslat megjelenítése
      </button>
      <div id="guidedSpellWrapper" className={styles.guidedSpellWrapper}>
        <span id="guidedSpellName" className={styles.guidedSpellName}></span>
        <span></span>
        <span className={styles.guidedSpellLabel}>ÉP:</span>
        <input id="guidedSpellEp" type="number" />
        <span className={styles.guidedSpellLabel}>KÉ:</span>
        <span id="guidedSpellInit"></span>
        <span className={styles.guidedSpellLabel}>Tám/kör:</span>
        <span id="guidedSpellAttackPerRound"></span>
        <span className={styles.guidedSpellLabel}>TÉO:</span>
        <span id="guidedSpellAttack"></span>
        <span className={styles.guidedSpellLabel}>VÉO:</span>
        <span id="guidedSpellDefense"></span>
        <span className={styles.guidedSpellLabel}>Mozgás:</span>
        <span id="guidedSpellMovement"></span>
        <span className={styles.guidedSpellLabel}>SFÉ:</span>
        <span id="guidedSpellSFE"></span>
        <span className={styles.guidedSpellLabel}>Fizikai:</span>
        <span id="guidedSpellPhysical"></span>
        <span className={styles.guidedSpellLabel}>Elkerülő:</span>
        <span id="guidedSpellEvasion"></span>
        <span className={styles.guidedSpellLabel}>Szellemi:</span>
        <span id="guidedSpellSpiritual"></span>
        <span className={styles.guidedSpellLabel}>Képz.szint:</span>
        <span id="guidedSpellProfession"></span>
        <span className={styles.guidedSpellCheckboxLabel}>
          Ezzel támadok:
          <input id="guidedSpellCombatStatChangerCheckbox" className={styles.guidedSpellCheckbox} type="checkbox" onChange={handleGuidedSpellCheckbox} />
        </span>
        <button
          id="guidedSpellHideButton"
          onClick={() => {
            guidedSpellWrapper.style.display = "none";
            spellCastButtonWrapper.style.display = "grid";
            guidedSpellCombatStatChangerCheckbox.checked = false;
            handleGuidedSpellCheckbox();
          }}
          className={styles.guidedSpellButton}
        >
          Elrejtés
        </button>
      </div>
      <Spells />
    </>
  );
}

export default ActionList;
