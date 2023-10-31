import styles from '../styles/actionlist.module.css';
import { allResultsCleaner } from '../pages';
import { blinkingText} from './ActionsList';
import { initRolled } from './CharacterDetails';
export let actionsSpentSinceLastCast = 0
export let spellIsBeingCast = false
export let actionsNeededToBeAbleToCastAgain = 0
export let rollButtonWasDisabledBeforeSpellCast = false
export let numberOfActionsNeededForTheSpell = 0
export let castBarCurrentWidthStart = 0
export let castBarCurrentWidthEnd = 0
export function castBarCurrentWidthStartAdder(width=0) {
    castBarCurrentWidthStart += width
}
export function castBarCurrentWidthEndSetter(widthEnd=0) {
    castBarCurrentWidthEnd = widthEnd
}
export function spellIsBeingCastSetToFalse() {
    spellIsBeingCast = false
}
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

export let numberOfActionsSpentOnCastingCurrentSpell = 0
export function numberOfActionsSpentOnCastingCurrentSpellNullifier() {
    numberOfActionsSpentOnCastingCurrentSpell = 0
}

export function numberOfActionsSpentOnCastingCurrentSpellAdder(numberOfActions = 0){
    numberOfActionsSpentOnCastingCurrentSpell += numberOfActions
}

export function spellCastingSuccessful() {
    if (spellIsBeingCast == true) {
    numberOfActionsSpentOnCastingCurrentSpellNullifier()
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
    castBarCurrentWidthStart = 0
 castBarCurrentWidthEnd = 0
}
export function spellCastingFailure(anyOtherCondition=true) {
    if (initRolled==true && numberOfActionsSpentOnCastingCurrentSpell >= 1 && anyOtherCondition && spellIsBeingCast == true) {
        numberOfActionsSpentOnCastingCurrentSpellNullifier()
        blinkingText(warningWindow, "A varázslat megszakadt!")
        spellIsBeingCast = false
        castBar.animate([{ opacity: 1 }, { opacity: 0 }], 400)
        setTimeout(() => {
            castBar.style.display = 'none'
        }, 350);
        actionsNeededToBeAbleToCastAgain = 0
    }
    castBarCurrentWidthStart = 0
    castBarCurrentWidthEnd = 0
}

let manaNeededForTheSpell = 0

function Spells() {
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
    
    return (<>
           <div id='spellInputWrapper' className={styles.spellInputWrapper}>
<li id='spellActionCostListItem'><span>CS:</span><input id='spellActionCostInput' defaultValue={1} type='number'/></li>
<li><span>MP:</span><input id='spellManaCostInput' defaultValue={0} type='number'/></li>
<li><span>Seb:</span><input id='spellDamageInput' defaultValue={1} type='number'/> K5</li>
<li><span>CÉO:</span><input id='spellAimInput' defaultValue={0} step={0.5} type='number' /><button id='startCastButton' onClick={handleCancelSpellCast}>Mégse</button></li>
<button id='startCastButton' onClick={handleSpellCast}>Elkezdek varázsolni</button>
</div>
        </>
    )
}

export default Spells