import spellsAspDescript from "../json/spellsAspDescript.json";
import { handleSpellAspOptionChange } from "./Spells";

function AspectComponentDistance() {
  return (
    <>
      <li>
        <input />
        <select onChange={handleSpellAspOptionChange}>
          {spellsAspDescript[1].map((distance, i) => {
            return (
              <option value={i + 1} key={distance}>
                {distance}
              </option>
            );
          })}
        </select>
      </li>
    </>
  );
}

export default AspectComponentDistance;
