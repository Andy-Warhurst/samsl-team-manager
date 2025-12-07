// src/features/matchEvents/RefereeContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
    fetchAllocatedFixtures,
    fetchTeamSelections,
    lockTeamSelections,
    fetchMatchEvents,
    saveMatchEvent,
    deleteMatchEvent,
    requestTeamConfirmation,
    submitMatchReport,
} from "./refereeService";

const RefereeContext = createContext();

export const useReferee = () => useContext(RefereeContext);

export const RefereeProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth0();

    const [allocatedFixtures, setAllocatedFixtures] = useState([]);
    const [selectedFixtureId, setSelectedFixtureId] = useState(null);
    const [teamSelections, setTeamSelections] = useState(null);
    const [matchEvents, setMatchEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Load fixtures allocated to this referee
    useEffect(() => {
        const loadFixtures = async () => {
            if (!isAuthenticated || !user?.email) {
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const fixtures = await fetchAllocatedFixtures(user.email);
                setAllocatedFixtures(fixtures || []);
            } catch (e) {
                console.error("Failed to load referee fixtures", e);
                setError("Failed to load your fixtures.");
            } finally {
                setLoading(false);
            }
        };

        loadFixtures();
    }, [isAuthenticated, user]);

    const currentFixture = useMemo(
        () => allocatedFixtures.find((f) => f.id === selectedFixtureId) || null,
        [allocatedFixtures, selectedFixtureId]
    );

    const selectFixture = async (fixtureId) => {
        setSelectedFixtureId(fixtureId);
        if (!fixtureId) {
            setTeamSelections(null);
            setMatchEvents([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const [selections, events] = await Promise.all([
                fetchTeamSelections(fixtureId),
                fetchMatchEvents(fixtureId),
            ]);
            setTeamSelections(selections);
            setMatchEvents(events || []);
        } catch (e) {
            console.error("Failed to load match data", e);
            setError("Failed to load match data.");
        } finally {
            setLoading(false);
        }
    };

    const refreshMatchData = async () => {
        if (!selectedFixtureId) return;
        await selectFixture(selectedFixtureId);
    };

    const lockSelections = async () => {
        if (!selectedFixtureId) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await lockTeamSelections(selectedFixtureId);
            // Update local fixture list with the returned fixture
            setAllocatedFixtures((prev) =>
                prev.map((f) => (f.id === updated.id ? { ...f, ...updated } : f))
            );
            // Also refresh selections
            setTeamSelections((prev) => ({ ...prev, isLocked: true }));
        } catch (e) {
            console.error("Failed to lock team selections", e);
            setError("Failed to lock team selections.");
        } finally {
            setSaving(false);
        }
    };

    const addOrUpdateEvent = async (event) => {
        if (!selectedFixtureId) return;
        setSaving(true);
        setError(null);
        try {
            const saved = await saveMatchEvent(selectedFixtureId, event);
            setMatchEvents((prev) => {
                const existingIndex = prev.findIndex((e) => e.id === saved.id);
                if (existingIndex >= 0) {
                    const copy = [...prev];
                    copy[existingIndex] = saved;
                    return copy;
                }
                return [...prev, saved];
            });
        } catch (e) {
            console.error("Failed to save match event", e);
            setError("Failed to save match event.");
        } finally {
            setSaving(false);
        }
    };

    const removeEvent = async (eventId) => {
        if (!selectedFixtureId) return;
        setSaving(true);
        setError(null);
        try {
            await deleteMatchEvent(selectedFixtureId, eventId);
            setMatchEvents((prev) => prev.filter((e) => e.id !== eventId));
        } catch (e) {
            console.error("Failed to delete match event", e);
            setError("Failed to delete match event.");
        } finally {
            setSaving(false);
        }
    };

    const sendConfirmationRequests = async () => {
        if (!selectedFixtureId) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await requestTeamConfirmation(selectedFixtureId);
            setAllocatedFixtures((prev) =>
                prev.map((f) => (f.id === updated.id ? { ...f, ...updated } : f))
            );
        } catch (e) {
            console.error("Failed to request confirmation", e);
            setError("Failed to request confirmation from teams.");
        } finally {
            setSaving(false);
        }
    };

    const submitReport = async () => {
        if (!selectedFixtureId) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await submitMatchReport(selectedFixtureId);
            setAllocatedFixtures((prev) =>
                prev.map((f) => (f.id === updated.id ? { ...f, ...updated } : f))
            );
            // After successful submission, go back to the fixture list
            setSelectedFixtureId(null);
            setTeamSelections(null);
            setMatchEvents([]);
        } catch (e) {
            console.error("Failed to submit match report", e);
            setError("Failed to submit match report.");
        } finally {
            setSaving(false);
        }
    };

    const value = {
        loading,
        saving,
        error,
        allocatedFixtures,
        selectedFixtureId,
        currentFixture,
        teamSelections,
        matchEvents,
        selectFixture,
        refreshMatchData,
        lockSelections,
        addOrUpdateEvent,
        removeEvent,
        sendConfirmationRequests,
        submitReport,
    };

    return <RefereeContext.Provider value={value}>{children}</RefereeContext.Provider>;
};
