import React, { useState} from 'react';
import {useData} from "./DataContext";

const FixtureDropdown = () => {

    const { data, updateUserField } = useData();
    const [round, setRound] = useState(data.round);

    const Rounds = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','CUPQ','CUP1','PLSF','CUPSF'];

    function updateRound (selection) {
        setRound(selection);
        updateUserField('round', selection);
    }

    return (
        <div>
            <label htmlFor="round"
                   style={{fontSize: "small"}}>
                Round:
                <select
                    id="round"
                    value={round}
                    style={{fontSize: "small"}}
                    onChange={(e) => updateRound (e.target.value)
                    }
                >
                    {Rounds.map((round) => (
                        <option key={round} value={round}>
                            {round}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default FixtureDropdown;
