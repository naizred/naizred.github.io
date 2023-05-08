
import styles from "../styles/Home.module.css";

import React from "react";
import { useRouter } from 'next/router';

export default function manageWeapons() {
    const router = useRouter();
  let typeArray = ["RP", "HP", "ZÚZ", "ÓP", "HAS", "SZÁ", "PAJ", "ÍJ", "SZÍ"];

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
      window.location.reload();
    }, 1000);
    await fetch(endpoint, options);
  }
  return (
      <>
          <main className={styles.main}>
              <button id="manageWeaponsButton" onClick={()=>router.push('/')}>Vissza az előző oldalra</button>
      <div id="weaponsContainer" className={styles.weaponsContainer}>
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
            {damageArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="w_type" id="">
            Fegyver típusa:
          </label>
          <select name="w_type" className="newWeaponInput" id="w_type">
          {typeArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
        </form>
        <button
          type="submit"
          name="submit"
          form="addWeaponForm"
          id="addWeaponFormSubmitButton"
        >
          Elküld
        </button>
              </div>
              </main>
    </>
  );
}
