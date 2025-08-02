"use client";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import allWeapons from "../json/allWeapons.json";
import aptitudesDescript from "../json/aptitudesDescript.json";
import CharacterDetails, { defensiveCombatContinueSelectedSetToFalse, initRolled, setInitRolled, updateCharacterData } from "../Components/CharacterDetails";
import ActionList, {
  assassinationToFalse,
  attackOfOpportunityOn,
  attackOfOpportunityOnSetToFalse,
  findWeakSpotOn,
  findWeakSpotOnToFalse,
  hmoModifier,
  spellNeedsAimRoll,
  spellNeedsAimRollSetToFalse,
  totalActionCostOfAttack,
  totalActionCostOfAttackSetter,
  weaponBeforeCasting,
  blinkingText,
  findWeakSpotModifier,
  findWeakSpotModifierNullifier,
  toggleTwoHandedWeaponsDisplay,
  firstAttackIsAttackOfOpportunity,
  firstAttackIsAttackOfOpportunitySetToFalse,
  firstAttackIsSpellThatNeedsAimRoll,
  firstAttackIsSpellThatNeedsAimRollSetToFalse,
  attackRollButtonWasDisabledBeforeSpellCast,
  guidedSpellActiveFormLoader,
  defensiveCombatVEObonus,
  setDefensiveCombatVEObonus,
  defensiveCombatOn,
  defensiveCombatOnSetToFalse,
} from "../Components/ActionsList";
import {
  actionsSpentSinceLastCastAdderCheckerAndNullifier,
  spellCastingFailure,
  numberOfActionsSpentOnCastingCurrentSpellNullifier,
  spellIsBeingCast,
  currentCombatSpell,
  currentCombatSpellChanger,
  actionsNeededToBeAbleToCastAgain,
  currentSpell,
} from "../Components/Spells";
import ArmorDetails from "../Components/ArmorDetails";
import K10RollAndSpellDamageRoll, { multipleDiceRoll } from "../Components/K10RollAndSpellDamageRoll";
import { checkWhereItIsWorn } from "../Components/ArmorDetails";
import SkillCheck, { handleSkillCheck, evaluateSkillOrAttributeCheckBase, skillCheckCalculatedResultFromRoll, manuallySetRollModifier, setManuallySetRollModifier } from "../Components/SkillCheck";
import PsiDisciplines, {
  specialAtkModifierFromPsiAssault,
  availableNumberOfAttacksFromPsiAssault,
  bonusDamageFromChiCombat,
  buffRemoverFromActiveBuffArrayAndTextList,
  chiCombatAtkDefModifier,
  bonusDamageFromChiCombatNullifier,
  chiCombatAtkDefModifierNullifier,
  fpShieldSetter,
  innerTimeNegativeModifier,
  buffTextChecker,
  theRoundInnerTimeWasUsedIn,
} from "../Components/PsiDisciplines";
import AimedAttack from "../Components/AimedAttack";
import { bodyParts } from "../Components/AimedAttack";
import ResistancesAptitudesRaceMofifiers from "../Components/ResistancesAptitudesRaceMofifiers";
import updateCharStats from "./api/updateCharacter";
var MersenneTwister = require("mersenne-twister");
export var generator = new MersenneTwister();

export let returnedData;

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
let entryUpdateTimeAtRequestTime = [];
let HighestTimeStampOfWhenCharWasUpdated;

export async function fetchCharacterDataForAdventureMasterFirstIteration(gameId) {
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
  const params = new URLSearchParams({
    gameId: gameId,
    entryUpdateTimeAtRequestTime: 0,
  });

  await fetch(`../api/getCharsByGameId?${params.toString()}`)
    .then((response) => {
      return response.json();
    })
    .then((parsedData) => {
      if (!parsedData) {
        return;
      }

      for (let i = 0; i < parsedData.length; i++) {
        //először karakter Id szerint sorba rendezzük
        parsedData.sort((a, b) => a.charId - b.charId);
        currentCharNameNodes[i].innerText = parsedData[i].charName;
        currentFpNodes[i].value = parsedData[i].currentFp;
        currentEpNodes[i].value = parsedData[i].currentEp;
        currentPpNodes[i].value = parsedData[i].currentPp;
        currentMpNodes[i].value = parsedData[i].currentMp;
        currentLpNodes[i].value = parsedData[i].currentLp;
        atkRollResultNodes[i].value = parsedData[i].atkRollResult;
        atkRollDiceNodes[i].value = parsedData[i].atkRollDice;
        skillCheckResultDmNodes[i].value = parsedData[i].skillCheckResult;
        skillCheckDiceNodes[i].value = parsedData[i].skillCheckDice;
        // utána sorba rendezem kezdeményező és cselekedet szám szerint is
        parsedData.sort((a, b) => b.initiativeWithRoll - a.initiativeWithRoll);
        parsedData.sort((a, b) => b.numberOfActions - a.numberOfActions);
        characterNameForInitNodes[i].innerText = parsedData[i].charName;
        numberOfActionsAllPlayers[i].innerText = `CS: ${parsedData[i].numberOfActions}`;
        initiativeWithRollNodes[i].innerText = `CSA: ${parsedData[i].initiativeWithRoll}`;
        entryUpdateTimeAtRequestTime.push(Date.parse(parsedData[i].updatedAt));
      }
      HighestTimeStampOfWhenCharWasUpdated = parseInt(Math.max(...entryUpdateTimeAtRequestTime));
      //localStorage.setItem("entryUpdateTimeAtRequestTimeMinimum", minimum)
      console.log("Összes és maximum:", entryUpdateTimeAtRequestTime, HighestTimeStampOfWhenCharWasUpdated);
    });
}

export async function fetchCharacterDataForAdventureMaster(gameId) {
  const params = new URLSearchParams({
    gameId: gameId,
    entryUpdateTimeAtRequestTime: parseInt(HighestTimeStampOfWhenCharWasUpdated),
  });

  await fetch(`../api/getCharsByGameId?${params.toString()}`)
    .then((response) => {
      return response.json();
    })
    .then((parsedData) => {
      if (!parsedData) {
        return;
      }
      entryUpdateTimeAtRequestTime = [];
      entryUpdateTimeAtRequestTime.push(HighestTimeStampOfWhenCharWasUpdated);
      let arrayToSortCharacterSequence = [];
      for (let i = 0; i < parsedData.length; i++) {
        //először karakter Id szerint sorba rendezzük
        for (let j = 0; j < currentCharNameNodes.length; j++) {
          if (parsedData[i].charName == currentCharNameNodes[j].innerText) {
            currentCharNameNodes[j].animate([{ color: "white" }, { color: "black" }], 300);
            currentFpNodes[j].value = parsedData[i].currentFp;
            currentEpNodes[j].value = parsedData[i].currentEp;
            currentPpNodes[j].value = parsedData[i].currentPp;
            currentMpNodes[j].value = parsedData[i].currentMp;
            currentLpNodes[j].value = parsedData[i].currentLp;
            atkRollResultNodes[j].value = parsedData[i].atkRollResult;
            atkRollDiceNodes[j].value = parsedData[i].atkRollDice;
            skillCheckResultDmNodes[j].value = parsedData[i].skillCheckResult;
            skillCheckDiceNodes[j].value = parsedData[i].skillCheckDice;
            entryUpdateTimeAtRequestTime.push(Date.parse(parsedData[i].updatedAt));
            HighestTimeStampOfWhenCharWasUpdated = parseInt(Math.max(...entryUpdateTimeAtRequestTime));
          }
        }
        // utána sorba rendezem kezdeményező és cselekedet szám szerint is
        for (let k = 0; k < characterNameForInitNodes.length; k++) {
          if (parsedData[i].charName == characterNameForInitNodes[k].innerText) {
            characterNameForInitNodes[k].innerText = parsedData[i].charName;
            numberOfActionsAllPlayers[k].innerText = `CS: ${parsedData[i].numberOfActions}`;
            initiativeWithRollNodes[k].innerText = `CSA: ${parsedData[i].initiativeWithRoll}`;
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

      console.log(arrayToSortCharacterSequence);
      //localStorage.setItem("entryUpdateTimeAtRequestTimeMinimum", minimum)
      console.log("Összes és minimum:", entryUpdateTimeAtRequestTime, HighestTimeStampOfWhenCharWasUpdated);
    });
}

// összes json import a getstaticProps helyett

import classes from "../json/classes.json";
import gods from "../json/gods.json";
import races from "../json/races.json";

export async function fetchCharacterData(currentCharName) {
  await fetch(`../api/characterStatsThatChange/${currentCharName}`)
    .then((response) => {
      return response.json();
    })
    .then((parsedData) => {
      if (!parsedData) {
        return;
      }
      if (parsedData.gameId) {
        gameIdLabel.innerText = parsedData.gameId;
      } else {
        gameIdLabel.innerText = "nincs";
      }
      currentFp.value = parsedData.currentFp;
      currentEp.value = parsedData.currentEp;
      currentPp.value = parsedData.currentPp;
      currentMp.value = parsedData.currentMp;
      currentLp.value = parsedData.currentLp;
      if (parsedData.numberOfActions != "") {
        initRollButton.style.display = "none";
        setInitRolled(true);
        toggleAllallActionBarButtonsExceptInitRollDisplay("grid");
        initiativeBonusButton.style.display = "none";
        numberOfActions.innerText = parsedData.numberOfActions;
        adjustActionsPositive.value = parsedData.numberOfActions;
        initiativeWithRoll.innerText = parsedData.initiativeWithRoll;
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
      } else {
        toggleAllallActionBarButtonsExceptInitRollDisplay();
      }
      let activeBuffsCounter = parseInt(parsedData.activeBuffs.charAt(0));
      let activeBuffsStringArray = parsedData.activeBuffs.slice(1).split("|", activeBuffsCounter);
      for (let i = 0; i < activeBuffsStringArray.length; i++) {
        allActiveBuffs[i].innerText = activeBuffsStringArray[i];

        //allActiveBuffs[i].parentElement.lastChild.value = activeBuffsStringArray[i];
        //activeBuffsArray.push(activeBuffsStringArray[i]);

        if (activeBuffsStringArray[i].includes("Fájdalomtűrés")) {
          //**************************************************** */
          //regexp megtalálja az első számot, ahonnan slice + parseInt megadja az fp pajzs mennyiségét
          //azért kell slice, mert így tudja kezelni a 2jegyű számokat is, hiszen az első megtalált számjegy
          //után jön majd közvetlenül az egyes helyiérték, a parseInt pedig mindent ignorál a szám után
          fpShieldSetter(parseInt(activeBuffsStringArray[i].slice(allActiveBuffs[i].innerText.search(/[0-9]/))));
        }
        if (activeBuffsStringArray[i].includes("ismétlődő")) {
          recurringSpellActionButton.style.display = "grid";
        }
        if (activeBuffsStringArray[i].includes("irányított")) {
          guidedSpellWrapper.style.display = "grid";
          spellCastButtonWrapper.style.display = "none";
          guidedSpellActiveFormLoader();
        }
      }
    });
}

let charId;

export function updateCharacterSocketData() {
  let activeBuffsStringToSave = "";
  let activeBuffsCounter = 0;
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

  let dataForSocket = {
    gameId: gameIdLabel.innerText,
    charId: charId,
    charName: charName.innerText,
    currentFp: parseInt(currentFp.value),
    currentEp: parseInt(currentEp.value),
    currentPp: parseInt(currentPp.value),
    currentMp: parseInt(currentMp.value),
    currentLp: parseInt(currentLp.value),
    atkRollResult: parseFloat(charAtkSum.innerText),
    atkRollDice: `${bodyPartName}, Sebzés: ${damageResult.innerText}`,
    activeBuffs: activeBuffsStringToSave,
    skillCheckResult: parseInt(skillCheckResult.innerText),
    skillCheckDice: `Dobás kihatása: ${skillCheckCalculatedResultFromRoll}`,
    numberOfActions: numberOfActions.innerText,
    initiativeWithRoll: parseInt(initiativeWithRoll.innerText),
  };
  socket.emit("character updated", dataForSocket);
}

export async function fetchCharacterDataOnlyGameId(currentCharName) {
  await fetch(`../api/characterStatsThatChange/${currentCharName}`)
    .then((response) => {
      return response.json();
    })
    .then((parsedData) => {
      if (!parsedData) {
        return;
      }
      if (parsedData.gameId) {
        gameIdLabel.innerText = parsedData.gameId;
      } else {
        gameIdLabel.innerText = "nincs";
      }
    });
}
// ki kellett importálni az alap CÉ-t a varázsláshoz
export let baseAimWithTeoCalculator = 0;
export let baseAtkWithTeoCalculator = 0;
export let baseDefWithTeoCalculator = 0;
export let currentAimedSpellModifier = 0;
export function currentAimedSpellModifierSetter(modifier) {
  currentAimedSpellModifier = modifier;
}
let weaponStyles = [
  { Ököl: ["Birkózás", "Belharc"] },
  { RP: ["Belharc", "Birkózás"] },
  { HP: ["Lefegyverzés", "Kínokozás"] },
  { ÓP: ["Fegyvertörés", "Pusztítás"] },
  { ZÚZ: ["Kínokozás", "Taszítás"] },
  { HAS: ["Pusztítás", "Kínokozás"] },
  { SZÁ: ["Távoltartás", "Lefegyverzés"] },
  { LOV: ["Taszítás", "Távoltartás"] },
  { PAJ: ["Taszítás", "Belharc"] },
  { Kardművész: ["Lefegyverzés", "Pusztítás", "Fegyvertörés", "Távoltartás", "Belharc"] },
  { "Fekete láng": ["Távoltartás", "Fegyvertörés", "Taszítás", "Lefegyverzés", "Pusztítás"] },
  { "Ezer víz útja": ["Belharc", "Birkózás", "Lefegyverzés", "Taszítás", "Kínokozás"] },
  { "Sárga kolostor": ["Pusztítás", "Kínokozás", "Birkózás", "Távoltartás", "Belharc"] },
  { "Óvó szél": ["Taszítás", "Lefegyverzés", "Távoltartás", "Kínokozás", "Birkózás"] },
];
let weaponStyleBonusesByLevelOfProficiency = {
  Belharc: ["-0,5 (-1) HMO", "-1 (-2) HMO", "-1,5 (-3) HMO", "-2 (-4) HMO", "-2,5 (-5) HMO", "-3 (-6) HMO"],
  Birkózás: ["0,5 Ép +0,5 VÉO", "1 Ép +1 VÉO", "2 Ép +1,5 VÉO", "3 Ép +2 VÉO", "4 Ép +2,5 VÉO", "5 Ép +3 VÉO"],
  Fegyvertörés: ["képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba"],
  Kínokozás: ["+1Fp/2Ép", "+1Fp/1Ép", "+2Fp/1Ép", "+3Fp/1Ép", "+4Fp/1Ép", "+5Fp/1Ép"],
  Lefegyverzés: ["képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba"],
  Pusztítás: ["+1Ép/5Ép", "+1Ép/4Ép", "+1Ép/3Ép", "+1Ép/2Ép", "+1Ép/1Ép", "+2Ép/1Ép"],
  Taszítás: ["spec.", "spec.", "spec.", "spec.", "spec.", "spec."],
  Távoltartás: ["képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba"],
};
export let allDmgReductionListItems;
export let maneuverAttachedToWeaponType;
let filteredArrayByWeaponSkills;
let filteredArrayByCurrentlySelectedWeaponType;
// erre azon fegyverek miatt van szükség, amik több típusba is beletartoznak
let weaponTypeAndLevelAndStyleArray = [];

function checkAndReturnProficiencyLevelInWeapon(weaponType) {
  for (let i = 0; i < filteredArrayByWeaponSkills.length; i++) {
    if (weaponType == filteredArrayByWeaponSkills[i].subSkill) {
      return filteredArrayByWeaponSkills[i].level;
    }
  }
  return 0;
}

function checkAndModifyCurrentWeaponStyles(weaponType) {
  for (let i = 0; i < weaponStyles.length; i++) {
    let weaponTypeFromWeaponsThatHaveManeuvers = Object.keys(weaponStyles[i]);
    // a fegyvertípus alap manőverei (stílusai)
    maneuverAttachedToWeaponType = Object.values(weaponStyles[i]);

    if (weaponTypeFromWeaponsThatHaveManeuvers == weaponType) {
      for (let k = 0; k < selectedWeaponStyles.length; k++) {
        if (
          selectedWeaponStyles[k][0] == weaponType &&
          !maneuverAttachedToWeaponType[0].includes(...selectedWeaponStyles[k][1]) &&
          checkAndReturnProficiencyLevelInWeapon(weaponType) >= 3 // ez a feltétel azért szükséges, mert lehet, mert ha valaki Kf-ről visszavesz egy fegyvert Af-re, akkor a Kf-en választott extra stílus nem törlődik
        ) {
          maneuverAttachedToWeaponType[0].push(...selectedWeaponStyles[k][1]);
        }
      }
      // speciális eset, amikor csak If-en vagyunk képzettek, ilyenkor csak a fegyver 1.stílusát lehet If-en alkalmazni
      if (checkAndReturnProficiencyLevelInWeapon(weaponType) == 1) {
        maneuverAttachedToWeaponType[0] = [maneuverAttachedToWeaponType[0][0]];
      }
      // védelem, ha valaki nem választott stílus valamelyik fokon
      for (let l = 0; l < maneuverAttachedToWeaponType[0].length; l++) {
        if (maneuverAttachedToWeaponType[0][l] == null) {
          maneuverAttachedToWeaponType[0].splice(l, 1);
        }
      }
      break;
    }
  }
}
// visszaad egy array-t a manőverhez (stílushoz) tartozó fegyvertípussal, amiben képzett a karakter, és a képzettség fokát.
export function handleWhenWeaponHasMultipleTypes(weaponType, usedStyle) {
  let highestProficienyForWeaponStyle = 0;
  let weaponTypeForhighestProficienyForWeaponStyle = "";
  let currentWeaponMultipleTypeArray = weaponType.split("/");
  for (let i = 0; i < weaponTypeAndLevelAndStyleArray.length; i++) {
    for (let j = 0; j < currentWeaponMultipleTypeArray.length; j++) {
      let currentTypeFromWeaponTypeAndLevelAndStyleArray = weaponTypeAndLevelAndStyleArray[i][0];
      if (currentTypeFromWeaponTypeAndLevelAndStyleArray == currentWeaponMultipleTypeArray[j]) {
        for (
          let k = 0;
          k < weaponTypeAndLevelAndStyleArray[i][1];
          k++ // itt a cilkus hossza a képzettség fokától kell függjön, nem a stílus array-től, mert a HM iskolák mind az 5 stílusa előre meghatározott
        ) {
          let usedStyleFromWeaponTypeAndLevelAndStyleArray = weaponTypeAndLevelAndStyleArray[i][2][k];
          if (usedStyleFromWeaponTypeAndLevelAndStyleArray == usedStyle && weaponTypeAndLevelAndStyleArray[i][1] >= highestProficienyForWeaponStyle) {
            // az 1es index a képzettség foka
            highestProficienyForWeaponStyle = weaponTypeAndLevelAndStyleArray[i][1];
            weaponTypeForhighestProficienyForWeaponStyle = weaponTypeAndLevelAndStyleArray[i][0];
          }
        }
      }
    }
  }
  return [weaponTypeForhighestProficienyForWeaponStyle, highestProficienyForWeaponStyle];
}

export function checkWhatBonusYouGetForSelectedManeuver(selectedManeuverValue, professionLevelIndex) {
  let weaponStyleName = Object.keys(weaponStyleBonusesByLevelOfProficiency);
  for (let i = 0; i < weaponStyleName.length; i++) {
    // a fegyvertípus alap manőverei (stílusai)

    if (weaponStyleName[i] == selectedManeuverValue) {
      blinkingText(warningWindow, `"${selectedManeuverValue}" stílusból várható módosítók: \n${weaponStyleBonusesByLevelOfProficiency[selectedManeuverValue][professionLevelIndex]}`);
      break;
    }
  }
}

export function attributeFinder(attribute = "Erő") {
  // alapból erő, mert a legtöbb képzettségpróba ezt használja
  let selectAllAttributeOptions = document.querySelectorAll("select#attributes option");
  for (let i = 0; i < selectAllAttributeOptions.length; i++) {
    if (selectAllAttributeOptions[i].innerText == attribute) {
      attributes.value = selectAllAttributeOptions[i].value;
    }
  }
}

export function setSkillForManeuver() {
  if (initRolled) {
    let selectAllSkillOptions = document.querySelectorAll("select#skills option");
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      if (
        arrayOfAllComplexManeuvers[i].checked &&
        arrayOfAllComplexManeuvers[i].value != "Roham" &&
        arrayOfAllComplexManeuvers[i].value != "Orvtámadás" &&
        arrayOfAllComplexManeuvers[i].value != "Kétkezes harc"
      ) {
        for (let j = 0; j < selectAllSkillOptions.length; j++) {
          let weaponTypeAttachedToCurrentlySelectedManeuver = handleWhenWeaponHasMultipleTypes(currentlySelectedWeapon.w_type, arrayOfAllComplexManeuvers[i].value);
          if (selectAllSkillOptions[j].value.includes(weaponTypeAttachedToCurrentlySelectedManeuver[0]) && weaponTypeAttachedToCurrentlySelectedManeuver[0] != "") {
            skills.value = selectAllSkillOptions[j].value;
            break;
          }
          skills.value = 0;
        }
        attributeFinder();
        // speciális esetek
        if (arrayOfAllComplexManeuvers[i].value == "Lefegyverzés") {
          attributeFinder("Ügy");
        }
        if (arrayOfAllComplexManeuvers[i].value == "Belharc") {
          attributeFinder("Gyo");
        }
        checkTypeIsSkillCheck.checked = true;
        evaluateSkillOrAttributeCheckBase();
        break;
      }
    }
  }
}

let selectedWeaponStyles = [];
export let professionLevel = 0;
export let allActiveBuffs = [];
export let mgtCompensation = 0;
export let rollOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export let filteredArrayIfHasAnyAffinity;
export let filteredArrayForNameOfHighestMagicalSkill;
export let filteredArrayIfHasAnyMagicSkill;
export let filteredArrayIfHasAnyMagicSkillSubSkill;
export let currentGodWorshippedByPlayer;
export let filteredArrayIfHasPsi;
export let filteredArrayIfHasTwoWeaponAttack;
export let filteredArrayIfHasAssassination;
export const specialCases1 = [2, 3, 4];
export const specialCases2 = [5, 6, 7];
export const specialCases3 = [8, 9];
export let specialModifiers = ["Veszítesz 3 cselekedetet", "Aki ellen dobták, veszít 1 cselekedetet", "Kapsz 1 cselekedetet", "Kapsz 2 cselekedetet", "Kapsz 3 cselekedetet"];
export let fileFirstLoaded = true;
export let originalDarkDice = 0;
export let originalLightDice = 0;
export let twoWeaponAttackModifiers = [-3, -2, -1, 0, 1, 2];
export let twoWeaponAttackModifiersIndex = 0;
export let combinationModifiers = [-4, -3, -2, -1, 0, 1];
export let combinationModifiersIndex = 0;
export function combinationModifiersIndexChanger(newCombinationModifiersIndex) {
  combinationModifiersIndex = newCombinationModifiersIndex;
}
let filteredArrayIfHasParry;
let mainHandWeaponWhenTwoWeaponAttackIsUsed;
let bonusDamageFromAssassination = 0;
export let allMagicSubskillsObject = {};
export let arrayOfAllComplexManeuvers;
export let currentlySelectedWeapon;
export function currentlySelectedWeaponChanger(newWeapon) {
  weapons.value = newWeapon;
  currentlySelectedWeapon = allWeapons.find((name) => name.w_name === `${newWeapon}`);
}
export let weaponsOptions;
export function toggleAllallActionBarButtonsExceptInitRollDisplay(display = "none") {
  initiativeBonusButton.style.display = display;
  const allActionBarButtons = document.querySelectorAll("div#actionsWrapper button");
  for (let i = 0; i < allActionBarButtons.length; i++) {
    if (allActionBarButtons[i].id != "initRollButton") {
      allActionBarButtons[i].style.display = display;
    }
  }
}
export function allResultsCleaner() {
  rollResult.innerText = "";
  damageResult.innerText = "";
  bodyPart.innerText = "";
  charAtkSum.innerText = "";
  specialEffect.innerText = "nincs";
  if (tempImg) {
    tempImg.style.opacity = 0;
  }
}

export let combinationWasUsedThisRound = false;
export function combinationWasUsedThisRoundSetToFalse() {
  combinationWasUsedThisRound = false;
}
export let disarmWasUsedThisRound = false;
export let chargeWasUsedThisRound = false;
export function chargeWasUsedThisRoundToFalse() {
  chargeWasUsedThisRound = false;
}
export let twoWeaponAttackWasUsedThisRound = false;
export function twoWeaponAttackWasUsedThisRoundToFalse() {
  twoWeaponAttackWasUsedThisRound = false;
}
export let numberOfClicksAtTwoWeaponAttack = 0;
export let firstAttackInRoundSpent = false;
export function setFirstAttackInRoundSpent(setItTo = false) {
  if (setItTo === false) {
    firstAttackInRoundSpent = false;
  } else if (setItTo === true) {
    firstAttackInRoundSpent = true;
  }
}
export let rangedWeaponsArray = ["ÍJ", "VET", "NYD", "PD", "SZÍ", "Fúvócső", "MÁGIA", "Tűvető"];
export function checkIfWeaponIsRanged(currentlySelectedWeaponType) {
  for (let i = 0; i < rangedWeaponsArray.length; i++) {
    if (currentlySelectedWeaponType.includes(rangedWeaponsArray[i])) {
      return true;
    }
  }
  return false;
}
export let tempImg;
export let numberOfAttacksInTheRound = 0;
export function numberOfAttacksInTheRoundNullifier() {
  numberOfAttacksInTheRound = 0;
}
export let cumulativeCombinationModifier = 0;
export function cumulativeCombinationModifierNullifier() {
  cumulativeCombinationModifier = 0;
}
export let modifierFromNumberOfAttacksInTheRound = 0;
export function modifierFromNumberOfAttacksInTheRoundNullifier() {
  modifierFromNumberOfAttacksInTheRound = 0;
}
export let allResistances = {};
export let currentCharFinalAttributes = {};
export function CharCompare(a, b, index) {
  let alphabets = ["A", "Á", "B", "C", "D", "E", "É", "F", "G", "H", "I", "Í", "J", "K", "L", "M", "N", "O", "Ó", "Ö", "Ő", "P", "Q", "R", "S", "T", "U", "Ú", "Ü", "Ű", "V", "W", "X", "Z"];

  let aChar;
  let bChar;
  aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
  bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
  if (aChar != bChar) return aChar - bChar;
  else return CharCompare(a, b, index + 1);
}
export let skillLevelsMeaning = ["Nf", "If", "Af", "Kf", "Mf", "Lf"];
export let parsedCharacterDataFromJSON;
export let aptitudeObject = {}; // Objektum ahol az Adottságok neve a kulcs, az érték pedig az Adottág szintje

function tvcoCalculator(atkAimDef) {
  let calculatedTVCO = 0;
  if (atkAimDef % 10 == 0) {
    calculatedTVCO = atkAimDef / 10;
  } else if (atkAimDef % 5 == 0) {
    calculatedTVCO = Math.floor(atkAimDef / 10) + 0.5;
  } else if (atkAimDef % 10 > 5) {
    calculatedTVCO = Math.floor(atkAimDef - (atkAimDef % 10)) / 10 + 0.5;
  } else if (atkAimDef % 10 < 5) {
    calculatedTVCO = (atkAimDef - (atkAimDef % 10)) / 10;
  }
  return calculatedTVCO;
}
// -- ide kellett egy másik függvény, mert itt felfelé kerekítünk 0,5 ig a többi TÉ/VÉ/CÉO-val ellentétben, ahol lefelé kerekítünk
function specialTvcoCalculatorForParry(parryWeaponDef) {
  let calculatedParryWeaponDef = 0;
  if (parryWeaponDef % 5 == 0) {
    calculatedParryWeaponDef = parryWeaponDef;
  } else if (parryWeaponDef % 5 != 0 && parryWeaponDef % 10 < 5) {
    calculatedParryWeaponDef = parryWeaponDef - (parryWeaponDef % 10) + 5;
  } else if (parryWeaponDef % 5 != 0 && parryWeaponDef % 10 > 5) {
    calculatedParryWeaponDef = parryWeaponDef - (parryWeaponDef % 5) + 5;
  }
  return parseFloat(calculatedParryWeaponDef / 10);
}
export let commonModifiers = 0;
export let filteredArrayIfHasHeavyArmorSkill;
let currentlySelectedOffHand;
let baseAtk;
let baseAim;
let baseDef;
let sumFpGainedByLevel;
let sumPpGainedByLevel;
let sumMpGainedByLevel;
let sumInitiativeGainedByLevel;
let filteredArrayIfHasRunning;
let schoolsOfMagicNames;
let masterWeaponModifier = 0;
let destroyerLevel;
let damageOfFists = "1k10";
let fistAtk = 0;
let fistDef = 0;
let thisAttackWasWithCharge = false;
//************************************************ A harci statisztikák frissítése, pl. fegyverváltásnál ***********************************//
export function combatStatRefresher() {
  currentlySelectedWeapon = allWeapons.find((name) => name.w_name === `${weapons.value}`);
  currentlySelectedOffHand = allWeapons.find((name) => name.w_name === `${offHand.value}`);

  if (aptitudeObject["Mesterfegyver"] && parsedCharacterDataFromJSON.masterWeapon == currentlySelectedWeapon.w_name && chosenWeapon.innerText != "Kétk.harc másik kéz:") {
    masterWeaponModifier = aptitudeObject["Mesterfegyver"];
  } else {
    masterWeaponModifier = 0;
  }

  if (aptitudeObject["Pusztító"] && !checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
    destroyerLevel = aptitudeObject["Pusztító"];
  } else {
    destroyerLevel = 0;
  }
  //---- szűrés olyan fegyvertípusokra amikre a karakternek van fegyverhasználat képzettsége és hogy a jelenlegi fegyver beletartozik-e?
  filteredArrayByCurrentlySelectedWeaponType = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Fegyverhasználat" && currentlySelectedWeapon.w_type.includes(name.subSkill));
  //----- TÉ/VÉ/CÉ számítás a fegyver értékekkel együtt
  //-------- Ha egy fegyvernek több tipusa is van, kiválasztja a legmagasabb szintűt
  let allLevelsArray = [];

  if (filteredArrayByCurrentlySelectedWeaponType.length != 0) {
    for (let i = 0; i < filteredArrayByCurrentlySelectedWeaponType.length; i++) {
      allLevelsArray.push(filteredArrayByCurrentlySelectedWeaponType[i].level);
    }
    professionLevel = parseInt(Math.max(...allLevelsArray));
  } else {
    professionLevel = 0;
  }
  let atkWithProfession = 0;
  let aimWithProfession = 0;
  let defWithProfession = 0;
  if (!guidedSpellCombatStatChangerCheckbox.checked) {
    // fontos az irányított spelleknél
    combinationModifiersIndex = professionLevel;
    atkWithProfession = baseAtk + parseInt(professionLevel) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier);
    aimWithProfession = baseAim + parseInt(professionLevel) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier);
    defWithProfession = baseDef + parseInt(professionLevel) * (currentlySelectedWeapon.weaponDef + masterWeaponModifier);
  }

  if (currentlySelectedWeapon.w_type == "Ököl") {
    //megnézi a legmagasabb tul-t és elosztja az ököl osztóval, ami a harcművész adottsággal változhat
    atkWithProfession = baseAtk + parseInt(professionLevel) * fistAtk;
    defWithProfession = baseDef + parseInt(professionLevel) * fistDef;
  }

  let reducedMgtByParrySkill = currentlySelectedOffHand.mgt;
  let anyOtherHmoModifierValue = anyOtherHmoModifier.value;
  let assassinationAttackModifier = 0;
  if (assassinationRadioButton.checked == true) {
    assassinationAttackModifier = 3 + filteredArrayIfHasAssassination[0].level;
    assassinationToFalse();
  }

  if (anyOtherHmoModifier.value == "") {
    anyOtherHmoModifierValue = 0;
  }
  if (filteredArrayIfHasParry.length != 0) {
    // ha van hárítás képzettsége
    reducedMgtByParrySkill = currentlySelectedOffHand.mgt - filteredArrayIfHasParry[0].level;
    if (reducedMgtByParrySkill < 0) {
      reducedMgtByParrySkill = 0;
    }
  }
  if (theRoundInnerTimeWasUsedIn == parseInt(numberOfCurrentRound.innerText)) {
    // ha ez az a kör, amikor a Belső időt használta valaki, akkor a módosító még ne érvényesüljön
    commonModifiers =
      -reducedMgtByParrySkill / 2 -
      currentlySelectedWeapon.mgt / 2 +
      parseFloat(anyOtherHmoModifierValue) -
      parseFloat(totalMgtOfArmorSet.innerText / 2) -
      modifierFromNumberOfAttacksInTheRound -
      cumulativeCombinationModifier; // itt még nem vonjuk le a Belső idő negatív módosítót
  } else {
    commonModifiers =
      -reducedMgtByParrySkill / 2 -
      currentlySelectedWeapon.mgt / 2 +
      parseFloat(anyOtherHmoModifierValue) -
      parseFloat(totalMgtOfArmorSet.innerText / 2) -
      innerTimeNegativeModifier -
      modifierFromNumberOfAttacksInTheRound -
      cumulativeCombinationModifier; // itt már igen
  }
  // TÉ VÉ CE értékek számítása ******************************
  //*********************************************************** */
  if (!guidedSpellCombatStatChangerCheckbox.checked) {
    // csak akkor jön be ide, ha nem irányított spell forma lénye van kiválasztva
    /**************** 3 féle VÉO kiszámítása: (hárítással, kitéréssel, alap VÉO fegyverrel) ***************************************************** */
    if (filteredArrayIfHasParry.length != 0) {
      // ha van hárítás képzettsége
      charDefWithParry.value =
        tvcoCalculator(defWithProfession) +
        commonModifiers +
        specialTvcoCalculatorForParry(parseFloat((currentlySelectedOffHand.weaponDef / 2) * filteredArrayIfHasParry[0].level)) +
        chiCombatAtkDefModifier +
        defensiveCombatVEObonus;
    } else {
      charDefWithParry.value = tvcoCalculator(defWithProfession) + commonModifiers + chiCombatAtkDefModifier + defensiveCombatVEObonus;
    }
    if (aptitudeObject["Fürge"]) {
      // ha van Fürge adottsága
      charDefWithEvasion.value =
        tvcoCalculator(defWithProfession) +
        commonModifiers +
        0.5 +
        0.5 * aptitudeObject["Fürge"] + // itt az első 0,5 alapból jön, ha kitérés manővert vet be valaki
        chiCombatAtkDefModifier +
        defensiveCombatVEObonus;
    } else if (!aptitudeObject["Fürge"]) {
      charDefWithEvasion.value =
        tvcoCalculator(defWithProfession) +
        commonModifiers +
        0.5 + // ez az érték alapból jön, ha kitérés manővert vet be valaki
        chiCombatAtkDefModifier +
        defensiveCombatVEObonus;
    }
    charDef.value = tvcoCalculator(defWithProfession) + commonModifiers + chiCombatAtkDefModifier + defensiveCombatVEObonus;
    /********************************* TÉO és CÉO számítás ************************************************************************************ */
    if (!checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
      // ha az éppen használt fegyver közelharci (TÉO-t használ)
      charAtk.value = tvcoCalculator(atkWithProfession) + commonModifiers + findWeakSpotModifier + chiCombatAtkDefModifier + assassinationAttackModifier; // gyenge pontok felmérése csak közelharcnál van
    } else {
      // ha a használt fegyver távolsági (CÉO-t használ)
      charAtk.value = tvcoCalculator(aimWithProfession) + commonModifiers + currentAimedSpellModifier;
    }
  }

  if (guidedSpellCombatStatChangerCheckbox.checked) {
    // irányított spell bekapcsolva, formázott lény értékei használva
    charAtk.value = parseFloat(guidedSpellAttack.innerText) - modifierFromNumberOfAttacksInTheRound - cumulativeCombinationModifier;
    charDef.value = parseFloat(guidedSpellDefense.innerText) - modifierFromNumberOfAttacksInTheRound - cumulativeCombinationModifier;
  }

  //*Az összes komplex manőver kiválasztása, és ha a fegyver távolsági, akkor azok letiltása. Ezen felül a kétkezes harc letiltása, ha a fegyvert két kézzel kell forgatni
  arrayOfAllComplexManeuvers = document.querySelectorAll("ul#selectableComplexManeuversList li input");
  weaponsOptions = document.querySelectorAll("select#weapons option");

  if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true) {
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      arrayOfAllComplexManeuvers[i].disabled = true;
    }
    findWeakSpotButton.disabled = true;
    attackOfOpportunityButton.disabled = true;
  }
  if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      arrayOfAllComplexManeuvers[i].disabled = false;
      twoWeaponAttackRadioButton.disabled = false;
    }
    findWeakSpotButton.disabled = false;
    attackOfOpportunityButton.disabled = false;
    if (weapons.value.includes("kétkézzel") || weapons.value.includes("Kétkezes") || weapons.value.includes("Pallos") || weapons.value.includes("Alabárd")) {
      twoWeaponAttackRadioButton.disabled = true;
    } else {
      twoWeaponAttackRadioButton.disabled = false;
      toggleTwoHandedWeaponsDisplay("grid");
    }
    // if (combinationWasUsedThisRound == true) {
    //   combinationCheckBox.disabled = true;
    // }
  }
  if (chargeRadioButton.checked == true) {
    chargeWasUsedThisRound = true;
    chargeRadioButton.disabled = true;
    thisAttackWasWithCharge = true;
  }
  if (chargeWasUsedThisRound == true) {
    if (thisAttackWasWithCharge) {
      charAtk.value = parseFloat(charAtk.value) + 1;
    }
    charDef.value = parseFloat(charDef.value) - 1;
    charDefWithParry.value = parseFloat(charDefWithParry.value) - 1;
    charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - 1;
  }
  if (twoWeaponAttackWasUsedThisRound == true) {
    hmoModifier(twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
  }
  if (initRolled == false && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
    for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
      arrayOfAllComplexManeuvers[i].disabled = true;
    }
  }
  if (currentlySelectedWeapon.readyToFireOrThrow && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
    reloadButton.disabled = true;
    warningWindow.innerText = "";
  }
  /********* Nullázza a célzódobást igánylő varázslat módosítóját *************************************** */
  //********************************************************************************************** */
  // Kiszámolja a maximális és cselekedetenkénti mozgás távot. Ez függ az MGT-től, ezért van ennyire lent
  // *********************************************************************************************
  let speedBonusFromRunningSkill = 0;
  if (filteredArrayIfHasRunning.length != 0) {
    speedBonusFromRunningSkill = filteredArrayIfHasRunning[0].level * 2;
  }
  let correctedSpeedValueForMovementCalculation =
    10 + Math.floor(currentCharFinalAttributes.Gyo / 2) + speedBonusFromRunningSkill - currentlySelectedWeapon.mgt - reducedMgtByParrySkill - parseInt(totalMgtOfArmorSet.innerText);
  maxMove.innerText = `Max táv: ${correctedSpeedValueForMovementCalculation * 3} láb`;
  movePerAction.innerText = `/akció táv: ${Math.ceil((correctedSpeedValueForMovementCalculation * 3) / (1 + Math.ceil((parseInt(initiative.innerText) + 1) / 10)))} láb`;
}
import io from "socket.io-client";
//********************************************* */
// --- itt kezdődik az oldal maga
//********************************************************* */
export let socket;
export default function Home() {
  function hideOrRevealAdventureMasterComponent() {}
  //egyedi rendező function kellett, mert a sort nem rendezte a fegyverek nevét valamiért. Valószínűleg a karakterkódolással van gondja a fájl beolvasása után
  function OrderFunctionForAllWeapons() {
    allWeapons.sort(function (a, b) {
      return CharCompare(a.w_name, b.w_name, 0);
    });
  }
  //egyedi sorba rendező function hívás *
  OrderFunctionForAllWeapons();
  let schoolsOfMagicNamesAndAttributes = {
    "Magas Mágia": "Int",
    Bárdmágia: "Kar",
    Boszorkánymágia: "Asz",
    "Boszorkánymesteri mágia": "Aka",
    "Tűzvarázslói mágia": "Aka",
    "Szakrális mágia": "Kar",
  };
  let schoolsOfMagicSubClass = ["Magas mágiaforma", "Bárd mágiaforma", "Boszorkány mágiaforma", "Boszorkánymester mágiaforma", "Tűzvarázsló mágiaforma", "Kisebb fohászok", "Nagyobb fohászok"];

  //------------------------------------------------------------------------
  //-------A dobás ------

  let darkDiceWasChangedToHalfOfStr = false;

  function ttkRoll(strBonus, darkDice, lightDice) {
    let result = 0;

    if (darkDice == undefined || lightDice == undefined) {
      for (let i = 0; i < 8; i++) {
        darkDice = Math.floor(generator.random() * 10);
        lightDice = Math.floor(generator.random() * 10);
      }
      /* -- ez a két sor a dobások tesztelésére van  */
      //lightDice = 1;
      //darkDice = 1;
      //******************************************* */
      darkDiceResultSelect.value = darkDice;
      lightDiceResultSelect.value = lightDice;
    }

    if (darkDice > lightDice) {
      result = darkDice;
    } else if (darkDice < lightDice) {
      result = lightDice;
    } else if (darkDice == 0 && lightDice == 0) {
      result = 10;
    } else if (darkDice == 1 && lightDice == 1) {
      result = 0;
    } else if (darkDice == lightDice) {
      result = darkDice;
    }
    if (darkDice == 0) {
      darkDice = 10;
    }
    if (lightDice == 0) {
      lightDice = 10;
    }

    originalDarkDice = darkDice;
    originalLightDice = lightDice;

    // Itt vannak a nevezetes dobások
    // a fegyvertörés és lefegyverzés ki van véve, mert azok nem támadódobások, tehát nem
    // lehet velük cselekedetet veszíteni vagy nyerni

    if (lightDice == darkDice && specialCases1.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[1];
    } else if (lightDice == darkDice && specialCases2.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[2];
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
      }
    } else if (lightDice == darkDice && specialCases3.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[3];
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 2;
      }
    } else if (lightDice == darkDice && darkDice == 1) {
      specialEffect.innerText = specialModifiers[0];
      if (soundToggleCheckbox.checked) {
        doubleOneRoll.play();
      }
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 3;
      }
    } else if (lightDice == darkDice && darkDice == 10) {
      specialEffect.innerText = specialModifiers[4];
      if (soundToggleCheckbox.checked) {
        doubleZeroRoll.play();
      }
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 3;
      }
    }
    console.log("Sötét eredeti:", originalDarkDice, "Világos:", originalLightDice);
    if (strBonus == true) {
      if (Math.floor(parseInt(Erő.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Erő.innerText) / 2);
        darkDiceWasChangedToHalfOfStr = true;
      }
    }
    if (currentlySelectedWeapon.assassinWeapon == true && assassinationRadioButton.checked == true) {
      if (Math.floor(parseInt(Ügy.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Ügy.innerText) / 2);
      }
    }

    if (numberOfClicksForAttacksForPsiAssault <= availableNumberOfAttacksFromPsiAssault) {
      result += specialAtkModifierFromPsiAssault;
      if (result >= 10) {
        result = 10;
      }
    } else if (numberOfClicksForAttacksForPsiAssault > availableNumberOfAttacksFromPsiAssault) {
      buffRemoverFromActiveBuffArrayAndTextList("Pszi roham");
      numberOfClicksForAttacksForPsiAssault = 0;
    }
    return result;
  }

  //-------------- Megnézi a sebzéskódot, és számol sebzést ------------

  async function damageEvaluator() {
    console.log("Fegyver típus:", currentlySelectedWeapon.w_type);
    console.log("Fegyver sebzéskód:", currentlySelectedWeapon.w_damage);
    console.log("Erősebzés?:", currentlySelectedWeapon.strBonusDmg);
    // if (firstAttackInRoundSpent == false) {
    //   return;
    // }
    if (buffTextChecker("Chi-harc")) {
      bonusDamageFromChiCombatNullifier();
    }
    if (assassinationRadioButton.checked == true && filteredArrayIfHasAssassination.length != 0) {
      bonusDamageFromAssassination = filteredArrayIfHasAssassination[0].level;
    }
    if (assassinationRadioButton.checked == false) {
      bonusDamageFromAssassination = 0;
    }

    // ha nem történt kezdeményező dobás, akkor csak 1 támadásig érvényes a chi harc
    if (initRolled == false && buffTextChecker("Chi-harc")) {
      buffRemoverFromActiveBuffArrayAndTextList("Chi-harc");
      hmoModifier(-chiCombatAtkDefModifier);
      chiCombatAtkDefModifierNullifier();
    }
    //ez a két változó csak az ökölharc miatt kell:
    //professionLevel és currentWeaponDamage
    combatStatRefresher();
    let currentWeaponDamage = currentlySelectedWeapon.w_damage;
    if (currentlySelectedWeapon.w_type == "Ököl") {
      currentWeaponDamage = damageOfFists;
      professionLevel = Math.ceil(professionLevel / 2);
      if (currentlySelectedWeapon.w_name == "Vasököl") {
        professionLevel += 1;
      }
      console.log("ököl seb:", currentWeaponDamage, "+", professionLevel, "ököl atk, def:", fistAtk, fistDef);
    }
    if (currentWeaponDamage === "2k10") {
      damageResult.innerText = originalDarkDice + originalLightDice + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "2k5") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) + Math.ceil(originalLightDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "2k5+1") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) + Math.ceil(originalLightDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination + 1;
    } else if (currentWeaponDamage === "2k5+2") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) + Math.ceil(originalLightDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination + 2;
    } else if (currentWeaponDamage === "1k5") {
      damageResult.innerText = Math.ceil(originalDarkDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "1k5+1") {
      damageResult.innerText = Math.ceil(originalDarkDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination + 1;
    } else if (currentWeaponDamage === "1k5+2") {
      damageResult.innerText = Math.ceil(originalDarkDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination + 2;
    } else if (currentWeaponDamage === "3k5") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) * 2 + Math.ceil(originalLightDice / 2) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "1k10") {
      damageResult.innerText = originalDarkDice + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "1k10+1") {
      damageResult.innerText = originalDarkDice + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination + 1;
    } else if (currentWeaponDamage === "1k2") {
      damageResult.innerText = Math.ceil(originalDarkDice / 5) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "2k2") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 5) + Math.ceil(originalLightDice / 5) + parseInt(destroyerLevel) + parseInt(professionLevel) + bonusDamageFromChiCombat + bonusDamageFromAssassination;
    }
    if (currentlySelectedWeapon.w_name == "Fúvócső" || currentlySelectedWeapon.w_name == "Tűvető") {
      damageResult.innerText = 1;
    }
    let spellDamage = 0;
    if (weapons.value == "Célzott mágia" || weapons.value == "Irányított mágia") {
      spellDamage = multipleDiceRoll(originalDarkDice, originalLightDice, 0, parseInt(numberOfDiceInput.value));

      damageResult.innerText = spellDamage[3];
      firstAccumulatedDiceResultSelect.value = spellDamage[0];
      secondAccumulatedDiceResultSelect.value = spellDamage[1];
      thirdAccumulatedDiceResultSelect.value = spellDamage[2];
    }

    for (let i = 0; i < allActiveBuffs.length; i++) {
      if ((allActiveBuffs[i].innerText.includes("Villámpenge") || allActiveBuffs[i].innerText.includes("Tűzkard")) && currentlySelectedWeapon.w_type != "MÁGIA") {
        numberOfDiceInput.value = parseInt(parseInt(allActiveBuffs[i].innerText.slice(allActiveBuffs[i].innerText.lastIndexOf("E") - 2)) - 1) * 2;
        spellDamage = multipleDiceRoll(originalDarkDice, originalLightDice, 0, parseInt(numberOfDiceInput.value));
        damageResult.innerText = `${damageResult.innerText} + ${spellDamage[3]}`;
        firstAccumulatedDiceResultSelect.value = spellDamage[0];
        secondAccumulatedDiceResultSelect.value = spellDamage[1];
        thirdAccumulatedDiceResultSelect.value = spellDamage[2];
        break;
      }
    }

    // Ezekben a zárójelen belüli esetekben nincs ijász szabály
    if (
      originalDarkDice == 10 &&
      checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) &&
      currentlySelectedWeapon.w_name != "Fúvócső" &&
      currentlySelectedWeapon.w_name != "Célzott mágia" &&
      currentlySelectedWeapon.w_name != "Irányított mágia" &&
      currentlySelectedWeapon.w_name != "Tűvető" &&
      darkDiceWasChangedToHalfOfStr == false
    ) {
      let archeryBonusDmg = 0;

      for (let i = 0; i < 3; i++) {
        let currentRandomArcheryBonusRoll = Math.floor(generator.random() * 10);
        if (currentRandomArcheryBonusRoll == 0) {
          currentRandomArcheryBonusRoll = 10;
          if (currentlySelectedWeapon.w_damage.includes("k5")) {
            currentRandomArcheryBonusRoll = 5;
          } else if (currentlySelectedWeapon.w_damage.includes("k2")) {
            currentRandomArcheryBonusRoll = 2;
          }
          archeryBonusDmg += currentRandomArcheryBonusRoll;
        } else if (currentRandomArcheryBonusRoll != 0) {
          if (currentlySelectedWeapon.w_damage.includes("k5")) {
            currentRandomArcheryBonusRoll = Math.ceil(currentRandomArcheryBonusRoll / 2);
          } else if (currentlySelectedWeapon.w_damage.includes("k2")) {
            currentRandomArcheryBonusRoll = Math.ceil(currentRandomArcheryBonusRoll / 5);
          }
          archeryBonusDmg += currentRandomArcheryBonusRoll;
          break;
        }
      }
      damageResult.innerText = parseInt(damageResult.innerText) + archeryBonusDmg;
      damageResult.animate([{ color: "white" }, { color: "black" }], 200);

      console.log("íjász szabály:", archeryBonusDmg);
    }

    console.log("Sötét erősebzés:", originalDarkDice, "Világos:", originalLightDice);
    darkDiceWasChangedToHalfOfStr = false;
    damageResult.animate([{ color: "white" }, { color: "black" }], 200);
  }

  function handleWeaponOrShieldChange() {
    combatStatRefresher();

    let allAimedBodyParts = document.querySelectorAll("ul#aimedAttackList li input");
    for (let i = 0; i < allAimedBodyParts.length; i++) {
      allAimedBodyParts[i].checked = false;
    }
    allResultsCleaner();
    skills.value = 0;
    skillCheckBase.innerText = "";

    if (initRolled == true) {
      weapons.disabled = true;
      offHand.disabled = true;
      weaponChangeButton.disabled = false;
      warningWindow.innerText = "";
      if (
        checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true && // ha az a fegyver, amire épp váltok nincs lőkész állapotban
        currentlySelectedWeapon.w_type != "MÁGIA" &&
        !currentlySelectedWeapon.readyToFireOrThrow
      ) {
        attackRollButton.disabled = true;
        reloadButton.disabled = false;
        if (currentlySelectedWeapon.w_type == "VET" || currentlySelectedWeapon.w_type == "NYD" || currentlySelectedWeapon.w_type == "PD") {
          blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime} CS`);
        } else {
          blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime} CS`);
        }
        // ammoAmountInput.value--
      } else if (!firstAttackInRoundSpent) {
        attackRollButton.disabled = false;
      }
    }
  }

  let charAttributes = ["Erő", "Gyo", "Ügy", "Áll", "Egé", "Kar", "Int", "Aka", "Asz", "Érz"];
  //   function handleFileImportClick() {
  //     window.location.reload();
  // }
  //****************************************************************************** */
  // ********************************** Fájlbeolvasó függvény *************************
  //********************************************************************************* */
  async function handleFileRead() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      if (fileFirstLoaded) {
        allActiveBuffs = document.querySelectorAll("ul#listOfCurrentlyActiveBuffs li");
        anyOtherHmoModifier.disabled = false;
        skillCheckRollButton.style.display = "grid";
        actionsWrapper.style.display = "grid";

        // ***** berakunk egy observert, hogy figyelje az első buff helyét, és ha üres, akkor töltse oda az alatta lévőt
        let observer = new MutationObserver(async (event) => {
          if (event[0].target.innerText == "") {
            for (let i = 0; i < allActiveBuffs.length; i++) {
              if (allActiveBuffs[i].innerText == "") {
                let nodeToRemoveThenAppend = allActiveBuffs[i].parentElement;
                listOfCurrentlyActiveBuffs.removeChild(nodeToRemoveThenAppend);
                listOfCurrentlyActiveBuffs.appendChild(nodeToRemoveThenAppend);
              }
            }
            allActiveBuffs = document.querySelectorAll("ul#listOfCurrentlyActiveBuffs li");
          }
        });
        observer.observe(listOfCurrentlyActiveBuffs, { childList: true, subtree: true });

        // megfigyeli az akciók változását
        //*********************************** */
        let observerForActions = new MutationObserver(async () => {
          updateCharacterSocketData();
          if (initRolled && parseInt(numberOfActions.innerText) <= 0) {
            recurringSpellActionButton.disabled = true;
          }
          if (parseInt(numberOfActions.innerText) < 2) {
            tacticsButton.disabled = true;
          }
          if (
            ((initRolled && !spellNeedsAimRoll && parseInt(numberOfActions.innerText) < 2) ||
              (initRolled && firstAttackInRoundSpent && !spellNeedsAimRoll && parseInt(numberOfActions.innerText) < 3)) &&
            !attackOfOpportunityOn
          ) {
            attackRollButton.disabled = true;
          }
          if (numberOfClicksAtTwoWeaponAttack == 1) {
            attackRollButton.disabled = false;
          }
          // if (initRolled && parseInt(numberOfActions.innerText) < 1 && !spellIsBeingCast && actionsNeededToBeAbleToCastAgain != 0) {
          //   spellCastingActionButton.disabled = true;
          // }
          if (initRolled && !firstAttackInRoundSpent && parseInt(numberOfActions.innerText) >= 2 && currentlySelectedWeapon.readyToFireOrThrow) {
            // új feltétel arra, ha az akciók száma nagyobb lesz mint 2. Ez akkorra kellett, ha ez 1-re csökken, aztán megnő. Ilyen esetet csak kézzel, a +/- gombok nyomogatásával lehet előidézni a kezdeményező panelen
            attackRollButton.disabled = false;
          }
        });
        observerForActions.observe(numberOfActions, { childList: true, subtree: true });
        // a körök számát figyeli, és ez alapján követi nyomon mennyi van hátra az adott buffokból
        let observerForCurrentRound = new MutationObserver(async () => {
          if (initRolled && parseInt(numberOfCurrentRound.innerText) != 1) {
            for (let i = 0; i < allActiveBuffs.length; i++) {
              if (allActiveBuffs[i].innerText.includes("kör")) {
                let numberOfRoundsLeftFromBuff = parseInt(allActiveBuffs[i].innerText);
                numberOfRoundsLeftFromBuff--;
                let buffNameWithoutNumberOfRounds = allActiveBuffs[i].innerText.slice(1);
                allActiveBuffs[i].innerText = numberOfRoundsLeftFromBuff + buffNameWithoutNumberOfRounds;
                if (numberOfRoundsLeftFromBuff == 0) {
                  buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText);
                }
              }
            }
          }
        });
        observerForCurrentRound.observe(numberOfCurrentRound, { childList: true, subtree: true });

        parsedCharacterDataFromJSON = JSON.parse(reader.result);

        for (let i = 0; i < parsedCharacterDataFromJSON.aptitudes.length; i++) {
          if (parsedCharacterDataFromJSON.aptitudes[i].level) aptitudeObject[parsedCharacterDataFromJSON.aptitudes[i].aptitude] = parsedCharacterDataFromJSON.aptitudes[i].level; // Objektum ahol az Adottságok neve a kulcs, az érték pedig az Adottág szintje
        }

        let indexOfFirstWeapon = 0;
        for (indexOfFirstWeapon; indexOfFirstWeapon < parsedCharacterDataFromJSON.weaponSets.length; indexOfFirstWeapon++) {
          if (parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon] != null) {
            break;
          }
        }

        let parryWeaponToSelectAtImport;
        if (parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon]) {
          parryWeaponToSelectAtImport = parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon].leftWeapon;
        }

        for (let i = 0; i < allWeapons.length; i++) {
          if (parryWeaponToSelectAtImport && allWeapons[i].w_name.includes(parryWeaponToSelectAtImport) && parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon].detailsMode == "parry") {
            offHand.value = allWeapons[i].w_name;
            break;
          }
        }

        if (parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon] != null) {
          for (let i = 0; i < allWeapons.length; i++) {
            if (allWeapons[i].w_name.includes(parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon].rightWeapon)) {
              weapons.value = allWeapons[i].w_name;
              if ((allWeapons[i].w_name.includes("egykézzel") || allWeapons[i].w_name.includes("dobva")) && parsedCharacterDataFromJSON.weaponSets[indexOfFirstWeapon].detailsMode != "parry") {
                for (let j = i; j < allWeapons.length; j++) {
                  if (allWeapons[j].w_name.includes("kétkézzel")) {
                    weapons.value = allWeapons[j].w_name;
                    break;
                  }
                }
              } else if (allWeapons[i].w_name.includes("dobva")) {
                for (let k = i; k < allWeapons.length; k++) {
                  if (allWeapons[k].w_name.includes("egykézzel")) {
                    weapons.value = allWeapons[k].w_name;
                    break;
                  }
                }
              }
              break;
            }
          }
        }

        filteredArrayIfHasHeavyArmorSkill = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Vértviselet");
        function armorHandler() {
          if (parsedCharacterDataFromJSON.armourSet == null) {
            return;
          }

          let armorPieces = parsedCharacterDataFromJSON.armourSet.pieces;
          if (armorPieces.length == 0) {
            return;
          }
          // let armorObject = []
          if (filteredArrayIfHasHeavyArmorSkill.length != 0) {
            mgtCompensation = parseInt(filteredArrayIfHasHeavyArmorSkill[0].level) * 2;
            if (filteredArrayIfHasHeavyArmorSkill[0].level == 4) {
              mgtCompensation = 9;
            }
            if (filteredArrayIfHasHeavyArmorSkill[0].level == 5) {
              mgtCompensation = 12;
            }
          }
          let totalMgtOfArmorPieces = 0;
          console.log(parsedCharacterDataFromJSON.armourSet.pickedPiecesWithDetails);
          for (let j = 0; j < parsedCharacterDataFromJSON.armourSet.pickedPiecesWithDetails.length; j++) {
            checkWhereItIsWorn(parsedCharacterDataFromJSON.armourSet.pickedPiecesWithDetails[j]);
            totalMgtOfArmorPieces += parsedCharacterDataFromJSON.armourSet.pickedPiecesWithDetails[j].MGT;
          }
          if (totalMgtOfArmorPieces - mgtCompensation <= 0) {
            totalMgtOfArmorSet.innerText = 0;
          } else if (totalMgtOfArmorPieces - mgtCompensation > 0) {
            totalMgtOfArmorSet.innerText = totalMgtOfArmorPieces - mgtCompensation;
          }
        }
        armorHandler();
        allDmgReductionListItems = document.querySelectorAll("div#currentArmorImg li");
        //--- karakter neve és kasztja
        charClass.innerText = parsedCharacterDataFromJSON.classKey;
        charLevel.innerText = `${parsedCharacterDataFromJSON.level}. szintű`;
        charRace.innerText = parsedCharacterDataFromJSON.raceKey;
        charName.innerText = parsedCharacterDataFromJSON.charName;
        //-----adottságok és faji módosítók leírása az infó ablakba
        let allAptitudes = parsedCharacterDataFromJSON.aptitudes;
        for (let i = 0; i < allAptitudes.length; i++) {
          let romanNumbers = ["I.", "II.", "III."];
          for (let j = 0; j < aptitudesDescript.length; j++) {
            if (allAptitudes[i].aptitude == aptitudesDescript[j].aptName && allAptitudes[i].level != 0) {
              let aptitudeListItem = document.createElement("li");
              if (aptitudesDescript[j].longDescriptionRequired) {
                aptitudeListItem.innerText = `${aptitudesDescript[j].aptName} ${romanNumbers[allAptitudes[i].level - 1]} fokozat`;
                if (allAptitudes[i].aptitude == "Tehetség") {
                  aptitudeListItem.innerText = `${aptitudeListItem.innerText} (${parsedCharacterDataFromJSON.talent.skill})`;
                }
                if (allAptitudes[i].aptitude == "Wier vér") {
                  let wierBloodPointsPerLevelOfWierBloodAptitude = [1, 3, 5]; // vérpontok száma az adottság szintjének függvényében
                  let wierBloodPointSpanForMaxBloodPoint = document.createElement("span");
                  let wierBloodPointSpanForCurrentBloodPoint = document.createElement("span");
                  let wierBloodPointTextElementMax = document.createElement("div");
                  wierBloodPointTextElementMax.innerText = "Max Vérpontok:";
                  let wierBloodPointNumberElementMax = document.createElement("div");
                  wierBloodPointNumberElementMax.innerText = wierBloodPointsPerLevelOfWierBloodAptitude[allAptitudes[i].level - 1];
                  let wierBloodPointTextElementCurrent = document.createElement("div");
                  wierBloodPointTextElementCurrent.innerText = "Akt Vérpontok:";
                  let wierBloodPointNumberElementCurrent = document.createElement("input");
                  wierBloodPointNumberElementCurrent.id = "currentBloodPoints";
                  wierBloodPointNumberElementCurrent.value = "0";
                  wierBloodPointSpanForMaxBloodPoint.appendChild(wierBloodPointTextElementMax);
                  wierBloodPointSpanForMaxBloodPoint.appendChild(wierBloodPointNumberElementMax);
                  wierBloodPointSpanForCurrentBloodPoint.appendChild(wierBloodPointTextElementCurrent);
                  wierBloodPointSpanForCurrentBloodPoint.appendChild(wierBloodPointNumberElementCurrent);
                  aptitudeListItem.appendChild(wierBloodPointSpanForMaxBloodPoint);
                  aptitudeListItem.appendChild(wierBloodPointSpanForCurrentBloodPoint);
                }
              } else {
                aptitudeListItem.innerText = `${aptitudesDescript[j].levelDescription[allAptitudes[i].level - 1]}`;
              }
              aptitudesList.appendChild(aptitudeListItem);
              break;
            }
          }
        }
        //-----szűrés különböző adottságokra
        filteredArrayIfHasAnyAffinity = parsedCharacterDataFromJSON.aptitudes.filter((name) => {
          if (name.aptitude != null)
            if (name.level != 0) {
              return name.aptitude.includes("affinitás");
            }
        });
        console.log(filteredArrayIfHasAnyAffinity);
        //----szűrés képzettségekre
        filteredArrayIfHasPsi = parsedCharacterDataFromJSON.skills.filter((name) => {
          if (name.name != null) {
            return name.name.includes("Pszi");
          }
        });

        if (filteredArrayIfHasPsi.length != 0) {
          psiDisciplinesSelectWrapper.style.display = "grid";
        }
        // Kf és afeletti képettségfoknál választott stílus az adott fegyverhez
        if (parsedCharacterDataFromJSON.weaponStyles) {
          selectedWeaponStyles = Object.entries(parsedCharacterDataFromJSON.weaponStyles);
        }

        filteredArrayIfHasTwoWeaponAttack = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Kétkezes harc");

        if (filteredArrayIfHasTwoWeaponAttack.length != 0) {
          twoWeaponAttackModifiersIndex = filteredArrayIfHasTwoWeaponAttack[0].level;
        }
        schoolsOfMagicNames = Object.keys(schoolsOfMagicNamesAndAttributes);
        filteredArrayIfHasAnyMagicSkill = parsedCharacterDataFromJSON.skills.filter((name) => schoolsOfMagicNames.includes(name.name));

        for (let i = 0; i < filteredArrayIfHasAnyMagicSkill.length; i++) {
          if (filteredArrayIfHasAnyMagicSkill[i].subSkill) {
            currentGodWorshippedByPlayer = filteredArrayIfHasAnyMagicSkill[i].subSkill;
            break;
          }
        }
        filteredArrayIfHasAnyMagicSkillSubSkill = parsedCharacterDataFromJSON.skills.filter((name) => schoolsOfMagicSubClass.includes(name.name));

        // --------- objektumba rendezzük a mágiaformákat ahol az érték azoknak a szintje
        // ------de ha szakrális mágiáról van szó, akkor az speciális lesz, ezért erre kell egy külön rész a függvényben

        welcomeWindow.style.display = "none";
        rollResultWrapper.style.display = "grid";
        skillCheckRollResultWrapper.style.display = "grid";

        for (let i = 0; i < filteredArrayIfHasAnyMagicSkillSubSkill.length; i++) {
          if (filteredArrayIfHasAnyMagicSkillSubSkill[i].name.includes("fohász")) {
            allMagicSubskillsObject[`${filteredArrayIfHasAnyMagicSkillSubSkill[i].name} - ${filteredArrayIfHasAnyMagicSkillSubSkill[i].subSkill}`] = filteredArrayIfHasAnyMagicSkillSubSkill[i].level;
          } else {
            allMagicSubskillsObject[`${filteredArrayIfHasAnyMagicSkillSubSkill[i].subSkill}`] = filteredArrayIfHasAnyMagicSkillSubSkill[i].level;
          }
        }
        // allMagicSubskillsObject = Object.entries(allMagicSubskillsObject);
        //console.log(allMagicSubskillsObject["Villámmágia"]);

        if (parsedCharacterDataFromJSON.raceKey == "Wier") {
          allMagicSubskillsObject["Wier vérmágia"] = aptitudeObject["Wier vér"];
        }

        filteredArrayIfHasParry = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Hárítás");
        filteredArrayIfHasRunning = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Futás");
        filteredArrayIfHasAssassination = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Orvtámadás");
        let currentChar = classes.find((name) => name.classKey == parsedCharacterDataFromJSON.classKey);
        let currentRace = races.find((name) => name.raceKey == parsedCharacterDataFromJSON.raceKey);
        // faji egyedi jellemzők megjelenítése
        for (let i = 0; i < currentRace.uniqueAbilities.length; i++) {
          let currentuniqueAbility = currentRace.uniqueAbilities[i];
          let raceModifiersListItem = document.createElement("li");
          raceModifiersListItem.innerText = `${currentuniqueAbility}`;
          raceModifiersList.appendChild(raceModifiersListItem);
        }

        //---------------------- betölti a tul. értékeket és képzettségeket
        //------------------------------------------------------------
        //toggleAllallActionBarButtonsExceptInitRollDisplay();

        // itt rakja be az összes skillt a skillCheck komponensbe
        let allSkillsArray = [];
        for (let i = 0; i < parsedCharacterDataFromJSON.skills.length; i++) {
          // itt a "skills" a katakter txt-ben lévő képzettségekre utal
          if (parsedCharacterDataFromJSON.skills[i].name != null) {
            let tempLevelNameStore = parseInt(parsedCharacterDataFromJSON.skills[i].level);
            let skillOptionText;
            if (parsedCharacterDataFromJSON.skills[i].subSkill) {
              skillOptionText = `${parsedCharacterDataFromJSON.skills[i].name} (${parsedCharacterDataFromJSON.skills[i].subSkill}) (${skillLevelsMeaning[tempLevelNameStore]})`;
            } else {
              skillOptionText = `${parsedCharacterDataFromJSON.skills[i].name} (${skillLevelsMeaning[tempLevelNameStore]})`;
            }
            allSkillsArray.push([parsedCharacterDataFromJSON.skills[i].level, parsedCharacterDataFromJSON.skills[i].name, parsedCharacterDataFromJSON.skills[i].subSkill, skillOptionText]);
          } else {
            continue;
          }
        }
        function OrderFunctionForAllSkills() {
          allSkillsArray.sort(function (a, b) {
            return CharCompare(a[3], b[3], 0);
          });
        }
        OrderFunctionForAllSkills();
        for (let i = 0; i < allSkillsArray.length; i++) {
          let skillOption = document.createElement("option");
          skillOption.value = [
            allSkillsArray[i][0], // képzettség szintje
            allSkillsArray[i][1], // képzettség neve
            allSkillsArray[i][2], // képzettség alosztály (ha van)
          ];
          skillOption.innerText = allSkillsArray[i][3];
          skills.appendChild(skillOption);
        }
        //adott karakter(kaszt) alap statjai
        let currentClassBaseAttributes = currentChar.baseAttributes;
        // tulajdonságok módosításai a karakteralkotó Tulajdonság oszlop mellett (max +/-2 mértékben)
        let attrSpreadObject = parsedCharacterDataFromJSON.attrSpread;
        // öregedés
        let ageingObject = parsedCharacterDataFromJSON.ageing.distribution;
        // faji módosító objektum értékei
        let currentRaceAttrModifiersObj = currentRace.attributeModifiers;
        //--------------------------------------------------------------------------------
        // tulajdonságok számítása, ami kasztból, fajból, és öregedésből jön
        let voidClassSpecialModifier = 0;
        if (currentChar.classKey == "Void" && parsedCharacterDataFromJSON.talentIdx != 0) {
          if (parsedCharacterDataFromJSON.talentIdx == 1) {
            voidClassSpecialModifier = -1;
          } else if (parsedCharacterDataFromJSON.talentIdx == 2) {
            voidClassSpecialModifier = -2;
          } else if (parsedCharacterDataFromJSON.talentIdx == 3) {
            voidClassSpecialModifier = -3;
          } else if (parsedCharacterDataFromJSON.talentIdx == 4) {
            voidClassSpecialModifier = -4;
          } else if (parsedCharacterDataFromJSON.talentIdx == 5) {
            voidClassSpecialModifier = 1;
          } else if (parsedCharacterDataFromJSON.talentIdx == 6) {
            voidClassSpecialModifier = 2;
          }
        }
        for (let i = 0; i < charAttributes.length; i++) {
          // 10-ig megy, mert összesen 10 tulajdonság van
          let currentAttribute =
            currentClassBaseAttributes[charAttributes[i]] +
            attrSpreadObject[charAttributes[i]] +
            findAndCountAttributesThatModifyStats(`${charAttributes[i]}`) +
            currentRaceAttrModifiersObj[charAttributes[i]] -
            ageingObject[charAttributes[i]] +
            voidClassSpecialModifier;
          let attrOption = document.createElement("option");
          attrOption.innerText = charAttributes[i];
          attrOption.value = [currentAttribute, charAttributes[i]];
          attributes.appendChild(attrOption);
          //itt kerülnek meghatározásra a végső tulajdonság értékek
          currentCharFinalAttributes[charAttributes[i]] = currentAttribute;
        }

        function modifierCalculator(attr1, attr2, attr3) {
          let currentModifier = 0;
          currentModifier += attrSpreadObject[attr1] - ageingObject[attr1] + currentRaceAttrModifiersObj[attr1];
          currentModifier += attrSpreadObject[attr2] - ageingObject[attr2] + currentRaceAttrModifiersObj[attr2];
          currentModifier += attrSpreadObject[attr3] - ageingObject[attr3] + currentRaceAttrModifiersObj[attr3];
          return currentModifier;
        }
        let atkModifier = modifierCalculator("Erő", "Gyo", "Ügy");
        let aimModifier = modifierCalculator("Ügy", "Asz", "Érz");
        let defModifier = modifierCalculator("Gyo", "Ügy", "Érz");

        function findAndCountAttributesThatModifyStats(attr1, attr2, attr3) {
          let attrBuyingObj = parsedCharacterDataFromJSON.attrBuying;
          let numberOfBoughtAttributes = 0;
          for (let i = 0; i < attrBuyingObj.length; i++) {
            for (let j = 0; j < attrBuyingObj[i].length; j++) {
              if (attrBuyingObj[i][j] == attr1) {
                numberOfBoughtAttributes++;
              } else if (attrBuyingObj[i][j] == attr2) {
                numberOfBoughtAttributes++;
              } else if (attrBuyingObj[i][j] == attr3) {
                numberOfBoughtAttributes++;
              }
            }
          }
          return numberOfBoughtAttributes; // ez itt azért lesz jó, mert minden megvásárolt Tulajdonság 1-el növeli a az adott Tulajdonság értékét, így a vásárlások száma = össz növekmény értéke
        }
        function getAndAddCurrentCharAttributesForBaseAtkAimDef(attr1, attr2, attr3) {
          // kiszámolja az alapértékeket (TÉ VÉ CÉ) a hozzájuk tartozó tulajdonságok alapján
          return currentChar.baseAttributes[attr1] + currentChar.baseAttributes[attr2] + currentChar.baseAttributes[attr3];
        }

        ///----- a karakter szintjéből adódó értékek
        let sumAtkGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.atkPerLvl;
        let sumDefGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.defPerLvl;
        let sumAimGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.aimPerLvl;
        sumFpGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.fpPerLvl;
        sumPpGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.ppPerLvl;
        sumMpGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.mpPerLvl;
        sumInitiativeGainedByLevel = parsedCharacterDataFromJSON.level * currentChar.initPerLvl;

        baseAtk =
          parsedCharacterDataFromJSON.stats.TÉ +
          getAndAddCurrentCharAttributesForBaseAtkAimDef("Gyo", "Ügy", "Erő") +
          atkModifier +
          findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Erő") +
          sumAtkGainedByLevel +
          parsedCharacterDataFromJSON.spentHm.TÉ;
        baseAim =
          parsedCharacterDataFromJSON.stats.CÉ +
          getAndAddCurrentCharAttributesForBaseAtkAimDef("Ügy", "Asz", "Érz") +
          aimModifier +
          findAndCountAttributesThatModifyStats("Ügy", "Asz", "Érz") +
          sumAimGainedByLevel +
          parsedCharacterDataFromJSON.spentHm.CÉ;
        baseDef =
          parsedCharacterDataFromJSON.stats.VÉ +
          getAndAddCurrentCharAttributesForBaseAtkAimDef("Gyo", "Ügy", "Érz") +
          60 +
          defModifier +
          findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Érz") +
          sumDefGainedByLevel +
          parsedCharacterDataFromJSON.spentHm.VÉ;

        if (filteredArrayIfHasAssassination.length != 0) {
          bonusDamageFromAssassination = filteredArrayIfHasAssassination[0].level;
        }

        // szűrés minden fegyverhasználatra
        filteredArrayByWeaponSkills = parsedCharacterDataFromJSON.skills.filter((name) => name.name == "Fegyverhasználat");
        // ki kellett menteni a varázslatokhoz
        baseAimWithTeoCalculator = tvcoCalculator(baseAim);
        baseAtkWithTeoCalculator = tvcoCalculator(baseAtk);
        baseDefWithTeoCalculator = tvcoCalculator(baseDef);
        // legenerálja a fizikai tulajdonságok nevét és értékét

        initiative.innerText = currentCharFinalAttributes.Gyo + currentCharFinalAttributes.Int + currentCharFinalAttributes.Érz + sumInitiativeGainedByLevel + parsedCharacterDataFromJSON.stats.KÉ; // --- alap KÉ érték.

        let currentCharFinalAttributeValues = Object.values(currentCharFinalAttributes);
        for (let i = 0; i < 5; i++) {
          let physicalAttributeNameDiv = document.createElement("div");
          let physicalAttributeValueDiv = document.createElement("div");
          physicalAttributeNameDiv.classList.add("physicalAttributeName");
          physicalAttributeValueDiv.classList.add("physicalAttributeValue");
          physicalAttributeValueDiv.setAttribute("id", `${charAttributes[i]}`);
          physicalAttributeNameDiv.innerText = charAttributes[i] + ":";
          physicalAttributeValueDiv.innerText = currentCharFinalAttributeValues[i];
          skillCheckLeftSideWrapper.appendChild(physicalAttributeNameDiv);
          skillCheckLeftSideWrapper.appendChild(physicalAttributeValueDiv);
        }
        // legenerálja a szellemi tulajdonságok nevét és értékét
        for (let i = 5; i < 10; i++) {
          let spiritualAttributeNameDiv = document.createElement("div");
          let spiritualAttributeValueDiv = document.createElement("div");
          spiritualAttributeNameDiv.classList.add("spiritualAttributeName");
          spiritualAttributeValueDiv.classList.add("spiritualAttributeValue");
          spiritualAttributeNameDiv.innerText = charAttributes[i] + ":";
          spiritualAttributeValueDiv.innerText = currentCharFinalAttributeValues[i];
          skillCheckRightSideWrapper.appendChild(spiritualAttributeNameDiv);
          skillCheckRightSideWrapper.appendChild(spiritualAttributeValueDiv);
        }
        // *******************************************************************
        // erő alapján alap ököl sebzés kiszámítása
        // az ökölhöz tartozó legmagasabb tulajdonságokat alapból 4-el kell osztani *********************
        let fistAtkDivider = 4;
        let charStrWithWarriorMonkAptitude = currentCharFinalAttributes.Erő;
        // van-e harcművész adottság?
        if (aptitudeObject["Harcművész"]) {
          if (aptitudeObject["Harcművész"] == 2) {
            fistAtkDivider = 3;
            charStrWithWarriorMonkAptitude += 1;
          } else if (aptitudeObject["Harcművész"] == 3) {
            fistAtkDivider = 2;
            charStrWithWarriorMonkAptitude += 3;
          }
        } else {
          fistAtkDivider = 4;
        }
        fistAtk = Math.floor(Math.max(currentCharFinalAttributes.Erő, currentCharFinalAttributes.Gyo, currentCharFinalAttributes.Ügy) / fistAtkDivider);
        fistDef = Math.floor(Math.max(currentCharFinalAttributes.Gyo, currentCharFinalAttributes.Ügy) / fistAtkDivider);

        if (charStrWithWarriorMonkAptitude <= 5) {
          damageOfFists = "1k2";
        } else if ([6, 7, 8].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k2";
        } else if ([9, 10, 11].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "1k5";
        } else if ([12, 13, 14].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "1k5+1";
        } else if ([15, 16, 17].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "1k5+2";
        } else if ([18, 19, 20].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k5";
        } else if ([21, 22, 23].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k5+1";
        } else if ([24, 25, 26].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k5+2";
        } else if (charStrWithWarriorMonkAptitude >= 27) {
          damageOfFists = "3k5";
        }
        //-------- mana, fp és pszi számítás kell
        //-----pszi és Ellenállások
        let lowestStatForPsiPoints = Math.min(currentCharFinalAttributes.Int, currentCharFinalAttributes.Aka, currentCharFinalAttributes.Asz);
        // --- ha van Pszionista adottság, akkor az adottság szintjétől függően a középső, vagy a legmagasabb Tulajdonság számít a legalacsonyabb helyett
        let highestStatForPsiPoints = Math.max(currentCharFinalAttributes.Int, currentCharFinalAttributes.Aka, currentCharFinalAttributes.Asz);
        let psiStatsArray = [currentCharFinalAttributes.Int, currentCharFinalAttributes.Aka, currentCharFinalAttributes.Asz];

        let middleStatForPsiPoints = psiStatsArray.sort()[1]; // mivel minden esetben 3 eleme van ennek az arraynak (a 3 Tulajdonság) ezért rendezés után mindig a középső az ami kell nekünk

        let psiMultiplier = 0;
        if (charRace.innerText == "Amund") {
          psiMultiplier = 1;
        }
        if (filteredArrayIfHasPsi.length != 0) {
          psiMultiplier = parseFloat(filteredArrayIfHasPsi[0].level / 2);
        }
        let statForPsiPoints = 0;
        if (aptitudeObject["Pszionista"] == 1) {
          statForPsiPoints = middleStatForPsiPoints + aptitudeObject["Pszionista"] * 2; // a Pszionista adottság szintenként +2-vel növeli az érintett Tul.-t a pszi pontok kiszámításánál, de 1. fokon a középső Tul.-t kell alapul venni
        } else if (aptitudeObject["Pszionista"] >= 2) {
          statForPsiPoints = highestStatForPsiPoints + aptitudeObject["Pszionista"] * 2;
        } else if (!aptitudeObject["Pszionista"]) {
          statForPsiPoints = lowestStatForPsiPoints;
        }

        let psiPoints = Math.floor(statForPsiPoints * psiMultiplier + parsedCharacterDataFromJSON.stats.Pp) + sumPpGainedByLevel;
        let psiShieldForAsz = 0;
        let psiShieldForAka = 0;

        if (filteredArrayIfHasPsi.length && filteredArrayIfHasPsi[0].level >= 2) {
          let accumulatedValueToAddToAttributeWhenCaluclatingCostOfPsiShiled = 1;
          let multiplierWhenCaluclatingCostOfPsiShiled = 1;
          while (multiplierWhenCaluclatingCostOfPsiShiled * currentCharFinalAttributes.Asz + accumulatedValueToAddToAttributeWhenCaluclatingCostOfPsiShiled <= psiPoints) {
            psiShieldForAsz++;
            multiplierWhenCaluclatingCostOfPsiShiled++;
            accumulatedValueToAddToAttributeWhenCaluclatingCostOfPsiShiled += multiplierWhenCaluclatingCostOfPsiShiled;
          }
          accumulatedValueToAddToAttributeWhenCaluclatingCostOfPsiShiled = 1;
          multiplierWhenCaluclatingCostOfPsiShiled = 1;
          while (multiplierWhenCaluclatingCostOfPsiShiled * currentCharFinalAttributes.Aka + accumulatedValueToAddToAttributeWhenCaluclatingCostOfPsiShiled <= psiPoints) {
            psiShieldForAka++;
            multiplierWhenCaluclatingCostOfPsiShiled++;
            accumulatedValueToAddToAttributeWhenCaluclatingCostOfPsiShiled += multiplierWhenCaluclatingCostOfPsiShiled;
          }
        }
        /**************************** Ellenállásokkal kapcsolatos számítások **************************************************/
        let extraAstralResistFromAptitude = 0; // ezek az adottságok extra sikert adnak. Ezek összeadódhatnak egyéb extra sikerekkel, nem úgy, mint a DM-ek
        let extraMentalResistFromAptitude = 0;
        let extraPhysicalResistFromAptitude = 0;
        let extraEvasiveResistFromAptitude = 0;
        if (aptitudeObject["Összeszedett"]) {
          extraAstralResistFromAptitude = aptitudeObject["Összeszedett"];
        }
        if (aptitudeObject["Lélekerő"]) {
          extraMentalResistFromAptitude = aptitudeObject["Lélekerő"];
        }
        if (aptitudeObject["Masszív"]) {
          extraPhysicalResistFromAptitude = aptitudeObject["Masszív"];
        }
        if (aptitudeObject["Intuitív"]) {
          extraEvasiveResistFromAptitude = aptitudeObject["Intuitív"];
        }
        astralResist.innerText = `${currentCharFinalAttributes.Asz} + (${psiShieldForAsz})`;
        astralResistButton.value = currentCharFinalAttributes.Asz + psiShieldForAsz + extraAstralResistFromAptitude; // a gomb value értékében van elrejtve az ellenállás
        mentalResist.innerText = `${currentCharFinalAttributes.Aka} + (${psiShieldForAka})`;
        mentalResistButton.value = currentCharFinalAttributes.Aka + psiShieldForAka + extraMentalResistFromAptitude;
        physicalResist.innerText = Math.min(currentCharFinalAttributes.Egé, currentCharFinalAttributes.Áll);
        physicalResistButton.value = Math.min(currentCharFinalAttributes.Egé, currentCharFinalAttributes.Áll) + extraPhysicalResistFromAptitude;
        evasiveResist.innerText = Math.min(currentCharFinalAttributes.Gyo, currentCharFinalAttributes.Érz);
        evasiveResistButton.value = Math.min(currentCharFinalAttributes.Gyo, currentCharFinalAttributes.Érz) + extraEvasiveResistFromAptitude;
        // itt kezdődnek azok az ellenállások, amik a többi ellenállásból számítódnak
        if (parseInt(astralResistButton.value) >= parseInt(mentalResistButton.value)) {
          spiritualResist.innerText = `${currentCharFinalAttributes.Aka} + (${psiShieldForAka})`;
        } else if (parseInt(astralResistButton.value) < parseInt(mentalResistButton.value)) {
          spiritualResist.innerText = `${currentCharFinalAttributes.Asz} + (${psiShieldForAsz})`;
        }
        spiritualResistButton.value = Math.min(parseInt(astralResistButton.value), parseInt(mentalResistButton.value));

        if (parseInt(spiritualResistButton.value) >= parseInt(physicalResistButton.value)) {
          complexResist.innerText = physicalResist.innerText;
        } else if (parseInt(spiritualResistButton.value) < parseInt(physicalResistButton.value)) {
          complexResist.innerText = spiritualResist.innerText;
        }
        complexResistButton.value = Math.min(parseInt(spiritualResistButton.value), parseInt(physicalResistButton.value));
        //--------------------fp
        let fpPoints = parsedCharacterDataFromJSON.stats.Fp + sumFpGainedByLevel + currentCharFinalAttributes.Áll + currentCharFinalAttributes.Aka;
        //------------------ mana
        let attributeNeededToCalculateManaPoints = 0;
        let highestMagicSkillLevel = 0;
        let highestMagicSkillName = "";
        let modifierByMagicallyAttunedAptitude = 0;
        //------ varázstudó adottságból jövő tulajdonság módosító
        if (aptitudeObject["Varázstudó"]) {
          if (aptitudeObject["Varázstudó"] == 2) {
            modifierByMagicallyAttunedAptitude = 3;
          } else if (aptitudeObject["Varázstudó"] == 3) {
            modifierByMagicallyAttunedAptitude = 6;
          }
        }
        if (filteredArrayIfHasAnyMagicSkill.length != 0) {
          let allMagicSkillLevelsArray = [];
          for (let i = 0; i < filteredArrayIfHasAnyMagicSkill.length; i++) {
            allMagicSkillLevelsArray.push(filteredArrayIfHasAnyMagicSkill[i].level);
          }
          highestMagicSkillLevel = parseInt(Math.max(...allMagicSkillLevelsArray));
        }
        //------ a legmagasabb mágikus képzettség neve is kell a mana számításhoz
        filteredArrayForNameOfHighestMagicalSkill = filteredArrayIfHasAnyMagicSkill.filter((skill) => skill.level == highestMagicSkillLevel);
        // console.log(
        //   "van-e valami magic skill?:", filteredArrayIfHasAnyMagicSkill,
        //   "legmagasabb magic skill:", filteredArrayForNameOfHighestMagicalSkill,
        // );
        if (filteredArrayForNameOfHighestMagicalSkill[0] != null) {
          highestMagicSkillName = filteredArrayForNameOfHighestMagicalSkill[0].name;
        } else {
          highestMagicSkillName = "";
        }
        for (let i = 0; i < schoolsOfMagicNames.length; i++) {
          if (highestMagicSkillName == schoolsOfMagicNames[i]) {
            let variable1 = schoolsOfMagicNamesAndAttributes[schoolsOfMagicNames[i]];
            attributeNeededToCalculateManaPoints = currentCharFinalAttributes[variable1] + modifierByMagicallyAttunedAptitude;
            for (let j = 0; j < gods.length; j++) {
              if (gods[j].nameOfGod == currentGodWorshippedByPlayer) {
                attributeNeededToCalculateManaPoints = currentCharFinalAttributes[gods[j].attribute] + modifierByMagicallyAttunedAptitude;
                break;
              }
            }
            break;
          }
        }
        let manaPoints = attributeNeededToCalculateManaPoints * highestMagicSkillLevel + sumMpGainedByLevel + parsedCharacterDataFromJSON.stats.Mp;
        if (!aptitudeObject["Varázstudó"]) {
          manaPoints = 0;
        }

        let vigorousModifier = 0;
        if (aptitudeObject["Életerős"]) {
          vigorousModifier = aptitudeObject["Életerős"];
        } else {
          vigorousModifier = 0;
        }
        let legendPoints = 3;
        if (aptitudeObject["Ősibb lélek"]) {
          legendPoints += aptitudeObject["Ősibb lélek"];
        } else {
          legendPoints = 3;
        }

        const data = {
          charName: charName.innerText,
          currentFp: fpPoints,
          currentEp: currentCharFinalAttributes.Egé + vigorousModifier * 2,
          currentPp: psiPoints,
          currentMp: manaPoints,
          currentLp: legendPoints,
        };

        (maxFp.innerText = fpPoints),
          (maxEp.innerText = currentCharFinalAttributes.Egé + vigorousModifier * 2),
          (maxPp.innerText = psiPoints),
          (maxMp.innerText = manaPoints),
          (maxLp.innerText = legendPoints);

        const JSONdata = JSON.stringify(data);
        const endpoint = "/api/createCharacterEntry";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSONdata,
        };

        socket = io("wss://ttk-rolldice.fly.dev", {
          transports: ["websocket"],
        });

        socket.on("connect", async () => {
          // a karakter betöltésénél lekéri az adatokat a szerverről
          console.log("Connected to server", charName.innerText);
          let data = {};
          await fetch(`../api/characterStatsThatChange/${charName.innerText}`)
            .then((response) => {
              return response.json();
            })
            .then((parsedData) => {
              if (!parsedData) {
                return;
              }
              charId = parsedData.charId;
              data = {
                gameId: parsedData.gameId,
                charId: parsedData.charId,
                charName: charName.innerText,
                currentFp: parsedData.currentFp,
                currentEp: parsedData.currentEp,
                currentPp: parsedData.currentPp,
                currentMp: parsedData.currentMp,
                currentLp: parsedData.currentLp,
                atkRollResult: parsedData.atkRollResult,
                atkRollDice: parsedData.atkRollDice,
                activeBuffs: parsedData.activeBuffs,
                skillCheckResult: parsedData.skillCheckResult,
                skillCheckDice: parsedData.skillCheckDice,
                numberOfActions: parsedData.numberOfActions,
                initiativeWithRoll: parsedData.initiativeWithRoll,
              };
            });
          socket.emit("create new player", data);
          socket.emit("join room", data.gameId);
        });

        socket.on("skillCheckRollModifier sent your way", (skillCheckRollModifier) => {
          rollModifier.value = parseInt(skillCheckRollModifier);
          setManuallySetRollModifier(parseInt(skillCheckRollModifier));
          console.log(skillCheckRollModifier);
        });

        const response = await fetch(endpoint, options);
        fetchCharacterData(charName.innerText);

        // itt feltöltjük a weaponTypeAndLevelAndStyleArray-t a fegyverkategóriával és a hozzá tartozó képzettség szintekkel
        for (let i = 0; i < filteredArrayByWeaponSkills.length; i++) {
          checkAndModifyCurrentWeaponStyles(filteredArrayByWeaponSkills[i].subSkill);
          weaponTypeAndLevelAndStyleArray.push([filteredArrayByWeaponSkills[i].subSkill, filteredArrayByWeaponSkills[i].level, maneuverAttachedToWeaponType[0]]);
        }
        if (maxMp.innerText == 0 && parsedCharacterDataFromJSON.raceKey != "Wier") {
          spellCastButtonWrapper.style.display = "none";
        }
        weaponStyles = Object.entries(weaponStyles);
        //weaponStyleBonusesByLevelOfProficiency = Object.entries(weaponStyleBonusesByLevelOfProficiency)
        combatStatRefresher();
      }
      fileFirstLoaded = false;
      window.addEventListener("beforeunload", () => {
        updateCharacterData(false);
        socket.emit("leave room", gameIdLabel.innerText);
      });
    });

    // socket.on("new user connected", (usersObject, socketId) => {
    //   usersObject[socketId] = charName.innerText;
    //   socket.emit("new user added to usersObject", usersObject);
    //   console.log(usersObject);
    // });

    //socket.emit("chat message", "this is a log message");

    if (file) {
      reader.readAsText(file);
    }
  }

  // ez a számláló a pszi roham miatt van
  let numberOfClicksForAttacksForPsiAssault = 0;
  //ez pedig a kétkezes harc miatt
  numberOfClicksAtTwoWeaponAttack = 0;

  //************************************************************************ */
  //------------------a támadó dobás
  //************************************************************************ */

  let numberOfChainLightningCharges = 0;

  async function handleClickOnAttackRollButton(darkDice, lightDice) {
    //updateCharacterSocketData();
    if (soundToggleCheckbox.checked) {
      rollDiceSound.play();
    }

    if (Object.values(currentCombatSpell).length && (currentCombatSpell.spellName.includes("Visszaverődő") || currentCombatSpell.spellName.includes("Villámlánc"))) {
      numberOfChainLightningCharges = allMagicSubskillsObject["Villámmágia"] - 1;
      currentCombatSpellChanger({});
    }

    //*********************************************************************** */
    //** Ne számoljon, ha legendapont használat volt, ez az if több helyen is megjelenik ugyanezen okból */
    if (defensiveCombatOn && !spellNeedsAimRoll) {
      setDefensiveCombatVEObonus(0); // támadás esetén a Védekező harcból adódó bónusz 0 lesz, függetlenül attól, hogy ez milyen támadás
      defensiveCombatOnSetToFalse();
      defensiveCombatContinueSelectedSetToFalse(); // ha az előző kör végén úgy dönött, folytatja a védekező harcot
    }
    if (!spellNeedsAimRoll) {
      numberOfClicksForAttacksForPsiAssault++;
      numberOfAttacksInTheRound++;
    }

    if (twoWeaponAttackRadioButton.checked == true) {
      twoWeaponAttackWasUsedThisRound = true;
      numberOfClicksAtTwoWeaponAttack++;
    }

    combatStatRefresher();

    warningWindow.innerText = "";
    bodyPartImg.innerHTML = "";
    charAtkSumText.innerText = "Össz TÉO/CÉO";
    charAtkSum.innerText = "";
    specialEffect.innerText = "nincs";
    chosenWeapon.innerText = "Választott fegyver:";

    // -------- támadások számából adódó módosító
    if (initRolled == true) {
      if (currentlySelectedWeapon.atkPerRound < numberOfAttacksInTheRound && spellNeedsAimRoll == false) {
        modifierFromNumberOfAttacksInTheRound = numberOfAttacksInTheRound - currentlySelectedWeapon.atkPerRound;
        // ez itt azért -1, mert minden, a tám értéket meghaladó támadás -1 HMO-t ad.

        if (twoWeaponAttackWasUsedThisRound && numberOfAttacksInTheRound - currentlySelectedWeapon.atkPerRound == 2) {
          hmoModifier(-2);
        } else {
          hmoModifier(-1);
        }
      }
    }
    //-----------------------megnézni, hogy van-e erő sebzés

    if (currentlySelectedWeapon.strBonusDmg == false) {
      rollResult.innerText = ttkRoll(false, darkDice, lightDice);
      rollResult.animate([{ color: "white" }, { color: "black" }], 200);
    } else if (currentlySelectedWeapon.strBonusDmg == true) {
      rollResult.innerText = ttkRoll(true, darkDice, lightDice);
      rollResult.animate([{ color: "white" }, { color: "black" }], 200);
    }
    //************************************************************************************************************************** */
    //Ebben a körben volt kombináció vagy kapáslövés használva, ezért a minusz HMO-k maradnak
    //*************************************************************************************************************************** */
    if (combinationCheckBox.checked == true && spellNeedsAimRoll == false && attackOfOpportunityOn == false) {
      if (guidedSpellCombatStatChangerCheckbox.checked) {
        combinationModifiersIndex = parseInt(guidedSpellProfession.innerText);
      }
      if (!guidedSpellCombatStatChangerCheckbox.checked) {
        combinationModifiersIndex = professionLevel;
      }
      combinationWasUsedThisRound = true;
      cumulativeCombinationModifier -= combinationModifiers[combinationModifiersIndex];
      hmoModifier(combinationModifiers[combinationModifiersIndex]);
      console.log("halmozódó komb mod", cumulativeCombinationModifier);
      console.log("halmozódó tám mod", modifierFromNumberOfAttacksInTheRound);
    }

    firstAttackInRoundSpent = true;
    combinationCheckBox.disabled = false;

    if (spellNeedsAimRoll == true && numberOfChainLightningCharges == 0) {
      setTimeout(() => {
        currentlySelectedWeaponChanger(weaponBeforeCasting.w_name);
        currentAimedSpellModifier = 0;
        combatStatRefresher();
      }, 500);
    }

    damageResult.innerText = "";
    bodyPart.innerText = "";
    bodyPart.innerText = bodyParts[originalLightDice - 1];

    tempImg = document.createElement("img");
    tempImg.classList.add("tempImg");
    bodyPartImg.appendChild(tempImg);
    function currentBodypartHit(bodypart) {
      tempImg.src = "";
      tempImg.src = `./bodyParts/${bodypart}`;
    }
    if (bodyPart.innerText == "Bal láb") {
      currentBodypartHit("LeftLeg.png");
    }
    if (bodyPart.innerText == "Jobb láb") {
      currentBodypartHit("RightLeg.png");
    }
    if (bodyPart.innerText == "Bal kar") {
      currentBodypartHit("LeftArm.png");
    }
    if (bodyPart.innerText == "Fegyverforgató kar") {
      currentBodypartHit("RightArm.png");
    }
    if (bodyPart.innerText == "Törzs") {
      currentBodypartHit("Torso.png");
    }
    if (bodyPart.innerText == "Fej") {
      currentBodypartHit("Head.png");
    }
    bodyPart.animate([{ color: "white" }, { color: "black" }], 200);
    damageEvaluator();

    // ********************************************************************************************************************
    // ---- megnézi, hogy van-e kiválasztva összetett manőver és először a képzettségeket veszi figyelembe, és próbát is dob
    //**********************************************************************************************************************
    //******************************************************************************************************************* */

    // let selectAllAttributeOptions = document.querySelectorAll(
    //   "select#attributes option"
    // );

    // megnézzük, hogy képzettek vagyunk-e az adott manőverben

    //     for (let i = 0; i < selectAllAttributeOptions.length; i++) {
    //       if (selectAllAttributeOptions[i].innerText == "Erő") {
    //         attributes.value = selectAllAttributeOptions[i].value;
    //       }
    //     }
    //     evaluateSkillOrAttributeCheckBase();
    //     handleSkillCheck(false, originalLightDice);
    //     allResultsCleaner();
    //     charAtkSumText.innerText = "Próba végeredménye:";
    //     charAtkSum.innerText = skillCheckResult.innerText;
    //     break;
    //   }
    // if (
    //   arrayOfAllComplexManeuvers[i].checked == true &&
    //   arrayOfAllComplexManeuvers[i].value == "Lefegyverzés"
    // ) {
    //   disarmWasUsedThisRound = true;
    //   for (let j = 0; j < selectAllSkillOptions.length; j++) {
    //     if (selectAllSkillOptions[j].value.includes("Lefegyverzés")) {
    //       skills.value = selectAllSkillOptions[j].value;
    //       break;
    //     }
    //     skills.value = 0;
    //   }
    //   for (let i = 0; i < selectAllAttributeOptions.length; i++) {
    //     if (selectAllAttributeOptions[i].innerText == "Ügy") {
    //       attributes.value = selectAllAttributeOptions[i].value;
    //     }
    //   }
    //   if (currentlySelectedWeapon.disarmingWeapon == true) {
    //     succFailModifier.value = 1;
    //   }
    //   if (currentlySelectedWeapon.disarmingWeapon == false) {
    //     succFailModifier.value = 0;
    //   }
    //   evaluateSkillOrAttributeCheckBase();
    //   handleSkillCheck(false, originalLightDice);
    //   allResultsCleaner();
    //   charAtkSumText.innerText = "Próba végeredménye:";
    //   specialEffect.innerText = "nincs";
    //   charAtkSum.innerText = skillCheckResult.innerText;
    //   break;
    // }
    //}
    if (initRolled && combinationCheckBox.checked == false && firstAttackIsSpellThatNeedsAimRoll == false && firstAttackIsAttackOfOpportunity == false && numberOfChainLightningCharges == 0) {
      attackRollButton.disabled = true;
    }
    if (combinationCheckBox.checked && parseInt(numberOfActions.innerText) >= 3) {
      attackRollButton.disabled = false;
    }
    if (combinationCheckBox.checked && parseInt(numberOfActions.innerText) < 3) {
      attackRollButton.disabled = true;
    }
    if (numberOfClicksAtTwoWeaponAttack == 1) {
      attackRollButton.disabled = false;
    }
    if (attackRollButtonWasDisabledBeforeSpellCast == true && numberOfChainLightningCharges == 0) {
      attackRollButton.disabled = true;
    }

    if (initRolled == true && !spellNeedsAimRoll) {
      if (currentlySelectedWeapon.atkPerRound < numberOfAttacksInTheRound + 1 && !spellNeedsAimRoll) {
        totalModifierForNextAttack.innerText = `${-1 + combinationModifiers[combinationModifiersIndex]}`;
      } else {
        totalModifierForNextAttack.innerText = `${combinationModifiers[combinationModifiersIndex]}`;
      }

      //ha volt kezdeményező dobás
      for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
        if (arrayOfAllComplexManeuvers[i].checked == true) {
          totalActionCostOfAttackSetter(arrayOfAllComplexManeuvers[i].parentElement.value);
        }
      }

      if (spellNeedsAimRoll == false && attackOfOpportunityOn == false) {
        spellCastingFailure(true, currentSpell);
        numberOfActionsSpentOnCastingCurrentSpellNullifier();
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - totalActionCostOfAttack;
        actionsSpentSinceLastCastAdderCheckerAndNullifier(totalActionCostOfAttack);
      }
      //************************************************************************************************************************** */
      //Ebben a körben volt roham használva, ezért a minusz VÉO-k maradnak, de a +TÉO elveszik, mert csak 1 támadásra volt érvényes
      //*************************************************************************************************************************** */

      // kétkezes harc bejelölésével az első kattintásra a twoWeaponAttackWasUsedThisRound változó igaz lesz, ezért ez alapján módosíthatjuk a 2.dobás körülményeit,
      // mintha az lenne a másik kéz

      if (numberOfClicksAtTwoWeaponAttack == 2 && twoWeaponAttackWasUsedThisRound == true) {
        weapons.disabled = true;
        twoWeaponAttackRadioButton.disabled = false;
        weapons.value = mainHandWeaponWhenTwoWeaponAttackIsUsed;

        numberOfClicksAtTwoWeaponAttack = 0;
        if (combinationWasUsedThisRound == true) {
          totalActionCostOfAttackSetter(+1);
        }
      }

      if (firstAttackInRoundSpent == true && numberOfClicksAtTwoWeaponAttack == 1) {
        weapons.disabled = false;
        chosenWeapon.innerText = "Kétk.harc másik kéz:";
        twoWeaponAttackRadioButton.disabled = true;

        mainHandWeaponWhenTwoWeaponAttackIsUsed = currentlySelectedWeapon.w_name;
        if (combinationWasUsedThisRound == true) {
          totalActionCostOfAttackSetter(-1);
        }
      }

      setTimeout(() => {
        if (parseInt(numberOfActions.innerText) < totalActionCostOfAttack) {
          attackRollButton.disabled = true;
        }
      }, 200);

      if (findWeakSpotOn == true) {
        findWeakSpotModifierNullifier();
        findWeakSpotOnToFalse();
        findWeakSpotButton.disabled = false;
      }
      if (attackOfOpportunityOn == true) {
        attackOfOpportunityOnSetToFalse();
        combatStatRefresher();
        attackOfOpportunityButton.disabled = false;
        if (firstAttackIsAttackOfOpportunity == true) {
          firstAttackInRoundSpent = false;
          firstAttackIsAttackOfOpportunitySetToFalse();
        }
      }
      if (attackOfOpportunityOn == false) {
        for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
          if (arrayOfAllComplexManeuvers[i].checked == true) {
            arrayOfAllComplexManeuvers[i].checked = false;
            totalActionCostOfAttackSetter(-arrayOfAllComplexManeuvers[i].parentElement.value);
          }
        }
      }
      if (numberOfClicksAtTwoWeaponAttack == 1) {
        twoWeaponAttackRadioButton.checked = true;
      }

      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true && currentlySelectedWeapon.w_type != "MÁGIA" && spellNeedsAimRoll == false) {
        currentlySelectedWeapon.readyToFireOrThrow = false;
        attackRollButton.disabled = true;
        reloadButton.disabled = false;
        if (currentlySelectedWeapon.w_type == "VET" || currentlySelectedWeapon.w_type == "NYD" || currentlySelectedWeapon.w_type == "PD") {
          blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime} CS`);
        } else {
          blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime} CS`);
        }
        // ammoAmountInput.value--
      }
    }
    if (charAtk.value < 0) {
      charAtkSum.innerText = rollResult.innerText;
      charAtkSum.animate([{ color: "white" }, { color: "black" }], 200);
    } else {
      charAtkSum.innerText = parseFloat(rollResult.innerText) + parseFloat(charAtk.value);
      charAtkSum.animate([{ color: "white" }, { color: "black" }], 200);
    }

    if (thisAttackWasWithCharge) {
      thisAttackWasWithCharge = false;
    }

    if (firstAttackIsSpellThatNeedsAimRoll) {
      firstAttackInRoundSpent = false;
      if (numberOfChainLightningCharges == 0) {
        firstAttackIsSpellThatNeedsAimRollSetToFalse();
      }
    }
    if (numberOfChainLightningCharges == 0) {
      spellNeedsAimRollSetToFalse();
    }
    if (numberOfChainLightningCharges > 0) {
      numberOfChainLightningCharges--;
    }
    combatStatRefresher();
    console.log("totalActionCostOfAttack", totalActionCostOfAttack);
    if (weaponBeforeCasting && !weaponBeforeCasting.readyToFireOrThrow) {
      // vizsgálat a távolharci fegyverre, ha nem volt újratöltve, amikor a varázslat megkezdődött
      reloadButton.disabled = false;
      if (weaponBeforeCasting.w_type == "VET" || weaponBeforeCasting.w_type == "NYD" || weaponBeforeCasting.w_type == "PD") {
        blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${weaponBeforeCasting.reloadTime} CS`);
      } else {
        blinkingText(warningWindow, `Újra kell töltened ${weaponBeforeCasting.reloadTime} CS`);
      }
      // ammoAmountInput.value--
    }
    updateCharacterSocketData();
  }

  return (
    <>
      <Head>
        <title>TTK Rolldice</title>
      </Head>

      <main className="main">
        <audio id="rollDiceSound" src="/rollDiceSound.mp3"></audio>
        <audio id="doubleOneRoll" src="/doubleOneRoll.mp3"></audio>
        <audio id="doubleZeroRoll" src="/doubleZeroRoll.mp3"></audio>
        <div id="atkRollWrapper">
          <div id="soundToggleWrapper">
            Hang Be/Ki
            <input id="soundToggleCheckbox" type="checkbox" />
          </div>
          <div className={styles.resultContainer}>
            <div className="inText">TÉO/CÉO a dobásból:</div>
            <div id="rollResult" className="inNumber"></div>
            <div className="damage inText">Sebzés:</div>
            <div id="damageResult" className="inNumber"></div>
            <div className="hitCheck">A találat helye:</div>
            <div id="bodyPart" className={styles.bodyPart}></div>
          </div>
          <div id="charInfoWrapper">
            <div id="charName"></div>
            <div id="charLevel"></div>
            <div id="charRace"></div>
            <div id="charClass"></div>
          </div>
          <div id="charMovementWrapper">
            <span id="maxMove"></span>
            <span id="movePerAction"></span>
          </div>
          <div className={styles.weaponsContainer}>
            <label htmlFor="weapons" id="chosenWeapon">
              Választott fegyver:
            </label>
            <select id="weapons" name="weapons" onChange={handleWeaponOrShieldChange}>
              {allWeapons.map((e) => {
                return <option key={e.w_id}>{e.w_name}</option>;
              })}
            </select>
            <label htmlFor="charAtk" id="charAtkLabel">
              Karakter TÉO/CÉO
            </label>
            <input type="text" name="charAtk" id="charAtk" />
            <label htmlFor="charDef" id="charDefLabel">
              Karakter VÉO
            </label>
            <input type="text" name="charDef" id="charDef" />
            <label htmlFor="charDefWithEvasion" id="charDefWithEvasionLabel">
              Karakter VÉO (kitérés)
            </label>
            <input type="text" name="charDefWithEvasion" id="charDefWithEvasion" />
            <label htmlFor="charDefWithParry" id="charDefWithParryLabel">
              Karakter VÉO (hárítás)
            </label>
            <input type="text" name="charDefWithParry" id="charDefWithParry" />
            <label htmlFor="offHand" id="chosenOffHand">
              Választott hárítófegyver:
            </label>
            <select id="offHand" name="offHand" onChange={handleWeaponOrShieldChange}>
              {allWeapons
                .filter((e) => e.w_type == "PAJ")
                .map((e) => {
                  return <option key={e.w_id}>{e.w_name}</option>;
                })}
            </select>
            <label htmlFor="anyOtherHmoModifier" id="anyOtherHmoModifierLabel">
              Egyéb +/- HMO:
            </label>
            <input type="number" step={0.5} name="anyOtherHmoModifier" id="anyOtherHmoModifier" onChange={combatStatRefresher} disabled={true} defaultValue={0} />
          </div>
          <div id="rollResultWrapper">
            <label htmlFor="lightDiceResultSelect" id="lightDiceResult">
              Világos kocka:
            </label>
            <select id="lightDiceResultSelect" name="" disabled={true}>
              {rollOptions.map((e) => {
                return <option key={e}>{e}</option>;
              })}
            </select>
            <label htmlFor="darkDiceResultSelect" id="darkDiceResult">
              Sötét kocka:
            </label>
            <select id="darkDiceResultSelect" name="" disabled={true}>
              {rollOptions.map((e) => {
                return <option key={e}>{e}</option>;
              })}
            </select>
          </div>
          <div id="modifiersWrapper">
            <div id="totalModifierForNextAttackLabel">Köv.tám. HMO mód.:</div>

            <div id="totalModifierForNextAttack">0</div>
          </div>
          <div id="bodyPartImg"></div>
          <AimedAttack />
          <button type="" id="attackRollButton" className={styles.attackRollButton} onClick={handleClickOnAttackRollButton}>
            Támadó / Célzó dobás
          </button>
          <div id="warningWindow"></div>
          <span id="castBar"></span>
          <span id="castBarFlashEffect"></span>
          <div className={styles.charSumAtkContainer}>
            <div className="result inText" id="charAtkSumText">
              Össz TÉO/CÉO
            </div>
            <div id="charAtkSum" className={"result inNumber"}></div>
            <div id="specialEffectText" className="result inText">
              Különleges hatás:
            </div>
            <div id="specialEffect" className="result inText">
              nincs
            </div>
          </div>
          <K10RollAndSpellDamageRoll />
          <ArmorDetails />
          <CharacterDetails {...socket} />
          <PsiDisciplines />
          <ActionList />
          <span id="listOfCurrentlyActiveBuffsLabel">Jelenleg aktív diszciplínák és varázslatok</span>
        </div>
        {/* <img id="dividingLine" src="/divider.png"></img> */}
        <SkillCheck />
        <ResistancesAptitudesRaceMofifiers />
        <div id="welcomeWindow">
          <div id="welcomeText">
            Üdvözöllek kalandozó! <br />
            <br />
            A ttk roll dice alkalmazás célja, hogy megkönnyítse a dolgodat a TTK rendszerében, mely elsőre bonyolultnak tűnhet. <br />
            <br />
            - Segít a képzettség- és tulajdonság próbadobásokban, ahol választhatsz stressz- és normálpróba között is. <br />
            - A támadódobás során értelmezi a dobott értékeket és kiszámolja a fegyver sebzését, figyelembe véve a karakteredre vonatkozó minden statisztikát.
            <br />
            - Folyamatosan képes nyomon követni a harc történéseit, így a kezdeményező dobás után már nem hajigálhatod csak úgy a támadókat. Továbbá nem válthatsz fegyvert sem, csak ha "Fegyverváltás"
            akciót használsz, vagy nem lőhetsz/dobhatsz el újra távolsági fegyvert, amíg nem töltesz újra/veszel elő újat.
            <br />
            - A varázslásra kattintva a legtöbb Tapasztalati mágiát már képes kezelni
            <br />
            <a target="_blank" href="https://magustk.hu/0.92/varazsmuhely" rel="noopener noreferrer">
              https://magustk.hu/0.92/varazsmuhely
            </a>
            <br />
            <br />
            Tervezem a jövőben oktató videók és információs ablakok formájában gyorsítani és könnyíteni a használatot. <br />
            <br />
            Ha bármilyen hibát vagy helytelen működést észlelnél, kérlek ne habozz azt jelezni. Discordon a Tiltott törvénykönyv csatornáján naizred#1586 néven megtalálsz.
            <br />
            <br />
            Az alkalmazás csak a TTK karakteralkotójából exportált, .txt kiterjesztésű karakterrel működik jól, akinek nevet is kell, hogy adjál az alkotás során. <br />
            <a target="_blank" href="https://magustk.hu/0.92/karakteralkoto" rel="noopener noreferrer">
              https://magustk.hu/0.92/karakteralkoto
            </a>{" "}
            <br />
            <br />
            Szerencsés dobásokat és jó használatot a TTK Rolldice apphoz!
            <br />
          </div>
          <div className="fileInputWrapper">
            <button className="customFileButton">Karakter importálása</button>
            <input type="file" id="inputFile" accept=".txt" onChange={handleFileRead} />
          </div>
        </div>
      </main>
    </>
  );
}
