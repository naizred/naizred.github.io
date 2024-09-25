import styles from '../styles/resistancesaptitudesracemofifiers.module.css';
function ResistancesAptitudesRaceMofifiers() {
   let typesOfResistances = ["Összetett", "Fizikai", "Szellemi", "Asztrális", "Mentális", "Elkerülő"]

   function rollResistance (){
       let selectAllAttributeOptions = document.querySelectorAll(
        "select#attributes option"
      );
      console.log(selectAllAttributeOptions)
   }

    return (
        <>
        <div className={styles.ResistancesAptitudesRaceMofifiersWrapper}>
           <ul className={styles.Resistances}>Ellenállások
           <li onClick={rollResistance}>Összetett</li>
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