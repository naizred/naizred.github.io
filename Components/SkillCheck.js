import { rollOptions, generator, filteredArrayIfHasAnyAffinity, updateCharacterSocketData } from "../pages";
import { specialCases1, specialCases2, specialCases3 } from "../pages";
import { updateCharacterData } from "./CharacterDetails";
import allSkills from "../json/allSkills.json";
let skillCheckRollModifiers = [0, 1, 2, 3, 4, -1, -2, -3, -4];
let skillCheckSuccFailModifiers = [0, 1, 2, 3, 4, 5, -1, -2, -3, -4, -5];

export let skillCheckCalculatedResultFromRoll = 0;

export async function skillOrAttributeCheckRoll(event, stressCheck, skillCheckLightDice, skillCheckDarkDice) {
  if (manuallySetRollModifier > 0) {
    allRollModifiersArray.push(`+${manuallySetRollModifier}`);
  }

  let zeroArray = [1, 2, 3, 4];
  let oneArray = [5, 6, 7];
  let twoArray = [8, 9];
  if (stressCheck == false) {
    if (skillCheckLightDice == undefined) {
      skillCheckLightDice = Math.floor(generator.random() * 10);
    }

    if (skillCheckLightDice == 0) {
      skillCheckLightDice = 10;
    }
    console.log("módosító nélkül:", skillCheckLightDice);
    allRollModifiersArray.sort((a, b) => parseInt(b) - parseInt(a));
    if (event.target.id == "skillCheckRollButton") {
      skillCheckLightDice += parseInt(allRollModifiersArray[0]) || 0;
    }

    if (manuallySetRollModifier < 0) {
      skillCheckLightDice += manuallySetRollModifier;
    }

    if (skillCheckLightDice >= 10) {
      skillCheckCalculatedResultFromRoll = 3;
    } else if (twoArray.includes(skillCheckLightDice)) {
      skillCheckCalculatedResultFromRoll = 2;
    } else if (oneArray.includes(skillCheckLightDice)) {
      skillCheckCalculatedResultFromRoll = 1;
    } else if (zeroArray.includes(skillCheckLightDice) || skillCheckLightDice < 0) {
      skillCheckCalculatedResultFromRoll = 0;
    }

    if (skillCheckLightDice >= 10) {
      skillCheckLightDice = 0;
    } else if (skillCheckLightDice <= 0) {
      skillCheckLightDice = 1;
    }
    console.log("dobás érték módosítóval:", skillCheckLightDice);
    skillCheckLightDiceResultSelect.value = skillCheckLightDice;
    skillCheckResult.innerText = parseInt(skillCheckBase.innerText) + skillCheckCalculatedResultFromRoll;
    skillCheckResult.animate([{ color: "white" }, { color: "black" }], 200);
    // stresszpróba esetén
  } else if (stressCheck == true) {
    if (skillCheckLightDice == undefined || skillCheckDarkDice == undefined) {
      skillCheckLightDice = Math.floor(generator.random() * 10);
      skillCheckDarkDice = Math.floor(generator.random() * 10);
      skillCheckDarkDiceResultSelect.value = skillCheckDarkDice;
    }
    // teszteléshez:
    // skillCheckLightDice = 8
    // skillCheckDarkDice = 7

    if (skillCheckLightDice == 0) {
      skillCheckLightDice = 10;
    }
    if (skillCheckDarkDice == 0) {
      skillCheckDarkDice = 10;
    }

    // let skillCheckLightDicePlusRollMod = skillCheckLightDice + parseInt(rollModifier.value);
    // console.log("módosítóval növelt dobás érték:", skillCheckLightDicePlusRollMod);

    //---megnézi, hogy pozitív DM nélkül nem-e egyenlő a két kocka? Ez dupla 1 esetén is jól működik, mivel olyankor a pozitív módosító nem érvényesül
    //--- bonyolítani kellett a logikát, mert előfordul, hogy több pozitív DM is van. Ha ezek közül 2 egyenlő, akkor akár -1 el is lehet befolyásolni a stresszpróbát, ha az kedvezőbb a játékosnak

    let allRollModifiersObject = {}; // objektum kizárólag a módosítók megszámolására
    let rollModifierThatOccuredAtLeastTwoTimesInTheRollModifiersArray = 0; // az a dobásmódosító, amiből legalább 2 van a módosítók tömbjében

    for (let rollModifier of allRollModifiersArray) {
      // ez az egész művelet csak azért kell, hogy találjon 2 db azonos DM-et. Ha megvan, akkor a "rollModifierThatOccuredAtLeastTwoTimesInTheRollModifiersArray" változó értékét egyenlővé teszi ezzel (az elsővel amit talál)
      allRollModifiersObject[rollModifier] = (allRollModifiersObject[rollModifier] || 0) + 1;
      if (allRollModifiersObject[rollModifier] >= 2) {
        rollModifierThatOccuredAtLeastTwoTimesInTheRollModifiersArray = rollModifier;
      }
    }

    console.log(allRollModifiersObject, rollModifierThatOccuredAtLeastTwoTimesInTheRollModifiersArray);

    console.log("Eredeti dobás eredménye", skillCheckLightDice, skillCheckDarkDice);

    if (manuallySetRollModifier < 0 && event.target.id == "skillCheckRollButton") {
      // ha kisebb mint 0, akkor az azt jelenti, hogy nem elhagyható ez a módosító. Ilyen, negatív módosítót jelenleg csak kézzel lehet bevinni
      skillCheckLightDice += parseInt(manuallySetRollModifier);
    }
    let skillCheckLightDicePlusRollMod = skillCheckLightDice; // módosított világos kocka értéke. Kezdő értéke a világos kocka dobott értéke

    console.log("Stresszpróba negatív DM levonva", skillCheckLightDicePlusRollMod, skillCheckDarkDice);
    if (skillCheckLightDicePlusRollMod != skillCheckDarkDice) {
      // ha a módosítóval megnövelt érték nem eleve egyenlő a sötét kocka értékével (itt ez még a világos kocka dobott értéke)
      allRollModifiersArray.sort();
      console.log(allRollModifiersArray);
      for (let i = 0; i < allRollModifiersArray.length; i++) {
        if (parseInt(rollModifierThatOccuredAtLeastTwoTimesInTheRollModifiersArray) != 0 && skillCheckLightDicePlusRollMod > 2) {
          // ha van olyan módosító, ami legalább kétszer fordul elő akkor a pozitív módosítót negatívra válthatjuk, ha az előnyösebb a stresszpróbánál
          skillCheckLightDicePlusRollMod = skillCheckLightDice - parseInt(rollModifierThatOccuredAtLeastTwoTimesInTheRollModifiersArray);
          // if (skillCheckLightDicePlusRollMod <= 0) {
          //   skillCheckLightDicePlusRollMod = 1;
          // }
          if (skillCheckLightDicePlusRollMod == skillCheckDarkDice) {
            break;
          }
        }
        if (event.target.id == "skillCheckRollButton") {
          skillCheckLightDicePlusRollMod = skillCheckLightDice + parseInt(allRollModifiersArray[i]);
        }
        if (skillCheckLightDicePlusRollMod >= 10) {
          skillCheckLightDicePlusRollMod = 10;
        }
        if (skillCheckLightDicePlusRollMod <= 1) {
          skillCheckLightDicePlusRollMod = 1;
        }
        //akkor végigmegyünk a Dobásmódosítók tömbjén, és minden esetben megnézzük, hogy nem lenne-e előnyösebb elhagyni azt
        if (skillCheckLightDicePlusRollMod == skillCheckDarkDice) {
          break;
        }
      }
    }
    console.log("Stresszpróba DM után", skillCheckLightDicePlusRollMod, skillCheckDarkDice);
    if (skillCheckLightDicePlusRollMod > skillCheckDarkDice) {
      if (skillCheckLightDicePlusRollMod == 10) {
        skillCheckCalculatedResultFromRoll = 3;
      } else if (twoArray.includes(skillCheckLightDicePlusRollMod)) {
        skillCheckCalculatedResultFromRoll = 2;
      } else if (oneArray.includes(skillCheckLightDicePlusRollMod)) {
        skillCheckCalculatedResultFromRoll = 1;
      } else if (zeroArray.includes(skillCheckLightDicePlusRollMod) || skillCheckLightDicePlusRollMod < 0) {
        skillCheckCalculatedResultFromRoll = 0;
      }
    } else if (skillCheckLightDicePlusRollMod < skillCheckDarkDice) {
      if (skillCheckDarkDice == 10) {
        skillCheckCalculatedResultFromRoll = -3;
      } else if (twoArray.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = -2;
      } else if (oneArray.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = -1;
      } else if (zeroArray.includes(skillCheckDarkDice)) {
        skillCheckCalculatedResultFromRoll = 0;
      }
    } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && specialCases1.includes(skillCheckDarkDice)) {
      skillCheckCalculatedResultFromRoll = 3;
    } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && specialCases2.includes(skillCheckDarkDice)) {
      skillCheckCalculatedResultFromRoll = 4;
    } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && specialCases3.includes(skillCheckDarkDice)) {
      skillCheckCalculatedResultFromRoll = 5;
    } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && skillCheckDarkDice == 1) {
      skillCheckCalculatedResultFromRoll = -6;
      if (soundToggleCheckbox.checked) {
        doubleOneRoll.play();
      }
    } else if (skillCheckLightDicePlusRollMod == skillCheckDarkDice && skillCheckDarkDice == 10) {
      skillCheckCalculatedResultFromRoll = 6;
      if (soundToggleCheckbox.checked) {
        doubleZeroRoll.play();
      }
    }

    if (skillCheckLightDicePlusRollMod >= 10) {
      skillCheckLightDicePlusRollMod = 0;
    } else if (skillCheckLightDicePlusRollMod <= 0) {
      skillCheckLightDicePlusRollMod = 1;
    }
    skillCheckLightDiceResultSelect.value = skillCheckLightDicePlusRollMod;
    skillCheckResult.innerText = parseInt(skillCheckBase.innerText) + skillCheckCalculatedResultFromRoll;
    skillCheckResult.animate([{ color: "white" }, { color: "black" }], 200);
  }
  updateCharacterSocketData(event);
  //console.log(allRollModifiersArray);
}

export let allRollModifiersArray = []; // ebbe az array-ba fogjuk berakni az összes Dobásmódosítót, hogy lássuk, miből lehet válogatni stresszpróbánál
export function emptyAllRollModifiersArray() {
  allRollModifiersArray = [];
}
export function handleSkillCheck(event, stressCheck, skillCheckLightDice, skillCheckDarkDice) {
  if (soundToggleCheckbox.checked) {
    rollDiceSound.play();
  }
  allRollModifiersArray = [];
  skillCheckRollButton.disabled = true;
  let selectAllResistButtons = document.querySelectorAll("[id*='ResistButton']");
  for (let i = 0; i < selectAllResistButtons.length; i++) {
    selectAllResistButtons[i].disabled = true;
  }
  setTimeout(() => {
    skillCheckRollButton.disabled = false;
    for (let i = 0; i < selectAllResistButtons.length; i++) {
      selectAllResistButtons[i].disabled = false;
    }
  }, 3000);
  evaluateSkillOrAttributeCheckBase();
  if (skillCheckStressCheckbox.checked == true) {
    stressCheck = true;
  } else if (skillCheckStressCheckbox.checked == false) {
    stressCheck = false;
  }
  skillOrAttributeCheckRoll(event, stressCheck, skillCheckLightDice, skillCheckDarkDice);
  manuallySetRollModifier = 0;
  manuallySetSuccFailModifer = 0;
}

export let manuallySetRollModifier = 0;
export let manuallySetSuccFailModifer = 0;
export function setManuallySetRollModifier(modifier = 0) {
  manuallySetRollModifier = modifier;
}
export function setManuallySetSuccFailModifer(modifier = 0) {
  manuallySetSuccFailModifer = modifier;
}
export async function evaluateSkillOrAttributeCheckBase(event) {
  if (checkTypeIsSkillCheck.checked == true) {
    //rollModifier.value = 0;
    skills.disabled = false;
    if (skills.value == "") {
      skills.value = 0;
    }
    skillCheckBase.innerText = skills.value[0] * 2 + Math.floor(parseInt(attributes.value) / 2) + parseInt(succFailModifier.value);
    if (parseInt(attributes.value) % 2 == 1) {
      if (manuallySetRollModifier == 0 || manuallySetRollModifier == 1)
        if (manuallySetRollModifier >= 0) {
          // ha nem volt kézi állítás, akkor írja át 1 -re
          rollModifier.value = 1;
        }
      allRollModifiersArray.push("+1");
    } else if (parseInt(attributes.value) % 2 == 0 && manuallySetRollModifier == 0) {
      rollModifier.value = 0;
    }
    if (filteredArrayIfHasAnyAffinity.length != 0) {
      for (let i = 0; i < allSkills.length; i++) {
        let categoryOfCurrentSkill = "";
        if (skills.value.includes(allSkills[i].nameOfSkill)) {
          categoryOfCurrentSkill = allSkills[i].category;
          for (let j = 0; j < filteredArrayIfHasAnyAffinity.length; j++) {
            if (filteredArrayIfHasAnyAffinity[j].aptitude.includes(categoryOfCurrentSkill)) {
              if (manuallySetRollModifier >= 0 && filteredArrayIfHasAnyAffinity[j].level >= manuallySetRollModifier) {
                // ha nem volt kézi állítás, csak akkor írja át
                rollModifier.value = filteredArrayIfHasAnyAffinity[j].level;
              }
              allRollModifiersArray.push(`+${filteredArrayIfHasAnyAffinity[j].level}`);
              break;
            }
          }
          break;
        } else {
          continue;
        }
      }
    }
  } else if (checkTypeIsAttributeCheck.checked == true) {
    skills.value = "";
    skillCheckBase.innerText = parseInt(attributes.value) + parseInt(succFailModifier.value);
    skills.disabled = true;
    if (manuallySetRollModifier == 0) {
      rollModifier.value = 0;
    }
  }
  skillCheckResult.innerText = "";
}
export let checkBoxTurnedFromNotCheckedToCheckedStatus = false;
function SkillCheck() {
  let checkBoxStatusCheckedOnClick = false;
  let checkBoxStatusCheckedOnMouseEnter = false;
  function handleSkillCheckStressCheckbox(event) {
    checkBoxStatusCheckedOnClick = event.target.checked;
    if (!checkBoxStatusCheckedOnMouseEnter && checkBoxStatusCheckedOnClick) {
      checkBoxTurnedFromNotCheckedToCheckedStatus = true;
    } else {
      checkBoxTurnedFromNotCheckedToCheckedStatus = false;
    }
  }
  function checkSkillCheckStressCheckboxStatus(event) {
    checkBoxStatusCheckedOnMouseEnter = event.target.checked;
  }

  return (
    <div id="skillCheckWrapper">
      <label htmlFor="skills" id="skillsLabel" className="skillCheckLabel">
        Választott képzettség:
      </label>
      <select defaultValue="" id="skills" name="skills" className="skillCheckSelect" disabled={true} onChange={evaluateSkillOrAttributeCheckBase}>
        <option value="" disabled>
          Válassz képzettséget
        </option>
        <option value={0}>Képzetlen</option>
      </select>
      <label htmlFor="attributes" id="attributesLabel" className="skillCheckLabel">
        Választott tulajdonság:
      </label>
      <select id="attributes" name="attributes" className="skillCheckSelect" onChange={evaluateSkillOrAttributeCheckBase}></select>
      <label htmlFor="rollModifier" id="rollModifierLabel" className="skillCheckLabel">
        Dobásmódosító:
      </label>
      <select
        id="rollModifier"
        name="rollModifier"
        className="skillCheckSelect"
        onChange={() => {
          skillCheckResult.innerText = "";
          manuallySetRollModifier = parseInt(rollModifier.value);
          // skillCheckDarkDiceRerollByCounterLP.style.display = "none";
          // skillCheckLightDiceRerollByCounterLP.style.display = "none";
        }}
      >
        {skillCheckRollModifiers.map((e) => {
          return <option key={e}>{e}</option>;
        })}
      </select>
      <label htmlFor="succFailModifier" id="succFailModifierLabel" className="skillCheckLabel">
        Extra Siker-/Kudarcszint:
      </label>
      <select
        id="succFailModifier"
        name="succFailModifier"
        className="skillCheckSelect"
        onChange={() => {
          manuallySetSuccFailModifer = succFailModifier.value;
          evaluateSkillOrAttributeCheckBase();
        }}
      >
        {skillCheckSuccFailModifiers.map((e) => {
          return <option key={e}>{e}</option>;
        })}
      </select>
      <div id="skillCheckBaseLabel">Próba alap:</div>
      <div id="skillCheckBase"></div>

      <div id="skillCheckRollResultWrapper">
        <label htmlFor="skillCheckLightDiceResultSelect" id="skillCheckLightDiceResultLabel">
          Világos kocka:
        </label>
        <select
          id="skillCheckLightDiceResultSelect"
          name=""
          onChange={(event) => {
            skillOrAttributeCheckRoll(event, skillCheckStressCheckbox.checked, parseInt(skillCheckLightDiceResultSelect.value), parseInt(skillCheckDarkDiceResultSelect.value));
          }}
        >
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
        <label htmlFor="skillCheckDarkDiceResultSelect" id="skillCheckDarkDiceResultLabel">
          Sötét kocka:
        </label>
        <select
          id="skillCheckDarkDiceResultSelect"
          name=""
          onChange={(event) => {
            skillOrAttributeCheckRoll(event, skillCheckStressCheckbox.checked, parseInt(skillCheckLightDiceResultSelect.value), parseInt(skillCheckDarkDiceResultSelect.value));
          }}
        >
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
      </div>
      <div id="physicalAttributesLabel">Fizikai tulajdonságok:</div>
      <button type="" id="skillCheckRollButton" onClick={handleSkillCheck}>
        Próba dobás
      </button>
      <div id="checkTypeWrapper">
        <label htmlFor="checkTypeIsSkillCheck" id="checkTypeIsSkillCheckLabel">
          Képzettségpróba
        </label>
        <input type="radio" name="checkType" id="checkTypeIsSkillCheck" onClick={evaluateSkillOrAttributeCheckBase} />
        <label htmlFor="checkTypeIsAttributeCheck" id="checkTypeIsAttributeCheckLabel">
          Tulajdonságpróba
        </label>
        <input type="radio" name="checkType" id="checkTypeIsAttributeCheck" defaultChecked={true} onClick={evaluateSkillOrAttributeCheckBase} />
      </div>
      <div id="skillCheckResultLabel">Próba végső eredménye:</div>
      <div id="skillCheckResult"></div>
      <div id="skillCheckStressCheckboxLabel">Stresszpróba:</div>
      <input type="checkBox" onMouseEnter={checkSkillCheckStressCheckboxStatus} onChange={handleSkillCheckStressCheckbox} id="skillCheckStressCheckbox" />
      <div id="spiritualAttributesLabel">Szellemi tulajdonságok:</div>
      <div id="skillCheckLeftSideWrapper"></div>
      <div id="skillCheckRightSideWrapper"></div>
    </div>
  );
}

export default SkillCheck;
