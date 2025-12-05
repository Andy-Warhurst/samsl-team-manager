import {
    Link,
} from "react-router-dom";
import * as React from "react";

function About() {
    return (
        <div>
            <h1>About Page</h1>
            <p>
                Version: 1.1.4 - Updated the player selection interface.
            </p>
            <p>
                Date: 03 December 2025
            </p>
            <Link to="/">Home</Link>
        </div>
    );
}

export default About;
