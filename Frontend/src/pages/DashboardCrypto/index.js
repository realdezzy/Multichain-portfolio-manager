import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MarketGraph from './MarketGraph';
import MyCurrencies from './MyCurrencies';
import MyPortfolio from './MyPortfolio';
import NewsFeed from './NewsFeed';

import Widgets from './Widgets';
import Widgets1 from './Widgets1';


const DashboardCrypto = () => {
    document.title="Genio Crypto Dashboard";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Crypto" pageTitle="Dashboards" />
                    <Row>
                        <MyPortfolio />
                        <Col className="order-xxl-0 order-first">
                            <Row>
                                <Widgets />
                                <MarketGraph />
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Widgets1 />
                    </Row>
                    <Row>
                        <MyCurrencies />
                        <NewsFeed />
                    </Row>
                    
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardCrypto;