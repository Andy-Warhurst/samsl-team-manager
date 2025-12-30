import axios from 'axios';

const apiBaseUrl = 'https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com';

const upsertTeamSheet = async (teamSheet) => {
    // PUT /teamsheets
    const response = await axios.put(`${apiBaseUrl}/teamsheets`, teamSheet);
    return response.data;
};

const getTeamSheet = async (teamName, round) => {
    // const response = await axios.get(`${apiBaseUrl}/teamsheets/`, {
    //     params: { teamName, round },
    //     });
    const response = await axios.get(
        `${apiBaseUrl}/teamsheets/${encodeURIComponent(teamName)}/${encodeURIComponent(round)}`
    );
    return response.data;
}

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
    getTeamSheet,
    upsertTeamSheet,
    submitTeamSheet,
    unlockTeamSheet,
    lockTeamSheet,
};
