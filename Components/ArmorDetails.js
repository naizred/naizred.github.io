import styles from '../styles/armordetails.module.css';
let helmetWorn = false
let chestWorn = false
let armsWorn = false
let leggingsWorn = false
let currentHelmetMgt = 0
let currentChestMgt = 0
let currentArmsMgt = 0
let currentLeggingsMgt = 0
let totalMgt = 0
export function checkWhereItIsWorn(armorPiece, mgtCompensation) {
 if (armorPiece.kit.includes(10) && helmetWorn == false) {
     currentHelmetName.innerText = `Fej: ${armorPiece.nameOfArmor}`
     currentHelmetImg.style.opacity = 1
     currentHelmetMgt = Math.round((armorPiece.mgt - mgtCompensation) * (1 / 10))
     currentHelmetLi.value = currentHelmetMgt
     currentHelmetCheckBox.value = 10
     currentHelmetCheckBox.checked = true
     totalMgt += currentHelmetMgt
     helmetWorn = true
    }
 if (armorPiece.kit.includes(6) && chestWorn == false) {
     currentChestName.innerText = `Törzs: ${armorPiece.nameOfArmor}`
     currentChestImg.style.opacity = 1
     currentChestMgt = Math.ceil((armorPiece.mgt - mgtCompensation) * (4 / 10))
     currentChestLi.value = currentChestMgt
     currentChestCheckBox.value = 6
     currentChestCheckBox.checked = true
     totalMgt += currentChestMgt
     chestWorn = true
    }
 if (armorPiece.kit.includes(3) && armsWorn == false) {
     currentArmsName.innerText = `Karok: ${armorPiece.nameOfArmor}`
     currentArmsImg.style.opacity = 1
     currentArmsMgt = Math.ceil((armorPiece.mgt - mgtCompensation) * (3 / 10))
     currentArmsLi.value = currentArmsMgt
     currentArmsCheckBox.value = 3
     currentArmsCheckBox.checked = true
     totalMgt += currentArmsMgt
     armsWorn = true
    }
 if (armorPiece.kit.includes(2) && leggingsWorn == false) {
     currentLeggingsName.innerText = `Lábak: ${armorPiece.nameOfArmor}`
     currentLeggingsImg.style.opacity = 1
     currentLeggingsMgt = Math.floor((armorPiece.mgt - mgtCompensation) * (2 / 10))
     currentLeggingsLi.value = currentLeggingsMgt
     currentLeggingsCheckBox.value = 2
     currentLeggingsCheckBox.checked = true
     totalMgt += currentLeggingsMgt
     leggingsWorn = true
    }
    totalMgtOfArmorSet.innerText = totalMgt
}

function ArmorDetails() {
    function handleArmorOnOrOff(event) {

        function armorEquipper(currentPiece, currentImg, currentListItem) {
            if (event.target.value.includes(currentPiece) && currentImg.style.opacity == 1 && event.target.checked == false) {
                currentImg.style.opacity = 0
                charAtk.value = parseFloat(charAtk.value) + parseFloat(currentListItem.value / 2)
                charDef.value = parseFloat(charDef.value) + parseFloat(currentListItem.value / 2)
                charDefWithParry.value = parseFloat(charDefWithParry.value) + parseFloat(currentListItem.value / 2)
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) + parseFloat(currentListItem.value / 2)
                totalMgtOfArmorSet.innerText = parseInt(totalMgtOfArmorSet.innerText) - currentListItem.value
            }
            if (event.target.value.includes(currentPiece) && currentImg.style.opacity == 0 && event.target.checked == true) {
                currentImg.style.opacity = 1
                charAtk.value = parseFloat(charAtk.value) - parseFloat(currentListItem.value / 2)
                charDef.value = parseFloat(charDef.value) - parseFloat(currentListItem.value / 2)
                charDefWithParry.value = parseFloat(charDefWithParry.value) - parseFloat(currentListItem.value / 2)
                charDefWithEvasion.value = parseFloat(charDefWithEvasion.value) - parseFloat(currentListItem.value / 2)
                totalMgtOfArmorSet.innerText = parseInt(totalMgtOfArmorSet.innerText) + currentListItem.value
            }
        }
        if (event.target.value.includes(10)) {
            armorEquipper(10, currentHelmetImg, currentHelmetLi)
        } else if (event.target.value.includes(6)) {
            armorEquipper(6, currentChestImg, currentChestLi)
        } else if (event.target.value.includes(3)) {
            armorEquipper(3, currentArmsImg, currentArmsLi)
        } else if (event.target.value.includes(2)) {
            armorEquipper(2, currentLeggingsImg, currentLeggingsLi)
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
                            <li id='currentChestLi' className={styles.armorListItem}>
                                <input id='currentChestCheckBox' type='checkBox' onChange={handleArmorOnOrOff} className={styles.currentArmorCheckBox}/><span className={styles.currentArmorName} id='currentChestName'>Törzs: Nincs</span>
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
                        <img id='currentLeggingsImg' className={styles.currentLeggingsImg} src='./armorParts/leggingsSteel.png'/>
                        <img id='currentChestImg' className={styles.currentChestImg} src='./armorParts/chestSteel.png'/>
                        <img id='currentHelmetImg' className={styles.currentHelmetImg} src='./armorParts/helmetSteel.png'/>
                        <img id='currentArmsImg' className={styles.currentArmsImg} src='./armorParts/armsSteel.png'/>
            </div>
            </div>
            </>
    )
}

export default ArmorDetails