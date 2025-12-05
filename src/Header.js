import './Header.css';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
// import logo from "./assets/SAMSL_Official_Logo.svg";
import Banner from "./Banner";

function Header() {
    const { isAuthenticated } = useAuth0();
    return (
        <div>
        <header className={"App-header"}>
            {/*<div className={"Header-spacer"}/>*/}
            {/*<img src={logo} className="App-logo" alt="logo" />*/}
            <div className={"Header-spacer"}/>
            <Banner />
            <div className={"Header-spacer"}/>

            {!isAuthenticated && (
                <>
                    <LoginButton></LoginButton>
                </>
            )}
            {isAuthenticated && (
                <>
                    <LogoutButton />
                </>
            )}

            <div className={"Header-spacer"}/>
        </header>

    </div>

    );
}

export default Header;
