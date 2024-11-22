import { allActiveBuffs, aptitudeObject } from '../pages';
import styles from '../styles/resistancesaptitudesracemofifiers.module.css';
import { dinamicResistanceRollModifier, dinamicResistanceRollModifierChanger } from './PsiDisciplines';
import { checkBoxTurnedFromNotCheckedToCheckedStatus, manuallySetRollModifier, setManuallySetRollModifierToZero, skillOrAttributeCheckRoll } from './SkillCheck';

function ResistancesAptitudesRaceMofifiers() {
    // Összetett Fizikai Szellemi Asztrális Mentális Elkerülő
   function rollResistance (event){
    if (soundToggleCheckbox.checked) {
        rollDiceSound.play()
      }
    let stessResist = true

    if (manuallySetRollModifier == 0) {
        rollModifier.value = 0
    }

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

    function setResistDMfromAptitudes(resistButtonId, aptitude){
    if (event.target.id == resistButtonId && aptitudeObject[aptitude] && 
        aptitudeObject[aptitude] > dinamicResistanceRollModifier && 
        aptitudeObject[aptitude] > manuallySetRollModifier) {
        rollModifier.value = aptitudeObject[aptitude]
      }
    }

    setResistDMfromAptitudes("physicalResistButton", "Masszív")
    setResistDMfromAptitudes("astralResistButton", "Összeszedett")
    setResistDMfromAptitudes("mentalResistButton", "Lélekerő")
    setResistDMfromAptitudes("evasiveResistButton", "Intuitív")

    if (event.target.id == "spiritualResistButton" && parseInt(event.target.value) == parseInt(astralResistButton.value)) {
        setResistDMfromAptitudes("spiritualResistButton", "Összeszedett")
    }
    if (event.target.id == "spiritualResistButton" && parseInt(event.target.value) == parseInt(mentalResistButton.value)) {
        setResistDMfromAptitudes("spiritualResistButton", "Lélekerő")
    }
    if (event.target.id == "complexResistButton" && parseInt(event.target.value) == parseInt(astralResistButton.value)) {
        setResistDMfromAptitudes("complexResistButton", "Összeszedett")
    }
    if (event.target.id == "complexResistButton" && parseInt(event.target.value) == parseInt(mentalResistButton.value)) {
        setResistDMfromAptitudes("complexResistButton", "Lélekerő")
    }
    if (event.target.id == "complexResistButton" && parseInt(event.target.value) == parseInt(physicalResistButton.value)) {
        setResistDMfromAptitudes("complexResistButton", "Masszív")
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
    let selectAllAttributeOptions = document.querySelectorAll(
        "select#attributes option"
    );
    for (let i = 0; i < selectAllAttributeOptions.length; i++) {
        let attributesToSearchFor = []
        if (event.target.id.includes("complex")) {
            attributesToSearchFor = ["Asz", "Egé", "Aka", "Áll"]
        }
        if (event.target.id.includes("physical")) {
            attributesToSearchFor = ["Egé", "Áll"]
        }
        if (event.target.id.includes("spiritual")) {
            attributesToSearchFor = ["Asz", "Aka"]
        }
        if (event.target.id.includes("astral")) {
            attributesToSearchFor = ["Asz"]
        }
        if (event.target.id.includes("mental")) {
            attributesToSearchFor = ["Aka"]
        }
        if (event.target.id.includes("evasive")) {
            attributesToSearchFor = ["Gyo", "Érz"]
        }
        let breakOuterForCycle = false
        for (let j = 0; j < attributesToSearchFor.length; j++) {
            if(selectAllAttributeOptions[i].innerText == attributesToSearchFor[j] && 
            parseInt(selectAllAttributeOptions[i].value) == parseInt(event.target.parentElement.firstElementChild.innerText))
            {
                attributes.value = selectAllAttributeOptions[i].value
                checkTypeIsAttributeCheck.checked = true
                breakOuterForCycle = true
                break
            }
        }
        if (breakOuterForCycle) {
            break
        }
    }
    skills.value = "";
    skills.disabled = true;
    skillOrAttributeCheckRoll(stessResist)
    setManuallySetRollModifierToZero()
        skillCheckRollButton.disabled = true;
        let selectAllResistButtons = document.querySelectorAll("[id*='ResistButton']")
        for (let i = 0; i < selectAllResistButtons.length; i++) {
            selectAllResistButtons[i].disabled = true
        }
        setTimeout(() => {
          skillCheckRollButton.disabled = false;
          for (let i = 0; i < selectAllResistButtons.length; i++) {
            selectAllResistButtons[i].disabled = false
            }
        }, 5000);
   }

    return (
        <>
        <div className={styles.ResistancesAptitudesRaceMofifiersWrapper}>
           <ul id='resistances' className={styles.Resistances}>Ellenállások:
           <li>Összetett:<div id='complexResist'>12</div><button id='complexResistButton' onClick={rollResistance}>Dobj</button></li>
           <li>Fizikai:<div id='physicalResist'>12</div><button id='physicalResistButton' onClick={rollResistance}>Dobj</button></li>
           <li>Szellemi:<div id='spiritualResist'>12</div><button id='spiritualResistButton' onClick={rollResistance}>Dobj</button></li>
           <li>Asztrális:<div id='astralResist'>12</div><button id='astralResistButton' onClick={rollResistance}>Dobj</button></li>
           <li>Mentális:<div id='mentalResist'>12</div><button id='mentalResistButton' onClick={rollResistance}>Dobj</button></li>
           <li>Elkerülő:<div id='evasiveResist'>12</div><button id='evasiveResistButton' onClick={rollResistance}>Dobj</button></li>
           </ul>
           <ul id="aptitudesList" className={styles.Aptitudes}>Adottságok:</ul>
           <ul id="raceModifiersList" className={styles.RaceMofifiers}>Faji módosítók:</ul>
            </div>
            </>
    )
}

export default ResistancesAptitudesRaceMofifiers