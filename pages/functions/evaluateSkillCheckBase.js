import { filteredArrayIfHasAnyAffinity } from ".."
import { getStaticProps } from ".."


export async function evaluateSkillOrAttributeCheckBase(event) {
    await getStaticProps()
    skillCheckDarkDiceRerollByCounterLP.style.display = "none"
    skillCheckLightDiceRerollByCounterLP.style.display = "none"
     if (checkTypeIsSkillCheck.checked == true) { 
      rollModifier.value = 0
      skills.disabled = false
       skillCheckBase.innerText = skills.value[0] * 2 + Math.floor(attributes.value / 2) + parseInt(succFailModifier.value);
       if (attributes.value % 2 == 1) {
         rollModifier.value = 1
        } else if (attributes.value % 2 == 0){
          rollModifier.value = 0
       }
       if (filteredArrayIfHasAnyAffinity.length != 0) {
         for (let i = 0; i < props.allSkills.length; i++) {
           let categoryOfCurrentSkill = ""
           console.log(skills.value)
             if (skills.value.includes(props.allSkills[i].nameOfSkill)) {
               categoryOfCurrentSkill = props.allSkills[i].category
              for (let j = 0; j < filteredArrayIfHasAnyAffinity.length; j++) {
                if (filteredArrayIfHasAnyAffinity[j].aptitude.includes(categoryOfCurrentSkill) && rollModifier.value < filteredArrayIfHasAnyAffinity[j].level) {
                  rollModifier.value = filteredArrayIfHasAnyAffinity[j].level
                  console.log(filteredArrayIfHasAnyAffinity[j].aptitude, filteredArrayIfHasAnyAffinity[j].level)
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
       if (attributes.value % 2 == 1) {
        rollModifier.value = 1
       } else if (attributes.value % 2 == 0){
         rollModifier.value = 0
       }
      }
    skillCheckResult.innerText = ""
  }