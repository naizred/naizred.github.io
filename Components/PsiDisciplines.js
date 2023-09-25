import styles from '../styles/psiDisciplines.module.css';
import { filteredArrayIfHasPsi } from '../pages';
import { chiCombatEndedDueToLackOfPsiPoints } from './CharacterDetails';
export let specialAtkModifierFromPsiAssault = 0
export let availableNumberOfAttacksFromPsiAssault = 0
export let bonusDamageFromChiCombat = 0
export let theRoundChiCombatWasUsedIn
export let psiAtkDefModifier = 0
export let chiCombatIsActive = false

let psiDisciplinesListed = false
let selectedPsiDisciplineObj
let allActiveBuffs
let numberOfClicks = 0
export function psiPointCostChecker() {
    if (parseInt(selectedPsiDisciplineObj[0].psiPointCost) > currentPp.value || parseInt(currentPp.value) == 0) {
        psiPointCostInput.disabled = true
        if (selectedPsiDisciplineObj[0].psiPointCost == 'All') {
            psiPointCostInput.value = parseInt(currentPp.value)
        } else {
            psiPointCostInput.value = parseInt(selectedPsiDisciplineObj[0].psiPointCost)
        } psiActivateButton.disabled = true
    } else if (selectedPsiDisciplineObj[0].canBeModified == false){
        if (selectedPsiDisciplineObj[0].psiPointCost == 'All') {
            psiPointCostInput.value = parseInt(currentPp.value)
        } else {
            psiPointCostInput.value = parseInt(selectedPsiDisciplineObj[0].psiPointCost)
        }
        psiPointCostInput.disabled = true
        psiActivateButton.disabled = false
    } else if (selectedPsiDisciplineObj[0].canBeModified == true) {
        psiPointCostInput.disabled = false
        psiActivateButton.disabled = false
    }
}

function PsiDisciplines(props) {
    let filteredPsiDisciplines = []
    function handleListPsi() {
            for (let i = 0; i < props.psiDisciplines.length; i++) {
                for (let j = 1; j < filteredArrayIfHasPsi.length; j++) {
                    if (filteredArrayIfHasPsi[j].name.slice(5)!= '' && props.psiDisciplines[i].psiSchool.includes(filteredArrayIfHasPsi[j].name.slice(5)) && props.psiDisciplines[i].requiredPsiSkillLevel <= filteredArrayIfHasPsi[j].level) {
                        filteredPsiDisciplines.push(props.psiDisciplines[i])
                        break
                    }
                }
            }
            console.log(filteredPsiDisciplines)
            for (let k = 0; k < filteredPsiDisciplines.length; k++) {
                let psiDisciplineOption = document.createElement('option');
                psiDisciplineOption.innerText = filteredPsiDisciplines[k].psiDiscName
                psiDisciplinesSelect.appendChild(psiDisciplineOption)
        }
        
        selectedPsiDisciplineObj = filteredPsiDisciplines.filter((discipline)=>psiDisciplinesSelect.value==discipline.psiDiscName)

        psiPointCostInput.value = parseInt(selectedPsiDisciplineObj[0].psiPointCost)
        psiDisciplinesSelect.style.display = "grid"    
        psiPointCostInput.style.display = "grid"
        psiActivateButton.style.display = "grid"
        listPsiButton.style.display = "none"
        psiPointCostChecker()        
    }
    function handlePsiDisciplineSelect(event) {
     //   numberOfClicks = 0
        selectedPsiDisciplineObj = filteredPsiDisciplines.filter((discipline)=>discipline.psiDiscName == psiDisciplinesSelect.value)

        psiPointCostChecker()
    }

    function handleDisciplineActivation() {
      //  numberOfClicks++
const savePsiPoinCostValueForPsiAssault = psiPointCostInput.value
        currentPp.value -= parseInt(psiPointCostInput.value)
        if (numberOfActions.innerText != '') {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
        }

        let skillIndex = 0

        for (let i = 0; i < filteredArrayIfHasPsi.length; i++) {
            if (filteredArrayIfHasPsi[i].name.slice(5)!= '' && selectedPsiDisciplineObj[0].psiSchool.includes(filteredArrayIfHasPsi[i].name.slice(5))) {
              if (skillIndex >= filteredArrayIfHasPsi[i].level) {
                break
              }
                skillIndex = filteredArrayIfHasPsi[i].level
            }
        }

        console.log(skillIndex, selectedPsiDisciplineObj[0].psiSchool, selectedPsiDisciplineObj[0].psiDiscName)
        allActiveBuffs = document.getElementsByClassName('activeBuff')
        function checkAllActiveBuffs(name) {
            for (let i = 0; i < allActiveBuffs.length; i++){
                if (allActiveBuffs[i].innerText.includes(name)) {
                    break
                    
                } return true

            } return false
        }

        for (let i = 0; i < allActiveBuffs.length; i++) {
            console.log(allActiveBuffs[i].innerText == '')
            if (allActiveBuffs[i].innerText == '' || (allActiveBuffs[i].innerText != '' && allActiveBuffs[i].innerText.includes('folyamatos'))) {
    
                    if (selectedPsiDisciplineObj[0].psiDiscName == "Fájdalomtűrés") {
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${parseInt(psiPointCostInput.value / 2)} Fp Pajzs) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        currentFp.value = parseInt(currentFp.value) + parseInt(psiPointCostInput.value / 2)
                        break
                    } else if (selectedPsiDisciplineObj[0].psiDiscName == 'Chi-harc' && (chiCombatIsActive == false || chiCombatEndedDueToLackOfPsiPoints == true)) {
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (TÉO/VÉO:+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1].atkAndDef}, Sebzés: +${selectedPsiDisciplineObj[0].benefit[skillIndex - 1].damage}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        bonusDamageFromChiCombat = selectedPsiDisciplineObj[0].benefit[skillIndex - 1].damage
                        theRoundChiCombatWasUsedIn = parseInt(numberOfCurrentRound.innerText)
                        psiAtkDefModifier = parseFloat(selectedPsiDisciplineObj[0].benefit[skillIndex - 1].atkAndDef)
                        charAtk.value = parseFloat(charAtk.value) + psiAtkDefModifier;
                        charDef.value = parseFloat(charDef.value) + psiAtkDefModifier;
                        charDefWithParry.value = parseFloat(charDefWithParry.value) + psiAtkDefModifier;
                        charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + psiAtkDefModifier;
                        chiCombatIsActive = true
                        break
                    } else if (selectedPsiDisciplineObj[0].psiDiscName == "Pszi Roham" && checkAllActiveBuffs('Roham') == false) {
                        specialAtkModifierFromPsiAssault = Math.floor(parseInt(savePsiPoinCostValueForPsiAssault) / 5)
                        availableNumberOfAttacksFromPsiAssault = parseInt(selectedPsiDisciplineObj[0].benefit[skillIndex - 1])
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} Speciális TÉO módosító:+${specialAtkModifierFromPsiAssault}, ${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]} - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        break
                    } else {
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        break
                    }
                }
                // if (allActiveBuffs[i].innerText == '' && checkAllActiveBuffs('folyamatos') == false ||
                //     allActiveBuffs[i].innerText != '' && selectedPsiDisciplineObj[0].duration[0] == 'folyamatos' && allActiveBuffs[i].innerText.includes('folyamatos')) {
                //     allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                //     break
                // }
                
        }
        psiPointCostChecker()
    }


    return (<>
        <div id='psiDisciplinesSelectWrapper' className={styles.psiDisciplinesSelectWrapper}>
            <label htmlFor='psiDisciplinesSelect' id='psiDisciplinesSelectLabel' className={styles.psiDisciplinesSelectLabel}>Pszi Diszciplína</label>
        <select id='psiDisciplinesSelect' name='psiDisciplinesSelect' className={styles.psiDisciplinesSelect} onChange={handlePsiDisciplineSelect}>
            </select>
            <input id='psiPointCostInput' className={ styles.psiPointCostInput} disabled = {true} />
            <button id='listPsiButton' className={styles.listPsiButton} onClick={handleListPsi}>Listázás</button>
            <button id='psiActivateButton' className={styles.psiActivateButton} onClick={handleDisciplineActivation}>Mehet</button>
            <div className={styles.psiPoints }>Pp</div>
        </div>
        <div className={styles.currentlyActiveBuffsWrapper}>
            <div className={styles.listOfCurrentlyActiveBuffs}> Jelenleg aktív diszciplínák és varázslatok
                <div id='activeBuff1' class='activeBuff' className={styles.activeBuff}></div>
                <div id='activeBuff2' class='activeBuff' className={styles.activeBuff}></div>
                <div id='activeBuff3' class='activeBuff' className={styles.activeBuff}></div>
            </div>
        </div>
        </>
    )
}

export default PsiDisciplines