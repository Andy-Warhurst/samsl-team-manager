import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import { fetchAllUserTeams } from '../../shared/api/DataService';
import Round from "../fixtures/Round";

const DataContext = createContext(undefined);

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {

    // ✅ Hooks must live here
    const { user, isAuthenticated, isLoading } = useAuth0();

    const userEmail = isAuthenticated ? user?.email : null;

    const [data, setData] = useState({
        userTeams: [],
        selectedPlayers: [],
        theTeamName: "Unknown",
        homeTeamName: "Unknown",
        awayTeamName: "Unknown",
        dateAndTime: "Unknown",
        venue: "Unknown",
        round: "Unknown",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Don’t fetch until Auth0 is ready
        if (isLoading || !userEmail) return;

        const fetchData = async () => {
            const result = await fetchAllUserTeams();

            const teamName = result.find(t => t.email === userEmail)?.team || "Unknown";

            setData({
                userTeams: result,
                selectedPlayers: [],
                theTeamName: teamName,
                homeTeamName: "Home Team",
                awayTeamName: "Away Team",
                dateAndTime: "KO Time",
                venue: "Place and Pitch",
                round: Round(),
            });

            setLoading(false);
        };

        fetchData();
    }, [isLoading, userEmail]);

    const updateUserField = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getTeamForUser = (email) => {
        return data.userTeams.find(item => item.email === email)?.team || "";
    };

    const getTeamsForUser = (email) => {
        return data.userTeams
            .filter(item => item.email === email)
            .map(item => item.team);
    };

    return (
        <DataContext.Provider value={{
            loading,
            data,
            userEmail,          // 👈 exposed if you need it elsewhere
            getTeamForUser,
            getTeamsForUser,
            updateUserField
        }}>
            {children}
        </DataContext.Provider>
    );
};



//
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {
//     fetchAllUserTeams,
// } from '../../shared/api/DataService';
// import Round from "../fixtures/Round";
//
// import {useAuth0} from "@auth0/auth0-react";
//
// const { user, isAuthenticated } = useAuth0();
// const userEmail = isAuthenticated ? user?.email : null;
//
// const DataContext = createContext();
//
// export const useData = () => {
//     return useContext(DataContext);
// };
//
// export const DataProvider = ({ children }) => {
//
//     const [data, setData] = useState({
//         userTeams: [],
//         selectedPlayers: [],
//         theTeamName : "Unknown",
//         homeTeamName : "Unknown",
//         awayTeamName : "Unknown",
//         dateAndTime : "Unknown",
//         venue : "Unknown",
//         round : "Unknown",
//     });
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const result = await fetchAllUserTeams();
//             setData({
//                 userTeams: result,
//                 selectedPlayers: [],
//                 theTeamName : "The team (" + userEmail + ")",
//                 homeTeamName : "Home Team",
//                 awayTeamName : "Away Team",
//                 dateAndTime : "KO Time",
//                 venue : "Place and Pitch",
//                 round : Round(),
//             });
//             setLoading(false);
//         };
//         fetchData();
//     }, []);
//
//     // Function to update a specific field in the user state
//     const updateUserField = (field, value) => {
//         setData((prevUser) => ({
//             ...prevUser,
//             [field]: value
//         }));
//     };
//
//     const getTeamForUser = (theUserEmail) => {
//         for (let item of data.userTeams) {
//             if (item.email === theUserEmail) {
//                 //data.theTeamName = item.team;
//                 return item.team;
//             }
//         }
//         return "";
//     }
//
//     const getTeamsForUser = (theUserEmail) => {
//         const teams = [];
//         for (let item of data.userTeams) {
//             if (item.email === theUserEmail) {
//                 teams.push(item.team);
//             }
//         }
//         return teams;
//     }
//
//     return (
//         <DataContext.Provider value={{
//             loading,
//             data,
//             getTeamForUser,
//             getTeamsForUser,
//             updateUserField
//         }}>
//             {children}
//         </DataContext.Provider>
//     );
// };
