import "./Selector.css"
import React, {useCallback, useEffect, useState} from "react";
import FormControl from "react-bootstrap/FormControl";
import {useData} from "./DataContext";
import {usePlayers} from "./PlayerContext";

const Selector = () => {

    const { data, updateUserField } = useData();
    const {players, updatePlayer} = usePlayers();
    const [myPlayers, setMyPlayers] = useState(players);

    useEffect(() => {

        function extractPlayersByTeam(plr) {
            return plr.team === data.theTeamName;
        }

        setMyPlayers(players.filter(extractPlayersByTeam).sort((a, b) => a.name > b.name));
    }, [players, data.theTeamName]);

    const updateSelected = useCallback((selection) => {
        const updatedSelections = data.selectedPlayers.includes(selection)
            ? data.selectedPlayers.filter(player => player !== selection)
            : [...data.selectedPlayers, selection];

        updateUserField('selectedPlayers', updatedSelections);
    }, [data.selectedPlayers, updateUserField]);

    const updateShirtNumber = useCallback((player, number) => {
        updatePlayer({ ...player, shirtno: number });
    },[updatePlayer]);  //


    return (
        <table className="player-selector-table">
            <tbody>
            <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Shirt</th>
            </tr>
            {myPlayers.map(p => (
                <tr key={p.id}>
                    <td>
                        <input
                            className="player-checkbox"
                            type="checkbox"
                            id={"playing".concat(p.id)}
                            size="20"
                            onClick={() => updateSelected(p)}
                        />
                    </td>
                    <td className="player-name" align='left'>{p.name}</td>
                    <td width='50'>
                        <FormControl
                            className={"player-shirt"}
                            id={"shirtnumber".concat(p.id)}
                            name={"shirtnumber".concat(p.id)}
                            type="text"
                            value={p.shirtno}
                            onChange={(e) =>
                                updateShirtNumber(p, e.target.value)}
                        />
                    </td>
                </tr>
            ))}

            </tbody>
        </table>
    );

};

export default Selector;
