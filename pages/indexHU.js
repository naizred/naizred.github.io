import Head from "next/head";
import styles from "../styles/Home.module.css";
import prisma from "../prisma/client";
import React from "react";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";

export const getServerSideProps = async () => {
  const feed = await prisma.ttkweaponshu.findMany({
    orderBy: [
      {
        w_name: "asc",
      },
    ],
  });

  return {
    props: {
      feed: JSON.parse(JSON.stringify(feed)),
    },
  };
};

export default function Home(props) {
  let destroyerLevel = [0, 1, 2, 3];
  let professionLevel = [0, 1, 2, 3, 4, 5];
  let bodyParts = [
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

  let darkDice = 0;
  let lightDice = 0;

  function ttkRoll() {
    let result = 0;
    darkDice = Math.floor(Math.random() * 9);
    lightDice = Math.floor(Math.random() * 9);

/*   if (darkDice > lightDice) {
      result = darkDice * 10 + lightDice;
    } else if (darkDice < lightDice) {
      result = lightDice * 10 + darkDice;
    } else if (darkDice == 0 && lightDice == 0) {
      result += 100;
    } else if (darkDice == lightDice) {
      result = darkDice * 10 + lightDice;
    }
    darkDice == 0 ? (darkDice = 10) : (darkDice = darkDice);
    lightDice == 0 ? (lightDice = 10) : (lightDice = lightDice);
    return result;
  }*/
        
    /* lightDice = 10
    darkDice = 10
    -- ez a felső két sor a dobások tesztelésére van */
    
  console.log(darkDice,lightDice)
  if (darkDice > lightDice) {
    result = darkDice;

  } else if (darkDice < lightDice) {
  
    result = lightDice;
  } else if (darkDice == 0 && lightDice == 0) {
    result = 10;
  } else if (darkDice == lightDice) {
    result = darkDice;
  }    

  if (darkDice == 0) {
    darkDice = 10
  }
  if (lightDice == 0) {
    lightDice = 10
  }
    return result;
  }

  function hitChecker(lightDice) {
    return bodyParts[lightDice - 1];
  }

  async function handleClick() {
    bodyPartImg.innerHTML = "";
    charAtkSum.innerText = "";
    specialEffect.innerText = "nincs";
    rollButton.disabled = true;
    setTimeout(() => {
      rollButton.disabled = false;
    }, 3500);

    rollResult.innerText = ttkRoll();
    setTimeout(() => {
      if (charAtk.value == "") {
        charAtkSum.innerText = rollResult.innerText;
      } else {
        charAtkSum.innerText =
          parseInt(rollResult.innerText) + parseInt(charAtk.value);
      }
      charAtkSum.animate([{ opacity: "0" }, { opacity: "1" }], 1500);
    }, 3250);
    rollResult.style.opacity = "0";
    damageResult.innerText = "";
    damageResult.style.opacity = "0";
    bodyPart.innerText = "";
    bodyPart.style.opacity = "0";

    rollResult.animate([{ opacity: "0" }, { opacity: "1" }], 1500);

    setTimeout(() => {
      damageResult.animate([{ opacity: "0" }, { opacity: "1" }], 1500);
    }, 500);

    setTimeout(() => {
      bodyPart.animate([{ opacity: "0" }, { opacity: "1" }], 1500);
    }, 1000);

    setTimeout(() => {
      rollResult.style.opacity = "1";
    }, 1500);

    setTimeout(() => {
      damageResult.style.opacity = "1";
    }, 2000);

    setTimeout(() => {
      bodyPart.style.opacity = "1";
    }, 2500);

    setTimeout(() => {
      rollResult.animate([{ color: "white" }, { color: "black" }], 500);
    }, 1500);

    setTimeout(() => {
      damageResult.animate([{ color: "white" }, { color: "black" }], 500);
    }, 2000);

    setTimeout(() => {
      charAtkSum.animate([{ color: "white" }, { color: "black" }], 500);
    }, 4750);
    setTimeout(() => {
      rollButton.disabled = false;
    }, 3500);

    const specialModifiers = ["Veszítesz 3 cselekedetet", "Egy ellenfél veszít 1 cselekedetet", "Kapsz 1 cselekedetet","Kapsz 2 cselekedetet","Kapsz 3 cselekedetet"]
const specialCases1 = [2,3,4]
const specialCases2 = [5,6,7]
const specialCases3 = [8,9]

    setTimeout(() => {
      if (charAtk.value == "") {
        charAtkSum.innerText = rollResult.innerText;
      } else {
        charAtkSum.innerText =
          parseInt(rollResult.innerText) + parseInt(charAtk.value);
      }

      if (lightDice == darkDice && specialCases1.includes(darkDice)) {
        specialEffect.innerText = specialModifiers[1]
      } else if (lightDice == darkDice && specialCases2.includes(darkDice)) {
        specialEffect.innerText = specialModifiers[2]
      } else if (lightDice == darkDice && specialCases3.includes(darkDice)) {
        specialEffect.innerText = specialModifiers[3]
      } else if (lightDice == darkDice && darkDice == 1) {
        specialEffect.innerText = specialModifiers[0]
      } else if (lightDice == darkDice && darkDice == 10) {
        specialEffect.innerText = specialModifiers[4]
      }

      charAtkSum.animate([{ opacity: "0" }, { opacity: "1" }], 1500);
    }, 3250);
    rollResult.style.opacity = "0";
    damageResult.innerText = "";
    damageResult.style.opacity = "0";
    bodyPart.innerText = "";
    bodyPart.style.opacity = "0";

    rollResult.animate([{ opacity: "0" }, { opacity: "1" }], 1500);

    setTimeout(() => {
      damageResult.animate([{ opacity: "0" }, { opacity: "1" }], 1500);
    }, 500);
    setTimeout(() => {
      bodyPart.animate([{ opacity: "0" }, { opacity: "1" }], 1500);
    }, 1000);
    setTimeout(() => {
      rollResult.style.opacity = "1";
    }, 1500);
    setTimeout(() => {
      damageResult.style.opacity = "1";
    }, 2000);
    setTimeout(() => {
      bodyPart.style.opacity = "1";
    }, 2500);
    setTimeout(() => {
      rollResult.animate([{ color: "white" }, { color: "black" }], 500);
    }, 1500);
    setTimeout(() => {
      damageResult.animate([{ color: "white" }, { color: "black" }], 500);
    }, 2000);

    setTimeout(() => {
      charAtkSum.animate([{ color: "white" }, { color: "black" }], 500);
    }, 4750);

    bodyPart.innerText = hitChecker(lightDice);

    setTimeout(() => {
      let tempImg = document.createElement("img");
      tempImg.classList.add("tempImg");
      bodyPartImg.appendChild(tempImg);
      async function currentBodypart(bodypart) {
        tempImg.src = "";
        tempImg.src = `./bodyParts/${bodypart}`;
        tempImg.animate([{ opacity: "0" }, { opacity: "1" }], 600);
        setTimeout(() => {
          tempImg.style.opacity = "0";
          tempImg.animate([{ opacity: "0" }, { opacity: "1" }], 600);
        }, 600);
        setTimeout(() => {
          tempImg.style.opacity = "0";
          tempImg.animate([{ opacity: "0" }, { opacity: "1" }], 600);
          tempImg.style.opacity = "1";
        }, 1200);
      }

      if (bodyPart.innerText == "bal láb") {
        currentBodypart("LeftLeg.png");
      }
      if (bodyPart.innerText == "jobb láb") {
        currentBodypart("RightLeg.png");
      }

      if (bodyPart.innerText == "bal kar") {
        currentBodypart("LeftArm.png");
      }

      if (bodyPart.innerText == "fegyverforgató kar") {
        currentBodypart("RightArm.png");
      }

      if (bodyPart.innerText == "törzs") {
        currentBodypart("Torso.png");
      }

      if (bodyPart.innerText == "fej") {
        currentBodypart("Head.png");
      }
    }, 2550);

    setTimeout(() => {
      bodyPart.animate([{ color: "white" }, { color: "black" }], 500);
    }, 2500);

    await fetch(`../api/ttkweaponshu/${weapons.value}`)
      .then((response) => {
        console.log(response.status);
        console.log(response.ok);
        return response.json();
      })
      .then((parsedData) => {
        return parsedData.w_damage;
      })
      .then((damage) => {
        if (damage === "2k10") {
          damageResult.innerText =
            darkDice +
            lightDice +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value);
        } else if (damage === "2k5") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) +
            Math.ceil(lightDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value);
        } else if (damage === "2k5+1") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) +
            Math.ceil(lightDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value) +
            1;
        } else if (damage === "2k5+2") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) +
            Math.ceil(lightDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value) +
            2;
        } else if (damage === "1k5") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value);
        } else if (damage === "1k5+1") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value) +
            1;
        } else if (damage === "1k5+2") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value) +
            2;
        } else if (damage === "3k5") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) * 2 +
            Math.ceil(lightDice / 2) +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value);
        } else if (damage === "1k10") {
          damageResult.innerText =
            darkDice +
            parseInt(destroyerLevelSelect.value) +
            parseInt(professionLevelSelect.value);
        }
      });
  }
  const router = useRouter();

  return (
    <>
      <Head>
        <title>TTK Rolldice</title>
      </Head>

      <main className={styles.main}>
        <Navbar
          hunLink={"/indexHU"}
          engLink={"/"}
          rollHelper={"Dobássegítő"}
          manageWeapons={"Fegyverek kezelése"}
          rollHelperLink={"/indexHU"}
          manageWeaponsLink={"/manageWeaponsHU"}
        />
        <div className={styles.resultContainer}>
          <div className="result inText">A dobás eredménye</div>
          <div id="rollResult" className="result inNumber"></div>
          <div className="damage inText">A sebzés</div>
          <div id="damageResult" className="result inNumber"></div>
          <div className="damage hitCheck">A találat helye</div>
          <div id="bodyPart" className={styles.bodyPart}></div>
        </div>

        <div className={styles.weaponsContainer}>
          <label htmlFor="weapons" id="chosenWeapon">
            Választott fegyver:
          </label>
          <select id="weapons" name="weapons">
            {props.feed.map((e) => {
              return (
                <option key={e.w_id} id={e.w_damage}>
                  {e.w_name}
                </option>
              );
            })}
          </select>
          <label htmlFor="profession" id="profession">
            Képzettség foka:
          </label>
          <select id="professionLevelSelect" name="profession">
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="destroyer" id="destroyer">
            Pusztító adottság:
          </label>
          <select id="destroyerLevelSelect" name="destroyer">
            {destroyerLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="charAtk" id="charAtkLabel">
            Karakter TÉO
          </label>
          <input type="text" name="charAtk" id="charAtk" />
        </div>
        <div id="bodyPartImg"></div>
        <button
          id="rollButton"
          className={styles.rollButton}
          onClick={handleClick}
        >
          Dobj
        </button>

        <div className={styles.gifContainer}>
          <div className="result inText" id="charAtkSumText">
            Össz TÉO
          </div>
          <div id="charAtkSum" className={"result inNumber"}></div>
          <div id="specialEffectText" className="result inText">Különleges hatás:</div>
          <div id="specialEffect" className="result inText">nincs</div>
        </div>
      </main>
    </>
  );
}
