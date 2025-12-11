// src/features/competition/CompetitionDashboard.js
import React, { useEffect, useState } from "react";
import {
    fetchCompletedFixtures,
    fetchCardsForCurrentRound,
    fetchCardsByTeam,
} from "./competitionService";
import "./competition.css";

function CompetitionDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [completedFixtures, setCompletedFixtures] = useState([]);
    const [roundCards, setRoundCards] = useState({ round: null, cards: [] });
    const [cardsByTeam, setCardsByTeam] = useState([]);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const [fixtures, currentRoundCards, teamCards] = await Promise.all([
                    fetchCompletedFixtures(),
                    fetchCardsForCurrentRound(),
                    fetchCardsByTeam(),
                ]);

                setCompletedFixtures(fixtures || []);
                setRoundCards(currentRoundCards || { round: null, cards: [] });
                setCardsByTeam(teamCards || []);
            } catch (e) {
                console.error("Failed to load competition data", e);
                setError("Failed to load competition manager data.");
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    }, []);

    return (
        <div className="comp-screen">
            <h1 className="comp-title">Competition Manager</h1>

            {loading && <p>Loading…</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && (
                <>
                    {/* Completed / late games */}
                    <section className="card">
                        <div className="card-header">
                            <h2>Completed / late games</h2>
                        </div>
                        {completedFixtures.length === 0 ? (
                            <p>No completed or late games found.</p>
                        ) : (
                            <ul className="fixture-list">
                                {completedFixtures.map((fx) => (
                                    <li key={fx.id} className="fixture-row">
                                        <div className="fixture-main">
                      <span className="fixture-teams">
                        {fx.hometeam} vs {fx.awayteam}
                      </span>
                                            <span className="fixture-meta">
                        Round {fx.round} &middot; {fx.date} {fx.time} @ {fx.venue}
                      </span>
                                        </div>
                                        <div className="fixture-status">
                      <span className="badge">
                        {fx.status || "UNKNOWN"}
                      </span>
                                            <span
                                                className={
                                                    "badge " +
                                                    (fx.reportSubmitted ? "badge-ok" : "badge-alert")
                                                }
                                            >
                        {fx.reportSubmitted ? "Report submitted" : "Report missing"}
                      </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Cards for current round */}
                    <section className="card">
                        <div className="card-header">
                            <h2>
                                Cards this round
                                {roundCards.round && <> (Round {roundCards.round})</>}
                            </h2>
                        </div>
                        {roundCards.cards.length === 0 ? (
                            <p>No yellow or red cards reported this round.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Round</th>
                                    <th>Date</th>
                                    <th>Fixture</th>
                                    <th>Team</th>
                                    <th>Player</th>
                                    <th>Type</th>
                                    <th>Minute</th>
                                    <th>Note</th>
                                </tr>
                                </thead>
                                <tbody>
                                {roundCards.cards.map((card) => (
                                    <tr key={card.id}>
                                        <td>{card.round}</td>
                                        <td>{card.date}</td>
                                        <td>
                                            {card.team} vs {card.opponent}
                                        </td>
                                        <td>{card.team}</td>
                                        <td>{card.playerName}</td>
                                        <td>{card.type === "YELLOW_CARD" ? "Yellow" : "Red"}</td>
                                        <td>{card.minute ?? "-"}</td>
                                        <td>{card.note}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </section>

                    {/* Cards by team across season */}
                    <section className="card">
                        <div className="card-header">
                            <h2>Discipline table (season to date)</h2>
                        </div>
                        {cardsByTeam.length === 0 ? (
                            <p>No cards recorded yet.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Yellow cards</th>
                                    <th>Red cards</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cardsByTeam.map((row) => (
                                    <tr key={row.team}>
                                        <td>{row.team}</td>
                                        <td>{row.yellowCount}</td>
                                        <td>{row.redCount}</td>
                                        <td>{row.totalCards}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default CompetitionDashboard;
