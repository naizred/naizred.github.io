import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import path from "path";
import CharacterDetails, { initRolled } from "../Components/CharacterDetails";
import ActionList, {
  assassinationToFalse, attackOfOpportunityOn, attackOfOpportunityOnSetToFalse,
  charAtkValueSave, findWeakSpotOn, findWeakSpotOnToFalse, hmoModifier, spellNeedsAimRoll, spellNeedsAimRollSetToFalse, totalActionCostOfAttack,
  totalActionCostOfAttackSetter, weaponBeforeCasting, blinkingText, findWeakSpotModifier,
  findWeakSpotModifierNullifier
} from "../Components/ActionsList";
import { actionsSpentSinceLastCastAdderCheckerAndNullifier, rollButtonWasDisabledBeforeSpellCast, spellCastingFailure, numberOfActionsSpentOnCastingCurrentSpellNullifier } from "../Components/Spells";
import ArmorDetails, { equippedOrNotSetToManual } from "../Components/ArmorDetails";
import K10RollAndSpellDamageRoll, { multipleDiceRoll } from "../Components/K10RollAndSpellDamageRoll";
import { checkWhereItIsWorn } from "../Components/ArmorDetails";
import SkillCheck, {handleSkillCheck, evaluateSkillOrAttributeCheckBase} from "../Components/SkillCheck";
import PsiDisciplines, {
  specialAtkModifierFromPsiAssault, availableNumberOfAttacksFromPsiAssault, bonusDamageFromChiCombat, activeBuffsArray,
  buffRemoverFromActiveBuffArrayAndTextList, chiCombatAtkDefModifier, bonusDamageFromChiCombatNullifier, chiCombatAtkDefModifierNullifier, fpShieldSetter, innerTimeNegativeModifier
} from "../Components/PsiDisciplines";
import AimedAttack from "../Components/AimedAttack";
import { bodyParts } from "../Components/AimedAttack";
var MersenneTwister = require('mersenne-twister');
export var generator = new MersenneTwister();
export async function fetchCharacterData(currentCharName) {
  await fetch(`../api/characterStatsThatChange/${currentCharName}`).then((response) => {
    return response.json();
  }).then((parsedData) => {
    if (!parsedData) {
      return
    }
    currentFp.value = parsedData.currentFp;
    currentEp.value = parsedData.currentEp;
    currentPp.value = parsedData.currentPp;
    currentMp.value = parsedData.currentMp;
    currentLp.value = parsedData.currentLp;
    let activeBuffsCounter = parseInt(parsedData.activeBuffs.charAt(0))
    let activeBuffsStringArray = parsedData.activeBuffs.slice(1).split('|', activeBuffsCounter)
    for (let i = 0; i < activeBuffsStringArray.length; i++) {
      allActiveBuffs[i].innerText = activeBuffsStringArray[i]
      if (activeBuffsStringArray[i].includes("Fájdalomtűrés") && !activeBuffsArray.includes("Fájdalomtűrés")) {
        console.log(activeBuffsStringArray[i])
        //**************************************************** */
        //pontosan a 16. karaktertől slice, így a parseInt megtalálja az fp pajzs mennyiségét
        fpShieldSetter(parseInt(activeBuffsStringArray[i].slice(16)))
        allActiveBuffs[i].parentElement.lastChild.value = "Fájdalomtűrés"
        activeBuffsArray.push("Fájdalomtűrés")
      }
    }
  })
}

export let returnedData

export async function fetchCharacterDataForAdventureMaster(gameId) {
  
    await fetch(`../api/getCharsByGameId/${gameId}`).then((response) => {
      return response.json();
    }).then((parsedData) => {
      if (!parsedData) {
        return
      }
      console.log(parsedData)

      let currentCharNameNodes = document.querySelectorAll('input#characterName')
      let currentFpNodes = document.querySelectorAll('input#currentFp')
      let currentEpNodes = document.querySelectorAll('input#currentEp')
      let currentPpNodes = document.querySelectorAll('input#currentPp')
      let currentMpNodes = document.querySelectorAll('input#currentMp')
      let currentLpNodes = document.querySelectorAll('input#currentLp')
      let atkRollResultNodes = document.querySelectorAll('input#atkRollResult')
      let atkRollDiceNodes = document.querySelectorAll('input#atkRollDice')
      let numberOfActionsAllPlayers = document.querySelectorAll('div#numberOfActionsAllPlayers');
      let initiativeWithRollNodes = document.querySelectorAll('div#initiativeWithRoll');
      let characterNameForInitNodes = document.querySelectorAll('input#characterNameForInit');

// skillCheckResult, skillCheckDice

      for (let i = 0; i < parsedData.length; i++) {
      currentCharNameNodes[i].value = parsedData[i].charName;     
      characterNameForInitNodes[i].value = parsedData[i].charName;     
      currentFpNodes[i].value = parsedData[i].currentFp;     
      currentEpNodes[i].value = parsedData[i].currentEp;  
      currentPpNodes[i].value = parsedData[i].currentPp;   
      currentMpNodes[i].value = parsedData[i].currentMp;   
      currentLpNodes[i].value = parsedData[i].currentLp;
      atkRollResultNodes[i].value = parsedData[i].atkRollResult;
      atkRollDiceNodes[i].value = parsedData[i].atkRollDice;
      numberOfActionsAllPlayers[i].innerText = `CS: ${parsedData[i].numberOfActions}`;
      initiativeWithRollNodes[i].innerText = `CSA: ${parsedData[i].initiativeWithRoll}`;
      }
    })
}

export const getStaticProps = async () => {

  const fs = require("fs");
  const jsonDirectory = path.join(process.cwd(), "json");
  let allSkills = JSON.parse(
    fs.readFileSync(jsonDirectory + "/allSkills.json", "utf8"));
  let armors = JSON.parse(
    fs.readFileSync(jsonDirectory + "/armors.json", "utf8"));
    let chars = JSON.parse(
      fs.readFileSync(jsonDirectory + "/chars.json", "utf8"));
      let gods = JSON.parse(
        fs.readFileSync(jsonDirectory + "/gods.json", "utf8"));
      let psiDisciplines = JSON.parse(
        fs.readFileSync(jsonDirectory + "/psiDisciplines.json", "utf8"));
        let races = JSON.parse(
          fs.readFileSync(jsonDirectory + "/races.json", "utf8"));
  let weapons = JSON.parse(
    fs.readFileSync(jsonDirectory + "/weapons.json", "utf8"));
  let spellAttributes = JSON.parse(
    fs.readFileSync(jsonDirectory + "/spellAttributes.json", "utf8"));
  let spellsAspDescript = JSON.parse(
    fs.readFileSync(jsonDirectory + "/spellsAspDescript.json", "utf8"));
  let spellsWarlock = JSON.parse(
    fs.readFileSync(jsonDirectory + "/spellsWarlock.json", "utf8"));
  return {
    props: {
      allSkills,
      armors,
      chars,
      gods,
      psiDisciplines,
      races,
      weapons,
      spellAttributes,
      spellsWarlock,
      spellsAspDescript
    },
  };
};
// ki kellett importálni az alap CÉ-t a varázsláshoz
export let baseAimWithTeoCalculator = 0
export let allActiveBuffs = []
export let mgtCompensation = 0
export let rollOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export let filteredArrayIfHasExtraReaction
export let filteredArrayIfHasAnyAffinity
export let filteredArrayIfHasManaFlow
export let filteredArrayIfHasPsi
export let filteredArrayIfHasCombination
export let filteredArrayIfHasQuickShot
export let filteredArrayIfHasTwoWeaponAttack
export let filteredArrayIfHasAssassination
export const specialCases1 = [2, 3, 4];
export const specialCases2 = [5, 6, 7];
export const specialCases3 = [8, 9];
export let fileFirstLoaded = true
export let originalDarkDice = 0;
export let originalLightDice = 0; 
export let twoWeaponAttackModifiers = [-3, -2, -1, 0, 1, 2]
export let twoWeaponAttackModifiersIndex = 0
export let quickShotModifiers = [-5, -4, -3, -2, -1, 0]
export let quickShotModifiersIndex = 0
export let combinationModifiers = [-4, -3, -2, -1, 0, 1]
export let combinationModifiersIndex = 0
let filteredArrayIfHasParry
let mainHandWeaponWhenTwoWeaponAttackIsUsed
let legendPointUsedOnDarkDice = false
let legendPointUsedOnLightDice = false
let bonusDamageFromAssassination = 0
export let allMagicSubskillsObject = {}
export let arrayOfAllComplexMaeuvers 
export let currentlySelectedWeapon
export function currentlySelectedWeaponChanger(props, newWeapon) {
  currentlySelectedWeapon = props.weapons.find(
    (name) => name.w_name === `${newWeapon}`
  )
}
export let weaponsOptions
export function toggleAllallActionBarButtonsExceptInitRollDisplay(display='none') {
  const allActionBarButtons = document.querySelectorAll("div#actionsWrapper button")
for (let i = 0; i < allActionBarButtons.length; i++) {
  if (allActionBarButtons[i].id != "initRollButton") {
    allActionBarButtons[i].style.display = display
  }
  }
}
export function allResultsCleaner() {
  rollResult.innerText = ""
  damageResult.innerText = ""
  bodyPart.innerText = ""
  charAtkSum.innerText = ""
  specialEffect.innerText = "nincs"
  if (tempImg) {
    tempImg.style.opacity = 0
  }
}

export let combinationWasUsedThisRound = false
export function combinationWasUsedThisRoundSetToFalse() {
  combinationWasUsedThisRound = false
}
export let disarmWasUsedThisRound = false
export let chargeWasUsedThisRound = false
export function chargeWasUsedThisRoundToFalse() {
  chargeWasUsedThisRound=false
}
export let twoWeaponAttackWasUsedThisRound = false
export function twoWeaponAttackWasUsedThisRoundToFalse() {
  twoWeaponAttackWasUsedThisRound=false
}

export let diceRolled = false;
export function setDiceRolledToFalse() {
    diceRolled = false
}
export let diceRolledSetToFalseBySpellNeedsAimRoll = false
export function diceRolledSetToFalseBySpellNeedsAimRollToFalse() {
  diceRolledSetToFalseBySpellNeedsAimRoll = false
}
export let rangedWeaponsArray = ["ÍJ", "VET", "NYD", "PD", "SZÍ", "Fúvócső", "MÁGIA"]
export let reloadIsNeeded = false
export function reloadIsNeededSetToFalse(){
  reloadIsNeeded = false
}
export function reloadIsNeededSetToTrue(){
  reloadIsNeeded = true
}
export function checkIfWeaponIsRanged(currentlySelectedWeaponType) {
  for (let i = 0; i < rangedWeaponsArray.length; i++) {
    if (currentlySelectedWeaponType.includes(rangedWeaponsArray[i])) {
      return true
    } 
  }return false
}
export let tempImg
//********************************************* */
// --- itt kezdődik az oldal maga
//********************************************************* */
export default function Home(props) {

//egyedi rendező function kellett, mert a sort nem rendezte a fegyverek nevét valamiért. Valószínűleg a karakterkódolással van gondja a fájl beolvasása után

    let alphabets = ["A", "Á","B", "C", "D","E","É","F","G","H","I","Í","J","K","L","M","N","O","Ó","Ö","Ő","P","Q","R","S",
                "T","U","Ú","Ü","Ű","V","W","X","Z"];

let aChar;
let bChar;
function OrderFunc(){
   props.weapons.sort(function (a, b) {
       return CharCompare(a.w_name, b.w_name, 0);
   });
}
function CharCompare(a, b, index) {

  aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
  bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
  if (aChar != bChar)
      return aChar - bChar
  else
      return CharCompare(a,b,index+1)
}

//egyedi sorba rendező function hívás
  OrderFunc(props.weapons)
let damageOfFists = "1k10"
  let destroyerLevel
  let professionLevel
  let schoolsOfMagic = ["Magas Mágia", "Bárdmágia", "Boszorkánymágia", "Boszorkánymesteri mágia", "Tűzvarázslói mágia", "Szakrális mágia"]; 
  let schoolsOfMagicSubClass = ["Magas mágiaforma", " Bárd mágiaforma", "Boszorkány mágiaforma", "Boszorkánymester mágiaforma", "Tűzvarázsló mágiaforma", "Kisebb fohászok", "Nagyobb fohászok"]; 
  let attributeIndexesForSchoolsOfMagic = [6,5,8,7,7,5]
  let skillLevelsMeaning = ["If", "Af", "Kf", "Mf", "Lf"];

//------------------------------------------------------------------------
//-------A dobás ------

  let darkDiceWasChangedToHalfOfStr = false

  function ttkRoll(strBonus, darkDice, lightDice) {

    let result = 0;

      if (darkDice == undefined || lightDice == undefined) {
        darkDiceRerollByCounterLP.style.display = "none"
        lightDiceRerollByCounterLP.style.display = "none"
        for (let i = 0; i < 8; i++) {
          darkDice = Math.floor(generator.random() * 10);
          lightDice = Math.floor(generator.random() * 10);
        }
        //lightDice = 0
        //darkDice = 0
        /* -- ez a felső két sor a dobások tesztelésére van  */
        darkDiceResultSelect.value = darkDice
        lightDiceResultSelect.value = lightDice
      }   

    if (darkDice > lightDice) {
      result = darkDice;
    } else if (darkDice < lightDice) {
      result = lightDice;
    } else if (darkDice == 0 && lightDice == 0) {
      result = 10;
    } else if (darkDice == lightDice) {
      result = darkDice;
    }  

      if (darkDice == 0) {
        darkDice = 10;
      }
      if (lightDice == 0) {
        lightDice = 10;
      }

      originalDarkDice = darkDice
      originalLightDice = lightDice
    const specialModifiers = [
      "Veszítesz 3 cselekedetet",
      "Aki ellen dobták, veszít 1 cselekedetet",
      "Kapsz 1 cselekedetet",
      "Kapsz 2 cselekedetet",
      "Kapsz 3 cselekedetet",
    ];
// Itt vannak a nevezetes dobások
    if (lightDice == darkDice && specialCases1.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[1];
    } else if (lightDice == darkDice && specialCases2.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[2];
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false)
      {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1
      }
    } else if (lightDice == darkDice && specialCases3.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[3];
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false)
      {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 2
      }
    } else if (lightDice == darkDice && darkDice == 1) {
      specialEffect.innerText = specialModifiers[0];
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false)
      {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 3
      }
    } else if (lightDice == darkDice && darkDice == 10) {
      specialEffect.innerText = specialModifiers[4];
      if (initRolled == true && disarmRadioButton.checked == false && weaponBreakRadioButton.checked == false)
      {
        numberOfActions.innerText = parseInt(numberOfActions.innerText) + 3
      }
    }
    console.log("Sötét eredeti:", originalDarkDice, "Világos:", originalLightDice)
    if (strBonus == true) {
      if (Math.floor(parseInt(Erő.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Erő.innerText) / 2);
        darkDiceWasChangedToHalfOfStr = true
      }
    }
    if (currentlySelectedWeapon.assassinWeapon == true && assassinationRadioButton.checked == true){
      if (Math.floor(parseInt(Ügy.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Ügy.innerText) / 2);
      }
      }

    if (numberOfClicksForAttacks <= availableNumberOfAttacksFromPsiAssault) {
      result += specialAtkModifierFromPsiAssault
      if (result >=10) {
        result = 10
      }
    } else if (numberOfClicksForAttacks > availableNumberOfAttacksFromPsiAssault) {
      buffRemoverFromActiveBuffArrayAndTextList('Pszi Roham')
      numberOfClicksForAttacks = 0
    }
        return result;     
  }

//-------------- Megnézi a sebzéskódot, és számol sebzést ------------
  
  async function damageEvaluator() {
    console.log("Fegyver típus:", currentlySelectedWeapon.w_type);
    console.log("Fegyver sebzéskód:", currentlySelectedWeapon.w_damage);
    console.log("Erősebzés?:", currentlySelectedWeapon.strBonusDmg);
   if (diceRolled == false) {
    return
    }
    if (!activeBuffsArray.includes('Chi-harc')) {
      bonusDamageFromChiCombatNullifier()
    } 
    if (assassinationRadioButton.checked == true) {
      bonusDamageFromAssassination = filteredArrayIfHasAssassination[0].level
    }
    if (assassinationRadioButton.checked == false) {
      bonusDamageFromAssassination = 0
    }
    
    // ha nem történt kezdeményező dobás, akkor csak 1 támadásig érvényes a chi harc
    if (initRolled == false && activeBuffsArray.includes('Chi-harc')) {
      buffRemoverFromActiveBuffArrayAndTextList('Chi-harc')
      hmoModifier(-chiCombatAtkDefModifier)
      chiCombatAtkDefModifierNullifier()
    }

    //ez a két változó csak az ökölharc miatt kell:
    //professionLevel és currentWeaponDamage
let currentWeaponDamage = currentlySelectedWeapon.w_damage
if (currentlySelectedWeapon.w_type == "Ökölharc") {
  currentWeaponDamage = damageOfFists
  professionLevel = Math.ceil(professionLevel / 2);
  if (currentlySelectedWeapon.w_name == "Vasököl") {
    professionLevel +=1
  }
    }
  if (currentWeaponDamage === "2k10") {
    damageResult.innerText =
      originalDarkDice +
      originalLightDice +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
  } else if (currentWeaponDamage === "2k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
  } else if (currentWeaponDamage === "2k5+1") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
    parseInt(professionLevel) + bonusDamageFromChiCombat +
    bonusDamageFromAssassination +
      1;
  } else if (currentWeaponDamage === "2k5+2") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
    parseInt(professionLevel) + bonusDamageFromChiCombat +
    bonusDamageFromAssassination+
      2;
  } else if (currentWeaponDamage === "1k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
  } else if (currentWeaponDamage === "1k5+1") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevel) +
    parseInt(professionLevel) + bonusDamageFromChiCombat +
    bonusDamageFromAssassination+
      1;
  } else if (currentWeaponDamage === "1k5+2") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevel) +
    parseInt(professionLevel) + bonusDamageFromChiCombat +
    bonusDamageFromAssassination +
      2;
  } else if (currentWeaponDamage === "3k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) * 2 +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
  } else if (currentWeaponDamage === "1k10") {
    damageResult.innerText =
      originalDarkDice +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
  } else if (currentWeaponDamage === "1k10+1") {
    damageResult.innerText =
      originalDarkDice +
      parseInt(destroyerLevel) +
      parseInt(professionLevel) + bonusDamageFromChiCombat +
      bonusDamageFromAssassination + 1;
  } else if (currentWeaponDamage === "1k2") {
    damageResult.innerText =
    Math.ceil(originalDarkDice / 5) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
  } else if (currentWeaponDamage === "2k2") {
    damageResult.innerText = Math.ceil(originalDarkDice / 5) +
    Math.ceil(originalLightDice / 5) +
    parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombat+
      bonusDamageFromAssassination;
    }
    if (currentlySelectedWeapon.w_name == "Fúvócső") {
      damageResult.innerText = 1
    }
    if (weapons.value == "Célzott mágia" || diceRolledSetToFalseBySpellNeedsAimRoll == true) {
      let spellDamage = 0
      if (legendPointIsUsedOnAimedSpell == true) {
        spellDamage = multipleDiceRoll(originalDarkDice, originalLightDice, parseInt(thirdAccumulatedDiceResultSelect.value), parseInt(numberOfDiceInput.value))
      } else if (legendPointIsUsedOnAimedSpell == false) {
        spellDamage = multipleDiceRoll(originalDarkDice, originalLightDice, 0, parseInt(numberOfDiceInput.value))
      }
      damageResult.innerText = spellDamage[3]
      firstAccumulatedDiceResultSelect.value = spellDamage[0]
      secondAccumulatedDiceResultSelect.value = spellDamage[1]
      thirdAccumulatedDiceResultSelect.value = spellDamage[2]
    }
// Ezekben a zárójelen belüli esetekben nincs ijász szabály
    if (originalDarkDice == 10 && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) &&
      currentlySelectedWeapon.w_name != "Fúvócső" && currentlySelectedWeapon.w_name != "Célzott mágia" &&
      darkDiceWasChangedToHalfOfStr == false && legendPointUsedOnDarkDice == false) {
      let archeryBonusDmg = 0

      for (let i = 0; i < 3; i++) {
        let currentRandomArcheryBonusRoll = Math.floor(generator.random() * 10)
        if (currentRandomArcheryBonusRoll == 0) {
          currentRandomArcheryBonusRoll = 10
          if (currentlySelectedWeapon.w_damage.includes('k5')) {
               currentRandomArcheryBonusRoll = 5
          } else if (currentlySelectedWeapon.w_damage.includes('k2')) {
            currentRandomArcheryBonusRoll = 2
             }
          archeryBonusDmg += currentRandomArcheryBonusRoll
        } else if (currentRandomArcheryBonusRoll != 0) {
          if (currentlySelectedWeapon.w_damage.includes('k5')) {
            currentRandomArcheryBonusRoll = Math.ceil(currentRandomArcheryBonusRoll/2)
          } else if (currentlySelectedWeapon.w_damage.includes('k2')) {
            currentRandomArcheryBonusRoll = Math.ceil(currentRandomArcheryBonusRoll/5)
          }
          archeryBonusDmg += currentRandomArcheryBonusRoll
          break
        }
      }
      damageResult.innerText = parseInt(damageResult.innerText) + archeryBonusDmg
      damageResult.animate([{color: "white"}, {color:"black"}],200)
      
      console.log("íjász szabály:",archeryBonusDmg)
    }

    console.log("Sötét erősebzés:", originalDarkDice, "Világos:", originalLightDice)
    darkDiceWasChangedToHalfOfStr = false
    damageResult.animate([{color: "white"}, {color:"black"}],200)
}

  function handleAttackRollLPCheckBox() {
    if (attackRollUseLegendPointCheckBox.checked == true && (diceRolled == true || diceRolledSetToFalseBySpellNeedsAimRoll == true)) {
      darkDiceResultSelect.disabled = false
      lightDiceResultSelect.disabled = false
      attackRollButton.disabled = true
      if (disarmWasUsedThisRound == true) {
        disarmRadioButton.checked = true
      }
    } else {
      darkDiceResultSelect.disabled = true
      lightDiceResultSelect.disabled = true
    }
    if (attackRollUseLegendPointCheckBox.checked == false) {
      attackRollButton.disabled = false
      disarmRadioButton.checked = false
    }
  }

  let legendPointIsUsedOnAimedSpell = false
  
  function handleWhenLegendPointIsUsed(event) {
    if (event.target.id == "darkDiceResultSelect") {
      legendPointUsedOnDarkDice = true
      darkDiceRerollByCounterLP.style.display = "grid"
    } else if (event.target.id == "lightDiceResultSelect") {
      legendPointUsedOnLightDice = true
      lightDiceRerollByCounterLP.style.display = "grid"
    }
if (diceRolledSetToFalseBySpellNeedsAimRoll == true) {
  legendPointIsUsedOnAimedSpell = true
}
    handleClickOnAttackRollButton(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value))
    legendPointIsUsedOnAimedSpell = false
    diceRolledSetToFalseBySpellNeedsAimRoll = false
    if (numberOfClicksAtTwoWeaponAttack == 1) {
    }
    disarmRadioButton.checked = false
    disarmWasUsedThisRound = false
    attackRollUseLegendPointCheckBox.style.display = "none"
    darkDiceResultSelect.disabled = true
    lightDiceResultSelect.disabled = true
    attackRollButton.disabled = false
    if (attackRollUseLegendPointCheckBox.checked == false && initRolled == true && diceRolled == true) {
      attackRollButton.disabled = true
    }
    if (combinationRadioButton.checked == true || quickShotRadioButton.checked == true || numberOfClicksAtTwoWeaponAttack==1) {
      attackRollButton.disabled = false
    }
    legendPointUsedOnDarkDice = false
    legendPointUsedOnLightDice = false
  }

  function handleWeaponOrShieldChange() {
    handleFileRead();

    let allAimedBodyParts = document.querySelectorAll('ul#aimedAttackList li input')
    for (let i = 0; i < allAimedBodyParts.length; i++) {
     allAimedBodyParts[i].checked = false 
    }
allResultsCleaner()
    attackRollUseLegendPointCheckBox.style.display = "none"
    if (initRolled == true) {
      weapons.disabled = true
      offHand.disabled = true
      weaponChangeButton.disabled = false
      reloadIsNeeded = false
    }
  }

  function handleBossCounterLPdark() {
       darkDiceResultSelect.value=Math.floor(generator.random() * 10)
     handleClickOnAttackRollButton(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value));
     attackRollUseLegendPointCheckBox.style.display = "none"
    darkDiceRerollByCounterLP.style.display = "none"
    lightDiceRerollByCounterLP.style.display = "none"
  }
  
  function handleBossCounterLPlight() {
    lightDiceResultSelect.value=Math.floor(generator.random() * 10)
  handleClickOnAttackRollButton(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value));
  attackRollUseLegendPointCheckBox.style.display = "none"
 darkDiceRerollByCounterLP.style.display = "none"
 lightDiceRerollByCounterLP.style.display = "none"
  }

function removeAllAttributeOptions() {
  const selectElement = document.getElementById('attributes');
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
}
function removeAllSkillOptions() {
  const selectElement = document.getElementById('skills');
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
}
    
  
  let charAttributes = ["Erő", "Gyo", "Ügy", "Áll", "Egé", "Kar", "Int", "Aka", "Asz", "Érz"]
  let currentCharFinalAttributes = []
//   function handleFileImportClick() {
//     window.location.reload();
  // }
  //****************************************************************************** */
  // ********************************** Fájlbeolvasó függvény *************************
  //********************************************************************************* */
  async function handleFileRead() {

    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      async () => {
        allActiveBuffs = document.querySelectorAll("ul#listOfCurrentlyActiveBuffs li")
        anyOtherHmoModifier.disabled = false
        skillCheckRollButton.style.display = "grid"
        actionsWrapper.style.display = "grid"

        // ***** berakunk egy observert, hogy figyelje az első buff helyét, és ha üres, akkor töltse oda az alatta lévőt
        let observer = new MutationObserver(async(event) => {
          if (event[0].target.innerText == '') {
            for (let i = 0; i < allActiveBuffs.length; i++) {
              if (allActiveBuffs[i].innerText == '') {
                let nodeToRemoveThenAppend = allActiveBuffs[i].parentElement
                listOfCurrentlyActiveBuffs.removeChild(nodeToRemoveThenAppend)
                listOfCurrentlyActiveBuffs.appendChild(nodeToRemoveThenAppend)
              }
            }
            allActiveBuffs = document.querySelectorAll("ul#listOfCurrentlyActiveBuffs li")
          }
        })
        for (let i = 0; i < allActiveBuffs.length; i++) {
          observer.observe(allActiveBuffs[i], {childList:true, subtree:true});
        }

        // if (activeBuffsStringArray[i].includes("Fájdalomtűrés") && !activeBuffsArray.includes("Fájdalomtűrés")) {
        //   allActiveBuffs[i].parentElement.lastChild.value = "Fájdalomtűrés"
        //   activeBuffsArray.push("Fájdalomtűrés")
        // }
        
        
        let indexOfFirstWeapon = 0
        for (indexOfFirstWeapon; indexOfFirstWeapon < JSON.parse(reader.result).weaponSets.length; indexOfFirstWeapon++) {
          if (JSON.parse(reader.result).weaponSets[indexOfFirstWeapon] != null) {
            break;
          }
        }

        if (fileFirstLoaded == true && JSON.parse(reader.result).weaponSets[indexOfFirstWeapon] != null) {
          for (let i = 0; i < props.weapons.length; i++) {
            if (props.weapons[i].w_name.includes(JSON.parse(reader.result).weaponSets[indexOfFirstWeapon].rightWeapon)) {
              weapons.value = props.weapons[i].w_name
              if (props.weapons[i].w_name.includes('egykézzel') || props.weapons[i].w_name.includes('dobva')) {
                for (let j = i; j < props.weapons.length; j++) {
                  if (props.weapons[j].w_name.includes('kétkézzel')) {
                    weapons.value = props.weapons[j].w_name;
                    break
                  }
                }
              }
              break
            }
          }
        }
        let filteredArrayIfHasHeavyArmorSkill = JSON.parse(reader.result).skills.filter((name) => name.name == "Vértviselet")
        let extentOfCurrentArmorSet = 0
        let armorSetMgt = 0
        function armorHandler() {
          if (JSON.parse(reader.result).armourSet == null) {
            return
          }

          let armorPieces = JSON.parse(reader.result).armourSet.pieces
          if (armorPieces.length == 0) {
            equippedOrNot.style.display = 'none'
            return
          }
          // let armorObject = []
          if (filteredArrayIfHasHeavyArmorSkill.length != 0) {
            mgtCompensation = parseInt(filteredArrayIfHasHeavyArmorSkill[0].level) * 2
            if (filteredArrayIfHasHeavyArmorSkill[0].level == 4) {
              mgtCompensation = 9
            }
            if (filteredArrayIfHasHeavyArmorSkill[0].level == 5) {
              mgtCompensation = 12
            }
          }
          if (equippedOrNotSetToManual == false) {
            equippedOrNot.checked = true
          
            console.log(armorPieces)
            for (let j = 0; j < props.armors.length; j++) {
              if (armorPieces[0] == props.armors[j].nameOfArmor) {
                checkWhereItIsWorn(props.armors[j], mgtCompensation)
                break
              } else {
                continue
              }
            }
          }
          // for (let i = 0; i < armorObject.length; i++) {
          //   //armorSetMgt += Math.round(armorObject[i].materialIndex * armorObject[i].kit.length)           
          // }
        }
        armorHandler()
        //--- itt nézi meg az épp kiválasztott fegyver és pajzs tulajdonságait a weapons.json-ból 
        currentlySelectedWeapon = props.weapons.find(
          (name) => name.w_name === `${weapons.value}`
        )
        let currentlySelectedOffHand = props.weapons.find(
          (name) => name.w_name === `${offHand.value}`
        )

        //--- karakter neve és kasztja
        charClass.innerText = JSON.parse(reader.result).classKey
        charLevel.innerText = `${JSON.parse(reader.result).level}. szintű`
        charRace.innerText = JSON.parse(reader.result).raceKey
        charName.innerText = JSON.parse(reader.result).charName

        //---- szűrés olyan fegyvertípusokra amikre a karakternek van fegyverhasználat képzettsége
        let filteredArrayByType = JSON.parse(reader.result).skills.filter((name) => name.name == "Fegyverhasználat" && currentlySelectedWeapon.w_type.includes(name.subSkill) || name.name == "Ökölharc" && currentlySelectedWeapon.w_type == "Ökölharc");
        //-----szűrés különböző adottságokra
        let filteredArrayIfHasDestroyer = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Pusztító");
        filteredArrayIfHasExtraReaction = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Extra reakció");
        let filteredArrayIfHasMasterWep = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Mesterfegyver" && JSON.parse(reader.result).masterWeapon == `${currentlySelectedWeapon.w_name}`);
        let filteredArrayIfHasWarriorMonk = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Harcművész");
        let filteredArrayIfHasVigorous = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Életerős");
        let filteredArrayIfHasMagicallyAttuned = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Varázstudó");
        let filteredArrayIfHasNimble = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Fürge");
        filteredArrayIfHasManaFlow = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Mana vezető");
        filteredArrayIfHasAnyAffinity = JSON.parse(reader.result).aptitudes.filter((name) => {
          if (name.aptitude != null) {
            return name.aptitude.includes("affinitás")
          }
        });
        //----szűrés képzettségekre
        filteredArrayIfHasPsi = JSON.parse(reader.result).skills.filter((name) => {
          if (name.name != null) {
            return name.name.includes("Pszi")
          }
        });
 
        if (filteredArrayIfHasPsi.length != 0) {
          psiDisciplinesSelectWrapper.style.display = "grid"
        }
        filteredArrayIfHasCombination = JSON.parse(reader.result).skills.filter((name) => name.name == "Kombináció")
        filteredArrayIfHasQuickShot = JSON.parse(reader.result).skills.filter((name) => name.name == "Kapáslövés")
        filteredArrayIfHasTwoWeaponAttack = JSON.parse(reader.result).skills.filter((name) => name.name == "Kétkezes harc")

        if (filteredArrayIfHasCombination.length != 0) {
          combinationModifiersIndex = filteredArrayIfHasCombination[0].level
        }
        if (filteredArrayIfHasQuickShot.length != 0) {
          quickShotModifiersIndex = filteredArrayIfHasQuickShot[0].level
        }
        if (filteredArrayIfHasTwoWeaponAttack.length != 0) {
          twoWeaponAttackModifiersIndex = filteredArrayIfHasTwoWeaponAttack[0].level
        }
        
        let filteredArrayIfHasAnyMagicSkill = JSON.parse(reader.result).skills.filter((name) => schoolsOfMagic.includes(name.name));
        let filteredArrayIfHasAnyMagicSkillSubSkill = JSON.parse(reader.result).skills.filter((name) => schoolsOfMagicSubClass.includes(name.name));
        // --------- objektumba rendezzük a mágiaformákat ahol az érték azoknak a szintje
        // ------de ha szakrális mágiáról van szó, akkor az speciális lesz, ezért erre kell egy külön függvény

        if (charClass.innerText.toLowerCase().includes("pap")) {
          for (let i = 0; i < filteredArrayIfHasAnyMagicSkillSubSkill.length; i++) {
            allMagicSubskillsObject[`${filteredArrayIfHasAnyMagicSkillSubSkill[i].name} - ${filteredArrayIfHasAnyMagicSkillSubSkill[i].subSkill}`] = filteredArrayIfHasAnyMagicSkillSubSkill[i].level
          }
        } else {
          for (let i = 0; i < filteredArrayIfHasAnyMagicSkillSubSkill.length; i++) {
            allMagicSubskillsObject[`${filteredArrayIfHasAnyMagicSkillSubSkill[i].subSkill}`] = filteredArrayIfHasAnyMagicSkillSubSkill[i].level
          }
        }
        allMagicSubskillsObject = Object.entries(allMagicSubskillsObject)
        console.log(allMagicSubskillsObject)

        filteredArrayIfHasParry = JSON.parse(reader.result).skills.filter((name) => name.name == "Hárítás")
        let filteredArrayIfHasRunning = JSON.parse(reader.result).skills.filter((name) => name.name == "Futás")
        filteredArrayIfHasAssassination = JSON.parse(reader.result).skills.filter((name) => name.name == "Orvtámadás")
        if (filteredArrayIfHasAssassination.length != 0) {
          bonusDamageFromAssassination = filteredArrayIfHasAssassination[0].level
        }
//-------- Ha egy fegyvernek több tipusa is van, kiválasztja a legmagasabb szintűt
        let allLevelsArray = []

        if (filteredArrayByType.length != 0) {
          for (let i = 0; i < filteredArrayByType.length; i++) {
            allLevelsArray.push(filteredArrayByType[i].level)
          }
          professionLevel = parseInt(Math.max(...allLevelsArray))
        } else {
          professionLevel = 0
        }
        
        if (filteredArrayIfHasDestroyer.length != 0 && !checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
          destroyerLevel = parseInt(filteredArrayIfHasDestroyer[0].level)
        } else {
          destroyerLevel = 0
        }

        let currentChar = props.chars.find(
          (name) => name.classKey == JSON.parse(reader.result).classKey
        )
//adott karakter(kaszt) alap statjai
        let currentCharBaseAttributeValues = Object.values(currentChar).slice(1, 11)
        
        //------ Ez itt csúnyán van hardcodolva, keresés kéne az attrSpreadArray object entries-be majd
        let attrSpreadArray = Object.values(JSON.parse(reader.result).attrSpread)
        let currentRace = props.races.find(
          (name) => name.raceKey == JSON.parse(reader.result).raceKey
        )
        let agingArray = Object.values(JSON.parse(reader.result).ageing.distribution)
        // faji módosító objektum értékei
        let currentRaceModifiers = Object.values(currentRace).slice(1, 11);
//--------------------------------------------------------------------------------

function modifierCalculator(index1, index2, index3) {
  let currentModifier = 0
  currentModifier += (attrSpreadArray[index1] - agingArray[index1] + currentRaceModifiers[index1]);
  currentModifier += (attrSpreadArray[index2] - agingArray[index2] + currentRaceModifiers[index2]);
  currentModifier += (attrSpreadArray[index3] - agingArray[index3] + currentRaceModifiers[index3]);
  return currentModifier
}
let atkModifier = modifierCalculator(0,1,2)
let aimModifier = modifierCalculator(2,7,9)
let defModifier = modifierCalculator(1,2,9)

        function findAndCountAttributesThatModifyStats(attr1, attr2, attr3) {
          let attrBuyingObj = JSON.parse(reader.result).attrBuying
        let numberOfBoughtAttributes = 0
        for (let i = 0; i < attrBuyingObj.length; i++) {
          for (let j = 0; j < attrBuyingObj[i].length; j++) {
            if (attrBuyingObj[i][j] == attr1) {
              numberOfBoughtAttributes++
            } else if (attrBuyingObj[i][j] == attr2) {
              numberOfBoughtAttributes++
            } else if (attrBuyingObj[i][j] == attr3) {
              numberOfBoughtAttributes++
            }
          }
        }
  return numberOfBoughtAttributes
        }
        //---------------------- betölti a tul. értékeket és képzettségeket
        //------------------------------------------------------------
      if (fileFirstLoaded == true) {
        toggleAllallActionBarButtonsExceptInitRollDisplay()

        for (let i = 0; i < 10; i++) {
          let currentAttribute = currentCharBaseAttributeValues[i] + attrSpreadArray[i]
          + findAndCountAttributesThatModifyStats(`${charAttributes[i]}`) + currentRaceModifiers[i] - agingArray[i]
          let attrOption = document.createElement('option');
          attrOption.innerText = charAttributes[i];
          attrOption.value = [currentAttribute, charAttributes[i]];
          attributes.appendChild(attrOption);
          //itt kerülnek meghatározásra a végső tulajdonság értékek
          currentCharFinalAttributes.push(currentAttribute)
        }
        // itt rakja be az összes skillt a skillCheck komponensbe
        for (let i = 0; i < JSON.parse(reader.result).skills.length; i++) {
          if (JSON.parse(reader.result).skills[i].name != null) {          
          let skillOption = document.createElement('option');
          skillOption.value = [JSON.parse(reader.result).skills[i].level, JSON.parse(reader.result).skills[i].name];
          let tempLevelNameStore = parseInt(JSON.parse(reader.result).skills[i].level);
          if (JSON.parse(reader.result).skills[i].subSkill) {
            skillOption.innerText = `${JSON.parse(reader.result).skills[i].name} (${JSON.parse(reader.result).skills[i].subSkill}) (${skillLevelsMeaning[tempLevelNameStore - 1]})`;
          } else {
            skillOption.innerText = `${JSON.parse(reader.result).skills[i].name} (${skillLevelsMeaning[tempLevelNameStore - 1]})`;
          }
          skills.appendChild(skillOption);
          } else {
            continue
          }
        }
      }
        
        ///----- a karakter szintjéből adódó értékek
        let sumAtkGainedByLevel = JSON.parse(reader.result).level * currentChar.atkPerLvl
        let sumDefGainedByLevel = JSON.parse(reader.result).level * currentChar.defPerLvl
        let sumAimGainedByLevel = JSON.parse(reader.result).level * currentChar.aimPerLvl
        let sumFpGainedByLevel = JSON.parse(reader.result).level * currentChar.fpPerLvl
        let sumPpGainedByLevel = JSON.parse(reader.result).level * currentChar.ppPerLvl
        let sumMpGainedByLevel = JSON.parse(reader.result).level * currentChar.mpPerLvl
        let sumInitiativeGainedByLevel = JSON.parse(reader.result).level * currentChar.initPerLvl
                
        let baseAtk = JSON.parse(reader.result).stats.TÉ + currentChar.str+currentChar.spd+currentChar.dex + atkModifier
          + findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Erő") + sumAtkGainedByLevel
          + JSON.parse(reader.result).spentHm.TÉ
        let baseAim = JSON.parse(reader.result).stats.CÉ + currentChar.dex + currentChar.wll + currentChar.per + aimModifier 
          + findAndCountAttributesThatModifyStats("Ügy", "Aka", "Érz") + sumAimGainedByLevel
          +JSON.parse(reader.result).spentHm.CÉ
        let baseDef = JSON.parse(reader.result).stats.VÉ + currentChar.spd + currentChar.dex + currentChar.per + 60 + defModifier 
          + findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Érz") + sumDefGainedByLevel
          +JSON.parse(reader.result).spentHm.VÉ
        
        let masterWeaponModifier = 0
        
        if (filteredArrayIfHasMasterWep.length!=0) {
          masterWeaponModifier = parseInt(filteredArrayIfHasMasterWep[0].level)
        } else {
          masterWeaponModifier = 0
        }
   //----- TÉ/VÉ/CÉ számítás a fegyver értékekkel együtt
        let atkWithProfession = baseAtk+parseInt(professionLevel) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier)
        let aimWithProfession = baseAim+parseInt(professionLevel) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier)
        let defWithProfession = baseDef + parseInt(professionLevel) * (currentlySelectedWeapon.weaponDef + masterWeaponModifier)
        
        function tvcoCalculator(atkAimDef) {
          let calculatedTVCO = 0
          if (atkAimDef % 10 == 0) {
            calculatedTVCO = atkAimDef / 10
          } else if (atkAimDef % 5 == 0) {
            calculatedTVCO = Math.floor(atkAimDef / 10) + 0.5
          } else if (atkAimDef % 10 > 5) {
            calculatedTVCO = Math.floor((atkAimDef - atkAimDef % 10)) / 10 + 0.5
          } else if (atkAimDef % 10 < 5) {
            calculatedTVCO = (atkAimDef - (atkAimDef % 10)) / 10
          }
          return calculatedTVCO
        }
        // ki kellett menteni a varázslatokhoz
        baseAimWithTeoCalculator = tvcoCalculator(baseAim)
        //--- külön az erő tulajdonság, ami az oldalon megjelenik

        initiative.innerText = currentCharFinalAttributes[1] + currentCharFinalAttributes[6] + currentCharFinalAttributes[9] + sumInitiativeGainedByLevel + JSON.parse(reader.result).stats.KÉ;
        // legenerálja a fizikai tulajdonságok nevét és értékét
        if (fileFirstLoaded == true) {
          for (let i = 0; i < 5; i++) {
            let physicalAttributeNameDiv = document.createElement("div")
            let physicalAttributeValueDiv = document.createElement("div")
            physicalAttributeNameDiv.classList.add("physicalAttributeName")
            physicalAttributeValueDiv.classList.add("physicalAttributeValue")
            physicalAttributeValueDiv.setAttribute('id', `${charAttributes[i]}`)
            physicalAttributeNameDiv.innerText = charAttributes[i] + ":"
            physicalAttributeValueDiv.innerText = currentCharFinalAttributes[i]
            skillCheckLeftSideWrapper.appendChild(physicalAttributeNameDiv)
            skillCheckLeftSideWrapper.appendChild(physicalAttributeValueDiv)
          }
          // legenerálja a szellemi tulajdonságok nevét és értékét
          for (let i = 5; i < 10; i++) {
            let spiritualAttributeNameDiv = document.createElement("div")
            let spiritualAttributeValueDiv = document.createElement("div")
            spiritualAttributeNameDiv.classList.add("spiritualAttributeName")
            spiritualAttributeValueDiv.classList.add("spiritualAttributeValue")
            spiritualAttributeNameDiv.innerText = charAttributes[i] + ":"
            spiritualAttributeValueDiv.innerText = currentCharFinalAttributes[i]
            skillCheckRightSideWrapper.appendChild(spiritualAttributeNameDiv)
            skillCheckRightSideWrapper.appendChild(spiritualAttributeValueDiv)
          }
        }
// az ökölhöz tartozó legmagasabb tulajdonságokat alapból 4-el kell osztani alapból *********************
        
        let fistAtkDivider = 4
        let charStrWithWarriorMonkAptitude = currentCharFinalAttributes[0]
// van-e harcművész adottság?
        if (filteredArrayIfHasWarriorMonk.length != 0) {
            if (parseInt(filteredArrayIfHasWarriorMonk[0].level) == 2) {
              fistAtkDivider = 3
              charStrWithWarriorMonkAptitude +=1
            } else if (parseInt(filteredArrayIfHasWarriorMonk[0].level) == 3) {
              fistAtkDivider = 2
              charStrWithWarriorMonkAptitude +=3
            }
        }
        else {
          fistAtkDivider = 4
        }
       
        if (currentlySelectedWeapon.w_type == "Ökölharc") {
          //megnézi a legmagasabb tul-t és elosztja az ököl osztóval, ami a harcművész adottsággal változhat
          let fistAtk = Math.floor(Math.max(currentCharFinalAttributes[0], currentCharFinalAttributes[1], currentCharFinalAttributes[2])/fistAtkDivider);
          let fistDef = Math.floor(Math.max(currentCharFinalAttributes[1], currentCharFinalAttributes[2])/fistAtkDivider);
          atkWithProfession = baseAtk + parseInt(professionLevel) * (fistAtk);
          defWithProfession = baseDef + parseInt(professionLevel) * (fistDef);
        }
     
        let reducedMgtByParrySkill = currentlySelectedOffHand.mgt
        let anyOtherHmoModifierValue = anyOtherHmoModifier.value
        if (anyOtherHmoModifier.value == "") {
          anyOtherHmoModifierValue = 0
        }

        // TÉ VÉ CE értékek számítása ******************************
        //*********************************************************** */
        if (filteredArrayIfHasParry.length != 0) {
          reducedMgtByParrySkill = currentlySelectedOffHand.mgt - filteredArrayIfHasParry[0].level
          if (reducedMgtByParrySkill < 0) {
            reducedMgtByParrySkill = 0
          }
          charDefWithParry.value = tvcoCalculator(defWithProfession + Math.floor(currentlySelectedOffHand.weaponDef * (filteredArrayIfHasParry[0].level / 2)))
          - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
          + chiCombatAtkDefModifier - innerTimeNegativeModifier
        } else {
          charDefWithParry.value = tvcoCalculator(defWithProfession)
          - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
          + chiCombatAtkDefModifier - innerTimeNegativeModifier
        } 
        
        if (filteredArrayIfHasNimble.length != 0) {
          charDefWithEvasion.value = tvcoCalculator(defWithProfession) + 0.5 + 0.5 * parseInt(filteredArrayIfHasNimble[0].level)
          - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
          + chiCombatAtkDefModifier - innerTimeNegativeModifier
        } else if (filteredArrayIfHasNimble.length == 0) {
          charDefWithEvasion.value = tvcoCalculator(defWithProfession) + 0.5
          - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
          + chiCombatAtkDefModifier - innerTimeNegativeModifier
        }
        
        if (!checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
          charAtk.value = tvcoCalculator(atkWithProfession)
          - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
          + chiCombatAtkDefModifier - innerTimeNegativeModifier + findWeakSpotModifier
          // if (charAtk.value < 0) {
          //   charAtk.value = 0
          // }
        } else {
          charAtk.value = tvcoCalculator(aimWithProfession)
            - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
            - innerTimeNegativeModifier
          // if (charAtk.value < 0) {
          //   charAtk.value = 0
          // }
        }
        charDef.value = tvcoCalculator(defWithProfession)
          - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText / 2)
          + chiCombatAtkDefModifier - innerTimeNegativeModifier

        //********************************************************************************************** */
        // Kiszámolja a maximális és cselekedetenkénti mozgás távot. Ez függ az MGT-től, ezért van ennyire lent
        // *********************************************************************************************
        let speedBonusFromRunningSkill = 0
        if (filteredArrayIfHasRunning.length !=0) {
          speedBonusFromRunningSkill = filteredArrayIfHasRunning[0].level *2
        }
        let correctedSpeedValueForMovementCalculation = currentCharFinalAttributes[1]+speedBonusFromRunningSkill-currentlySelectedWeapon.mgt-reducedMgtByParrySkill-parseInt(totalMgtOfArmorSet.innerText)
        maxMove.innerText = `Max táv: ${(correctedSpeedValueForMovementCalculation)*4} láb`
        movePerAction.innerText = `/akció táv: ${Math.ceil((correctedSpeedValueForMovementCalculation*4)/(1+Math.ceil((parseInt(initiative.innerText)+1)/10)))} láb`


// *******************************************************************
        // erő alapján alap ököl sebzés kiszámítása

        if (charStrWithWarriorMonkAptitude <= 5) {
          damageOfFists = "1k2"
        } else if ([6, 7, 8].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k2"   
        } else if ([9, 10, 11].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "1k5"   
        } else if ([12, 13, 14].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "1k5+1"   
        } else if ([15, 16, 17].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "1k5+2"  
        } else if ([18, 19, 20].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k5"   
        } else if ([21, 22, 23].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k5+1"  
        } else if ([24, 25, 26].includes(charStrWithWarriorMonkAptitude)) {
          damageOfFists = "2k5+2" 
        } else if (charStrWithWarriorMonkAptitude >= 27) {
          damageOfFists = "3k5"  
        }
        //-------- mana, fp és pszi számítás kell
        //-----pszi
        let lowestStatForPsiPoints = Math.min(currentCharFinalAttributes[6], currentCharFinalAttributes[7], currentCharFinalAttributes[8])
        let psiMultiplier = 0
        if (filteredArrayIfHasPsi.length !=0) {
          psiMultiplier = parseFloat(filteredArrayIfHasPsi[0].level / 2)
        }
        let psiPoints = Math.floor(lowestStatForPsiPoints * psiMultiplier + JSON.parse(reader.result).stats.Pp) + sumPpGainedByLevel
        //--------------------fp
        let fpPoints = JSON.parse(reader.result).stats.Fp + sumFpGainedByLevel + currentCharFinalAttributes[3] + currentCharFinalAttributes[7]
        //------------------ mana
        let attributeNeededToCalculateManaPoints = 0
        let highestMagicSkillLevel = 0
        let highestMagicSkillName = ""
        let modifierByMagicallyAttunedAptitude = 0;
        //------ varázstudó adottságból jövő tulajdonság módosító
        if (filteredArrayIfHasMagicallyAttuned.length!=0) {
          if (filteredArrayIfHasMagicallyAttuned[0].level == 2) {
            modifierByMagicallyAttunedAptitude = 3
          } else if (filteredArrayIfHasMagicallyAttuned[0].level == 3) {
            modifierByMagicallyAttunedAptitude = 6
          }
        }
        if (filteredArrayIfHasAnyMagicSkill.length != 0) {
          let allMagicSkillLevelsArray = []
          for (let i = 0; i < filteredArrayIfHasAnyMagicSkill.length; i++) {
            allMagicSkillLevelsArray.push(filteredArrayIfHasAnyMagicSkill[i].level)
          }
          highestMagicSkillLevel = parseInt(Math.max(...allMagicSkillLevelsArray))
        } 
        //------ a legmagasabb mágikus képzettség neve is kell a mana számításhoz
        let filteredArrayForNameOfHighestMagicalSkill = filteredArrayIfHasAnyMagicSkill.filter((skill) => skill.level == highestMagicSkillLevel);
        if (filteredArrayForNameOfHighestMagicalSkill[0] != null) {
          highestMagicSkillName = filteredArrayForNameOfHighestMagicalSkill[0].name
        } else {
          highestMagicSkillName = ""
        }
        for (let i = 0; i < schoolsOfMagic.length; i++){
          if (highestMagicSkillName == schoolsOfMagic[i])
          {
            attributeNeededToCalculateManaPoints = currentCharFinalAttributes[attributeIndexesForSchoolsOfMagic[i]] + modifierByMagicallyAttunedAptitude;
            for (let j = 0; j < props.gods.length; j++) {
              if (currentChar.classKey.includes(props.gods[j].nameOfGod)) {
                attributeNeededToCalculateManaPoints = currentCharFinalAttributes[props.gods[j].attributeIndex] + modifierByMagicallyAttunedAptitude;
                break
              }
            }
            break;
          }
        }

        let manaPoints = attributeNeededToCalculateManaPoints * highestMagicSkillLevel + sumMpGainedByLevel + JSON.parse(reader.result).stats.Mp
        if (filteredArrayIfHasMagicallyAttuned.length !=0 && filteredArrayIfHasMagicallyAttuned[0].level == 0) {
          manaPoints = 0;
        }
         
        let vigorousModifier = 0
        if (filteredArrayIfHasVigorous.length!=0) {
          vigorousModifier = parseInt(filteredArrayIfHasVigorous[0].level)
        } else {
          vigorousModifier = 0
        }

        if (fileFirstLoaded == true) {
          const data = {
            charName: charName.innerText,
            currentFp: fpPoints,
            currentEp: currentCharFinalAttributes[4] + vigorousModifier*2,
            currentPp: psiPoints,
            currentMp: manaPoints,
            currentLp: 3
          };
      
          maxFp.innerText = fpPoints,
          maxEp.innerText = currentCharFinalAttributes[4] + vigorousModifier*2,
          maxPp.innerText = psiPoints,
          maxMp.innerText = manaPoints,
          maxLp.innerText = 3

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
          fetchCharacterData(charName.innerText)
        } 
        fileFirstLoaded = false;
        //*********************************************************************************************************************************************************************** */
        //*Az összes komplex manőver kiválasztása, és ha a fegyver távolsági, akkor azok letiltása. Ezen felül a kétkezes harc letiltása, ha a fegyvert két kézzel kell forgatni
        //*********************************************************************************************************************************************************************** */
        arrayOfAllComplexMaeuvers = document.querySelectorAll('ul#selectableComplexManeuversList li input')
        weaponsOptions = document.querySelectorAll("select#weapons option")

        if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true) {
          combinationRadioButton.disabled = true
          quickShotRadioButton.disabled = false
          for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
            arrayOfAllComplexMaeuvers[i].disabled = true
          }
          findWeakSpotButton.disabled = true
          if(combinationWasUsedThisRound == true){
            hmoModifier(quickShotModifiers[quickShotModifiersIndex])
          }
        }
        if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
          combinationRadioButton.disabled = false
          quickShotRadioButton.disabled = true
          for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
            arrayOfAllComplexMaeuvers[i].disabled = false
              twoWeaponAttackRadioButton.disabled = false
          }
          findWeakSpotButton.disabled = false
          if (weapons.value.includes('kétkézzel') || weapons.value.includes('Kétkezes') || weapons.value.includes('Pallos') || weapons.value.includes('Alabárd')) {
            twoWeaponAttackRadioButton.disabled = true
          }
          if(combinationWasUsedThisRound == true){
            hmoModifier(combinationModifiers[combinationModifiersIndex])
            combinationRadioButton.disabled = true
            quickShotRadioButton.disabled = true
          }
        }
        if (chargeWasUsedThisRound == true) {
          charDef.value = parseFloat(charDef.value) -1
          charDefWithParry.value = parseFloat(charDefWithParry.value) -1
          charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) -1
        }
        if (twoWeaponAttackWasUsedThisRound==true) {
          hmoModifier(twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
        }
        if (initRolled == false && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
          for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
            arrayOfAllComplexMaeuvers[i].disabled = true
            if (arrayOfAllComplexMaeuvers[i].value == 'Fegyvertörés' ||
              arrayOfAllComplexMaeuvers[i].value == 'Lefegyverzés' || 
              arrayOfAllComplexMaeuvers[i].value == 'Orvtámadás') {
                arrayOfAllComplexMaeuvers[i].disabled = false
            }
          }
        }
        if (!weapons.value.includes('Ököl')) {
          wrestlingRadioButton.disabled = true
        }
        if (weapons.value.includes('Ököl')) {
          wrestlingRadioButton.disabled = false
        }
        if (reloadIsNeeded == false) {
          reloadButton.disabled = true
          warningWindow.innerText = ""
        }
        if (maxMp.innerText == 0) {
          spellCastButtonWrapper.style.display = 'none'
        }
      },
    );    
    
    if (file) {
      reader.readAsText(file);
    }
  }

  // ez a számláló a pszi roham miatt van
  let numberOfClicksForAttacks = 0
  //ez pedig a kétkezes harc miatt
  let numberOfClicksAtTwoWeaponAttack = 0
  
  //************************************************************************ */
  //------------------a támadó dobás
  //************************************************************************ */
  async function handleClickOnAttackRollButton(darkDice, lightDice) {
    if (charRace.innerText == "") {
      alert('Importálj egy karaktert!')
      return
    }

    //*********************************************************************** */
    //** Ne számoljon, ha legendapont használat volt, ez az if több helyen is megjelenik ugyanezen okból */
    if (legendPointUsedOnDarkDice == false && legendPointUsedOnLightDice == false) {
      numberOfClicksForAttacks++
    }

    if (twoWeaponAttackRadioButton.checked == true && legendPointUsedOnDarkDice == false && legendPointUsedOnLightDice == false) {
      numberOfClicksAtTwoWeaponAttack++
    }

    warningWindow.innerText = ""
    bodyPartImg.innerHTML = "";
    charAtkSumText.innerText = "Össz TÉO"
    charAtkSum.innerText = "";
    specialEffect.innerText = "nincs";
    chosenWeapon.innerText = "Választott fegyver:"
    bigSpellDamageRollLegendPointCheckBox.checked = false
    bigSpellDamageRollLegendPointCheckBox.style.display = 'none'
  
    //-----------------------megnézni, hogy van-e erő sebzés 
    
    if (currentlySelectedWeapon.strBonusDmg == false) {
      rollResult.innerText = ttkRoll(false, darkDice, lightDice);
      rollResult.animate([{color: "white"}, {color:"black"}],200)
    } else if (currentlySelectedWeapon.strBonusDmg == true) {
      rollResult.innerText = ttkRoll(true, darkDice, lightDice);
      rollResult.animate([{color: "white"}, {color:"black"}],200)
    }
    diceRolled = true
    attackRollUseLegendPointCheckBox.style.display = "grid"
    attackRollUseLegendPointCheckBox.checked = false

    damageResult.innerText = "";

    bodyPart.innerText = "";

    if (charAtk.value < 0) {
      charAtkSum.innerText = rollResult.innerText;
      charAtkSum.animate([{color: "white"}, {color:"black"}],200)
    } else {
      charAtkSum.innerText =
        parseFloat(rollResult.innerText) + parseFloat(charAtk.value);
        charAtkSum.animate([{color: "white"}, {color:"black"}],200)
    }
    
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
    bodyPart.animate([{color: "white"}, {color:"black"}],200)
    damageEvaluator()
   async function playerChecker (){ 
      const data = {
      charName: charName.innerText,
      atkRollResult: parseInt(charAtkSum.innerText),
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
    playerChecker()

    // ********************************************************************************************************************
    // ---- megnézi, hogy van-e kiválasztva összetett manőver és először a képzettségeket veszi figyelembe, és próbát is dob
    //**********************************************************************************************************************
    //******************************************************************************************************************* */
    
    let selectAllSkillOptions = document.querySelectorAll('select#skills option')
    let selectAllAttributeOptions = document.querySelectorAll('select#attributes option')
    for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
      if (arrayOfAllComplexMaeuvers[i].checked == true && arrayOfAllComplexMaeuvers[i].value=='Fegyvertörés') {
        for (let j = 0; j < selectAllSkillOptions.length; j++) {
          if (selectAllSkillOptions[j].value.includes('Fegyvertörés')) {
            skills.value = selectAllSkillOptions[j].value
            break
          }
          skills.value = 0
        }
      for (let i = 0; i < selectAllAttributeOptions.length; i++) {
        if (selectAllAttributeOptions[i].innerText == "Erő") {
          attributes.value = selectAllAttributeOptions[i].value
        }
      }
        evaluateSkillOrAttributeCheckBase()
        handleSkillCheck(false, originalLightDice)
allResultsCleaner()
        charAtkSumText.innerText = "Próba végeredménye:"
        charAtkSum.innerText = skillCheckResult.innerText
        break
      }
      if (arrayOfAllComplexMaeuvers[i].checked == true && arrayOfAllComplexMaeuvers[i].value == 'Lefegyverzés') {
        disarmWasUsedThisRound = true
        for (let j = 0; j < selectAllSkillOptions.length; j++) {
          if (selectAllSkillOptions[j].value.includes('Lefegyverzés')) {
            skills.value = selectAllSkillOptions[j].value
            break
          }
          skills.value = 0
        }
        for (let i = 0; i < selectAllAttributeOptions.length; i++) {
          if (selectAllAttributeOptions[i].innerText == "Ügy") {
            attributes.value = selectAllAttributeOptions[i].value
          }
        }
        if (currentlySelectedWeapon.disarmingWeapon == true) {
          succFailModifier.value = 1
        }
        if (currentlySelectedWeapon.disarmingWeapon == false) {
          succFailModifier.value = 0
        }
        evaluateSkillOrAttributeCheckBase()
        handleSkillCheck(false, originalLightDice)
allResultsCleaner()
        charAtkSumText.innerText = "Próba végeredménye:"
        specialEffect.innerText = "nincs";
        charAtkSum.innerText = skillCheckResult.innerText
        break
      }
    }
    if (spellNeedsAimRoll == true) {
      diceRolled = false
      diceRolledSetToFalseBySpellNeedsAimRoll = true
      setTimeout(() => {
        currentlySelectedWeapon = weaponBeforeCasting
        weapons.value = weaponBeforeCasting.w_name
        charAtk.value = charAtkValueSave
        handleFileRead()
      }, 500);
    }
    //ha volt kezdeményező dobás
    if (initRolled == true) {
      initiativeRerollByCounterLP.style.display = 'none'
      for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
        if (arrayOfAllComplexMaeuvers[i].checked == true) {
          totalActionCostOfAttackSetter(arrayOfAllComplexMaeuvers[i].parentElement.value)
        }
      }
      if (combinationRadioButton.checked == false && quickShotRadioButton.checked == false && spellNeedsAimRoll==false) {
        attackRollButton.disabled = true
      }
      if (rollButtonWasDisabledBeforeSpellCast==true) {
        attackRollButton.disabled = true
      }
      if (combinationRadioButton.checked == true || quickShotRadioButton.checked == true) {
        attackRollButton.disabled = false
      }
      if (numberOfClicksAtTwoWeaponAttack == 1) {
        attackRollButton.disabled = false
      }
      //************************************************************************************************************************** */
      //Ebben a körben volt kombináció vagy kapáslövés használva, ezért a minusz HMO-k maradnak
      //*************************************************************************************************************************** */
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true) {
        combinationRadioButton.disabled = true
        quickShotRadioButton.disabled = false
      }
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false) {
        combinationRadioButton.disabled = false
        quickShotRadioButton.disabled = true
      }
      if (combinationRadioButton.checked == true || quickShotRadioButton.checked == true) {
        
          combinationRadioButton.disabled = true
          quickShotRadioButton.disabled = true  
        
        combinationWasUsedThisRound = true
        diceRolledSetToFalseBySpellNeedsAimRoll = false
      }
      if ((legendPointUsedOnDarkDice == false && legendPointUsedOnLightDice == false) && spellNeedsAimRoll == false && attackOfOpportunityOn == false) {
          spellCastingFailure() 
          numberOfActionsSpentOnCastingCurrentSpellNullifier()
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - totalActionCostOfAttack
        actionsSpentSinceLastCastAdderCheckerAndNullifier(totalActionCostOfAttack)
      }
      if (parseInt(numberOfActions.innerText) < 2) {
        tacticsButton.disabled = true
      }
      //************************************************************************************************************************** */
      //Ebben a körben volt roham használva, ezért a minusz VÉO-k maradnak, de a +TÉO elveszik, mert csak 1 támadásra volt érvényes
      //*************************************************************************************************************************** */
      if (chargeRadioButton.checked == true) {
        chargeWasUsedThisRound = true
        chargeRadioButton.disabled = true
        setTimeout(() => {
          charAtk.value = parseFloat(charAtk.value) - 1
        }, 1000);
      }
      // kétkezes harc bejelölésével az első kattintásra a twoWeaponAttackWasUsedThisRound változó igaz lesz, ezért ez alapján módosíthatjuk a 2.dobás körülményeit,
      // mintha az lenne a másik kéz
      
      if (numberOfClicksAtTwoWeaponAttack == 2 && twoWeaponAttackWasUsedThisRound == true &&legendPointUsedOnDarkDice == false && legendPointUsedOnLightDice == false) {
        weapons.disabled = true
        twoWeaponAttackRadioButton.disabled = false
        weapons.value = mainHandWeaponWhenTwoWeaponAttackIsUsed
        
        numberOfClicksAtTwoWeaponAttack = 0
        if (combinationWasUsedThisRound == true) {
          totalActionCostOfAttackSetter(+1)
        }
        handleFileRead();
      }
      if (numberOfClicksAtTwoWeaponAttack==1) {
        twoWeaponAttackWasUsedThisRound = true
      }
      
      if (diceRolled == true && numberOfClicksAtTwoWeaponAttack == 1 && legendPointUsedOnDarkDice == false && legendPointUsedOnLightDice == false) {
        weapons.disabled = false
        chosenWeapon.innerText = "Kétk.harc másik kéz:"
        twoWeaponAttackRadioButton.disabled = true
        
        mainHandWeaponWhenTwoWeaponAttackIsUsed = currentlySelectedWeapon.w_name
        if (combinationWasUsedThisRound == true) {
          totalActionCostOfAttackSetter(-1)
        }
      }

      setTimeout(() => {
        if (parseInt(numberOfActions.innerText) < totalActionCostOfAttack) {
          attackRollButton.disabled = true
        }
      }, 200);
      if (legendPointUsedOnDarkDice == false && legendPointUsedOnLightDice == false) {
        if (assassinationRadioButton.checked == true) {
          charAtk.value = parseFloat(charAtk.value) - filteredArrayIfHasAssassination[0].level - 3
          assassinationToFalse()
        }
        if (findWeakSpotOn == true) {
          charAtk.value = parseFloat(charAtk.value) - findWeakSpotModifier
          findWeakSpotModifierNullifier()
          findWeakSpotOnToFalse()
          findWeakSpotButton.disabled = false
        }
        if (attackOfOpportunityOn == true) {
          attackOfOpportunityOnSetToFalse()
          handleFileRead()
          attackOfOpportunityButton.disabled = false
        }
        for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
          if (arrayOfAllComplexMaeuvers[i].checked == true) {
            arrayOfAllComplexMaeuvers[i].checked = false
            totalActionCostOfAttackSetter(-arrayOfAllComplexMaeuvers[i].parentElement.value)
          }
        }
        if (numberOfClicksAtTwoWeaponAttack ==1) {
          twoWeaponAttackRadioButton.checked = true
        }
      }
      if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==true && currentlySelectedWeapon.w_type != "MÁGIA"&&spellNeedsAimRoll==false) {
        reloadIsNeeded = true
        attackRollButton.disabled = true
        reloadButton.disabled = false
        if (currentlySelectedWeapon.w_type=="VET" || currentlySelectedWeapon.w_type=="NYD" || currentlySelectedWeapon.w_type=="PD") {
          blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime} CS`)
        } else {
          blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime} CS`)
        }
       // ammoAmountInput.value--
      }
    }
    spellNeedsAimRollSetToFalse()
    console.log("totalActionCostOfAttack",totalActionCostOfAttack)
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
<div className="fileInputWrapper">
  <button className="customFileButton">Karakter importálása</button>
  <input type="file" id="inputFile" accept=".txt" onChange={handleFileRead}/>
</div>

        <div className={styles.weaponsContainer}>
          <label htmlFor="weapons" id="chosenWeapon">
            Választott fegyver:
          </label>
          <select id="weapons" name="weapons" onChange={handleWeaponOrShieldChange}>
             {props.weapons.map((e) => {
              return (
                <option key={e.w_id}>
                  {e.w_name}
                </option>
              );
            })} 
          </select>
          <label htmlFor="charAtk" id="charAtkLabel">
            Karakter TÉO/CÉO
          </label>
          <input type="text" name="charAtk" id="charAtk" />
          <label htmlFor="charDef" id="charDefLabel">
            Karakter VÉO
          </label>
          <input type="text" name="charDef" id="charDef"/>
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
             {props.weapons.filter((e)=>e.w_type == "PAJ").map((e) => {
              return (
                <option key={e.w_id}>
                  {e.w_name}
                </option>
              );
            })}  
            </select>
            <label htmlFor="anyOtherHmoModifier" id="anyOtherHmoModifierLabel">
            Egyéb +/- HMO:
          </label>
            <input type='number' step={0.5} name="anyOtherHmoModifier" id="anyOtherHmoModifier" onChange={handleFileRead} disabled={true} defaultValue={0}/>
        </div>
        <div id="rollResultWrapper">
          <label htmlFor="darkDiceResultSelect" id="darkDiceResult">
            Sötét kocka:
          </label>
          <select id="darkDiceResultSelect" name="" onChange={handleWhenLegendPointIsUsed} disabled={true}>
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="lightDiceResultSelect" id="lightDiceResult">
            Világos kocka:
          </label>
          <select id="lightDiceResultSelect" name="" onChange={handleWhenLegendPointIsUsed} disabled={true}>
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label id="attackRollUseLegendPointCheckBoxlabel" htmlFor="attackRollUseLegendPointCheckBox">Lp-t használok!</label>
          <input type="checkBox" id="attackRollUseLegendPointCheckBox" onChange={handleAttackRollLPCheckBox} />
          <button id="darkDiceRerollByCounterLP" onClick={handleBossCounterLPdark}></button>
          <button id="lightDiceRerollByCounterLP" onClick={handleBossCounterLPlight}></button>
        </div>
          <div id="bodyPartImg"></div>
          <AimedAttack />
        <button type=""
          id="attackRollButton"
          className={styles.attackRollButton}
            onClick={handleClickOnAttackRollButton}
        >
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
          <CharacterDetails/>
          <ActionList {...props} />
          <PsiDisciplines {...props}/>
        </div>
        {/* <img id="dividingLine" src="/divider.png"></img> */}
          <SkillCheck {...props} />
      </main>
    </>
  );
}
