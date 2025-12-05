import React from "react";
import './Styles.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Selector from "./Selector";
import PrintTeamsheet from "./PrintTeamsheet";
import Guests from "./Guests";

function MyTeam() {

    return (

        <div>
            <Container>
                <Row>
                    {/*<Col>*/}
                    {/*    <h3>Players</h3>*/}
                    {/*    <div style={{padding: 4}}>*/}
                    {/*        <Selector />*/}
                    {/*    </div>*/}
                    {/*</Col>*/}
                    <Col>
                        <h3>Players</h3>
                        <Guests/>
                        <hr/>
                        <PrintTeamsheet/>
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
