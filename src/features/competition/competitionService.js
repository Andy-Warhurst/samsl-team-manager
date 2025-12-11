// src/features/competition/competitionService.js
import axios from "axios";

// You can move this into an env var later
const apiBaseUrl = "https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com";

/**
 * Get fixtures that are considered "completed" or needing follow-up.
 *
 * GET /competition/fixtures/completed
 *
 * Expected response: array of fixtures
 * [
 *   {
 *     id: "99",
 *     round: "9",
 *     date: "20/07/2025",
 *     time: "10.45",
 *     venue: "Barratt Reserve 5",
 *     division: "2",
 *     hometeam: "Austria",
 *     awayteam: "University Old Boys",
 *     refereeEmail: "ref@example.com",
 *     status: "COMPLETED" | "SCHEDULED" | "IN_PROGRESS",
 *     reportSubmitted: true | false
 *   }
 * ]
 */
export async function fetchCompletedFixtures() {
    const response = await axios.get(`${apiBaseUrl}/competition/fixtures/completed`);
    return response.data;
}

/**
 * Get yellow/red cards for the current round.
 *
 * GET /competition/cards/current-round
 *   or /competition/cards/current-round?round=9
 *
 * Expected response:
 * {
 *   round: "9",
 *   cards: [
 *     {
 *       id: "fixture99#1",
 *       fixtureId: "99",
 *       date: "20/07/2025",
 *       team: "Austria",
 *       opponent: "University Old Boys",
 *       playerName: "Jane Smith",
 *       type: "YELLOW_CARD" | "RED_CARD",
 *       minute: 42,
 *       note: "Dissent"
 *     }
 *   ]
 * }
 */
export async function fetchCardsForCurrentRound(round) {
    const params = round ? { round } : undefined;
    const response = await axios.get(
        `${apiBaseUrl}/competition/cards/current-round`,
        { params }
    );
    return response.data;
}

/**
 * Get yellow/red cards aggregated by team from start of season.
 *
 * GET /competition/cards/by-team
 *
 * Expected response: array
 * [
 *   {
 *     team: "Austria",
 *     yellowCount: 5,
 *     redCount: 1,
 *     totalCards: 6
 *   }
 * ]
 */
export async function fetchCardsByTeam() {
    const response = await axios.get(`${apiBaseUrl}/competition/cards/by-team`);
    return response.data;
}
