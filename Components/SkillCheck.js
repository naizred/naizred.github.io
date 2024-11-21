import {
  rollOptions,
  generator,
  filteredArrayIfHasAnyAffinity,
} from "../pages";
import { specialCases1, specialCases2, specialCases3 } from "../pages";
import { updateCharacterData } from "./CharacterDetails";
let skillCheckRollModifiers = [0, 1, 2, 3, 4, -1, -2, -3, -4];
let skillCheckSuccFailModifiers = [0, 1, 2, 3, 4, 5, -1, -2, -3, -4, -5];

export let skillCheckCalculatedResultFromRoll = 0;

export async function skillOrAttributeCheckRoll(
  stressCheck,
  skillCheckLightDice,
  skillCheckDarkDice
) {
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
    console.log(
      "módosító nélkül:",
      skillCheckLightDice
    );
    skillCheckLightDice += parseInt(rollModifier.value);
    console.log(
      "módosítóval növelt dobás érték:",
      skillCheckLightDice
    );

    if (skillCheckLightDice >= 10) {
      skillCheckCalculatedResultFromRoll = 3;
    } else if (twoArray.includes(skillCheckLightDice)) {
      skillCheckCalculatedResultFromRoll = 2;
    } else if (oneArray.includes(skillCheckLightDice)) {
      skillCheckCalculatedResultFromRoll = 1;
    } else if (
      zeroArray.includes(skillCheckLightDice) ||
      skillCheckLightDice < 0
    ) {
      skillCheckCalculatedResultFromRoll = 0;
    }

    if (skillCheckLightDice >= 10) {
      skillCheckLightDice = 0;
    } else if (skillCheckLightDice <= 0) {
      skillCheckLightDice = 1;
    }
    skillCheckLightDiceResultSelect.value = skillCheckLightDice;
    skillCheckResult.innerText = parseInt(skillCheckBase.innerText) + skillCheckCalculatedResultFromRoll;
    skillCheckResult.animate([{ color: "white" }, { color: "black" }], 200);
  } else if (stressCheck == true) {
    if (skillCheckLightDice == undefined || skillCheckDarkDice == undefined) {
      skillCheckLightDice = Math.floor(generator.random() * 10);
      skillCheckDarkDice = Math.floor(generator.random() * 10);
      skillCheckDarkDiceResultSelect.value = skillCheckDarkDice;
    }
    if (skillCheckLightDice == 0) {
      skillCheckLightDice = 10;
    }
    if (skillCheckDarkDice == 0) {
      skillCheckDarkDice = 10;
    }

    let skillCheckLightDicePlusRollMod = skillCheckLightDice + parseInt(rollModifier.value);
    console.log(
      "módosítóval növelt dobás érték:",
      skillCheckLightDicePlusRollMod
    );
    if (skillCheckLightDicePlusRollMod >= 10) {
      skillCheckLightDicePlusRollMod = 10;
    }
    //---megnézi, hogy pozitív DM nélkül nem-e egyenlő a két kocka? Ez dupla 1 esetén is jól működik, mivel olyankor a pozitív módosító nem érvényesül

    console.log(
      "Stresszpróba DM előtt",
      skillCheckLightDice,
      skillCheckDarkDice
    );
    if (
      skillCheckLightDice == skillCheckDarkDice &&
      parseInt(rollModifier.value) > 0
    ) {
      skillCheckLightDicePlusRollMod = skillCheckLightDice;
    }
    console.log(
      "Stresszpróba DM után",
      skillCheckLightDicePlusRollMod,
      skillCheckDarkDice
    );
    if (skillCheckLightDicePlusRollMod > skillCheckDarkDice) {
      if (skillCheckLightDicePlusRollMod == 10) {
        skillCheckCalculatedResultFromRoll = 3;
      } else if (twoArray.includes(skillCheckLightDicePlusRollMod)) {
        skillCheckCalculatedResultFromRoll = 2;
      } else if (oneArray.includes(skillCheckLightDicePlusRollMod)) {
        skillCheckCalculatedResultFromRoll = 1;
      } else if (
        zeroArray.includes(skillCheckLightDicePlusRollMod) ||
        skillCheckLightDicePlusRollMod < 0
      ) {
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
    } else if (
      skillCheckLightDicePlusRollMod == skillCheckDarkDice &&
      specialCases1.includes(skillCheckDarkDice)
    ) {
      skillCheckCalculatedResultFromRoll = 3;
    } else if (
      skillCheckLightDicePlusRollMod == skillCheckDarkDice &&
      specialCases2.includes(skillCheckDarkDice)
    ) {
      skillCheckCalculatedResultFromRoll = 4;
    } else if (
      skillCheckLightDicePlusRollMod == skillCheckDarkDice &&
      specialCases3.includes(skillCheckDarkDice)
    ) {
      skillCheckCalculatedResultFromRoll = 5;
    } else if (
      skillCheckLightDicePlusRollMod == skillCheckDarkDice &&
      skillCheckDarkDice == 1
    ) {
      skillCheckCalculatedResultFromRoll = -6;
      if (soundToggleCheckbox.checked) {
        doubleOneRoll.play()
      }
    } else if (
      skillCheckLightDicePlusRollMod == skillCheckDarkDice &&
      skillCheckDarkDice == 10
    ) {
      skillCheckCalculatedResultFromRoll = 6;
      if (soundToggleCheckbox.checked) {
        doubleZeroRoll.play()
      }
    }

    if (skillCheckLightDicePlusRollMod >= 10) {
      skillCheckLightDicePlusRollMod = 0;
    } else if (skillCheckLightDicePlusRollMod <= 0) {
      skillCheckLightDicePlusRollMod = 1;
    }
    skillCheckLightDiceResultSelect.value = skillCheckLightDicePlusRollMod;
    skillCheckResult.innerText =
      parseInt(skillCheckBase.innerText) + skillCheckCalculatedResultFromRoll;
    skillCheckResult.animate([{ color: "white" }, { color: "black" }], 200);
  }
  updateCharacterData(false, false, true)
}

export function handleSkillCheck(
  stressCheck,
  skillCheckLightDice,
  skillCheckDarkDice
) {
  if (soundToggleCheckbox.checked) {
    rollDiceSound.play()
  }
  skillCheckRollButton.disabled = true;
  setTimeout(() => {
    skillCheckRollButton.disabled = false;
  }, 5000);
  evaluateSkillOrAttributeCheckBase()
  manuallySetRollModifier = 0
  if (skillCheckStressCheckbox.checked == true) {
    stressCheck = true;
  } else if (skillCheckStressCheckbox.checked == false) {
    stressCheck = false;
  }
  skillOrAttributeCheckRoll(
    stressCheck,
    skillCheckLightDice,
    skillCheckDarkDice
  );
}
let allSkillProps;
let manuallySetRollModifier = 0
export async function evaluateSkillOrAttributeCheckBase(event) {
  if (checkTypeIsSkillCheck.checked == true) {
    //rollModifier.value = 0;
    skills.disabled = false;
    skillCheckBase.innerText =
      skills.value[0] * 2 +
      Math.floor(parseInt(attributes.value) / 2) +
      parseInt(succFailModifier.value);
    if (parseInt(attributes.value) % 2 == 1 && manuallySetRollModifier == 0) {
      rollModifier.value = 1;
    } else if (parseInt(attributes.value) % 2 == 0 && manuallySetRollModifier == 0) {
      rollModifier.value = 0;
    }
    if (filteredArrayIfHasAnyAffinity.length != 0) {
      for (let i = 0; i < allSkillProps.length; i++) {
        let categoryOfCurrentSkill = "";
        if (skills.value.includes(allSkillProps[i].nameOfSkill)) {
          categoryOfCurrentSkill = allSkillProps[i].category;
          for (let j = 0; j < filteredArrayIfHasAnyAffinity.length; j++) {
            if (
              filteredArrayIfHasAnyAffinity[j].aptitude.includes(
                categoryOfCurrentSkill
              ) &&
              rollModifier.value < filteredArrayIfHasAnyAffinity[j].level
            ) {
              rollModifier.value = filteredArrayIfHasAnyAffinity[j].level;
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
    skillCheckBase.innerText =
      parseInt(attributes.value) + parseInt(succFailModifier.value);
      skills.disabled = true;
      rollModifier.value = 0;
  }
  skillCheckResult.innerText = "";
}
export let checkBoxTurnedFromNotCheckedToCheckedStatus = false
function SkillCheck(props) {
  allSkillProps = props.allSkills;
  let checkBoxStatusCheckedOnClick = false
  let checkBoxStatusCheckedOnMouseEnter = false
function handleSkillCheckStressCheckbox(event){
  checkBoxStatusCheckedOnClick = event.target.checked
  if (!checkBoxStatusCheckedOnMouseEnter && checkBoxStatusCheckedOnClick) {
    checkBoxTurnedFromNotCheckedToCheckedStatus = true
  } else {
    checkBoxTurnedFromNotCheckedToCheckedStatus = false
  }
}
function checkSkillCheckStressCheckboxStatus (event){
  checkBoxStatusCheckedOnMouseEnter = event.target.checked
}

  return (
    <div id="skillCheckWrapper">
      <label htmlFor="skills" id="skillsLabel" className="skillCheckLabel">
        Választott képzettség:
      </label>
      <select
        defaultValue=""
        id="skills"
        name="skills"
        className="skillCheckSelect"
        onChange={evaluateSkillOrAttributeCheckBase}>
        <option value="" disabled>
          Válassz képzettséget
        </option>
        <option value={0}>Képzetlen</option>
      </select>
      <label
        htmlFor="attributes"
        id="attributesLabel"
        className="skillCheckLabel">
        Választott tulajdonság:
      </label>
      <select
        id="attributes"
        name="attributes"
        className="skillCheckSelect"
        onChange={evaluateSkillOrAttributeCheckBase}></select>
      <label
        htmlFor="rollModifier"
        id="rollModifierLabel"
        className="skillCheckLabel">
        Dobásmódosító:
      </label>
      <select
        id="rollModifier"
        name="rollModifier"
        className="skillCheckSelect"
        onChange={() => {
          skillCheckResult.innerText = "";
          manuallySetRollModifier = parseInt(rollModifier.value)
          // skillCheckDarkDiceRerollByCounterLP.style.display = "none";
          // skillCheckLightDiceRerollByCounterLP.style.display = "none";
        }}>
        {skillCheckRollModifiers.map((e) => {
          return <option key={e}>{e}</option>;
        })}
      </select>
      <label
        htmlFor="succFailModifier"
        id="succFailModifierLabel"
        className="skillCheckLabel">
        Extra Siker-/Kudarcszint:
      </label>
      <select
        id="succFailModifier"
        name="succFailModifier"
        className="skillCheckSelect"
        onChange={evaluateSkillOrAttributeCheckBase}>
        {skillCheckSuccFailModifiers.map((e) => {
          return <option key={e}>{e}</option>;
        })}
      </select>
      <div id="skillCheckBaseLabel">Próba alap:</div>
      <div id="skillCheckBase"></div>

      <div id="skillCheckRollResultWrapper">
        <label
          htmlFor="skillCheckLightDiceResultSelect"
          id="skillCheckLightDiceResultLabel">
          Világos kocka:
        </label>
        <select id="skillCheckLightDiceResultSelect" name="" disabled={true}>
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
        <label
          htmlFor="skillCheckDarkDiceResultSelect"
          id="skillCheckDarkDiceResultLabel">
          Sötét kocka:
        </label>
        <select id="skillCheckDarkDiceResultSelect" name="" disabled={true}>
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
        <input
          type="radio"
          name="checkType"
          id="checkTypeIsSkillCheck"
          defaultChecked={true}
          onClick={evaluateSkillOrAttributeCheckBase}
        />
        <label
          htmlFor="checkTypeIsAttributeCheck"
          id="checkTypeIsAttributeCheckLabel">
          Tulajdonságpróba
        </label>
        <input
          type="radio"
          name="checkType"
          id="checkTypeIsAttributeCheck"
          onClick={evaluateSkillOrAttributeCheckBase}
        />
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
