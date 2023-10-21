import styles from '../styles/k10RollAndSpellDamageRoll.module.css';
import { generator, rollOptions } from '../pages';


export function multipleDiceRoll(firstAccumulatedDiceRollResult = 0, secondAccumulatedDiceRollResult = 0, thirdAccumulatedDiceRollResult = 0, numberOfDice) {
    let spellDamageSum = 0
    let diceMultiplierRest = numberOfDice % 3
    let firstAccumulatedDiceWasNotNull = true
    let secondAccumulatedDiceWasNotNull = true
    
    let firstAccumulatedDice = firstAccumulatedDiceRollResult
    let secondAccumulatedDice = secondAccumulatedDiceRollResult
    let thirdAccumulatedDice = thirdAccumulatedDiceRollResult
    console.log("maradék", diceMultiplierRest)
    console.log("a három érték amit megkap a függvény",firstAccumulatedDice, secondAccumulatedDice,thirdAccumulatedDice)
    if (numberOfDice >= 22) {
        numberOfDice = 22
    }
    for (let i = 0; i < numberOfDice; i++) {
        // osztás maradéka külön
        
        let fiveSidedDiceRoll = Math.floor(generator.random() * 10)
        if (fiveSidedDiceRoll == 0) {
            fiveSidedDiceRoll = 10
        }
        if (i>=4) {
            break
        }

        for (let j = i; j < numberOfDice; j++) {

            if (firstAccumulatedDice == 0) {
                firstAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                firstAccumulatedDiceRollResult = fiveSidedDiceRoll
                break
            } else if (firstAccumulatedDice != 0 && firstAccumulatedDiceWasNotNull == true) {
                firstAccumulatedDice = Math.ceil(firstAccumulatedDiceRollResult / 2)
                i++          
            }
            if (secondAccumulatedDice == 0 && numberOfDice>1) {
                secondAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                secondAccumulatedDiceRollResult = fiveSidedDiceRoll
                break
            } 
            else if (secondAccumulatedDice != 0 && secondAccumulatedDiceWasNotNull == true) {
                secondAccumulatedDice = Math.ceil(secondAccumulatedDiceRollResult / 2)
                i++
            }
            if (thirdAccumulatedDice == 0 && numberOfDice>2) {
                thirdAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                thirdAccumulatedDiceRollResult = fiveSidedDiceRoll
                break
            }
            console.log("a három kocka kezdő sebzéshelyei",firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
            
                let diceMultiplier = Math.floor(parseInt(numberOfDice) / 3)
                
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
    if (numberOfDice == 1) {
        spellDamageSum = firstAccumulatedDice
    }
    if (numberOfDice == 2) {
        spellDamageSum = firstAccumulatedDice + secondAccumulatedDice
    }
    if (numberOfDice > 2) {
        spellDamageSum = firstAccumulatedDice + secondAccumulatedDice + thirdAccumulatedDice
        
    }

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
            <li className={styles.allThreeDiceResultWrapper}>
                <label htmlFor="firstAccumulatedDiceResultSelect" id="firstAccumulatedDiceResultSelectLabel">
            Első kocka:
          </label>
          <label htmlFor="secondAccumulatedDiceResultSelect" id="secondAccumulatedDiceResultSelectLabel">
            Második kocka:
          </label>
          <label htmlFor="thirdAccumulatedDiceResultSelect" id="thirdAccumulatedDiceResultSelectLabel">
            Harmadik kocka:
                </label>
                <label htmlFor="legendPointCheckBoxForBigSpellDamageRoll" className={styles.legendPointCheckBoxForBigSpellDamageRollLabel}>
            LP
                </label>
          <select id="firstAccumulatedDiceResultSelect" name="">
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <select id="secondAccumulatedDiceResultSelect" name="">
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
                </select>
          <select id="thirdAccumulatedDiceResultSelect" name="">
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
                </select>
                <input id='legendPointCheckBoxForBigSpellDamageRoll' className={styles.legendPointCheckBoxForBigSpellDamageRoll} type='checkBox'/>
                </li>
        </div>
    )
}

export default K10RollAndSpellDamageRoll