import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home  from './Home';
import About from './About';
import Services from './Services';
import ErrorPage from './ErrorPage';
import Guests from './Guests';
import AuthenticationGuard from './authentication-guard';
import PrintTeamsheet from './PrintTeamsheet';

import { FixtureProvider } from './FixtureContext';
import { PlayerProvider  } from './PlayerContext';
import { GuestProvider   } from './GuestContext';
import { DataProvider    } from './DataContext';

import Layout from './components/Layout/Layout';

function App() {
    return (
        <FixtureProvider>
            <PlayerProvider>
                <GuestProvider>
                    <DataProvider>
                        <Router>
                            <Layout>
                                <Routes>
                                    <Route path="/home"     element={<Home />} />
                                    <Route path="/about"    element={<About />} />
                                    <Route path="/guests"   element={<Guests />} />
                                    <Route path="/print"    element={<PrintTeamsheet />} />
                                    <Route
                                        path="/services"
                                        element={<AuthenticationGuard component={Services} />}
                                    />
                                    <Route path="/"         element={<Home />} />
                                    <Route path="*"         element={<ErrorPage />} />
                                </Routes>
                            </Layout>
                        </Router>
                    </DataProvider>
                </GuestProvider>
            </PlayerProvider>
        </FixtureProvider>
    );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home  from './Home'
// import About from './About'
// import Services from './Services'
// import Header from './Header';
// import NavBar from './NavBar';
// import ErrorPage from './ErrorPage';
// import Guests from "./Guests";
// import AuthenticationGuard from './authentication-guard';
// import PrintTeamsheet from "./PrintTeamsheet";
// import { DataProvider } from './DataContext';
// import {GuestProvider} from "./GuestContext";
// import {FixtureProvider} from "./FixtureContext";
// import {PlayerProvider} from "./PlayerContext";
//
// function App() {
//
//     return (
//         <div>
//             <FixtureProvider>
//                 <PlayerProvider>
//                     <GuestProvider>
//                         <DataProvider>
//                             <Router>
//                                 <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
//
//                                     <Header/>
//                                     <div style={{display: 'flex', flexGrow: 1}}>
//                                         <div style={{ width: '200px', background: '#f0f0f0' }}><NavBar /></div>
//                                         <div style={{ width: '800px', background: '#f8f8f8'}}>
//                                             <Routes>
//                                                 <Route path="/home" element={<Home/>} />
//                                                 <Route path="/about" element={<About />} />
//                                                 <Route path="/guests" element={<Guests />} />
//                                                 <Route path="/print" element={<PrintTeamsheet />} />
//                                                 <Route
//                                                     path="/services"
//                                                     element={<AuthenticationGuard component={Services} />}
//                                                 />
//                                                 <Route path="/" element={<Home />} />
//                                                 <Route path="*" element={<ErrorPage />} />
//                                             </Routes>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Router>
//                         </DataProvider>
//
//                     </GuestProvider>
//                 </PlayerProvider>
//             </FixtureProvider>
//         </div>
//     );
// }
//
// export default App;
