import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { PrismaClient } from '@prisma/client'
import React from "react";

/*  export const getStaticProps = async () => {
  const prisma = new PrismaClient()
  const feed = await prisma.ttkweapons.findMany();

  return {
    props: {
      feed:JSON.parse(JSON.stringify(feed))
    }
  };
};  */

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
    damageResult.innerText = darkDice
    bodyPart.innerText = hitChecker(lightDice)

    setTimeout(() => {
        let tempImg = document.createElement('img')
        tempImg.classList.add('tempImg')
        bodyPartImg.appendChild(tempImg)
        if (bodyPart.innerText == "bal láb") {
            tempImg.src = ''
            tempImg.src = './bodyParts/LeftLeg.png'
            tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            }, 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
                tempImg.style.opacity = '1'
            }, 1200);
        }

        if (bodyPart.innerText == "jobb láb") {
            tempImg.src = ''
            tempImg.src = './bodyParts/RightLeg.png'
            tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            }, 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
                tempImg.style.opacity = '1'
            }, 1200);
        }

        if (bodyPart.innerText == "bal kar") {
            tempImg.src = ''
            tempImg.src = './bodyParts/LeftArm.png'
            tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            }, 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
                tempImg.style.opacity = '1'
            }, 1200);
        }

        if (bodyPart.innerText == "fegyverforgató kar") {
            tempImg.src = ''
            tempImg.src = './bodyParts/RightArm.png'
            tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            }, 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
                tempImg.style.opacity = '1'
            }, 1200);
        }

        if (bodyPart.innerText == "törzs") {
            tempImg.src = ''
            tempImg.src = './bodyParts/Torso.png'
            tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            }, 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
                tempImg.style.opacity = '1'
            }, 1200);
        }

        if (bodyPart.innerText == "fej") {
            tempImg.src = ''
            tempImg.src = './bodyParts/Head.png'
            tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
            }, 600);
            setTimeout(() => {
                tempImg.style.opacity = '0'
                tempImg.animate([{ opacity: '0' }, { opacity: '1' }], 600);
                tempImg.style.opacity = '1'
            }, 1200);
        }
    }, 2550);


    setTimeout(() => {
        //bodyPart.animate([{textShadow:'0px 0px 200px black'},{textShadow:'0px 0px 1px black'}], 500);
        bodyPart.animate([{ color: 'white' }, { color: 'black' }], 500);
    }, 2500);
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

      <>
        
        <div className={styles.resultContainer}>
        <div className="result inText">A dobás eredménye</div>
        <div id="rollResult" className="result inNumber"></div>
        <div className="damage inText">A sebzés</div>
        <div id="damageResult" className="result inNumber"></div>
        <div className="damage hitCheck">A találat helye</div>
        <div id="bodyPart" className={styles.bodyPart}></div>
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
        
        <label htmlFor="characters" id="chosenCharacter">Választott karakter:</label>
        <select id="characters" name="characters">
          </select>
          </div> */}
    {/*     <label  htmlFor="weapons" id="chosenWeapon">Választott fegyver:</label>
          <select id="weapons" name="weapons">
          {props.feed.map((e) => {
                return <option id={e.w_id}>{e.w_name}</option>;
              })}
                    </select> */}
          <div id="bodyPartImg"></div>
          <div className="welcomeUser"></div>

 <div className="charStats">
    <label htmlFor="charStr">Karakter erő</label>
    <input type="text" name="charStr" id="charStr"/>
    <label htmlFor="charAtk">Karakter TÉ</label>
    <input type="text" name="charAtk" id="charAtk"/>
</div> 
<button id="rollButton" className={styles.rollButton} onClick={handleClick}>Dobj!</button>

<div className="result inText" id="charAtkSumText">Össz TÉ</div>
<div id="charAtkSum" className="result inNumber"></div>

{/* <img src="" alt="" className="gifContainer"/> */}
      </>
    </div>
  )
}
