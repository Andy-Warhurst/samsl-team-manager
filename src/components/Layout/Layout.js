import React from 'react';
import Header from '../../Header';
// import NavBar from '../../NavBar';
import './Layout.css';

export default function Layout({ children }) {
    return (
        <div className="layout">
            <header className="layout__header">
                <Header />
            </header>

            {/*<aside className="layout__sidebar">*/}
            {/*    <NavBar />*/}
            {/*</aside>*/}

            <main className="layout__content">
                {children}
            </main>

            {/* Optional: if you have a Footer component, plug it in here */}
            {/* <footer className="layout__footer"><Footer/></footer> */}
        </div>
    );
}
