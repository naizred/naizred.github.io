import styles from "../styles/actionlist.module.css";
import allSpells from '../json/allSpells.json'
import spellsAspDescript from "../json/spellsAspDescript.json"
import spellAttributes from "../json/spellAttributes.json"
import {
  allMagicSubskillsObject,
  allResultsCleaner,
  filteredArrayForNameOfHighestMagicalSkill,
  filteredArrayIfHasManaFlow,
  currentGodWorshippedByPlayer,
  allActiveBuffs,
  filteredArrayIfHasManaController,
  CharCompare,
  combatStatRefresher,
} from "../pages";
import { attackRollButtonWasDisabledBeforeSpellCastSetter, blinkingText, defensiveCombatOn, handleIfSpellDoesNotNeedAimRoll, handleIfSpellNeedsAimRoll, setDefensiveCombatVEObonus } from "./ActionsList";
import { initRolled, updateCharacterData } from "./CharacterDetails";
import {
  evaluateSkillOrAttributeCheckBase,
  handleSkillCheck,
  skillOrAttributeCheckRoll,
} from "./SkillCheck";
import { activeBuffsArray, buffRemoverFromActiveBuffArrayAndTextList } from "./PsiDisciplines";
// ismétlődő varázslatok, amik növelik a TÉO-t vagy CÉO-t
//let recurringSpellsThatRequireAttackOrAimRoll = allSpells.filter((spell)=>spell.description.toLowerCase().includes("ismétlődő") && spell.resist.includes("vVÉO"))
// minden varázslat, ami növeli a TÉO-t vagy CÉO-t
let spellsThatModifyCombatStats = allSpells.filter((spell)=>(spell.description.includes("CÉO") || spell.description.includes("TÉO")) && !spell.description.toLowerCase().includes("negatív")  && !spell.description.toLowerCase().includes("hátrány") && spell.description.toLowerCase().includes("+"))
export let spellsThatModifyCombatStatsObject = {}
for (let i = 0; i < spellsThatModifyCombatStats.length; i++) {
  let indexOfPositiveCombatModifier = spellsThatModifyCombatStats[i].description.lastIndexOf("+")
  let isRecurring = false
  let isControlled = false
  let isGuided = false
  let whatDoesItModify
  if (spellsThatModifyCombatStats[i].description.toLowerCase().includes("ismétlődő")) {
    isRecurring = true
  }
  if (spellsThatModifyCombatStats[i].description.toLowerCase().includes("kontrollált")) {
    isControlled = true
  }
  if (spellsThatModifyCombatStats[i].description.toLowerCase().includes("irányított")) {
    isGuided = true
  }
  if (spellsThatModifyCombatStats[i].description.includes("CÉO")) {
    whatDoesItModify = "CÉO"
  }
  if (spellsThatModifyCombatStats[i].description.includes("TÉO")) {
    whatDoesItModify = "TÉO"
  }
  if (spellsThatModifyCombatStats[i].description.includes("TÉO és VÉO")) {
    whatDoesItModify = "TÉO, VÉO"
  }
    spellsThatModifyCombatStatsObject[i] = 
    {
      "spellName":spellsThatModifyCombatStats[i].name, 
      "whatDoesItModify": whatDoesItModify, 
      "modifier": parseFloat(spellsThatModifyCombatStats[i].description.slice(indexOfPositiveCombatModifier).replace(",",".")), 
      "isRecurring": isRecurring,
      "isControlled": isControlled,
      "isGuided": isGuided
    }
}
spellsThatModifyCombatStatsObject = Object.values(spellsThatModifyCombatStatsObject)
export function checkIfCurrentSpellNeedsAimOrAttackRollAndReturnTheModifier(currentSpellName){ // összeveti a jelenleg elvarázsolt spell nevét az összes olyan spellel amik valamilyen statot adnak
for (let i = 0; i < spellsThatModifyCombatStatsObject.length; i++) {
  if (currentSpellName.includes(spellsThatModifyCombatStatsObject[i].spellName)) 
    {
    return spellsThatModifyCombatStatsObject[i]
    }
  }
  return {}
}
export let currentCombatSpell = {}
export function currentCombatSpellChanger(input){
  currentCombatSpell = input
}
export let actionsSpentSinceLastCast = 0;
export let spellIsBeingCast = false;
export let actionsNeededToBeAbleToCastAgain = 0;
export function actionsNeededToBeAbleToCastAgainNullifier (){
  actionsNeededToBeAbleToCastAgain = 0;
}
export let numberOfActionsNeededForTheSpell = 0;
export let castBarCurrentWidthStart = 0;
export let castBarCurrentWidthEnd = 0;
export let allAspSelect;
export function spellIsBeingCastSetToFalse() {
  spellIsBeingCast = false;
}
export function actionsSpentSinceLastCastAdder(numberOfActions = 0) {
  actionsSpentSinceLastCast += numberOfActions;
}
export function actionsSpentSinceLastCastAdderCheckerAndNullifier(
  numberOfActions = 0
) {
  if (actionsNeededToBeAbleToCastAgain == 0) {
    spellCastingActionButton.disabled = false;
    actionsSpentSinceLastCast = 0;
    return;
  }
  actionsSpentSinceLastCast += numberOfActions;
  if (actionsSpentSinceLastCast >= actionsNeededToBeAbleToCastAgain) {
    spellCastingActionButton.disabled = false;
    actionsSpentSinceLastCast = 0;
    actionsNeededToBeAbleToCastAgain = 0;
  }
  console.log(
    "utolsó varázslás óta akciók elköltve:",
    actionsSpentSinceLastCast,
    "lecsengés",
    actionsNeededToBeAbleToCastAgain
  );
}
export let numberOfActionsSpentOnCastingCurrentSpell = 0;
export function numberOfActionsSpentOnCastingCurrentSpellNullifier() {
  numberOfActionsSpentOnCastingCurrentSpell = 0;
}
let currentActiveLiturgy = ""
export function spellCastingSuccessful() {
    spellIsBeingCast = false
    numberOfActionsSpentOnCastingCurrentSpell = 0;
    blinkingText(warningWindow, "A varázslat létrejött!");
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

    if (initRolled == true && actionsNeededToBeAbleToCastAgain > 0) {
      spellCastingActionButton.disabled = true;
    }
    actionsSpentSinceLastCast = 0;
  
  if (currentSpell && currentSpell.name.includes("liturgia")) {
    currentActiveLiturgy=currentSpell.name
    liturgyWrapper.style.display = "grid";
    liturgyPowerInfo.style.display = "grid";
    liturgyPowerInfo.innerText = `Liturgia E: ${currentSpell.aspects[0][1]}`;
    liturgyPowerInfo.value = currentSpell.aspects[0][1];
    liturgyCheckBox.style.display = "grid";
    //activeBuffsArray.push(currentSpell.name);
    for (let i = 0; i < allActiveBuffs.length; i++) {
      if (
        allActiveBuffs[i].innerText == "" ||
        (allActiveBuffs[i].innerText != "" && allActiveBuffs[i].innerText.includes("liturgia"))
      ){
        allActiveBuffs[i].innerText = `${currentSpell.name}`;
       // allActiveBuffs[i].parentElement.lastChild.value = currentSpell.name
        updateCharacterData()
        break
      }
    }
  }
  if (liturgyCheckBox.checked) {
    liturgyCheckBox.checked = false;
    liturgyWrapper.style.display = "none";
    liturgyPowerInfo.style.display = "none";
    liturgyPowerInfo.innerText = "";
    liturgyPowerInfo.value = 0;
    liturgyCheckBox.style.display = "none";
    buffRemoverFromActiveBuffArrayAndTextList(currentActiveLiturgy)
  }
  if (currentSpell) {
    currentCombatSpell = checkIfCurrentSpellNeedsAimOrAttackRollAndReturnTheModifier(currentSpell.name)
  }
  if (currentSpell){ // a currentSpellDuration > 3 azt jelenti, hogy legalább fél óráig tart a buff, 
    for (let i = 0; i < allActiveBuffs.length; i++) {                          // ezt harc előtt is felrakhatja, ezért nem kell, hogy legyen initRolled
      if (
        allActiveBuffs[i].innerText == "" ||
        (allActiveBuffs[i].innerText != "" &&
          allActiveBuffs[i].innerText.includes("folyamatos") &&
          (currentCombatSpell.isControlled ||    // csak a kontrollált és irányított varázslatok szakítják meg a folyamatos diszciplínát
            currentCombatSpell.isGuided) ||
          (allActiveBuffs[i].innerText != "" &&
          allActiveBuffs[i].innerText.toLowerCase().includes("ismétlődő") && // egyszerre csak 1 ismétlődő varázslat lehet aktív, így ami épp van, azt felülírja
          currentCombatSpell.isRecurring)
        )
      )
      {
        buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText)
        if (currentSpellDuration == 2) {
          allActiveBuffs[i].innerText = `1 kör - ${currentSpell.name} - ${currentSpellPower}E`
        }
        if (currentSpellDuration == 3) {
          allActiveBuffs[i].innerText = `6 kör - ${currentSpell.name} - ${currentSpellPower}E`
        }
        if (currentSpellDuration == 4) {
          allActiveBuffs[i].innerText = `30 perc - ${currentSpell.name} - ${currentSpellPower}E`
        }
        if (currentSpellDuration == 5) {
          allActiveBuffs[i].innerText = `10 óra - ${currentSpell.name} - ${currentSpellPower}E`
        }
        //allActiveBuffs[i].parentElement.lastChild.value = `${parseInt(allActiveBuffs[i].innerText)}, ${numberOfCurrentRound.innerText}` // A törlés gomb value-ben van eltárolva az időtartam adat. Innen fogjuk vizsgálni, hogy mennyi van még hátra belőle
        if (currentCombatSpell.isRecurring) {   // csak egy ismétlődő varázslat lehet
          allActiveBuffs[i].innerText = `${(allActiveBuffs[i].innerText)} - ismétlődő`;
          recurringSpellActionButton.style.display = "grid"
          if (initRolled) {
            recurringSpellActionButton.disabled = true
          }
        }
        if (currentCombatSpell.isControlled) {   
          allActiveBuffs[i].innerText = `${(allActiveBuffs[i].innerText)} - kontrollált`;
        }
        if (currentCombatSpell.isGuided) {   
          allActiveBuffs[i].innerText = `${(allActiveBuffs[i].innerText)} - irányított`;
        }
        //activeBuffsArray.push(allActiveBuffs[i].innerText);
        break
      }
    }
  }
  if (initRolled == true && attackRollButton.disabled == true) {
    attackRollButtonWasDisabledBeforeSpellCastSetter(true);
  }
  if (initRolled == true && attackRollButton.disabled == false) {
    attackRollButtonWasDisabledBeforeSpellCastSetter(false);
  }
  if (!currentCombatSpell.spellName || currentCombatSpell.isGuided) {
    handleIfSpellDoesNotNeedAimRoll()
  } else if(currentCombatSpell.spellName){ 
    handleIfSpellNeedsAimRoll()
  }
  updateCharacterData()
}
let currentSpellDuration = 0
let currentSpellPower = 0
export function spellCastingFailure(anyOtherCondition = true) {
  if (
    initRolled == true &&
    numberOfActionsSpentOnCastingCurrentSpell >= 1 &&
    anyOtherCondition &&
    spellIsBeingCast == true
  ) {
    numberOfActionsSpentOnCastingCurrentSpell = 0;
    blinkingText(warningWindow, "A varázslat megszakadt!");
    spellIsBeingCast = false;
    castBar.animate([{ opacity: 1 }, { opacity: 0 }], 400);
    setTimeout(() => {
      castBar.style.display = "none";
    }, 350);
    actionsNeededToBeAbleToCastAgain = 0;
  }
}
let filteredSpellsBySubSkillAndLevel;
export let currentSpell;

function Spells() {
  let manaNeededForTheSpell = 0
  //console.log(spellsThatModifyCombatStats)
  //console.log(spellsThatModifyCombatStatsObject)
  // mana tényező táblázatból és varázsidő tényező táblázat alapján írt függvények az egyes aspektusok mana értékének kiszámításához
  function spellCastingCheckSetter(){
    let spellAttributesArray = Object.entries(spellAttributes[0]);
    let selectAllSkillOptions = document.querySelectorAll(
      "select#skills option"
    );
    let selectAllAttributeOptions = document.querySelectorAll(
      "select#attributes option"
    );

    for (let i = 0; i < spellAttributesArray.length; i++) {
      let spellSubskillAttributesArray = Object.entries(
        spellAttributesArray[i][1]
      );
      // console.log(spellSubskillAttributesArray);
      let spellAttribute1name;
      let spellAttribute2name;
      if (
        filteredArrayForNameOfHighestMagicalSkill[0].name.includes(spellAttributesArray[i][0])
      ) {
        for (let j = 0; j < spellSubskillAttributesArray.length; j++) {
          if (
            spellSubskillAttributesArray[j][0] ==
            magicSubSkillSelect.value.slice(1)
          ) {
            for (let k = 0; k < selectAllAttributeOptions.length; k++) {}
            spellAttribute1name = spellSubskillAttributesArray[j][1][0];
            spellAttribute2name = spellSubskillAttributesArray[j][1][1];
            break;
          }
        }
      }
      // össze kell hasonlítani, melyik érték a nagyobb
      if (spellAttribute1name || spellAttribute2name) {
        let spellAttribute1value = 0;
        let spellAttribute2value = 0;
        for (let k = 0; k < selectAllAttributeOptions.length; k++) {
          if (selectAllAttributeOptions[k].innerText == spellAttribute1name) {
            spellAttribute1value = parseInt(
              selectAllAttributeOptions[k].value
            );
          }
          if (
            selectAllAttributeOptions[k].innerText == spellAttribute2name &&
            spellAttribute2name
          ) {
            spellAttribute2value = parseInt(
              selectAllAttributeOptions[k].value
            );
          }
          if (spellAttribute1value >= spellAttribute2value) {
            attributes.value = `${
              spellAttribute1value + "," + spellAttribute1name
            }`;
          }
          if (spellAttribute1value < spellAttribute2value) {
            attributes.value = `${
              spellAttribute2value + "," + spellAttribute2name
            }`;
          }
        }
        break;
      }
    }
    for (let j = 0; j < selectAllSkillOptions.length; j++) {
      if (
        selectAllSkillOptions[j].value.includes(
          filteredArrayForNameOfHighestMagicalSkill[0].name
        )
      ) {
        skills.value = selectAllSkillOptions[j].value;
        break;
      }
    }
  }
  function manaFactorCalculator(asp) {
    let manaFactor = 0;

    for (let i = 1; i < asp; i++) {
      manaFactor += i;
    }
    return manaFactor;
  }
  function spellCastTimeFactorCalculator(asp = 0) {
    let spellCastTimeFactor = 0;
    if (asp <= 1) {
      asp = 1;
    }
    return (spellCastTimeFactor = asp - 2);
  }
  function handleClickOnSpellCastButton() {
    powerAspModified = false;
    anyAspExceptPowerAspModified = false;
    allAspSelect = document.querySelectorAll("[id*='AspSelect']");
    for (let i = 1; i < allAspSelect.length; i++) {
      allAspSelect[i].disabled = false;
    }

    if (parseInt(numberOfActions.innerText) != 0) {
      warningWindow.innerText = "";

      if (
        initRolled == true &&
        spellIsBeingCast == true &&
        parseInt(numberOfActions.innerText) != 0
      ) {
        numberOfActionsSpentOnCastingCurrentSpell++;
        blinkingText(
          warningWindow,
          `A varázslat ${
            numberOfActionsNeededForTheSpell -
            numberOfActionsSpentOnCastingCurrentSpell
          } CS múlva létrejön`
        );
        castBarCurrentWidthStart +=
          (1 / numberOfActionsNeededForTheSpell) * 17.1;
        castBarCurrentWidthEnd =
          (numberOfActionsSpentOnCastingCurrentSpell /
            numberOfActionsNeededForTheSpell) *
          17.1;
        castBar.animate(
          [
            { backgroundSize: `${castBarCurrentWidthStart}vw` },
            { backgroundSize: `${castBarCurrentWidthEnd}vw` },
          ],
          200
        );
        castBar.style.backgroundSize = `${
          (numberOfActionsSpentOnCastingCurrentSpell /
            numberOfActionsNeededForTheSpell) *
          17.1
        }vw`;
        numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;

        if (
          numberOfActionsSpentOnCastingCurrentSpell ==
          numberOfActionsNeededForTheSpell
        ) {
          spellIsBeingCast = false
          spellCastingSuccessful();
        }
      }
    }
    if (spellIsBeingCast == false && actionsNeededToBeAbleToCastAgain == 0) {
      //***************************************************************************** */
      // itt lesznek betöltve és szűrve a varázslatok
      //******************************************************************************* */
      if (
        filteredArrayForNameOfHighestMagicalSkill &&
        (filteredArrayForNameOfHighestMagicalSkill[0].name.includes("Szakrál") ||
          filteredArrayForNameOfHighestMagicalSkill[0].name.includes("Tűzvar") ||
          filteredArrayForNameOfHighestMagicalSkill[0].name.includes("Bárd") || 
          filteredArrayForNameOfHighestMagicalSkill[0].name.includes("Bosz"))
      ) {
        advancedSpellInputWrapper.style.display = "grid";
        warningWindow.innerText = "";
        removeAllOptions("magicSubSkillSelect");

        for (let i = 0; i < allActiveBuffs.length; i++) {

          if(allActiveBuffs[i].innerText.includes("liturgia")){
            let currentLirurgy = allSpells.find((spell)=>allActiveBuffs[i].innerText.includes(spell.name))
            //console.log(currentLirurgy, allActiveBuffs[i].innerText)
            liturgyWrapper.style.display = "grid";
            liturgyPowerInfo.style.display = "grid";
            liturgyPowerInfo.innerText = `Liturgia E: ${currentLirurgy.aspects[0][1]}`;
            liturgyPowerInfo.value = currentLirurgy.aspects[0][1];
            liturgyCheckBox.style.display = "grid";
                    }
          }
          // function OrderFunctionForAllMagicSubskillsObject() {
          //   allMagicSubskillsObject.sort(function (a, b) {
          //   return CharCompare(b[0], a[0], 0);
          //   });
          // }
          // OrderFunctionForAllMagicSubskillsObject()
          let allMagicSubskillsObjectKeys = Object.keys(allMagicSubskillsObject) // itt vannak a mágiaformák nevei pl. "Villámmágia"
          let allMagicSubskillsObjectValues = Object.values(allMagicSubskillsObject) // itt vannak a hozzájuk tartozó fokok

        for (let i = 0; i <allMagicSubskillsObjectKeys.length; i++) {
          let magicSubSkillOption = document.createElement("option");
          magicSubSkillOption.innerText = allMagicSubskillsObjectKeys[i];
          magicSubSkillOption.value = allMagicSubskillsObjectValues[i] + allMagicSubskillsObjectKeys[i];
          magicSubSkillSelect.appendChild(magicSubSkillOption);
        }
        evaluateMagicSubSkill();
      } else {
        spellInputWrapper.style.display = "grid";
        warningWindow.innerText = "";
      }
    }
    if (initRolled == false) {
      spellActionCostListItem.style.display = "none";
    }
    if (initRolled == true) {
      spellActionCostListItem.style.display = "grid";
    }
  }

  function evaluateMagicSubSkill() {
    removeAllOptions("spellSelect");
    // az adott mágikus képzettség foka a 0. indexen van elrejtve
    // console.log(magicSubSkillSelect.value[0], magicSubSkillSelect.value.slice(1))
    if (magicSubSkillSelect.value.slice(1).includes("fohász")) {
      filteredSpellsBySubSkillAndLevel = allSpells.filter(
        (spell) =>
          spell.magicSubclass.includes(magicSubSkillSelect.value.slice(1)) &&
          spell.fok <= parseInt(magicSubSkillSelect.value[0]) &&
          (spell.god == "Általános" ||
            spell.god == currentGodWorshippedByPlayer)
      );
    } else {
      filteredSpellsBySubSkillAndLevel = allSpells.filter(
        (spell) =>
          magicSubSkillSelect.value.slice(1).includes(spell.magicSubclass) &&
          spell.fok <= parseInt(magicSubSkillSelect.value[0])
      );
    }
    function OrderFunctionForFilteredSpellsBySubSkillAndLevel() {
      filteredSpellsBySubSkillAndLevel.sort(function (a, b) {
      return CharCompare(a.name, b.name, 0);
      });
    }
    OrderFunctionForFilteredSpellsBySubSkillAndLevel()

    for (let i = 0; i < filteredSpellsBySubSkillAndLevel.length; i++) {
      let spellSkillOption = document.createElement("option");
      spellSkillOption.innerText = filteredSpellsBySubSkillAndLevel[i].name;
      //spellSkillOption.value =
      spellSelect.appendChild(spellSkillOption);
    }
    for (let i = 1; i < allAspSelect.length; i++) {
      allAspSelect[i].disabled = false;
    }
    // ha megváltoztatja a subSkill-t, akkor visszaállítjuk a "li"-ben eltárolt eredeti értékeket
    if (currentSpell) {
      currentSpell.aspects[0][1] = powerAspSelect.parentElement.value;
      currentSpell.aspects[1][1] = distanceAspSelect.parentElement.value;
      currentSpell.aspects[2][1] = areaAspSelect.parentElement.value;
      currentSpell.aspects[3][1] = durationAspSelect.parentElement.value;
      powerAspModified = false;
      anyAspExceptPowerAspModified = false;
    }
    evaluateSpell();
  }
  function handleSpellChange() {
    for (let i = 1; i < allAspSelect.length; i++) {
      allAspSelect[i].disabled = false;
    }
    // ha megváltoztatja a varázslatot, akkor visszaállítjuk a "li"-ben eltárolt eredeti értékeket
    currentSpell.aspects[0][1] = powerAspSelect.parentElement.value;
    currentSpell.aspects[1][1] = distanceAspSelect.parentElement.value;
    currentSpell.aspects[2][1] = areaAspSelect.parentElement.value;
    currentSpell.aspects[3][1] = durationAspSelect.parentElement.value;
    powerAspModified = false;
    anyAspExceptPowerAspModified = false;
    evaluateSpell();
  }

  function evaluateSpell() {
    currentSpell = filteredSpellsBySubSkillAndLevel.find(
      (spell) => spell.name == `${spellSelect.value}`
    );

    if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
      powerAspSelect.parentElement.value = currentSpell.aspects[0][1];
      distanceAspSelect.parentElement.value = currentSpell.aspects[1][1];
      areaAspSelect.parentElement.value = currentSpell.aspects[2][1];
      durationAspSelect.parentElement.value = currentSpell.aspects[3][1];
    }
    powerAspSelect.value = currentSpell.aspects[0][1];
    distanceAspSelect.value = currentSpell.aspects[1][1];
    areaAspSelect.value = currentSpell.aspects[2][1];
    durationAspSelect.value = currentSpell.aspects[3][1];
    aspOptionDisabler(filteredArrayForNameOfHighestMagicalSkill[0].level);
    calculateSpellCastTimeAndManaCost();
    spellCastingCheckSetter()
    evaluateSkillOrAttributeCheckBase();
  }

  function aspOptionDisabler(magicSkillLevel) {
    if (currentSpell.magicSubclass.includes("fohász")) {
      magicSkillLevel = 2;
    }
    if (magicSkillLevel <= 2) {
      for (let i = 0; i < allAspSelect.length; i++) {
        allAspSelect[i].disabled = true;
      }
    }
    if (magicSkillLevel == 3) {
      for (let i = 1; i < allAspSelect.length; i++) {
        allAspSelect[i].disabled = true;
      }
    }
    if (magicSkillLevel == 4) {
      for (let i = 1; i < allAspSelect.length; i++) {
        let aspOptions = document.querySelectorAll(
          `select#${allAspSelect[i].id} option`
        );
        for (let j = 0; j < aspOptions.length; j++) {
          aspOptions[j].disabled = true;
        }
        for (let j = 0; j < aspOptions.length; j++) {
          if (
            aspOptions[j - 1] &&
            aspOptions[j].value == allAspSelect[i].value
          ) {
            aspOptions[j - 1].disabled = false;
          }
          if (aspOptions[j].value == allAspSelect[i].value) {
            aspOptions[j].disabled = false;
          }
          if (
            aspOptions[j + 1] &&
            aspOptions[j].value == allAspSelect[i].value
          ) {
            aspOptions[j + 1].disabled = false;
            break;
          }
        }
      }
    }
    if (magicSkillLevel == 5) {
      for (let i = 1; i < allAspSelect.length; i++) {
        allAspSelect[i].disabled = false;
      }
    }
  }

  let powerAspModified = false;
  let anyAspExceptPowerAspModified = false;
  function handleSpellAspOptionChange(event) {
    if (event.target.id == "powerAspSelect") {
      // ez a következő sor azért van itt, hogy beleírja a felhasználó által választott értéket a varázslat értékei közé
      currentSpell.aspects[0][1] = parseInt(powerAspSelect.value);
      if (event.target.value == event.target.parentElement.value) {
        powerAspModified = false;
      }
      if (event.target.value != event.target.parentElement.value) {
        powerAspModified = true;
      }
    } else {
      for (let i = 1; i < allAspSelect.length; i++) {
        allAspSelect[i].disabled = true;
        // ez a következő sor azért van itt, hogy beleírja a felhasználó által választott értéket a varázslat értékei közé
        currentSpell.aspects[i][1] = parseInt(allAspSelect[i].value);
        if (event.target.id == allAspSelect[i].id) {
          allAspSelect[i].disabled = false;
        }
      }
      if (event.target.value == event.target.parentElement.value) {
        for (let j = 0; j < allAspSelect.length; j++) {
          allAspSelect[j].disabled = false;
        }
        anyAspExceptPowerAspModified = false;
      }
      if (event.target.value != event.target.parentElement.value) {
        anyAspExceptPowerAspModified = true;
      }
    }
    calculateSpellCastTimeAndManaCost();
    console.log(
      "volt erő mod?",
      powerAspModified,
      "volt más asp mod?",
      anyAspExceptPowerAspModified
    );
  }
  let highestAspectOfUnmodifiedAspects = [];
  function calculateSpellCastTimeAndManaCost() {
    let finalManaCost = 0;
    let finalCastTime = 0;
    let theHighestFiveAspectsPerAspectCategory = [];
    let theHighestFiveAspects = [];
    let highestAspectPerCategory = [];

    for (let i = 0; i < currentSpell.aspects.length; i++) {
      let calculatedAspect =
        currentSpell.aspects[i][1] +
        currentSpell.aspects[i][2] +
        currentSpell.aspects[i][3];
      theHighestFiveAspects.push(calculatedAspect);
      highestAspectOfUnmodifiedAspects.push(currentSpell.aspects[i][1]);
    }
    if (currentSpell.aspects.length == 5) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        let calculatedAspect =
          currentSpell.aspects[i][1] +
          currentSpell.aspects[i][2] +
          currentSpell.aspects[i][3];
        theHighestFiveAspectsPerAspectCategory.push(calculatedAspect);
      }
    }
    if (currentSpell.aspects.length > 5) {
      for (let i = 0; i < currentSpell.aspects.length; i++) {
        let calculatedAspect =
          currentSpell.aspects[i][1] +
          currentSpell.aspects[i][2] +
          currentSpell.aspects[i][3];

        let calculatedAspectOfNextAspect = 0;

        while (
          currentSpell.aspects[i + 1] &&
          currentSpell.aspects[i][0] == currentSpell.aspects[i + 1][0]
        ) {
          calculatedAspect =
            currentSpell.aspects[i][1] +
            currentSpell.aspects[i][2] +
            currentSpell.aspects[i][3];
          calculatedAspectOfNextAspect =
            currentSpell.aspects[i + 1][1] +
            currentSpell.aspects[i + 1][2] +
            currentSpell.aspects[i + 1][3];
          highestAspectPerCategory.push(calculatedAspect);
          highestAspectPerCategory.push(calculatedAspectOfNextAspect);
          i++;
        }
        if (highestAspectPerCategory.length == 0) {
          theHighestFiveAspectsPerAspectCategory.push(calculatedAspect);
          highestAspectPerCategory = [];
        }
        if (highestAspectPerCategory.length != 0) {
          theHighestFiveAspectsPerAspectCategory.push(
            Math.max(...highestAspectPerCategory)
          );
          highestAspectPerCategory = [];
        }
      }
    }

    let highestFiveAspectDesc = theHighestFiveAspects.sort((a, b) => b - a);
    for (let i = 0; i < theHighestFiveAspectsPerAspectCategory.length; i++) {
      finalManaCost += manaFactorCalculator(highestFiveAspectDesc[i]);
      finalCastTime += spellCastTimeFactorCalculator(
        theHighestFiveAspectsPerAspectCategory[i]
      );
    }
    console.log(theHighestFiveAspectsPerAspectCategory);

    if (filteredArrayIfHasManaFlow.length != 0 && !currentSpell.ritual) {  // manavezető, de rituáléra nem lehet érvényes
      finalCastTime -= filteredArrayIfHasManaFlow[0].level;
    }      
    spellCastingCheckSetter()
    evaluateSkillOrAttributeCheckBase();
    //handleSkillCheck(false);
    blinkingText(
      warningWindow,
      `A varázspróba célszáma: ${
        10 + Math.max(...theHighestFiveAspectsPerAspectCategory)
      }`
    );
    
    // if (powerAspModified == false && anyAspExceptPowerAspModified == false) {
    //   warningWindow.innerText = "";
    // }
    if (finalCastTime <= 0) {
      finalCastTime = 1;
    }
    if (finalCastTime <= 10) {
      spellCastTime.innerText = `${finalCastTime} CS`;
    } else if (finalCastTime > 10 && finalCastTime <= 20) {
      spellCastTime.innerText = `${finalCastTime - 10} Perc`;
    } else if (finalCastTime > 20 && finalCastTime <= 30) {
      spellCastTime.innerText = `${finalCastTime - 20} Óra`;
    } else if (finalCastTime > 30) {
      spellCastTime.innerText = `${finalCastTime - 30} Nap`;
    }
    if (currentSpell.ritual) {
      if (finalCastTime <= 10) {
        spellCastTime.innerText = `${finalCastTime * 3} CS`;
      } else if (finalCastTime > 10 && finalCastTime <= 20) {
        spellCastTime.innerText = `${(finalCastTime - 10) * 3} Perc`;
      } else if (finalCastTime > 20 && finalCastTime <= 30) {
        spellCastTime.innerText = `${(finalCastTime - 20) * 3} Óra`;
      } else if (finalCastTime > 30) {
        spellCastTime.innerText = `${(finalCastTime - 30) * 3} Nap`;
      }
      finalManaCost = Math.floor((finalManaCost * 2) / 3);
      if (finalManaCost <= 0) {
        finalManaCost = 1
      }
    }
    spellManaCostDiv.innerText = finalManaCost;
  }

  function removeAllOptions(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
  }

  function handleSpellCast(event) {
    if (defensiveCombatOn) {
      setDefensiveCombatVEObonus(1)
      combatStatRefresher()
    }
    // let stressCheck = false
    // if(skillCheckStressCheckbox.checked){
    //   stressCheck=true
    // }
    // if (powerAspModified || anyAspExceptPowerAspModified) {
    //   skillOrAttributeCheckRoll(stressCheck)    
    // }
    console.log(
      "volt erő mod?",
      powerAspModified,
      "volt más asp mod?",
      anyAspExceptPowerAspModified
    );
    currentSpellDuration = currentSpell.aspects[3][1]
    currentSpellPower = currentSpell.aspects[0][1]

    let spellManaCost = 0;
    castBarCurrentWidthStart = 0;
    castBarCurrentWidthEnd = 0;
    if (event.target.id == "advancedStartCastButton") {
      spellManaCost = parseInt(spellManaCostDiv.innerText);
      // itt visszaállítjuk a spell eredeti aspektusait, amik a parentelement "li"-ben vannak eltárolva
      currentSpell.aspects[0][1] = powerAspSelect.parentElement.value;
      currentSpell.aspects[1][1] = distanceAspSelect.parentElement.value;
      currentSpell.aspects[2][1] = areaAspSelect.parentElement.value;
      currentSpell.aspects[3][1] = durationAspSelect.parentElement.value;
      powerAspModified = false;
      anyAspExceptPowerAspModified = false;

      if (powerAspSelect.value == 1 || powerAspSelect.value == 2) {
        numberOfDiceInput.value = powerAspSelect.value;
      }
      if (powerAspSelect.value > 2 && !currentSpell.name.includes("liturgia")) {
        numberOfDiceInput.value = (parseInt(powerAspSelect.value) - 1) * 2;
      }
    }
    if (event.target.id == "startCastButton") {
      spellManaCost = parseInt(spellManaCostInput.value);
      numberOfDiceInput.value = spellDamageInput.value;
    }
    allResultsCleaner();
    if (parseInt(currentMp.value) < spellManaCost) {
      blinkingText(warningWindow, "Nincs elég manád!");
      return;
    }
    currentMp.value = parseInt(currentMp.value) - spellManaCost;
    spellIsBeingCast = true;

    numberOfDiceInput.disabled = true;
    if (initRolled == false) {
      advancedSpellInputWrapper.style.display = "none";
      spellInputWrapper.style.display = "none";
      spellCastingSuccessful();
      return;
    }
    if (event.target.id == "advancedStartCastButton") {
      if (spellCastTime.innerText.includes("CS")) {
        numberOfActionsNeededForTheSpell = parseInt(spellCastTime.innerText);
      }
      if (spellCastTime.innerText.includes("Perc")) {
        numberOfActionsNeededForTheSpell =
          parseInt(spellCastTime.innerText) * 24;
      }
    }
    if (event.target.id == "startCastButton") {
      numberOfActionsNeededForTheSpell = parseInt(spellActionCostInput.value);
    }

    manaNeededForTheSpell = spellManaCost;
    warningWindow.innerText = "";
   
      if (filteredArrayIfHasManaController.length != 0 && filteredArrayIfHasManaController[0].level != 0) {
        actionsNeededToBeAbleToCastAgain = 1 + Math.floor(spellManaCost / 10) - filteredArrayIfHasManaController[0].level;
      } else {
        actionsNeededToBeAbleToCastAgain = 1 + Math.floor(spellManaCost / 10)
      }

    advancedSpellInputWrapper.style.display = "none";
    spellInputWrapper.style.display = "none";
    if (initRolled == true && numberOfActionsNeededForTheSpell > 1) {
      spellIsBeingCast = true;
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      numberOfActionsSpentOnCastingCurrentSpell++;
      blinkingText(
        warningWindow,
        `A varázslat ${
          numberOfActionsNeededForTheSpell -
          numberOfActionsSpentOnCastingCurrentSpell
        } CS múlva létrejön`
      );
      castBar.style.display = "grid";
      castBarCurrentWidthEnd =
        (numberOfActionsSpentOnCastingCurrentSpell /
          numberOfActionsNeededForTheSpell) *
        17.1;
      castBar.animate(
        [
          { backgroundSize: `${castBarCurrentWidthStart}vw` },
          { backgroundSize: `${castBarCurrentWidthEnd}vw` },
        ],
        200
      );
      castBar.style.backgroundSize = `${
        (numberOfActionsSpentOnCastingCurrentSpell /
          numberOfActionsNeededForTheSpell) *
        17.1
      }vw`;
    }
    if (initRolled == true && numberOfActionsNeededForTheSpell == 1) {
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      spellCastingSuccessful();
    }
  }
  function handleCancelSpellCast(event) {
    if (event.target.id == "advancedSpellInputWrapperCancelCastButton") {
      advancedSpellInputWrapper.style.display = "none";
      if (liturgyCheckBox.checked) {
        liturgyCheckBox.checked = false
      }
      // itt visszaállítjuk a spell eredeti aspektusait, amik a parentelement "li"-ben vannak eltárolva    if (currentSpell) {
      currentSpell.aspects[0][1] = powerAspSelect.parentElement.value;
      currentSpell.aspects[1][1] = distanceAspSelect.parentElement.value;
      currentSpell.aspects[2][1] = areaAspSelect.parentElement.value;
      currentSpell.aspects[3][1] = durationAspSelect.parentElement.value;
      powerAspModified = false;
      anyAspExceptPowerAspModified = false;
      warningWindow.innerText = "";
    }
    if (event.target.id == "spellInputWrapperCancelCastButton") {
      spellInputWrapper.style.display = "none";
    }
  }
  function handleSpellSelectMouseEnter() {
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
      powerAspSelect.value = parseInt(liturgyPowerInfo.value);
    }
    if (!liturgyCheckBox.checked) {
      powerAspSelect.value = powerAspSelect.parentElement.value;
    }
  }

  return (
    <>
      <div
        id="spellCastButtonWrapper"
        className={styles.spellCastButtonWrapper}>
        <span>Varázslás - Akció - 1 CS </span>
        <button
          id="spellCastingActionButton"
          onClick={handleClickOnSpellCastButton}>
          Végrehajt
        </button>
      </div>

      <div id="spellInputWrapper" className={styles.spellInputWrapper}>
        <li id="spellActionCostListItem">
          <span>CS:</span>
          <input id="spellActionCostInput" defaultValue={1} type="number" />
        </li>
        <li>
          <span>MP:</span>
          <input id="spellManaCostInput" defaultValue={0} type="number" />
        </li>
        <li>
          <span>Seb:</span>
          <input id="spellDamageInput" defaultValue={1} type="number" /> K5
        </li>
        <li>
          <span>CÉO:</span>
          <input id="spellAimInput" defaultValue={0} step={0.5} type="number" />
          <button
            id="spellInputWrapperCancelCastButton"
            onClick={handleCancelSpellCast}>
            Mégse
          </button>
        </li>
        <button id="startCastButton" onClick={handleSpellCast}>
          Elkezdek varázsolni
        </button>
      </div>
      <div
        id="advancedSpellInputWrapper"
        className={styles.advancedSpellInputWrapper}>
        <li>
          Mágiaforma:
          <select
            id="magicSubSkillSelect"
            onChange={evaluateMagicSubSkill}></select>
          <div className={styles.liturgyWrapper} id="liturgyWrapper"><ul className={styles.liturgyPowerInfo} id="liturgyPowerInfo">
            Liturgia
          </ul>
          <input
            className={styles.liturgyCheckBox}
            id="liturgyCheckBox"
            type="checkbox"
            onChange={handleLiturgyCheckBoxChange}
          />
          </div>
        </li>
        <li>
          Varázslat:
          <select id="spellSelect" onChange={handleSpellChange}></select>
          <div onMouseEnter={handleSpellSelectMouseEnter}>Leírás</div>
        </li>
        <li>
          Erősség:
          <select id="powerAspSelect" onChange={handleSpellAspOptionChange}>
            {spellsAspDescript[0].map((power, i) => {
              return (
                <option value={i + 1} key={power}>
                  {power}
                </option>
              );
            })}
          </select>
        </li>
        <li>
          Távolság:
          <select id="distanceAspSelect" onChange={handleSpellAspOptionChange}>
            {spellsAspDescript[1].map((distance, i) => {
              return (
                <option value={i + 1} key={distance}>
                  {distance}
                </option>
              );
            })}
          </select>
        </li>
        <li>
          Terület:
          <select id="areaAspSelect" onChange={handleSpellAspOptionChange}>
            {spellsAspDescript[2].map((area, i) => {
              return (
                <option value={i + 1} key={area}>
                  {area}
                </option>
              );
            })}
          </select>
        </li>
        <li>
          Időtartam:
          <select id="durationAspSelect" onChange={handleSpellAspOptionChange}>
            {spellsAspDescript[3].map((duration, i) => {
              return (
                <option value={i + 1} key={duration}>
                  {duration}
                </option>
              );
            })}
          </select>
        </li>
        {/* <li>Mechanizmus:
                <select id='mechanismAspSelect'>
            </select>
            </li> */}
        <span className={styles.calculatedSpellStatsSpan}>
          <div>Varázslási idő:</div>
          <div id="spellCastTime"></div>
          <div>Mana költség:</div>
          <div id="spellManaCostDiv"></div>
        </span>
        <button
          id="advancedSpellInputWrapperCancelCastButton"
          onClick={handleCancelSpellCast}>
          Mégse
        </button>
        <button id="advancedStartCastButton" onClick={handleSpellCast}>
          Elkezdek varázsolni
        </button>
      </div>
      <div
        id="spellDescriptionWindow"
        className={styles.spellDescriptionWindow}
        onMouseLeave={handleSpellDescriptionMouseLeave}></div>
    </>
  );
}

export default Spells;
