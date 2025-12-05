import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    fetchAllFixtures,
    addFixture,
    updateFixture,
    deleteFixture
} from './FixtureService';

const FixtureContext = createContext();

export const useFixtures = () => {
    return useContext(FixtureContext);
};

export const FixtureProvider = ({ children }) => {
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAllFixtures();
            setFixtures(result);
            setLoading(false);
        };
        fetchData();
    }, []);

    const addFixtureHandler = async (Fixture) => {
        const newFixture = await addFixture(Fixture);
        setFixtures((prevFixtures) => [...prevFixtures, newFixture]);
    };

    const updateFixtureHandler = async (updatedData) => {
        const updatedFixture = await updateFixture(updatedData.id, updatedData);
        setFixtures((prevFixtures) => prevFixtures.map((Fixture) => (Fixture.id === updatedData.id ? updatedFixture : Fixture)));
    };

    const deleteFixtureHandler = async (id) => {
        await deleteFixture(id);
        setFixtures((prevFixtures) => prevFixtures.filter((Fixture) => Fixture.id !== id));
    };

    return (
        <FixtureContext.Provider value={{ fixtures,
            loading,
            addFixture: addFixtureHandler,
            updateFixture: updateFixtureHandler,
            deleteFixture: deleteFixtureHandler }}>
            {children}
        </FixtureContext.Provider>
    );
};
