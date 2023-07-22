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
  return {
    props: {
      feed,
    },
  };
};

export default function Home(props) {

    
//custom sort function to sort data by name

    let alphabets = ["A", "Á","B", "C", "D","E","É","F","G","H","I","J","K","L","M","N","O","Ó","Ö","Ő","P","Q","R","S",
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
  let rollOptions = [0,1,2,3,4,5,6,7,8,9]
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

  function ttkRoll(strBonus, darkDice, lightDice) {


    if(strBonus==false || strBonus == true){
    let result = 0;

      if (darkDice == undefined || lightDice==undefined) {
        darkDice = Math.floor(generator.random() * 10);
        lightDice = Math.floor(generator.random() * 10);
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
    } else if (darkDice == lightDice) {
      result = darkDice;
    } else if (darkDice == 0 && lightDice == 0) {
      result = 10;
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
    const specialCases1 = [2, 3, 4];
    const specialCases2 = [5, 6, 7];
    const specialCases3 = [8, 9];

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
  }

  async function damageEvaluator() {
    const currentWeapon = props.feed.find(
      (name) => name.w_name === `${weapons.value}`
    );

  if (rangedWeaponsArray.includes(currentWeapon.w_type)) {
    destroyerLevelSelect.value = 0
    
  } 

   if (diceRolled == false) {
    return
  }
     
    console.log(currentWeapon.w_damage);
    console.log(currentWeapon.w_type);
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
      // darkDiceRerollByCounterLP.disabled = false
      // lightDiceRerollByCounterLP.disabled = false

      if (useLegendPointCheckBox.checked == false) {
        rollButton.disabled = false
      }
    } else {
      darkDiceResultSelect.disabled = true
      lightDiceResultSelect.disabled = true
    }
  }
  
  function handleWhenLegendPointIsUsed() {
    let lpModifiedDarkDice = darkDiceResultSelect.value
    let lpModifiedLightDice = lightDiceResultSelect.value

    if (darkDiceResultSelect.value == 0) {
      lpModifiedDarkDice=10
    }

    if (lightDiceResultSelect.value == 0) {
      lpModifiedLightDice=10
    }

    handleClick(parseInt(lpModifiedDarkDice), parseInt(lpModifiedLightDice))
    useLegendPointCheckBox.style.display = "none"
    darkDiceResultSelect.disabled = true
    lightDiceResultSelect.disabled = true
    rollButton.disabled = false
  }
  
  function handleWeaponChange() {
    handleFileRead();
    setTimeout(() => {
      damageEvaluator()
    }, 100); 
  }

  let rangedWeaponsArray = ["ÍJ", "VET", "NYD", "PD", "SZÍ"]
  function handleFileRead() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();
   
    reader.addEventListener(
      "load",
      () => {
      
        let typeOfCurrentlySelectedWeapon = props.feed.find(
          (name) => name.w_name === `${weapons.value}`
        )
        let filteredArrayByType = JSON.parse(reader.result).skills.filter((name)=>name.name == "Fegyverhasználat" && typeOfCurrentlySelectedWeapon.w_type.includes(name.subSkill))
        let filteredArrayByAptitude = JSON.parse(reader.result).aptitudes.filter((name) => name.aptitude == "Pusztító");
    
        if (filteredArrayByType.length != 0) {
     
          professionLevelSelect.value = parseInt(filteredArrayByType[0].level)
        } else {
          professionLevelSelect.value = 0
        }
    
        if (filteredArrayByAptitude.length != 0 && !rangedWeaponsArray.includes(typeOfCurrentlySelectedWeapon.w_type)) {
          
          destroyerLevelSelect.value = parseInt(filteredArrayByAptitude[0].level)
        } else {
          destroyerLevelSelect.value = 0
        }
      },
      
    );    

    if (file) {
      reader.readAsText(file);
    }
   
}

//   function handleBossCounterLP() {

//       darkDiceResultSelect.value=Math.floor(generator.random() * 10)
//    handleClick(parseInt(darkDiceResultSelect.value), parseInt(lightDiceResultSelect.value));
  
// }
  
  let diceRolled = false;
  
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
    // darkDiceRerollByCounterLP.disabled = true
    // lightDiceRerollByCounterLP.disabled = true

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

      <main className={styles.main}>
        <div className={styles.resultContainer}>
          <div className="result inText">A dobás eredménye</div>
          <div id="rollResult" className="result inNumber"></div>
          <div className="damage inText">A sebzés</div>
          <div id="damageResult" className="result inNumber"></div>
          <div className="damage hitCheck">A találat helye</div>
          <div id="bodyPart" className={styles.bodyPart}></div>
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
            Karakter TÉO
          </label>
          <input type="text" name="charAtk" id="charAtk" />
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
          {/* <button id="darkDiceRerollByCounterLP" onClick={handleBossCounterLP}></button>
          <button id="lightDiceRerollByCounterLP"></button> */}
        </div>
        <div id="bodyPartImg"></div>
        <button type=""
          id="rollButton"
          className={styles.rollButton}
          onClick={handleClick}
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
      </main>
    </>
  );
}
