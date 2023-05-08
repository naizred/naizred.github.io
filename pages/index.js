import Head from "next/head";
import styles from "../styles/Home.module.css";
import prisma from "../prisma/client";
import React from "react";

export const getServerSideProps = async () => {
  
  const feed = await prisma.ttkweapons.findMany();

  return {
    props: {
      feed: JSON.parse(JSON.stringify(feed)),
    },
  };
};

export default function Home(props) {
  let destroyerLevel = [0, 1, 2, 3]
  let professionLevel = [0,1,2,3,4,5]
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

    if (darkDice > lightDice) {
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
  }

  function hitChecker(lightDice) {
    return bodyParts[lightDice - 1];
  }

  async function handleClick() {
    bodyPartImg.innerHTML = "";
    charAtkSum.innerText = "";
    rollButton.disabled = true;
    setTimeout(() => {
      rollButton.disabled = false;
    }, 3500);

    rollResult.innerText = ttkRoll();
    setTimeout(() => {
      if (charAtk.value == "") {
        charAtkSum.innerText = "";
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

    rollResult.innerText = ttkRoll();
    setTimeout(() => {
      if (charAtk.value == "") {
        charAtkSum.innerText = "";
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

    bodyPart.innerText = hitChecker(lightDice);

    setTimeout(() => {
      let tempImg = document.createElement("img");
      tempImg.classList.add("tempImg");
      bodyPartImg.appendChild(tempImg);
      if (bodyPart.innerText == "bal láb") {
        tempImg.src = "";
        tempImg.src = "./bodyParts/LeftLeg.png";
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

      if (bodyPart.innerText == "jobb láb") {
        tempImg.src = "";
        tempImg.src = "./bodyParts/RightLeg.png";
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

      if (bodyPart.innerText == "bal kar") {
        tempImg.src = "";
        tempImg.src = "./bodyParts/LeftArm.png";
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

      if (bodyPart.innerText == "fegyverforgató kar") {
        tempImg.src = "";
        tempImg.src = "./bodyParts/RightArm.png";
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

      if (bodyPart.innerText == "törzs") {
        tempImg.src = "";
        tempImg.src = "./bodyParts/Torso.png";
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

      if (bodyPart.innerText == "fej") {
        tempImg.src = "";
        tempImg.src = "./bodyParts/Head.png";
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
    }, 2550);

    setTimeout(() => {
      bodyPart.animate([{ color: "white" }, { color: "black" }], 500);
    }, 2500);

    console.log(destroyerLevelSelect.value)
console.log(parseInt(destroyerLevelSelect.value));


       await fetch(`../api/ttkweapons/${weapons.value}`)
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
          damageResult.innerText = darkDice + lightDice + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value);
        } else if (damage === "2k5") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) + Math.ceil(lightDice / 2) + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value);
        } else if (damage === "2k5+1") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) + Math.ceil(lightDice / 2) + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value) + 1;
        } else if (damage === "k5+1") {
          damageResult.innerText = Math.ceil(darkDice / 2) + 1 + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value);
        } else if (damage === "3k5") {
          damageResult.innerText =
            Math.ceil(darkDice / 2) * 2 + Math.ceil(lightDice / 2) + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value);
        } else if (damage === "k5") {
          damageResult.innerText = Math.ceil(darkDice / 2) + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value);
        } else if (damage === "k10") {
          damageResult.innerText = darkDice + parseInt(destroyerLevelSelect.value) + parseInt(professionLevelSelect.value);
        }
      });
  }

  function handleWeaponAdd() {
    let typeArray = ["RP", "HP", "ZÚZ", "ÓP", "HAS", "SZÁ", "PAJ", "ÍJ", "SZÍ"];
    typeArray.forEach((element) => {
      let typeOption = document.createElement("option");
      typeOption.innerText = element;
      w_type.appendChild(typeOption);
    });

    let damageArray = [
      "k2",
      "2k2",
      "k5",
      "k5+1",
      "k5+2",
      "2k5",
      "2k5+1",
      "2k5+2",
      "3k5",
      "k10",
      "2k10",
    ];
    damageArray.forEach((element) => {
      let damageOption = document.createElement("option");
      damageOption.innerText = element;
      w_damage.appendChild(damageOption);
    });

    addWeaponForm.animate([{ height: "0" }, { height: "140px" }], 1000);
    addWeaponForm.animate([{ fontSize: "0" }, { fontSize: "18px" }], 1000);

    addWeaponButton.disabled = true;
    let newWeaponInput = document.querySelectorAll(".newWeaponInput");
    for (let i = 0; i < newWeaponInput.length; i++) {
      newWeaponInput[i].animate([{ height: "0" }, { height: "20px" }], 1000);
      newWeaponInput[i].style.margin = "2px";
      newWeaponInput[i].style.display = "inlineBlock";
      newWeaponInput[i].style.height = "20px";
      newWeaponInput[i].style.border = "1px solid black";
    }

    addWeaponForm.style.height = "140px";
    addWeaponForm.style.fontSize = "18px";

    setTimeout(() => {
      weaponsContainer.removeChild(addWeaponButton);
    }, 2000);

    setTimeout(() => {
      weaponsContainer.appendChild(addWeaponFormSubmitButton);
      addWeaponFormSubmitButton.style.display = "grid";
    }, 100);
  }
  async function handleWeaponSubmit(event) {
    event.preventDefault();

    const data = {
      w_name: event.target.w_name.value,
      w_damage: event.target.w_damage.value,
      w_type: event.target.w_type.value,
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = "../api/addNewWeapon";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    setTimeout(() => {
      window.location.reload()
    }, 1000); 
    await fetch(endpoint, options)
  }

  return (
    <div>
      <Head>
        <title>TTK Rolldice</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.resultContainer}>
          <div className="result inText">A dobás eredménye</div>
          <div id="rollResult" className="result inNumber"></div>
          <div className="damage inText">A sebzés</div>
          <div id="damageResult" className="result inNumber"></div>
          <div className="damage hitCheck">A találat helye</div>
          <div id="bodyPart" className={styles.bodyPart}></div>
        </div>
        <div id="weaponsContainer" className={styles.weaponsContainer}>
          <button id="addWeaponButton" onClick={handleWeaponAdd}>
            Új fegyver hozzáadása
          </button>
          <form id="addWeaponForm" onSubmit={handleWeaponSubmit}>
            <label htmlFor="w_name" id="">
              Fegyver neve:
            </label>
            <input
              type="text"
              name="w_name"
              className="newWeaponInput"
              id="w_name"
              placeholder="pl. Slan kard"
            />
            <label htmlFor="w_damage" id="">
              Sebzéskód:
            </label>
            <select name="w_damage" className="newWeaponInput" id="w_damage">
              <option value="">Válassz Sebzéskódot!</option>
            </select>
            <label htmlFor="w_type" id="">
              Fegyver típusa:
            </label>
            <select name="w_type" className="newWeaponInput" id="w_type">
              <option value="">Válassz típust!</option>
            </select>
          </form>
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
          <select id="professionLevelSelect" name="profession">{professionLevel.map((e) => {
            return (<option>{e}</option>)
          })}</select>
          <label htmlFor="destroyer" id="destroyer">
            Pusztító adottság:
                  </label>
          <select id="destroyerLevelSelect" name="destroyer">{destroyerLevel.map((e) => {
            return (<option>{e}</option>)
          }) }</select> 
          <button
            type="submit"
            name="submit"
            form="addWeaponForm"
            id="addWeaponFormSubmitButton"
          >
            Elküld
          </button>
        </div>

        <div id="bodyPartImg"></div>
        <div className="welcomeUser"></div>

        <div className="charStats">
          <label htmlFor="charAtk">Karakter TÉ</label>
          <input type="text" name="charAtk" id="charAtk" />
        </div>
        <button
          id="rollButton"
          className={styles.rollButton}
          onClick={handleClick}
        >
          Dobj!
        </button>

        <div className={styles.gifContainer}>
          <div className="result inText" id="charAtkSumText">
            Össz TÉ
          </div>
          <div id="charAtkSum" className={"result inNumber"}></div>
        </div>
        {/* <img src="" alt="" className="gifContainer"/> */}
      </main>
    </div>
  );
}
