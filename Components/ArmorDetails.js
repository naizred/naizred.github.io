import { filteredArrayIfHasHeavyArmorSkill } from "../pages";
import styles from "../styles/armordetails.module.css";
let helmetWorn = false;
let upperTorsoWorn = false;
let lowerTorsoWorn = false;
let armsWorn = false;
let leggingsWorn = false;

export function checkWhereItIsWorn(armorPiece) {
  let heavyArmorSkillLevel = 0;
  if (filteredArrayIfHasHeavyArmorSkill.length != 0) {
    heavyArmorSkillLevel = parseInt(filteredArrayIfHasHeavyArmorSkill[0].level);
  }
  if (armorPiece.NAME.toLowerCase().includes("teljesvért") || armorPiece.NAME == "Rákozott félvért") {
    currentArmorImg.style.backgroundImage = "url('./armorParts/fullPlateBackGround.png')";
    currentArmorImg.style.backgroundSize = "7.58vw 12vw";
    currentHelmetImg.src = "./armorParts/helmetFullPlate.png";
    currentUpperTorsoImg.src = "./armorParts/upperTorsoFullPlate.png";
    currentLowerTorsoImg.src = "./armorParts/lowerTorsoFullPlate.png";
    currentArmsImg.src = "./armorParts/armsFullPlate.png";
    currentLeggingsImg.src = "./armorParts/leggingsFullPlate.png";
    currentHelmetImg.style.width = "7.58vw";
    currentUpperTorsoImg.style.width = "7.58vw";
    currentLowerTorsoImg.style.width = "7.58vw";
    currentArmsImg.style.width = "7.58vw";
    currentLeggingsImg.style.width = "7.58vw";
    currentHelmetImg.style.height = "12vw";
    currentUpperTorsoImg.style.height = "12vw";
    currentLowerTorsoImg.style.height = "12vw";
    currentArmsImg.style.height = "12vw";
    currentLeggingsImg.style.height = "12vw";
    dmgReduction.style.gridColumn = "3/6";
    currentHelmetDmgReduction.style.gridColumn = "3/9";
    currentUpperTorsoDmgReduction.style.gridColumn = "3/9";
    currentLowerTorsoDmgReduction.style.gridColumn = "3/9";
    currentArmsDmgReduction.style.gridColumn = "3/9";
    currentLeggingsDmgReduction.style.gridColumn = "3/9";
  }
  if (armorPiece.KIT.includes(10) && helmetWorn == false) {
    currentHelmetName.innerText = `Fej: ${armorPiece.NAME}`;
    currentHelmetImg.style.opacity = 1;
    if (armorPiece.SFE <= heavyArmorSkillLevel) {
      currentHelmetDmgReduction.innerText = armorPiece.SFE + armorPiece.SFE;
    }
    if (armorPiece.SFE > heavyArmorSkillLevel) {
      currentHelmetDmgReduction.innerText = armorPiece.SFE + heavyArmorSkillLevel;
    }
    helmetWorn = true;
  }
  if (armorPiece.KIT.includes(8) && upperTorsoWorn == false) {
    currentUpperTorsoName.innerText = `Mellkas: ${armorPiece.NAME}`;
    currentUpperTorsoImg.style.opacity = 1;
    if (armorPiece.SFE <= heavyArmorSkillLevel) {
      currentUpperTorsoDmgReduction.innerText = armorPiece.SFE + armorPiece.SFE;
    }
    if (armorPiece.SFE > heavyArmorSkillLevel) {
      currentUpperTorsoDmgReduction.innerText = armorPiece.SFE + heavyArmorSkillLevel;
    }
    upperTorsoWorn = true;
  }
  if (armorPiece.KIT.includes(6) && lowerTorsoWorn == false) {
    currentLowerTorsoName.innerText = `Has: ${armorPiece.NAME}`;
    currentLowerTorsoImg.style.opacity = 1;
    if (armorPiece.SFE <= heavyArmorSkillLevel) {
      currentLowerTorsoDmgReduction.innerText = armorPiece.SFE + armorPiece.SFE;
    }
    if (armorPiece.SFE > heavyArmorSkillLevel) {
      currentLowerTorsoDmgReduction.innerText = armorPiece.SFE + heavyArmorSkillLevel;
    }
    lowerTorsoWorn = true;
  }
  if (armorPiece.KIT.includes(3) && armsWorn == false) {
    currentArmsName.innerText = `Karok: ${armorPiece.NAME}`;
    currentArmsImg.style.opacity = 1;
    if (armorPiece.SFE <= heavyArmorSkillLevel) {
      currentArmsDmgReduction.innerText = armorPiece.SFE + armorPiece.SFE;
    }
    if (armorPiece.SFE > heavyArmorSkillLevel) {
      currentArmsDmgReduction.innerText = armorPiece.SFE + heavyArmorSkillLevel;
    }
    armsWorn = true;
  }
  if (armorPiece.KIT.includes(2) && leggingsWorn == false) {
    currentLeggingsName.innerText = `Lábak: ${armorPiece.NAME}`;
    currentLeggingsImg.style.opacity = 1;
    if (armorPiece.SFE <= heavyArmorSkillLevel) {
      currentLeggingsDmgReduction.innerText = armorPiece.SFE + armorPiece.SFE;
    }
    if (armorPiece.SFE > heavyArmorSkillLevel) {
      currentLeggingsDmgReduction.innerText = armorPiece.SFE + heavyArmorSkillLevel;
    }
    leggingsWorn = true;
  }
}

function ArmorDetails() {
  return (
    <>
      <div className={styles.armorDetailsWrapper}>
        <div className={styles.currentArmorDetails}>
          <div>
            <label className={styles.topPart}>Viselt páncél:</label>
            <ul id="armorList" className={styles.topPart}>
              <li id="currentHelmetLi" className={styles.armorListItem}>
                <span className={styles.currentArmorName} id="currentHelmetName">
                  Fej: Nincs
                </span>
              </li>
              <li id="currentUpperTorsoLi" className={styles.armorListItem}>
                <span className={styles.currentArmorName} id="currentUpperTorsoName">
                  Mellkas: Nincs
                </span>
              </li>
              <li id="currentLowerTorsoLi" className={styles.armorListItem}>
                <span className={styles.currentArmorName} id="currentLowerTorsoName">
                  Has: Nincs
                </span>
              </li>
              <li id="currentArmsLi" className={styles.armorListItem}>
                <span className={styles.currentArmorName} id="currentArmsName">
                  Karok: Nincs
                </span>
              </li>
              <li id="currentLeggingsLi" className={styles.armorListItem}>
                <span className={styles.currentArmorName} id="currentLeggingsName">
                  Lábak: Nincs
                </span>
              </li>
            </ul>
          </div>
          <div>
            <label className={styles.bottomPart}>MGT:</label>
            <p id="totalMgtOfArmorSet">0</p>
          </div>
        </div>
        <div id="currentArmorImg" className={styles.currentArmorImg}>
          <div id="dmgReduction" className={styles.dmgReduction}>
            SFÉ:
          </div>
          <li id="currentHelmetDmgReduction" className={styles.currentHelmetDmgReduction}>
            0
          </li>
          <li id="currentUpperTorsoDmgReduction" className={styles.currentUpperTorsoDmgReduction}>
            0
          </li>
          <li id="currentLowerTorsoDmgReduction" className={styles.currentLowerTorsoDmgReduction}>
            0
          </li>
          <li id="currentArmsDmgReduction" className={styles.currentArmsDmgReduction}>
            0
          </li>
          <li id="currentLeggingsDmgReduction" className={styles.currentLeggingsDmgReduction}>
            0
          </li>
          <img id="currentHelmetImg" className={styles.currentHelmetImg} src="./armorParts/helmetAssassin.png" />
          <img id="currentUpperTorsoImg" className={styles.currentUpperTorsoImg} src="./armorParts/upperTorsoAssassin.png" />
          <img id="currentLowerTorsoImg" className={styles.currentLowerTorsoImg} src="./armorParts/lowerTorsoAssassin.png" />
          <img id="currentArmsImg" className={styles.currentArmsImg} src="./armorParts/armsAssassin.png" />
          <img id="currentLeggingsImg" className={styles.currentLeggingsImg} src="./armorParts/leggingsAssassin.png" />
        </div>
      </div>
    </>
  );
}

export default ArmorDetails;
