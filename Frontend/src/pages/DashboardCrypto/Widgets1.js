import React, {useState, useEffect} from 'react';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import { getMarketData } from '../../slices/thunks';
import { useSelector, useDispatch } from 'react-redux';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Grid, Mousewheel } from "swiper";
import { WidgetsCharts } from './DashboardCryptoCharts';

const Widgets1 = () => {
    const dispatch = useDispatch();

    const [currencies, setCurrencies] = useState([]);

    const { marketData } = useSelector(state => ({
        marketData: state.NewDashboardCrypto.marketData
    }));

    useEffect(() => {
        dispatch(getMarketData());
    }, []);

    useEffect(() => {
        setCurrencies(Array.isArray(marketData?.data?.coins) ? marketData?.data?.coins: []);
    }, [marketData]);

    return (
        <React.Fragment>
            <Col lg={12} md={6} >
                <Swiper
                    slidesPerView={6}
                    spaceBetween={24}
                    mousewheel={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      400:{
                        slidesPerView:2,
                      },
                      639: {
                        slidesPerView: 3,
                      },
                      865:{
                        slidesPerView:4
                      },
                      1000:{
                        slidesPerView:5
                      },
                      1500:{
                        slidesPerView:6
                      },
                      1700:{
                        slidesPerView:7
                      }
                    }}
                    
                    modules={[Autoplay, Mousewheel, Grid]}
                    className="cryptoSlider">

                    {(Array.isArray(currencies) && currencies.length > 0) ? (currencies || []).map((item) => (
                        <div  className='container-fluid'>
                            <SwiperSlide key={item.uuid} >
                                <Card>
                                    <CardBody>
                                        <div className="float-end">
                                            
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <img src={item.iconUrl} className="bg-light rounded-circle p-1 avatar-xs img-fluid" alt="" />
                                            <h6 className="ms-2 mb-0 fs-14">{item.name}</h6>
                                        </div>
                                        <Row className="align-items-end g-0">
                                            <Col xs={6}>
                                                <h5 className="mb-1 mt-4">{Number(item.price).toFixed(3)}</h5>
                                                <p className={"fs-13 fw-medium mb-0 text-" + ((Number(item.change) >= 0) ? 'success': 'danger')}>{item.change}<span className="text-muted ms-2 fs-10 text-uppercase">({item.symbol})</span></p>
                                            </Col>
                                            <Col xs={6}>
                                                <div className="apex-charts crypto-widget overflow-hidden" dir="ltr">
                                                    <WidgetsCharts seriesData={[{data: item.sparkline}]} chartsColor={item.color} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </SwiperSlide>
                        </div>
                    )) : null }
                </Swiper>
            </Col>
        </React.Fragment>
    );
};

export default Widgets1;