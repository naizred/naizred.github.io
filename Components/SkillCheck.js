import { rollOptions, generator, filteredArrayIfHasAnyAffinity } from '../pages';
import { specialCases1, specialCases2, specialCases3 } from '../pages';
let skillCheckRollModifiers = [0, 1, 2, 3, 4, -1, -2, -3, -4];
let skillCheckSuccFailModifiers = [0, 1, 2, 3, 4, 5, -1, -2, -3, -4, -5];
let skillCheckRolled = false
export let numberOfClicksAtSkillCheck = 0
  
export async function skillOrAttributeCheckRoll(stressCheck, skillCheckLightDice, skillCheckDarkDice) {
  numberOfClicksAtSkillCheck++
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
        skillCheckResult.animate([{ color: "white" }, { color: "black" }], 200)
        
        if (numberOfClicksAtSkillCheck == 1) {
          const data = {
            charName: charName.innerText,
            currentFp: parseInt(currentFp.value),
            currentEp: parseInt(currentEp.value),
            currentPp: parseInt(currentPp.value),
            currentMp: parseInt(currentMp.value),
            currentLp: parseInt(currentLp.value),
             skillCheckResult: parseInt(skillCheckResult.innerText),
             skillCheckDice: `Siker/kudarcszint a dobásból: ${skillCheckCalculatedResultFromRoll}`,
             skillCheckResultAfter5sec: parseInt(skillCheckResult.innerText),
             skillCheckDiceAfter5sec:  `Siker/kudarcszint a dobásból: ${skillCheckCalculatedResultFromRoll}`
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
          await fetch(endpoint, options);
        }
        if(numberOfClicksAtSkillCheck > 1) setTimeout(() => {{
          const data = {
            charName: charName.innerText,
            skillCheckResultAfter5sec: parseInt(skillCheckResult.innerText),
            skillCheckDiceAfter5sec:  `Siker/kudarcszint a dobásból: ${skillCheckCalculatedResultFromRoll}`
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
        fetch(endpoint, options);
        }
        }, 50);
        setTimeout(() => {
          numberOfClicksAtSkillCheck = 0
        }, 6000);

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
        console.log("Stresszpróba DM előtt", skillCheckLightDice, skillCheckDarkDice)
        if (skillCheckLightDice == skillCheckDarkDice && parseInt(rollModifier.value)>0 && skillCheckLightDice !=1) {
    skillCheckLightDicePlusRollMod = skillCheckLightDice
        }
        console.log("Stresszpróba DM után", skillCheckLightDicePlusRollMod, skillCheckDarkDice)
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
        skillCheckResult.animate([{ color: "white" }, { color: "black" }], 200)
        if (numberOfClicksAtSkillCheck == 1) {
          const data = {
            charName: charName.innerText,
            currentFp: parseInt(currentFp.value),
            currentEp: parseInt(currentEp.value),
            currentPp: parseInt(currentPp.value),
            currentMp: parseInt(currentMp.value),
            currentLp: parseInt(currentLp.value),
             skillCheckResult: parseInt(skillCheckResult.innerText),
             skillCheckDice: `Siker/kudarcszint a dobásból: ${skillCheckCalculatedResultFromRoll}`,
             skillCheckResultAfter5sec: parseInt(skillCheckResult.innerText),
             skillCheckDiceAfter5sec:  `Siker/kudarcszint a dobásból: ${skillCheckCalculatedResultFromRoll}`
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
          await fetch(endpoint, options);
        }
        if(numberOfClicksAtSkillCheck > 1) setTimeout(() => {{
          const data = {
            charName: charName.innerText,
            skillCheckResultAfter5sec: parseInt(skillCheckResult.innerText),
            skillCheckDiceAfter5sec:  `Siker/kudarcszint a dobásból: ${skillCheckCalculatedResultFromRoll}`
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
        fetch(endpoint, options);
        }
        }, 50);
        setTimeout(() => {
          numberOfClicksAtSkillCheck = 0
        }, 6000);
    }
  }

export function handleSkillCheck(stressCheck, skillCheckLightDice, skillCheckDarkDice) {

    skillCheckRolled = true
    skillCheckUseLegendPointCheckBox.style.display = "grid"
      
      if (skillCheckStressCheckbox.checked == true) {
      stressCheck = true
    } else if (skillCheckStressCheckbox.checked == false) {
      stressCheck = false
    }
    skillCheckUseLegendPointCheckBox.checked = false
    skillOrAttributeCheckRoll(stressCheck, skillCheckLightDice, skillCheckDarkDice)
    skillCheckDarkDiceRerollByCounterLP.style.display = "none"
  skillCheckLightDiceRerollByCounterLP.style.display = "none"
}
let allSkillProps
export async function evaluateSkillOrAttributeCheckBase(event) {
    skillCheckDarkDiceRerollByCounterLP.style.display = "none"
    skillCheckLightDiceRerollByCounterLP.style.display = "none"
     if (checkTypeIsSkillCheck.checked == true) { 
      rollModifier.value = 0
      skills.disabled = false
       skillCheckBase.innerText = skills.value[0] * 2 + Math.floor(parseInt(attributes.value) / 2) + parseInt(succFailModifier.value);
       if (parseInt(attributes.value) % 2 == 1) {
         rollModifier.value = 1
        } else if (parseInt(attributes.value) % 2 == 0){
          rollModifier.value = 0
       }
       if (filteredArrayIfHasAnyAffinity.length != 0) {
         for (let i = 0; i < allSkillProps.length; i++) {
           let categoryOfCurrentSkill = ""
             if (skills.value.includes(allSkillProps[i].nameOfSkill)) {
               categoryOfCurrentSkill = allSkillProps[i].category
              for (let j = 0; j < filteredArrayIfHasAnyAffinity.length; j++) {
                if (filteredArrayIfHasAnyAffinity[j].aptitude.includes(categoryOfCurrentSkill) && rollModifier.value < filteredArrayIfHasAnyAffinity[j].level) {
                  rollModifier.value = filteredArrayIfHasAnyAffinity[j].level
                  break
                } 
               }
               break
             } else {
               continue
             }
           }     
       }
  
      } else if (checkTypeIsAttributeCheck.checked == true) {
       skillCheckBase.innerText = parseInt(attributes.value) + parseInt(succFailModifier.value)
       skills.disabled = true
       if (parseInt(attributes.value) % 2 == 1) {
        rollModifier.value = 1
       } else if (parseInt(attributes.value) % 2 == 0){
         rollModifier.value = 0
       }
      }
    skillCheckResult.innerText = ""
  }
function SkillCheck(props) {   
 allSkillProps = props.allSkills
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
    
    function handleWhenSkillCheckLegendPointIsUsed(event) {
        handleSkillCheck(true, parseInt(skillCheckLightDiceResultSelect.value), parseInt(skillCheckDarkDiceResultSelect.value))
        skillCheckUseLegendPointCheckBox.checked == false
        skillCheckUseLegendPointCheckBox.style.display = "none"
         skillCheckDarkDiceResultSelect.disabled = true
         skillCheckLightDiceResultSelect.disabled = true
         skillCheckRollButton.disabled = false
         if (skillCheckStressCheckbox.checked == false) {
           skillCheckLightDiceRerollByCounterLP.style.display = "grid"
           skillCheckDarkDiceRerollByCounterLP.style.display = "none"
         } else if (skillCheckStressCheckbox.checked == true) {
           if (event.target.id == "skillCheckDarkDiceResultSelect") {
             skillCheckDarkDiceRerollByCounterLP.style.display = "grid"
       } else if (event.target.id == "skillCheckLightDiceResultSelect") {
         skillCheckLightDiceRerollByCounterLP.style.display = "grid"
       }
         } 
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
    function handleCheckBoxChange() {
  
        skillCheckDarkDiceRerollByCounterLP.style.display = "none"
        skillCheckLightDiceRerollByCounterLP.style.display = "none"
      }

    return (
        <div id="skillCheckWrapper">
        <label htmlFor="skills" id="skillsLabel" className="skillCheckLabel">
            Választott képzettség:
          </label>
            <select defaultValue="" id="skills" name="skills" className="skillCheckSelect" onChange={evaluateSkillOrAttributeCheckBase}>
          <option value='' disabled>Válassz képzettséget</option>
          <option value={0} >Képzetlen</option>
          </select>
          <label htmlFor="attributes" id="attributesLabel" className="skillCheckLabel">
            Választott tulajdonság:
          </label>
            <select id="attributes" name="attributes" className="skillCheckSelect" onChange={evaluateSkillOrAttributeCheckBase}>
          </select>
          <label htmlFor="rollModifier" id="rollModifierLabel" className="skillCheckLabel">
            Dobásmódosító:
          </label>
          <select id="rollModifier" name="rollModifier" className="skillCheckSelect" onChange={()=>{skillCheckResult.innerText = ""; skillCheckDarkDiceRerollByCounterLP.style.display = "none";
    skillCheckLightDiceRerollByCounterLP.style.display = "none"}}>
          {skillCheckRollModifiers.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="succFailModifier" id="succFailModifierLabel" className="skillCheckLabel">
            Extra Siker-/Kudarcszint:
          </label>
          <select id="succFailModifier" name="succFailModifier" className="skillCheckSelect" onChange={evaluateSkillOrAttributeCheckBase}>
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
          <label id="skillCheckUseLegendPointCheckBoxlabel" htmlFor="skillCheckUseLegendPointCheckBox">Lp-t használok!</label>
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
          <div id="checkTypeWrapper">
            <label htmlFor="checkTypeIsSkillCheck" id="checkTypeIsSkillCheckLabel">Képzettségpróba</label>
            <input type="radio" name="checkType" id="checkTypeIsSkillCheck" defaultChecked={true} onChange={evaluateSkillOrAttributeCheckBase}/>
            <label htmlFor="checkTypeIsAttributeCheck" id="checkTypeIsAttributeCheckLabel">Tulajdonságpróba</label>
            <input type="radio" name="checkType" id="checkTypeIsAttributeCheck" onChange={evaluateSkillOrAttributeCheckBase}/>
          </div>
          <div id="skillCheckResultLabel">Próba végső eredménye:</div>
          <div id="skillCheckResult"></div>
          <div id="skillCheckStressCheckboxLabel">Stresszpróba:</div>
          <input type="checkBox" id="skillCheckStressCheckbox" onChange={handleCheckBoxChange}/>
          <div id="spiritualAttributesLabel">Szellemi tulajdonságok:</div>
          <div id="skillCheckLeftSideWrapper"></div>
          <div id="skillCheckRightSideWrapper"></div>
        </div>
    )
}

export default SkillCheck