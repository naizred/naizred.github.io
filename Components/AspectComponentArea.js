import spellsAspDescript from "../json/spellsAspDescript.json"
import { handleSpellAspOptionChange } from "./Spells";

function AspectComponentArea() {

    return (<>
        <li>
        <input />
          <select onChange={handleSpellAspOptionChange}>
            {spellsAspDescript[2].map((area, i) => {
              return (
                <option value={i + 1} key={area}>
                  {area}
                </option>
              );
            })}
          </select>
        </li>
        </>
    )
}

export default AspectComponentArea