import styles from '../styles/aimedAttack.module.css';
export let aimedBodyParts = [
    "bal láb",
    "jobb láb",
    "bal kar",
    "fegyverforgató kar",
    "fegyverforgató kar",
    "törzs",
    "törzs",
    "törzs",
    "törzs",
    "fej",
  ];
function AimedAttack() {

    function handleAimedAttackCheckBox() {
        
    }
    return (<>
            <div className={styles.underConstruction}>FEJLESZTÉS ALATT</div>
        <div className={styles.aimedAttackWrapper}>
            <ul id='aimedAttackList' className={styles.aimedAttackList}> Testrészek, melyeket NEM szeretnél eltalálni:
                <li><input value={1} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />Fej                    
                </li>
                <li><input value={4} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />Törzs                    
                </li>
                <li><input value={2} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />Fegyverforgató kar                    
                </li>
                <li><input value={1} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />Bal kar                    
                </li>
                <li><input value={1} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />Jobb láb                    
                </li>
                <li><input value={1} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />Bal láb                    
                </li>
            </ul>
            <div>---------------------------
                    <input value={10} onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />
                    <span>Testrésznél kisebb terület megcélzása (pl.: szem, kéz, stb..)</span>
            </div>
        </div>
        </>
    )
}

export default AimedAttack