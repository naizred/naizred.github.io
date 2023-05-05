import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { PrismaClient } from '@prisma/client'


/* export const getStaticProps = async () => {
  const prisma = new PrismaClient()
  const feed = await prisma.ttkweapons.findMany();

  return {
    props: {
      feed:JSON.parse(JSON.stringify(feed))
    }
  };
}; */

export default function Home(props) {
  let bodyParts = ["bal láb", "jobb láb", "bal kar", "fegyverforgató kar", "fegyverforgató kar", "törzs", "törzs", "törzs", "törzs", "fej"];

let darkDice = 0
let lightDice = 0

function ttkRoll() {
    let result = 0;
    darkDice = Math.floor(Math.random() * 9);
    lightDice = Math.floor(Math.random() * 9);

    if (darkDice > lightDice) {
        result = darkDice * 10 + lightDice
    } else if (darkDice < lightDice) {
        result = lightDice * 10 + darkDice
    } else if (darkDice == 0 && lightDice == 0) {
        result += 100
    } else if (darkDice == lightDice) {
        result = darkDice * 10 + lightDice
    }
    darkDice == 0 ? darkDice = 10 : darkDice = darkDice
    lightDice == 0 ? lightDice = 10 : lightDice = lightDice
    return result
}

function hitChecker(lightDice) {
    return bodyParts[lightDice - 1]
}
  
  function handleClick() {
    bodyPartImg.innerHTML = ""
    charAtkSum.innerText = ''
    rollButton.disabled = true
    setTimeout(() => {
      rollButton.disabled = false
  }, 3500);

  rollResult.innerText = ttkRoll()
  setTimeout(() => {
      if (charAtk.value == ''){charAtkSum.innerText=''} else {
      charAtkSum.innerText = parseInt(rollResult.innerText) + parseInt(charAtk.value)
  }
      charAtkSum.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
  }, 3250); 
  rollResult.style.opacity = '0'
  damageResult.innerText = ''
  damageResult.style.opacity = '0'
  bodyPart.innerText = ''
  bodyPart.style.opacity = '0'
  /*  function flashEffect500(element){element.animate([{ color: 'white' }, { color: 'black' }], 500);}
   function animateOpacity1500(element){element.animate([{ opacity: '0' }, { opacity: '1' }], 1500);}
   animateOpacity1500(rollResult) */
  rollResult.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
  // function timeoutSetter(functionToTimeout, timeOut){setTimeout(()=>{functionToTimeout},timeOut)}

  // timeoutSetter(animateOpacity1500(damageResult),500)
  setTimeout(() => {
      damageResult.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
  }, 500);
  // timeoutSetter(animateOpacity1500(bodyPart),1000)
  setTimeout(() => {
      bodyPart.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
  }, 1000);
  //timeoutSetter((rollResult.style.opacity = '1'),1500)
  setTimeout(() => {
      rollResult.style.opacity = '1'
  }, 1500);
  //timeoutSetter((damageResult.style.opacity = '1'),2000)
  setTimeout(() => {
      damageResult.style.opacity = '1'
  }, 2000);
  //timeoutSetter((bodyPart.style.opacity = '1'),2500)
  setTimeout(() => {
      bodyPart.style.opacity = '1'
  }, 2500);
  //timeoutSetter(flashEffect500(rollResult),1500)
  setTimeout(() => {
      rollResult.animate([{ color: 'white' }, { color: 'black' }], 500);
  }, 1500);
  //timeoutSetter(flashEffect500(damageResult),2000)
  setTimeout(() => {
      damageResult.animate([{ color: 'white' }, { color: 'black' }], 500);
  }, 2000);

  setTimeout(() => {
      charAtkSum.animate([{ color: 'white' }, { color: 'black' }], 500);
  }, 4750);
  setTimeout(() => {
    rollButton.disabled = false
}, 3500);

rollResult.innerText = ttkRoll()
setTimeout(() => {
    if (charAtk.value == ''){charAtkSum.innerText=''} else {
    charAtkSum.innerText = parseInt(rollResult.innerText) + parseInt(charAtk.value)
}
    charAtkSum.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
}, 3250); 
rollResult.style.opacity = '0'
damageResult.innerText = ''
damageResult.style.opacity = '0'
bodyPart.innerText = ''
bodyPart.style.opacity = '0'

rollResult.animate([{ opacity: '0' }, { opacity: '1' }], 1500);

setTimeout(() => {
    damageResult.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
}, 500);
setTimeout(() => {
    bodyPart.animate([{ opacity: '0' }, { opacity: '1' }], 1500);
}, 1000);
setTimeout(() => {
    rollResult.style.opacity = '1'
}, 1500);
setTimeout(() => {
    damageResult.style.opacity = '1'
}, 2000);
setTimeout(() => {
    bodyPart.style.opacity = '1'
}, 2500);
setTimeout(() => {
    rollResult.animate([{ color: 'white' }, { color: 'black' }], 500);
}, 1500);
setTimeout(() => {
    damageResult.animate([{ color: 'white' }, { color: 'black' }], 500);
}, 2000);

setTimeout(() => {
    charAtkSum.animate([{ color: 'white' }, { color: 'black' }], 500);
}, 4750);
}
  return (
    <div>
      <Head>
        <title>TTK Rolldice</title>
    <link rel="icon" type="icon" href="/dice.png"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
    <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet"></link>
        
      </Head>

      <main>
        <div className={styles.resultContainer}>
        <div class="result inText">A dobás eredménye</div>
        <div id="rollResult" class="result inNumber"></div>
        <div class="damage inText">A sebzés</div>
        <div id="damageResult" class="result inNumber"></div>
        <div class="damage hitCheck">A találat helye</div>
        <div id="bodyPart"></div>
    </div>
 {/*    <div className={styles.weaponsContainer}>
        <button id="addWeaponButton">Új fegyver hozzáadása</button>
        <form id="addWeaponForm" action="">
            <label htmlFor="w_name" id="">Fegyver neve:</label>
            <input type="text" name="w_name" class="newWeaponInput" id="w_name" placeholder="pl. Slan kard"/>
            <label htmlFor="w_damage" id="">Sebzéskód:</label>
            <input type="text" name="w_damage" class="newWeaponInput" id="w_damage" placeholder="pl. 3k5"/>
            <label htmlFor="w_type" id="">Fegyver típusa:</label>
            <select name="w_type" class="newWeaponInput" id="w_type" placeholder="pl. HP">
                <option value="">Válassz típust!</option>
            </select>
        </form>
        <button type="submit" name="submit" form="addWeaponForm" id="addWeaponFormSubmitButton">Elküld</button>
        <label htmlFor="weapons" id="chosenWeapon">Választott fegyver:</label>
          <select id="weapons" name="weapons">
          {props.feed.map((e) => {
                return <option id={e.w_id}>{e.w_name}</option>;
              })}
            <option value="">Válassz fegyvert:</option> 
        </select>
        <label htmlFor="characters" id="chosenCharacter">Választott karakter:</label>
        <select id="characters" name="characters">
          </select>
          </div> */}
          <div id="bodyPartImg"></div>
          <div class="welcomeUser"></div>

 <div class="charStats">
    <label for="charStr">Karakter erő</label>
    <input type="text" name="charStr" id="charStr"/>
    <label for="charAtk">Karakter TÉ</label>
    <input type="text" name="charAtk" id="charAtk"/>
</div> 
<button id="rollButton" className={styles.rollButton} onClick={handleClick}>Dobj!</button>

<div class="result inText" id="charAtkSumText">Össz TÉ</div>
<div id="charAtkSum" class="result inNumber"></div>

<img src="" alt="" class="gifContainer"/>
    
      </main>
    </div>
  )
}
