import React from "react";
import '../../Styles.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Guests from "./Guests";

function ManagerDashboard( { teams }) {

    return (

        <div>
            <Container>
                <Row>
                    <Col>
                        <Guests team={teams[0]}/>
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

export default ManagerDashboard;
