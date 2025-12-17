import axios from 'axios';

const apiBaseUrl = 'https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com'; // Replace with your AWS Gateway URL

const upsertTeamSheet = async (teamSheet) => {
    // PUT /teamsheets
    // teamSheet should include an id (string) so you can update later
    const response = await axios.put(`${apiBaseUrl}/teamsheets`, teamSheet);
    return response.data;
};

const fetchTeamSheetById = async (id) => {
    // GET /teamsheets/{id}
    const response = await axios.get(`${apiBaseUrl}/teamsheets/${id}`);
    return response.data;
};

const fetchTeamSheetForFixtureAndTeam = async (fixtureId, teamName) => {
    // GET /teamsheets?fixtureId=...&teamName=...
    const response = await axios.get(`${apiBaseUrl}/teamsheets`, {
        params: { fixtureId, teamName },
    });

    // could be [] or a single object depending on how you implement Lambda
    // We’ll standardise: return first match if array.
    const data = response.data;
    if (Array.isArray(data)) return data[0] || null;
    return data || null;
};

const submitTeamSheet = async (id) => {
    // POST /teamsheets/{id}/submit
    const response = await axios.post(`${apiBaseUrl}/teamsheets/${id}/submit`);
    return response.data;
};

const unlockTeamSheet = async (id) => {
    // POST /teamsheets/{id}/unlock
    const response = await axios.post(`${apiBaseUrl}/teamsheets/${id}/unlock`);
    return response.data;
};

const lockTeamSheet = async (id) => {
    // POST /teamsheets/{id}/lock
    const response = await axios.post(`${apiBaseUrl}/teamsheets/${id}/lock`);
    return response.data;
};

export {
    upsertTeamSheet,
    fetchTeamSheetById,
    fetchTeamSheetForFixtureAndTeam,
    submitTeamSheet,
    unlockTeamSheet,
    lockTeamSheet,
};
