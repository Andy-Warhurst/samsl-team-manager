import React, { useState, useEffect, useCallback } from "react";
import "./Guests.css";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useData } from "./DataContext";
import { useGuests } from './GuestContext';
import EditableNumberButton from "./EditableNumberButton";

function Guests() {

    const { guests, deleteGuest, addGuest, updateGuest } = useGuests();
    const [myGuests, setMyGuests] = useState([]);
    const [guestText, setGuestText] = useState('');
    const [columns, setColumns] = useState(5);
    const [columnWidth, setColumnWidth] = useState(100);
    const { data, updateUserField } = useData();

    useEffect(() => {
        setMyGuests(guests.filter(guest => guest.team === data.theTeamName).sort((a, b) => a.name.localeCompare(b.name)));
    }, [guests, data.theTeamName]);

    const updateSelected = useCallback((player) => {
        const isAlreadySelected = data.selectedPlayers.some(p => p.id === player.id);

        const updatedSelections = isAlreadySelected
            ? data.selectedPlayers.filter(p => p.id !== player.id)
            : [...data.selectedPlayers, player];

        updateUserField('selectedPlayers', updatedSelections);
    }, [data.selectedPlayers, updateUserField]);


    // const updateShirtNumber = useCallback((guest, number) => {
    //     updateGuest({ ...guest, shirtno: number });
    // },[updateGuest]);  //

    const updateShirtNumber = useCallback(
        (guest, number) => {
            // Optimistic local update
            setMyGuests(prev =>
                prev.map(g =>
                    g.id === guest.id ? { ...g, shirtno: number } : g
                )
            );

            // Persist in your backing store / context
            updateGuest({ ...guest, shirtno: number });
        },
        [updateGuest]
    );

    const incrementStat = useCallback(
        (guest, field) => {
            const updatedGuest = {
                ...guest,
                [field]: (guest[field] ?? 0) + 1,
            };

            // Optimistic local update
            setMyGuests(prev =>
                prev.map(g => (g.id === guest.id ? updatedGuest : g))
            );

            // Persist via your existing context/API
            updateGuest(updatedGuest);
        },
        [updateGuest]
    );

    const deleteGuestById = useCallback(async (id) => {
        await deleteGuest(id);
        setMyGuests(prevGuests => prevGuests.filter(guest => guest.id !== id));
    }, [deleteGuest]);

    const addNewGuest = useCallback(async (name, team, shirtno) => {
        try {
            // const theId = nextId();
            const theId = crypto.randomUUID().toString();
            const newGuest = { id: theId, name, team, shirtno };
            setMyGuests(prevGuests => [...prevGuests, newGuest]);
            await addGuest(newGuest);
        } catch (error) {
            console.error(error);
        }
    }, [addGuest]);


    useEffect(() => {
        const updateColumns = () => {
            // tweak breakpoint as you like (e.g. 768, 576, etc.)
            if (window.innerWidth < 768) {
                setColumns(3);
            } else {
                setColumns(6);
            }
            setColumnWidth((window.innerWidth / columns) - (columns * 3));
        };

        updateColumns(); // run once on mount
        window.addEventListener("resize", updateColumns);

        return () => window.removeEventListener("resize", updateColumns);
    });


    return (
        <div className="guest-page">
            <table className="guest-selector-table">
                <tbody>
                {Array.from(
                    { length: Math.ceil(myGuests.length / columns) },  // number of rows
                    (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {myGuests
                                .slice(rowIndex * columns, rowIndex * columns + columns)   // up to 5 guests per row
                                .map(p => {
                                    const isSelected = data.selectedPlayers.some(sp => sp.id === p.id);

                                    return (
                                        <td key={p.id}>
                                            {/*<Card*/}
                                            {/*    style={{*/}
                                            {/*        width: columnWidth,*/}
                                            {/*        height: "100px",*/}
                                            {/*        display: "flex",*/}
                                            {/*        flexDirection: "column",*/}
                                            {/*        // justifyContent: "center",*/}
                                            {/*        alignItems: "center",*/}
                                            {/*        padding: 4,*/}
                                            {/*        backgroundColor: "blue"*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    <div style={{*/}
                                            {/*        display: "flex",*/}
                                            {/*        width: "100%",*/}
                                            {/*        height: "100%",*/}
                                            {/*        justifyContent: "right",*/}
                                            {/*        gap: "4px",*/}
                                            {/*        marginTop: "1px"*/}
                                            {/*    }}>*/}
                                            {/*        <Button*/}
                                            {/*            variant="primary"*/}
                                            {/*            id={"gdelete" + p.id}*/}
                                            {/*            style={{*/}
                                            {/*                fontSize: "xx-small",*/}
                                            {/*                margin: "0px",*/}
                                            {/*                height: "20px",*/}
                                            {/*                width: "10px",*/}
                                            {/*                justifyContent: "center",*/}
                                            {/*                backgroundColor: "darkred"*/}
                                            {/*            }}*/}
                                            {/*            onClick={() => deleteGuestById(p.id)}*/}
                                            {/*        >*/}
                                            {/*            X*/}
                                            {/*        </Button>*/}
                                            {/*    </div>*/}

                                            {/*    <Button*/}
                                            {/*        variant={isSelected ? "success" : "primary"}*/}
                                            {/*        id={"gplaying" + p.id}*/}
                                            {/*        style={{ fontSize: 10,*/}
                                            {/*            width: columnWidth - 10,*/}
                                            {/*            margin: 1,*/}
                                            {/*            padding: 2}}*/}
                                            {/*        onClick={() => updateSelected(p)}*/}
                                            {/*    >*/}
                                            {/*        {p.name}*/}
                                            {/*    </Button>*/}

                                            {/*    <div style={{*/}
                                            {/*        display: "flex",*/}
                                            {/*        width: "100%",*/}
                                            {/*        height: "100%",*/}
                                            {/*        justifyContent: "center",*/}
                                            {/*        gap: "4px",*/}
                                            {/*        marginTop: "4px"*/}
                                            {/*    }}>*/}

                                            {/*        <EditableNumberButton*/}
                                            {/*            value={p.shirtno}*/}
                                            {/*            onCommit={(newNo) => updateShirtNumber(p, newNo)}*/}
                                            {/*            buttonStyle={{ fontSize: "xx-small" }}*/}
                                            {/*            buttonVariant="secondary"*/}
                                            {/*        />*/}

                                            {/*    </div>*/}
                                            {/*</Card>*/}

                                            <Card
                                                onClick={() => updateSelected(p)}
                                                style={{
                                                    width: columnWidth,
                                                    height: "120px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: 4,
                                                    borderRadius: 8,
                                                    cursor: "pointer",
                                                    backgroundColor: isSelected ? "darkgreen" : "blue",
                                                    color: "white",
                                                    boxSizing: "border-box"
                                                }}
                                            >
                                                {/* Header: badge + delete button */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100%",
                                                        marginBottom: 4
                                                    }}
                                                >
                                                    {/* Badge (e.g. G for Guest) */}
                                                    <span
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: "bold",
                                                            padding: "2px 6px",
                                                            borderRadius: 4,
                                                            backgroundColor: "rgba(255,255,255,0.2)"
                                                        }}
                                                    >
            G
        </span>

                                                    {/* Delete button – stop click bubbling so it doesn't toggle selection */}
                                                    <Button
                                                        variant="danger"
                                                        id={"gdelete" + p.id}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteGuestById(p.id);
                                                        }}
                                                        style={{
                                                            fontSize: "10px",
                                                            lineHeight: 1,
                                                            padding: "0 6px",
                                                            height: "18px"
                                                        }}
                                                    >
                                                        X
                                                    </Button>
                                                </div>

                                                {/* Shirt number (in its own row, click won't toggle selection) */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 4,
                                                        width: "100%"
                                                    }}
                                                    onClick={(e) => e.stopPropagation()} // don't trigger card selection
                                                >
                                                        {/*<span*/}
                                                        {/*    style={{*/}
                                                        {/*        fontSize: 14*/}
                                                        {/*    }}*/}
                                                        {/*>No.</span>*/}

                                                    <EditableNumberButton
                                                        value={p.shirtno}
                                                        onCommit={(newNo) => updateShirtNumber(p, newNo)}
                                                        buttonStyle={{
                                                            fontSize: "10px",
                                                            padding: "0 6px",
                                                            minWidth: "32px",
                                                            textAlign: "centre"
                                                        }}
                                                        buttonVariant="light"
                                                    />
                                                </div>

                                                {/* Body: name + shirt number */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-start",
                                                        justifyContent: "space-between",
                                                        flex: 1,
                                                        width: "100%"
                                                    }}
                                                >
                                                    {/* Player name */}
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            fontSize: 11,
                                                            fontWeight: "bold",
                                                            marginBottom: 4,
                                                            textAlign: "center",
                                                            maxWidth: "100%",
                                                            // whiteSpace: "nowrap",
                                                            // overflow: "hidden",
                                                            // textOverflow: "ellipsis"
                                                            whiteSpace: "normal",
                                                            overflow: "visible",
                                                            textOverflow: "clip"

                                                        }}
                                                    >
                                                        {p.name}
                                                    </div>


                                                </div>

                                                {/* Footer: Y / R / G buttons + counts */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "centre",
                                                        width: "100%",
                                                        marginTop: 6,
                                                        gap: 4,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()} // don’t toggle card selection
                                                >
                                                    {/* Yellow cards */}
                                                    <div style={{ display: "flex", alignItems: "centre", gap: 2 }}>
                                                        <Button
                                                            variant="warning"
                                                            size="lg"
                                                            style={{
                                                                padding: "0 6px",
                                                                fontSize: 14,
                                                                lineHeight: 1.1,
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                incrementStat(p, "yellows");
                                                            }}
                                                        >
                                                            Y
                                                        </Button>
                                                        <span style={{ fontSize: 14 }}>{p.yellows ?? 0}</span>
                                                    </div>

                                                    {/* Red cards */}
                                                    <div style={{ display: "flex", alignItems: "centre", gap: 2 }}>
                                                        <Button
                                                            variant="danger"
                                                            size="lg"
                                                            style={{
                                                                padding: "0 6px",
                                                                fontSize: 14,
                                                                lineHeight: 1.1,
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                incrementStat(p, "reds");
                                                            }}
                                                        >
                                                            R
                                                        </Button>
                                                        <span style={{ fontSize: 14 }}>{p.reds ?? 0}</span>
                                                    </div>

                                                    {/* Goals */}
                                                    <div style={{ display: "flex", alignItems: "centre", gap: 2 }}>
                                                        <Button
                                                            variant="success"
                                                            size="lg"
                                                            style={{
                                                                padding: "0 6px",
                                                                fontSize: 14,
                                                                lineHeight: 1.1,
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                incrementStat(p, "goals");
                                                            }}
                                                        >
                                                            G
                                                        </Button>
                                                        <span style={{ fontSize: 14 }}>{p.goals ?? 0}</span>
                                                    </div>
                                                </div>

                                            </Card>

                                        </td>
                                    );
                                })}
                        </tr>
                    )
                ) }

                </tbody>

            </table>
            <table>
                <tbody>
                <tr>
                    <td style={{
                        width: "200px"}}>
                        <div>
                            <label htmlFor="guestname">Name:</label>
                            <InputGroup>
                                <FormControl
                                    placeholder="Guest's Name"
                                    aria-label="Guest's Name"
                                    aria-describedby="basic-addon2"
                                    id="guestname"
                                    style={{
                                        fontSize: 12,
                                        width: "100px"}}
                                    value={guestText}
                                    onChange={(e) => setGuestText(e.target.value)} />
                                <Button
                                    variant="primary"
                                    style={{ fontSize: 12 }}
                                    onClick={() => addNewGuest(guestText, data.theTeamName, '')} >
                                    Add
                                </Button>
                            </InputGroup>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>
    );
}

export default Guests;
