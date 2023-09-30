import styles from '../styles/psiDisciplines.module.css';
import { filteredArrayIfHasPsi } from '../pages';
export let specialAtkModifierFromPsiAssault = 0
export let availableNumberOfAttacksFromPsiAssault = 0
export let bonusDamageFromChiCombat = 0
export let theRoundChiCombatWasUsedIn
export let psiAtkDefModifier = 0
export let activeBuffsArray = []
export let allActiveBuffs = []
export function buffRemoverFromActiveBuffArrayAndTextList(buffName) {
    for (let i = 0; i < activeBuffsArray.length; i++) {
        if (activeBuffsArray[i] == buffName) {
            activeBuffsArray.splice(i, 1);
            break
        }        
    }
    for (let i = 0; i < allActiveBuffs.length; i++){
        if (allActiveBuffs[i].innerText.includes(buffName)) {
            allActiveBuffs[i].innerText = ''
        } 
    } 
    if (buffName == 'Pszi Roham') {
        availableNumberOfAttacksFromPsiAssault = 0
    }
}

export function buffRemoverFromActiveBuffArray(buffName) {
    for (let i = 0; i < activeBuffsArray.length; i++) {
        if (activeBuffsArray[i] == buffName) {
            activeBuffsArray.splice(i, 1);
            break
        }        
    }
}

export function buffTextChecker(buffName) {
    for (let i = 0; i < allActiveBuffs.length; i++){
        if (allActiveBuffs[i].innerText.includes(buffName)) {
            return true
        }
    } return false 
}

export function psiPointCostChecker() {
    if (parseInt(selectedPsiDisciplineObj[0].psiPointCost) > currentPp.value || parseInt(currentPp.value) == 0) {
        
        psiPointCostInput.disabled = true
        psiActivateButton.disabled = true
        if (selectedPsiDisciplineObj[0].psiPointCost == 'All') {
            psiPointCostInput.value = parseInt(currentPp.value)
        } else {
            psiPointCostInput.value = parseInt(selectedPsiDisciplineObj[0].psiPointCost)
        }
        
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
export let fpShield = 0

let selectedPsiDisciplineObj

export function PsiDisciplines(props) {
    
    let filteredPsiDisciplines = []
    function handleListPsi() {
        allActiveBuffs = document.querySelectorAll("ul#listOfCurrentlyActiveBuffs li")
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
        console.log()
      //  numberOfClicks++
const savePsiPoinCostValueForPsiAssault = psiPointCostInput.value
        if (!buffTextChecker(selectedPsiDisciplineObj[0].psiDiscName)) {
            currentPp.value -= parseInt(psiPointCostInput.value)
            psiPointCostChecker()
        }
        if (numberOfActions.innerText != '' && !buffTextChecker(selectedPsiDisciplineObj[0].psiDiscName)) {
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

        for (let i = 0; i < allActiveBuffs.length; i++) {
            if (allActiveBuffs[i].innerText == '' || (allActiveBuffs[i].innerText != '' && allActiveBuffs[i].innerText.includes('folyamatos'))) {

                let currentBuff = allActiveBuffs[i].innerText
                if (selectedPsiDisciplineObj[0].psiDiscName == "Fájdalomtűrés" && !activeBuffsArray.includes("Fájdalomtűrés")) {
                    activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                    fpShield = parseInt(psiPointCostInput.value / 2)
                    allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${parseInt(psiPointCostInput.value / 2)} Fp Pajzs) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                    allActiveBuffs[i].parentElement.lastChild.value = selectedPsiDisciplineObj[0].psiDiscName
                        currentFp.value = parseInt(currentFp.value) + parseInt(psiPointCostInput.value / 2)
                        break
                } else if (selectedPsiDisciplineObj[0].psiDiscName == 'Chi-harc' && !activeBuffsArray.includes("Chi-harc")) {
                    activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                    allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (TÉO/VÉO:+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1].atkAndDef}, Sebzés: +${selectedPsiDisciplineObj[0].benefit[skillIndex - 1].damage}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                    allActiveBuffs[i].parentElement.lastChild.value = selectedPsiDisciplineObj[0].psiDiscName
                        bonusDamageFromChiCombat = selectedPsiDisciplineObj[0].benefit[skillIndex - 1].damage
                        theRoundChiCombatWasUsedIn = parseInt(numberOfCurrentRound.innerText)
                        psiAtkDefModifier = parseFloat(selectedPsiDisciplineObj[0].benefit[skillIndex - 1].atkAndDef)
                        charAtk.value = parseFloat(charAtk.value) + psiAtkDefModifier;
                        charDef.value = parseFloat(charDef.value) + psiAtkDefModifier;
                        charDefWithParry.value = parseFloat(charDefWithParry.value) + psiAtkDefModifier;
                        charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + psiAtkDefModifier;
                        break
                } else if (selectedPsiDisciplineObj[0].psiDiscName == "Pszi Roham" && !activeBuffsArray.includes("Pszi Roham")) {
                    activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                        specialAtkModifierFromPsiAssault = Math.floor(parseInt(savePsiPoinCostValueForPsiAssault) / 5)
                        availableNumberOfAttacksFromPsiAssault = parseInt(selectedPsiDisciplineObj[0].benefit[skillIndex - 1])
                    allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} Speciális TÉO módosító:+${specialAtkModifierFromPsiAssault}, ${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]} - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                    allActiveBuffs[i].parentElement.lastChild.value = selectedPsiDisciplineObj[0].psiDiscName
                        break
                } else if (selectedPsiDisciplineObj[0].psiDiscName == "Pszi Lökés" && !activeBuffsArray.includes("Pszi Lökés")) {
                    activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                    allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName}: ${psiPointCostInput.value} kg-nyi ${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}, - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                    allActiveBuffs[i].parentElement.lastChild.value = selectedPsiDisciplineObj[0].psiDiscName
                        break
                } else if (selectedPsiDisciplineObj[0].psiDiscName == "Dinamikus ellenállás" && !activeBuffsArray.includes("Dinamikus ellenállás")) {
                   // activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        break
                } else if (selectedPsiDisciplineObj[0].psiDiscName == "Érzékélesítés" && !activeBuffsArray.includes("Érzékélesítés")) {
                   // activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        break
                } else if (selectedPsiDisciplineObj[0].psiDiscName == "Tulajdonság Javítás" && !activeBuffsArray.includes("Tulajdonság Javítás")) {
                   // activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName)
                        allActiveBuffs[i].innerText = `${selectedPsiDisciplineObj[0].psiDiscName} (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`
                        break
                } 
            }      
        }
        psiPointCostChecker()

        
    }

    function handleDeleteBuff (event) {
            console.log(event.target.parentElement.firstChild.lastChild.value)
        buffRemoverFromActiveBuffArray(event.target.parentElement.lastChild.value)
        if (event.target.parentElement.lastChild.value == 'Chi-harc') {
            charAtk.value = parseFloat(charAtk.value) - psiAtkDefModifier;
            charDef.value = parseFloat(charDef.value) - psiAtkDefModifier;
            charDefWithParry.value = parseFloat(charDefWithParry.value) - psiAtkDefModifier;
            charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - psiAtkDefModifier;
        }
        event.target.parentElement.firstChild.innerText = ''
        console.log(activeBuffsArray)
        if (event.target.parentElement.lastChild.value == 'Fájdalomtűrés') {
           currentFp.value = parseInt(currentFp.value) - parseInt(fpShield)
        }
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
            <ul id='listOfCurrentlyActiveBuffs' className={styles.listOfCurrentlyActiveBuffs}> Jelenleg aktív diszciplínák és varázslatok
                <div><li id='activeBuff1' className={styles.activeBuff}></li><button className={styles.deleteBuffButton} onClick={handleDeleteBuff}>Törlés</button></div>
                <div><li id='activeBuff2' className={styles.activeBuff}></li><button className={styles.deleteBuffButton} onClick={handleDeleteBuff}>Törlés</button></div>
                <div><li id='activeBuff3' className={styles.activeBuff}></li><button className={styles.deleteBuffButton} onClick={handleDeleteBuff}>Törlés</button></div>
                <div><li id='activeBuff4' className={styles.activeBuff}></li><button className={styles.deleteBuffButton} onClick={handleDeleteBuff}>Törlés</button></div>
            </ul>
        </div>
        </>
    )
}

export default PsiDisciplines