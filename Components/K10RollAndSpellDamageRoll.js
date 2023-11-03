import styles from '../styles/k10RollAndSpellDamageRoll.module.css';
import { generator, rollOptions } from '../pages';
import { totalActionCostOfAttack } from './ActionsList';
import { initRolled } from './CharacterDetails';
export let numberOfSpellDamageDiceAfterLastSpellDamageRoll = 0

export function multipleDiceRoll(firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult, numberOfDice) {
    if (numberOfDice >= 22) {
        numberOfDice = 22
        numberOfDiceInput.value = 22
    }
    let spellDamageSum = 0
    let diceMultiplierRest = numberOfDice % 3
    if (firstAccumulatedDiceRollResult==0) {
        firstAccumulatedDiceRollResult = Math.floor(generator.random() * 10)
        firstAccumulatedDiceResultSelect.value = firstAccumulatedDiceRollResult
        if (firstAccumulatedDiceRollResult == 0) {
            firstAccumulatedDiceRollResult = 10
        }
    }
    if (secondAccumulatedDiceRollResult==0) {
        secondAccumulatedDiceRollResult = Math.floor(generator.random() * 10)
        secondAccumulatedDiceResultSelect.value = secondAccumulatedDiceRollResult
        if (secondAccumulatedDiceRollResult == 0) {
            secondAccumulatedDiceRollResult = 10
        }
    }
    if (thirdAccumulatedDiceRollResult==0) {
        thirdAccumulatedDiceRollResult = Math.floor(generator.random() * 10)
        thirdAccumulatedDiceResultSelect.value = thirdAccumulatedDiceRollResult
        if (thirdAccumulatedDiceRollResult == 0) {
            thirdAccumulatedDiceRollResult = 10
        }
    }
    
    secondAccumulatedDiceResultSelect.style.opacity = 0.7
    secondAccumulatedDiceResultSelectLabel.innerText = 'Második kocka'
    thirdAccumulatedDiceResultSelect.style.opacity = 0.7
    thirdAccumulatedDiceResultSelectLabel.innerText = 'Harmadik kocka'

    if (numberOfDice == 1) {
        secondAccumulatedDiceResultSelect.style.opacity = 0
        secondAccumulatedDiceResultSelectLabel.innerText = ''
        thirdAccumulatedDiceResultSelect.style.opacity = 0
        thirdAccumulatedDiceResultSelectLabel.innerText = ''
    }
    if (numberOfDice == 2) {
        thirdAccumulatedDiceResultSelect.style.opacity = 0
        thirdAccumulatedDiceResultSelectLabel.innerText = ''
    }

    let firstAccumulatedDice = Math.ceil(firstAccumulatedDiceRollResult/2)
    let secondAccumulatedDice = Math.ceil(secondAccumulatedDiceRollResult/2)
    let thirdAccumulatedDice = Math.ceil(thirdAccumulatedDiceRollResult/2)
    console.log("maradék", diceMultiplierRest)
    console.log("a három érték amit megkap a függvény",firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult,thirdAccumulatedDiceRollResult)
    
        console.log("a három kocka kezdő sebzéshelyei",firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
            
        let diceMultiplier = Math.floor(parseInt(numberOfDice) / 3)
                
        if (diceMultiplierRest == 0) {
            firstAccumulatedDice = firstAccumulatedDice* diceMultiplier
            secondAccumulatedDice = secondAccumulatedDice * diceMultiplier
            thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier 
        }
        if (diceMultiplierRest == 1) {
            firstAccumulatedDice = firstAccumulatedDice* (diceMultiplier + 1)
            secondAccumulatedDice = secondAccumulatedDice * diceMultiplier
            thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier
            
        }
        if (diceMultiplierRest == 2) {
            firstAccumulatedDice = firstAccumulatedDice* (diceMultiplier + 1)
            secondAccumulatedDice = secondAccumulatedDice * (diceMultiplier + 1)
            thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier 
        }
                
    if (numberOfDice == 1) {
        spellDamageSum = firstAccumulatedDice
    }
    if (numberOfDice == 2) {
        spellDamageSum = firstAccumulatedDice + secondAccumulatedDice
    }
    if (numberOfDice > 2) {
        spellDamageSum = firstAccumulatedDice + secondAccumulatedDice + thirdAccumulatedDice
        
    }
    if (firstAccumulatedDiceRollResult == 10) {
        firstAccumulatedDiceRollResult = 0
    }
    if (secondAccumulatedDiceRollResult == 10) {
        secondAccumulatedDiceRollResult = 0
    }
    if (thirdAccumulatedDiceRollResult == 10) {
        thirdAccumulatedDiceRollResult = 0
    }
    bigSpellDamageRollLegendPointCheckBox.style.display = 'grid'
    numberOfSpellDamageDiceAfterLastSpellDamageRoll = numberOfDice
    damageResult.innerText = spellDamageSum
    damageResult.animate([{ color: "white" }, { color: "black" }], 200)
    console.log("a három dobás eredményei",firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult)
    console.log("egyes kockahelyek felhalmozott sebzései",firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
    console.log("össz sebzés", spellDamageSum)
    return [firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult, spellDamageSum]
}


function K10RollAndSpellDamageRoll() {
    function handleTenSidedDiceRoll() {
        tenSidedDiceRollResult.innerText = ""
        tenSidedDiceRollResult.innerText = Math.floor(generator.random() * 10);
        tenSidedDiceRollResult.animate([{color: "white"}, {color:"black"}],200)
    }
    
    function handleSpellDamageLpCheckBox(event) {
        if (event.target.checked == false) {
        let allThreeSpellDamageDicesSelect = document.querySelectorAll("li#allThreeDiceResultWrapper select")
        for (let i = 0; i < allThreeSpellDamageDicesSelect.length; i++) {
            allThreeSpellDamageDicesSelect[i].disabled = true
            }
            attackRollButton.disabled = false
            if (parseInt(numberOfDiceInput.value)==2) {
                secondAccumulatedDiceResultSelect.style.opacity = 0.7
            }
            if (parseInt(numberOfDiceInput.value)>2) {
                secondAccumulatedDiceResultSelect.style.opacity = 0.7
                thirdAccumulatedDiceResultSelect.style.opacity = 0.7
            }
        }
        if (event.target.checked == true) {
        let allThreeSpellDamageDicesSelect = document.querySelectorAll("li#allThreeDiceResultWrapper select")
        for (let i = 0; i < allThreeSpellDamageDicesSelect.length; i++) {
            allThreeSpellDamageDicesSelect[i].disabled = false
            }
            attackRollButton.disabled = true
            if (parseInt(numberOfDiceInput.value)==2) {
                secondAccumulatedDiceResultSelect.style.opacity = 1
            }
            if (parseInt(numberOfDiceInput.value)>2) {
                secondAccumulatedDiceResultSelect.style.opacity = 1
                thirdAccumulatedDiceResultSelect.style.opacity = 1
            }
        }
    }
    function handleSpellDamageDiceChange(firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult) {
        let allThreeSpellDamageDicesSelect = document.querySelectorAll("li#allThreeDiceResultWrapper select")
        for (let i = 0; i < allThreeSpellDamageDicesSelect.length; i++) {
            allThreeSpellDamageDicesSelect[i].disabled = true
            }
        
        firstAccumulatedDiceRollResult = parseInt(firstAccumulatedDiceResultSelect.value)
        secondAccumulatedDiceRollResult = parseInt(secondAccumulatedDiceResultSelect.value)
        thirdAccumulatedDiceRollResult = parseInt(thirdAccumulatedDiceResultSelect.value)

        if (firstAccumulatedDiceRollResult == 0) {
                firstAccumulatedDiceRollResult = 10
            }
            if (secondAccumulatedDiceRollResult == 0) {
                secondAccumulatedDiceRollResult = 10
            }
            if (thirdAccumulatedDiceRollResult == 0) {
                thirdAccumulatedDiceRollResult = 10
            }
        
        multipleDiceRoll(firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult, numberOfSpellDamageDiceAfterLastSpellDamageRoll)
        numberOfDiceInput.disabled = false
        bigSpellDamageRollLegendPointCheckBox.checked = false
        bigSpellDamageRollLegendPointCheckBox.style.display = 'none'
        if (initRolled==true && parseInt(numberOfActions.innerText)<totalActionCostOfAttack) {
            attackRollButton.disabled = true
        } else {
            attackRollButton.disabled = false
        }
    }

    function handleMultipleDiceRoll() {
       multipleDiceRoll(0,0,0,numberOfDiceInput.value)
    }
    return (
        <div className={styles.k10RollAndSpellDamageRollWrapper}>
            <li><div>
                k10-es dobókocka
            </div>
            <button onClick={handleTenSidedDiceRoll}>Dobj</button>
                <div id='tenSidedDiceRollResult' className={styles.tenSidedDiceRollResult}></div>
            </li>
            <li className={styles.middleListItem}>
                <input id='numberOfDiceInput' type='number' defaultValue={1}/>
                <div className={styles.k5label}>
                k5
            </div>
            <button onClick={handleMultipleDiceRoll} >Dobj</button>
            </li>
            <li id='allThreeDiceResultWrapper' className={styles.allThreeDiceResultWrapper}>
                <label htmlFor="firstAccumulatedDiceResultSelect" id="firstAccumulatedDiceResultSelectLabel">
            Első kocka:
          </label>
          <label htmlFor="secondAccumulatedDiceResultSelect" id="secondAccumulatedDiceResultSelectLabel">
            Második kocka:
          </label>
          <label htmlFor="thirdAccumulatedDiceResultSelect" id="thirdAccumulatedDiceResultSelectLabel">
            Harmadik kocka:
                </label>
                <label htmlFor="bigSpellDamageRollLegendPointCheckBox" className={styles.bigSpellDamageRollLegendPointCheckBoxLabel}>
            LP
                </label>
          <select id="firstAccumulatedDiceResultSelect" onChange={handleSpellDamageDiceChange} >
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <select id="secondAccumulatedDiceResultSelect" onChange={handleSpellDamageDiceChange} >
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
                </select>
          <select id="thirdAccumulatedDiceResultSelect" onChange={handleSpellDamageDiceChange} >
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
                </select>
                <input id='bigSpellDamageRollLegendPointCheckBox' className={styles.bigSpellDamageRollLegendPointCheckBox} onChange={handleSpellDamageLpCheckBox} type='checkBox'/>
                </li>
        </div>
    )
}

export default K10RollAndSpellDamageRoll