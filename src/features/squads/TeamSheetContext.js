import React, {
    createContext,
    useContext,
    useState,
    useCallback
} from "react";

import {
    unlockTeamSheet,
    fetchTeamSheetForFixtureAndTeam,
    upsertTeamSheet,
    lockTeamSheet,
} from "../../shared/api/TeamSheetService";

const TeamSheetContext = createContext();

export const useTeamSheet = () => useContext(TeamSheetContext);

export const TeamSheetProvider = ({ children }) => {
    const [teamSheet, setTeamSheet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Load a team sheet for a fixture + team
     */
    const loadTeamSheet = useCallback(async (fixtureId, teamName) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTeamSheetForFixtureAndTeam(fixtureId, teamName);
            setTeamSheet(data || null);
        } catch (err) {
            console.error("Failed to load team sheet", err);
            setError("Failed to load team sheet");
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Save or update team sheet (Submit Selections)
     */
    const submitTeamSheet = useCallback(async (sheet) => {
        setSaving(true);
        setError(null);
        try {
            const saved = await upsertTeamSheet(sheet);
            setTeamSheet(saved);
            return saved;
        } catch (err) {
            console.error("Failed to save team sheet", err);
            setError("Failed to save team sheet");
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    /**
     * Lock team sheet (manager submits; referee sees it as locked)
     */
    const lockSheet = useCallback(async () => {
        if (!teamSheet?.id) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await lockTeamSheet(teamSheet.id);
            setTeamSheet(updated);
            return updated;
        } catch (err) {
            console.error("Failed to lock team sheet", err);
            setError("Failed to lock team sheet");
            throw err;
        } finally {
            setSaving(false);
        }
    }, [teamSheet]);

    /**
     * Unlock team sheet (referee override)
     */
    const unlockSheet = useCallback(async () => {
        if (!teamSheet?.id) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await unlockTeamSheet(teamSheet.id);
            setTeamSheet(updated);
            return updated;
        } catch (err) {
            console.error("Failed to unlock team sheet", err);
            setError("Failed to unlock team sheet");
            throw err;
        } finally {
            setSaving(false);
        }
    }, [teamSheet]);

    const value = {
        teamSheet,
        loading,
        saving,
        error,
        loadTeamSheet,
        submitTeamSheet,
        lockSheet,
        unlockSheet
    };

    return (
        <TeamSheetContext.Provider value={value}>
            {children}
        </TeamSheetContext.Provider>
    );
};
