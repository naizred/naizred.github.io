import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { PrismaClient } from '@prisma/client'


export const getStaticProps = async () => {
  const prisma = new PrismaClient()
  const feed = await prisma.ttkweapons.findMany();

  return {
    props: {
      feed:JSON.parse(JSON.stringify(feed))
    }
  };
};

export default function Home(props) {
  return (
    <div>
      <Head>
        <title>TTK Rolldice</title>
    <link rel="icon" type="icon" href="/dice.png"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet"></link>
        
      </Head>

      <main>
      
    <div className={styles.weaponsContainer}>
        <button id="addWeaponButton">Új fegyver hozzáadása</button>
        <form id="addWeaponForm" action="">
            <label for="w_name" id="">Fegyver neve:</label>
            <input type="text" name="w_name" class="newWeaponInput" id="w_name" placeholder="pl. Slan kard"/>
            <label for="w_damage" id="">Sebzéskód:</label>
            <input type="text" name="w_damage" class="newWeaponInput" id="w_damage" placeholder="pl. 3k5"/>
            <label for="w_type" id="">Fegyver típusa:</label>
            <select name="w_type" class="newWeaponInput" id="w_type" placeholder="pl. HP">
                <option value="">Válassz típust!</option>
            </select>
        </form>
        <button type="submit" name="submit" form="addWeaponForm" id="addWeaponFormSubmitButton">Elküld</button>
        <label for="weapons" id="chosenWeapon">Választott fegyver:</label>
          <select id="weapons" name="weapons">
          {props.feed.map((e) => {
                return <option id={e.w_id}>{e.w_name}</option>;
              })}
           {/*  <option value="">Válassz fegyvert:</option> */}
        </select>
        <label for="characters" id="chosenCharacter">Választott karakter:</label>
        <select id="characters" name="characters">
        </select>
    </div>
      </main>
    </div>
  )
}
