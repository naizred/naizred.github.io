function AspectComponentMechanism() {
    let mechanismAspectNumbers = [1,2,3,4,5,6,7,8,9,10,11,]

    return (<>
           <li>
           <input />
                <select disabled={true}>
                        {mechanismAspectNumbers.map((power, i) => {
                            return (
                            <option value={i + 1} key={power}>
                                {power}
                            </option>
                            );
                        })}
                </select>
            </li>
        </>
    )
}

export default AspectComponentMechanism