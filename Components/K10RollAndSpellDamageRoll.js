import styles from "../styles/k10RollAndSpellDamageRoll.module.css";
import { generator, rollOptions, updateCharacterSocketData } from "../pages";
export let numberOfSpellDamageDiceAfterLastSpellDamageRoll = 0;

export function multipleDiceRoll(event, firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult, numberOfDice) {
  if (numberOfDice >= 22) {
    numberOfDice = 22;
    numberOfDiceInput.value = 22;
  }
  if (firstAccumulatedDiceRollResult == 0) {
    firstAccumulatedDiceRollResult = 10;
  }
  if (secondAccumulatedDiceRollResult == 0) {
    secondAccumulatedDiceRollResult = 10;
  }
  if (thirdAccumulatedDiceRollResult == 0) {
    thirdAccumulatedDiceRollResult = 10;
  }
  let spellDamageSum = 0;
  let diceMultiplierRest = numberOfDice % 3;
  if (firstAccumulatedDiceRollResult == "needRoll") {
    firstAccumulatedDiceRollResult = Math.floor(generator.random() * 10);
    firstAccumulatedDiceResultSelect.value = firstAccumulatedDiceRollResult;
    if (firstAccumulatedDiceRollResult == 0) {
      firstAccumulatedDiceRollResult = 10;
    }
  }
  if (secondAccumulatedDiceRollResult == "needRoll") {
    secondAccumulatedDiceRollResult = Math.floor(generator.random() * 10);
    secondAccumulatedDiceResultSelect.value = secondAccumulatedDiceRollResult;
    if (secondAccumulatedDiceRollResult == 0) {
      secondAccumulatedDiceRollResult = 10;
    }
  }
  if (thirdAccumulatedDiceRollResult == "needRoll") {
    thirdAccumulatedDiceRollResult = Math.floor(generator.random() * 10);
    thirdAccumulatedDiceResultSelect.value = thirdAccumulatedDiceRollResult;
    if (thirdAccumulatedDiceRollResult == 0) {
      thirdAccumulatedDiceRollResult = 10;
    }
  }

  secondAccumulatedDiceResultSelectLabel.innerText = "Második kocka";
  thirdAccumulatedDiceResultSelectLabel.innerText = "Harmadik kocka";

  let firstAccumulatedDice = Math.ceil(firstAccumulatedDiceRollResult / 2);
  let secondAccumulatedDice = Math.ceil(secondAccumulatedDiceRollResult / 2);
  let thirdAccumulatedDice = Math.ceil(thirdAccumulatedDiceRollResult / 2);
  console.log("maradék", diceMultiplierRest);
  console.log("a három érték amit megkap a függvény", firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult);

  console.log("a három kocka kezdő sebzései", firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice);

  let diceMultiplier = Math.floor(parseInt(numberOfDice) / 3);

  if (diceMultiplierRest == 0) {
    firstAccumulatedDice = firstAccumulatedDice * diceMultiplier;
    secondAccumulatedDice = secondAccumulatedDice * diceMultiplier;
    thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier;
  }
  if (diceMultiplierRest == 1) {
    firstAccumulatedDice = firstAccumulatedDice * (diceMultiplier + 1);
    secondAccumulatedDice = secondAccumulatedDice * diceMultiplier;
    thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier;
  }
  if (diceMultiplierRest == 2) {
    firstAccumulatedDice = firstAccumulatedDice * (diceMultiplier + 1);
    secondAccumulatedDice = secondAccumulatedDice * (diceMultiplier + 1);
    thirdAccumulatedDice = thirdAccumulatedDice * diceMultiplier;
  }

  if (numberOfDice == 1) {
    spellDamageSum = firstAccumulatedDice;
    secondAccumulatedDiceResultSelect.style.opacity = 0;
    secondAccumulatedDiceResultSelectLabel.innerText = "";
    thirdAccumulatedDiceResultSelect.style.opacity = 0;
    thirdAccumulatedDiceResultSelectLabel.innerText = "";
  }
  if (numberOfDice == 2) {
    spellDamageSum = firstAccumulatedDice + secondAccumulatedDice;
    secondAccumulatedDiceResultSelect.style.opacity = 1;
    secondAccumulatedDiceResultSelectLabel.innerText = "Második kocka";
    thirdAccumulatedDiceResultSelect.style.opacity = 0;
    thirdAccumulatedDiceResultSelectLabel.innerText = "";
  }
  if (numberOfDice > 2) {
    spellDamageSum = firstAccumulatedDice + secondAccumulatedDice + thirdAccumulatedDice;
    secondAccumulatedDiceResultSelect.style.opacity = 1;
    secondAccumulatedDiceResultSelectLabel.innerText = "Második kocka";
    thirdAccumulatedDiceResultSelect.style.opacity = 1;
    thirdAccumulatedDiceResultSelectLabel.innerText = "Harmadik kocka";
  }
  if (firstAccumulatedDiceRollResult == 10) {
    firstAccumulatedDiceRollResult = 0;
  }
  if (secondAccumulatedDiceRollResult == 10) {
    secondAccumulatedDiceRollResult = 0;
  }
  if (thirdAccumulatedDiceRollResult == 10) {
    thirdAccumulatedDiceRollResult = 0;
  }
  numberOfSpellDamageDiceAfterLastSpellDamageRoll = numberOfDice;
  console.log("a három dobás eredményei", firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult);
  console.log("egyes kockahelyek felhalmozott sebzései", firstAccumulatedDice, secondAccumulatedDice, thirdAccumulatedDice);
  console.log("össz sebzés", spellDamageSum);
  return [firstAccumulatedDiceRollResult, secondAccumulatedDiceRollResult, thirdAccumulatedDiceRollResult, spellDamageSum];
}

function K10RollAndSpellDamageRoll() {
  function handleTenSidedDiceRoll(event) {
    if (soundToggleCheckbox.checked) {
      rollDiceSound.play();
    }
    tenSidedDiceRollResult.innerText = "";
    tenSidedDiceRollResult.innerText = Math.floor(generator.random() * 10);
    tenSidedDiceRollResult.animate([{ color: "white" }, { color: "black" }], 200);
    updateCharacterSocketData(event);
  }

  function handleMultipleDiceRoll(event) {
    if (soundToggleCheckbox.checked) {
      rollDiceSound.play();
    }
    let spellDamage = multipleDiceRoll(event, "needRoll", "needRoll", "needRoll", numberOfDiceInput.value);
    damageResult.innerText = spellDamage[3];
    damageResult.animate([{ color: "white" }, { color: "black" }], 200);
  }
  return (
    <div className={styles.k10RollAndSpellDamageRollWrapper}>
      <li>
        <div>k10-es dobókocka</div>
        <button id="tenSidedDiceRollResultButton" onClick={handleTenSidedDiceRoll}>
          Dobj
        </button>
        <div id="tenSidedDiceRollResult" className={styles.tenSidedDiceRollResult}></div>
      </li>
      <li className={styles.middleListItem}>
        <input id="numberOfDiceInput" type="number" defaultValue={1} />
        <div className={styles.k5label}>k5</div>
        <button
          onClick={(event) => {
            handleMultipleDiceRoll();
            updateCharacterSocketData(event);
          }}
        >
          Dobj
        </button>
      </li>
      <li id="allThreeDiceResultWrapper" className={styles.allThreeDiceResultWrapper}>
        <label htmlFor="firstAccumulatedDiceResultSelect" id="firstAccumulatedDiceResultSelectLabel">
          Első kocka:
        </label>
        <label htmlFor="secondAccumulatedDiceResultSelect" id="secondAccumulatedDiceResultSelectLabel">
          Második kocka:
        </label>
        <label htmlFor="thirdAccumulatedDiceResultSelect" id="thirdAccumulatedDiceResultSelectLabel">
          Harmadik kocka:
        </label>
        <select
          id="firstAccumulatedDiceResultSelect"
          onChange={(event) => {
            let manuallyChangedValueOfFirstDice = event.target.value;
            if (event.target.value == 0) {
              manuallyChangedValueOfFirstDice = 10;
            }
            let spellDamage = multipleDiceRoll(event, manuallyChangedValueOfFirstDice, secondAccumulatedDiceResultSelect.value, thirdAccumulatedDiceResultSelect.value, numberOfDiceInput.value);
            damageResult.innerText = spellDamage[3];
            damageResult.animate([{ color: "white" }, { color: "black" }], 200);
            updateCharacterSocketData(event);
          }}
        >
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
        <select
          id="secondAccumulatedDiceResultSelect"
          onChange={(event) => {
            let manuallyChangedValueOfSecondDice = event.target.value;
            if (event.target.value == 0) {
              manuallyChangedValueOfSecondDice = 10;
            }
            let spellDamage = multipleDiceRoll(event, firstAccumulatedDiceResultSelect.value, manuallyChangedValueOfSecondDice, thirdAccumulatedDiceResultSelect.value, numberOfDiceInput.value);
            damageResult.innerText = spellDamage[3];
            damageResult.animate([{ color: "white" }, { color: "black" }], 200);
            updateCharacterSocketData(event);
          }}
        >
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
        <select
          id="thirdAccumulatedDiceResultSelect"
          onChange={(event) => {
            let manuallyChangedValueOfThirdDice = event.target.value;
            if (event.target.value == 0) {
              manuallyChangedValueOfThirdDice = 10;
            }
            let spellDamage = multipleDiceRoll(event, firstAccumulatedDiceResultSelect.value, secondAccumulatedDiceResultSelect.value, manuallyChangedValueOfThirdDice, numberOfDiceInput.value);
            damageResult.innerText = spellDamage[3];
            damageResult.animate([{ color: "white" }, { color: "black" }], 200);
            updateCharacterSocketData(event);
          }}
        >
          {rollOptions.map((e) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
      </li>
    </div>
  );
}

export default K10RollAndSpellDamageRoll;
