import styles from '../styles/armordetails.module.css';

function ArmorDetails() {
    return (
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
            </div>
        </div>
    )
}

export default ArmorDetails