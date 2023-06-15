import React, { useState, useEffect } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import TokenUpdate from '../../Components/Common/UpdateToken';
import DeleteButton from '../../Components/Common/DeleteButton';
import TokenForm from '../../Components/Common/TokenAddDropdown';


// import { PortfolioCharts } from './DashboardCryptoCharts';

const MyPortfolio = () => {
    const dispatch = useDispatch();

    const [portfolioData, setPortfolioData] = useState([]);

    const { tokenData } = useSelector(state => ({
        tokenData: state.NewDashboardCrypto.tokenData
    }));

    useEffect(() => {
        if (tokenData.length > 8) {
            setPortfolioData(tokenData.slice(0, 8));
        }
        else {
            setPortfolioData(tokenData);
        }
    }, [tokenData]);
    return (
        <React.Fragment>
            <div className="col-xxl-3">
                <div className="card card-height-100">
                    <div className="card-header border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">My Portfolio</h4>
                        <div>
                            <UncontrolledDropdown direction='start'>
                                <TokenForm />
                            </UncontrolledDropdown>
                        </div>
                    </div>
                    <div className="card-body overflow-visible ">
                        {/* <PortfolioCharts series={chartData} dataColors='["--vz-primary", "--vz-info", "--vz-warning", "--vz-success"]' /> */}

                        <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">
                            {(Array.isArray(portfolioData) && portfolioData.length > 0) ? (portfolioData || []).map((item) => (
                                <li className="list-group-item px-0" key={item.data.uuid} >
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 avatar-xs">
                                            <span className="avatar-title bg-light p-1 rounded-circle">
                                                <img src={item.data.iconUrl} className="img-fluid" alt="" />
                                            </span>
                                        </div>
                                        <div className="flex-grow-1 ms-2">
                                            <h6 className="mb-1">{item.data.name}</h6>
                                            <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>{item.token.symbol}</p>
                                        </div>
                                        <TokenUpdate item={item}/>
                                        <DeleteButton item={item}/>
                                    </div>
                                </li>
                            )): <div className="success align-item-center"> Click the <svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                          </svg> button 
                            above to add a token to your Portfolio</div>} 
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MyPortfolio;