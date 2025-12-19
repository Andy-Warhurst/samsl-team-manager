import {useAuth0} from "@auth0/auth0-react";
import * as React from "react";
import MyTeam from "./features/squads/MyTeam";
import {useEffect, useState} from "react";
import {useFixtures} from "./features/fixtures/FixtureContext";
import {useData} from "./features/squads/DataContext";
import TeamsDropdown from "./features/squads/TeamsDropdown";
import FixtureDropdown from "./features/fixtures/FixtureDropdown";
// import rego from "./assets/SAMSL_Register.png";
import {useParticipants} from "./features/squads/ParticipantContext";

function Home() {
    const {isAuthenticated, user} = useAuth0();
    const {getTeamsForUser, loading: dataLoading} = useData();
    const {fixtures, loading: fixturesLoading} = useFixtures();
    const {loading: guestsLoading} = useParticipants();
    let myTeam = "";
    let myTeams = [];

    const [allDataLoaded, setAllDataLoaded] = useState(false);

    useEffect(() => {
        // Check if all contexts are done loading
        if (!fixturesLoading && !dataLoading && !guestsLoading ) {
            setAllDataLoaded(true);
        }
    }, [fixturesLoading, dataLoading, guestsLoading]);

    function isMoreThanOne() {
        return (myTeams.length > 1);
    }

    if (!allDataLoaded) {
        return <div>Loading...</div>;
    }
    if (isAuthenticated) {

        myTeams = getTeamsForUser(user.email);
        if (myTeams.length > 0) {
            myTeam = myTeams[0]; // Set the first matching team name
        }
    }
    return (
        <div>
            {!isAuthenticated && (
                <>

                    <h1>Welcome to the SAMSL Team Manager App.</h1>

                    <p>You need to login to use this App</p>
                    {/*<p>, so if you don't already have a login follow these instructions.</p>*/}


                    {/*<img src={rego} className="rego-image" alt="Registration Instructions"/>*/}
                </>
            )}
            {isAuthenticated && (
                <>

                    {/*<div className="container">*/}
                        <div className="component">
                            {isMoreThanOne ? (
                                <TeamsDropdown teams={myTeams}/>
                            ) : (
                                <h1>{myTeam}</h1>
                            )}
                        </div>
                        <div className="component">
                            <FixtureDropdown fixtures={fixtures} team={myTeam}/>
                        </div>
                    {/*</div>*/}

                    <MyTeam
                    />
                </>

            )}

        </div>
    );
}

export default Home;
