import axios from 'axios';

const apiBaseUrl = 'https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com';

const fetchAllUserTeams = async () => {
    const response = await axios.get(`${apiBaseUrl}/user-team`);
    return response.data;
};

export {
    fetchAllUserTeams,
};
