import styles from '../styles/resistancesaptitudesracemofifiers.module.css';
import { selectAllAttributeOptions } from '../pages';
function ResistancesAptitudesRaceMofifiers() {
   let typesOfResistances = ["Összetett", "Fizikai", "Szellemi", "Asztrális", "Mentális", "Elkerülő"]

   let evasiveResist = selectAllAttributeOptions
   

    return (
        <>
        <div className={styles.ResistancesAptitudesRaceMofifiersWrapper}>
           <ul className={styles.Resistances}>Ellenállások
           <li onClick={console.log(selectAllAttributeOptions)}>Összetett</li>
           <li>Fizikai</li>
           <li>Szellemi</li>
           <li>Asztrális</li>
           <li>Mentális</li>
           <li>Elkerülő</li>
           </ul>
           <ul className={styles.Aptitudes}>Adottságok</ul>
           <ul className={styles.RaceMofifiers}>Faji módosítók</ul>
            </div>
            </>
    )
}

export default ResistancesAptitudesRaceMofifiers