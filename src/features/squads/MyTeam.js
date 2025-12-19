import React from "react";
import '../../Styles.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Guests from "./Guests";

function MyTeam() {

    return (

        <div>
            <Container>
                <Row>
                    <Col>
                        <h3>Players</h3>
                        <Guests/>
                        <br/>
                        <br/>
                    </Col>
                    <Col>
                    <hr/>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default MyTeam;
