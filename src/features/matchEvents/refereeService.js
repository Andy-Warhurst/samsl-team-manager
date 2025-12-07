// src/features/matchEvents/refereeService.js
import axios from 'axios';

const apiBaseUrl = 'https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com';
// TODO: if you move API base URL into a shared config, import it instead.

export async function fetchAllocatedFixtures(refereeEmail) {
    // Returns the list of fixtures allocated to the referee.
    // Expected response: [{ id, date, time, venue, hometeam, awayteam, isLocked, status, ... }]
    const response = await axios.get(`${apiBaseUrl}/referee/fixtures`, {
        params: { refereeEmail },
    });
    return response.data;
}

export async function fetchTeamSelections(fixtureId) {
    // Expected response: { homeTeamName, awayTeamName, homePlayers: [...], awayPlayers: [...], isLocked: boolean }
    const response = await axios.get(`${apiBaseUrl}/referee/fixtures/${fixtureId}/team-selections`);
    return response.data;
}

export async function lockTeamSelections(fixtureId) {
    const response = await axios.post(`${apiBaseUrl}/referee/fixtures/${fixtureId}/lock-team-selections`);
    return response.data;
}

export async function fetchMatchEvents(fixtureId) {
    // Expected response: array of events
    const response = await axios.get(`${apiBaseUrl}/referee/fixtures/${fixtureId}/events`);
    return response.data;
}

export async function saveMatchEvent(fixtureId, event) {
    // If event has an id, update; otherwise create
    if (event.id) {
        const response = await axios.put(
            `${apiBaseUrl}/referee/fixtures/${fixtureId}/events/${event.id}`,
            event
        );
        return response.data;
    }
    const response = await axios.post(
        `${apiBaseUrl}/referee/fixtures/${fixtureId}/events`,
        event
    );
    return response.data;
}

export async function deleteMatchEvent(fixtureId, eventId) {
    await axios.delete(`${apiBaseUrl}/referee/fixtures/${fixtureId}/events/${eventId}`);
}

export async function requestTeamConfirmation(fixtureId) {
    const response = await axios.post(
        `${apiBaseUrl}/referee/fixtures/${fixtureId}/request-confirmation`
    );
    return response.data;
}

export async function submitMatchReport(fixtureId) {
    const response = await axios.post(
        `${apiBaseUrl}/referee/fixtures/${fixtureId}/submit-report`
    );
    return response.data;
}
