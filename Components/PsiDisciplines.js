import styles from "../styles/psiDisciplines.module.css";
import { filteredArrayIfHasPsi, allActiveBuffs } from "../pages";
import { hmoModifier } from "./ActionsList";
import { initRolled, updateCharacterData } from "./CharacterDetails";
import { allDmgReductionListItems } from "./ArmorDetails";
export let specialAtkModifierFromPsiAssault = 0;
export let availableNumberOfAttacksFromPsiAssault = 0;
export let bonusDamageFromChiCombat = 0;
export function bonusDamageFromChiCombatNullifier() {
  bonusDamageFromChiCombat = 0;
}
export let theRoundChiCombatWasUsedIn = 0;
export let chiCombatAtkDefModifier = 0;
export function chiCombatAtkDefModifierNullifier() {
  chiCombatAtkDefModifier = 0;
}
export let chiCombatDisabled = false
export function setChiCombatDisabledToTrue (){
  chiCombatDisabled = true
}
export let activeBuffsArray = [];
export function buffRemoverFromActiveBuffArrayAndTextList(buffName) {
  for (let i = 0; i < activeBuffsArray.length; i++) {
    if (activeBuffsArray[i].includes(buffName)) {
      activeBuffsArray.splice(i, 1);
      break;
    }
  }
  for (let i = 0; i < allActiveBuffs.length; i++) {
    if (allActiveBuffs[i].innerText.includes(buffName)) {
      allActiveBuffs[i].innerText = "";
      //allActiveBuffs[i].parentElement.lastChild.value = "";
    }
  }
  if (buffName.includes("Pszi Roham")) {
    availableNumberOfAttacksFromPsiAssault = 0;
  }
  if (buffName.includes("Aranyharang")) {
    theRoundGoldenBellWasUsedIn = 0;
  }
  if (buffName.includes("Chi-harc")) {
    theRoundChiCombatWasUsedIn = 0;
  }
  
}

export function buffTextChecker(buffName) {
  for (let i = 0; i < allActiveBuffs.length; i++) {
    if (allActiveBuffs[i].innerText.includes(buffName)) {
      return true;
    }
  }
  return false;
}

// erre azért volt külön szükség, hogy a buff array-on belüli stringeken belül keressen

export function activeBuffsArrayChecker(buffName) {
  for (let i = 0; i < activeBuffsArray.length; i++) {
    if (activeBuffsArray[i].includes(buffName)) {
      return true;
    }
  }
  return false;
}

export function psiPointCostCheckerAndSetter() {
  if (selectedPsiDisciplineObj[0].canBeModified == false) {
    if (selectedPsiDisciplineObj[0].psiPointCost == "All") {
      psiPointCostInput.value = parseInt(currentPp.value);
    } else {
      psiPointCostInput.value = parseInt(
        selectedPsiDisciplineObj[0].psiPointCost
      );
    }
    psiPointCostInput.disabled = true;
    psiActivateButton.disabled = false;
  }
  if (selectedPsiDisciplineObj[0].canBeModified == true) {
    psiPointCostInput.disabled = false;
    psiActivateButton.disabled = false;
  }
  if (
    parseInt(psiPointCostInput.value) > parseInt(currentPp.value) ||
    parseInt(currentPp.value) == 0
  ) {
    psiActivateButton.disabled = true;
    if (selectedPsiDisciplineObj[0].psiPointCost == "All") {
      psiPointCostInput.value = parseInt(currentPp.value);
    }
    if (selectedPsiDisciplineObj[0].canBeModified == false) {
      psiPointCostInput.value = parseInt(
        selectedPsiDisciplineObj[0].psiPointCost
      );
    }
  }
}
export let fpShield = 0;
export function fpShieldSetter(shieldAmount) {
  fpShield = parseInt(shieldAmount);
}
export let theRoundGoldenBellWasUsedIn = 0;
export let goldenBellDuration;
export let dmgReductionByGoldenBell = 0;

export function dmgReductionByGoldenBellSetter(dmgReductionByGoldenBell = 0) {
  if (allDmgReductionListItems) {
    for (let i = 0; i < allDmgReductionListItems.length; i++) {
      allDmgReductionListItems[i].innerText =
        parseInt(allDmgReductionListItems[i].innerText) +
        parseInt(dmgReductionByGoldenBell);
    }
  }
}
export let theRoundInnerTimeWasUsedIn;
export let innerTimeNegativeModifier = 0;
export function innerTimeNegativeModifierNullifier() {
  innerTimeNegativeModifier = 0;
}
let selectedPsiDisciplineObj;

export function PsiDisciplines(props) {
  let filteredPsiDisciplines = [];
  function handleListPsi() {
    for (let i = 0; i < props.psiDisciplines.length; i++) {
      for (let j = 1; j < filteredArrayIfHasPsi.length; j++) {
        if (
          filteredArrayIfHasPsi[j].name.slice(5) != "" &&
          props.psiDisciplines[i].psiSchool.includes(
            filteredArrayIfHasPsi[j].name.slice(5)
          ) &&
          props.psiDisciplines[i].requiredPsiSkillLevel <=
            filteredArrayIfHasPsi[j].level
        ) {
          filteredPsiDisciplines.push(props.psiDisciplines[i]);
          break;
        }
      }
    }
    for (let k = 0; k < filteredPsiDisciplines.length; k++) {
      let psiDisciplineOption = document.createElement("option");
      psiDisciplineOption.innerText = filteredPsiDisciplines[k].psiDiscName;
      psiDisciplinesSelect.appendChild(psiDisciplineOption);
    }

    selectedPsiDisciplineObj = filteredPsiDisciplines.filter(
      (discipline) => psiDisciplinesSelect.value == discipline.psiDiscName
    );

    psiPointCostInput.value = parseInt(
      selectedPsiDisciplineObj[0].psiPointCost
    );
    psiDisciplinesSelect.style.display = "grid";
    psiPointCostInput.style.display = "grid";
    psiActivateButton.style.display = "grid";
    listPsiButton.style.display = "none";
    psiPointCostCheckerAndSetter();
  }
  function handlePsiDisciplineSelect(event) {
    selectedPsiDisciplineObj = filteredPsiDisciplines.filter(
      (discipline) => discipline.psiDiscName == psiDisciplinesSelect.value
    );
    psiPointCostCheckerAndSetter();
  }

  function handleDisciplineActivation() {
    const savePsiPoinCostValueForPsiAssault = psiPointCostInput.value;
    if (!buffTextChecker(selectedPsiDisciplineObj[0].psiDiscName)) {
      currentPp.value -= parseInt(psiPointCostInput.value);
      psiPointCostCheckerAndSetter();
    }
    // if (
    //   initRolled == true &&
    //   !buffTextChecker(selectedPsiDisciplineObj[0].psiDiscName)
    // ) {
    //   numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
    // }

    let skillIndex = 0;

    for (let i = 0; i < filteredArrayIfHasPsi.length; i++) {
      if (
        filteredArrayIfHasPsi[i].name.slice(5) != "" &&
        selectedPsiDisciplineObj[0].psiSchool.includes(
          filteredArrayIfHasPsi[i].name.slice(5)
        )
      ) {
        if (skillIndex >= filteredArrayIfHasPsi[i].level) {
          break;
        }
        skillIndex = filteredArrayIfHasPsi[i].level;
      }
    }

    for (let i = 0; i < allActiveBuffs.length; i++) {
      let currentText = allActiveBuffs[i].innerText
      if (allActiveBuffs[i].innerText.includes("folyamatos")) {
        buffRemoverFromActiveBuffArrayAndTextList(allActiveBuffs[i].innerText)
      }
      if (
        allActiveBuffs[i].innerText == "" ||
        (allActiveBuffs[i].innerText != "" &&
          allActiveBuffs[i].innerText.includes("folyamatos"))
      ) {
        if (selectedPsiDisciplineObj[0].psiDiscName == "Fájdalomtűrés" && !buffTextChecker("Fájdalomtűrés")) 
          {
          fpShield = parseInt(psiPointCostInput.value / 2);
          if (fpShield == 0) {
            break;
          }
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: (+${fpShield} Fp Pajzs) - ${
            selectedPsiDisciplineObj[0].duration[skillIndex - 1]
          }`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          currentFp.value = parseInt(currentFp.value) + fpShield;
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Pszi Roham" &&
          !buffTextChecker("Pszi Roham")
        ) {
          
          specialAtkModifierFromPsiAssault = Math.floor(
            parseInt(savePsiPoinCostValueForPsiAssault) / 5
          );
          availableNumberOfAttacksFromPsiAssault = parseInt(
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1]
          );
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: Speciális TÉO módosító:+${specialAtkModifierFromPsiAssault}, ${
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1]
          } - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Pszi Lökés" &&
          !buffTextChecker("Pszi Lökés")
        ) {
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: ${psiPointCostInput.value} kg-nyi ${
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1]
          }, - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Chi-harc" &&
          !buffTextChecker("Chi-harc") &&
          !chiCombatDisabled
        ) {
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: (TÉO/VÉO:+${
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1].atkAndDef
          }, Sebzés: +${
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1].damage
          }) - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`;
          // allActiveBuffs[i].parentElement.lastChild.value =
          //   selectedPsiDisciplineObj[0].psiDiscName;
          bonusDamageFromChiCombat =
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1].damage;
          theRoundChiCombatWasUsedIn = parseInt(numberOfCurrentRound.innerText);
          chiCombatAtkDefModifier = parseFloat(
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1].atkAndDef
          );
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          hmoModifier(chiCombatAtkDefModifier);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Aranyharang" &&
          !buffTextChecker("Aranyharang")
        ) {
          dmgReductionByGoldenBell = parseInt(psiPointCostInput.value / 3);
          // 8-as karakteren van eltárolva a max SFÉ. Ha ennél többet állít, break
          if (
            dmgReductionByGoldenBell == 0 ||
            dmgReductionByGoldenBell >
              parseInt(selectedPsiDisciplineObj[0].benefit[skillIndex - 1].charAt(8))
          ) {
            // Egyben 'visszaadjuk' az elköltött pszipontot és 1 akciót is
            if (initRolled) {
              numberOfActions.innerText = parseInt(numberOfActions.innerText) + 1;
              currentPp.value =
                parseInt(currentPp.value) + parseInt(psiPointCostInput.value);
            }
            
            break;
          }
          dmgReductionByGoldenBellSetter(dmgReductionByGoldenBell);
          currentPp.value =
            parseInt(currentPp.value) + parseInt(psiPointCostInput.value % 3);
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: ${
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1]
          } jelenleg ${dmgReductionByGoldenBell} SFÉ - ${
            selectedPsiDisciplineObj[0].duration[skillIndex - 1]
          }`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          theRoundGoldenBellWasUsedIn = parseInt(numberOfCurrentRound.innerText);
          goldenBellDuration =
            selectedPsiDisciplineObj[0].duration[skillIndex - 1];
            if (initRolled == true) {
              numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
            }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Belső idő" &&
          !buffTextChecker("Belső idő")
        ) {
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: CS száma duplázódik ebben a körben. ${
            selectedPsiDisciplineObj[0].benefit[skillIndex - 1]
          }, - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`;
          if (initRolled == true) {
            innerTimeNegativeModifier = parseInt(
              selectedPsiDisciplineObj[0].benefit[skillIndex - 1]
            );
            numberOfActions.innerText = parseInt(numberOfActions.innerText) * 2;
          }
          theRoundInnerTimeWasUsedIn = parseInt(numberOfCurrentRound.innerText);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName ==
            "Energiagyűjtés - Átalakítás" &&
          !buffTextChecker("Energiagyűjtés - Átalakítás")
        ) {
          //activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName);
          // allActiveBuffs[i].innerText = `Energiagyűjtés - Átalakítással nyert mana: ${
          //   psiPointCostInput.value
          // } - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`;
          // allActiveBuffs[i].parentElement.lastChild.value =
          //   selectedPsiDisciplineObj[0].psiDiscName;
          currentMp.value =
            parseInt(currentMp.value) + parseInt(psiPointCostInput.value);
          if (parseInt(maxMp.innerText) <= parseInt(currentMp.value)) {
            currentMp.value = parseInt(maxMp.innerText);
          }
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName ==
            "Energiagyűjtés - Kivonás" &&
          !buffTextChecker("Energiagyűjtés - Kivonás")
        ) {
          // activeBuffsArray.push(selectedPsiDisciplineObj[0].psiDiscName);
          // allActiveBuffs[i].innerText = `Energiagyűjtés - Kivonással nyert mana: ${
          //   parseInt(psiPointCostInput.value) * 3
          // } - ${selectedPsiDisciplineObj[0].duration[skillIndex - 1]}`;
          // allActiveBuffs[i].parentElement.lastChild.value =
          //   selectedPsiDisciplineObj[0].psiDiscName;
          currentMp.value =
            parseInt(currentMp.value) + parseInt(psiPointCostInput.value) * 3;
          if (parseInt(maxMp.innerText) <= parseInt(currentMp.value)) {
            currentMp.value = parseInt(maxMp.innerText);
          }
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Dinamikus ellenállás" &&
          !buffTextChecker("Dinamikus ellenállás")
        ) {
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${
            selectedPsiDisciplineObj[0].duration[skillIndex - 1]
          }`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Érzékélesítés" &&
          !buffTextChecker("Érzékélesítés")
        ) {
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${
            selectedPsiDisciplineObj[0].duration[skillIndex - 1]
          }`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        } else if (
          selectedPsiDisciplineObj[0].psiDiscName == "Tulajdonság Javítás" &&
          !buffTextChecker("Tulajdonság Javítás")
        ) {
          allActiveBuffs[i].innerText = `${
            selectedPsiDisciplineObj[0].psiDiscName
          }: (+${selectedPsiDisciplineObj[0].benefit[skillIndex - 1]}) - ${
            selectedPsiDisciplineObj[0].duration[skillIndex - 1]
          }`;
          activeBuffsArray.push(allActiveBuffs[i].innerText);
          if (initRolled == true) {
            numberOfActions.innerText = parseInt(numberOfActions.innerText) - 1;
          }
          break;
        }
      }
    }
    console.log(activeBuffsArray);
    psiPointCostCheckerAndSetter();
    updateCharacterData();
  }

  function handleDeleteBuff(event) {
    if (event.target.parentElement.firstChild.innerText) {
      if (event.target.parentElement.innerText.includes("Chi-harc")) {
        hmoModifier(-chiCombatAtkDefModifier);
        chiCombatAtkDefModifier = 0;
      }
      if (event.target.parentElement.innerText.includes("Fájdalomtűrés")) {
        currentFp.value = parseInt(currentFp.value) - parseInt(fpShield);
        fpShield = 0;
      }
      if (event.target.parentElement.innerText.includes("Aranyharang")) {
        dmgReductionByGoldenBellSetter(-dmgReductionByGoldenBell);
        dmgReductionByGoldenBell = 0;
      }
      if (event.target.parentElement.innerText.includes("Belső idő")) {
        innerTimeNegativeModifier = 0;
      }
      buffRemoverFromActiveBuffArrayAndTextList(
        event.target.parentElement.firstChild.innerText
      );
    }
    updateCharacterData(false);
    console.log(activeBuffsArray);
  }
  function handlePsiRecovery(event) {
    if (
      event.target.parentElement.firstChild.id == "amountOfMinutesMeditating"
    ) {
      currentPp.value =
        parseInt(currentPp.value) +
        filteredArrayIfHasPsi[0].level *
          Math.floor(parseInt(amountOfMinutesMeditating.value) / 5);
    }
    if (
      event.target.parentElement.firstChild.id == "amountOfHoursPassiveRecovery"
    ) {
      currentPp.value =
        parseInt(currentPp.value) +
        filteredArrayIfHasPsi[0].level *
          parseInt(event.target.parentElement.firstChild.value);
    }
    if (event.target.parentElement.firstChild.id == "amountOfHoursSlept") {
      currentPp.value =
        parseInt(currentPp.value) +
        3 *
          (filteredArrayIfHasPsi[0].level *
            parseInt(event.target.parentElement.firstChild.value));
    }
    if (parseInt(currentPp.value) >= parseInt(maxPp.innerText)) {
      currentPp.value = parseInt(maxPp.innerText);
    }
    updateCharacterData(false);
  }

  return (
    <>
      <div
        id="psiDisciplinesSelectWrapper"
        className={styles.psiDisciplinesSelectWrapper}>
        <label
          htmlFor="psiDisciplinesSelect"
          id="psiDisciplinesSelectLabel"
          className={styles.psiDisciplinesSelectLabel}>
          Pszi Diszciplína
        </label>
        <select
          id="psiDisciplinesSelect"
          name="psiDisciplinesSelect"
          className={styles.psiDisciplinesSelect}
          onChange={handlePsiDisciplineSelect}></select>
        <input
          id="psiPointCostInput"
          className={styles.psiPointCostInput}
          disabled={true}
          onChange={psiPointCostCheckerAndSetter}
        />
        <button
          id="listPsiButton"
          className={styles.listPsiButton}
          onClick={handleListPsi}>
          Listázás
        </button>
        <button
          id="psiActivateButton"
          className={styles.psiActivateButton}
          onClick={handleDisciplineActivation}
          onMouseEnter={psiPointCostCheckerAndSetter}>
          Mehet
        </button>
        <div className={styles.psiPoints}>Pp</div>
      </div>
      <div className={styles.currentlyActiveBuffsWrapper}>
        <ul
          id="listOfCurrentlyActiveBuffs">
          <div>
            <li id="activeBuff1" className={styles.activeBuff}></li>
            <button
              className={styles.deleteBuffButton}
              onClick={handleDeleteBuff}>
              Törlés
            </button>
          </div>
          <div>
            <li id="activeBuff2" className={styles.activeBuff}></li>
            <button
              className={styles.deleteBuffButton}
              onClick={handleDeleteBuff}>
              Törlés
            </button>
          </div>
          <div>
            <li id="activeBuff3" className={styles.activeBuff}></li>
            <button
              className={styles.deleteBuffButton}
              onClick={handleDeleteBuff}>
              Törlés
            </button>
          </div>
          <div>
            <li id="activeBuff4" className={styles.activeBuff}></li>
            <button
              className={styles.deleteBuffButton}
              onClick={handleDeleteBuff}>
              Törlés
            </button>
          </div>
        </ul>
      </div>
      <div id="psiRecoveryWrapper" className={styles.psiRecoveryWrapper}>
        <span>Pszi visszatöltés</span>
        <span>
          <input
            id="amountOfMinutesMeditating"
            type="number"
            defaultValue={0}
          />
          <button onClick={handlePsiRecovery}>Perc meditáció</button>
        </span>
        <span>
          <input
            id="amountOfHoursPassiveRecovery"
            type="number"
            defaultValue={0}
          />
          <button onClick={handlePsiRecovery}>Óra passzívan kapott</button>
        </span>
        <span>
          <input id="amountOfHoursSlept" type="number" defaultValue={0} />
          <button onClick={handlePsiRecovery}>Óra alvás</button>
        </span>
      </div>
    </>
  );
}

export default PsiDisciplines;
