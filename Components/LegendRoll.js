import styles from '../styles/legendroll.module.css';
import { generator } from '../pages';

function LegendRoll() {
    function handleTenSidedDiceRoll() {
        tenSidedDiceRollResult.innerText = ""
        tenSidedDiceRollResult.innerText = Math.floor(generator.random() * 10);
        tenSidedDiceRollResult.animate([{color: "white"}, {color:"black"}],200)
    }
    return (
        <div className={styles.legendRollWrapper}>
            <div>
                k10-es dobókocka
            </div>
            <button onClick={handleTenSidedDiceRoll}>Dobj</button>
            <p id='tenSidedDiceRollResult'></p>
        </div>
    )
}

export default LegendRoll