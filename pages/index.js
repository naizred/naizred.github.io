import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import path from "path";
import weaponStats from "../json/weapons.json"
import CharacterDetails, { initRolled } from "../Components/CharacterDetails";
import ActionList, {
  assassinationToFalse,
  attackOfOpportunityOn,
  attackOfOpportunityOnSetToFalse,
  charAtkValueSave,
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
} from "../Components/ActionsList";
import {
  actionsSpentSinceLastCastAdderCheckerAndNullifier,
  rollButtonWasDisabledBeforeSpellCast,
  spellCastingFailure,
  numberOfActionsSpentOnCastingCurrentSpellNullifier,
  spellIsBeingCast,
} from "../Components/Spells";
import ArmorDetails, {
  equippedOrNotSetToManual,
} from "../Components/ArmorDetails";
import K10RollAndSpellDamageRoll, {
  multipleDiceRoll,
} from "../Components/K10RollAndSpellDamageRoll";
import { checkWhereItIsWorn } from "../Components/ArmorDetails";
import SkillCheck, {
  handleSkillCheck,
  evaluateSkillOrAttributeCheckBase,
} from "../Components/SkillCheck";
import PsiDisciplines, {
  specialAtkModifierFromPsiAssault,
  availableNumberOfAttacksFromPsiAssault,
  bonusDamageFromChiCombat,
  activeBuffsArray,
  buffRemoverFromActiveBuffArrayAndTextList,
  chiCombatAtkDefModifier,
  bonusDamageFromChiCombatNullifier,
  chiCombatAtkDefModifierNullifier,
  fpShieldSetter,
  innerTimeNegativeModifier,
} from "../Components/PsiDisciplines";
import AimedAttack from "../Components/AimedAttack";
import { bodyParts } from "../Components/AimedAttack";
import Link from "next/link";
var MersenneTwister = require("mersenne-twister");
export var generator = new MersenneTwister();


export let returnedData;
let parsedDataSortedByActionsAndInit
export async function fetchCharacterDataForAdventureMaster(gameId) {
  await fetch(`../api/getCharsByGameId/${gameId}`)
    .then((response) => {
      return response.json();
    })
    .then((parsedData) => {
      if (!parsedData) {
        return;
      }
      // sorba rendezem az array of objectet charId szerint azért, hogy ne váltakozzon
      // a sorrend mindig, amikor valaki valamilyen dobást hajt végre
      //const parsedDataSortedByActionsAndInit = parsedData.sort((a,b)=>parseInt(b.numberOfActions) - parseInt(a.numberOfActions))
      //console.log(parsedData.sort((a,b)=>a.charId - b.charId));

      let currentCharNameNodes = document.querySelectorAll(
        "input#characterName"
      );
      let currentFpNodes = document.querySelectorAll("input#currentFp");
      let currentEpNodes = document.querySelectorAll("input#currentEp");
      let currentPpNodes = document.querySelectorAll("input#currentPp");
      let currentMpNodes = document.querySelectorAll("input#currentMp");
      let currentLpNodes = document.querySelectorAll("input#currentLp");
      let atkRollResultNodes = document.querySelectorAll("input#atkRollResult");
      let skillCheckResultDmNodes = document.querySelectorAll(
        "input#skillCheckResultDm"
      );
      let atkRollDiceNodes = document.querySelectorAll("input#atkRollDice");
      let skillCheckDiceNodes = document.querySelectorAll(
        "input#skillCheckDice"
      );
      let numberOfActionsAllPlayers = document.querySelectorAll(
        "div#numberOfActionsAllPlayers"
      );
      let initiativeWithRollNodes = document.querySelectorAll(
        "div#initiativeWithRoll"
      );
      let characterNameForInitNodes = document.querySelectorAll(
        "input#characterNameForInit"
      );

      // skillCheckResult, skillCheckDice
console.log(parsedData)
      for (let i = 0; i < parsedData.length; i++) {
        //először karakter Id szerint sorba rendezzük
        parsedData.sort((a,b)=>a.charId - b.charId)
        currentCharNameNodes[i].value = parsedData[i].charName;        
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
        parsedData.sort((a,b)=>b.initiativeWithRoll - a.initiativeWithRoll)
        parsedData.sort((a,b)=>b.numberOfActions - a.numberOfActions)
        characterNameForInitNodes[i].value = parsedData[i].charName;
        numberOfActionsAllPlayers[i].innerText = `CS: ${parsedData[i].numberOfActions}`;
        initiativeWithRollNodes[i].innerText = `CSA: ${parsedData[i].initiativeWithRoll}`;
      }
    });
}

export const getStaticProps = async () => {
  const fs = require("fs");
  const jsonDirectory = path.join(process.cwd(), "json");
  let allSkills = JSON.parse(
    fs.readFileSync(jsonDirectory + "/allSkills.json", "utf8")
  );
  let armors = JSON.parse(
    fs.readFileSync(jsonDirectory + "/armors.json", "utf8")
  );
  let chars = JSON.parse(
    fs.readFileSync(jsonDirectory + "/chars.json", "utf8")
  );
  let gods = JSON.parse(fs.readFileSync(jsonDirectory + "/gods.json", "utf8"));
  let psiDisciplines = JSON.parse(
    fs.readFileSync(jsonDirectory + "/psiDisciplines.json", "utf8")
  );
  let races = JSON.parse(
    fs.readFileSync(jsonDirectory + "/races.json", "utf8")
  );
  // let weapons = JSON.parse(
  //   fs.readFileSync(jsonDirectory + "/weapons.json", "utf8")
  // );
  let spellAttributes = JSON.parse(
    fs.readFileSync(jsonDirectory + "/spellAttributes.json", "utf8")
  );
  let spellsAspDescript = JSON.parse(
    fs.readFileSync(jsonDirectory + "/spellsAspDescript.json", "utf8")
  );
  // let allSpells = JSON.parse(
  //   fs.readFileSync(jsonDirectory + "/allSpells.json", "utf8")
  // );
  return {
    props: {
      allSkills,
      armors,
      chars,
      gods,
      psiDisciplines,
      races,
      // weapons,
      spellAttributes,
      // allSpells,
      spellsAspDescript,
    },
  };
};
export async function fetchCharacterData(currentCharName) {
  await fetch(`../api/characterStatsThatChange/${currentCharName}`)
    .then((response) => {
      return response.json();
    })
    .then((parsedData) => {
      if (!parsedData) {
        return;
      }
      if(parsedData.gameId)
      {
      gameIdLabel.innerText = `Játékazonosító: "${parsedData.gameId}"`
      } else {
        gameIdLabel.innerText = "Játékazonosító: nincs"
      }
      currentFp.value = parsedData.currentFp;
      currentEp.value = parsedData.currentEp;
      currentPp.value = parsedData.currentPp;
      currentMp.value = parsedData.currentMp;
      currentLp.value = parsedData.currentLp;
      let activeBuffsCounter = parseInt(parsedData.activeBuffs.charAt(0));
      let activeBuffsStringArray = parsedData.activeBuffs
        .slice(1)
        .split("|", activeBuffsCounter);
      for (let i = 0; i < activeBuffsStringArray.length; i++) {
        allActiveBuffs[i].innerText = activeBuffsStringArray[i];
     
          
          //allActiveBuffs[i].parentElement.lastChild.value = activeBuffsStringArray[i];
          activeBuffsArray.push(activeBuffsStringArray[i]);
        
        if (
          activeBuffsStringArray[i].includes("Fájdalomtűrés") &&
          !activeBuffsArray.includes("Fájdalomtűrés")
        ) {
          //**************************************************** */
          //pontosan a 16. karaktertől slice, így a parseInt megtalálja az fp pajzs mennyiségét
          fpShieldSetter(parseInt(activeBuffsStringArray[i].slice(16)));
        }
      }
    });
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
      if(parsedData.gameId)
      {
      gameIdLabel.innerText = `Játékazonosító: "${parsedData.gameId}"`
      } else {
        gameIdLabel.innerText = "Játékazonosító: nincs"
      } 
    }
  )
}
// ki kellett importálni az alap CÉ-t a varázsláshoz
export let baseAimWithTeoCalculator = 0;
let weaponStyles = [
  { "Ököl": ["Birkózás", "Belharc"] },
  { "RP": ["Belharc", "Birkózás"] },
  { "HP": ["Lefegyverzés", "Kínokozás"] },
  { "ÓP": ["Fegyvertörés", "Pusztítás"] },
  { "ZÚZ": ["Kínokozás", "Taszítás"] },
  { "HAS": ["Pusztítás", "Kínokozás"] },
  { "SZÁ": ["Távoltartás", "Lefegyverzés"] },
  { "LOV": ["Taszítás", "Távoltartás"] },
  { "PAJ": ["Taszítás", "Belharc"] }
]
let weaponStyleBonusesByLevelOfProficiency = [
  {"Belharc": ["-0,5 (-1) HMO", "-1 (-2) HMO", "-1,5 (-3) HMO", "-2 (-4) HMO", "-2,5 (-5) HMO", "-3 (-6) HMO"]},
  {"Birkózás": ["0,5 Ép +0,5 VÉO", "1 Ép +1 VÉO", "2 Ép +1,5 VÉO", "3 Ép +2 VÉO", "4 Ép +2,5 VÉO", "5 Ép +3 VÉO"]},
  {"Fegyvertörés": ["képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba"]},
  {"Kínokozás": ["+1Fp/2Ép", "+1Fp/1Ép", "+2Fp/1Ép", "+3Fp/1Ép", "+4Fp/1Ép", "+5Fp/1Ép"]},
  {"Lefegyverzés": ["képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba"]},
  {"Pusztítás": ["+1Ép/5Ép", "+1Ép/4Ép", "+1Ép/3Ép", "+1Ép/2Ép", "+1Ép/1Ép", "+2Ép/1Ép"]},
  {"Taszítás": ["spec.","spec.","spec.","spec.","spec.","spec."]},
  {"Távoltartás": ["képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba", "képzettségpróba"]}
]

export let maneuverAttachedToWeaponType
let filteredArrayByWeaponSkills
let filteredArrayByCurrentlySelectedWeaponType
// erre azon fegyverek miatt van szükség, amik több típusba is beletartoznak
let weaponTypeAndLevelAndStyleArray = []

function checkAndReturnProficiencyLevelInWeapon(weaponType){
for (let i = 0; i < filteredArrayByWeaponSkills.length; i++) {
  if (weaponType == filteredArrayByWeaponSkills[i].subSkill) {
    return filteredArrayByWeaponSkills[i].level
  }
}
return 0
}

function checkAndModifyCurrentWeaponStyles(weaponType){
  for (let i = 0; i < weaponStyles.length; i++) {
  let weaponTypeFromWeaponsThatHaveManeuvers = Object.keys(weaponStyles[i])
  // a fegyvertípus alap manőverei (stílusai)
  maneuverAttachedToWeaponType = Object.values(weaponStyles[i])

  if (weaponTypeFromWeaponsThatHaveManeuvers == weaponType) {
   for (let k = 0; k < selectedWeaponStyles.length; k++) {
    if (selectedWeaponStyles[k][0] == weaponType &&
      !maneuverAttachedToWeaponType[0].includes(...selectedWeaponStyles[k][1]) &&
      checkAndReturnProficiencyLevelInWeapon(weaponType) >= 3 // ez a feltétel azért szükséges, mert lehet, mert ha valaki Kf-ről visszavesz egy fegyvert Af-re, akkor a Kf-en választott extra stílus nem törlődik
    ) {
    maneuverAttachedToWeaponType[0].push(...selectedWeaponStyles[k][1])
  }
}
// speciális eset, amikor csak If-en vagyunk képzettek, ilyenkor csak a fegyver 1.stílusát lehet If-en alkalmazni
if (checkAndReturnProficiencyLevelInWeapon(weaponType) == 1) {
  maneuverAttachedToWeaponType[0] = [maneuverAttachedToWeaponType[0][0]]
}
   // védelem, ha valaki nem választott stílus valamelyik fokon
  for (let l = 0; l < maneuverAttachedToWeaponType[0].length; l++) {
    if (maneuverAttachedToWeaponType[0][l] == null) {
      maneuverAttachedToWeaponType[0].splice(l,1)
            }
          }
          break
        }
      }
    }
// visszaad egy array-t a manőverhez (stílushoz) tartozó fegyvertípussal, amiben képzett a karakter, és a képzettség fokát.
export function handleWhenWeaponHasMultipleTypes(weaponType, usedStyle){
  let highestProficienyForWeaponStyle = 0
  let weaponTypeForhighestProficienyForWeaponStyle = ""
  let currentWeaponMultipleTypeArray = weaponType.split("/")
  for (let i = 0; i < weaponTypeAndLevelAndStyleArray.length; i++) {
    for (let j = 0; j < currentWeaponMultipleTypeArray.length; j++) {
      let currentTypeFromWeaponTypeAndLevelAndStyleArray = weaponTypeAndLevelAndStyleArray[i][0]
      if(currentTypeFromWeaponTypeAndLevelAndStyleArray == currentWeaponMultipleTypeArray[j]){
          for (let k = 0; k < weaponTypeAndLevelAndStyleArray[i][2].length; k++) {
            let usedStyleFromWeaponTypeAndLevelAndStyleArray = weaponTypeAndLevelAndStyleArray[i][2][k]
            if (usedStyleFromWeaponTypeAndLevelAndStyleArray == usedStyle && weaponTypeAndLevelAndStyleArray[i][1]>=highestProficienyForWeaponStyle) {
              // az 1es index a képzettség foka
              highestProficienyForWeaponStyle = weaponTypeAndLevelAndStyleArray[i][1]
              weaponTypeForhighestProficienyForWeaponStyle = weaponTypeAndLevelAndStyleArray[i][0]
            }
          }
      }
    }
  }
  return [weaponTypeForhighestProficienyForWeaponStyle, highestProficienyForWeaponStyle]
}

export function checkWhatBonusYouGetForSelectedManeuver(selectedManeuverValue, professionLevelIndex){
  for (let i = 0; i < weaponStyleBonusesByLevelOfProficiency.length; i++) {
    let weaponStyleName = Object.keys(weaponStyleBonusesByLevelOfProficiency[i])
    // a fegyvertípus alap manőverei (stílusai)
    let weaponsStyleBonusArray = Object.values(weaponStyleBonusesByLevelOfProficiency[i])
  
    if (weaponStyleName == selectedManeuverValue && professionLevelIndex != 0) {
      blinkingText(warningWindow, `"${selectedManeuverValue}" stílusból várható módosítók: \n${weaponsStyleBonusArray[0][professionLevelIndex]}` )
      break
    } 
    if(weaponStyleName == selectedManeuverValue && professionLevelIndex == 0) {
      blinkingText(warningWindow, `"${selectedManeuverValue}" stílusból várható módosítók: \n${weaponsStyleBonusArray[0][0]}` )
      break
    }
  }
  }

export function setSkillForManeuver (){
if (initRolled) {
  let selectAllSkillOptions = document.querySelectorAll(
    "select#skills option"
  );
  weaponTypeAndLevelAndStyleArray
  for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
    if (arrayOfAllComplexManeuvers[i].checked && 
      arrayOfAllComplexManeuvers[i].value !="Roham" &&
      arrayOfAllComplexManeuvers[i].value !="Orvtámadás" &&
      arrayOfAllComplexManeuvers[i].value !="Kétkezes harc"
    ) {
      for (let j = 0; j < selectAllSkillOptions.length; j++) {
        let weaponTypeAttachedToCurrentlySelectedManeuver = handleWhenWeaponHasMultipleTypes(currentlySelectedWeapon.w_type, arrayOfAllComplexManeuvers[i].value)
        console.log(weaponTypeAttachedToCurrentlySelectedManeuver)
        if (selectAllSkillOptions[j].value.includes(weaponTypeAttachedToCurrentlySelectedManeuver[0]) && 
        weaponTypeAttachedToCurrentlySelectedManeuver[0] != ""
      ) {
          skills.value = selectAllSkillOptions[j].value;
          break;
        }
        skills.value = 0;     
      }
      evaluateSkillOrAttributeCheckBase();
      break
    }
  }
}
}

let selectedWeaponStyles = []
let professionLevel;
export let allActiveBuffs = [];
export let mgtCompensation = 0;
export let rollOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export let filteredArrayIfHasExtraReaction;
export let filteredArrayIfHasAnyAffinity;
export let filteredArrayForNameOfHighestMagicalSkill;
export let filteredArrayIfHasAnyMagicSkill;
export let currentGodWorshippedByPlayer;
export let filteredArrayIfHasManaFlow;
export let filteredArrayIfHasManaController
export let filteredArrayIfHasPsi;
export let filteredArrayIfHasTwoWeaponAttack;
export let filteredArrayIfHasAssassination;
export const specialCases1 = [2, 3, 4];
export const specialCases2 = [5, 6, 7];
export const specialCases3 = [8, 9];
export let specialModifiers = [
  "Veszítesz 3 cselekedetet",
  "Aki ellen dobták, veszít 1 cselekedetet",
  "Kapsz 1 cselekedetet",
  "Kapsz 2 cselekedetet",
  "Kapsz 3 cselekedetet",
];
export let fileFirstLoaded = true;
export let originalDarkDice = 0;
export let originalLightDice = 0;
export let twoWeaponAttackModifiers = [-3, -2, -1, 0, 1, 2];
export let twoWeaponAttackModifiersIndex = 0;
export let combinationModifiers = [-4, -3, -2, -1, 0, 1];
export let combinationModifiersIndex = 0;
let filteredArrayIfHasParry;
let mainHandWeaponWhenTwoWeaponAttackIsUsed;
let bonusDamageFromAssassination = 0;
export let allMagicSubskillsObject = {};
export let arrayOfAllComplexManeuvers;
export let currentlySelectedWeapon;
export function currentlySelectedWeaponChanger(props, newWeapon) {
  currentlySelectedWeapon = weaponStats.find(
    (name) => name.w_name === `${newWeapon}`
  );
}
export let weaponsOptions;
export function toggleAllallActionBarButtonsExceptInitRollDisplay(
  display = "none"
) {
  initiativeLightDiceLabel.style.display = display
  initiativeDarkDiceLabel.style.display = display
  const allActionBarButtons = document.querySelectorAll(
    "div#actionsWrapper button"
  );
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

export let firstAttackInRound = false;
export function setFirstAttackInRoundToFalse() {
  firstAttackInRound = false;
}
export let firstAttackInRoundSetToFalseBySpellNeedsAimRoll = false;
export function firstAttackInRoundSetToFalseBySpellNeedsAimRollToFalse() {
  firstAttackInRoundSetToFalseBySpellNeedsAimRoll = false;
}
export let rangedWeaponsArray = [
  "ÍJ",
  "VET",
  "NYD",
  "PD",
  "SZÍ",
  "Fúvócső",
  "MÁGIA",
  "Tűvető",
];
export let reloadIsNeeded = false;
export function reloadIsNeededSetToFalse() {
  reloadIsNeeded = false;
}
export function reloadIsNeededSetToTrue() {
  reloadIsNeeded = true;
}
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

//********************************************* */
// --- itt kezdődik az oldal maga
//********************************************************* */
export default function Home(props) {
  //egyedi rendező function kellett, mert a sort nem rendezte a fegyverek nevét valamiért. Valószínűleg a karakterkódolással van gondja a fájl beolvasása után
  let alphabets = [
    "A",
    "Á",
    "B",
    "C",
    "D",
    "E",
    "É",
    "F",
    "G",
    "H",
    "I",
    "Í",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "Ó",
    "Ö",
    "Ő",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "Ú",
    "Ü",
    "Ű",
    "V",
    "W",
    "X",
    "Z",
  ];

  let aChar;
  let bChar;
  function OrderFunc() {
    weaponStats.sort(function (a, b) {
      return CharCompare(a.w_name, b.w_name, 0);
    });
  }
  function CharCompare(a, b, index) {
    aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
    bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
    if (aChar != bChar) return aChar - bChar;
    else return CharCompare(a, b, index + 1);
  }

  //egyedi sorba rendező function hívás
  OrderFunc(weaponStats);
  let damageOfFists = "1k10";
  let destroyerLevel;
  let schoolsOfMagic = [
    "Magas Mágia",
    "Bárdmágia",
    "Boszorkánymágia",
    "Boszorkánymesteri mágia",
    "Tűzvarázslói mágia",
    "Szakrális mágia",
  ];
  let schoolsOfMagicSubClass = [
    "Magas mágiaforma",
    "Bárd mágiaforma",
    "Boszorkány mágiaforma",
    "Boszorkánymester mágiaforma",
    "Tűzvarázsló mágiaforma",
    "Kisebb fohászok",
    "Nagyobb fohászok",
  ];
  let attributeIndexesForSchoolsOfMagic = [6, 5, 8, 7, 7, 5];
  let skillLevelsMeaning = ["If", "Af", "Kf", "Mf", "Lf"];

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
      //lightDice = 1;
      //darkDice = 1;
      /* -- ez a felső két sor a dobások tesztelésére van  */
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
      if (initRolled == true && 
        disarmRadioButton.checked == false &&
        weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
      }
    } else if (lightDice == darkDice && specialCases3.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[3];
      if (initRolled == true && 
        disarmRadioButton.checked == false &&
        weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 2;
      }
    } else if (lightDice == darkDice && darkDice == 1) {
      specialEffect.innerText = specialModifiers[0];
      if (initRolled == true && 
        disarmRadioButton.checked == false &&
        weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 3;
      }
    } else if (lightDice == darkDice && darkDice == 10) {
      specialEffect.innerText = specialModifiers[4];
      if (initRolled == true && 
        disarmRadioButton.checked == false &&
        weaponBreakRadioButton.checked == false) {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 3;
      }
    }
    console.log(
      "Sötét eredeti:",
      originalDarkDice,
      "Világos:",
      originalLightDice
    );
    if (strBonus == true) {
      if (Math.floor(parseInt(Erő.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Erő.innerText) / 2);
        darkDiceWasChangedToHalfOfStr = true;
      }
    }
    if (
      currentlySelectedWeapon.assassinWeapon == true &&
      assassinationRadioButton.checked == true
    ) {
      if (Math.floor(parseInt(Ügy.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Ügy.innerText) / 2);
      }
    }

    if (
      numberOfClicksForAttacksForPsiAssault <=
      availableNumberOfAttacksFromPsiAssault
    ) {
      result += specialAtkModifierFromPsiAssault;
      if (result >= 10) {
        result = 10;
      }
    } else if (
      numberOfClicksForAttacksForPsiAssault >
      availableNumberOfAttacksFromPsiAssault
    ) {
      buffRemoverFromActiveBuffArrayAndTextList("Pszi Roham");
      numberOfClicksForAttacksForPsiAssault = 0;
    }
    return result;
  }

  //-------------- Megnézi a sebzéskódot, és számol sebzést ------------

  async function damageEvaluator() {
    console.log("Fegyver típus:", currentlySelectedWeapon.w_type);
    console.log("Fegyver sebzéskód:", currentlySelectedWeapon.w_damage);
    console.log("Erősebzés?:", currentlySelectedWeapon.strBonusDmg);
    // if (firstAttackInRound == false) {
    //   return;
    // }
    if (!activeBuffsArray.includes("Chi-harc")) {
      bonusDamageFromChiCombatNullifier();
    }
    if (assassinationRadioButton.checked == true && filteredArrayIfHasAssassination.length !=0) {
      bonusDamageFromAssassination = filteredArrayIfHasAssassination[0].level;
    }
    if (assassinationRadioButton.checked == false) {
      bonusDamageFromAssassination = 0;
    }

    // ha nem történt kezdeményező dobás, akkor csak 1 támadásig érvényes a chi harc
    if (initRolled == false && activeBuffsArray.includes("Chi-harc")) {
      buffRemoverFromActiveBuffArrayAndTextList("Chi-harc");
      hmoModifier(-chiCombatAtkDefModifier);
      chiCombatAtkDefModifierNullifier();
    }

    //ez a két változó csak az ökölharc miatt kell:
    //professionLevel és currentWeaponDamage
    handleFileRead()
    let currentWeaponDamage = currentlySelectedWeapon.w_damage;
    if (currentlySelectedWeapon.w_type == "Ököl") {
      currentWeaponDamage = damageOfFists;
      professionLevel = Math.ceil(professionLevel / 2);
      if (currentlySelectedWeapon.w_name == "Vasököl") {
        professionLevel += 1;
      }
    console.log("ököl seb:", currentWeaponDamage, "+", professionLevel)
    }
    if (currentWeaponDamage === "2k10") {
      damageResult.innerText =
        originalDarkDice +
        originalLightDice +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "2k5") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) +
        Math.ceil(originalLightDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "2k5+1") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) +
        Math.ceil(originalLightDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination +
        1;
    } else if (currentWeaponDamage === "2k5+2") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) +
        Math.ceil(originalLightDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination +
        2;
    } else if (currentWeaponDamage === "1k5") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "1k5+1") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination +
        1;
    } else if (currentWeaponDamage === "1k5+2") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination +
        2;
    } else if (currentWeaponDamage === "3k5") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 2) * 2 +
        Math.ceil(originalLightDice / 2) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "1k10") {
      damageResult.innerText =
        originalDarkDice +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "1k10+1") {
      damageResult.innerText =
        originalDarkDice +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination +
        1;
    } else if (currentWeaponDamage === "1k2") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 5) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    } else if (currentWeaponDamage === "2k2") {
      damageResult.innerText =
        Math.ceil(originalDarkDice / 5) +
        Math.ceil(originalLightDice / 5) +
        parseInt(destroyerLevel) +
        parseInt(professionLevel) +
        bonusDamageFromChiCombat +
        bonusDamageFromAssassination;
    }
    if (
      currentlySelectedWeapon.w_name == "Fúvócső" ||
      currentlySelectedWeapon.w_name == "Tűvető"
    ) {
      damageResult.innerText = 1;
    }
    if (
      weapons.value == "Célzott mágia" ||
      firstAttackInRoundSetToFalseBySpellNeedsAimRoll == true
    ) {
      let spellDamage = 0;

      spellDamage = multipleDiceRoll(
        originalDarkDice,
        originalLightDice,
        0,
        parseInt(numberOfDiceInput.value)
      );

      damageResult.innerText = spellDamage[3];
      firstAccumulatedDiceResultSelect.value = spellDamage[0];
      secondAccumulatedDiceResultSelect.value = spellDamage[1];
      thirdAccumulatedDiceResultSelect.value = spellDamage[2];
    }
    // Ezekben a zárójelen belüli esetekben nincs ijász szabály
    if (
      originalDarkDice == 10 &&
      checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) &&
      currentlySelectedWeapon.w_name != "Fúvócső" &&
      currentlySelectedWeapon.w_name != "Célzott mágia" &&
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
            currentRandomArcheryBonusRoll = Math.ceil(
              currentRandomArcheryBonusRoll / 2
            );
          } else if (currentlySelectedWeapon.w_damage.includes("k2")) {
            currentRandomArcheryBonusRoll = Math.ceil(
              currentRandomArcheryBonusRoll / 5
            );
          }
          archeryBonusDmg += currentRandomArcheryBonusRoll;
          break;
        }
      }
      damageResult.innerText =
        parseInt(damageResult.innerText) + archeryBonusDmg;
      damageResult.animate([{ color: "white" }, { color: "black" }], 200);

      console.log("íjász szabály:", archeryBonusDmg);
    }

    console.log(
      "Sötét erősebzés:",
      originalDarkDice,
      "Világos:",
      originalLightDice
    );
    darkDiceWasChangedToHalfOfStr = false;
    damageResult.animate([{ color: "white" }, { color: "black" }], 200);
  }

  function handleWeaponOrShieldChange() {
    handleFileRead();

    let allAimedBodyParts = document.querySelectorAll(
      "ul#aimedAttackList li input"
    );
    for (let i = 0; i < allAimedBodyParts.length; i++) {
      allAimedBodyParts[i].checked = false;
    }
    allResultsCleaner();

    if (initRolled == true) {
      weapons.disabled = true;
      offHand.disabled = true;
      weaponChangeButton.disabled = false;
      reloadIsNeeded = false;
    }
  }

  function removeAllAttributeOptions() {
    const selectElement = document.getElementById("attributes");
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
  }
  function removeAllSkillOptions() {
    const selectElement = document.getElementById("skills");
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
  }

  let charAttributes = [
    "Erő",
    "Gyo",
    "Ügy",
    "Áll",
    "Egé",
    "Kar",
    "Int",
    "Aka",
    "Asz",
    "Érz",
  ];
  let currentCharFinalAttributes = [];
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
      allActiveBuffs = document.querySelectorAll(
        "ul#listOfCurrentlyActiveBuffs li"
      );
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
          allActiveBuffs = document.querySelectorAll(
            "ul#listOfCurrentlyActiveBuffs li"
          );
        }
      });
      for (let i = 0; i < allActiveBuffs.length; i++) {
        observer.observe(allActiveBuffs[i], { childList: true, subtree: true });
      }

      // if (activeBuffsStringArray[i].includes("Fájdalomtűrés") && !activeBuffsArray.includes("Fájdalomtűrés")) {
      //   allActiveBuffs[i].parentElement.lastChild.value = "Fájdalomtűrés"
      //   activeBuffsArray.push("Fájdalomtűrés")
      // }

      let indexOfFirstWeapon = 0;
      for (
        indexOfFirstWeapon;
        indexOfFirstWeapon < JSON.parse(reader.result).weaponSets.length;
        indexOfFirstWeapon++
      ) {
        if (JSON.parse(reader.result).weaponSets[indexOfFirstWeapon] != null) {
          break;
        }
      }

      if (
        fileFirstLoaded == true &&
        JSON.parse(reader.result).weaponSets[indexOfFirstWeapon] != null
      ) {
        for (let i = 0; i < weaponStats.length; i++) {
          if (
            weaponStats[i].w_name.includes(
              JSON.parse(reader.result).weaponSets[indexOfFirstWeapon]
                .rightWeapon
            )
          ) {
            weapons.value = weaponStats[i].w_name;
            if (
              weaponStats[i].w_name.includes("egykézzel") ||
              weaponStats[i].w_name.includes("dobva")
            ) {
              for (let j = i; j < weaponStats.length; j++) {
                if (weaponStats[j].w_name.includes("kétkézzel")) {
                  weapons.value = weaponStats[j].w_name;
                  break;
                }
              }
            }
            break;
          }
        }
      }
      let filteredArrayIfHasHeavyArmorSkill = JSON.parse(
        reader.result
      ).skills.filter((name) => name.name == "Vértviselet");
      let extentOfCurrentArmorSet = 0;
      let armorSetMgt = 0;
      function armorHandler() {
        if (JSON.parse(reader.result).armourSet == null) {
          return;
        }

        let armorPieces = JSON.parse(reader.result).armourSet.pieces;
        if (armorPieces.length == 0) {
          equippedOrNot.style.display = "none";
          return;
        }
        // let armorObject = []
        if (filteredArrayIfHasHeavyArmorSkill.length != 0) {
          mgtCompensation =
            parseInt(filteredArrayIfHasHeavyArmorSkill[0].level) * 2;
          if (filteredArrayIfHasHeavyArmorSkill[0].level == 4) {
            mgtCompensation = 9;
          }
          if (filteredArrayIfHasHeavyArmorSkill[0].level == 5) {
            mgtCompensation = 12;
          }
        }
        if (equippedOrNotSetToManual == false) {
          equippedOrNot.checked = true;

          console.log(armorPieces);
          for (let j = 0; j < props.armors.length; j++) {
            if (armorPieces[0] == props.armors[j].nameOfArmor) {
              checkWhereItIsWorn(props.armors[j], mgtCompensation);
              break;
            } else {
              continue;
            }
          }
        }
        // for (let i = 0; i < armorObject.length; i++) {
        //   //armorSetMgt += Math.round(armorObject[i].materialIndex * armorObject[i].kit.length)
        // }
      }
      armorHandler();
      //--- itt nézi meg az épp kiválasztott fegyver és pajzs tulajdonságait a weapons.json-ból
      currentlySelectedWeapon = weaponStats.find(
        (name) => name.w_name === `${weapons.value}`
      );
      let currentlySelectedOffHand = weaponStats.find(
        (name) => name.w_name === `${offHand.value}`
      );

      //--- karakter neve és kasztja
      charClass.innerText = JSON.parse(reader.result).classKey;
      charLevel.innerText = `${JSON.parse(reader.result).level}. szintű`;
      charRace.innerText = JSON.parse(reader.result).raceKey;
      charName.innerText = JSON.parse(reader.result).charName;
      // szűrés minden fegyverhasználatra
      filteredArrayByWeaponSkills = JSON.parse(reader.result).skills.filter(
        (name) =>
          name.name == "Fegyverhasználat"
      );

      //---- szűrés olyan fegyvertípusokra amikre a karakternek van fegyverhasználat képzettsége
      filteredArrayByCurrentlySelectedWeaponType = JSON.parse(reader.result).skills.filter(
        (name) =>
          name.name == "Fegyverhasználat" &&
          currentlySelectedWeapon.w_type.includes(name.subSkill)
      );
      //-----szűrés különböző adottságokra
      let filteredArrayIfHasDestroyer = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => name.aptitude == "Pusztító");
      filteredArrayIfHasExtraReaction = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => name.aptitude == "Extra reakció");
      let filteredArrayIfHasMasterWep = JSON.parse(
        reader.result
      ).aptitudes.filter(
        (name) =>
          name.aptitude == "Mesterfegyver" &&
          JSON.parse(reader.result).masterWeapon ==
            `${currentlySelectedWeapon.w_name}`
      );
      let filteredArrayIfHasWarriorMonk = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => name.aptitude == "Harcművész");

      let filteredArrayIfHasVigorous = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => name.aptitude == "Életerős");

      let filteredArrayIfHasMagicallyAttuned = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => name.aptitude == "Varázstudó");

      let filteredArrayIfHasNimble = JSON.parse(reader.result).aptitudes.filter(
        (name) => name.aptitude == "Fürge"
      );
      let filteredArrayIfHasPsionist = JSON.parse(reader.result).aptitudes.filter(
        (name) => name.aptitude == "Pszionista"
      );
      filteredArrayIfHasManaController = JSON.parse(reader.result).aptitudes.filter(
        (name) => name.aptitude == "Mana uraló"
      );
      let filteredArrayIfHasAncientSoul = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => name.aptitude == "Ősibb lélek");
      filteredArrayIfHasManaFlow = JSON.parse(reader.result).aptitudes.filter(
        (name) => name.aptitude == "Mana vezető"
      );
      filteredArrayIfHasAnyAffinity = JSON.parse(
        reader.result
      ).aptitudes.filter((name) => {
        if (name.aptitude != null) {
          return name.aptitude.includes("affinitás");
        }
      });
      //----szűrés képzettségekre
      filteredArrayIfHasPsi = JSON.parse(reader.result).skills.filter(
        (name) => {
          if (name.name != null) {
            return name.name.includes("Pszi");
          }
        }
      );

      if (filteredArrayIfHasPsi.length != 0) {
        psiDisciplinesSelectWrapper.style.display = "grid";
      }
      // Kf és afeletti képettségfoknál választott stílus az adott fegyverhez
      selectedWeaponStyles = Object.entries(JSON.parse(reader.result).weaponStyles);

      filteredArrayIfHasTwoWeaponAttack = JSON.parse(
        reader.result
      ).skills.filter((name) => name.name == "Kétkezes harc");

      if (filteredArrayIfHasTwoWeaponAttack.length != 0) {
        twoWeaponAttackModifiersIndex =
          filteredArrayIfHasTwoWeaponAttack[0].level;
      }

      filteredArrayIfHasAnyMagicSkill = JSON.parse(reader.result).skills.filter(
        (name) => schoolsOfMagic.includes(name.name)
      );
      for (let i = 0; i < filteredArrayIfHasAnyMagicSkill.length; i++) {
        if (filteredArrayIfHasAnyMagicSkill[i].subSkill) {
          currentGodWorshippedByPlayer =
            filteredArrayIfHasAnyMagicSkill[i].subSkill;
          break;
        }
      }
      let filteredArrayIfHasAnyMagicSkillSubSkill = JSON.parse(
        reader.result
      ).skills.filter((name) => schoolsOfMagicSubClass.includes(name.name));
      // --------- objektumba rendezzük a mágiaformákat ahol az érték azoknak a szintje
      // ------de ha szakrális mágiáról van szó, akkor az speciális lesz, ezért erre kell egy külön függvény

      if (fileFirstLoaded == true) {
        welcomeWindow.style.display = "none";
        rollResultWrapper.style.display = "grid";
        skillCheckRollResultWrapper.style.display = "grid";

        for (
          let i = 0;
          i < filteredArrayIfHasAnyMagicSkillSubSkill.length;
          i++
        ) {
          if (
            filteredArrayIfHasAnyMagicSkillSubSkill[i].name.includes("fohász")
          ) {
            allMagicSubskillsObject[
              `${filteredArrayIfHasAnyMagicSkillSubSkill[i].name} - ${filteredArrayIfHasAnyMagicSkillSubSkill[i].subSkill}`
            ] = filteredArrayIfHasAnyMagicSkillSubSkill[i].level;
          } else {
            allMagicSubskillsObject[
              `${filteredArrayIfHasAnyMagicSkillSubSkill[i].subSkill}`
            ] = filteredArrayIfHasAnyMagicSkillSubSkill[i].level;
          }
        }

        allMagicSubskillsObject = Object.entries(allMagicSubskillsObject);
      }

      filteredArrayIfHasParry = JSON.parse(reader.result).skills.filter(
        (name) => name.name == "Hárítás"
      );
      let filteredArrayIfHasRunning = JSON.parse(reader.result).skills.filter(
        (name) => name.name == "Futás"
      );
      filteredArrayIfHasAssassination = JSON.parse(reader.result).skills.filter(
        (name) => name.name == "Orvtámadás"
      );
      if (filteredArrayIfHasAssassination.length != 0) {
        bonusDamageFromAssassination = filteredArrayIfHasAssassination[0].level;
      }
      //-------- Ha egy fegyvernek több tipusa is van, kiválasztja a legmagasabb szintűt
      let allLevelsArray = [];

      console.log(filteredArrayByCurrentlySelectedWeaponType)

      if (filteredArrayByCurrentlySelectedWeaponType.length != 0) {
        for (let i = 0; i < filteredArrayByCurrentlySelectedWeaponType.length; i++) {
          allLevelsArray.push(filteredArrayByCurrentlySelectedWeaponType[i].level);
        }
        professionLevel = parseInt(Math.max(...allLevelsArray));
      } else {
        professionLevel = 0;
      }
      combinationModifiersIndex = professionLevel;

      if (
        filteredArrayIfHasDestroyer.length != 0 &&
        !checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)
      ) {
        destroyerLevel = parseInt(filteredArrayIfHasDestroyer[0].level);
      } else {
        destroyerLevel = 0;
      }

      let currentChar = props.chars.find(
        (name) => name.classKey == JSON.parse(reader.result).classKey
      );
      //adott karakter(kaszt) alap statjai
      let currentCharBaseAttributeValues = Object.values(currentChar).slice(
        1,
        11
      );

      //------ Ez itt csúnyán van hardcodolva, keresés kéne az attrSpreadArray object entries-be majd
      let attrSpreadArray = Object.values(JSON.parse(reader.result).attrSpread);
      let currentRace = props.races.find(
        (name) => name.raceKey == JSON.parse(reader.result).raceKey
      );
      let agingArray = Object.values(
        JSON.parse(reader.result).ageing.distribution
      );
      // faji módosító objektum értékei
      let currentRaceModifiers = Object.values(currentRace).slice(1, 11);
      //--------------------------------------------------------------------------------

      function modifierCalculator(index1, index2, index3) {
        let currentModifier = 0;
        currentModifier +=
          attrSpreadArray[index1] -
          agingArray[index1] +
          currentRaceModifiers[index1];
        currentModifier +=
          attrSpreadArray[index2] -
          agingArray[index2] +
          currentRaceModifiers[index2];
        currentModifier +=
          attrSpreadArray[index3] -
          agingArray[index3] +
          currentRaceModifiers[index3];
        return currentModifier;
      }
      let atkModifier = modifierCalculator(0, 1, 2);
      let aimModifier = modifierCalculator(2, 8, 9);
      let defModifier = modifierCalculator(1, 2, 9);

      function findAndCountAttributesThatModifyStats(attr1, attr2, attr3) {
        let attrBuyingObj = JSON.parse(reader.result).attrBuying;
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
        return numberOfBoughtAttributes;
      }
      //---------------------- betölti a tul. értékeket és képzettségeket
      //------------------------------------------------------------
      if (fileFirstLoaded == true) {
        toggleAllallActionBarButtonsExceptInitRollDisplay();

        for (let i = 0; i < 10; i++) {
          let currentAttribute =
            currentCharBaseAttributeValues[i] +
            attrSpreadArray[i] +
            findAndCountAttributesThatModifyStats(`${charAttributes[i]}`) +
            currentRaceModifiers[i] -
            agingArray[i];
          let attrOption = document.createElement("option");
          attrOption.innerText = charAttributes[i];
          attrOption.value = [currentAttribute, charAttributes[i]];
          attributes.appendChild(attrOption);
          //itt kerülnek meghatározásra a végső tulajdonság értékek
          currentCharFinalAttributes.push(currentAttribute);
        }
        // itt rakja be az összes skillt a skillCheck komponensbe
        for (let i = 0; i < JSON.parse(reader.result).skills.length; i++) {
          if (JSON.parse(reader.result).skills[i].name != null) {
            let skillOption = document.createElement("option");
            skillOption.value = [
              JSON.parse(reader.result).skills[i].level,
              JSON.parse(reader.result).skills[i].name,
              JSON.parse(reader.result).skills[i].subSkill,
            ];
            let tempLevelNameStore = parseInt(
              JSON.parse(reader.result).skills[i].level
            );
            if (JSON.parse(reader.result).skills[i].subSkill) {
              skillOption.innerText = `${
                JSON.parse(reader.result).skills[i].name
              } (${JSON.parse(reader.result).skills[i].subSkill}) (${
                skillLevelsMeaning[tempLevelNameStore - 1]
              })`;
            } else {
              skillOption.innerText = `${
                JSON.parse(reader.result).skills[i].name
              } (${skillLevelsMeaning[tempLevelNameStore - 1]})`;
            }
            skills.appendChild(skillOption);
          } else {
            continue;
          }
        }
      }

      ///----- a karakter szintjéből adódó értékek
      let sumAtkGainedByLevel =
        JSON.parse(reader.result).level * currentChar.atkPerLvl;
      let sumDefGainedByLevel =
        JSON.parse(reader.result).level * currentChar.defPerLvl;
      let sumAimGainedByLevel =
        JSON.parse(reader.result).level * currentChar.aimPerLvl;
      let sumFpGainedByLevel =
        JSON.parse(reader.result).level * currentChar.fpPerLvl;
      let sumPpGainedByLevel =
        JSON.parse(reader.result).level * currentChar.ppPerLvl;
      let sumMpGainedByLevel =
        JSON.parse(reader.result).level * currentChar.mpPerLvl;
      let sumInitiativeGainedByLevel =
        JSON.parse(reader.result).level * currentChar.initPerLvl;

      let baseAtk =
        JSON.parse(reader.result).stats.TÉ +
        currentChar.str +
        currentChar.spd +
        currentChar.dex +
        atkModifier +
        findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Erő") +
        sumAtkGainedByLevel +
        JSON.parse(reader.result).spentHm.TÉ;
      let baseAim =
        JSON.parse(reader.result).stats.CÉ +
        currentChar.dex +
        currentChar.ast +
        currentChar.per +
        aimModifier +
        findAndCountAttributesThatModifyStats("Ügy", "Asz", "Érz") +
        sumAimGainedByLevel +
        JSON.parse(reader.result).spentHm.CÉ;
      let baseDef =
        JSON.parse(reader.result).stats.VÉ +
        currentChar.spd +
        currentChar.dex +
        currentChar.per +
        60 +
        defModifier +
        findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Érz") +
        sumDefGainedByLevel +
        JSON.parse(reader.result).spentHm.VÉ;

      let masterWeaponModifier = 0;

      if (filteredArrayIfHasMasterWep.length != 0) {
        masterWeaponModifier = parseInt(filteredArrayIfHasMasterWep[0].level);
      } else {
        masterWeaponModifier = 0;
      }
      //----- TÉ/VÉ/CÉ számítás a fegyver értékekkel együtt
      let atkWithProfession =
        baseAtk +
        parseInt(professionLevel) *
          (currentlySelectedWeapon.weaponAtk + masterWeaponModifier);
      let aimWithProfession =
        baseAim +
        parseInt(professionLevel) *
          (currentlySelectedWeapon.weaponAtk + masterWeaponModifier);
      let defWithProfession =
        baseDef +
        parseInt(professionLevel) *
          (currentlySelectedWeapon.weaponDef + masterWeaponModifier);

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
          calculatedParryWeaponDef = parryWeaponDef - (parryWeaponDef % 10) + 5
        } else if (parryWeaponDef % 5 != 0 && parryWeaponDef % 10 > 5) {
          calculatedParryWeaponDef = parryWeaponDef - parryWeaponDef % 5 + 5
        } 
        return parseFloat(calculatedParryWeaponDef/10);
      }
      // ki kellett menteni a varázslatokhoz
      baseAimWithTeoCalculator = tvcoCalculator(baseAim);
      //--- külön az erő tulajdonság, ami az oldalon megjelenik

      initiative.innerText =
        currentCharFinalAttributes[1] +
        currentCharFinalAttributes[6] +
        currentCharFinalAttributes[9] +
        sumInitiativeGainedByLevel +
        JSON.parse(reader.result).stats.KÉ;
      // legenerálja a fizikai tulajdonságok nevét és értékét
      if (fileFirstLoaded == true) {
        for (let i = 0; i < 5; i++) {
          let physicalAttributeNameDiv = document.createElement("div");
          let physicalAttributeValueDiv = document.createElement("div");
          physicalAttributeNameDiv.classList.add("physicalAttributeName");
          physicalAttributeValueDiv.classList.add("physicalAttributeValue");
          physicalAttributeValueDiv.setAttribute("id", `${charAttributes[i]}`);
          physicalAttributeNameDiv.innerText = charAttributes[i] + ":";
          physicalAttributeValueDiv.innerText = currentCharFinalAttributes[i];
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
          spiritualAttributeValueDiv.innerText = currentCharFinalAttributes[i];
          skillCheckRightSideWrapper.appendChild(spiritualAttributeNameDiv);
          skillCheckRightSideWrapper.appendChild(spiritualAttributeValueDiv);
        }
      }
      // az ökölhöz tartozó legmagasabb tulajdonságokat alapból 4-el kell osztani *********************

      let fistAtkDivider = 4;
      let charStrWithWarriorMonkAptitude = currentCharFinalAttributes[0];
      // van-e harcművész adottság?
      if (filteredArrayIfHasWarriorMonk.length != 0) {
        if (parseInt(filteredArrayIfHasWarriorMonk[0].level) == 2) {
          fistAtkDivider = 3;
          charStrWithWarriorMonkAptitude += 1;
        } else if (parseInt(filteredArrayIfHasWarriorMonk[0].level) == 3) {
          fistAtkDivider = 2;
          charStrWithWarriorMonkAptitude += 3;
        }
      } else {
        fistAtkDivider = 4;
      }

      if (currentlySelectedWeapon.w_type == "Ököl") {
        //megnézi a legmagasabb tul-t és elosztja az ököl osztóval, ami a harcművész adottsággal változhat
        let fistAtk = Math.floor(
          Math.max(
            currentCharFinalAttributes[0],
            currentCharFinalAttributes[1],
            currentCharFinalAttributes[2]
          ) / fistAtkDivider
        );
        let fistDef = Math.floor(
          Math.max(
            currentCharFinalAttributes[1],
            currentCharFinalAttributes[2]
          ) / fistAtkDivider
        );
        atkWithProfession = baseAtk + parseInt(professionLevel) * fistAtk;
        defWithProfession = baseDef + parseInt(professionLevel) * fistDef;
      }

      let reducedMgtByParrySkill = currentlySelectedOffHand.mgt;
      let anyOtherHmoModifierValue = anyOtherHmoModifier.value;
      if (anyOtherHmoModifier.value == "") {
        anyOtherHmoModifierValue = 0;
      }

      // TÉ VÉ CE értékek számítása ******************************
      //*********************************************************** */
      if (filteredArrayIfHasParry.length != 0) {
        reducedMgtByParrySkill =
          currentlySelectedOffHand.mgt - filteredArrayIfHasParry[0].level;
        if (reducedMgtByParrySkill < 0) {
          reducedMgtByParrySkill = 0;
        }
        charDefWithParry.value =
          tvcoCalculator(
            defWithProfession) +
            specialTvcoCalculatorForParry(
                parseFloat(currentlySelectedOffHand.weaponDef / 2 *
                  filteredArrayIfHasParry[0].level)) 
              
           -
          reducedMgtByParrySkill / 2 -
          currentlySelectedWeapon.mgt / 2 +
          parseFloat(anyOtherHmoModifierValue) -
          parseFloat(totalMgtOfArmorSet.innerText / 2) +
          chiCombatAtkDefModifier -
          innerTimeNegativeModifier -
          modifierFromNumberOfAttacksInTheRound -
          cumulativeCombinationModifier;
      } else {
        charDefWithParry.value =
          tvcoCalculator(defWithProfession) -
          reducedMgtByParrySkill / 2 -
          currentlySelectedWeapon.mgt / 2 +
          parseFloat(anyOtherHmoModifierValue) -
          parseFloat(totalMgtOfArmorSet.innerText / 2) +
          chiCombatAtkDefModifier -
          innerTimeNegativeModifier -
          modifierFromNumberOfAttacksInTheRound -
          cumulativeCombinationModifier;
      }

      if (filteredArrayIfHasNimble.length != 0) {
        charDefWithEvasion.value =
          tvcoCalculator(defWithProfession) +
          0.5 +
          0.5 * parseInt(filteredArrayIfHasNimble[0].level) -
          reducedMgtByParrySkill / 2 -
          currentlySelectedWeapon.mgt / 2 +
          parseFloat(anyOtherHmoModifierValue) -
          parseFloat(totalMgtOfArmorSet.innerText / 2) +
          chiCombatAtkDefModifier -
          innerTimeNegativeModifier -
          modifierFromNumberOfAttacksInTheRound -
          cumulativeCombinationModifier;
      } else if (filteredArrayIfHasNimble.length == 0) {
        charDefWithEvasion.value =
          tvcoCalculator(defWithProfession) +
          0.5 -
          reducedMgtByParrySkill / 2 -
          currentlySelectedWeapon.mgt / 2 +
          parseFloat(anyOtherHmoModifierValue) -
          parseFloat(totalMgtOfArmorSet.innerText / 2) +
          chiCombatAtkDefModifier -
          innerTimeNegativeModifier -
          modifierFromNumberOfAttacksInTheRound -
          cumulativeCombinationModifier;
      }

      if (!checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
        charAtk.value =
          tvcoCalculator(atkWithProfession) -
          reducedMgtByParrySkill / 2 -
          currentlySelectedWeapon.mgt / 2 +
          parseFloat(anyOtherHmoModifierValue) -
          parseFloat(totalMgtOfArmorSet.innerText / 2) +
          chiCombatAtkDefModifier -
          innerTimeNegativeModifier -
          modifierFromNumberOfAttacksInTheRound -
          cumulativeCombinationModifier +
          findWeakSpotModifier;
        // if (charAtk.value < 0) {
        //   charAtk.value = 0
        // }
      } else {
        charAtk.value =
          tvcoCalculator(aimWithProfession) -
          reducedMgtByParrySkill / 2 -
          currentlySelectedWeapon.mgt / 2 +
          parseFloat(anyOtherHmoModifierValue) -
          parseFloat(totalMgtOfArmorSet.innerText / 2) -
          innerTimeNegativeModifier -
          modifierFromNumberOfAttacksInTheRound -
          cumulativeCombinationModifier;
        // if (charAtk.value < 0) {
        //   charAtk.value = 0
        // }
      }
      charDef.value =
        tvcoCalculator(defWithProfession) -
        reducedMgtByParrySkill / 2 -
        currentlySelectedWeapon.mgt / 2 +
        parseFloat(anyOtherHmoModifierValue) -
        parseFloat(totalMgtOfArmorSet.innerText / 2) +
        chiCombatAtkDefModifier -
        innerTimeNegativeModifier -
        modifierFromNumberOfAttacksInTheRound -
        cumulativeCombinationModifier;

      //********************************************************************************************** */
      // Kiszámolja a maximális és cselekedetenkénti mozgás távot. Ez függ az MGT-től, ezért van ennyire lent
      // *********************************************************************************************
      let speedBonusFromRunningSkill = 0;
      if (filteredArrayIfHasRunning.length != 0) {
        speedBonusFromRunningSkill = filteredArrayIfHasRunning[0].level * 2;
      }
      let correctedSpeedValueForMovementCalculation =
        10 +
        Math.floor(currentCharFinalAttributes[1] / 2) +
        speedBonusFromRunningSkill -
        currentlySelectedWeapon.mgt -
        reducedMgtByParrySkill -
        parseInt(totalMgtOfArmorSet.innerText);
      maxMove.innerText = `Max táv: ${
        correctedSpeedValueForMovementCalculation * 3
      } láb`;
      movePerAction.innerText = `/akció táv: ${Math.ceil(
        (correctedSpeedValueForMovementCalculation * 3) /
          (1 + Math.ceil((parseInt(initiative.innerText) + 1) / 10))
      )} láb`;

      // *******************************************************************
      // erő alapján alap ököl sebzés kiszámítása

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
      //-----pszi
      let lowestStatForPsiPoints = Math.min(
        currentCharFinalAttributes[6],
        currentCharFinalAttributes[7],
        currentCharFinalAttributes[8]
      );
      // --- ha van Pszionista adottság, akkor a legmagasabb Tulajdonság számít a legalacsonyabb helyett
      let highestStatForPsiPoints = Math.max(
        currentCharFinalAttributes[6],
        currentCharFinalAttributes[7],
        currentCharFinalAttributes[8]
      )
      let psiMultiplier = 0;
      if (filteredArrayIfHasPsi.length != 0) {
        psiMultiplier = parseFloat(filteredArrayIfHasPsi[0].level / 2);
      }
      let statForPsiPoints = 0
      if (filteredArrayIfHasPsionist.length != 0 && filteredArrayIfHasPsionist[0].level != 0) {
        statForPsiPoints = highestStatForPsiPoints + filteredArrayIfHasPsionist[0].level *3
      } else if(filteredArrayIfHasPsionist.length == 0 || filteredArrayIfHasPsionist[0].level == 0){
        statForPsiPoints = lowestStatForPsiPoints
      }

     let psiPoints =
        Math.floor(
          statForPsiPoints * psiMultiplier +
            JSON.parse(reader.result).stats.Pp
        ) + sumPpGainedByLevel;
      //--------------------fp
      let fpPoints =
        JSON.parse(reader.result).stats.Fp +
        sumFpGainedByLevel +
        currentCharFinalAttributes[3] +
        currentCharFinalAttributes[7];
      //------------------ mana
      let attributeNeededToCalculateManaPoints = 0;
      let highestMagicSkillLevel = 0;
      let highestMagicSkillName = "";
      let modifierByMagicallyAttunedAptitude = 0;
      //------ varázstudó adottságból jövő tulajdonság módosító
      if (filteredArrayIfHasMagicallyAttuned.length != 0) {
        if (filteredArrayIfHasMagicallyAttuned[0].level == 2) {
          modifierByMagicallyAttunedAptitude = 3;
        } else if (filteredArrayIfHasMagicallyAttuned[0].level == 3) {
          modifierByMagicallyAttunedAptitude = 6;
        }
      }
      if (filteredArrayIfHasAnyMagicSkill.length != 0) {
        let allMagicSkillLevelsArray = [];
        for (let i = 0; i < filteredArrayIfHasAnyMagicSkill.length; i++) {
          allMagicSkillLevelsArray.push(
            filteredArrayIfHasAnyMagicSkill[i].level
          );
        }
        highestMagicSkillLevel = parseInt(
          Math.max(...allMagicSkillLevelsArray)
        );
      }
      //------ a legmagasabb mágikus képzettség neve is kell a mana számításhoz
      filteredArrayForNameOfHighestMagicalSkill =
        filteredArrayIfHasAnyMagicSkill.filter(
          (skill) => skill.level == highestMagicSkillLevel
        );

        // console.log(
        //   "van-e valami magic skill?:", filteredArrayIfHasAnyMagicSkill,
        //   "legmagasabb magic skill:", filteredArrayForNameOfHighestMagicalSkill,
        //   "magic subskillek:", filteredArrayIfHasAnyMagicSkillSubSkill,
        //   allMagicSubskillsObject
        // );

      if (filteredArrayForNameOfHighestMagicalSkill[0] != null) {
        highestMagicSkillName =
          filteredArrayForNameOfHighestMagicalSkill[0].name;
      } else {
        highestMagicSkillName = "";
      }
      for (let i = 0; i < schoolsOfMagic.length; i++) {
        if (highestMagicSkillName == schoolsOfMagic[i]) {
          attributeNeededToCalculateManaPoints =
            currentCharFinalAttributes[attributeIndexesForSchoolsOfMagic[i]] +
            modifierByMagicallyAttunedAptitude;
          for (let j = 0; j < props.gods.length; j++) {
            if (props.gods[j].nameOfGod == currentGodWorshippedByPlayer) {
              attributeNeededToCalculateManaPoints =
                currentCharFinalAttributes[props.gods[j].attributeIndex] +
                modifierByMagicallyAttunedAptitude;
              break;
            }
          }
          break;
        }
      }

      let manaPoints =
        attributeNeededToCalculateManaPoints * highestMagicSkillLevel +
        sumMpGainedByLevel +
        JSON.parse(reader.result).stats.Mp;
      if (
        filteredArrayIfHasMagicallyAttuned.length == 0 ||
        (filteredArrayIfHasMagicallyAttuned.length != 0 &&
          filteredArrayIfHasMagicallyAttuned[0].level == 0)
      ) {
        manaPoints = 0;
      }

      let vigorousModifier = 0;
      if (filteredArrayIfHasVigorous.length != 0) {
        vigorousModifier = parseInt(filteredArrayIfHasVigorous[0].level);
      } else {
        vigorousModifier = 0;
      }
      let legendPoints = 3;
      if (filteredArrayIfHasAncientSoul.length != 0) {
        legendPoints += parseInt(filteredArrayIfHasAncientSoul[0].level);
      } else {
        legendPoints = 3;
      }

      if (fileFirstLoaded == true) {
        const data = {
          charName: charName.innerText,
          currentFp: fpPoints,
          currentEp: currentCharFinalAttributes[4] + vigorousModifier * 2,
          currentPp: psiPoints,
          currentMp: manaPoints,
          currentLp: legendPoints,
        };

        (maxFp.innerText = fpPoints),
          (maxEp.innerText =
            currentCharFinalAttributes[4] + vigorousModifier * 2),
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

        const response = await fetch(endpoint, options);
        fetchCharacterData(charName.innerText);
              // itt feltöltjük a weaponTypeAndLevelAndStyleArray-t a fegyverkategóriával és a hozzá tartozó képzettség szintekkel
              for (let i = 0; i < filteredArrayByWeaponSkills.length; i++) {
                checkAndModifyCurrentWeaponStyles(filteredArrayByWeaponSkills[i].subSkill)
                weaponTypeAndLevelAndStyleArray.push([filteredArrayByWeaponSkills[i].subSkill, filteredArrayByWeaponSkills[i].level, maneuverAttachedToWeaponType[0]])
              }
      }

      fileFirstLoaded = false;
      //*********************************************************************************************************************************************************************** */
      //*Az összes komplex manőver kiválasztása, és ha a fegyver távolsági, akkor azok letiltása. Ezen felül a kétkezes harc letiltása, ha a fegyvert két kézzel kell forgatni
      //*********************************************************************************************************************************************************************** */
      arrayOfAllComplexManeuvers = document.querySelectorAll(
        "ul#selectableComplexManeuversList li input"
      );
      weaponsOptions = document.querySelectorAll("select#weapons option");

      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true) {
        for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
          arrayOfAllComplexManeuvers[i].disabled = true;
        }
        findWeakSpotButton.disabled = true;
        attackOfOpportunityButton.disabled = true;
        // if (combinationWasUsedThisRound == true) {
        // }
      }
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
        for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
          arrayOfAllComplexManeuvers[i].disabled = false;
          twoWeaponAttackRadioButton.disabled = false;
        }
        findWeakSpotButton.disabled = false;
        attackOfOpportunityButton.disabled = false;
        if (
          weapons.value.includes("kétkézzel") ||
          weapons.value.includes("Kétkezes") ||
          weapons.value.includes("Pallos") ||
          weapons.value.includes("Alabárd")
        ) {
          twoWeaponAttackRadioButton.disabled = true;
        } else {
          twoWeaponAttackRadioButton.disabled = false;
          toggleTwoHandedWeaponsDisplay("grid");
        }
        // if (combinationWasUsedThisRound == true) {
        //   combinationCheckBox.disabled = true;
        // }
      }
      if (chargeWasUsedThisRound == true) {
        charDef.value = parseFloat(charDef.value) - 1;
        charDefWithParry.value = parseFloat(charDefWithParry.value) - 1;
        charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - 1;
      }
      if (twoWeaponAttackWasUsedThisRound == true) {
        hmoModifier(twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex]);
      }
      if (
        initRolled == false &&
        checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false
      ) {
        for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
          arrayOfAllComplexManeuvers[i].disabled = true;
        }
      }
      if (reloadIsNeeded == false && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
        reloadButton.disabled = true;
        warningWindow.innerText = "";
      }
      if (maxMp.innerText == 0) {
        spellCastButtonWrapper.style.display = "none";
      }
    });

    if (file) {
      reader.readAsText(file);
    }
  }

  // ez a számláló a pszi roham miatt van
  let numberOfClicksForAttacksForPsiAssault = 0;
  //ez pedig a kétkezes harc miatt
  let numberOfClicksAtTwoWeaponAttack = 0;

  //************************************************************************ */
  //------------------a támadó dobás
  //************************************************************************ */
  async function handleClickOnAttackRollButton(darkDice, lightDice) {
    //*********************************************************************** */
    //** Ne számoljon, ha legendapont használat volt, ez az if több helyen is megjelenik ugyanezen okból */
    if (spellNeedsAimRoll == false) {
      numberOfClicksForAttacksForPsiAssault++;
      numberOfAttacksInTheRound++;
    }

    if (twoWeaponAttackRadioButton.checked == true) {
      numberOfClicksAtTwoWeaponAttack++;
    }

    warningWindow.innerText = "";
    bodyPartImg.innerHTML = "";
    charAtkSumText.innerText = "Össz TÉO";
    charAtkSum.innerText = "";
    specialEffect.innerText = "nincs";
    chosenWeapon.innerText = "Választott fegyver:";

    // -------- támadások számából adódó módosító
    if (initRolled == true) {
      if (
        currentlySelectedWeapon.atkPerRound < numberOfAttacksInTheRound &&
        spellNeedsAimRoll == false
      ) {
        modifierFromNumberOfAttacksInTheRound =
          numberOfAttacksInTheRound - currentlySelectedWeapon.atkPerRound;
        // ez itt azért -1, mert minden, a tám értéket meghaladó támadás -1 HMO-t ad.

        if (
          twoWeaponAttackWasUsedThisRound &&
          numberOfAttacksInTheRound - currentlySelectedWeapon.atkPerRound == 2
        ) {
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
    if (firstAttackInRoundSetToFalseBySpellNeedsAimRoll == true) {
      firstAttackInRoundSetToFalseBySpellNeedsAimRoll = false;
    }
    firstAttackInRound = true;
    combinationCheckBox.disabled = false;

    damageResult.innerText = "";

    bodyPart.innerText = "";

    // if (charAtk.value < 0) {
    //   charAtkSum.innerText = rollResult.innerText;
    //   charAtkSum.animate([{ color: "white" }, { color: "black" }], 200);
    // } else {
    //   charAtkSum.innerText =
    //     parseFloat(rollResult.innerText) + parseFloat(charAtk.value);
    //   charAtkSum.animate([{ color: "white" }, { color: "black" }], 200);
    // }

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
    async function playerChecker() {
      const data = {
        charName: charName.innerText,
        atkRollResult: parseFloat(charAtkSum.innerText),
        atkRollDice: `Sötét kocka: ${originalDarkDice}, Világos kocka: ${originalLightDice}`,
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
      const response = await fetch(endpoint, options);
    }

    // ********************************************************************************************************************
    // ---- megnézi, hogy van-e kiválasztva összetett manőver és először a képzettségeket veszi figyelembe, és próbát is dob
    //**********************************************************************************************************************
    //******************************************************************************************************************* */

    // let selectAllAttributeOptions = document.querySelectorAll(
    //   "select#attributes option"
    // );
if (fileFirstLoaded) {
  weaponStyles = Object.entries(weaponStyles)
  weaponStyleBonusesByLevelOfProficiency = Object.entries(weaponStyleBonusesByLevelOfProficiency)
}

// megnézzük, hogy képzettek vagyunk-e az adott manőverben

setSkillForManeuver()
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
    if (spellNeedsAimRoll == true) {
      firstAttackInRound = false;
      firstAttackInRoundSetToFalseBySpellNeedsAimRoll = true;
      setTimeout(() => {
        currentlySelectedWeapon = weaponBeforeCasting;
        weapons.value = weaponBeforeCasting.w_name;
        charAtk.value = charAtkValueSave;
        handleFileRead();
      }, 500);
    }

    if (initRolled == true) {
      if (
        currentlySelectedWeapon.atkPerRound < numberOfAttacksInTheRound + 1 &&
        spellNeedsAimRoll == false
      ) {
        totalModifierForNextAttack.innerText = `${
          -1 + combinationModifiers[combinationModifiersIndex]
        }`;
      } else {
        totalModifierForNextAttack.innerText = `${combinationModifiers[combinationModifiersIndex]}`;
      }

      //ha volt kezdeményező dobás
      for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
        if (arrayOfAllComplexManeuvers[i].checked == true) {
          totalActionCostOfAttackSetter(
            arrayOfAllComplexManeuvers[i].parentElement.value
          );
        }
      }
      if (
        combinationCheckBox.checked == false &&
        spellNeedsAimRoll == false && firstAttackIsAttackOfOpportunity == false
      ) {
        // if (cumulativeCombinationModifier == 0) {
        //   cumulativeCombinationModifier -=
        //     combinationModifiers[combinationModifiersIndex];
        // }
        attackRollButton.disabled = true;
      }
      if (rollButtonWasDisabledBeforeSpellCast == true) {
        attackRollButton.disabled = true;
      }
      if (combinationCheckBox.checked == true) {
        attackRollButton.disabled = false;
      }
      if (numberOfClicksAtTwoWeaponAttack == 1) {
        attackRollButton.disabled = false;
      }
      //************************************************************************************************************************** */
      //Ebben a körben volt kombináció vagy kapáslövés használva, ezért a minusz HMO-k maradnak
      //*************************************************************************************************************************** */
      if (
        combinationCheckBox.checked == true &&
        spellNeedsAimRoll == false &&
        attackOfOpportunityOn == false
      ) {
        //combinationCheckBox.disabled = true;
        combinationWasUsedThisRound = true;

        cumulativeCombinationModifier -=
          combinationModifiers[combinationModifiersIndex];
        hmoModifier(combinationModifiers[combinationModifiersIndex]);
        console.log("halmozódó komb mod", cumulativeCombinationModifier);
        console.log("halmozódó tám mod", modifierFromNumberOfAttacksInTheRound);
        firstAttackInRoundSetToFalseBySpellNeedsAimRoll = false;
      }
      if (spellNeedsAimRoll == false && attackOfOpportunityOn == false) {
        spellCastingFailure();
        numberOfActionsSpentOnCastingCurrentSpellNullifier();
        numberOfActions.innerText =
          parseInt(numberOfActions.innerText) - totalActionCostOfAttack;
        actionsSpentSinceLastCastAdderCheckerAndNullifier(
          totalActionCostOfAttack
        );
      }
      if (parseInt(numberOfActions.innerText) < 2) {
        tacticsButton.disabled = true;
      }
      //************************************************************************************************************************** */
      //Ebben a körben volt roham használva, ezért a minusz VÉO-k maradnak, de a +TÉO elveszik, mert csak 1 támadásra volt érvényes
      //*************************************************************************************************************************** */
      if (chargeRadioButton.checked == true) {
        chargeWasUsedThisRound = true;
        chargeRadioButton.disabled = true;
        setTimeout(() => {
          charAtk.value = parseFloat(charAtk.value) - 1;
        }, 1000);
      }
      // kétkezes harc bejelölésével az első kattintásra a twoWeaponAttackWasUsedThisRound változó igaz lesz, ezért ez alapján módosíthatjuk a 2.dobás körülményeit,
      // mintha az lenne a másik kéz

      if (
        numberOfClicksAtTwoWeaponAttack == 2 &&
        twoWeaponAttackWasUsedThisRound == true
      ) {
        weapons.disabled = true;
        twoWeaponAttackRadioButton.disabled = false;
        weapons.value = mainHandWeaponWhenTwoWeaponAttackIsUsed;

        numberOfClicksAtTwoWeaponAttack = 0;
        if (combinationWasUsedThisRound == true) {
          totalActionCostOfAttackSetter(+1);
        }
        handleFileRead();
      }
      if (numberOfClicksAtTwoWeaponAttack == 1) {
        twoWeaponAttackWasUsedThisRound = true;
      }

      if (firstAttackInRound == true && numberOfClicksAtTwoWeaponAttack == 1) {
        weapons.disabled = false;
        chosenWeapon.innerText = "Kétk.harc másik kéz:";
        twoWeaponAttackRadioButton.disabled = true;

        mainHandWeaponWhenTwoWeaponAttackIsUsed =
          currentlySelectedWeapon.w_name;
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
        charAtk.value = parseFloat(charAtk.value) - findWeakSpotModifier;
        findWeakSpotModifierNullifier();
        findWeakSpotOnToFalse();
        findWeakSpotButton.disabled = false;
      }
      if (attackOfOpportunityOn == true) {
        attackOfOpportunityOnSetToFalse();
        handleFileRead();
        attackOfOpportunityButton.disabled = false;
        if (firstAttackIsAttackOfOpportunity == true) {
          firstAttackInRound = false
          firstAttackIsAttackOfOpportunitySetToFalse()
        }
      }
      if (attackOfOpportunityOn == false) {
        for (let i = 0; i < arrayOfAllComplexManeuvers.length; i++) {
          if (arrayOfAllComplexManeuvers[i].checked == true) {
            arrayOfAllComplexManeuvers[i].checked = false;
            totalActionCostOfAttackSetter(
              -arrayOfAllComplexManeuvers[i].parentElement.value
            );
          }
        }
      }
      if (numberOfClicksAtTwoWeaponAttack == 1) {
        twoWeaponAttackRadioButton.checked = true;
      }

      if (
        checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true &&
        currentlySelectedWeapon.w_type != "MÁGIA" &&
        spellNeedsAimRoll == false
      ) {
        reloadIsNeeded = true;
        attackRollButton.disabled = true;
        reloadButton.disabled = false;
        if (
          currentlySelectedWeapon.w_type == "VET" ||
          currentlySelectedWeapon.w_type == "NYD" ||
          currentlySelectedWeapon.w_type == "PD"
        ) {
          blinkingText(
            warningWindow,
            `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime} CS`
          );
        } else {
          blinkingText(
            warningWindow,
            `Újra kell töltened ${currentlySelectedWeapon.reloadTime} CS`
          );
        }
        // ammoAmountInput.value--
      }
    }
    if (charAtk.value < 0) {
      charAtkSum.innerText = rollResult.innerText;
      charAtkSum.animate([{ color: "white" }, { color: "black" }], 200);
    } else {
      charAtkSum.innerText =
        parseFloat(rollResult.innerText) + parseFloat(charAtk.value);
      charAtkSum.animate([{ color: "white" }, { color: "black" }], 200);
    }
    if (assassinationRadioButton.checked == true) {
      charAtk.value =
        parseFloat(charAtk.value) -
        filteredArrayIfHasAssassination[0].level -
        3;
      assassinationToFalse();
    }
    playerChecker();
    spellNeedsAimRollSetToFalse();
    console.log("totalActionCostOfAttack", totalActionCostOfAttack);
  }

  return (
    <>
      <Head>
        <title>TTK Rolldice</title>
      </Head>

      <main className="main">
        <div id="atkRollWrapper">
          <div className={styles.resultContainer}>
            <div className="inText">A dobás eredménye:</div>
            <div id="rollResult" className="inNumber"></div>
            <div className="damage inText">A sebzés:</div>
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
            <select
              id="weapons"
              name="weapons"
              onChange={handleWeaponOrShieldChange}>
              {weaponStats.map((e) => {
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
            <input
              type="text"
              name="charDefWithEvasion"
              id="charDefWithEvasion"
            />
            <label htmlFor="charDefWithParry" id="charDefWithParryLabel">
              Karakter VÉO (hárítás)
            </label>
            <input type="text" name="charDefWithParry" id="charDefWithParry" />
            <label htmlFor="offHand" id="chosenOffHand">
              Választott hárítófegyver:
            </label>
            <select
              id="offHand"
              name="offHand"
              onChange={handleWeaponOrShieldChange}>
              {weaponStats
                .filter((e) => e.w_type == "PAJ")
                .map((e) => {
                  return <option key={e.w_id}>{e.w_name}</option>;
                })}
            </select>
            <label htmlFor="anyOtherHmoModifier" id="anyOtherHmoModifierLabel">
              Egyéb +/- HMO:
            </label>
            <input
              type="number"
              step={0.5}
              name="anyOtherHmoModifier"
              id="anyOtherHmoModifier"
              onChange={handleFileRead}
              disabled={true}
              defaultValue={0}
            />
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
          <button
            type=""
            id="attackRollButton"
            className={styles.attackRollButton}
            onClick={handleClickOnAttackRollButton}>
            Támadó / Célzó dobás
          </button>
          <div id="warningWindow"></div>
          <span id="castBar"></span>
          <span id="castBarFlashEffect"></span>
          <div className={styles.charSumAtkContainer}>
            <div className="result inText" id="charAtkSumText">
              Össz TÉO
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
          <CharacterDetails />
          <ActionList {...props} />
          <PsiDisciplines {...props} />
          <span id="listOfCurrentlyActiveBuffsLabel">
        Jelenleg aktív diszciplínák és varázslatok
        </span>
        </div>
        {/* <img id="dividingLine" src="/divider.png"></img> */}
        <SkillCheck {...props} />
        <div id="welcomeWindow">
          <div id="welcomeText">
            Üdvözöllek kalandozó! <br />
            <br />
            A ttk roll dice alkalmazás célja, hogy megkönnyítse a dolgodat a TTK
            rendszerében, mely elsőre bonyolultnak tűnhet. <br />
            <br />
            - Segít a képzettség- és tulajdonság próbadobásokban, ahol
            választhatsz stressz- és normálpróba között is. <br />
            - A támadódobás során értelmezi a dobott értékeket és kiszámolja a
            fegyver sebzését, figyelembe véve a karakteredre vonatkozó minden
            statisztikát.
            <br />
            - Folyamatosan képes nyomon követni a harc történéseit, így a
            kezdeményező dobás után már nem hajigálhatod csak úgy a támadókat.
            Továbbá nem válthatsz fegyvert sem, csak ha "Fegyverváltás" akciót
            használsz, vagy nem lőhetsz/dobhatsz el újra távolsági fegyvert,
            amíg nem töltesz újra/veszel elő újat.
            <br />
            - A varázslásra kattintva a varászműhelyben kiszámolt CS, Mp, és -
            ha célzott mágiáról van szó - CÉO értékekkel is boldogul. <br />
            <a
              target="_blank"
              href="https://magustk.hu/0.90/varazsmuhely"
              rel="noopener noreferrer">
              https://magustk.hu/0.90/varazsmuhely
            </a>
            <br />
            <br />
            Tervezem a jövőben oktató videók és információs ablakok formájában
            gyorsítani és könnyíteni a használatot. <br />
            <br />
            Ha bármilyen hibát vagy helytelen működést észlelnél, kérlek ne
            habozz azt jelezni. Discordon a Tiltott törvénykönyv csatornáján
            naizred#1586 néven megtalálsz.
            <br />
            <br />
            Az alkalmazás csak a TTK karakteralkotójából exportált, .txt
            kiterjesztésű karakterrel működik jól, akinek nevet is kell, hogy
            adjál az alkotás során. <br />
            <a
              target="_blank"
              href="https://magustk.hu/0.90/karakteralkoto"
              rel="noopener noreferrer">
              https://magustk.hu/0.90/karakteralkoto
            </a>{" "}
            <br />
            <br />
            Szerencsés dobásokat és jó használatot a TTK Rolldice apphoz!
            <br />
          </div>
          <div className="fileInputWrapper">
            <button className="customFileButton">Karakter importálása</button>
            <input
              type="file"
              id="inputFile"
              accept=".txt"
              onChange={handleFileRead}
            />
          </div>
        </div>
      </main>
    </>
  );
}
