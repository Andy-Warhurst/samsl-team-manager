import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../Guests.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { useData } from "./DataContext";
import { useParticipants } from "./ParticipantContext";
import { useTeamSheet } from "./TeamSheetContext";
import EditableNumberButton from "../../shared/components/EditableNumberButton";

function Guests({ team }) {
    const { data } = useData(); // round still comes from DataContext
    const round = data.round ?? "1";

    const [columns, setColumns] = useState(5);
    const [columnWidth, setColumnWidth] = useState(100);

    const { participants, addGuest, updateParticipant, deleteGuest } = useParticipants();
    const { loadTeamSheet, saveTeamSheet } = useTeamSheet();

    const [guestText, setGuestText] = useState("");

    // Local selection state (do NOT store in DataContext)
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    // Keep the loaded team sheet around (optional, but handy)
    const [teamSheet, setTeamSheet] = useState(null);
    const [loadingSheet, setLoadingSheet] = useState(false);

    // Filter participants to only those belonging to this team
    const myParticipants = useMemo(() => {
        return (participants || [])
            .filter((p) => p.team === team)
            .slice()
            .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }, [participants, team]);

    // Build a map for quick lookup from id -> participant
    const participantById = useMemo(() => {
        const map = new Map();
        myParticipants.forEach((p) => map.set(p.id, p));
        return map;
    }, [myParticipants]);

    // Load team sheet whenever team OR round changes, and preselect
    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!team || !round) return;

            setLoadingSheet(true);
            try {
                const sheet = await loadTeamSheet(team, String(round));
                if (cancelled) return;

                setTeamSheet(sheet);

                const ids = new Set();
                (sheet?.players || []).forEach((p) => {
                    if (p?.id != null) ids.add(p.id);
                });
                setSelectedIds(ids);
            } catch (e) {
                if (cancelled) return;
                console.error("Failed to load team sheet", e);
                setTeamSheet(null);
                setSelectedIds(new Set()); // safe fallback
            } finally {
                if (!cancelled) setLoadingSheet(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [team, round, loadTeamSheet]);

        useEffect(() => {
        const updateColumns = () => {
            const cols = window.innerWidth < 768 ? 3 : 6;
            setColumns(cols);
            setColumnWidth((window.innerWidth / cols) - (cols * 3));
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    const toggleSelected = useCallback((p) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(p.id)) next.delete(p.id);
            else next.add(p.id);
            return next;
        });
    }, []);

    const updateShirtNumber = useCallback(
        (p, number) => {
            // Persist. (Local UI will show updated value on next participants refresh.)
            updateParticipant({ ...p, shirtno: number });
        },
        [updateParticipant]
    );

    const deleteGuestById = useCallback(
        async (id) => {
            await deleteGuest(id);
            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        },
        [deleteGuest]
    );

    const addNewGuest = useCallback(
        async (name, teamName, shirtno) => {
            if (!name?.trim()) return;
            const newGuest = {
                id: crypto.randomUUID().toString(),
                name: name.trim(),
                team: teamName,
                shirtno: shirtno ?? "",
                isGuest: true,
            };
            await addGuest(newGuest);
            setGuestText("");
        },
        [addGuest]
    );

    const selectedPlayersArray = useMemo(() => {
        // Convert selected IDs to player objects (only those we can find locally)
        const selected = [];
        selectedIds.forEach((id) => {
            const p = participantById.get(id);
            if (p) {
                selected.push({
                    id: p.id,
                    isGuest: !!p.isGuest,
                    name: p.name,
                    shirtno: p.shirtno ?? "",
                    team: p.team,
                });
            }
        });
        // Sort for stable storage/display
        selected.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        return selected;
    }, [selectedIds, participantById]);

    const handleSubmitSelections = useCallback(async () => {
        // Create/upsert the team sheet for this team + round
        const sheet = {
            // id optional if Lambda generates UUID; include if you already have it:
            id: teamSheet?.id,
            teamName: team,
            round: String(round),
            players: selectedPlayersArray,

            // workflow flags
            submitted: true,
            submittedAt: new Date().toISOString(),
        };

        try {
            const saved = await saveTeamSheet(sheet);
            setTeamSheet(saved); // keep local copy updated
        } catch (e) {
            console.error("Failed to submit team sheet", e);
            alert("Failed to submit team sheet.");
        }
    }, [team, round, selectedPlayersArray, saveTeamSheet, teamSheet?.id]);


    return (
        <div className="guest-page">
            <h3>Players – {team} (Round {round})</h3>

                {loadingSheet && <div style={{ marginBottom: 8 }}>Loading team sheet…</div>}


            <table className="guest-selector-table">
                <tbody>
                {Array.from({ length: Math.ceil(myParticipants.length / columns) }, (_, rowIndex) => (
                    <tr key={rowIndex}>
                        {myParticipants
                            .slice(rowIndex * columns, rowIndex * columns + columns)
                            .map((p) => {
                                const isSelected = selectedIds.has(p.id);

                                return (
                                    <td key={p.id}>
                                        <Card
                                            onClick={() => toggleSelected(p)}
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
                                                boxSizing: "border-box",
                                            }}
                                        >
                                            {/* Header */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {/* P/G badge */}
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: "bold",
                                                        padding: "2px 6px",
                                                        borderRadius: 4,
                                                        backgroundColor: "rgba(255,255,255,0.2)",
                                                    }}
                                                >
                            {p.isGuest ? "G" : "P"}
                          </span>

                                                {/* Delete only if guest */}
                                                {p.isGuest && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteGuestById(p.id);
                                                        }}
                                                        style={{
                                                            fontSize: "10px",
                                                            lineHeight: 1,
                                                            padding: "0 6px",
                                                            height: "18px",
                                                        }}
                                                    >
                                                        X
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Shirt number */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 4,
                                                    width: "100%",
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <EditableNumberButton
                                                    value={p.shirtno}
                                                    onCommit={(newNo) => updateShirtNumber(p, newNo)}
                                                    buttonStyle={{
                                                        fontSize: "10px",
                                                        padding: "0 6px",
                                                        minWidth: "32px",
                                                        textAlign: "centre",
                                                    }}
                                                    buttonVariant="light"
                                                />
                                            </div>

                                            {/* Name */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    justifyContent: "space-between",
                                                    flex: 1,
                                                    width: "100%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        fontSize: 11,
                                                        fontWeight: "bold",
                                                        marginBottom: 4,
                                                        textAlign: "center",
                                                        maxWidth: "100%",
                                                        whiteSpace: "normal",
                                                        overflow: "visible",
                                                        textOverflow: "clip",
                                                    }}
                                                >
                                                    {p.name}
                                                </div>
                                            </div>
                                        </Card>
                                    </td>
                                );
                            })}
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: 10 }}>
                <label htmlFor="guestname">Name:</label>
                <InputGroup>
                    <FormControl
                        placeholder="Guest's Name"
                        id="guestname"
                        style={{ fontSize: 12, width: "100px" }}
                        value={guestText}
                        onChange={(e) => setGuestText(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        style={{ fontSize: 12 }}
                        onClick={() => addNewGuest(guestText, team, "")}
                    >
                        Add
                    </Button>
                </InputGroup>
            </div>

            <div style={{ marginTop: 10 }}>
                <Button onClick={handleSubmitSelections}>Submit Selections</Button>{" "}
                {/*<PrintTeamsheet />*/}
            </div>
        </div>
    );
}

export default Guests;

