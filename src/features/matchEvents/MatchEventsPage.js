// src/features/matchEvents/MatchEventsPage.js
import React, { useEffect, useMemo, useState } from "react";
import { useReferee } from "./RefereeContext";
import "./matchEvents.css";

const EVENT_TYPES = [
    { value: "GOAL", label: "Goal" },
    { value: "YELLOW_CARD", label: "Yellow card" },
    { value: "RED_CARD", label: "Red card" },
    { value: "INJURY", label: "Injury" },
];

function MatchEventsPage() {
    const {
        currentFixture,
        teamSelections,
        matchEvents,
        loading,
        saving,
        error,
        selectFixture,
        lockSelections,
        addOrUpdateEvent,
        removeEvent,
        sendConfirmationRequests,
        submitReport,
        updateScore, // 👈 new from RefereeContext
    } = useReferee();

    const [formState, setFormState] = useState({
        id: null,
        eventType: "GOAL",
        team: "HOME",
        playerName: "",
        minute: "",
        note: "",
    });

    const [homeScore, setHomeScore] = useState("");
    const [awayScore, setAwayScore] = useState("");

    // When the fixture changes, initialise the score fields from the fixture
    useEffect(() => {
        if (!currentFixture) {
            setHomeScore("");
            setAwayScore("");
            return;
        }
        // DynamoDB stores numbers; DocumentClient gives JS numbers or strings.
        const h = currentFixture.homescore;
        const a = currentFixture.awayscore;
        setHomeScore(
            typeof h === "number" || typeof h === "string" ? String(h) : ""
        );
        setAwayScore(
            typeof a === "number" || typeof a === "string" ? String(a) : ""
        );
    }, [currentFixture]);

    const canSubmitReport = useMemo(() => {
        if (!currentFixture) return false;
        return (
            currentFixture.homeConfirmed === true &&
            currentFixture.awayConfirmed === true
        );
    }, [currentFixture]);

    if (!currentFixture) {
        return (
            <div className="referee-screen">
                <p>No fixture selected.</p>
                <button
                    className="primary-button"
                    onClick={() => selectFixture(null)}
                >
                    Back to fixtures
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        if (!formState.eventType || !formState.team) {
            return;
        }

        let minute = null;
        if (formState.minute !== "" && formState.minute != null) {
            const parsed = parseInt(formState.minute, 10);
            if (!Number.isNaN(parsed)) {
                minute = parsed;
            }
        }

        const payload = {
            id: formState.id,
            type: formState.eventType,
            team: formState.team,
            playerName: formState.playerName || null,
            minute: minute, // may be null/undefined, and that’s OK
            note: formState.note || null,
        };
        await addOrUpdateEvent(payload);
        // Clear form (keep eventType/team for speed)
        setFormState((prev) => ({
            id: null,
            eventType: prev.eventType,
            team: prev.team,
            playerName: "",
            minute: "",
            note: "",
        }));
    };

    const handleEditEvent = (event) => {
        setFormState({
            id: event.id,
            eventType: event.type,
            team: event.team,
            playerName: event.playerName || "",
            minute:
                typeof event.minute === "number" || typeof event.minute === "string"
                    ? String(event.minute)
                    : "",
            note: event.note || "",
        });
    };

    const handleBack = () => {
        selectFixture(null);
    };

    const isLocked = !!(teamSelections && teamSelections.isLocked);

    const handleSaveScore = async () => {
        if (!currentFixture) return;

        // Allow empty → treat as 0, or you can choose to treat empty as null
        const homeVal =
            homeScore === "" || homeScore == null ? 0 : parseInt(homeScore, 10);
        const awayVal =
            awayScore === "" || awayScore == null ? 0 : parseInt(awayScore, 10);

        if (Number.isNaN(homeVal) || Number.isNaN(awayVal)) {
            // You could add some nicer validation/toast here
            return;
        }

        await updateScore(homeVal, awayVal);
    };

    return (
        <div className="referee-screen">
            <header className="match-header">
                <button className="secondary-button" onClick={handleBack}>
                    Back
                </button>
                <div className="match-header-centre">
                    <div className="fixture-teams">
                        {currentFixture.hometeam} vs {currentFixture.awayteam}
                    </div>
                    <div className="fixture-meta">
                        <span>{currentFixture.date}</span>
                        <span>{currentFixture.time}</span>
                        {currentFixture.venue && <span>@ {currentFixture.venue}</span>}
                    </div>
                </div>
            </header>

            {loading && <p>Loading match data…</p>}
            {error && <p className="error-text">{error}</p>}



            {/* Team selections */}
            <section className="card">
                <div className="card-header">
                    <h2>Teams</h2>
                    {!isLocked && (
                        <button
                            className="primary-button"
                            disabled={saving}
                            onClick={lockSelections}
                        >
                            Lock team sheets
                        </button>
                    )}
                    {isLocked && <span className="badge badge-locked">Locked</span>}
                </div>
                {teamSelections ? (
                    <div className="team-selections">
                        <div className="team-column">
                            <h3>
                                {teamSelections.homeTeamName || currentFixture.hometeam}
                            </h3>
                            <ul>
                                {(teamSelections.homePlayers || [])
                                    .slice() // copy so we don’t mutate state
                                    .sort((a, b) => {
                                        const aNum = parseInt(a.shirtno ?? a.shirtNumber ?? a.shirt_no, 10);
                                        const bNum = parseInt(b.shirtno ?? b.shirtNumber ?? b.shirt_no, 10);

                                        // Put players with no number at the end
                                        if (Number.isNaN(aNum) && Number.isNaN(bNum)) return 0;
                                        if (Number.isNaN(aNum)) return 1;
                                        if (Number.isNaN(bNum)) return -1;

                                        return aNum - bNum;
                                    })
                                    .map((p) => {
                                        const number =
                                            p.shirtno ?? p.shirtNumber ?? p.shirt_no ?? "";

                                        return (
                                            <li key={p.id || p.playerId}>
                                                {number !== "" ? `${number} - ` : "? - "}
                                                {p.name}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                        <div className="team-column">
                            <h3>
                                {teamSelections.awayTeamName || currentFixture.awayteam}
                            </h3>
                            <ul>
                                {(teamSelections.awayPlayers || [])
                                    .slice() // copy so we don’t mutate state
                                    .sort((a, b) => {
                                        const aNum = parseInt(a.shirtno ?? a.shirtNumber ?? a.shirt_no, 10);
                                        const bNum = parseInt(b.shirtno ?? b.shirtNumber ?? b.shirt_no, 10);

                                        // Put players with no number at the end
                                        if (Number.isNaN(aNum) && Number.isNaN(bNum)) return 0;
                                        if (Number.isNaN(aNum)) return 1;
                                        if (Number.isNaN(bNum)) return -1;

                                        return aNum - bNum;
                                    })
                                    .map((p) => {
                                        const number =
                                            p.shirtno ?? p.shirtNumber ?? p.shirt_no ?? "";

                                        return (
                                            <li key={p.id || p.playerId}>
                                                {number !== "" ? `${number} - ` : "? - "}
                                                {p.name}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p>No team selections available.</p>
                )}
            </section>

            {/* Score entry */}
            <section className="card">
                <div className="card-header">
                    <h2>Result</h2>
                </div>
                <div className="event-form-row">
                    <label>
                        {currentFixture.hometeam}
                        <input
                            type="number"
                            min="0"
                            name="homeScore"
                            value={homeScore}
                            onChange={(e) => setHomeScore(e.target.value)}
                        />
                    </label>
                    <span
                        style={{
                            alignSelf: "flex-end",
                            paddingBottom: "0.5rem",
                            fontWeight: "bold",
                        }}
                    >
            –
          </span>
                    <label>
                        {currentFixture.awayteam}
                        <input
                            type="number"
                            min="0"
                            name="awayScore"
                            value={awayScore}
                            onChange={(e) => setAwayScore(e.target.value)}
                        />
                    </label>
                </div>
                <button
                    type="button"
                    className="primary-button full-width"
                    disabled={saving}
                    onClick={handleSaveScore}
                >
                    Save score
                </button>
            </section>

            {/* Event entry */}
            <section className="card">
                <div className="card-header">
                    <h2>Match Events</h2>
                </div>
                <form className="event-form" onSubmit={handleSubmitEvent}>
                    <div className="event-form-row">
                        <label>
                            Event
                            <select
                                name="eventType"
                                value={formState.eventType}
                                onChange={handleChange}
                            >
                                {EVENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Team
                            <select
                                name="team"
                                value={formState.team}
                                onChange={handleChange}
                            >
                                <option value="HOME">
                                    {teamSelections?.homeTeamName || currentFixture.hometeam}
                                </option>
                                <option value="AWAY">
                                    {teamSelections?.awayTeamName || currentFixture.awayteam}
                                </option>
                            </select>
                        </label>
                    </div>

                    <div className="event-form-row">
                        <label>
                            Player
                            <input
                                name="playerName"
                                value={formState.playerName}
                                onChange={handleChange}
                                placeholder="Name or shirt number"
                            />
                        </label>

                        <label>
                            Minute (optional)
                            <input
                                name="minute"
                                type="number"
                                min="0"
                                max="130"
                                value={formState.minute}
                                onChange={handleChange}
                                placeholder="e.g. 42"
                            />
                        </label>
                    </div>

                    <label className="event-note">
                        Note
                        <input
                            name="note"
                            value={formState.note}
                            onChange={handleChange}
                            placeholder="Optional note"
                        />
                    </label>

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={saving}
                    >
                        {formState.id ? "Update event" : "Add event"}
                    </button>
                </form>

                <ul className="event-list">
                    {matchEvents.map((event) => (
                        <li key={event.id} className="event-item">
                            <div>
                                <strong>{event.type}</strong> – {event.team} –{" "}
                                {event.playerName || "Unknown player"}
                                {typeof event.minute === "number" &&
                                    !Number.isNaN(event.minute) && (
                                        <> ({event.minute}')</>
                                    )}
                                {event.note && <> – {event.note}</>}
                            </div>
                            <div className="event-actions">
                                <button
                                    type="button"
                                    className="secondary-button small"
                                    onClick={() => handleEditEvent(event)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="danger-button small"
                                    onClick={() => removeEvent(event.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Confirmation and submission */}
            <section className="card">
                <div className="card-header">
                    <h2>Confirm & submit</h2>
                </div>
                <div className="confirmation-status">
                    <p>
                        Home confirmation:{" "}
                        <strong>
                            {currentFixture?.homeConfirmed ? "Confirmed" : "Pending"}
                        </strong>
                    </p>
                    <p>
                        Away confirmation:{" "}
                        <strong>
                            {currentFixture?.awayConfirmed ? "Confirmed" : "Pending"}
                        </strong>
                    </p>
                </div>
                <div className="confirmation-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        disabled={saving}
                        onClick={sendConfirmationRequests}
                    >
                        Request team confirmation
                    </button>
                    <button
                        type="button"
                        className="primary-button"
                        disabled={saving || !canSubmitReport}
                        onClick={submitReport}
                    >
                        Submit match report
                    </button>
                </div>
            </section>
        </div>
    );
}

export default MatchEventsPage;
