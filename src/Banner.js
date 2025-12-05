import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './Styles.css';

const MyTeam = () => {
    const { isAuthenticated, user } = useAuth0();

    return (
        <div>
            {!isAuthenticated && (
                <>
                    <h2 style={{padding: '1px', margin: '2px' }} >SAMSL Manager 2026</h2>
                </>
            )}
            {isAuthenticated && (
                <>
                    <h3  style={{padding: '1px', margin: '2px' }}>SAMSL Manager 2026</h3>
                    <h5  style={{padding: '1px', margin: '2px' }}>{user.name}</h5>
                </>
            )}

        </div>
    );
};

export default MyTeam;
