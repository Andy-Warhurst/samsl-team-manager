import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    return (
        <nav>
            <ul  className="nav-bar">
                <li>
                    <NavLink
                        to="/home"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        About
                    </NavLink>
                </li>
                {/*<li><NavLink to="/services"*/}
                {/*             className={({isActive}) => (isActive ? 'active' : undefined)}>Services</NavLink></li>*/}
                {/*<li><NavLink to="/guests" className={({isActive}) => (isActive ? 'active' : undefined)}>Guests</NavLink>*/}
                {/*</li>*/}
                {/*<li><NavLink to="/print" className={({isActive}) => (isActive ? 'active' : undefined)}>Print</NavLink>*/}
                {/*</li>*/}
                {/*<li><NavLink to="/loadPlayers" className={({isActive}) => (isActive ? 'active' : undefined)}>Load</NavLink>*/}
                {/*</li>*/}
            </ul>
        </nav>
    );
}

export default NavBar;
