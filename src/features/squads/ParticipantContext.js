import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    fetchAllParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
} from "../../shared/api/ParticipantService";

const ParticipantContext = createContext();

export const useParticipants = () => useContext(ParticipantContext);

export const ParticipantProvider = ({ children }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load once on start
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchAllParticipants();
                setParticipants(result || []);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handy derived lists
    const players = useMemo(
        () => participants.filter((p) => !p.isGuest),
        [participants]
    );

    const guests = useMemo(
        () => participants.filter((p) => p.isGuest),
        [participants]
    );

    const addParticipantHandler = async (participant) => {
        const ok = await addParticipant(participant);
        if (ok) {
            setParticipants((prev) => [...prev, participant]);
        }
        return ok;
    };

    const updateParticipantHandler = async (participant) => {
        const ok = await updateParticipant(participant);
        if (ok) {
            setParticipants((prev) =>
                prev.map((p) => (p.id === participant.id && p.isGuest === participant.isGuest ? participant : p))
            );
        }
        return ok;
    };

    const deleteParticipantHandler = async (participant) => {
        // participant should contain { id, isGuest }
        const ok = await deleteParticipant(participant);
        if (ok) {
            setParticipants((prev) =>
                prev.filter((p) => !(p.id === participant.id && p.isGuest === participant.isGuest))
            );
        }
        return ok;
    };

    return (
        <ParticipantContext.Provider
            value={{
                participants,
                players,
                guests,
                loading,
                addParticipant: addParticipantHandler,
                updateParticipant: updateParticipantHandler,
                deleteParticipant: deleteParticipantHandler,
            }}
        >
            {children}
        </ParticipantContext.Provider>
    );
};
