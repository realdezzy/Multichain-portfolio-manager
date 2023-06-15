import React, { useState, useEffect, useCallback } from 'react';
import MarketCharts from './DashboardCryptoCharts';
import { useSelector, useDispatch } from "react-redux";
import { getMarketGraphData } from '../../slices/thunks';
import {
     Card,
     CardBody,
     CardHeader,
     Col,
     Row,
     Dropdown,
     UncontrolledDropdown,
     DropdownItem,
     DropdownToggle,
     DropdownMenu
     } from 'reactstrap';
import { isArray } from 'lodash';

const MarketGraph = () => {
    const dispatch = useDispatch();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [time, setTime] = useState("24h");
    const [chartData, setChartData] = useState([]);
    const [selectedToken, setSelectedToken] = useState('');
    const [tokens, setTokens] = useState([]);

    const { tokenData } = useSelector(state => ({
        tokenData: state.NewDashboardCrypto.tokenData
    }));

    const { marketData } = useSelector(state => ({
        marketData: state.NewDashboardCrypto.marketGraphData

    }));

    


// Functions 
    const setdefaultChartData = (firstToken) =>{
        console.log("Default",firstToken);
        const symbol = firstToken.data.symbol;
        dispatch(getMarketGraphData(firstToken.data.uuid));
        setSelectedToken(symbol);
    };
    const changeTime = (timeToSet) => {
        if (timeToSet !== time){
            setTime(timeToSet);
        }
        console.log('changeTime', time);
    }

    const toggleDropDown = () => { setDropdownOpen((prevState) => !prevState);};

    const getTokenHistory = (token) => {
        if(token.uuid){
            dispatch(getMarketGraphData(token.data.uuid));
            setSelectedToken(token.token.symbol)
        }

    };
    console.log(selectedToken);

// useEffects

    useEffect(() => {
        if (tokens.length > 0) {
            setdefaultChartData(tokens[0]);
        }
    },[tokens]);

    useEffect(() => {
        // getSelectedTokenSymbol(tokenData);
        setTokens(tokenData);
    },[tokenData])

    // useEffect(() => {}, [selectedToken]);

    useEffect(() => {
        let marketDataTemp = marketData?.data?.history;
        let formattedForApex;
        if(isArray(marketDataTemp)) {
            formattedForApex = marketDataTemp.map(data => {
                return {x: (data.timestamp * 1000), y: Number(data.price).toFixed(5)};
            });
            console.log([{data: formattedForApex}]);
        }
        setChartData([{type:"line", data: formattedForApex}]);
    }, [marketData]);
    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="border-0 align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Market Graph</h4>
                            <div className="d-flex gap-1">
                                <div className=""><button className="btn btn-soft-primary btn-sm" onClick={() => changeTime("12h")}>12H</button></div>
                                <div className=""><button className="btn btn-soft-primary btn-sm" onClick={() => changeTime("24h")}>24H</button></div>
                                <div className=""><button className="btn btn-soft-primary btn-sm" onClick={() => changeTime("30d")}>M</button></div>
                                <div className=""><button className="btn btn-soft-primary btn-sm" onClick={() => changeTime("1y")}>1Y</button></div>
                                <div>
                                <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown} direction='start'>
                                    <DropdownToggle tag="button" className="btn btn-soft-primary btn-sm" >
                                        <span className="text-uppercase">{selectedToken}<i className="mdi mdi-chevron-down align-middle ms-1"></i></span>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu dropdown-menu-end" container='body'>
                                        {(Array.isArray(tokens)) ? (tokens || []).map( item => (
                                        <DropdownItem key={item.data.uuid}
                                         onClick={e => {
                                            e.preventDefault();
                                            getTokenHistory(item)}}
                                         className={(selectedToken === item.token.symbol) ? "active" : ""}>
                                            {item.token.symbol}
                                        </DropdownItem>
                                    )): null}
                                    </DropdownMenu>
                                </Dropdown>
                                </div>
                            </div>
                        </CardHeader>
                        {/* <CardBody className="p-0">
                            <div className="bg-soft-light border-top-dashed border border-start-0 border-end-0 border-bottom-dashed py-3 px-4">
                                <Row className="align-items-center">
                                    <Col xs={6}>
                                        <div className="d-flex flex-wrap gap-4 align-items-center">
                                            <h5 className="fs-19 mb-0">0.014756</h5>
                                            <p className="fw-medium text-muted mb-0">$75.69 <span className="text-success fs-11 ms-1">+1.99%</span></p>
                                            <p className="fw-medium text-muted mb-0">High <span className="text-dark fs-11 ms-1">0.014578</span></p>
                                            <p className="fw-medium text-muted mb-0">Low <span className="text-dark fs-11 ms-1">0.0175489</span></p>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-end text-end flex-wrap gap-4 ms-auto">
                                                <div className="pe-3">
                                                    <h6 className="mb-2 text-truncate text-muted">Total Balance</h6>
                                                    <h5 className="mb-0">$72.8k</h5>

                                                </div>
                                                <div className="pe-3">
                                                    <h6 className="mb-2 text-muted">Profit</h6>
                                                    <h5 className="text-success mb-0">+$49.7k</h5>
                                                </div>
                                                <div className="pe-3">
                                                    <h6 className="mb-2 text-muted">Loss</h6>
                                                    <h5 className="text-danger mb-0">-$23.1k</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                                        </CardBody>*/}
                        <div className="card-body p-0 pb-3 btn-ghost-secondary" >
                            <MarketCharts series={chartData} dataColors='["--vz-success", "--vz-danger"]' />
                        </div>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default MarketGraph;