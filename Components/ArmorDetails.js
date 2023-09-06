import styles from '../styles/armordetails.module.css';

function ArmorDetails() {
    function handleArmorRemove(event) {
       event.target.style.opacity = 0
    }
    function handleArmorAdd(event) {
       event.target.style.opacity = 1
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
                    <p className={styles.topPart}>
                        Teljes sodronying
                    </p>
                </div>
                <div >
                    <label className={styles.topPart}>
                        Kiterjedés:
                    </label>
                    <p id='' className={styles.topPart}>
                        1-10 (teljes test)
                    </p>
                </div>
                <div>
                    <label className={styles.bottomPart}>
                        SFÉ:
                    </label>
                    <p>
                        3
                    </p>
                </div>
                <div>
                    <label className={styles.bottomPart}>
                        MGT:
                    </label>
                    <p>
                        4
                    </p>
                </div>
            </div>
                <div className={styles.currentArmorImg}>
                        {/* <img className={styles.currentArmorPartImg} src='./armorParts/chestArmorSteel.png' onClick={handleArmorRemove} onDoubleClick={handleArmorAdd}/> */}
            </div>
            </div>
            </>
    )
}

export default ArmorDetails