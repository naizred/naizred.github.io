import styles from "../styles/actionlist.module.css";
import {
  allMagicSubskillsObject,
  allResultsCleaner,
  filteredArrayForNameOfHighestMagicalSkill,
  filteredArrayIfHasManaFlow,
} from "../pages";
import { blinkingText } from "./ActionsList";
import { initRolled } from "./CharacterDetails";
import {
  evaluateSkillOrAttributeCheckBase,
  handleSkillCheck,
} from "./SkillCheck";
export let actionsSpentSinceLastCast = 0;
export let spellIsBeingCast = false;
export let actionsNeededToBeAbleToCastAgain = 0;
export let rollButtonWasDisabledBeforeSpellCast = false;
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

export function spellCastingSuccessful() {
  if (spellIsBeingCast == true) {
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
    spellTypeQuestionWindow.style.display = "grid";
    attackRollButton.disabled = true;
    spellIsBeingCast = false;
    if (initRolled == true) {
      spellCastingActionButton.disabled = true;
    }
    actionsSpentSinceLastCast = 0;
  }
}
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

let manaNeededForTheSpell = 0;

function Spells(props) {
  let currentSpell;

  // mana tényező táblázatból és varázsidő tényező táblázat alapján írt függvények az egyes aspektusok mana értékének kiszámításához

  function manaFactorCalculator(asp) {
    let manaFactor = 0;
    for (let i = 1; i < asp; i++) {
      manaFactor += i;
    }
    return manaFactor;
  }
  function spellCastTimeFactorCalculator(asp = 0) {
    let spellCastTimeFactor = 0;
    return (spellCastTimeFactor = asp - 2);
  }
  function handleClickOnSpellCastButton() {
    allAspSelect = document.querySelectorAll("[id*='AspSelect']");
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
          spellCastingSuccessful();
        }
      }
    }
    if (spellIsBeingCast == false && actionsNeededToBeAbleToCastAgain == 0) {
      //***************************************************************************** */
      // itt lesznek betöltve és szűrve a varázslatok, amíg nincs rendesen mecsinálva, addig a sima varázs bevitel lesz érvényben
      //******************************************************************************* */
      if (
        filteredArrayForNameOfHighestMagicalSkill &&
        filteredArrayForNameOfHighestMagicalSkill[0].name.includes(
          "Boszorkánym"
        )
      ) {
        advancedSpellInputWrapper.style.display = "grid";
        warningWindow.innerText = "";
        removeAllOptions("magicSubSkillSelect");

        for (let i = 0; i < allMagicSubskillsObject.length; i++) {
          let magicSubSkillOption = document.createElement("option");
          magicSubSkillOption.innerText = allMagicSubskillsObject[i][0];
          magicSubSkillOption.value =
            allMagicSubskillsObject[i][1] + allMagicSubskillsObject[i][0];
          magicSubSkillSelect.appendChild(magicSubSkillOption);
        }
        evaluateMagicSubSkill();
        evaluateSpell();
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
    let filteredSpellsBySubSkillAndLevel = props.spellsWarlock.filter(
      (spell) =>
        spell.magicSubclass == magicSubSkillSelect.value.slice(1) &&
        spell.fok <= parseInt(magicSubSkillSelect.value[0])
    );
    console.log(filteredSpellsBySubSkillAndLevel);
    for (let i = 0; i < filteredSpellsBySubSkillAndLevel.length; i++) {
      let spellSkillOption = document.createElement("option");
      spellSkillOption.innerText = filteredSpellsBySubSkillAndLevel[i].name;
      //spellSkillOption.value =
      spellSelect.appendChild(spellSkillOption);
    }
    evaluateSpell();
  }
  function evaluateSpell() {
        for (let i = 1; i < allAspSelect.length; i++) {
        allAspSelect[i].disabled = false;
      }
      powerAspModified = false;
  anyAspExceptPowerAspModified = false;
    currentSpell = props.spellsWarlock.find(
      (spell) => spell.name == `${spellSelect.value}`
    );

    powerAspSelect.value = currentSpell.aspects[0][1];
    distanceAspSelect.value = currentSpell.aspects[1][1];
    areaAspSelect.value = currentSpell.aspects[2][1];
    durationAspSelect.value = currentSpell.aspects[3][1];
    powerAspSelect.parentElement.value = currentSpell.aspects[0][1];
    distanceAspSelect.parentElement.value = currentSpell.aspects[1][1];
    areaAspSelect.parentElement.value = currentSpell.aspects[2][1];
    durationAspSelect.parentElement.value = currentSpell.aspects[3][1];
    calculateSpellCastTimeAndManaCost();
    aspOptionDisabler(filteredArrayForNameOfHighestMagicalSkill[0].level);
  }

  function aspOptionDisabler(magicSkillLevel) {
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

    if (filteredArrayIfHasManaFlow.length != 0) {
      finalCastTime -= filteredArrayIfHasManaFlow[0].level;
    }
    console.log(Math.max(...highestAspectOfUnmodifiedAspects));
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

    spellManaCostDiv.innerText = finalManaCost;
  }

  function removeAllOptions(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
  }

  function handleSpellCast(event) {
    let spellManaCost = 0;
    castBarCurrentWidthStart = 0;
    castBarCurrentWidthEnd = 0;
    if (event.target.id == "advancedStartCastButton") {
      spellManaCost = parseInt(spellManaCostDiv.innerText);
      let selectAllSkillOptions = document.querySelectorAll(
        "select#skills option"
      );
      let selectAllAttributeOptions = document.querySelectorAll(
        "select#attributes option"
      );
      let spellAttributesArray = Object.entries(props.spellAttributes[0]);
      let highestAttributeForMagicSubSkill = "";

      for (let i = 0; i < spellAttributesArray.length; i++) {
        console.log(spellAttributesArray[i][0]);
        let spellSubskillAttributesArray = Object.entries(
          spellAttributesArray[i][1]
        );
        console.log(spellSubskillAttributesArray);
        let spellAttribute1value = 0;
        let spellAttribute2value = 0;
        if (
          spellAttributesArray[i][0] ==
          filteredArrayForNameOfHighestMagicalSkill[0].name
        ) {
          for (let j = 0; j < spellSubskillAttributesArray.length; j++) {
            console.log(
              spellSubskillAttributesArray[j],
              spellSubskillAttributesArray[j][1],
              spellSubskillAttributesArray[j][0],
              magicSubSkillSelect.value.slice(1)
            );
            if (
              spellSubskillAttributesArray[j][0] ==
              magicSubSkillSelect.value.slice(1)
            ) {
              for (let k = 0; k < selectAllAttributeOptions.length; k++) {}
              spellAttribute1value = spellSubskillAttributesArray[j][1][0];
              spellAttribute2value = spellSubskillAttributesArray[j][1][1];
              console.log(spellAttribute1value, spellAttribute2value);
              break;
            }
          }

          //   for (let k = 0; k < selectAllAttributeOptions.length; k++) {
          //     console.log(selectAllAttributeOptions[k].value.slice(-3));
          //     if (condition) {
          //     }
          //   }
          //   break;
        }
      }
     if(powerAspModified==true || anyAspExceptPowerAspModified==true){ for (let j = 0; j < selectAllSkillOptions.length; j++) {
        if (
          selectAllSkillOptions[j].value.includes(
            magicSubSkillSelect.value.slice(1)
          )
        ) {
          skills.value = selectAllSkillOptions[j].value;
          break;
        }
      }

      for (let i = 0; i < selectAllAttributeOptions.length; i++) {
        if (selectAllAttributeOptions[i].innerText == "Erő") {
          attributes.value = selectAllAttributeOptions[i].value;
          break;
        }
      }
      console.log(spellAttributesArray);
      evaluateSkillOrAttributeCheckBase();
      handleSkillCheck(false);
         }
      if (powerAspSelect.value == 1 || powerAspSelect.value == 2) {
        numberOfDiceInput.value = powerAspSelect.value;
      }
      if (powerAspSelect.value > 2) {
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
    actionsNeededToBeAbleToCastAgain = 1 + Math.floor(spellManaCost / 10);
    advancedSpellInputWrapper.style.display = "none";
    spellInputWrapper.style.display = "none";
    if (initRolled == true && attackRollButton.disabled == true) {
      rollButtonWasDisabledBeforeSpellCast = true;
    }
    if (initRolled == true && attackRollButton.disabled == false) {
      rollButtonWasDisabledBeforeSpellCast = false;
    }
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
      spellIsBeingCast = true;
      numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
      spellCastingSuccessful();
    }
    evaluateSpell()
  }
  function handleCancelSpellCast(event) {
    if (event.target.id == "advancedSpellInputWrapperCancelCastButton") {
      advancedSpellInputWrapper.style.display = "none";
    }
    if (event.target.id == "spellInputWrapperCancelCastButton") {
      spellInputWrapper.style.display = "none";
    }
  }
  function handleSpellSelectMouseEnter() {
    spellDescriptionWindow.style.display = "grid";

    spellDescriptionWindow.innerText = `${currentSpell.description}`;
  }
  function handleSpellDescriptionMouseLeave() {
    spellDescriptionWindow.animate([{ opacity: 1 }, { opacity: 0 }], 500);
    setTimeout(() => {
      spellDescriptionWindow.style.display = "none";
    }, 490);
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
        </li>
        <li>
          Varázslat:
          <select id="spellSelect" onChange={evaluateSpell}></select>
          <div onMouseEnter={handleSpellSelectMouseEnter}>Leírás</div>
        </li>
        <li>
          Erősség:
          <select id="powerAspSelect" onChange={handleSpellAspOptionChange}>
            {props.spellsAspDescript[0].map((power, i) => {
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
            {props.spellsAspDescript[1].map((distance, i) => {
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
            {props.spellsAspDescript[2].map((area, i) => {
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
            {props.spellsAspDescript[3].map((duration, i) => {
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
