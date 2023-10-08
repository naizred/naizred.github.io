import styles from '../styles/armordetails.module.css';
export let equippedOrNotSetToManual = false
let helmetWorn = false
let upperTorsoWorn = false
let lowerTorsoWorn = false
let armsWorn = false
let leggingsWorn = false
let currentArmorPiece
let currentHelmetMgt = 0
let currentUpperTorsoMgt = 0
let currentLowerTorsoMgt = 0
let currentArmsMgt = 0
let currentLeggingsMgt = 0
let totalMgt = 0
export function checkWhereItIsWorn(armorPiece, mgtCompensation) {
    currentArmorPiece = armorPiece
 if (armorPiece.kit.includes(10) && helmetWorn == false) {
     currentHelmetName.innerText = `Fej: ${armorPiece.nameOfArmor}`
     currentHelmetImg.style.opacity = 1
     currentHelmetDmgReduction.innerText = armorPiece.dmgReduction
     helmetWorn = true
    }
 if (armorPiece.kit.includes(8) && upperTorsoWorn == false) {
     currentUpperTorsoName.innerText = `Mellkas: ${armorPiece.nameOfArmor}`
     currentUpperTorsoImg.style.opacity = 1
     currentUpperTorsoDmgReduction.innerText = armorPiece.dmgReduction
     upperTorsoWorn = true
    }
 if (armorPiece.kit.includes(6) && lowerTorsoWorn == false) {
     currentLowerTorsoName.innerText = `Has: ${armorPiece.nameOfArmor}`
     currentLowerTorsoImg.style.opacity = 1
     currentLowerTorsoDmgReduction.innerText = armorPiece.dmgReduction
     lowerTorsoWorn = true
    }
 if (armorPiece.kit.includes(3) && armsWorn == false) {
     currentArmsName.innerText = `Karok: ${armorPiece.nameOfArmor}`
     currentArmsImg.style.opacity = 1
     currentArmsDmgReduction.innerText = armorPiece.dmgReduction
     armsWorn = true
    }
 if (armorPiece.kit.includes(2) && leggingsWorn == false) {
     currentLeggingsName.innerText = `Lábak: ${armorPiece.nameOfArmor}`
     currentLeggingsImg.style.opacity = 1
     currentLeggingsDmgReduction.innerText = armorPiece.dmgReduction
     leggingsWorn = true
    }
if (armorPiece.mgt - mgtCompensation <= 0) {
    totalMgtOfArmorSet.innerText = 0
    equippedOrNot.value = 0
} else if (armorPiece.mgt - mgtCompensation>0){
    totalMgtOfArmorSet.innerText = armorPiece.mgt - mgtCompensation
    equippedOrNot.value = armorPiece.mgt - mgtCompensation
}
}

function ArmorDetails() {
    function handleArmorOnOrOff(event) {
        equippedOrNotSetToManual = true
        if (event.target.checked == false) {
            if (currentArmorPiece.kit.includes(10)) {
                currentHelmetImg.style.opacity = 0
               }
            if (currentArmorPiece.kit.includes(8)) {
                currentUpperTorsoImg.style.opacity = 0
               }
            if (currentArmorPiece.kit.includes(6)) {
                currentLowerTorsoImg.style.opacity = 0
               }
            if (currentArmorPiece.kit.includes(3)) {
                currentArmsImg.style.opacity = 0
               }
            if (currentArmorPiece.kit.includes(2)) {
                currentLeggingsImg.style.opacity = 0
               }

                // currentHelmetImg.style.opacity = 0
                // currentUpperTorsoImg.style.opacity = 0
                // currentLowerTorsoImg.style.opacity = 0
                // currentArmsImg.style.opacity = 0
                // currentLeggingsImg.style.opacity = 0

                charAtk.value = parseFloat(charAtk.value) + parseFloat(equippedOrNot.value / 2)
                charDef.value = parseFloat(charDef.value) + parseFloat(equippedOrNot.value / 2)
                charDefWithParry.value = parseFloat(charDefWithParry.value) + parseFloat(equippedOrNot.value / 2)
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + parseFloat(equippedOrNot.value / 2)
                totalMgtOfArmorSet.innerText = 0
                currentHelmetDmgReduction.style.display = 'none'
                currentUpperTorsoDmgReduction.style.display = 'none'
                currentLowerTorsoDmgReduction.style.display = 'none'
                currentArmsDmgReduction.style.display = 'none'
                currentLeggingsDmgReduction.style.display = 'none'
            }
        if (event.target.checked == true) {
            if (currentArmorPiece.kit.includes(10)) {
                currentHelmetImg.style.opacity = 1
               }
            if (currentArmorPiece.kit.includes(8)) {
                currentUpperTorsoImg.style.opacity = 1
               }
            if (currentArmorPiece.kit.includes(6)) {
                currentLowerTorsoImg.style.opacity = 1
               }
            if (currentArmorPiece.kit.includes(3)) {
                currentArmsImg.style.opacity = 1
               }
            if (currentArmorPiece.kit.includes(2)) {
                currentLeggingsImg.style.opacity = 1
               }

                // currentHelmetImg.style.opacity = 1
                // currentUpperTorsoImg.style.opacity = 1
                // currentLowerTorsoImg.style.opacity = 1
                // currentArmsImg.style.opacity = 1
                // currentLeggingsImg.style.opacity = 1

                charAtk.value = parseFloat(charAtk.value) - parseFloat(equippedOrNot.value / 2)
                charDef.value = parseFloat(charDef.value) - parseFloat(equippedOrNot.value / 2)
                charDefWithParry.value = parseFloat(charDefWithParry.value) - parseFloat(equippedOrNot.value / 2)
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - parseFloat(equippedOrNot.value / 2)
                totalMgtOfArmorSet.innerText = equippedOrNot.value
                currentHelmetDmgReduction.style.display = 'grid'
                currentUpperTorsoDmgReduction.style.display = 'grid'
                currentLowerTorsoDmgReduction.style.display = 'grid'
                currentArmsDmgReduction.style.display = 'grid'
                currentLeggingsDmgReduction.style.display = 'grid'
            }
    }

    return (
        <>
            
        <div className={styles.armorDetailsWrapper}>
            <div className={styles.currentArmorDetails}>
                <div >
                    <label className={styles.topPart}>
                        Viselt páncél:
                    </label>
                    <ul id='armorList' className={styles.topPart}>
                            <li id='currentHelmetLi' className={styles.armorListItem}>
                                <span className={styles.currentArmorName} id='currentHelmetName'>Fej: Nincs</span>
                            </li>
                            <li id='currentUpperTorsoLi' className={styles.armorListItem}>
                                <span className={styles.currentArmorName} id='currentUpperTorsoName'>Mellkas: Nincs</span>
                            </li>
                            <li id='currentLowerTorsoLi' className={styles.armorListItem}>
                                <span className={styles.currentArmorName} id='currentLowerTorsoName'>Has: Nincs</span>
                            </li>
                            <li id='currentArmsLi' className={styles.armorListItem}>
                                <span className={styles.currentArmorName} id='currentArmsName'>Karok: Nincs</span>
                            </li>
                            <li id='currentLeggingsLi' className={styles.armorListItem}>
                                <span className={styles.currentArmorName} id='currentLeggingsName'>Lábak: Nincs</span>
                            </li>
                            <li className={styles.armorListItem}>
                                <span className={styles.currentArmorName} id=''>Fel-/Levétel</span>
                                <input id='equippedOrNot' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/>
                            </li>
                    </ul>
                </div>
                <div>
                    <label className={styles.bottomPart}>
                        MGT:
                    </label>
                    <p id='totalMgtOfArmorSet'>
                        0
                    </p>
                </div>
            </div>
                <div className={styles.currentArmorImg}>
                    <div id='dmgReduction' className={styles.dmgReduction}>SFÉ:</div>
                    <li id='currentHelmetDmgReduction' className={styles.currentHelmetDmgReduction}></li>
                    <li id='currentUpperTorsoDmgReduction' className={styles.currentUpperTorsoDmgReduction}></li>
                    <li id='currentLowerTorsoDmgReduction' className={styles.currentLowerTorsoDmgReduction}></li>
                    <li id='currentArmsDmgReduction' className={styles.currentArmsDmgReduction}></li>
                    <li id='currentLeggingsDmgReduction' className={styles.currentLeggingsDmgReduction}></li>
                        <img id='currentHelmetImg' className={styles.currentHelmetImg} src='./armorParts/helmetAssassin.png'/>
                        <img id='currentUpperTorsoImg' className={styles.currentUpperTorsoImg} src='./armorParts/upperTorsoAssassin.png'/>
                        <img id='currentLowerTorsoImg' className={styles.currentLowerTorsoImg} src='./armorParts/lowerTorsoAssassin.png'/>
                        <img id='currentArmsImg' className={styles.currentArmsImg} src='./armorParts/armsAssassin.png'/>
                        <img id='currentLeggingsImg' className={styles.currentLeggingsImg} src='./armorParts/leggingsAssassin.png'/>
            </div>
            </div>
            </>
    )
}

export default ArmorDetails