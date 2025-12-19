import axios from "axios";

const apiBaseUrl = "https://hja6wvb9hc.execute-api.us-west-1.amazonaws.com";

// Normalise raw API records to a single Participant shape used by the UI.
const mapToParticipant = (x, isGuest) => ({
    id: x.id,
    name: x.name,
    team: x.team,
    shirtno: x.shirtno ?? "", // ensure it exists
    isGuest,
});

// Decide which endpoint to use based on isGuest.
// - guests live in /items
// - registered players live in /players
const getEndpointBase = (isGuest) => (isGuest ? "items" : "players");

const fetchAllParticipants = async () => {
    const [playerRes, guestRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/players`),
        axios.get(`${apiBaseUrl}/items`),
    ]);

    const players = (playerRes.data || []).map((p) => mapToParticipant(p, false));
    const guests = (guestRes.data || []).map((g) => mapToParticipant(g, true));

    return [...players, ...guests];
};

const addParticipant = async (participant) => {
    const base = getEndpointBase(!!participant.isGuest);

    // your API currently uses PUT to create/update
    const payload = {
        id: participant.id,
        name: participant.name,
        team: participant.team,
        shirtno: participant.shirtno,
    };

    const response = await axios.put(`${apiBaseUrl}/${base}`, payload);
    return response.status === 200;
};

const updateParticipant = async (participant) => {
    const base = getEndpointBase(!!participant.isGuest);

    const payload = {
        id: participant.id,
        name: participant.name,
        team: participant.team,
        shirtno: participant.shirtno,
    };

    const response = await axios.put(`${apiBaseUrl}/${base}`, payload);
    return response.status === 200;
};

const deleteParticipant = async ({ id, isGuest }) => {
    const base = getEndpointBase(!!isGuest);
    const response = await axios.delete(`${apiBaseUrl}/${base}/${id}`);
    return response.status === 200;
};

export {
    fetchAllParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
};
