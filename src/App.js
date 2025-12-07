// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import About from "./About";
import Services from "./Services";
import ErrorPage from "./ErrorPage";
import Guests from "./features/squads/Guests";
// import PrintTeamsheet from "./features/squads/PrintTeamsheet";

import AuthenticationGuard from "./auth/authentication-guard";

import { FixtureProvider } from "./features/fixtures/FixtureContext";
import { PlayerProvider } from "./features/squads/PlayerContext";
import { GuestProvider } from "./features/squads/GuestContext";
import { DataProvider } from "./features/squads/DataContext";

import Layout from "./layouts/AppLayout";

// NEW: referee bits
import { RefereeProvider } from "./features/matchEvents/RefereeContext";
import RefereeDashboard from "./features/matchEvents/RefereeDashboard";

function App() {
    return (
        <FixtureProvider>
            <PlayerProvider>
                <GuestProvider>
                    <DataProvider>
                        <RefereeProvider>
                            <div className="App">
                                <Router>
                                    <Layout>
                                        <Routes>
                                            {/* Main app routes */}
                                            <Route path="/" element={<Home />} />
                                            <Route path="/home" element={<Home />} />
                                            <Route path="/about" element={<About />} />
                                            <Route path="/services" element={
                                                <AuthenticationGuard component={Services} />
                                            } />
                                            <Route path="/guests" element={<Guests />} />

                                            {/* NEW: referee routes */}
                                            <Route path="/raw-ref" element={<RefereeDashboard />} />
                                            <Route
                                                path="/ref"
                                                element={
                                                    <AuthenticationGuard component={RefereeDashboard} />
                                                }
                                            />

                                            {/* Fallback */}
                                            <Route path="*" element={<ErrorPage />} />
                                        </Routes>
                                    </Layout>
                                </Router>
                            </div>
                        </RefereeProvider>
                    </DataProvider>
                </GuestProvider>
            </PlayerProvider>
        </FixtureProvider>
    );
}

export default App;
