import styles from "../styles/actionlist.module.css";
import allSpells from "../json/allSpells.json";
import spellsWizard from "../json/spellsWizard.json";
import spellAttributes from "../json/spellAttributes.json";
import {
  allMagicSubskillsObject,
  allResultsCleaner,
  filteredArrayIfHasAnyMagicSkill,
  currentGodWorshippedByPlayer,
  allActiveBuffs,
  CharCompare,
  combatStatRefresher,
  aptitudeObject,
  updateCharacterSocketData,
  attributeFinder,
} from "../pages";
import {
  attackRollButtonWasDisabledBeforeSpellCastSetter,
  blinkingText,
  defensiveCombatOn,
  handleIfSpellDoesNotNeedAimRoll,
  handleIfSpellNeedsAimRoll,
  setDefensiveCombatVEObonus,
} from "./ActionsList";
import { initRolled } from "./CharacterDetails";
import { emptyAllRollModifiersArray, evaluateSkillOrAttributeCheckBase, handleSkillCheck, skillOrAttributeCheckRoll } from "./SkillCheck";
import { buffRemoverFromActiveBuffArrayAndTextList } from "./PsiDisciplines";
import AspectComponentPower from "./AspectComponentPower";
import AspectComponentDistance from "./AspectComponentDistance";
import AspectComponentArea from "./AspectComponentArea";
import AspectComponentDuration from "./AspectComponentDuration";
import AspectComponentMechanism from "./AspectComponentMechanism";
// ismétlődő varázslatok, amik növelik a TÉO-t vagy CÉO-t
//let recurringSpellsThatRequireAttackOrAimRoll = allSpells.filter((spell)=>spell.description.toLowerCase().includes("ismétlődő") && spell.resist.includes("vVÉO"))
// minden varázslat, ami növeli a TÉO-t vagy CÉO-t
let spellsThatModifyCombatStats = allSpells.filter(
  (spell) =>
    ((spell.description.includes("CÉO") || spell.description.includes("TÉO") || spell.description.includes("HMO")) &&
      !spell.description.toLowerCase().includes("negatív") &&
      !spell.description.toLowerCase().includes("hátrány") &&
      spell.description.toLowerCase().includes("+")) ||
    spell.description.toLowerCase().includes("kontrollált")
);
export let spellsThatModifyCombatStatsObject = {};
for (let i = 0; i < spellsThatModifyCombatStats.length; i++) {
  let indexOfPositiveCombatModifier = spellsThatModifyCombatStats[i].description.lastIndexOf("+");
  let isRecurring = false;
  let isControlled = false;
  let isGuided = false;
  let whatDoesItModify;
  if (spellsThatModifyCombatStats[i].description.toLowerCase().includes("ismétlődő")) {
    isRecurring = true;
  }
  if (spellsThatModifyCombatStats[i].description.toLowerCase().includes("kontrollált")) {
    isControlled = true;
  }
  if (spellsThatModifyCombatStats[i].description.toLowerCase().includes("irányított")) {
    isGuided = true;
  }
  if (spellsThatModifyCombatStats[i].description.includes("CÉO")) {
    whatDoesItModify = "CÉO";
  }
  if (spellsThatModifyCombatStats[i].description.includes("TÉO")) {
    whatDoesItModify = "TÉO";
  }
  if (spellsThatModifyCombatStats[i].description.includes("TÉO és VÉO") || spellsThatModifyCombatStats[i].description.includes("HMO")) {
    whatDoesItModify = "TÉO, VÉO";
  }
  spellsThatModifyCombatStatsObject[i] = {
    spellName: spellsThatModifyCombatStats[i].name,
    whatDoesItModify: whatDoesItModify || "",
    modifier: parseFloat(spellsThatModifyCombatStats[i].description.slice(indexOfPositiveCombatModifier).replace(",", ".")) || 0,
    isRecurring: isRecurring,
    isControlled: isControlled,
    isGuided: isGuided,
  };
}
spellsThatModifyCombatStatsObject = Object.values(spellsThatModifyCombatStatsObject);
export function checkIfCurrentSpellNeedsAimOrAttackRollAndReturnTheModifier(currentSpellName) {
  if (!currentSpellName) {
    return;
  }
  // összeveti a jelenleg elvarázsolt spell nevét az összes olyan spellel amik valamilyen statot adnak
  for (let i = 0; i < spellsThatModifyCombatStatsObject.length; i++) {
    if (currentSpellName.includes(spellsThatModifyCombatStatsObject[i].spellName)) {
      return spellsThatModifyCombatStatsObject[i];
    }
  }
  return {};
}
export let currentCombatSpell = {};
export function currentCombatSpellChanger(input) {
  currentCombatSpell = input;
}
export let actionsSpentSinceLastCast = 0;
export let spellIsBeingCast = false;
export let actionsNeededToBeAbleToCastAgain = 0;
export function actionsNeededToBeAbleToCastAgainNullifier() {
  actionsNeededToBeAbleToCastAgain = 0;
}
export let numberOfActionsNeededForTheSpell = 0;
export let castBarCurrentWidthStart = 0;
export let castBarCurrentWidthEnd = 0;

export function spellIsBeingCastSetToFalse() {
  spellIsBeingCast = false;
}
// export function actionsSpentSinceLastCastAdder(numberOfActions = 0) {
//   actionsSpentSinceLastCast += numberOfActions;
// }
export function actionsSpentSinceLastCastAdderCheckerAndNullifier(numberOfActions = 0) {
  if (actionsNeededToBeAbleToCastAgain <= 0) {
    // előfordulhat, hogy negativ szám lesz, ha a Mana Uraló adottság magas fokon van
    //spellCastingActionButton.disabled = false;
    //actionsSpentSinceLastCast = 0;
    return;
  }
  actionsNeededToBeAbleToCastAgain -= numberOfActions;
  // if (actionsSpentSinceLastCast >= actionsNeededToBeAbleToCastAgain) {
  //   //spellCastingActionButton.disabled = false;
  //   actionsSpentSinceLastCast = 0;
  //   actionsNeededToBeAbleToCastAgain = 0;
  // }
  console.log("lecsengés", actionsNeededToBeAbleToCastAgain);
}
export let numberOfActionsSpentOnCastingCurrentSpell = 0;
export function numberOfActionsSpentOnCastingCurrentSpellNullifier() {
  numberOfActionsSpentOnCastingCurrentSpell = 0;
}
let currentActiveLiturgy = "";
export function spellCastingSuccessful(currentSpell) {
  spellIsBeingCast = false;

  if (currentSpell.magicSubclass == "Wier vérmágia") {
    currentBloodPoints.value = parseInt(currentBloodPoints.value) - currentSpell.fok;
  }

  numberOfActionsSpentOnCastingCurrentSpell = 0;
  blinkingText(warningWindow, `A létrejött varázslat: "${currentSpell.name}"`);
  castBarFlashEffect.style.display = "grid";
  castBarFlashEffect.animate([{ height: "0vw" }, { height: "5vw" }], 200);
  castBarFlashEffect.animate([{ width: "0vw" }, { width: "18vw" }], 200);
  castBar.animate([{ opacity: 1 }, { opacity: 0 }], 100);
  setTimeout(() => {
    castBarFlashEffect.animate([{ height: "5vw" }, { height: "0vw" }], 200);
    castBarFlashEffect.animate([{ width: "18vw" }, { width: "0vw" }], 200);
  }, 200);

  setTimeout(() => {
    castBar.style.display = "none";
  }, 100);
  setTimeout(() => {
    castBarFlashEffect.style.display = "none";
  }, 390);
  //spellTypeQuestionWindow.style.display = "grid";

  // if (initRolled == true && actionsNeededToBeAbleToCastAgain > 0) {
  //   spellCastingActionButton.disabled = true;
  // }
  //actionsSpentSinceLastCast = 0;

  if (currentSpell && currentSpell.name && currentSpell.name.includes("liturgia") && currentSpell.magicSubclass.includes("fohász")) {
    currentActiveLiturgy = currentSpell.name;
    liturgyWrapper.style.display = "grid";
    liturgyPowerInfo.style.display = "grid";
    liturgyPowerInfo.innerText = `Liturgia Erőssége: ${currentSpell.aspects[0][1]}`;
    liturgyPowerInfo.value = currentSpell.aspects[0][1];
    liturgyCheckBox.style.display = "grid";
    for (let i = 0; i < allActiveBuffs.length; i++) {
      if (allActiveBuffs[i].innerText == "" || (allActiveBuffs[i].innerText != "" && allActiveBuffs[i].innerText.includes("liturgia"))) {
        allActiveBuffs[i].innerText = `${currentSpell.name}`;
        updateCharacterSocketData();
        break;
      }
    }
  }
  if (liturgyCheckBox.checked) {
    liturgyCheckBox.checked = false;
    liturgyWrapper.style.display = "none";
    liturgyPowerInfo.style.display = "none";
    liturgyPowerInfo.innerText = "";
    allPowerAspectSelect[0].value = liturgyPowerInfo.value;
    liturgyPowerInfo.value = 0;
    liturgyCheckBox.style.display = "none";
    for (let i = 0; i < allActiveBuffs.length; i++) {
      if (allActiveBuffs[i].innerText.includes("liturgia")) {
        buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText);
        updateCharacterSocketData();
        break;
      }
    }
  }
  if (currentSpell) {
    currentCombatSpell = checkIfCurrentSpellNeedsAimOrAttackRollAndReturnTheModifier(currentSpell.name);
  }
  if (currentSpell && currentSpell.name && !currentSpell.name.includes("liturgia")) {
    // a currentSpellDuration > 3 azt jelenti, hogy legalább fél óráig tart a buff,
    for (let i = 0; i < allActiveBuffs.length; i++) {
      // ezt harc előtt is felrakhatja, ezért nem kell, hogy legyen initRolled
      if (
        allActiveBuffs[i].innerText == "" ||
        (allActiveBuffs[i].innerText != "" &&
          allActiveBuffs[i].innerText.includes("folyamatos") &&
          (currentCombatSpell.isControlled || // csak a kontrollált és irányított varázslatok szakítják meg a folyamatos diszciplínát
            currentCombatSpell.isGuided)) ||
        (allActiveBuffs[i].innerText != "" &&
          allActiveBuffs[i].innerText.toLowerCase().includes("ismétlődő") && // egyszerre csak 1 ismétlődő varázslat lehet aktív, így ami épp van, azt felülírja
          currentCombatSpell.isRecurring)
      ) {
        buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText);
        if (currentSpellDuration == 2) {
          allActiveBuffs[i].innerText = `1 kör - ${currentSpell.name} - ${allPowerAspectSelect[0].value}E`;
        }
        if (currentSpellDuration == 3) {
          allActiveBuffs[i].innerText = `6 kör - ${currentSpell.name} - ${allPowerAspectSelect[0].value}E`;
        }
        if (currentSpellDuration == 4) {
          allActiveBuffs[i].innerText = `30 perc - ${currentSpell.name} - ${allPowerAspectSelect[0].value}E`;
        }
        if (currentSpellDuration == 5) {
          allActiveBuffs[i].innerText = `10 óra - ${currentSpell.name} - ${allPowerAspectSelect[0].value}E`;
        }
        //allActiveBuffs[i].parentElement.lastChild.value = `${parseInt(allActiveBuffs[i].innerText)}, ${numberOfCurrentRound.innerText}` // A törlés gomb value-ben van eltárolva az időtartam adat. Innen fogjuk vizsgálni, hogy mennyi van még hátra belőle
        if (currentCombatSpell.isRecurring) {
          // csak egy ismétlődő varázslat lehet
          allActiveBuffs[i].innerText = `${allActiveBuffs[i].innerText} - ismétlődő`;
          recurringSpellActionButton.style.display = "grid";
          if (initRolled) {
            recurringSpellActionButton.disabled = true;
          }
        }
        if (currentCombatSpell.isControlled) {
          allActiveBuffs[i].innerText = `${allActiveBuffs[i].innerText} - kontrollált`;
        }
        if (currentCombatSpell.isGuided) {
          allActiveBuffs[i].innerText = `${allActiveBuffs[i].innerText} - irányított`;
        }
        //activeBuffsArray.push(allActiveBuffs[i].innerText);
        break;
      }
    }
  }
  if (initRolled == true && attackRollButton.disabled == true) {
    attackRollButtonWasDisabledBeforeSpellCastSetter(true);
  }
  if (initRolled == true && attackRollButton.disabled == false) {
    attackRollButtonWasDisabledBeforeSpellCastSetter(false);
  }
  if (currentCombatSpell && (!currentCombatSpell.spellName || currentCombatSpell.isGuided || !currentCombatSpell.modifier)) {
    handleIfSpellDoesNotNeedAimRoll();
  } else if (currentCombatSpell && currentCombatSpell.spellName) {
    handleIfSpellNeedsAimRoll();
  }
  updateCharacterSocketData();
}
let currentSpellDuration = 0;

export let currentSpellBloodPointCost = 0;

export function spellCastingFailure(anyOtherCondition = true, currentSpell) {
  if (initRolled == true && numberOfActionsSpentOnCastingCurrentSpell >= 1 && anyOtherCondition && spellIsBeingCast == true) {
    numberOfActionsSpentOnCastingCurrentSpell = 0;
    blinkingText(warningWindow, `A megszakadt varázslat: "${currentSpell.name}"`);
    spellIsBeingCast = false;
    castBar.animate([{ opacity: 1 }, { opacity: 0 }], 400);
    setTimeout(() => {
      castBar.style.display = "none";
    }, 350);
    actionsNeededToBeAbleToCastAgain = 0;
  }
}
export let currentSpell;
let filteredSpellsBySubSkillAndLevel;
let powerAspModified = false;
let anyAspExceptPowerAspModified = false;

function manaFactorCalculator(asp) {
  let manaFactor = 0;

  for (let i = 1; i < asp; i++) {
    manaFactor += i;
  }
  return manaFactor;
}
function spellCastTimeFactorCalculator(asp = 0) {
  if (asp <= 1) {
    asp = 1;
  }
  return asp - 2;
}

function spellCastingCheckSetter() {
  if (magicSubSkillSelect.value.slice(1) == "Wier vérmágia") {
    checkTypeIsAttributeCheck.checked = true;
    attributeFinder("Aka");
    return;
  }
  let selectAllSkillOptions = document.querySelectorAll("select#skills option");
  let selectAllAttributeOptions = document.querySelectorAll("select#attributes option");

  let spellSubskillAttributesArray = spellAttributes[0][currentMainMagicSkillName][magicSubSkillSelect.value.slice(1)];
  let spellAttribute1name = spellSubskillAttributesArray[0];
  let spellAttribute2name = spellSubskillAttributesArray[1];

  // össze kell hasonlítani, melyik érték a nagyobb
  if (spellAttribute1name || spellAttribute2name) {
    let spellAttribute1value = 0;
    let spellAttribute2value = 0;
    for (let k = 0; k < selectAllAttributeOptions.length; k++) {
      if (selectAllAttributeOptions[k].innerText == spellAttribute1name) {
        spellAttribute1value = parseInt(selectAllAttributeOptions[k].value);
      }
      if (selectAllAttributeOptions[k].innerText == spellAttribute2name && spellAttribute2name) {
        spellAttribute2value = parseInt(selectAllAttributeOptions[k].value);
      }
      if (spellAttribute1value >= spellAttribute2value) {
        attributes.value = `${spellAttribute1value + "," + spellAttribute1name}`;
      }
      if (spellAttribute1value < spellAttribute2value) {
        attributes.value = `${spellAttribute2value + "," + spellAttribute2name}`;
      }
    }
  }

  for (let j = 0; j < selectAllSkillOptions.length; j++) {
    if (selectAllSkillOptions[j].value.includes(currentMainMagicSkillName)) {
      checkTypeIsSkillCheck.checked = true;
      skills.value = selectAllSkillOptions[j].value;
      break;
    }
  }
}

let spellCastingTimeMultiplier = 1; // változó a rejtett varázs (később esetleg a manaháló) miatti varázslási idő duplázódásra

export function calculateSpellCastTimeAndManaCost() {
  let finalManaCost = 0;
  let finalCastTime = 0;
  let theHighestFiveAspectsPerAspectCategory = [];
  let theHighestFiveAspects = [];
  let highestAspectPerCategory = [];
  let highestAspectOfUnmodifiedAspects = [];

  if (magicSubSkillSelect.value.slice(1) == "Wier vérmágia" || currentSpell.ritual) {
    hiddenSpellCastWrapper.style.display = "none";
  } else {
    if (aptitudeObject["Rejtett varázs"]) {
      hiddenSpellCastWrapper.style.display = "grid";
      hiddenSpellCastNoHandMotion.parentElement.style.display = "grid";
      if (currentSpell.magicSubclass.includes("fohász")) {
        hiddenSpellCastNoHandMotion.parentElement.style.display = "none";
      }
    }
  }

  for (let i = 0; i < currentSpell.aspects.length; i++) {
    let calculatedAspect = currentSpell.aspects[i][1] + currentSpell.aspects[i][2] + currentSpell.aspects[i][3];
    theHighestFiveAspects.push(calculatedAspect);
    highestAspectOfUnmodifiedAspects.push(currentSpell.aspects[i][1]);
  }
  if (currentSpell.aspects.length == 5) {
    for (let i = 0; i < currentSpell.aspects.length; i++) {
      let calculatedAspect = currentSpell.aspects[i][1] + currentSpell.aspects[i][2] + currentSpell.aspects[i][3];
      theHighestFiveAspectsPerAspectCategory.push(calculatedAspect);
    }
  }
  if (currentSpell.aspects.length > 5) {
    for (let i = 0; i < currentSpell.aspects.length; i++) {
      let calculatedAspect = currentSpell.aspects[i][1] + currentSpell.aspects[i][2] + currentSpell.aspects[i][3];

      let calculatedAspectOfNextAspect = 0;

      while (currentSpell.aspects[i + 1] && currentSpell.aspects[i][0] == currentSpell.aspects[i + 1][0]) {
        calculatedAspect = currentSpell.aspects[i][1] + currentSpell.aspects[i][2] + currentSpell.aspects[i][3];
        calculatedAspectOfNextAspect = currentSpell.aspects[i + 1][1] + currentSpell.aspects[i + 1][2] + currentSpell.aspects[i + 1][3];
        highestAspectPerCategory.push(calculatedAspect);
        highestAspectPerCategory.push(calculatedAspectOfNextAspect);
        i++;
      }
      if (highestAspectPerCategory.length == 0) {
        theHighestFiveAspectsPerAspectCategory.push(calculatedAspect);
        highestAspectPerCategory = [];
      }
      if (highestAspectPerCategory.length != 0) {
        theHighestFiveAspectsPerAspectCategory.push(Math.max(...highestAspectPerCategory));
        highestAspectPerCategory = [];
      }
    }
  }

  let highestFiveAspectDesc = theHighestFiveAspects.sort((a, b) => b - a);
  for (let i = 0; i < theHighestFiveAspectsPerAspectCategory.length; i++) {
    finalManaCost += manaFactorCalculator(highestFiveAspectDesc[i]);
    finalCastTime += spellCastTimeFactorCalculator(theHighestFiveAspectsPerAspectCategory[i]);
  }
  console.log(theHighestFiveAspectsPerAspectCategory, highestAspectOfUnmodifiedAspects);

  if (aptitudeObject["Mana vezető"] && !currentSpell.ritual) {
    // manavezető, de rituáléra nem lehet érvényes
    finalCastTime -= aptitudeObject["Mana vezető"];
  }
  spellCastingCheckSetter();
  emptyAllRollModifiersArray();
  evaluateSkillOrAttributeCheckBase();

  if (magicSubSkillSelect.value.slice(1) == "Wier vérmágia") {
    finalManaCost = currentSpell.fok;
    finalCastTime = aptitudeObject["Wier vér"] + 2;
    spellManaCostDivText.innerText = "Vér pont költség:";
    warningWindow.innerText = "";
  } else {
    spellManaCostDivText.innerText = "Mana költség:";
    let specialModifierFromHiddenSpellCast = 0;
    if (hiddenSpellCastNoHandMotion.checked || hiddenSpellCastNoVocalComponent.checked) {
      specialModifierFromHiddenSpellCast = 3;
    }
    blinkingText(warningWindow, `A varázspróba célszáma: ${10 + specialModifierFromHiddenSpellCast + Math.max(...highestAspectOfUnmodifiedAspects)}`);
    // megnézzük, hogy van-e rejtett varázs adottsága, és az ehhez tartozó ablakot elrejtjük vagy megjelenítjük
    // a wier vérmágia miatt kell ezt a vizsgálatot ide tenni.
  }

  // if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
  //   warningWindow.innerText = "";
  // }
  if (finalCastTime <= 0) {
    finalCastTime = 1;
  }
  if (finalCastTime <= 10) {
    spellCastTimeDiv.innerText = `${spellCastingTimeMultiplier * finalCastTime} CS`;
  } else if (finalCastTime > 10 && finalCastTime <= 20) {
    spellCastTimeDiv.innerText = `${spellCastingTimeMultiplier * (finalCastTime - 10)} Perc`;
  } else if (finalCastTime > 20 && finalCastTime <= 30) {
    spellCastTimeDiv.innerText = `${spellCastingTimeMultiplier * (finalCastTime - 20)} Óra`;
  } else if (finalCastTime > 30) {
    spellCastTimeDiv.innerText = `${spellCastingTimeMultiplier * (finalCastTime - 30)} Nap`;
  }

  if (currentSpell.ritual) {
    if (finalCastTime <= 10) {
      spellCastTimeDiv.innerText = `${finalCastTime * 3} CS`;
    } else if (finalCastTime > 10 && finalCastTime <= 20) {
      spellCastTimeDiv.innerText = `${(finalCastTime - 10) * 3} Perc`;
    } else if (finalCastTime > 20 && finalCastTime <= 30) {
      spellCastTimeDiv.innerText = `${(finalCastTime - 20) * 3} Óra`;
    } else if (finalCastTime > 30) {
      spellCastTimeDiv.innerText = `${(finalCastTime - 30) * 3} Nap`;
    }
    finalManaCost = Math.floor((finalManaCost * 2) / 3);
    if (finalManaCost <= 0) {
      finalManaCost = 1;
    }
  }
  spellManaCostDiv.innerText = finalManaCost;
}

function unusedSelectHider() {
  for (let i = 0; i < allAspectSelect.length; i++) {
    if (!allAspectSelect[i].parentElement.firstChild.value) {
      allAspectSelect[i].style.display = "none";
    }
    if (allAspectSelect[i].parentElement.firstChild.value) {
      allAspectSelect[i].style.display = "grid";
    }
  }
}

export function aspOptionDisabler(magicSkillLevel) {
  if (currentMainMagicSkillName == "Magas Mágia") {
    return;
  }
  if (currentSpell.magicSubclass.includes("fohász") || currentSpell.magicSubclass.includes("Wier")) {
    magicSkillLevel = 2;
  }
  if (magicSkillLevel <= 2) {
    // minden Aspektus letiltva
    for (let i = 0; i < allAspectSelect.length; i++) {
      allAspectSelect[i].disabled = true;
    }
  }
  if (magicSkillLevel == 3) {
    // az Erősséget kivéve minden Aspektus letiltva
    for (let i = 0; i < allDistanceAspectSelect.length; i++) {
      allDistanceAspectSelect[i].disabled = true;
    }
    for (let i = 0; i < allAreaAspectSelect.length; i++) {
      allAreaAspectSelect[i].disabled = true;
    }
    for (let i = 0; i < allDurationAspectSelect.length; i++) {
      allDurationAspectSelect[i].disabled = true;
    }
  }
  if (magicSkillLevel == 4) {
    for (let i = 5; i < allAspectSelect.length; i++) {
      let aspOptions = allAspectSelect[i];
      for (let j = 0; j < aspOptions.length; j++) {
        aspOptions[j].disabled = true;
      }
      for (let j = 0; j < aspOptions.length; j++) {
        if (aspOptions[j - 1] && aspOptions[j].value == parseInt(aspOptions.parentElement.firstChild.value)) {
          aspOptions[j - 1].disabled = false;
        }
        if (aspOptions[j].value == parseInt(aspOptions.parentElement.firstChild.value)) {
          aspOptions[j].disabled = false;
        }
        if (aspOptions[j + 1] && aspOptions[j].value == parseInt(aspOptions.parentElement.firstChild.value)) {
          aspOptions[j + 1].disabled = false;
          break;
        }
      }
    }
  }
  if (magicSkillLevel == 5) {
    // for (let i = 1; i < allAspSelect.length; i++) {
    //   allAspSelect[i].disabled = false;
    // }
  }
}
//let modifiedAspectIndex = {}
export function handleSpellAspOptionChange(event) {
  let indexOfCurrentAspect = parseInt(event.target.parentElement.firstChild.value.slice(event.target.parentElement.firstChild.value.indexOf(" ") + 1));
  if (currentMainMagicSkillName == "Magas Mágia") {
    currentSpell.aspects[indexOfCurrentAspect][1] = parseInt(event.target.value);
    calculateSpellCastTimeAndManaCost();
    return;
  }
  if (event.target.parentElement.parentElement.id == "powerAspectPillar") {
    // ez a következő sor azért van itt, hogy beleírja a felhasználó által választott értéket a varázslat értékei közé
    currentSpell.aspects[indexOfCurrentAspect][1] = parseInt(event.target.value);
    if (event.target.value == parseInt(event.target.parentElement.firstChild.value)) {
      powerAspModified = false;
    }
    if (event.target.value != parseInt(event.target.parentElement.firstChild.value)) {
      powerAspModified = true;
    }
  } else {
    for (let i = 5; i < allAspectSelect.length; i++) {
      // 5.indextől kezdjük mert az Erősséghez tartozó select-ek külön kezelendőek
      allAspectSelect[i].disabled = true;
    }
    // ez a következő sor azért van itt, hogy beleírja a felhasználó által választott értéket a varázslat értékei közé
    currentSpell.aspects[indexOfCurrentAspect][1] = parseInt(event.target.value);
    event.target.disabled = false;

    if (event.target.value == parseInt(event.target.parentElement.firstChild.value)) {
      for (let j = 5; j < allAspectSelect.length - 6; j++) {
        // length - 6 azért kell, hogy a Mechanizmus Apektus maradjon letiltva
        allAspectSelect[j].disabled = false;
      }
      anyAspExceptPowerAspModified = false;
    }
    if (event.target.value != parseInt(event.target.parentElement.firstChild.value)) {
      anyAspExceptPowerAspModified = true;
      //modifiedAspectIndex = {"indexOfCurrentAspect":indexOfCurrentAspect}
    }
  }
  calculateSpellCastTimeAndManaCost();
  console.log("volt erő mod?", powerAspModified, "volt más asp mod?", anyAspExceptPowerAspModified);
}

function spellAspModifier(event) {
  if (event.target.id == "veiledAspModifierCheckBox") {
    if (event.target.checked) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        currentSpell.aspects[i][2]++;
      }
    }
    if (!event.target.checked) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        currentSpell.aspects[i][2]--;
      }
    }
  }
  if (event.target.id == "maintainedAspModifierCheckBox") {
    if (event.target.checked) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == "Időtartam") {
          // a min. asp érték 1. Ilyenkor a fenntartott ne vonjon le.
          currentSpell.aspects[i][3]--;
        }
      }
    }
    if (!event.target.checked) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == "Időtartam") {
          currentSpell.aspects[i][3]++;
        }
      }
    }
  }
  if (event.target.id == "controlledAspModifierCheckBox") {
    if (event.target.checked) {
      guidedAspModifierCheckBox.disabled = true;
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == "Mechanizmus") {
          // a min. asp érték 1. Ilyenkor a fenntartott ne vonjon le.
          currentSpell.aspects[i][3]++;
        }
      }
    }
    if (!event.target.checked) {
      guidedAspModifierCheckBox.disabled = false;
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == "Mechanizmus") {
          currentSpell.aspects[i][3]--;
        }
      }
    }
  }
  if (event.target.id == "guidedAspModifierCheckBox") {
    if (event.target.checked) {
      controlledAspModifierCheckBox.disabled = true;
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == "Mechanizmus") {
          // a min. asp érték 1. Ilyenkor a fenntartott ne vonjon le.
          currentSpell.aspects[i][3] -= 2;
        }
      }
    }
    if (!event.target.checked) {
      controlledAspModifierCheckBox.disabled = false;
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == "Mechanizmus") {
          currentSpell.aspects[i][3] += 2;
        }
      }
    }
  }
  if (event.target.id == "repeatedAspModifierCheckBox") {
    if (event.target.checked) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        currentSpell.aspects[i][2]++;
      }
    }
    if (!event.target.checked) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        currentSpell.aspects[i][2]--;
      }
    }
  }
  calculateSpellCastTimeAndManaCost();
}

function spellAspResetter() {
  let powerAspectPillarIndex = 0;
  let distanceAspectPillarIndex = 0;
  let areaAspectPillarIndex = 0;
  let durationAspectPillarIndex = 0;
  let mechanismAspectPillarIndex = 0;
  // ha megváltoztatja a varázslatot, akkor visszaállítjuk a "li"-ben eltárolt eredeti értékeket
  for (let i = 0; i < currentSpell.aspects.length; i++) {
    if (currentSpell.aspects[i][0] == "Erősség") {
      currentSpell.aspects[i][1] = parseInt(allPowerAspectSelect[powerAspectPillarIndex].parentElement.firstChild.value); // ez egy nem látható text input, ahova adatokat tárolunk
      allPowerAspectSelect[powerAspectPillarIndex].parentElement.firstChild.value = "";
      powerAspectPillarIndex++;
    }
    if (currentSpell.aspects[i][0] == "Távolság") {
      currentSpell.aspects[i][1] = parseInt(allDistanceAspectSelect[distanceAspectPillarIndex].parentElement.firstChild.value);
      allDistanceAspectSelect[distanceAspectPillarIndex].parentElement.firstChild.value = "";
      distanceAspectPillarIndex++;
    }
    if (currentSpell.aspects[i][0] == "Terület") {
      currentSpell.aspects[i][1] = parseInt(allAreaAspectSelect[areaAspectPillarIndex].parentElement.firstChild.value);
      allAreaAspectSelect[areaAspectPillarIndex].parentElement.firstChild.value = "";
      areaAspectPillarIndex++;
    }
    if (currentSpell.aspects[i][0] == "Időtartam") {
      currentSpell.aspects[i][1] = parseInt(allDurationAspectSelect[durationAspectPillarIndex].parentElement.firstChild.value);
      allDurationAspectSelect[durationAspectPillarIndex].parentElement.firstChild.value = "";
      durationAspectPillarIndex++;
    }
    if (currentSpell.aspects[i][0] == "Mechanizmus") {
      currentSpell.aspects[i][1] = parseInt(allMechanismAspectSelect[mechanismAspectPillarIndex].parentElement.firstChild.value);
      allMechanismAspectSelect[mechanismAspectPillarIndex].parentElement.firstChild.value = "";
      mechanismAspectPillarIndex++;
    }
  }
  powerAspModified = false;
  anyAspExceptPowerAspModified = false;
}
let allAspectSelect;
let allPowerAspectSelect;
let allDistanceAspectSelect;
let allAreaAspectSelect;
let allDurationAspectSelect;
let allMechanismAspectSelect;
let currentMainMagicSkillName;
let currentMainMagicSkillLevel;

function Spells() {
  function getMainMagicalSkillLevelBasedOnCurrentMagicSubskill() {
    for (let i = 0; i < filteredArrayIfHasAnyMagicSkill.length; i++) {
      currentMainMagicSkillName = filteredArrayIfHasAnyMagicSkill[i].name;
      currentMainMagicSkillLevel = filteredArrayIfHasAnyMagicSkill[i].level;
      if (spellAttributes[0][currentMainMagicSkillName][magicSubSkillSelect.value.slice(1)]) {
        break;
      }
    }
  }

  let manaNeededForTheSpell = 0;
  //console.log(spellsThatModifyCombatStats)
  //console.log(spellsThatModifyCombatStatsObject)
  // mana tényező táblázatból és varázsidő tényező táblázat alapján írt függvények az egyes aspektusok mana értékének kiszámításához

  function getWizardSpellMechanismAspectNamesAndLoadThemToMechanisms() {
    if (currentMainMagicSkillName != "Magas Mágia" || !magicSubSkillSelect.value.includes("Mágia")) {
      return;
    }
    let currentWizardMagicType = magicSubSkillSelect.value.slice(1);
    for (let i = 0; i < allMechanismAspectSelect.length; i++) {
      let currentMechanismOptions = allMechanismAspectSelect[i].children;
      for (let j = 0; j < currentMechanismOptions.length; j++) {
        currentMechanismOptions[j].innerText = `${j + 1} [${spellsWizard[0][currentWizardMagicType][j]}]`;
      }
    }
  }

  function handleHiddenSpellCast(event) {
    if (aptitudeObject["Rejtett varázs"] == 1) {
      // rejtett varázs 1. fokkal csak az egyik komponens hagyható el, a varázsidő dupla
      if (hiddenSpellCastNoHandMotion.checked && event.target.id == "hiddenSpellCastNoHandMotion") {
        hiddenSpellCastNoVocalComponent.checked = false;
      } else if (hiddenSpellCastNoVocalComponent.checked && event.target.id == "hiddenSpellCastNoVocalComponent") {
        hiddenSpellCastNoHandMotion.checked = false;
      }
      spellCastingTimeMultiplier = 2;
      if (!hiddenSpellCastNoHandMotion.checked && !hiddenSpellCastNoVocalComponent.checked) {
        spellCastingTimeMultiplier = 1;
      }
      calculateSpellCastTimeAndManaCost();
    }
    if (aptitudeObject["Rejtett varázs"] == 2) {
      // rejtett varázs 2. fokkal elhagyható mindkét komponens, a varázsidő ekkor dupla, csak az egyik elhagyásakor nem.
      if (hiddenSpellCastNoHandMotion.checked && hiddenSpellCastNoVocalComponent.checked) {
        spellCastingTimeMultiplier = 2;
        calculateSpellCastTimeAndManaCost();
      } else {
        spellCastingTimeMultiplier = 1;
        calculateSpellCastTimeAndManaCost();
      }
    }
    // if (aptitudeObject["Rejtett varázs"] == 3) {
    //   // rejtett varázs 3. fokkal elhagyható mindkét komponens, a varázsidő soha nem dupla
    //   spellCastingTimeMultiplier = false;
    // }
  }

  function handleClickOnSpellCastButton() {
    powerAspModified = false;
    anyAspExceptPowerAspModified = false;
    // allAspSelect = document.querySelectorAll("[id*='AspSelect']");
    // for (let i = 1; i < allAspSelect.length; i++) {
    //   allAspSelect[i].disabled = false;
    // }
    allAspectSelect = document.querySelectorAll("div#allAspectsWrapper li select");
    allPowerAspectSelect = document.querySelectorAll("div#powerAspectPillar li select");
    allDistanceAspectSelect = document.querySelectorAll("div#distanceAspectPillar li select");
    allAreaAspectSelect = document.querySelectorAll("div#areaAspectPillar li select");
    allDurationAspectSelect = document.querySelectorAll("div#durationAspectPillar li select");
    allMechanismAspectSelect = document.querySelectorAll("div#mechanismAspectPillar li select");

    if (parseInt(numberOfActions.innerText) != 0) {
      warningWindow.innerText = "";

      if (initRolled == true && spellIsBeingCast == true && parseInt(numberOfActions.innerText) > 0) {
        let currentSpellName = "varázslat"; // az ideiglenes változó csak azért, mert a varázslónál nincs neve a varázslatoknak egyenlőre
        if (currentSpell.name) {
          currentSpellName = currentSpell.name;
        }
        numberOfActionsSpentOnCastingCurrentSpell++;
        blinkingText(warningWindow, `${numberOfActionsNeededForTheSpell - numberOfActionsSpentOnCastingCurrentSpell} CS múlva létrejön: "${currentSpellName}"`);
        castBarCurrentWidthStart += (1 / numberOfActionsNeededForTheSpell) * 17.1;
        castBarCurrentWidthEnd = (numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1;
        castBar.animate([{ backgroundSize: `${castBarCurrentWidthStart}vw` }, { backgroundSize: `${castBarCurrentWidthEnd}vw` }], 200);
        castBar.style.backgroundSize = `${(numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1}vw`;
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;

        if (numberOfActionsSpentOnCastingCurrentSpell == numberOfActionsNeededForTheSpell) {
          spellIsBeingCast = false;
          spellCastingSuccessful(currentSpell);
          return;
        }
      }
    }
    if (spellIsBeingCast == false) {
      //***************************************************************************** */
      // itt lesznek betöltve és szűrve a varázslatok
      //******************************************************************************* */
      advancedSpellInputWrapper.style.display = "grid";
      currentManaInAdvancedSpellWrapper.style.display = "grid";
      currentManaInAdvancedSpellWrapper.innerText = `Aktuális Mp: ${currentMp.value}`;
      hiddenSpellCastWrapper.style.display = "grid";
      warningWindow.innerText = "";
      removeAllOptions("magicSubSkillSelect");

      // function OrderFunctionForAllMagicSubskillsObject() {
      //   allMagicSubskillsObject.sort(function (a, b) {
      //   return CharCompare(b[0], a[0], 0);
      //   });
      // }
      // OrderFunctionForAllMagicSubskillsObject()
      let allMagicSubskillsObjectKeys = Object.keys(allMagicSubskillsObject); // itt vannak a mágiaformák nevei pl. "Villámmágia"
      let allMagicSubskillsObjectValues = Object.values(allMagicSubskillsObject); // itt vannak a hozzájuk tartozó fokok

      for (let i = 0; i < allMagicSubskillsObjectKeys.length; i++) {
        if (!allMagicSubskillsObjectKeys[i].includes("mozaik")) {
          let magicSubSkillOption = document.createElement("option");
          magicSubSkillOption.innerText = allMagicSubskillsObjectKeys[i];
          magicSubSkillOption.value = allMagicSubskillsObjectValues[i] + allMagicSubskillsObjectKeys[i];
          magicSubSkillSelect.appendChild(magicSubSkillOption);
        }
      }
      getMainMagicalSkillLevelBasedOnCurrentMagicSubskill();
      if (currentMainMagicSkillName == "Magas Mágia") {
        for (let i = 0; i < allMechanismAspectSelect.length; i++) {
          allMechanismAspectSelect[i].disabled = false;
        }
        currentSpell = {
          aspects: [],
        };
        for (let i = 0; i < currentMainMagicSkillLevel; i++) {
          currentSpell.aspects.push(["Erősség", 1, 0, 0]);
        }
        for (let i = 0; i < currentMainMagicSkillLevel; i++) {
          currentSpell.aspects.push(["Távolság", 1, 0, 0]);
        }
        for (let i = 0; i < currentMainMagicSkillLevel; i++) {
          currentSpell.aspects.push(["Terület", 1, 0, 0]);
        }
        for (let i = 0; i < currentMainMagicSkillLevel; i++) {
          currentSpell.aspects.push(["Időtartam", 1, 0, 0]);
        }
        for (let i = 0; i < currentMainMagicSkillLevel; i++) {
          currentSpell.aspects.push(["Mechanizmus", 1, 0, 0]);
        }
        getWizardSpellMechanismAspectNamesAndLoadThemToMechanisms();
      }
      evaluateMagicSubSkill();
    }
  }
  function changeAdvancedSpellInputWrapperElementsForWizard() {
    if (magicSubSkillSelect.value.includes("Mágia")) {
      spellAspModifiersWrapper.style.display = "grid";
      spellSelectWrapper.style.display = "none";
      spellDescriptionLabel.style.display = "none";
    } else {
      spellAspModifiersWrapper.style.display = "none";
      spellSelectWrapper.style.display = "grid";
      spellDescriptionLabel.style.display = "grid";
    }
  }
  function evaluateMagicSubSkill() {
    removeAllOptions("spellSelect");
    // az adott mágikus képzettség foka a 0. indexen van elrejtve
    // console.log(magicSubSkillSelect.value[0], magicSubSkillSelect.value.slice(1))
    if (magicSubSkillSelect.value.slice(1).includes("fohász")) {
      for (let i = 0; i < allActiveBuffs.length; i++) {
        if (allActiveBuffs[i].innerText.includes("liturgia")) {
          let currentLirurgy = allSpells.find((spell) => allActiveBuffs[i].innerText.includes(spell.name));
          //console.log(currentLirurgy, allActiveBuffs[i].innerText)
          liturgyWrapper.style.display = "grid";
          liturgyPowerInfo.style.display = "grid";
          liturgyPowerInfo.innerText = `Liturgia Erőssége: ${currentLirurgy.aspects[0][1]}`;
          liturgyPowerInfo.value = currentLirurgy.aspects[0][1];
          liturgyCheckBox.style.display = "grid";
          break;
        }
      }
      filteredSpellsBySubSkillAndLevel = allSpells.filter(
        (spell) =>
          spell.magicSubclass.includes(magicSubSkillSelect.value.slice(1)) &&
          spell.fok <= parseInt(magicSubSkillSelect.value[0]) &&
          (spell.god == "Általános" || spell.god == currentGodWorshippedByPlayer)
      );
    } else {
      liturgyWrapper.style.display = "none";
      filteredSpellsBySubSkillAndLevel = allSpells.filter((spell) => magicSubSkillSelect.value.slice(1).includes(spell.magicSubclass) && spell.fok <= parseInt(magicSubSkillSelect.value[0]));
    }
    function OrderFunctionForFilteredSpellsBySubSkillAndLevel() {
      filteredSpellsBySubSkillAndLevel.sort(function (a, b) {
        return CharCompare(a.name, b.name, 0);
      });
    }
    OrderFunctionForFilteredSpellsBySubSkillAndLevel();
    changeAdvancedSpellInputWrapperElementsForWizard();
    getWizardSpellMechanismAspectNamesAndLoadThemToMechanisms();
    for (let i = 0; i < filteredSpellsBySubSkillAndLevel.length; i++) {
      let spellSkillOption = document.createElement("option");
      spellSkillOption.innerText = filteredSpellsBySubSkillAndLevel[i].name;
      //spellSkillOption.value =
      spellSelect.appendChild(spellSkillOption);
    }
    for (let i = 0; i < allPowerAspectSelect.length; i++) {
      allPowerAspectSelect[i].disabled = false;
    }
    for (let i = 0; i < allDistanceAspectSelect.length; i++) {
      allDistanceAspectSelect[i].disabled = false;
    }
    for (let i = 0; i < allAreaAspectSelect.length; i++) {
      allAreaAspectSelect[i].disabled = false;
    }
    for (let i = 0; i < allDurationAspectSelect.length; i++) {
      allDurationAspectSelect[i].disabled = false;
    }
    // ha megváltoztatja a subSkill-t, akkor visszaállítjuk a "li"-ben eltárolt eredeti értékeket
    if (currentSpell && currentMainMagicSkillName != "Magas Mágia") {
      spellAspResetter();
    }
    evaluateSpell();
  }
  function handleSpellChange() {
    for (let i = 0; i < allPowerAspectSelect.length; i++) {
      allPowerAspectSelect[i].disabled = false;
    }
    for (let i = 0; i < allDistanceAspectSelect.length; i++) {
      allDistanceAspectSelect[i].disabled = false;
    }
    for (let i = 0; i < allAreaAspectSelect.length; i++) {
      allAreaAspectSelect[i].disabled = false;
    }
    for (let i = 0; i < allDurationAspectSelect.length; i++) {
      allDurationAspectSelect[i].disabled = false;
    }
    spellAspResetter();
    if (currentMainMagicSkillName != "Magas Mágia") {
      evaluateSpell();
    }
  }

  function evaluateSpell() {
    hiddenSpellCastNoHandMotion.checked = false;
    hiddenSpellCastNoVocalComponent.checked = false;
    if (currentMainMagicSkillName != "Magas Mágia") {
      currentSpell = filteredSpellsBySubSkillAndLevel.find((spell) => spell.name == `${spellSelect.value}`);
    }
    let powerAspectPillarIndex = 0;
    let distanceAspectPillarIndex = 0;
    let areaAspectPillarIndex = 0;
    let durationAspectPillarIndex = 0;
    let mechanismAspectPillarIndex = 0;

    for (let i = 0; i < currentSpell.aspects.length; i++) {
      if (currentSpell.aspects[i][0] == "Erősség") {
        if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
          allPowerAspectSelect[powerAspectPillarIndex].parentElement.firstChild.value = `${currentSpell.aspects[i][1]} ${i}`; // ez a felső "parentElement" az a select-et tartalmazó Li
        }
        allPowerAspectSelect[powerAspectPillarIndex].value = currentSpell.aspects[i][1];
        powerAspectPillarIndex++;
      }
      if (currentSpell.aspects[i][0] == "Távolság") {
        if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
          allDistanceAspectSelect[distanceAspectPillarIndex].parentElement.firstChild.value = `${currentSpell.aspects[i][1]} ${i}`;
        }
        allDistanceAspectSelect[distanceAspectPillarIndex].value = currentSpell.aspects[i][1];
        distanceAspectPillarIndex++;
      }
      if (currentSpell.aspects[i][0] == "Terület") {
        if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
          allAreaAspectSelect[areaAspectPillarIndex].parentElement.firstChild.value = `${currentSpell.aspects[i][1]} ${i}`;
        }
        allAreaAspectSelect[areaAspectPillarIndex].value = currentSpell.aspects[i][1];
        areaAspectPillarIndex++;
      }
      if (currentSpell.aspects[i][0] == "Időtartam") {
        if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
          allDurationAspectSelect[durationAspectPillarIndex].parentElement.firstChild.value = `${currentSpell.aspects[i][1]} ${i}`;
        }
        allDurationAspectSelect[durationAspectPillarIndex].value = currentSpell.aspects[i][1];
        durationAspectPillarIndex++;
      }
      if (currentSpell.aspects[i][0] == "Mechanizmus") {
        if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
          allMechanismAspectSelect[mechanismAspectPillarIndex].parentElement.firstChild.value = `${currentSpell.aspects[i][1]} ${i}`;
        }
        allMechanismAspectSelect[mechanismAspectPillarIndex].value = currentSpell.aspects[i][1];
        mechanismAspectPillarIndex++;
      }
    }
    getMainMagicalSkillLevelBasedOnCurrentMagicSubskill();
    unusedSelectHider();
    spellCastingCheckSetter();
    aspOptionDisabler(currentMainMagicSkillLevel);
    calculateSpellCastTimeAndManaCost();
    emptyAllRollModifiersArray();
    evaluateSkillOrAttributeCheckBase();
  }

  function removeAllOptions(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
  }

  function handleSpellCast() {
    if (parseInt(numberOfActions.innerText) < 1) {
      blinkingText(warningWindow, "1-nél kevesebb CS-d van!");
      return;
    }
    if (actionsNeededToBeAbleToCastAgain > 0) {
      blinkingText(warningWindow, `A lecsengési időszakból még hátravan: ${actionsNeededToBeAbleToCastAgain} CS`);
      return;
    }
    if (defensiveCombatOn) {
      setDefensiveCombatVEObonus(1);
      combatStatRefresher();
    }
    let stressCheck = false;

    if (skillCheckStressCheckbox.checked) {
      stressCheck = true;
    }
    skillOrAttributeCheckRoll(stressCheck);
    let currentDifficultyClass = parseInt(warningWindow.innerText.slice(warningWindow.innerText.search(/[0-9]/))); // az elérendő célszám, ami csak akkor érdekes, ha volt aspektus modifikáció
    let skillCheckResultNumber = parseInt(skillCheckResult.innerText); // próba eredménye
    if (powerAspModified || hiddenSpellCastNoHandMotion.checked || hiddenSpellCastNoVocalComponent.checked) {
      let powerValue = allPowerAspectSelect[0].value;
      if (currentDifficultyClass - skillCheckResultNumber > 0) {
        allPowerAspectSelect[0].value -= currentDifficultyClass - skillCheckResultNumber;
        if (allPowerAspectSelect[0].value <= 0) {
          advancedSpellInputWrapper.style.display = "none";
          currentManaInAdvancedSpellWrapper.style.display = "none";
          hiddenSpellCastWrapper.style.display = "none";
          blinkingText(warningWindow, "A varázslat nem jött létre!");
          return;
        }
      }
    }
    // if (anyAspExceptPowerAspModified) {
    //     console.log(allAspectSelect[modifiedAspectIndex.indexOfCurrentAspect].value)
    //     allAspectSelect[modifiedAspectIndex.indexOfCurrentAspect].value = parseInt(allAspectSelect[modifiedAspectIndex.indexOfCurrentAspect].value) - (currentDifficultyClass - skillCheckResultNumber)
    //     console.log(allAspectSelect[modifiedAspectIndex.indexOfCurrentAspect].value)
    // }
    if (allPowerAspectSelect[0].value == 1 || allPowerAspectSelect[0].value == 2) {
      numberOfDiceInput.value = allPowerAspectSelect[0].value;
    }
    if (allPowerAspectSelect[0].value > 2 && currentSpell.name && !currentSpell.name.includes("liturgia")) {
      numberOfDiceInput.value = (parseInt(allPowerAspectSelect[0].value) - 1) * 2;
    }

    console.log("volt erő mod?", powerAspModified, "volt más asp mod?", anyAspExceptPowerAspModified);
    function findFirstAspectNameValue(aspectName) {
      // erre azért van szükség, mert lehet, hogy egy keresett Aspektus (pl. Időtartam) előtt van két terület, ezért az index elcsúszik
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        if (currentSpell.aspects[i][0] == aspectName) {
          return currentSpell.aspects[i][1];
        }
      }
    }
    currentSpellDuration = findFirstAspectNameValue("Időtartam");

    let spellManaCost = 0;
    castBarCurrentWidthStart = 0;
    castBarCurrentWidthEnd = 0;

    spellManaCost = parseInt(spellManaCostDiv.innerText);

    allResultsCleaner();
    if (parseInt(currentMp.value) < spellManaCost && magicSubSkillSelect.value.slice(1) != "Wier vérmágia") {
      blinkingText(warningWindow, "Nincs elég manád!");
      return;
    }
    if (magicSubSkillSelect.value.slice(1) == "Wier vérmágia" && parseInt(currentBloodPoints.value) < spellManaCost) {
      blinkingText(warningWindow, "Nincs elég vérpontod!");
      return;
    }
    if (magicSubSkillSelect.value.slice(1) != "Wier vérmágia") {
      currentMp.value = parseInt(currentMp.value) - spellManaCost;
    }
    spellIsBeingCast = true;

    if (initRolled == false) {
      advancedSpellInputWrapper.style.display = "none";
      currentManaInAdvancedSpellWrapper.style.display = "none";
      hiddenSpellCastWrapper.style.display = "none";
      spellCastingSuccessful(currentSpell);
      return;
    }
    if (spellCastTimeDiv.innerText.includes("CS")) {
      numberOfActionsNeededForTheSpell = parseInt(spellCastTimeDiv.innerText);
    }
    if (spellCastTimeDiv.innerText.includes("Perc")) {
      numberOfActionsNeededForTheSpell = parseInt(spellCastTimeDiv.innerText) * 24;
    }

    manaNeededForTheSpell = spellManaCost;
    warningWindow.innerText = "";

    if (aptitudeObject["Mana uraló"]) {
      actionsNeededToBeAbleToCastAgain = 1 + Math.floor(spellManaCost / 10) - aptitudeObject["Mana uraló"];
    } else {
      actionsNeededToBeAbleToCastAgain = 1 + Math.floor(spellManaCost / 10);
    }
    if (magicSubSkillSelect.value.slice(1) == "Wier vérmágia") {
      actionsNeededToBeAbleToCastAgain = 0; // felülirjuk, mert a wier vérmágia különleges varázslat kategória
    }

    advancedSpellInputWrapper.style.display = "none";
    currentManaInAdvancedSpellWrapper.style.display = "none";
    hiddenSpellCastWrapper.style.display = "none";
    if (initRolled == true && numberOfActionsNeededForTheSpell > 1) {
      spellIsBeingCast = true;
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      numberOfActionsSpentOnCastingCurrentSpell++;
      let currentSpellName = "varázslat"; // az ideiglenes változó csak azért, mert a varázslónál nincs neve a varázslatoknak egyenlőre
      if (currentSpell.name) {
        currentSpellName = currentSpell.name;
      }

      blinkingText(warningWindow, `${numberOfActionsNeededForTheSpell - numberOfActionsSpentOnCastingCurrentSpell} CS múlva létrejön: "${currentSpellName}"`);
      castBar.style.display = "grid";
      castBarCurrentWidthEnd = (numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1;
      castBar.animate([{ backgroundSize: `${castBarCurrentWidthStart}vw` }, { backgroundSize: `${castBarCurrentWidthEnd}vw` }], 200);
      castBar.style.backgroundSize = `${(numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1}vw`;
    }
    if (initRolled == true && numberOfActionsNeededForTheSpell == 1) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      spellCastingSuccessful(currentSpell);
    }
  }
  function handleCancelSpellCast() {
    advancedSpellInputWrapper.style.display = "none";
    currentManaInAdvancedSpellWrapper.style.display = "none";
    hiddenSpellCastWrapper.style.display = "none";
    if (liturgyCheckBox.checked) {
      liturgyCheckBox.checked = false;
    }
    warningWindow.innerText = "";
    let selectAllAspModifierCheckBoxes = document.querySelectorAll("[id*='ModifierCheckBox']");
    for (let i = 0; i < selectAllAspModifierCheckBoxes.length; i++) {
      selectAllAspModifierCheckBoxes[i].checked = false;
      selectAllAspModifierCheckBoxes[i].disabled = false;
    }
  }
  function handleSpellDescriptMouseEnter() {
    if (currentMainMagicSkillName == "Magas Mágia") {
      return;
    }
    spellDescriptionWindow.style.display = "grid";

    if (currentSpell.magicSubclass.includes("fohász") && currentSpell.ritual) {
      spellDescriptionWindow.innerText = `${currentSpell.description} (rituálé)`;
    } else if (currentSpell.magicSubclass.includes("fohász") && !currentSpell.ritual) {
      spellDescriptionWindow.innerText = `${currentSpell.description} (litánia)`;
    } else {
      spellDescriptionWindow.innerText = `${currentSpell.description}`;
    }
  }
  function handleSpellDescriptionMouseLeave() {
    spellDescriptionWindow.animate([{ opacity: 1 }, { opacity: 0 }], 500);
    setTimeout(() => {
      spellDescriptionWindow.style.display = "none";
    }, 490);
  }
  function handleLiturgyCheckBoxChange() {
    if (liturgyCheckBox.checked) {
      allPowerAspectSelect[0].value = parseInt(liturgyPowerInfo.value);
    }
    if (!liturgyCheckBox.checked) {
      allPowerAspectSelect[0].value = parseInt(allPowerAspectSelect[0].parentElement.firstChild.value);
    }
  }

  return (
    <>
      <div id="spellCastButtonWrapper" className={styles.spellCastButtonWrapper}>
        <span>Varázslás - Akció - 1 CS </span>
        <button id="spellCastingActionButton" onClick={handleClickOnSpellCastButton}>
          Végrehajt
        </button>
      </div>
      <div id="advancedSpellInputWrapper" className={styles.advancedSpellInputWrapper}>
        <div className={styles.subSkillSpellAndDescriptWrapper}>
          <li>
            <span>
              Mágiaforma:
              <select id="magicSubSkillSelect" onChange={evaluateMagicSubSkill}></select>
            </span>
            <div className={styles.liturgyWrapper} id="liturgyWrapper">
              <ul className={styles.liturgyPowerInfo} id="liturgyPowerInfo">
                Liturgia
              </ul>
              <input className={styles.liturgyCheckBox} id="liturgyCheckBox" type="checkbox" onChange={handleLiturgyCheckBoxChange} />
            </div>
          </li>
          <li>
            <span id="spellSelectWrapper">
              Varázslat:
              <select id="spellSelect" onChange={handleSpellChange}></select>
            </span>
            <span id="spellDescriptionLabel" className={styles.spellDescriptionSpan} onMouseEnter={handleSpellDescriptMouseEnter}>
              Leírás
            </span>
            <span id="spellAspModifiersWrapper">
              <input id="veiledAspModifierCheckBox" type="checkBox" onChange={spellAspModifier} />
              Leplezett
              <input id="maintainedAspModifierCheckBox" type="checkBox" onChange={spellAspModifier} />
              Fenntartott
              <input id="controlledAspModifierCheckBox" type="checkBox" onChange={spellAspModifier} />
              Kontrollált
              <input id="guidedAspModifierCheckBox" type="checkBox" onChange={spellAspModifier} />
              Irányított
              <input id="repeatedAspModifierCheckBox" type="checkBox" onChange={spellAspModifier} />
              Ismétlődő
            </span>
          </li>
        </div>
        <div className={styles.pillarNamesWrapper}>
          <span>Erősség:</span>
          <span>Távolság:</span>
          <span>Terület:</span>
          <span>Időtartam:</span>
          <span className={styles.mechanismAspLabel}>Mechanizmus:</span>
        </div>
        <div id="allAspectsWrapper" className={styles.allAspectsWrapper}>
          <div id="powerAspectPillar" className={styles.powerAspectPillar}>
            <AspectComponentPower />
            <AspectComponentPower />
            <AspectComponentPower />
            <AspectComponentPower />
            <AspectComponentPower />
          </div>
          <div id="distanceAspectPillar" className={styles.distanceAspectPillar}>
            <AspectComponentDistance />
            <AspectComponentDistance />
            <AspectComponentDistance />
            <AspectComponentDistance />
            <AspectComponentDistance />
          </div>
          <div id="areaAspectPillar" className={styles.areaAspectPillar}>
            <AspectComponentArea />
            <AspectComponentArea />
            <AspectComponentArea />
            <AspectComponentArea />
            <AspectComponentArea />
          </div>
          <div id="durationAspectPillar" className={styles.durationAspectPillar}>
            <AspectComponentDuration />
            <AspectComponentDuration />
            <AspectComponentDuration />
            <AspectComponentDuration />
            <AspectComponentDuration />
          </div>
          <div id="mechanismAspectPillar" className={styles.mechanismAspectPillar}>
            <AspectComponentMechanism />
            <AspectComponentMechanism />
            <AspectComponentMechanism />
            <AspectComponentMechanism />
            <AspectComponentMechanism />
            <AspectComponentMechanism />
          </div>
        </div>
        <span className={styles.calculatedSpellStatsSpan}>
          <div>Varázslási idő:</div>
          <div id="spellCastTimeDiv"></div>
          <div id="spellManaCostDivText">Mana költség:</div>
          <div id="spellManaCostDiv"></div>
        </span>
        <button id="advancedSpellInputWrapperCancelCastButton" onClick={handleCancelSpellCast}>
          Mégse
        </button>
        <button id="advancedStartCastButton" onClick={handleSpellCast}>
          Elkezdek varázsolni
        </button>
      </div>
      <div id="spellDescriptionWindow" className={styles.spellDescriptionWindow} onMouseLeave={handleSpellDescriptionMouseLeave}></div>
      <div id="currentManaInAdvancedSpellWrapper" className={styles.currentManaInAdvancedSpellWrapper}></div>
      <div id="hiddenSpellCastWrapper" className={styles.hiddenSpellCastWrapper}>
        <span>
          Mozdulat elhagyása
          <input id="hiddenSpellCastNoHandMotion" name="hiddenSpellCast" onChange={handleHiddenSpellCast} type="checkBox" />
        </span>
        <span>
          Hang elhagyása
          <input id="hiddenSpellCastNoVocalComponent" name="hiddenSpellCast" onChange={handleHiddenSpellCast} type="checkBox" />
        </span>
      </div>
    </>
  );
}

export default Spells;
