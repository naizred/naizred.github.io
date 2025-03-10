import styles from "../styles/aimedAttack.module.css";
import { fileFirstLoaded } from "../pages";
export let bodyParts = ["Bal láb", "Jobb láb", "Bal kar", "Fegyverforgató kar", "Fegyverforgató kar", "Törzs", "Törzs", "Törzs", "Törzs", "Fej"];
let defaultCharAtkValue;

function AimedAttack() {
  function handleAimedAttackCheckBox(event) {
    charAtk.value = defaultCharAtkValue;
    if (fileFirstLoaded == true) {
      event.target.checked = false;
      return;
    }

    defaultCharAtkValue = parseFloat(charAtk.value) - (10 - event.target.value) / 2;
  }
  function handleAimedAttackCheckBoxForSmallTarget(event) {
    if (fileFirstLoaded == true) {
      event.target.checked = false;
      return;
    }
    bodyParts = [];
    let allAimedBodyParts = document.querySelectorAll("ul#aimedAttackList li input");
    for (let i = 0; i < allAimedBodyParts.length; i++) {
      allAimedBodyParts[i].checked = false;
    }
    for (let i = 0; i < 10; i++) {
      bodyParts.push("Testrésznél kisebb terület");
    }
    if (event.target.checked == true) {
      charAtk.value = parseFloat(charAtk.value) - 5;
    } else if (event.target.checked == false) {
      charAtk.value = parseFloat(charAtk.value) + 5;
    }
  }
  return (
    <>
      <div className={styles.underConstruction}>FEJLESZTÉS ALATT</div>
      <div className={styles.aimedAttackWrapper}>
        Testrészek, amiket NEM akarsz eltalálni:
        <ul id="aimedAttackList" className={styles.aimedAttackList}>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (0) Fej
          </li>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (9, 8) Mellkas
          </li>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (7, 6)Has
          </li>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (5, 4) Fegyverforgató kar
          </li>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (3) Bal kar
          </li>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (2) Jobb láb
          </li>
          <li>
            <input onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartRadioButton} type="checkbox" />
            (1) Bal láb
          </li>
        </ul>
        <div>
          <input id="aimedAttackBodyPartCheckBox" onClick={handleAimedAttackCheckBoxForSmallTarget} className={styles.aimedAttackBodyPartCheckBox} type="checkBox" />
          <span>Testrésznél kisebb terület megcélzása (pl.: szem, kéz, stb..)</span>
        </div>
      </div>
    </>
  );
}

export default AimedAttack;
