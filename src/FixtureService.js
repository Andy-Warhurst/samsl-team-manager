import axios from 'axios';

const apiBaseUrl = 'https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com';

const fetchAllFixtures = async () => {
    const response = await axios.get(`${apiBaseUrl}/fixtures`);
    return response.data;
};

const fetchFixtureById = async (id) => {
    const response = await axios.get(`${apiBaseUrl}/fixtures/${id}`);
    return response.data;
};

const addFixture = async (guest) => {
    const response = await axios.put(`${apiBaseUrl}/fixtures`, guest);
    return response.data;
};

const updateFixture = async (id, updatedData) => {

    const response = await axios.put(`${apiBaseUrl}/fixtures`, updatedData);
    //const response = await axios.put(`${apiBaseUrl}/fixtures/${id}`, updatedData);
    return response.data;
};

const deleteFixture = async (id) => {
    const response = await axios.delete(`${apiBaseUrl}/fixtures/${id}`);
    return response.data;
};

export {
    fetchAllFixtures,
    fetchFixtureById,
    addFixture,
    updateFixture,
    deleteFixture
};
