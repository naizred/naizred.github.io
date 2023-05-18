import styles from "../styles/Home.module.css";
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../Components/Navbar";

export default function manageWeapons() {
  const router = useRouter();
  let typeArray = ["RP", "HP", "ZÚZ", "ÓP", "HAS", "SZÁ", "PAJ", "ÍJ", "SZÍ"];

  let typeExplainArray = [
    "Rövid penge",
    "Hosszú penge",
    "Zúzó",
    "Óriás penge",
    "Hasító",
    "Szálfegyver",
    "Pajzs",
    "Íj",
    "Számszeríj",
  ];

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

    const endpoint = "../api/addNewWeaponHu";
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
        <Navbar
          hunLink={"/manageWeaponsHU"}
          engLink={"/manageWeapons"}
          rollHelper={"Dobássegítő"}
          manageWeapons={"Fegyverek kezelése"}
          rollHelperLink={"/indexHU"}
          manageWeaponsLink={"/manageWeaponsHU"}
        />
        <form id="addWeaponForm" onSubmit={handleWeaponSubmit}>
          <label htmlFor="w_name" id="">
            Fegyver neve:
          </label>
          <input
            type="text"
            name="w_name"
            className="newWeaponInput"
            id="w_name"
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
        <span id="explanationTitle">Fegyvertípus rövidítések:</span>
        <div id="typeDiv">
          {typeArray.map((e) => {
            return <span key={e}>{e} ===</span>;
          })}
        </div>
        <div id="explanationDiv">
          {typeExplainArray.map((e) => {
            return <span key={e}>{e}</span>;
          })}
        </div>
      </main>
    </>
  );
}
