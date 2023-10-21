import styles from '../styles/k10RollAndSpellDamageRoll.module.css';
import { generator, rollOptions } from '../pages';


export function multipleDiceRoll(firstAccumulatedDice = 0, secondAccumulatedDice = 0, thirdAccumulatedDice = 0, numberOfDice) {
    let spellDamageSum = 0
    let diceMultiplierRest = numberOfDice % 3
    let firstAccumulatedDiceWasNotNull = true
    let secondAccumulatedDiceWasNotNull = true
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
                break
            } else if (firstAccumulatedDice != 0 && firstAccumulatedDiceWasNotNull==true) {
                i++          
            }
            if (secondAccumulatedDice == 0 && numberOfDice>1) {
                secondAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                break
            } 
            else if (secondAccumulatedDice != 0 && secondAccumulatedDiceWasNotNull == true) {
                i++
            }
            if (thirdAccumulatedDice == 0 && numberOfDice>2) {
                thirdAccumulatedDice = Math.ceil(fiveSidedDiceRoll / 2)
                break
            }
            console.log(firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
            
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
    damageResult.animate([{color: "white"}, {color:"black"}],200)
    console.log(firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice)
    console.log("össz sebzés", spellDamageSum)
    return [spellDamageSum, firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice]
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
            {/* <li className={styles.allThreeDiceResultWrapper}>
                <label htmlFor="firstAccumulatedDiceResultSelect" id="firstAccumulatedDiceResultSelectLabel">
            Első kocka:
          </label>
          <label htmlFor="secondAccumulatedDiceDiceResultSelect" id="secondAccumulatedDiceDiceResultSelectLabel">
            Második kocka:
          </label>
          <label htmlFor="thirdAccumulatedDiceDiceResultSelect" id="thirdAccumulatedDiceDiceResultSelectLabel">
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
          <select id="secondAccumulatedDiceDiceResultSelect" name="">
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
                </select>
          <select id="thirdAccumulatedDiceDiceResultSelect" name="">
            {rollOptions.map((e) => {
              return <option key={e}>{e}</option>;
            })}
                </select>
                <input id='legendPointCheckBoxForBigSpellDamageRoll' className={styles.legendPointCheckBoxForBigSpellDamageRoll} type='checkBox'/>
                </li> */}
        </div>
    )
}

export default K10RollAndSpellDamageRoll