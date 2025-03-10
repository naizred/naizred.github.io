import spellsAspDescript from "../json/spellsAspDescript.json";
import { handleSpellAspOptionChange } from "./Spells";

function AspectComponentDuration() {
  return (
    <>
      <li>
        <input />
        <select onChange={handleSpellAspOptionChange}>
          {spellsAspDescript[3].map((duration, i) => {
            return (
              <option value={i + 1} key={duration}>
                {duration}
              </option>
            );
          })}
        </select>
      </li>
    </>
  );
}

export default AspectComponentDuration;
