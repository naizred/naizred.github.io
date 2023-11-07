import {
    diceRolled, checkIfWeaponIsRanged, chargeWasUsedThisRound, quickShotModifiers, quickShotModifiersIndex, combinationModifiers,
    combinationModifiersIndex, combinationWasUsedThisRound, twoWeaponAttackModifiers, twoWeaponAttackModifiersIndex, twoWeaponAttackWasUsedThisRound,
    currentlySelectedWeapon, weaponsOptions, reloadIsNeededSetToFalse, reloadIsNeeded, filteredArrayIfHasAssassination, arrayOfAllComplexMaeuvers, baseAimWithTeoCalculator, currentlySelectedWeaponChanger, diceRolledSetToFalseBySpellNeedsAimRoll, allMagicSubskillsObject
} from '../pages';
import styles from '../styles/actionlist.module.css';
import { initRolled, updateCharacterData } from './CharacterDetails';
import Spells, {actionsSpentSinceLastCastAdderCheckerAndNullifier} from './Spells';
import { spellCastingFailure } from './Spells';
export let chargeOn = false
export function chargeToFalse() {
    chargeOn = false
}
export let numberOfDiceFromSpellCastWindow = 0
export let assassinationOn = false
export function assassinationToFalse() {
    assassinationOn = false
}
export let twoWeaponAttackOn = false
export function twoWeaponAttackToFalse() {
    twoWeaponAttackOn = false
}
export let findWeakSpotOn = false
export function findWeakSpotOnToFalse() {
    findWeakSpotOn = false
}
export let attackOfOpportunityOn = false
export function attackOfOpportunityOnSetToFalse() {
    attackOfOpportunityOn = false
}
export let totalActionCostOfAttack = 2
export function totalActionCostOfAttackSetter(amount) {
    totalActionCostOfAttack += amount
}
export let hmoModified = false
export function hmoModifiedToFalse() {
        hmoModified = false
}
export function hmoModifier(amount) {
    charAtk.value = parseFloat(charAtk.value) + amount
    charDef.value = parseFloat(charDef.value) + amount
    charDefWithParry.value = parseFloat(charDefWithParry.value) + amount
    charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + amount
}
export let numberOfActionsSpentReloading = 0

export let spellNeedsAimRoll = false
export function spellNeedsAimRollSetToFalse() {
    spellNeedsAimRoll = false
}
export let charAtkValueSave = 0
export let weaponBeforeCasting
export function blinkingText(elementId, text) {
    elementId.innerText = text
    elementId.animate([{ color: "white" }, { color: "black" }], 300)
    setTimeout(() => {
        elementId.animate([{color: "white"}, {color:"black"}],300)
    }, 300);
    setTimeout(() => {
        elementId.animate([{color: "white"}, {color:"black"}],300)
    }, 600);
}

export function disableAllActionButtons() {
    document.querySelectorAll()
}
export function toggleTwoHandedWeaponsDisplay(display) {
    for (let i = 0; i < weaponsOptions.length; i++) {
        if (weaponsOptions[i].innerText.includes('kétkézzel') || weaponsOptions[i].innerText.includes('Kétkezes') || weaponsOptions[i].innerText.includes('Pallos') || weaponsOptions[i].innerText.includes('Alabárd')) {
            weaponsOptions[i].style.display = display
        }
    }
}
export let findWeakSpotModifier = 0
export function findWeakSpotModifierNullifier() {
    findWeakSpotModifier = 0
}
export function reloadFailed(anyCondition = true) {
    if (anyCondition && numberOfActionsSpentReloading >= 1 && reloadIsNeeded==true) {
        numberOfActionsSpentReloading = 0
        if (currentlySelectedWeapon.w_type=="VET" || currentlySelectedWeapon.w_type=="NYD" || currentlySelectedWeapon.w_type=="PD") {
            blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`)
            } else {
            blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`)
            }
    }
}
let currentActionExtraCost = 0
function ActionList(props) {
    
    function handleExtraAttackRadio(event) {
        bigSpellDamageRollLegendPointCheckBox.checked = false
        bigSpellDamageRollLegendPointCheckBox.style.display = 'none'
        if (diceRolled == false && diceRolledSetToFalseBySpellNeedsAimRoll==false) {
            event.target.checked = false
            return
            }
        if ((diceRolled == true || diceRolledSetToFalseBySpellNeedsAimRoll==true) && initRolled == true) {
            if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == true && event.target.value == 'Kapáslövés') {
                totalActionCostOfAttack = 3
                if (hmoModified == false) {
                    hmoModifier(quickShotModifiers[quickShotModifiersIndex])
                    hmoModified = true
                }
                attackRollButton.disabled = false
                console.log("reloadIsNeeded",reloadIsNeeded)
                if (currentlySelectedWeapon.w_type != "MÁGIA" && reloadIsNeeded == true) {
                    attackRollButton.disabled = true
                  }     
            } else if (checkIfWeaponIsRanged(currentlySelectedWeapon.w_type) == false && event.target.value == 'Kombináció') {
                totalActionCostOfAttack = 3
                if (hmoModified == false) {
                    hmoModifier(combinationModifiers[combinationModifiersIndex])
                    hmoModified = true
                }
                attackRollButton.disabled = false
            } 
        }
        }
    function handleComplexManeuverRadio(event) {
        bigSpellDamageRollLegendPointCheckBox.checked = false
        bigSpellDamageRollLegendPointCheckBox.style.display = 'none'
        currentActionExtraCost = event.target.parentElement.value
        if (parseInt(numberOfActions.innerText) < 4 && combinationWasUsedThisRound==false) {
            combinationRadioButton.disabled = true
        }
        if (initRolled == true && parseInt(numberOfActions.innerText) < totalActionCostOfAttack + currentActionExtraCost) {
            attackRollButton.disabled = true
        }
        if (((initRolled == true && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack + currentActionExtraCost) &&
        (combinationRadioButton.checked ==true || quickShotRadioButton.checked == true))==true) {
            attackRollButton.disabled = false
        }
        if ((event.target.value == 'Kétkezes harc' && parseInt(numberOfActions.innerText) < 4) || (event.target.value == 'Kétkezes harc' && combinationRadioButton.checked==true && parseInt(numberOfActions.innerText) < 5)) {
            attackRollButton.disabled = true
        }
        if (initRolled == true && event.target.value == 'Roham' && chargeOn == false && chargeWasUsedThisRound == false) {
            chargeOn = true
            charAtk.value = parseFloat(charAtk.value) + 1
            charDef.value = parseFloat(charDef.value) -1
            charDefWithParry.value = parseFloat(charDefWithParry.value) -1
            charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) -1
        }
        if (event.target.value != 'Roham' && chargeOn == true && chargeWasUsedThisRound == false) {
                chargeOn = false
            charAtk.value = parseFloat(charAtk.value) - 1
            charDef.value = parseFloat(charDef.value) +1
            charDefWithParry.value = parseFloat(charDefWithParry.value) +1
            charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1
        }
        if (initRolled == true && event.target.value == 'Kétkezes harc' && twoWeaponAttackOn == false && twoWeaponAttackWasUsedThisRound == false) {
            twoWeaponAttackOn = true
            hmoModifier(twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
            toggleTwoHandedWeaponsDisplay('none')
        }
        if (initRolled == true && event.target.value != 'Kétkezes harc' && twoWeaponAttackOn == true && twoWeaponAttackWasUsedThisRound == false) {
            twoWeaponAttackOn = false
            hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
            toggleTwoHandedWeaponsDisplay('grid')
        }

        if (event.target.value == 'Orvtámadás' && assassinationOn==false && filteredArrayIfHasAssassination.length != 0) {
            charAtk.value = parseFloat(charAtk.value) + filteredArrayIfHasAssassination[0].level + 3
            assassinationOn=true
        }
        if (event.target.value != 'Orvtámadás' && assassinationOn==true &&  filteredArrayIfHasAssassination.length != 0) {
            charAtk.value = parseFloat(charAtk.value) - filteredArrayIfHasAssassination[0].level - 3
            assassinationOn=false
        }


    }

    //****************************************************************************** *************************************************/
    // dupla kattintásra kiszedi a radio kijelölést. Több helyen disabled lesz a dobó gomb, mivel az első dobás után csak kombináció/kapáslövéssel lehet újra dobni
    //**************************************************************************************************************************** */

    function handleRadioUnselect(event) {
            event.target.checked = false
        if (initRolled == true && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack-event.target.parentElement.value) {
                attackRollButton.disabled = false
        }
        if ((combinationRadioButton.checked == false && quickShotRadioButton.checked == false)) {
            if (initRolled==true && diceRolled == true) {
                attackRollButton.disabled = true
            }
        }
        if (event.target.value == 'Kombináció' && hmoModified == true && initRolled == true && combinationWasUsedThisRound == false) {
            hmoModifier(-combinationModifiers[combinationModifiersIndex])
            hmoModified = false
            if (initRolled==true && diceRolled == true) {
                attackRollButton.disabled = true
            }
            totalActionCostOfAttack = 2
        }
        if (event.target.value == 'Kapáslövés' && hmoModified == true && initRolled == true && combinationWasUsedThisRound == false) {
            hmoModifier(-quickShotModifiers[quickShotModifiersIndex])
            hmoModified = false
            if (initRolled==true && diceRolled == true) {
                attackRollButton.disabled = true
            }
            totalActionCostOfAttack = 2
        }
        if (event.target.value == 'Kétkezes harc' && initRolled == true && twoWeaponAttackOn==true && twoWeaponAttackWasUsedThisRound == false) {
            hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
            twoWeaponAttackOn = false
            toggleTwoHandedWeaponsDisplay('grid')
        }
        if (event.target.value == 'Roham' && chargeOn == true) {
                chargeOn = false
            charAtk.value = parseFloat(charAtk.value) - 1
            charDef.value = parseFloat(charDef.value) +1
            charDefWithParry.value = parseFloat(charDefWithParry.value) +1
            charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + 1
        }
        if (event.target.value == 'Orvtámadás' && filteredArrayIfHasAssassination.length != 0 && assassinationOn==true) {
            charAtk.value = parseFloat(charAtk.value) - filteredArrayIfHasAssassination[0].level - 3
            assassinationOn=false
        }

    }
    function handleOtherManeuvers(event) {
        let nameOfManeuver = event.target.parentElement.firstChild.innerText
        bigSpellDamageRollLegendPointCheckBox.checked = false
        bigSpellDamageRollLegendPointCheckBox.style.display = 'none'
        if (initRolled == true) {
            if (totalActionCostOfAttack <= parseInt(numberOfActions.innerText)) {
                attackRollButton.disabled == true
            }
            if (nameOfManeuver.includes('Fegyverváltás') && parseInt(numberOfActions.innerText)!=0) {
                weapons.disabled = false
                offHand.disabled = false
                numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
                actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
                event.target.disabled = true
            }
            if (nameOfManeuver.includes('Gyenge') && parseInt(numberOfActions.innerText) != 0 && findWeakSpotOn == false) {
                numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
                actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
                findWeakSpotModifier = 0.5
                charAtk.value = parseFloat(charAtk.value) + findWeakSpotModifier
                findWeakSpotOn = true
                findWeakSpotButton.disabled = true
            }
            if ((nameOfManeuver.includes('töltés') && parseInt(numberOfActions.innerText)!=0) || (nameOfManeuver.includes('töltés') && currentlySelectedWeapon.reloadTime == 0)) {               
                if (currentlySelectedWeapon.reloadTime != 0) {
                    numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
                    actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
                    numberOfActionsSpentReloading++
                }

                if ((currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading > 0) || (diceRolled == true && quickShotRadioButton.checked == false) || parseInt(numberOfActions.innerText) < totalActionCostOfAttack) {
                    attackRollButton.disabled = true
                    reloadButton.disabled = false
                    if (currentlySelectedWeapon.w_type=="VET" || currentlySelectedWeapon.w_type=="NYD" || currentlySelectedWeapon.w_type=="PD") {
                    blinkingText(warningWindow, `Elő kell készítened egy új dobófegyvert ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`)
                    } else {
                    blinkingText(warningWindow, `Újra kell töltened ${currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading} CS`)
                    }
                }
                if (currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading <= 0 ) {
                    reloadIsNeededSetToFalse()
                    reloadButton.disabled = true
                    warningWindow.innerText = ""
                    numberOfActionsSpentReloading = 0
                    if(diceRolled == true && quickShotRadioButton.checked == true && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack){
                        attackRollButton.disabled = false
                    }
                    if (diceRolled == false && parseInt(numberOfActions.innerText) >= totalActionCostOfAttack) {
                        attackRollButton.disabled = false
                    }
                }
if (currentlySelectedWeapon.reloadTime - numberOfActionsSpentReloading > 0 ) {
}        
            } 
            reloadFailed(!nameOfManeuver.includes('töltés'))
        }
        // ************************* Ha az akció, amire kattintottak nem varázslás, és épp van varázslás folyamatban, akkor a varázslat megszakad
        //*********************************************************************************** */
        spellCastingFailure(!nameOfManeuver.includes('Varázslás'))

        if (initRolled==true && parseInt(numberOfActions.innerText) != 0 && (nameOfManeuver.includes('Elterelés') || nameOfManeuver.includes('Mozgás')) || nameOfManeuver.includes('Manipuláció')) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
            actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
        }
        if (initRolled == true && (parseInt(numberOfActions.innerText) != 0 || parseInt(numberOfReactions.innerText) != 0) && (nameOfManeuver.includes('Hárítás') || nameOfManeuver.includes('Kitérés')
        || nameOfManeuver.includes('ösztön') || nameOfManeuver.includes('rutin'))) {
            if (parseInt(numberOfReactions.innerText) >= 1) {
                numberOfReactions.innerText = parseInt(numberOfReactions.innerText) - 1
            } else {
                numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
                actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
            }
        }
        if (initRolled == true && (parseInt(numberOfActions.innerText) != 0 || parseInt(numberOfReactions.innerText) != 0) && nameOfManeuver.includes('Közbevágás') && attackOfOpportunityOn == false) {
            attackOfOpportunityOn = true
            if (parseInt(numberOfReactions.innerText) >= 1) {
                numberOfReactions.innerText = parseInt(numberOfReactions.innerText) - 1
            } else {
                numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1          
                actionsSpentSinceLastCastAdderCheckerAndNullifier(1)
            }
            if (combinationWasUsedThisRound == true && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==false) {
                hmoModifier(-combinationModifiers[combinationModifiersIndex])
            }
            if (combinationWasUsedThisRound == true && checkIfWeaponIsRanged(currentlySelectedWeapon.w_type)==true) {
                hmoModifier(-quickShotModifiers[quickShotModifiersIndex])
            }
            if (twoWeaponAttackWasUsedThisRound == true) {
                hmoModifier(-twoWeaponAttackModifiers[twoWeaponAttackModifiersIndex])
            }
            if (chargeWasUsedThisRound == true) {
                charDef.value = parseFloat(charDef.value) +1
                charDefWithParry.value = parseFloat(charDefWithParry.value) +1
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) +1
              }
            attackOfOpportunityButton.disabled = true
            attackRollButton.disabled = false
        }
        if (initRolled==true && parseInt(numberOfActions.innerText) < 2) {
            tacticsButton.disabled = true
          }
    }
    
    function handleSpellTypeNoAimRoll() {
        spellTypeQuestionWindow.style.display = 'none'
        warningWindow.innerText = ""
        attackRollButton.disabled = false
        if ((parseInt(numberOfActions.innerText) < 2) || (combinationWasUsedThisRound==true && parseInt(numberOfActions.innerText) < 3)) {
            attackRollButton.disabled = true
        }
        numberOfDiceInput.disabled = false
    }
    function handleSpellTypeYesAimRoll() {
        spellNeedsAimRoll = true
        weaponBeforeCasting = currentlySelectedWeapon
        weapons.value = 'Célzott mágia'
        currentlySelectedWeaponChanger(props,'Célzott mágia') 
        charAtkValueSave = charAtk.value
        charAtk.value = baseAimWithTeoCalculator + parseFloat(spellAimInput.value)
        combinationRadioButton.disabled = true
        quickShotRadioButton.disabled = true
        if (initRolled == true)
        {
        for (let i = 0; i < arrayOfAllComplexMaeuvers.length; i++) {
          arrayOfAllComplexMaeuvers[i].disabled = true
        }}
        attackRollButton.disabled = false
        spellTypeQuestionWindow.style.display = 'none'
    }

    function handleGameIdWrapperClose() {
        gameIdWrapper.style.display = 'none'
    }
    function handleGameIdInput() {
        updateCharacterData(true)
        gameIdWrapper.style.display = 'none'
    }

    return (
        <>
        <div className={styles.actionsWrapper}>
            Manőverek listája
            <li><span>Támadás (közelharci) - Akció - 2 CS </span></li>
            <li><span>Támadás (távolsági) - Akció - 2 CS </span></li>
            <li><span>Kombináció - Akció - 3 CS </span><input value="Kombináció" id='combinationRadioButton' name='extraAttackInRound' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleExtraAttackRadio}/></li>
            <li><span>Kapáslövés - Akció - 3 CS </span><input value="Kapáslövés" id='quickShotRadioButton' name='extraAttackInRound' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleExtraAttackRadio}/></li>
            <ul id='selectableComplexManeuversList' className={styles.selectableComplexManeuversList} >Csatolható összetett manőverek:
                <li value={1}><span>Fegyvertörés - Akció - +1 CS </span><input id='weaponBreakRadioButton' value="Fegyvertörés" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={1}><span>Lefegyverzés - Akció - +1 CS </span><input id='disarmRadioButton' value="Lefegyverzés" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={1}><span>Kínokozás - Akció - +1 CS </span><input value="Kínokozás" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={1}><span>Pusztítás - Akció - +1 CS </span><input value="Pusztítás" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={1}><span>Roham - Akció - +1 CS </span><input id='chargeRadioButton' value="Roham" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={1}><span>Orvtámadás - Akció - +1 CS </span><input id='assassinationRadioButton' value="Orvtámadás" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={1}><span>Birkózás - Akció - +1 CS </span><input id='wrestlingRadioButton' value="Birkózás" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
                <li value={0}><span>Kétkezes harc - Akció - +2 CS </span><input id='twoWeaponAttackRadioButton' value="Kétkezes harc" name='selectableComplexManeuvers' type='radio' onDoubleClick={handleRadioUnselect} onClick={handleComplexManeuverRadio}/></li>
            </ul>
            <ul><span className={styles.otherManeuversLabel}>További manőverek:</span></ul>
            {/* <li id='aimAction'><span>Célzás - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='combatTrick'><span>Harci csel - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='groupFightingStyle'><span>Közös harcmodor - Reakció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='battleRage'><span>Harci láz - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li> */}
            <li><span>Közbevágás - Reakció - 1 CS </span><button id='attackOfOpportunityButton' onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Gyenge pont - Akció - 1 CS </span><button id='findWeakSpotButton' onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Elterelés - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Harci rutin - Reakció - 1/0 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Harci ösztön - Reakció - 1/0 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li id='parryAction'><span>Hárítás - Reakció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Kitérés - Reakció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
            {/* <li><span>Védekező harc - Akció - 1/0 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li> */}
            {/* <li id='spellCastingAction'><span>Varázslás - Akció - 1 CS </span><button id='spellCastingActionButton' onClick={handleOtherManeuvers}>Végrehajt</button></li> */}
            {/* <li id='psiUseAction'><span>Pszi használat - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li> */}
            <li><span>Mozgás - Akció - 1 CS </span><button onClick={handleOtherManeuvers}>Végrehajt</button></li>
                <li><span>Újratöltés / Dobófegyver előkészítése - Akció - X CS </span><button id='reloadButton' onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Fegyverváltás - Akció - 1 CS </span><button id='weaponChangeButton' onClick={handleOtherManeuvers}>Végrehajt</button></li>
            <li><span>Manipuláció - Akció - 1 CS </span><button id='manipulationButton' onClick={handleOtherManeuvers}>Végrehajt</button></li>
        </div>
            <div className={styles.ammoWrapper}>
                Lőszer:
                <input id='ammoAmountInput' type='number' />
                <button>Összeszed</button>
            </div>
            <Spells {...props} />
            <div id='spellTypeQuestionWindow' className={styles.spellTypeQuestionWindow}>
        <div id='spellTypeQuestionWindowText' className={styles.spellTypeQuestionWindowText}>A varázslat igényel célzó dobást?</div> 
        <button id='spellTypeQuestionWindowNoButton' className={styles.spellTypeQuestionWindowNoButton} onClick={handleSpellTypeNoAimRoll}>Nem</button>
        <button id='spellTypeQuestionWindowYesButton' className={styles.spellTypeQuestionWindowYesButton} onClick={handleSpellTypeYesAimRoll}>Igen</button>
            </div>
            <div id='gameIdWrapper' className={styles.gameIdWrapper}>
<span>Játék azonosítója:<button onClick={handleGameIdWrapperClose}>Eltüntet</button></span>
<span><input id='gameIdInput'/><button onClick={handleGameIdInput}>Csatlakozás</button></span>
        </div>
        </>
    )
}

export default ActionList
