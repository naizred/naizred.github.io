import spellsAspDescript from "../json/spellsAspDescript.json";
import { handleSpellAspOptionChange } from "./Spells";

function AspectComponentPower() {
  return (
    <>
      <li>
        <input />
        <select onChange={handleSpellAspOptionChange}>
          {spellsAspDescript[0].map((power, i) => {
            return (
              <option value={i + 1} key={power}>
                {power}
              </option>
            );
          })}
        </select>
      </li>
    </>
  );
}

export default AspectComponentPower;
