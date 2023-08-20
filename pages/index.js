import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import path from "path";

var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

export const getStaticProps = async () => {
  
  const fs = require("fs");
  const jsonDirectory = path.join(process.cwd(), "json");
  let feed = JSON.parse(
    fs.readFileSync(jsonDirectory + "/data.json", "utf8"));
    let chars = JSON.parse(
      fs.readFileSync(jsonDirectory + "/chars.json", "utf8"));
  return {
    props: {
      feed,
      chars
    },
  };
};

export default function Home(props) {
    
//custom sort function to sort data by name

    let alphabets = ["A", "Á","B", "C", "D","E","É","F","G","H","I","Í","J","K","L","M","N","O","Ó","Ö","Ő","P","Q","R","S",
                "T","U","Ú","Ü","Ű","V","W","X","Z"];

let aChar;
let bChar;
function OrderFunc(){
   props.feed.sort(function (a, b) {
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
OrderFunc(props.feed)
  
  let destroyerLevel = [0, 1, 2, 3];
  let professionLevel = [0, 1, 2, 3, 4, 5];
  let rollOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let skillCheckRollModifiers = [0, 1, 2, 3, 4, -1, -2, -3, -4];
  let skillCheckSuccFailModifiers = [0, 1, 2, 3, -1, -2, -3];
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


  let darkDice;
  let lightDice;
  let originalDarkDice = 0;
  let originalLightDice = 0;

//------------------------------------------------------------------------
  //-------A dobás ------
  const specialCases1 = [2, 3, 4];
  const specialCases2 = [5, 6, 7];
  const specialCases3 = [8, 9];


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
    
    /*      lightDice = 3
    darkDice = 0 */
    /* -- ez a felső két sor a dobások tesztelésére van  */

      console.log(darkDice, lightDice);

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
      "Egy ellenfél veszít 1 cselekedetet",
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

    if (strBonus == true) {
      if (Math.floor(parseInt(charStr.value) / 2) > darkDice) {
        originalDarkDice = Math.floor(parseInt(charStr.value) / 2);
      }
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
    const currentWeapon = props.feed.find(
      (name) => name.w_name === `${weapons.value}`
    );

  if (checkIfWeaponIsRanged(currentWeapon.w_type)) {
    destroyerLevelSelect.value = 0  
  } 

   if (diceRolled == false) {
    return
  }

  if (currentWeapon.w_damage === "2k10") {
    damageResult.innerText =
      originalDarkDice +
      originalLightDice +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  } else if (currentWeapon.w_damage === "2k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  } else if (currentWeapon.w_damage === "2k5+1") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value) +
      1;
  } else if (currentWeapon.w_damage === "2k5+2") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value) +
      2;
  } else if (currentWeapon.w_damage === "1k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  } else if (currentWeapon.w_damage === "1k5+1") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value) +
      1;
  } else if (currentWeapon.w_damage === "1k5+2") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value) +
      2;
  } else if (currentWeapon.w_damage === "3k5") {
    damageResult.innerText =
      Math.ceil(originalDarkDice / 2) * 2 +
      Math.ceil(originalLightDice / 2) +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  } else if (currentWeapon.w_damage === "1k10") {
    damageResult.innerText =
      originalDarkDice +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  } else if (currentWeapon.w_damage === "1k2") {
    if (originalDarkDice > 5) {
      darkDice = 2;
    } else {
      darkDice = 1;
    }
    damageResult.innerText =
      darkDice +
      parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  } else if (currentWeapon.w_damage === "2k2") {
    if (originalDarkDice > 5) {
      darkDice = 2;
    } else {
      darkDice = 1;
    }

    if (originalLightDice > 5) {
      lightDice = 2;
    } else {
      lightDice = 1;
    }

    damageResult.innerText = darkDice + lightDice+
    parseInt(destroyerLevelSelect.value) +
      parseInt(professionLevelSelect.value);
  }
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
  function handleSkillCheckUseLegendPointCheckBox() {
    if (skillCheckUseLegendPointCheckBox.checked == true && skillCheckRolled == true) {
      skillCheckLightDiceResultSelect.disabled = false
      if (skillCheckStressCheckbox.checked == false) {
        skillCheckDarkDiceResultSelect.disabled = true 
      } else if (skillCheckStressCheckbox.checked == true) {
        skillCheckDarkDiceResultSelect.disabled = false
      }
      skillCheckRollButton.disabled = true
    } else {
      skillCheckDarkDiceResultSelect.disabled = true
      skillCheckLightDiceResultSelect.disabled = true
    }
    if (skillCheckUseLegendPointCheckBox.checked == false) {
      skillCheckRollButton.disabled = false
    }
  }
  
  function handleWhenLegendPointIsUsed() {

   darkDiceRerollByCounterLP.style.display = "grid"
   lightDiceRerollByCounterLP.style.display = "grid"
        
    handleClick(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value))
    useLegendPointCheckBox.style.display = "none"
    darkDiceResultSelect.disabled = true
    lightDiceResultSelect.disabled = true
    rollButton.disabled = false
  }

  function handleWhenSkillCheckLegendPointIsUsed() {
    skillCheckLightDiceRerollByCounterLP.style.display = "grid"
    if (skillCheckStressCheckbox.checked == false) {
      skillCheckDarkDiceRerollByCounterLP.style.display = "none"
    } else if (skillCheckStressCheckbox.checked == true) {
      skillCheckDarkDiceRerollByCounterLP.style.display = "grid"
    }
    
   handleSkillCheck(true, parseInt(skillCheckLightDiceResultSelect.value), parseInt(skillCheckDarkDiceResultSelect.value))
   skillCheckUseLegendPointCheckBox.checked == false
   skillCheckUseLegendPointCheckBox.style.display = "none"
    skillCheckDarkDiceResultSelect.disabled = true
    skillCheckLightDiceResultSelect.disabled = true
 skillCheckRollButton.disabled = false
  }

  function handleWeaponChange() {
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
  
  function skillCheckHandleBossCounterLPdark() {
    for (let i = 0; i < 8; i++) {
      skillCheckDarkDiceResultSelect.value=Math.floor(generator.random() * 10)
    }
    handleSkillCheck(true, parseInt(skillCheckLightDiceResultSelect.value), parseInt(skillCheckDarkDiceResultSelect.value));
     skillCheckUseLegendPointCheckBox.style.display = "none"
     skillCheckDarkDiceRerollByCounterLP.style.display = "none"
     skillCheckLightDiceRerollByCounterLP.style.display = "none"
  }
  
  function skillCheckHandleBossCounterLPlight() {
    for (let i = 0; i < 8; i++) {
      skillCheckLightDiceResultSelect.value=Math.floor(generator.random() * 10)         
    }
    handleSkillCheck(true, parseInt(skillCheckLightDiceResultSelect.value), parseInt(skillCheckDarkDiceResultSelect.value));
    skillCheckUseLegendPointCheckBox.style.display = "none"
    skillCheckDarkDiceRerollByCounterLP.style.display = "none"
    skillCheckLightDiceRerollByCounterLP.style.display = "none"
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
  
  let rangedWeaponsArray = ["ÍJ", "VET", "NYD", "PD", "SZÍ"]
  let fileFirstLoaded = true
  let charAttributes = ["Erő", "Gyo", "Ügy", "Áll", "Egé", "Kar", "Int", "Aka", "Asz", "Érz"]
  let currentCharFinalAttributes = []
//   function handleFileImportClick() {
//     fileFirstLoaded = true
// }
  
  function handleFileRead() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        skillCheckRollButton.style.display = "grid"
        currentCharFinalAttributes = []
        removeAllAttributeOptions()
        removeAllSkillOptions()

        if (fileFirstLoaded == true && JSON.parse(reader.result).weaponSets[0]!= undefined) {
          weapons.value = JSON.parse(reader.result).weaponSets[0].rightWeapon
        } 
        let currentlySelectedWeapon = props.feed.find(
          (name) => name.w_name === `${weapons.value}`
        )
        let filteredArrayByType = JSON.parse(reader.result).skills.filter((name) => name.name == "Fegyverhasználat" && currentlySelectedWeapon.w_type.includes(name.subSkill))
        
        let filteredArrayIfHasDestroyer = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Pusztító");
        let filteredArrayIfHasMasterWep = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Mesterfegyver" && JSON.parse(reader.result).masterWeapon == `${currentlySelectedWeapon.w_name}`);

        let allLevelsArray = []

        if (filteredArrayByType.length != 0) {
          
          for (let i = 0; i < filteredArrayByType.length; i++) {
            allLevelsArray.push(filteredArrayByType[i].level)
          }
          professionLevelSelect.value = parseInt(Math.max(...allLevelsArray))
        } else {
          professionLevelSelect.value = 0
        }
        
        if (filteredArrayIfHasDestroyer.length != 0 && !checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
          
          destroyerLevelSelect.value = parseInt(filteredArrayIfHasDestroyer[0].level)
        } else {
          destroyerLevelSelect.value = 0
        }
        
        charClass.innerText = JSON.parse(reader.result).classKey 
        charName.innerText = JSON.parse(reader.result).charName

        let currentChar = props.chars.find(
          (name) => name.classKey == JSON.parse(reader.result).classKey
        )

        let currentCharBaseAttributeValues = Object.values(currentChar).slice(1, 11)

//------ Ez itt csúnyán van hardcodolva, keresés kéne az attrSpreadArray object entries-be majd
        let attrSpreadArray = Object.values(JSON.parse(reader.result).attrSpread)
//--------------------------------------------------------------------------------
        let atkModifier = attrSpreadArray[0] + attrSpreadArray[1] + attrSpreadArray[2]
        let aimModifier = attrSpreadArray[2] + attrSpreadArray[7] + attrSpreadArray[9]
        let defModifier = attrSpreadArray[1] + attrSpreadArray[2] + attrSpreadArray[9]

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
      
      for (let i = 0; i < 10; i++) {
        let currentAttribute = currentCharBaseAttributeValues[i] + attrSpreadArray[i] + findAndCountAttributesThatModifyStats(`${charAttributes[i]}`)
        let attrOption = document.createElement('option');
        attrOption.innerText = charAttributes[i];
        attrOption.value = currentAttribute;
        attributes.appendChild(attrOption);
        currentCharFinalAttributes.push(currentAttribute)
        }

        for (let i = 0; JSON.parse(reader.result).skills[i].name != null; i++) {
          let skillOption = document.createElement('option');
          skillOption.value = JSON.parse(reader.result).skills[i].level;
        if (JSON.parse(reader.result).skills[i].subSkill) {
          skillOption.innerText = JSON.parse(reader.result).skills[i].name + " " + "(" + JSON.parse(reader.result).skills[i].subSkill + ")";
        } else {
          skillOption.innerText = JSON.parse(reader.result).skills[i].name;
        }
          
        skills.appendChild(skillOption);
        }
        
        let sumAtkAutomaticallyGainedByLevel = JSON.parse(reader.result).level * currentChar.atkPerLvl
        let sumDefAutomaticallyGainedByLevel = JSON.parse(reader.result).level * currentChar.defPerLvl
        
        let baseAtk = JSON.parse(reader.result).stats.TÉ + currentChar.str+currentChar.spd+currentChar.dex + atkModifier
          + findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Erő") + sumAtkAutomaticallyGainedByLevel
          + JSON.parse(reader.result).spentHm.TÉ
        let baseAim = JSON.parse(reader.result).stats.CÉ + currentChar.dex + currentChar.wll + currentChar.per + aimModifier 
          + findAndCountAttributesThatModifyStats("Ügy", "Aka", "Érz")
          +JSON.parse(reader.result).spentHm.CÉ
        let baseDef = JSON.parse(reader.result).stats.VÉ + currentChar.spd + currentChar.dex + currentChar.per + 60 + defModifier 
          + findAndCountAttributesThatModifyStats("Gyo", "Ügy", "Érz") + sumDefAutomaticallyGainedByLevel
          +JSON.parse(reader.result).spentHm.VÉ
        
        let masterWeaponModifier = 0
        
        if (filteredArrayIfHasMasterWep.length!=0) {
          masterWeaponModifier = parseInt(filteredArrayIfHasMasterWep[0].level)
        } else {
          masterWeaponModifier = 0
        }
   
        let atkWithProfession = baseAtk+parseInt(professionLevelSelect.value) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier)
        let aimWithProfession = baseAim+parseInt(professionLevelSelect.value) * (currentlySelectedWeapon.weaponAtk + masterWeaponModifier)
        let defWithProfession = baseDef+parseInt(professionLevelSelect.value) * (currentlySelectedWeapon.weaponDef + masterWeaponModifier)
     
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
      
         if (!checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)) {
          charAtk.value = tvcoCalculator(atkWithProfession)
        } else {
          charAtk.value = tvcoCalculator(aimWithProfession)
         }
         
        charDef.value = tvcoCalculator(defWithProfession)
        
        charStr.value = currentChar.str + attrSpreadArray[0] + findAndCountAttributesThatModifyStats("Erő")               
        if (fileFirstLoaded == true) {
          for (let i = 0; i < 5; i++) {
            let physicalAttributeNameDiv = document.createElement("div")
            let physicalAttributeValueDiv = document.createElement("div")
            physicalAttributeNameDiv.classList.add("physicalAttributeName")
            physicalAttributeValueDiv.classList.add("physicalAttributeValue")
            physicalAttributeNameDiv.innerText = charAttributes[i] + ":"
            physicalAttributeValueDiv.innerText = currentCharFinalAttributes[i]
            skillCheckLeftSideWrapper.appendChild(physicalAttributeNameDiv)
            skillCheckLeftSideWrapper.appendChild(physicalAttributeValueDiv)
          }
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
        fileFirstLoaded = false
        evaluateSkillCheckBase()
      },
    );    
        
    if (file) {
      reader.readAsText(file);
    }
}

function evaluateSkillCheckBase() {
  skillCheckBase.innerText = skills.value * 2 + Math.floor(attributes.value / 2) + parseInt(succFailModifier.value);
  if (attributes.value % 2 == 1) {
    rollModifier.value = 1
  } else if (attributes.value % 2 == 0){
    rollModifier.value = 0
  }
  skillCheckResult.innerText = ""
}
  
  function skillCheckRoll(stressCheck, skillCheckLightDice, skillCheckDarkDice) {
    
    let zeroArray = [1, 2, 3, 4];
    let oneArray = [5, 6, 7];
    let twoArray = [8, 9];
    let skillCheckCalculatedResultFromRoll = 0;
    if (stressCheck == false) {
  
    if (skillCheckLightDice == undefined) {
      skillCheckLightDice = Math.floor(generator.random() * 10)
    } 
    
    if (skillCheckLightDice == 0) {
      skillCheckLightDice = 10;
    }
      skillCheckLightDice += parseInt(rollModifier.value)
    
    if (skillCheckLightDice >= 10) {
      skillCheckCalculatedResultFromRoll = 3
    } else if (twoArray.includes(skillCheckLightDice)) {
      skillCheckCalculatedResultFromRoll = 2
    } else if (oneArray.includes(skillCheckLightDice)) {
      skillCheckCalculatedResultFromRoll = 1
    } else if (zeroArray.includes(skillCheckLightDice) || skillCheckLightDice<0) {
      skillCheckCalculatedResultFromRoll = 0
    }
    
    if (skillCheckLightDice >= 10) {
      skillCheckLightDice = 0
    } else if (skillCheckLightDice <= 0) {
      skillCheckLightDice = 1
      }
      skillCheckLightDiceResultSelect.value = skillCheckLightDice
      skillCheckResult.innerText = parseInt(skillCheckBase.innerText) + skillCheckCalculatedResultFromRoll
    } else if (stressCheck == true) {
    
      if (skillCheckLightDice == undefined || skillCheckDarkDice == undefined) {
        skillCheckLightDice = Math.floor(generator.random() * 10)
        skillCheckDarkDice = Math.floor(generator.random() * 10)
        skillCheckDarkDiceResultSelect.value = skillCheckDarkDice
      } 
      if (skillCheckLightDice == 0) {
        skillCheckLightDice = 10;
      }
      if (skillCheckDarkDice == 0) {
        skillCheckDarkDice = 10;
      }

      let skillCheckLightDicePlusRollMod = skillCheckLightDice + parseInt(rollModifier.value)
      
      if (skillCheckLightDicePlusRollMod >= 10) {
        skillCheckLightDicePlusRollMod = 10
      }
//---megnézi, hogy pozitív DM nélkül nem-e egyenlő a két kocka?
      
      if (skillCheckLightDice == skillCheckDarkDice && parseInt(rollModifier.value)>0 && skillCheckLightDice !=1) {
  skillCheckLightDicePlusRollMod = skillCheckLightDice
      }
      
    if (skillCheckLightDicePlusRollMod>skillCheckDarkDice) {
      if (skillCheckLightDicePlusRollMod == 10) {
        skillCheckCalculatedResultFromRoll = 3
      } else if (twoArray.includes(skillCheckLightDicePlusRollMod)) {
        skillCheckCalculatedResultFromRoll = 2
      } else if (oneArray.includes(skillCheckLightDicePlusRollMod)) {
        skillCheckCalculatedResultFromRoll = 1
      } else if (zeroArray.includes(skillCheckLightDicePlusRollMod) || skillCheckLightDicePlusRollMod<0) {
        skillCheckCalculatedResultFromRoll = 0
      }
    } else if (skillCheckLightDicePlusRollMod<skillCheckDarkDice) {
      if (skillCheckDarkDice == 10) {
        skillCheckCalculatedResultFromRoll = -3
      } else if (twoArray.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = -2
      } else if (oneArray.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = -1
      } else if (zeroArray.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = 0
      }
    } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && specialCases1.includes(skillCheckDarkDice)) {
      skillCheckCalculatedResultFromRoll = 3;
      } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && specialCases2.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = 4;
      } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && specialCases3.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = 5;;
      } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && skillCheckDarkDice == 1) {
        skillCheckCalculatedResultFromRoll = -6;
      } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && skillCheckDarkDice == 10) {
        skillCheckCalculatedResultFromRoll = 6;
      }

      if (skillCheckLightDicePlusRollMod >= 10) {
        skillCheckLightDicePlusRollMod = 0
      } else if (skillCheckLightDicePlusRollMod <= 0) {
        skillCheckLightDicePlusRollMod = 1
      } 
      skillCheckLightDiceResultSelect.value = skillCheckLightDicePlusRollMod
      skillCheckResult.innerText = parseInt(skillCheckBase.innerText) + skillCheckCalculatedResultFromRoll
  }
  }
 //let stressCheck = false 
  function handleSkillCheck(stressCheck, skillCheckLightDice, skillCheckDarkDice) {
    
    skillCheckRolled = true
    skillCheckUseLegendPointCheckBox.style.display = "grid"
      
      if (skillCheckStressCheckbox.checked == true) {
      stressCheck = true
    } else if (skillCheckStressCheckbox.checked == false) {
      stressCheck = false
    }
    skillCheckUseLegendPointCheckBox.checked = false
    skillCheckRoll(stressCheck, skillCheckLightDice, skillCheckDarkDice)
}
  
  let diceRolled = false;
  let skillCheckRolled = false

  async function handleClick(darkDice, lightDice) {
 
    bodyPartImg.innerHTML = "";
    charAtkSum.innerText = "";
    specialEffect.innerText = "nincs";
  
    //-----------------------megnézni, hogy van-e erő sebzés 

    const currentWeaponSelected = props.feed.find(
      (name) => name.w_name === `${weapons.value}`
    )
    
    if (currentWeaponSelected.strBonusDmg == "false") {
      rollResult.innerText = ttkRoll(false, darkDice, lightDice);
    } else if (currentWeaponSelected.strBonusDmg == "true" && charStr.value == "") {
      alert("Ez egy erő sebzéssel rendelkező fegyver, írd be az erődet!")
      return
    } else if (currentWeaponSelected.strBonusDmg == "true" && charStr.value != "") {
      rollResult.innerText = ttkRoll(true, darkDice, lightDice);
    }
    
    diceRolled = true
    useLegendPointCheckBox.style.display = "grid"
    useLegendPointCheckBox.checked = false
    // darkDiceRerollByCounterLP.style.display = "grid"
    // lightDiceRerollByCounterLP.style.display = "grid"

    damageResult.innerText = "";

    bodyPart.innerText = "";

    if (charAtk.value == "") {
      charAtkSum.innerText = rollResult.innerText;
    } else {
      charAtkSum.innerText =
        parseFloat(rollResult.innerText) + parseFloat(charAtk.value);
    }

    
  function hitChecker(originalLightDice) {
    return bodyParts[originalLightDice - 1];
  }

    bodyPart.innerText = hitChecker(originalLightDice);

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
    
    damageEvaluator()

  }

  return (
    <>
      <Head>
        <title>TTK Rolldice</title>
      </Head>

      <main className="main">
        <div id="atkRollWrapper">
        <div className={styles.resultContainer}>
          <div className="result inText">A dobás eredménye</div>
          <div id="rollResult" className="result inNumber"></div>
          <div className="damage inText">A sebzés</div>
          <div id="damageResult" className="result inNumber"></div>
          <div className="damage hitCheck">A találat helye</div>
          <div id="bodyPart" className={styles.bodyPart}></div>
        </div>
        <div id="charInfoWrapper">
          <div id="charName"></div>
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
          <select id="weapons" name="weapons" onChange={handleWeaponChange}>
             {props.feed.map((e) => {
              return (
                <option key={e.w_id}>
                  {e.w_name}
                </option>
              );
            })} 
          </select>
          <label htmlFor="professionLevelSelect" id="profession">
            Képzettség foka:
          </label>
          <select id="professionLevelSelect" name="profession" onChange={damageEvaluator}>
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="destroyerLevelSelect" id="destroyer">
            Pusztító adottság:
          </label>
          <select id="destroyerLevelSelect" name="destroyer" onChange={damageEvaluator}>
            {destroyerLevel.map((e) => {
              return <option key={e}>{e}</option>;
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
          <label htmlFor="charStr" id="charStrLabel">
            Karakter Erő
          </label>
          <input type="text" name="charStr" id="charStr" />
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
          <label id="useLegendPointCheckBoxlabel" htmlFor="useLegendPointCheckBox">Legenda pontot használok!</label>
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

        <div className={styles.gifContainer}>
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
        </div>
        <img id="dividingLine" src="/divider.png"></img>
        <div id="skillCheckWrapper">
        <label htmlFor="skills" id="skillsLabel" className="skillCheckLabel">
            Választott képzettség:
          </label>
          <select id="skills" name="skills" className="skillCheckSelect" onChange={evaluateSkillCheckBase}>
          </select>
          <label htmlFor="attributes" id="attributesLabel" className="skillCheckLabel">
            Választott tulajdonság:
          </label>
          <select id="attributes" name="attributes" className="skillCheckSelect" onChange={evaluateSkillCheckBase}>
          </select>
          <label htmlFor="rollModifier" id="rollModifierLabel" className="skillCheckLabel">
            Dobásmódosító:
          </label>
          <select id="rollModifier" name="rollModifier" className="skillCheckSelect">
          {skillCheckRollModifiers.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="succFailModifier" id="succFailModifierLabel" className="skillCheckLabel">
            Extra Siker-/Kudarcszint:
          </label>
          <select id="succFailModifier" name="succFailModifier" className="skillCheckSelect" onChange={evaluateSkillCheckBase}>
          {skillCheckSuccFailModifiers.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <div id="skillCheckBaseLabel">Próba alap:</div>
          <div id="skillCheckBase"></div>

          <div id="skillCheckRollResultWrapper">
          <label htmlFor="skillCheckDarkDiceResultSelect" id="skillCheckDarkDiceResultLabel">
            Sötét kocka:
          </label>
          <select id="skillCheckDarkDiceResultSelect" name="" disabled={true} onChange={handleWhenSkillCheckLegendPointIsUsed}>
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="skillCheckLightDiceResultSelect" id="skillCheckLightDiceResultLabel">
            Világos kocka:
          </label>
          <select id="skillCheckLightDiceResultSelect" name="" disabled={true} onChange={handleWhenSkillCheckLegendPointIsUsed}>
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label id="skillCheckUseLegendPointCheckBoxlabel" htmlFor="skillCheckUseLegendPointCheckBox">Legenda pontot használok!</label>
          <input type="checkBox" id="skillCheckUseLegendPointCheckBox" onChange={handleSkillCheckUseLegendPointCheckBox}/>
          <button id="skillCheckDarkDiceRerollByCounterLP" onClick={skillCheckHandleBossCounterLPdark}></button>
          <button id="skillCheckLightDiceRerollByCounterLP" onClick={skillCheckHandleBossCounterLPlight}></button>
        </div>
          <div id="physicalAttributesLabel">Fizikai tulajdonságok:</div>
          <button type=""
            id="skillCheckRollButton"
            onClick={handleSkillCheck}
        >
          Dobj
          </button>
          <div id="skillCheckResultLabel">Próba végső eredménye:</div>
          <div id="skillCheckResult"></div>
          <div id="skillCheckStressCheckboxLabel">Stresszpróba:</div>
          <input type="checkBox" id="skillCheckStressCheckbox" />
          <div id="spiritualAttributesLabel">Szellemi tulajdonságok:</div>
          <div id="skillCheckLeftSideWrapper"></div>
          <div id="skillCheckRightSideWrapper"></div>
        </div>
      </main>
    </>
  );
}
