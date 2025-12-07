// src/features/matchEvents/RefereeDashboard.js
import React from "react";
import { useReferee } from "./RefereeContext";
import MatchEventsPage from "./MatchEventsPage";
import "./matchEvents.css";

function RefereeDashboard() {
    const {
        loading,
        error,
        allocatedFixtures,
        selectedFixtureId,
        currentFixture,
        selectFixture,
    } = useReferee();

    if (selectedFixtureId && currentFixture) {
        // When a fixture is selected, show the match events screen
        return <MatchEventsPage />;
    }

    return (
        <div className="referee-screen">
            <h1 className="referee-title">My Fixtures</h1>

            {loading && <p>Loading fixtures…</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && allocatedFixtures.length === 0 && (
                <p>No fixtures allocated.</p>
            )}

            <ul className="fixture-list">
                {allocatedFixtures.map((fixture) => (
                    <li
                        key={fixture.id}
                        className="fixture-card"
                        onClick={() => selectFixture(fixture.id)}
                    >
                        <div className="fixture-main-line">
              <span className="fixture-teams">
                {fixture.hometeam} vs {fixture.awayteam}
              </span>
                        </div>
                        <div className="fixture-meta">
                            <span>{fixture.date}</span>
                            <span>{fixture.time}</span>
                            {fixture.venue && <span>@ {fixture.venue}</span>}
                        </div>
                        <div className="fixture-status">
                            {fixture.status && <span className="badge">{fixture.status}</span>}
                            {fixture.isLocked && (
                                <span className="badge badge-locked">Team sheets locked</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RefereeDashboard;
