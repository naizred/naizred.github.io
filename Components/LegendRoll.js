import styles from '../styles/legendroll.module.css';
import { generator } from '../pages';

let spellDamageSum = 0

function LegendRoll() {
    function handleTenSidedDiceRoll() {
        tenSidedDiceRollResult.innerText = ""
        tenSidedDiceRollResult.innerText = Math.floor(generator.random() * 10);
        tenSidedDiceRollResult.animate([{color: "white"}, {color:"black"}],200)
    }
    function handleMultipleDiceRoll() {
        spellDamageSum = 0
let firstAccumulatedDice = 0
let secondAccumulatedDice = 0
        let thirdAccumulatedDice = 0
        if (numberOfDiceInput.value >= 22) {
            numberOfDiceInput.value = 22
        }
        for (let i = 0; i < numberOfDiceInput.value; i++) {
            let diceMultiplierRest = numberOfDiceInput.value % 3
            let fiveSidedDiceRoll = Math.floor(generator.random() * 10)
            if (fiveSidedDiceRoll == 0) {
                fiveSidedDiceRoll = 10
            }
            if (i==4) {
                break
            }

            for (let j = i; j < numberOfDiceInput.value; j++) {
 
                if (firstAccumulatedDice == 0) {
                    firstAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                    break
                }
                if (secondAccumulatedDice == 0) {
                    secondAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                    break
                }
                if (thirdAccumulatedDice == 0) {
                    thirdAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                    break
                }
                console.log(firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
                
                    let diceMultiplier = Math.floor(parseInt(numberOfDiceInput.value) / 3)
                    // osztás maradéka külön
                    

                    if (diceMultiplierRest == 0) {

                        firstAccumulatedDice = firstAccumulatedDice* diceMultiplier
                        secondAccumulatedDice = secondAccumulatedDice * diceMultiplier
                        thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier
                        break
                    }
                    if (diceMultiplierRest == 1) {

                        firstAccumulatedDice = firstAccumulatedDice* (diceMultiplier + 1)
                        secondAccumulatedDice = secondAccumulatedDice * diceMultiplier
                        thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier
                        break
                        
                    }

                    if (diceMultiplierRest == 2) {

                        firstAccumulatedDice = firstAccumulatedDice* (diceMultiplier + 1)
                        secondAccumulatedDice = secondAccumulatedDice * (diceMultiplier + 1)
                        thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier
                          break
                    }
                    
                }
        }

    spellDamageSum = firstAccumulatedDice + secondAccumulatedDice + thirdAccumulatedDice
        
        damageResult.innerText = spellDamageSum
        damageResult.animate([{color: "white"}, {color:"black"}],200)
console.log(firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
        console.log("össz sebzés", spellDamageSum)
    }
    return (
        <div className={styles.legendRollWrapper}>
            <li><div>
                k10-es dobókocka
            </div>
            <button onClick={handleTenSidedDiceRoll}>Dobj</button>
                <div id='tenSidedDiceRollResult' className={styles.tenSidedDiceRollResult}></div>
            </li>
            <li>
                <input id='numberOfDiceInput' type='number' defaultValue={1}/>
                <div className={styles.k5label}>
                k5
            </div>
            <button onClick={handleMultipleDiceRoll} >Dobj</button>
                </li>
        </div>
    )
}

export default LegendRoll