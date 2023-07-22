import styles from "../styles/Home.module.css";
import React from "react";
import Head from "next/head";

export default function addChar() {


   let typeArray = ["","RP", "HP", "ZÚZ", "ÓP", "HAS", "SZÁ", "PAJ", "ÍJ", "SZÍ"];

   let professionLevel = [0, 1, 2, 3, 4, 5];
   let destroyerLevel = [0, 1, 2, 3];
  
  function handleWeaponSubmit(event) {
    event.preventDefault();

     let data = {
      charName: event.target.charName.value,
      charAtk: event.target.charAtk.value,
      charStr: event.target.charStr.value,
     [event.target.prof11.value]: event.target.prof12.value,
     [event.target.prof21.value]: event.target.prof22.value,
     [event.target.prof31.value]: event.target.prof32.value,
     [event.target.prof41.value]: event.target.prof42.value,
    [event.target.prof51.value]: event.target.prof52.value,
      destroyerLevel: event.target.destroyerLevel.value
    };
  let arrayToFilter = Object.entries(data)
    
let filteredDataArray = arrayToFilter.filter(([key,value])=>value!=0)
let filteredDataObj = Object.fromEntries(filteredDataArray)
console.log(data)
console.log((filteredDataArray))
    console.log((filteredDataObj))

  }
  return (
    <>
      <Head>
        <title>TTK Rolldice</title>
      </Head>
      <main className={styles.main}>
  
        <form id="addWeaponForm" onSubmit={handleWeaponSubmit}>
          <div><label htmlFor="charName" id="">
            Karakter neve:
          </label>
          <input
            type="text"
            name="charName"
            className="newCharInput"
            id="charName"
            />
          </div>
          <div>
          <label htmlFor="charAtk" id="">
            Karakter támadója:
          </label>
          <input
            type="text"
            name="charAtk"
            className="newCharInput"
            id="charAtk"
            /></div>
          <div>
          <label htmlFor="charStr" id="">
            Karakter ereje:
          </label>
          <input
            type="text"
            name="charStr"
            className="newCharInput"
            id="charStr"
            />
            </div>
          <div> 
          <div> 
          <label htmlFor="w_type" id="">
            Fegyverhasználat:
          </label>
          <select name="w_type" className="newCharInput" id="prof11">
            {typeArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <select name="professionLevel" className="newCharInput" id="prof12">
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
            </div>
            <div> 
              
          <label htmlFor="w_type" id="">
            Fegyverhasználat:
          </label>
          <select name="w_type" className="newCharInput" id="prof21">
            {typeArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
         
          <select name="professionLevel" className="newCharInput" id="prof22">
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
           
            </div>
         <div> 
          <label htmlFor="w_type" id="">
            Fegyverhasználat:
          </label>
          <select name="w_type" className="newCharInput" id="prof31">
            {typeArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
         
          <select name="professionLevel" className="newCharInput" id="prof32">
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
           
            </div>
         <div> 
          <label htmlFor="w_type" id="">
            Fegyverhasználat:
          </label>
          <select name="w_type" className="newCharInput" id="prof41">
            {typeArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
         
          <select name="professionLevel" className="newCharInput" id="prof42">
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
           
            </div>
         <div> 
          <label htmlFor="w_type" id="">
            Fegyverhasználat:
          </label>
          <select name="w_type" className="newCharInput" id="prof51">
            {typeArray.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
         
          <select name="professionLevel" className="newCharInput" id="prof52">
            {professionLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
           
            </div>
         <div> 
            
            </div>
         <div> 
          <label htmlFor="w_type" id="">
            Pusztító adottság:
          </label>
          <select name="w_type" className="newCharInput" id="destroyerLevel">
            {destroyerLevel.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
           
          </div>
          </div>
        </form>
        <button
          type="submit"
          name="submit"
          form="addWeaponForm"
          id="addWeaponFormSubmitButton"
        >
          Elküld
        </button>
      </main>
    </>
  );
}
