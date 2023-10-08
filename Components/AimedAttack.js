import styles from '../styles/aimedAttack.module.css';
import { defaultCharAtkValue, fileFirstLoaded } from '../pages';
export let bodyParts = [
    "Bal láb",
    "Jobb láb",
    "Bal kar",
    "Fegyverforgató kar",
    "Fegyverforgató kar",
    "Törzs",
    "Törzs",
    "Törzs",
    "Törzs",
    "Fej",
];
  
function AimedAttack() {
    function handleAimedAttackRadioButton(event) {
        if (fileFirstLoaded == true) {
            event.target.checked = false
            return
        }
        charAtk.value = defaultCharAtkValue
        aimedAttackBodyPartCheckBox.checked = false
        bodyParts = [];

        for (let i = 0; i < 10; i++) {
            if (event.target.parentElement.innerText == 'Mégsem célzok') {
                bodyParts = [
                    "Bal láb",
                    "Jobb láb",
                    "Bal kar",
                    "Fegyverforgató kar",
                    "Fegyverforgató kar",
                    "Törzs",
                    "Törzs",
                    "Törzs",
                    "Törzs",
                    "Fej",
                ];
                break
            }
            bodyParts.push(event.target.parentElement.innerText)           
        }
        charAtk.value = parseFloat(charAtk.value) - ((10 - event.target.value) / 2)
        console.log(bodyParts)
    }
    function handleAimedAttackCheckBox(event) {
        if (fileFirstLoaded == true) {
            event.target.checked = false
            return
        }
        charAtk.value = defaultCharAtkValue
        bodyParts = [];
        let allAimedBodyParts = document.querySelectorAll('ul#aimedAttackList li input')
        for (let i = 0; i < allAimedBodyParts.length; i++) {
         allAimedBodyParts[i].checked = false      
        }
        for (let i = 0; i < 10; i++) {
            bodyParts.push('Testrésznél kisebb terület')            
        }
        if (event.target.checked == true) {
            charAtk.value = parseFloat(charAtk.value) - 5    
        } else if (event.target.checked == false) {
            charAtk.value = defaultCharAtkValue
        }
        
    }
    return (<>
            <div className={styles.underConstruction}>FEJLESZTÉS ALATT</div>
        <div className={styles.aimedAttackWrapper}>Megcélzott testrész:
            <ul id='aimedAttackList' className={styles.aimedAttackList}>
                <li><input defaultValue={1} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Fej                    
                </li>
                <li><input defaultValue={4} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Törzs                    
                </li>
                <li><input defaultValue={2} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Fegyverforgató kar                    
                </li>
                <li><input defaultValue={1} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Bal kar                    
                </li>
                <li><input defaultValue={1} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Jobb láb                    
                </li>
                <li><input defaultValue={1} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Bal láb                    
                </li>
                <li><input defaultValue={10} onClick={handleAimedAttackRadioButton} className={styles.aimedAttackBodyPartRadioButton} name='aimedAttackBodyPartRadioButton' type='radio' />Mégsem célzok                    
                </li>
            </ul>
            <div>
                    <input id='aimedAttackBodyPartCheckBox' onClick={handleAimedAttackCheckBox} className={styles.aimedAttackBodyPartCheckBox} type='checkBox' />
                    <span>Testrésznél kisebb terület megcélzása (pl.: szem, kéz, stb..)</span>
            </div>
        </div>
        </>
    )
}

export default AimedAttack