import {
    diceRolled, checkIfWeaponIsRanged, chargeWasUsedThisRound, quickShotModifiers, quickShotModifiersIndex, combinationModifiers,
    combinationModifiersIndex, combinationWasUsedThisRound, twoWeaponAttackModifiers, twoWeaponAttackModifiersIndex, twoWeaponAttackWasUsedThisRound,
    currentlySelectedWeapon, weaponsOptions, reloadIsNeededSetToFalse, reloadIsNeeded, filteredArrayIfHasAssassination, arrayOfAllComplexMaeuvers, baseAim, baseAimWithTeoCalculator, setDiceRolledToFalse, allResultsCleaner, currentlySelectedWeaponChanger
} from '../pages';
import styles from '../styles/actionlist.module.css';
import { initRolled, updateCharacterData } from './CharacterDetails';
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
export let actionsSpentSinceLastCast = 0
export function actionsSpentSinceLastCastAdder(numberOfActions=0) {
    actionsSpentSinceLastCast+=numberOfActions
}
export function actionsSpentSinceLastCastAdderCheckerAndNullifier(numberOfActions = 0) {
    if (actionsNeededToBeAbleToCastAgain == 0) {
        spellCastingActionButton.disabled = false
        actionsSpentSinceLastCast = 0
        return
    }
    actionsSpentSinceLastCast += numberOfActions
    if (actionsSpentSinceLastCast >= actionsNeededToBeAbleToCastAgain) {
        spellCastingActionButton.disabled = false
        actionsSpentSinceLastCast = 0
        actionsNeededToBeAbleToCastAgain = 0
    }
    console.log("utolsó varázslás óta akciók elköltve:", actionsSpentSinceLastCast, "lecsengés", actionsNeededToBeAbleToCastAgain)
}
export let spellNeedsAimRoll = false
export function spellNeedsAimRollSetToFalse() {
    spellNeedsAimRoll = false
}
export let charAtkValueSave = 0
export let actionsNeededToBeAbleToCastAgain = 0
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
export let spellIsBeingCast = false
export function spellIsBeingCastSetToFalse() {
    spellIsBeingCast = false
}
export let numberOfActionsSpentOnCastingCurrentSpell = 0
export function numberOfActionsSpentOnCastingCurrentSpellNullifier() {
    numberOfActionsSpentOnCastingCurrentSpell = 0
}
export function spellCastingSuccessful() {
    if (spellIsBeingCast == true) {
    numberOfActionsSpentOnCastingCurrentSpell = 0
        blinkingText(warningWindow, "A varázslat létrejött!")
        castBarFlashEffect.style.display = 'grid'
        castBarFlashEffect.animate([{ height: '0vw' }, { height: '5vw' }], 200)
        castBarFlashEffect.animate([{ width: '0vw' }, { width: '18vw' }], 200)
        castBar.animate([{ opacity: 1 }, { opacity: 0 }], 100)
        setTimeout(() => {
            castBarFlashEffect.animate([{ height: '5vw' }, { height: '0vw' }], 200)
            castBarFlashEffect.animate([{ width: '18vw' }, { width: '0vw' }], 200)
        }, 200);

        setTimeout(() => {
            castBar.style.display = 'none'
        }, 100);
        setTimeout(() => {
            castBarFlashEffect.style.display = 'none'
        }, 390);
    spellTypeQuestionWindow.style.display = 'grid'
    attackRollButton.disabled = true
    spellIsBeingCast = false
    if (initRolled==true) {
        spellCastingActionButton.disabled = true   
    }
        actionsSpentSinceLastCast = 0
    }
}
export function spellCastingFailure(anyOtherCondition=true) {
    if (initRolled==true && numberOfActionsSpentOnCastingCurrentSpell >= 1 && anyOtherCondition && spellIsBeingCast == true) {
        numberOfActionsSpentOnCastingCurrentSpell = 0
        blinkingText(warningWindow, "A varázslat megszakadt!")
        spellIsBeingCast = false
        castBar.animate([{ opacity: 1 }, { opacity: 0 }], 400)
        setTimeout(() => {
            castBar.style.display = 'none'
        }, 350);
        actionsNeededToBeAbleToCastAgain = 0
    }
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
export let rollButtonWasDisabledBeforeSpellCast = false
export let findWeakSpotModifier = 0
export function findWeakSpotModifierNullifier() {
    findWeakSpotModifier = 0
}
let castBarCurrentWidthStart = 0
let castBarCurrentWidthEnd = 0
let currentActionExtraCost = 0
let numberOfActionsNeededForTheSpell = 0
let manaNeededForTheSpell = 0
function ActionList(props) {
    
    function handleExtraAttackRadio(event) {
        bigSpellDamageRollLegendPointCheckBox.checked = false
        bigSpellDamageRollLegendPointCheckBox.style.display = 'none'
        if (diceRolled == false) {
            event.target.checked = false
            }
        if (diceRolled == true && initRolled == true) {
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
            } 
            if (!nameOfManeuver.includes('töltés') && numberOfActionsSpentReloading >= 1) {
                numberOfActionsSpentReloading = 0
            }
        }
        if (nameOfManeuver.includes('Varázslás') && parseInt(numberOfActions.innerText) != 0) {
            warningWindow.innerText = ""
            if (spellIsBeingCast==false) {
                spellInputWrapper.style.display = 'grid'
                warningWindow.innerText = ""
            }
            if (initRolled == false) {
                spellActionCostListItem.style.display = 'none'
            }
            if (initRolled == true) {
                spellActionCostListItem.style.display = 'grid'
            }
            if (initRolled == true && spellIsBeingCast == true && parseInt(numberOfActions.innerText)!=0) {
                numberOfActionsSpentOnCastingCurrentSpell++
                blinkingText(warningWindow, `A varázslat ${numberOfActionsNeededForTheSpell - numberOfActionsSpentOnCastingCurrentSpell} CS múlva létrejön`)
                castBarCurrentWidthStart += ((1/numberOfActionsNeededForTheSpell)*17.1)
                castBarCurrentWidthEnd = (numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1
                console.log(castBarCurrentWidthStart, castBarCurrentWidthEnd)
                castBar.animate([{ backgroundSize: `${castBarCurrentWidthStart}vw` }, { backgroundSize: `${castBarCurrentWidthEnd}vw` }], 200)
                castBar.style.backgroundSize = `${(numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1}vw`
                numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1

                if (numberOfActionsSpentOnCastingCurrentSpell == numberOfActionsNeededForTheSpell) {
                    spellCastingSuccessful()
                }
            }
            console.log("akció kell", numberOfActionsNeededForTheSpell, "mana", manaNeededForTheSpell, "lecsengés", actionsNeededToBeAbleToCastAgain)
            console.log("lecsengésből eltelt", actionsSpentSinceLastCast)
        }
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
    function handleSpellCast() {
        allResultsCleaner()
        if (parseInt(currentMp.value) < spellManaCostInput.value) {
            blinkingText(warningWindow, "Nincs elég manád!")
            return
        }
        currentMp.value = parseInt(currentMp.value) - spellManaCostInput.value
        spellIsBeingCast = true
        numberOfDiceInput.value = spellDamageInput.value
        numberOfDiceInput.disabled = true
        if (initRolled == false) {
            spellInputWrapper.style.display = 'none'
            spellCastingSuccessful()
            return
        }

        numberOfActionsNeededForTheSpell = spellActionCostInput.value
        manaNeededForTheSpell = spellManaCostInput.value
        warningWindow.innerText = ""
        actionsNeededToBeAbleToCastAgain = 1 + Math.floor(spellManaCostInput.value / 10)
        spellInputWrapper.style.display = 'none'
        if (initRolled==true && attackRollButton.disabled==true) {
            rollButtonWasDisabledBeforeSpellCast = true
        }
        if (initRolled==true && attackRollButton.disabled==false) {
            rollButtonWasDisabledBeforeSpellCast = false
        }
        if (initRolled == true && numberOfActionsNeededForTheSpell > 1) {
            spellIsBeingCast = true
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
            numberOfActionsSpentOnCastingCurrentSpell++
            blinkingText(warningWindow, `A varázslat ${numberOfActionsNeededForTheSpell - numberOfActionsSpentOnCastingCurrentSpell} CS múlva létrejön`)
            castBar.style.display = "grid"
            castBarCurrentWidthEnd = (numberOfActionsSpentOnCastingCurrentSpell / numberOfActionsNeededForTheSpell) * 17.1
            castBar.animate([{ backgroundSize: `${castBarCurrentWidthStart}vw` }, { backgroundSize: `${castBarCurrentWidthEnd}vw` }], 200)
            castBar.style.backgroundSize = `${(numberOfActionsSpentOnCastingCurrentSpell/numberOfActionsNeededForTheSpell)*17.1}vw`
        }
        if (initRolled == true && numberOfActionsNeededForTheSpell == 1) {
            spellIsBeingCast = true
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1
            spellCastingSuccessful()
        }
    }
    function handleCancelSpellCast() {
        spellInputWrapper.style.display = 'none'
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
            <li id='spellCastingAction'><span>Varázslás - Akció - 1 CS </span><button id='spellCastingActionButton' onClick={handleOtherManeuvers}>Végrehajt</button></li>
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
            <div id='spellInputWrapper' className={styles.spellInputWrapper}>
                <li id='spellActionCostListItem'><span>CS:</span><input id='spellActionCostInput' defaultValue={1} type='number'/></li>
                <li><span>MP:</span><input id='spellManaCostInput' defaultValue={0} type='number'/></li>
                <li><span>Seb:</span><input id='spellDamageInput' defaultValue={1} type='number'/> K5</li>
                <li><span>CÉO:</span><input id='spellAimInput' defaultValue={0} step={0.5} type='number' /><button id='startCastButton' onClick={handleCancelSpellCast}>Mégse</button></li>
                <button id='startCastButton' onClick={handleSpellCast}>Elkezdek varázsolni</button>
            </div>
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