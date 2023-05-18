import styles from "../styles/Home.module.css";
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../Components/Navbar";

export default function manageWeapons() {
  const router = useRouter();
  let typeArray = ["SB", "LB", "CRS", "GB", "CHP", "PIK", "SHI", "BOW", "CRB"];

  let typeExplainArray = ["Short Blade", "Long Blade", "Crushing", "Giant Blade", "Chopping", "Pikes", "Shield", "Bow", "Crossbow"]


  let damageArray = [
    "1d2",
    "2d2",
    "1d5",
    "1d5+1",
    "1d5+2",
    "2d5",
    "2d5+1",
    "2d5+2",
    "3d5",
    "1d10",
    "2d10",
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
      <Head>
        <title>TTK Rolldice</title>
      </Head>
          <main className={styles.main}>
          <Navbar />
        <form id="addWeaponForm" onSubmit={handleWeaponSubmit}>
          <label htmlFor="w_name" id="">
            Weapon name:
          </label>
          <input
            type="text"
            name="w_name"
            className="newWeaponInput"
            id="w_name"
          />
          <label htmlFor="w_damage" id="">
            Damage:
          </label>
          <select name="w_damage" className="newWeaponInput" id="w_damage">
            {damageArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <label htmlFor="w_type" id="">
            Weapon type:
          </label>
          <select name="w_type" className="newWeaponInput" id="w_type">
            {typeArray.sort().map((e) => {
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
          Send
        </button>
          <span id="explanationTitle">Explanation of weapon types:</span>
        <div id="typeDiv">
{  typeArray.sort().map((e,i) => {
  return <span key={e}>{e} ===</span>;
            })}
        </div>
        <div id="explanationDiv">
{  typeExplainArray.sort().map((e,i) => {
  return <span key={e}>{e}</span>;
            })}
        </div>
      </main>
    </>
  );
}
