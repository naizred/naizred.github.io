import styles from '../styles/armordetails.module.css';
let helmetWorn = false
let upperTorsoWorn = false
let lowerTorsoWorn = false
let armsWorn = false
let leggingsWorn = false
let currentHelmetMgt = 0
let currentUpperTorsoMgt = 0
let currentLowerTorsoMgt = 0
let currentArmsMgt = 0
let currentLeggingsMgt = 0
let totalMgt = 0
export function checkWhereItIsWorn(armorPiece, mgtCompensation, extentOfCurrentArmorSet, armorSetMgt) {
 if (armorPiece.kit.includes(10) && helmetWorn == false) {
     currentHelmetName.innerText = `Fej: ${armorPiece.nameOfArmor}`
     currentHelmetImg.style.opacity = 1
     currentHelmetMgt = ((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 1 / extentOfCurrentArmorSet)
     console.log((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 1 / extentOfCurrentArmorSet)
     if (currentHelmetMgt <= 0) {
        currentHelmetMgt = 0
     }
     currentHelmetLi.value = parseFloat(currentHelmetMgt)
     currentHelmetCheckBox.value = 10
     currentHelmetCheckBox.checked = true
     currentHelmetDmgReduction.innerText = armorPiece.dmgReduction
     totalMgt += currentHelmetMgt
     helmetWorn = true
    }
 if (armorPiece.kit.includes(8) && upperTorsoWorn == false) {
     currentUpperTorsoName.innerText = `Mellkas: ${armorPiece.nameOfArmor}`
     currentUpperTorsoImg.style.opacity = 1
     currentUpperTorsoMgt = ((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 2 / extentOfCurrentArmorSet)
     console.log((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 2 / extentOfCurrentArmorSet)

     if (currentUpperTorsoMgt <= 0) {
        currentUpperTorsoMgt = 0
     }
     currentUpperTorsoLi.value = parseFloat(currentUpperTorsoMgt)
     currentUpperTorsoCheckBox.value = 8
     currentUpperTorsoCheckBox.checked = true
     currentUpperTorsoDmgReduction.innerText = armorPiece.dmgReduction
     totalMgt += currentUpperTorsoMgt
     upperTorsoWorn = true
    }
 if (armorPiece.kit.includes(6) && lowerTorsoWorn == false) {
     currentLowerTorsoName.innerText = `Has: ${armorPiece.nameOfArmor}`
     currentLowerTorsoImg.style.opacity = 1
     currentLowerTorsoMgt = ((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 2 / extentOfCurrentArmorSet)
     console.log((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 2 / extentOfCurrentArmorSet)
     if (currentLowerTorsoMgt <= 0) {
        currentLowerTorsoMgt = 0
     }
     currentLowerTorsoLi.value = parseFloat(currentLowerTorsoMgt)
     currentLowerTorsoCheckBox.value = 6
     currentLowerTorsoCheckBox.checked = true
     currentLowerTorsoDmgReduction.innerText = armorPiece.dmgReduction
     totalMgt += currentLowerTorsoMgt
     lowerTorsoWorn = true
    }
 if (armorPiece.kit.includes(3) && armsWorn == false) {
     currentArmsName.innerText = `Karok: ${armorPiece.nameOfArmor}`
     currentArmsImg.style.opacity = 1
     currentArmsMgt = ((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 3 / extentOfCurrentArmorSet)
     console.log((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) *3 / extentOfCurrentArmorSet)
     if (currentArmsMgt <= 0) {
        currentArmsMgt = 0
     }
     currentArmsLi.value = parseFloat(currentArmsMgt)
     currentArmsCheckBox.value = 3
     currentArmsCheckBox.checked = true
     currentArmsDmgReduction.innerText = armorPiece.dmgReduction
     totalMgt += currentArmsMgt
     armsWorn = true
    }
 if (armorPiece.kit.includes(2) && leggingsWorn == false) {
     currentLeggingsName.innerText = `Lábak: ${armorPiece.nameOfArmor}`
     currentLeggingsImg.style.opacity = 1
     currentLeggingsMgt = ((armorPiece.materialIndex * armorPiece.kit.length - mgtCompensation) * 2 / extentOfCurrentArmorSet)
     if (currentLeggingsMgt <= 0) {
        currentLeggingsMgt = 0
     }
     currentLeggingsLi.value = parseFloat(currentLeggingsMgt)
     currentLeggingsCheckBox.value = 2
     currentLeggingsCheckBox.checked = true
     currentLeggingsDmgReduction.innerText = armorPiece.dmgReduction
     totalMgt += currentLeggingsMgt
     leggingsWorn = true
    }
    totalMgtOfArmorSet.innerText = totalMgt
}

function ArmorDetails() {
    function handleArmorOnOrOff(event) {

        function armorEquipper(currentPiece, currentImg, currentListItem, currentDmgReductionId) {
            if (event.target.value.includes(currentPiece) && currentImg.style.opacity == 1 && event.target.checked == false) {
                currentImg.style.opacity = 0
                charAtk.value = parseFloat(charAtk.value) + parseFloat(currentListItem.value / 2)
                charDef.value = parseFloat(charDef.value) + parseFloat(currentListItem.value / 2)
                charDefWithParry.value = parseFloat(charDefWithParry.value) + parseFloat(currentListItem.value / 2)
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + parseFloat(currentListItem.value / 2)
                totalMgtOfArmorSet.innerText = parseInt(totalMgtOfArmorSet.innerText) - currentListItem.value
                currentDmgReductionId.style.display = 'none'
            }
            if (event.target.value.includes(currentPiece) && currentImg.style.opacity == 0 && event.target.checked == true) {
                currentImg.style.opacity = 1
                charAtk.value = parseFloat(charAtk.value) - parseFloat(currentListItem.value / 2)
                charDef.value = parseFloat(charDef.value) - parseFloat(currentListItem.value / 2)
                charDefWithParry.value = parseFloat(charDefWithParry.value) - parseFloat(currentListItem.value / 2)
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - parseFloat(currentListItem.value / 2)
                totalMgtOfArmorSet.innerText = parseInt(totalMgtOfArmorSet.innerText) + currentListItem.value
                currentDmgReductionId.style.display = 'grid'
            }
        }
        if (event.target.value.includes(10)) {
            armorEquipper(10, currentHelmetImg, currentHelmetLi, currentHelmetDmgReduction)
        } else if (event.target.value.includes(8)) {
            armorEquipper(8, currentUpperTorsoImg, currentUpperTorsoLi, currentUpperTorsoDmgReduction)
        } else if (event.target.value.includes(6)) {
            armorEquipper(6, currentLowerTorsoImg, currentLowerTorsoLi, currentLowerTorsoDmgReduction)
        } else if (event.target.value.includes(3)) {
            armorEquipper(3, currentArmsImg, currentArmsLi, currentArmsDmgReduction)
        } else if (event.target.value.includes(2)) {
            armorEquipper(2, currentLeggingsImg, currentLeggingsLi, currentLeggingsDmgReduction)
        }
    }

    return (
        <>
            <div className={styles.underConstruction}>FEJLESZTÉS ALATT</div>
        <div className={styles.armorDetailsWrapper}>
            <div className={styles.currentArmorDetails}>
                <div >
                    <label className={styles.topPart}>
                        Viselt páncél:
                    </label>
                    <ul id='armorList' className={styles.topPart}>
                            <li id='currentHelmetLi' className={styles.armorListItem}>
                                <input id='currentHelmetCheckBox' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/><span className={styles.currentArmorName} id='currentHelmetName'>Fej: Nincs</span>
                            </li>
                            <li id='currentUpperTorsoLi' className={styles.armorListItem}>
                                <input id='currentUpperTorsoCheckBox' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/><span className={styles.currentArmorName} id='currentUpperTorsoName'>Mellkas: Nincs</span>
                            </li>
                            <li id='currentLowerTorsoLi' className={styles.armorListItem}>
                                <input id='currentLowerTorsoCheckBox' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/><span className={styles.currentArmorName} id='currentLowerTorsoName'>Has: Nincs</span>
                            </li>
                            <li id='currentArmsLi' className={styles.armorListItem}>
                                <input id='currentArmsCheckBox' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/><span className={styles.currentArmorName} id='currentArmsName'>Karok: Nincs</span>
                            </li>
                            <li id='currentLeggingsLi' className={styles.armorListItem}>
                                <input id='currentLeggingsCheckBox' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/><span className={styles.currentArmorName} id='currentLeggingsName'>Lábak: Nincs</span>
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