import { allActiveBuffs } from '../pages';
import styles from '../styles/resistancesaptitudesracemofifiers.module.css';
import { buffTextChecker, dinamicResistanceRollModifier, dinamicResistanceRollModifierChanger } from './PsiDisciplines';
import { checkBoxTurnedFromNotCheckedToCheckedStatus, skillOrAttributeCheckRoll } from './SkillCheck';

function ResistancesAptitudesRaceMofifiers() {
    // Összetett Fizikai Szellemi Asztrális Mentális Elkerülő
   function rollResistance (event){
    let stessResist = true

    for (let i = 0; i < allActiveBuffs.length; i++) {
        if (allActiveBuffs[i].innerText.includes("Dinamikus ellenállás")) {
            stessResist = false
            dinamicResistanceRollModifierChanger(parseInt(
                allActiveBuffs[i].innerText.charAt(allActiveBuffs[i].innerText.search(/[0-9]/)) // regex 1 jegyű számokat keres a string-ben
                )
            )
            rollModifier.value = dinamicResistanceRollModifier
        }
      }

    if (checkBoxTurnedFromNotCheckedToCheckedStatus) {
        stessResist=true
    }
    if (stessResist) {
        skillCheckStressCheckbox.checked = true
    }
    if (!stessResist) {
        skillCheckStressCheckbox.checked = false
    }
    skillCheckBase.innerText = event.target.parentElement.lastChild.value // ez a li element innerText-je
    skillOrAttributeCheckRoll(stessResist)
        //currentCharFinalAttributes
   }

    return (
        <>
        <div className={styles.ResistancesAptitudesRaceMofifiersWrapper}>
           <ul className={styles.Resistances}>Ellenállások
           <li>Összetett:<div id='complexResist'>12</div><button onClick={rollResistance}>Dobj</button></li>
           <li>Fizikai:<div id='physicalResist'>12</div><button onClick={rollResistance}>Dobj</button></li>
           <li>Szellemi:<div id='spiritualResist'>12</div><button onClick={rollResistance}>Dobj</button></li>
           <li>Asztrális:<div id='astralResist'>12</div><button onClick={rollResistance}>Dobj</button></li>
           <li>Mentális:<div id='mentalResist'>12</div><button onClick={rollResistance}>Dobj</button></li>
           <li>Elkerülő:<div id='evasiveResist'>12</div><button onClick={rollResistance}>Dobj</button></li>
           </ul>
           <ul className={styles.Aptitudes}>Adottságok</ul>
           <ul className={styles.RaceMofifiers}>Faji módosítók</ul>
            </div>
            </>
    )
}

export default ResistancesAptitudesRaceMofifiers