import React, {
    createContext,
    useContext,
    useState,
    useCallback
} from "react";

import * as service from "../../shared/api/TeamSheetService";

const TeamSheetContext = createContext();

export const useTeamSheet = () => useContext(TeamSheetContext);

export const TeamSheetProvider = ({ children }) => {
    const [teamSheet, setTeamSheet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ACTIONS (side effects)

    const loadTeamSheet = useCallback(async (teamName, round) => {
        setLoading(true);
        setError(null);
        try {const sheet = await service.getTeamSheet(teamName, round);
            setTeamSheet(sheet);
            return sheet;
        } catch (err) {
            console.error("Failed to load team sheet", err);
            setError(err.message || "Failed to load team sheet");
            setTeamSheet(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const saveTeamSheet = useCallback(async (sheet) => {
        const saved = await service.upsertTeamSheet(sheet);
        setTeamSheet(saved);
        return saved;
    }, []);

    /**
     * Lock team sheet (manager submits; referee sees it as locked)
     */
    const lockSheet = useCallback(async () => {
        if (!teamSheet?.id) return null;
        setError(null);
        const updated = await service.lockTeamSheet(teamSheet.id);
        setTeamSheet(updated);
        return updated;
    }, [teamSheet?.id]);

    /**
     * Unlock team sheet (referee override)
     */
    const unlockSheet = useCallback(async () => {
        if (!teamSheet?.id) return null;
        setError(null);
        const updated = await service.unlockTeamSheet(teamSheet.id);
        setTeamSheet(updated);
        return updated;
    }, [teamSheet?.id]);

    // GETTERS (pure)

    //const getTeamSheet = () => teamSheet;

    const getTeamSheet = (teamName, round)  => loadTeamSheet(teamName, round);

    const isPlayerSelected = (playerId) =>
        !! teamSheet?.players?.some((p) => p.id === playerId);


    const value = {
        teamSheet,
        loading,
        error,

        loadTeamSheet,
        saveTeamSheet,
        lockSheet,
        unlockSheet,

        getTeamSheet,
        isPlayerSelected,
    };

    return (
        <TeamSheetContext.Provider value={value}>
            {children}
        </TeamSheetContext.Provider>
    );
};
