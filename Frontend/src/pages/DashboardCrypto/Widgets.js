import React, {useState, useEffect } from 'react';
import CountUp from "react-countup";
import { Card, CardBody, Col } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
// import { getTokenData } from '../../slices/thunks';

const Widgets = () => {
    // const dispatch = useDispatch();

    const [currencies, setCurrencies] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [total, setTotal] = useState(0);

    const { tokenData } = useSelector(state => ({
        tokenData: state.NewDashboardCrypto.tokenData
    }));

    useEffect(() => {
        setCurrencies(tokenData);
    }, [tokenData]);
    useEffect(() => {
        updateItems();
    }, [currencies]);

    let item = {
        icon: "ri-money-dollar-circle-fill",
        badgeUp: "ri-arrow-up-s-fill",
        badgeDown: "ri-arrow-down-s-fill",
        badgeColorSuccess: "success",
        badgeColorDanger: "danger",
        decimal: "2",
        prefix: "$",
        separator: ","
    }

    const updateItems = () => {
        let total = 0;
        let change = 0;
        if (currencies) {
            currencies.forEach(currency => {
                change += Number(currency.data.change);
                total += (Number(currency.token.quantity) * Number(currency.data.price));
            });
            setTotal(total);
            setPercentage(change);
        }
    }

    
    return (
        <React.Fragment>
            <Col lg={4} md={6}  >
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="avatar-sm flex-shrink-0">
                                    <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                                        <i className={"align-middle " + item.icon}></i>
                                    </span>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">{"Current Worth"}</p>
                                    <h4 className=" mb-0"> <CountUp start={0} end={total} decimals={2} separator={item.separator} prefix={'$'} duration={3} />
                                    </h4>
                                </div>
                                <div className="flex-shrink-0 align-self-end">
                                    </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4} md={6} >
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="avatar-sm flex-shrink-0">
                                    <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                                        <i className={"align-middle " + ((percentage >= 0) ? item.badgeUp: item.badgeDown)}></i>
                                    </span>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">{"Total 24H Change"}</p>
                                    {/* <h4 className=" mb-0"> <CountUp start={0} end={percentage} decimals={2} separator={","} suffix={"%"} duration={3} />
                                    </h4> */}
                                    <h4 className={"badge badge-soft-" + ((percentage >= 0) ? item.badgeColorSuccess : item.badgeColorDanger)}><i className={"align-middle " + ((percentage >= 0) ? item.badgeUp: item.badgeDown)}></i>{(percentage).toFixed(2)} %</h4>
                                </div>
                                {/* <div className="flex-shrink-0 align-self-end">
                                    <h4 className={"badge badge-soft-" + ((percentage >= 0) ? item.badgeColorSuccess : item.badgeColorDanger)}><i className={"align-middle " + ((percentage >= 0) ? item.badgeUp: item.badgeDown)}></i>{(percentage).toFixed(2)} %</h4></div> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* <Col lg={4} md={6} >
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="avatar-sm flex-shrink-0">
                                    <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                                        <i className={"align-middle " + item.icon}></i>
                                    </span>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">{"Day Change"}</p>
                                    <h4 className=" mb-0"> <CountUp start={0} end={item.counter} decimals={"2"} separator={","} prefix={"$"} duration={3} />
                                    </h4>
                                </div>
                                <div className="flex-shrink-0 align-self-end">
                                    <span className={"badge badge-soft-" + item.badgeColor}><i className={"align-middle me-1 " + item.badge}></i>{item.percentage} %<span>
                                    </span></span></div>
                            </div>
                        </CardBody>
                    </Card>
                </Col> */}
        </React.Fragment>
    );
};

export default Widgets;