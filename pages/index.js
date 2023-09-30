import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import path from "path";
import CharacterDetails, { initRolled } from "../Components/CharacterDetails";
import ActionList from "../Components/ActionsList";
import ArmorDetails from "../Components/ArmorDetails";
import LegendRoll from "../Components/LegendRoll";
import { checkWhereItIsWorn } from "../Components/ArmorDetails";
import SkillCheck from "../Components/SkillCheck";
import PsiDisciplines, {
  specialAtkModifierFromPsiAssault, availableNumberOfAttacksFromPsiAssault, bonusDamageFromChiCombat, activeBuffsArray,
  buffRemoverFromActiveBuffArrayAndTextList, allActiveBuffs, psiAtkDefModifier
} from "../Components/PsiDisciplines";
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
    let atkRollResult = document.getElementById('atkRollResult');
    if (atkRollResult !=undefined) {
      atkRollResult.value = parsedData.atkRollResult;
    }
    let atkRollResultAfter5sec = document.getElementById('atkRollResultAfter5sec');
    if (atkRollResultAfter5sec !=undefined) {
      atkRollResultAfter5sec.value = parsedData.atkRollResultAfter5sec;
    }
    let skillCheckResultOfCurrentPlayer = document.getElementById('skillCheckResultOfCurrentPlayer');
    if (skillCheckResultOfCurrentPlayer !=undefined) {
      skillCheckResultOfCurrentPlayer.value = parsedData.skillCheckResult;
    }
    let skillCheckResultAfter5sec = document.getElementById('skillCheckResultAfter5sec');
    if (skillCheckResultAfter5sec !=undefined) {
      skillCheckResultAfter5sec.value = parsedData.skillCheckResultAfter5sec;
    }
    let atkRollDice = document.getElementById('atkRollDice');
    if (atkRollDice !=undefined) {
      atkRollDice.value = parsedData.atkRollDice;
    }
    let atkRollDiceAfter5sec = document.getElementById('atkRollDiceAfter5sec');
    if (atkRollDiceAfter5sec !=undefined) {
      atkRollDiceAfter5sec.value = parsedData.atkRollDiceAfter5sec;
    }
    let skillCheckDice = document.getElementById('skillCheckDice');
    if (skillCheckDice !=undefined) {
      skillCheckDice.value = parsedData.skillCheckDice;
    }
    let skillCheckDiceAfter5sec = document.getElementById('skillCheckDiceAfter5sec');
    if (skillCheckDiceAfter5sec !=undefined) {
      skillCheckDiceAfter5sec.value = parsedData.skillCheckDiceAfter5sec;
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
  return {
    props: {
      allSkills,
      armors,
      chars,
      gods,
      psiDisciplines,
      races,
      weapons
    },
  };
};

export let mgtCompensation = 0
export let rollOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export let filteredArrayIfHasExtraReaction
export let filteredArrayIfHasAnyAffinity
export let filteredArrayIfHasPsi
export const specialCases1 = [2, 3, 4];
export const specialCases2 = [5, 6, 7];
export const specialCases3 = [8, 9];
export let fileFirstLoaded = true
let filteredArrayIfHasParry
let legendPointUsedOnDarkDice = false
let bonusDamageFromChiCombatSave = bonusDamageFromChiCombat

// --- itt kezdődik az oldal maga
export default function Home(props) {

//custom sort function to sort data by name

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

//custom sort function call
  OrderFunc(props.weapons)
let damageOfFists = "1k10"
  let destroyerLevel
  let professionLevel
  let bodyParts = [
    "bal láb",
    "jobb láb",
    "bal kar",
    "fegyverforgató kar",
    "fegyverforgató kar",
    "törzs",
    "törzs",
    "törzs",
    "törzs",
    "fej",
  ];
  let schoolsOfMagic = ["Magas Mágia", "Bárdmágia", "Boszorkánymágia", "Borszorkánymesteri mágia", "Tűzvarázslói mágia", "Szakrális mágia"];
  let attributeIndexesForSchoolsOfMagic = [6,5,8,7,7,5]
  let skillLevelsMeaning = ["If", "Af", "Kf", "Mf", "Lf"];
  let originalDarkDice = 0;
  let originalLightDice = 0;

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
        darkDiceResultSelect.value = darkDice
        lightDiceResultSelect.value = lightDice
      }
    
    //lightDice = 3
    //darkDice = 0 
    /* -- ez a felső két sor a dobások tesztelésére van  */

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

    if (lightDice == darkDice && specialCases1.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[1];
    } else if (lightDice == darkDice && specialCases2.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[2];
    } else if (lightDice == darkDice && specialCases3.includes(darkDice)) {
      specialEffect.innerText = specialModifiers[3];
    } else if (lightDice == darkDice && darkDice == 1) {
      specialEffect.innerText = specialModifiers[0];
    } else if (lightDice == darkDice && darkDice == 10) {
      specialEffect.innerText = specialModifiers[4];
    }
    console.log("Sötét eredeti:", originalDarkDice, "Világos:", originalLightDice)
    if (strBonus == true) {
      if (Math.floor(parseInt(Erő.innerText) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(Erő.innerText) / 2);
        darkDiceWasChangedToHalfOfStr = true
      }
    }
console.log(numberOfClicksForAttacks, availableNumberOfAttacksFromPsiAssault)
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

  function checkIfWeaponIsRanged(currentlySelectedWeaponType) {
    for (let i = 0; i < rangedWeaponsArray.length; i++) {
      if (currentlySelectedWeaponType.includes(rangedWeaponsArray[i])) {
        return true
      } 
    }return false
  }

//-------------- Megnézi a sebzéskódot, és számol sebzést ------------
  
  async function damageEvaluator() {
    const currentWeapon = props.weapons.find(
      (name) => name.w_name === `${weapons.value}`
    );
    console.log("Fegyver típus:", currentWeapon.w_type);
    console.log("Fegyver sebzéskód:", currentWeapon.w_damage);
    console.log("Erősebzés?:", currentWeapon.strBonusDmg);
  if (checkIfWeaponIsRanged(currentWeapon.w_type)) {
    destroyerLevel = 0  
    } 
   if (diceRolled == false) {
    return
    }
    if (activeBuffsArray.includes('Chi-harc')) {
      bonusDamageFromChiCombatSave = bonusDamageFromChiCombat
    } else {
      bonusDamageFromChiCombatSave = 0
    }
    // ha nem történt kezdeményező dobás, akkor csak 1 támadásig érvényes a chi harc
    if (initiativeWithRoll.innerText == '' && activeBuffsArray.includes('Chi-harc')) {
      buffRemoverFromActiveBuffArrayAndTextList('Chi-harc')
      charAtk.value = parseFloat(charAtk.value) - psiAtkDefModifier;
      charDef.value = parseFloat(charDef.value) - psiAtkDefModifier;
      charDefWithParry.value = parseFloat(charDefWithParry.value) - psiAtkDefModifier;
      charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - psiAtkDefModifier;
    }

    //ez a két változó csak az ökölharc miatt kell
    //let professionLevel = professionLevelSelect.value
let currentWeaponDamage = currentWeapon.w_damage
if (currentWeapon.w_type == "Ökölharc") {
  currentWeaponDamage = damageOfFists
  professionLevel = Math.ceil(professionLevel / 2);
  if (currentWeapon.w_name == "Vasököl") {
    professionLevel +=1
  }
    }
  if (currentWeaponDamage === "2k10") {
    damageResult.innerText =
      originalDarkDice +
      originalLightDice +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
  } else if (currentWeaponDamage === "2k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
  } else if (currentWeaponDamage === "2k5+1") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave +
      1;
  } else if (currentWeaponDamage === "2k5+2") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave +
      2;
  } else if (currentWeaponDamage === "1k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
  } else if (currentWeaponDamage === "1k5+1") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave +
      1;
  } else if (currentWeaponDamage === "1k5+2") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave +
      2;
  } else if (currentWeaponDamage === "3k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) * 2 +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
  } else if (currentWeaponDamage === "1k10") {
    damageResult.innerText =
      originalDarkDice +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
  } else if (currentWeaponDamage === "1k10+1") {
    damageResult.innerText =
      originalDarkDice +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave+1;
  } else if (currentWeaponDamage === "1k2") {
    damageResult.innerText =
    Math.ceil(originalDarkDice / 5) +
      parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
  } else if (currentWeaponDamage === "2k2") {
    damageResult.innerText = Math.ceil(originalDarkDice / 5) +
    Math.ceil(originalLightDice / 5) +
    parseInt(destroyerLevel) +
      parseInt(professionLevel)+bonusDamageFromChiCombatSave;
    }
    if (currentWeapon.w_name == "Fúvócső") {
      damageResult.innerText = 1
    }

    if (originalDarkDice == 10 && checkIfWeaponIsRanged(currentWeapon.w_type) &&
      currentWeapon.w_name != "Fúvócső" && currentWeapon.w_name != "Célzott mágia" &&
      darkDiceWasChangedToHalfOfStr == false && legendPointUsedOnDarkDice == false) {
      let archeryBonusDmg = 0

      for (let i = 0; i < 3; i++) {
        let currentRandomArcheryBonusRoll = Math.floor(generator.random() * 10)
        if (currentRandomArcheryBonusRoll == 0) {
          currentRandomArcheryBonusRoll = 10
          if (currentWeapon.w_damage.includes('k5')) {
               currentRandomArcheryBonusRoll = 5
          } else if (currentWeapon.w_damage.includes('k2')) {
            currentRandomArcheryBonusRoll = 2
             }
          archeryBonusDmg += currentRandomArcheryBonusRoll
        } else if (currentRandomArcheryBonusRoll != 0) {
          if (currentWeapon.w_damage.includes('k5')) {
            currentRandomArcheryBonusRoll = Math.ceil(currentRandomArcheryBonusRoll/2)
          } else if (currentWeapon.w_damage.includes('k2')) {
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

  function handleCheckBox() {
    if (useLegendPointCheckBox.checked == true && diceRolled == true) {
      darkDiceResultSelect.disabled = false
      lightDiceResultSelect.disabled = false
      rollButton.disabled = true
    } else {
      darkDiceResultSelect.disabled = true
      lightDiceResultSelect.disabled = true
    }
    if (useLegendPointCheckBox.checked == false) {
      rollButton.disabled = false
    }
  }

  
  function handleWhenLegendPointIsUsed(event) {
    if (event.target.id == "darkDiceResultSelect") {
      legendPointUsedOnDarkDice = true
      darkDiceRerollByCounterLP.style.display = "grid"
} else if (event.target.id == "lightDiceResultSelect") {
  lightDiceRerollByCounterLP.style.display = "grid"
}
    handleClick(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value))
    useLegendPointCheckBox.style.display = "none"
    darkDiceResultSelect.disabled = true
    lightDiceResultSelect.disabled = true
    rollButton.disabled = false
    legendPointUsedOnDarkDice = false
  }

  function handleWeaponOrShieldChange() {
    handleFileRead();
    rollResult.innerText = ""
    damageResult.innerText = ""
    bodyPart.innerText = ""
    charAtkSum.innerText = ""
    specialEffect.innerText = "nincs"
    useLegendPointCheckBox.style.display = "none"
  }

  function handleBossCounterLPdark() {
       darkDiceResultSelect.value=Math.floor(generator.random() * 10)
     handleClick(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value));
     useLegendPointCheckBox.style.display = "none"
    darkDiceRerollByCounterLP.style.display = "none"
    lightDiceRerollByCounterLP.style.display = "none"
  }
  
  function handleBossCounterLPlight() {
    lightDiceResultSelect.value=Math.floor(generator.random() * 10)
  handleClick(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value));
  useLegendPointCheckBox.style.display = "none"
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
    
  let rangedWeaponsArray = ["ÍJ", "VET", "NYD", "PD", "SZÍ", "Fúvócső", "MÁGIA"]
  let charAttributes = ["Erő", "Gyo", "Ügy", "Áll", "Egé", "Kar", "Int", "Aka", "Asz", "Érz"]
  let currentCharFinalAttributes = []
//   function handleFileImportClick() {
//     window.location.reload();
// }
// ********************************** Fájlbeolvasó függvény *************************
  async function handleFileRead() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      async () => {
        anyOtherHmoModifier.disabled = false
        skillCheckRollButton.style.display = "grid"
        actionsWrapper.style.display = "grid"

        
        let indexOfFirstWeapon = 0
        for (indexOfFirstWeapon; indexOfFirstWeapon < JSON.parse(reader.result).weaponSets.length; indexOfFirstWeapon++) {
          if (JSON.parse(reader.result).weaponSets[indexOfFirstWeapon]!=null) {
            break;
          } 
        }

        if (fileFirstLoaded == true && JSON.parse(reader.result).weaponSets[indexOfFirstWeapon] != null) {
          for (let i = 0; i < props.weapons.length; i++) {
            if (props.weapons[i].w_name.includes(JSON.parse(reader.result).weaponSets[indexOfFirstWeapon].rightWeapon)) {
              weapons.value = props.weapons[i].w_name
              if (props.weapons[i].w_name.includes('egykézzel') || props.weapons[i].w_name.includes('dobva')){
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
         // let armorObject = []
          if (filteredArrayIfHasHeavyArmorSkill.length != 0) {
            mgtCompensation = parseInt(filteredArrayIfHasHeavyArmorSkill[0].level) * 2
          }
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
          // for (let i = 0; i < armorObject.length; i++) {
          //   //armorSetMgt += Math.round(armorObject[i].materialIndex * armorObject[i].kit.length)           
          // }
        }
armorHandler()
//--- itt nézi meg az épp kiválasztott fegyver és pajzs tulajdonságait a weapons.json-ból 
        let currentlySelectedWeapon = props.weapons.find(
          (name) => name.w_name === `${weapons.value}`
        )
        let currentlySelectedOffHand = props.weapons.find(
          (name) => name.w_name === `${offHand.value}`
        )
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
        filteredArrayIfHasAnyAffinity = JSON.parse(reader.result).aptitudes.filter((name) => {
          if (name.aptitude != null) {
            return name.aptitude.includes("affinitás") 
          }
        });
        console.log(filteredArrayIfHasAnyAffinity)
        //----szűrés képzettségekre
        filteredArrayIfHasPsi = JSON.parse(reader.result).skills.filter((name) => {
          if (name.name != null) {
            return name.name.includes("Pszi") 
          }
        });
        console.log(filteredArrayIfHasPsi)
        if (filteredArrayIfHasPsi.length != 0) {
          psiDisciplinesSelectWrapper.style.display = "grid"
        }
        let filteredArrayIfHasAnyMagicSkill = JSON.parse(reader.result).skills.filter((name) => schoolsOfMagic.includes(name.name));
        filteredArrayIfHasParry = JSON.parse(reader.result).skills.filter((name) => name.name == "Hárítás")
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
        //--- karakter neve és kasztja
        charClass.innerText = JSON.parse(reader.result).classKey 
        charLevel.innerText = `${JSON.parse(reader.result).level}. szintű`
        charRace.innerText = JSON.parse(reader.result).raceKey
        charName.innerText = JSON.parse(reader.result).charName

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
        
        for (let i = 0; i < 10; i++) {
          let currentAttribute = currentCharBaseAttributeValues[i] + attrSpreadArray[i]
          + findAndCountAttributesThatModifyStats(`${charAttributes[i]}`) + currentRaceModifiers[i] - agingArray[i]
          let attrOption = document.createElement('option');
          attrOption.innerText = charAttributes[i];
          attrOption.value = currentAttribute;
          attributes.appendChild(attrOption);
          //itt kerülnek meghatározásra a végső tulajdonság értékek
          currentCharFinalAttributes.push(currentAttribute)
        }
        
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
        console.log(baseAtk, baseDef, baseAim)
        let masterWeaponModifier = 0
        
        if (filteredArrayIfHasMasterWep.length!=0) {
          masterWeaponModifier = parseInt(filteredArrayIfHasMasterWep[0].level)
        } else {
          masterWeaponModifier = 0
        }
   //----- TÉ/VÉ/CÉ számítás a fegyver értékekkel együtt
        let atkWithProfession = baseAtk+parseInt(professionLevel) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier)
        let aimWithProfession = baseAim+parseInt(professionLevel) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier)
        let defWithProfession = baseDef+parseInt(professionLevel) * (currentlySelectedWeapon.weaponDef + masterWeaponModifier)
        console.log(atkWithProfession, defWithProfession, aimWithProfession)
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

        if (filteredArrayIfHasParry.length != 0) {
          reducedMgtByParrySkill = currentlySelectedOffHand.mgt - filteredArrayIfHasParry[0].level
          if (reducedMgtByParrySkill < 0) {
            reducedMgtByParrySkill = 0
          }
          charDefWithParry.value = tvcoCalculator(defWithProfession + Math.floor(currentlySelectedOffHand.weaponDef * (filteredArrayIfHasParry[0].level / 2))) - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)
        } else {
          charDefWithParry.value = tvcoCalculator(defWithProfession) - reducedMgtByParrySkill / 2 - currentlySelectedWeapon.mgt / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)
        } 
        
        if (filteredArrayIfHasNimble.length != 0) {
          charDefWithEvasion.value = tvcoCalculator(defWithProfession) + 0.5 + 0.5*parseInt(filteredArrayIfHasNimble[0].level) - currentlySelectedWeapon.mgt / 2 - reducedMgtByParrySkill / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)
        } else if (filteredArrayIfHasNimble.length == 0) {
          charDefWithEvasion.value = tvcoCalculator(defWithProfession) + 0.5 - currentlySelectedWeapon.mgt / 2 - reducedMgtByParrySkill / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)
        }
        
        if (!checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
          charAtk.value = tvcoCalculator(atkWithProfession) - currentlySelectedWeapon.mgt / 2 - reducedMgtByParrySkill / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)
          // if (charAtk.value < 0) {
          //   charAtk.value = 0
          // }
        } else {
          charAtk.value = tvcoCalculator(aimWithProfession) - reducedMgtByParrySkill / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)
          // if (charAtk.value < 0) {
          //   charAtk.value = 0
          // }
        }
        charDef.value = tvcoCalculator(defWithProfession) - currentlySelectedWeapon.mgt / 2 - reducedMgtByParrySkill / 2 + parseFloat(anyOtherHmoModifierValue) - parseFloat(totalMgtOfArmorSet.innerText/2)

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
          const endpoint = "/api/createCharacter";
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
      },
    );    
    
    if (file) {
      reader.readAsText(file);
    }
  }

  let diceRolled = false;
let numberOfClicks = 0
let numberOfClicksForAttacks = 0
  async function handleClick(darkDice, lightDice) {
    if (charRace.innerText == "") {
      alert('Importálj egy karaktert!')
      return
    }
    numberOfClicks++
    numberOfClicksForAttacks++
    bodyPartImg.innerHTML = "";
    charAtkSum.innerText = "";
    specialEffect.innerText = "nincs";
  
    //-----------------------megnézni, hogy van-e erő sebzés 

    const currentWeaponSelected = props.weapons.find(
      (name) => name.w_name === `${weapons.value}`
    )
    
    if (currentWeaponSelected.strBonusDmg == "false") {
      rollResult.innerText = ttkRoll(false, darkDice, lightDice);
      rollResult.animate([{color: "white"}, {color:"black"}],200)
    } else if (currentWeaponSelected.strBonusDmg == "true") {
      rollResult.innerText = ttkRoll(true, darkDice, lightDice);
      rollResult.animate([{color: "white"}, {color:"black"}],200)
    }
    
    diceRolled = true
    useLegendPointCheckBox.style.display = "grid"
    useLegendPointCheckBox.checked = false

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

    let tempImg = document.createElement("img");
    tempImg.classList.add("tempImg");
    bodyPartImg.appendChild(tempImg);
    function currentBodypart(bodypart) {
      tempImg.src = "";
      tempImg.src = `./bodyParts/${bodypart}`;
      tempImg.animate([{ opacity: "0" }, { opacity: "1" }], 100);
    }
    if (bodyPart.innerText == "bal láb") {
      currentBodypart("LeftLeg.png");
    }
    if (bodyPart.innerText == "jobb láb") {
      currentBodypart("RightLeg.png");
    }
    if (bodyPart.innerText == "bal kar") {
      currentBodypart("LeftArm.png");
    }
    if (bodyPart.innerText == "fegyverforgató kar") {
      currentBodypart("RightArm.png");
    }
    if (bodyPart.innerText == "törzs") {
      currentBodypart("Torso.png");
    }
    if (bodyPart.innerText == "fej") {
      currentBodypart("Head.png");
    }
    bodyPart.animate([{color: "white"}, {color:"black"}],200)
    damageEvaluator()
   async function playerChecker (){ if (numberOfClicks == 1) {
      const data = {
      charName: charName.innerText,
      currentFp: parseInt(currentFp.value),
      currentEp: parseInt(currentEp.value),
      currentPp: parseInt(currentPp.value),
      currentMp: parseInt(currentMp.value),
      currentLp: parseInt(currentLp.value),
      atkRollResult: parseInt(charAtkSum.innerText),
      atkRollDice: `Sötét kocka: ${originalDarkDice}, Világos kocka: ${originalLightDice}`,
      atkRollResultAfter5sec: parseInt(charAtkSum.innerText),
      atkRollDiceAfter5sec: `Sötét kocka: ${originalDarkDice}, Világos kocka: ${originalLightDice}`,
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
     console.log(response)
    }
if(numberOfClicks > 1) {
  const data = {
    charName: charName.innerText,
    atkRollResultAfter5sec: parseInt(charAtkSum.innerText),
    atkRollDiceAfter5sec: `Sötét kocka: ${originalDarkDice}, Világos kocka: ${originalLightDice}`,
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
  console.log(response)
}

    setTimeout(() => {
      numberOfClicks = 0
    }, 7000);
    }
    playerChecker()
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
            <input type="number" step={0.5} name="anyOtherHmoModifier" id="anyOtherHmoModifier" onChange={handleFileRead} disabled={true} defaultValue={0}/>
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
          <label id="useLegendPointCheckBoxlabel" htmlFor="useLegendPointCheckBox">Lp-t használok!</label>
          <input type="checkBox" id="useLegendPointCheckBox" onChange={handleCheckBox} />
          <button id="darkDiceRerollByCounterLP" onClick={handleBossCounterLPdark}></button>
          <button id="lightDiceRerollByCounterLP" onClick={handleBossCounterLPlight}></button>
        </div>
        <div id="bodyPartImg"></div>
        <button type=""
          id="rollButton"
          className={styles.rollButton}
            onClick={handleClick}
          //onMouseEnter={handleMouseEnter}
        >
          Dobj
        </button>

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
          <LegendRoll />
          <ArmorDetails />
          <CharacterDetails />
          <ActionList />
          <PsiDisciplines {...props}/>
        </div>
        {/* <img id="dividingLine" src="/divider.png"></img> */}
          <SkillCheck {...props} />
      </main>
    </>
  );
}
