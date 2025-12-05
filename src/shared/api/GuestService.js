import axios from 'axios';

const apiBaseUrl = 'https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com'; // Replace with your AWS Gateway URL

const fetchAllGuests = async () => {
    const response = await axios.get(`${apiBaseUrl}/items`);
    return response.data;
};

const fetchGuestById = async (id) => {
    const response = await axios.get(`${apiBaseUrl}/items/${id}`);
    return response.data;
};

const addGuest = async (guest) => {
    const response = await axios.put(`${apiBaseUrl}/items`, guest);
    return (response.status === 200);
};

const updateGuest = async (id, updatedData) => {

    const response = await axios.put(`${apiBaseUrl}/items`, updatedData);
    //const response = await axios.put(`${apiBaseUrl}/items/${id}`, updatedData);
    return (response.status === 200);

};

const deleteGuest = async (id) => {
    const response = await axios.delete(`${apiBaseUrl}/items/${id}`);
    return response.data;
};

export {
    fetchAllGuests,
    fetchGuestById,
    addGuest,
    updateGuest,
    deleteGuest
};
