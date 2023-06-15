import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getTokenData } from '../../slices/thunks';
import {Spinner} from 'reactstrap'

const MyCurrencies = () => {

    const dispatch = useDispatch();

    const [currencies, setCurrencies] = useState([]);

    const { tokenData } = useSelector(state => ({
        tokenData: state.NewDashboardCrypto.tokenData
    }));


    useEffect(() => {
        dispatch(getTokenData());
    }, []);

    useEffect(() => {
        setCurrencies(tokenData);
    }, [tokenData]);

    return (
        <React.Fragment>
            <Col xl={8}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">My Currencies</h4>
                        <div className="flex-shrink-0">
                            <button className="btn btn-soft-primary btn-sm">24H</button>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                            <UncontrolledDropdown className="card-header-dropdown" direction='start'>
                    
                            </UncontrolledDropdown>
                        </div>
                    </CardHeader>
                    <div className="card-body">
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-borderless table-centered align-middle table-nowrap mb-0">
                                <thead className="text-muted bg-soft-light">
                                    <tr>
                                        <th>Coin Name</th>
                                        <th>Price</th>
                                        <th>24h Change</th>
                                        <th>Quantity</th>
                                        <th>Total Balance</th>
                                        {/* <th>Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(currencies) && currencies.length > 0) ? (currencies || []).map((item, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="me-2">
                                                        <img src={item.data.iconUrl} alt="" className="avatar-xxs" />
                                                    </div>
                                                    <div>
                                                        <h6 className="fs-14 mb-0">{item.token.symbol}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${Number(item.data.price).toFixed(5)}</td>
                                            <td><h6 className={"fs-13 mb-0 text-" + (Number(item.data.change) > 0) ? "success": "danger"}><i className={"align-middle me-1 "}></i>{Number(item.data.change).toFixed(2)}</h6></td>
                                            <td>{item.token.quantity}</td>
                                            <td>${Number(item.token.quantity * item.data.price).toFixed(5)}</td>
                                            {/* <td><Link to="/apps-crypto-buy-sell" className="btn btn-sm btn-soft-secondary">Trade</Link></td> */}
                                        </tr>
                                    )): <div className='d-flex align-items-center' ><span className="d-flex align-items-center" > Loading...</span></div> }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default MyCurrencies;