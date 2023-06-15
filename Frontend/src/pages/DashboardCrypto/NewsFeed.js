import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { getNewsData } from '../../helpers/backend_helper';
import Spinner from 'react-bootstrap/Spinner';

const NewsFeed = () => {
    const [newsFeed, setNewsFeed] = useState([]);
    
    useEffect(() => {
        getNewsData()
        .then(json => setNewsFeed(json))
    },[]);

    return (
        <React.Fragment>
            <Col xxl={4}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">News Feed</h4>
                        <div>
                            <button type="button" className="btn btn-soft-primary btn-sm">
                                View all
                            </button>
                        </div>
                    </CardHeader>

                    <CardBody>
                        {(Array.isArray(newsFeed) && newsFeed.length > 0)? (newsFeed || []).map((item, key) => (
                            <div className={item.id === 1 ? "d-flex align-middle" : "d-flex mt-4"} key={key}>
                                <div className="flex-shrink-0">
                                    <img src={item.image_url} className="rounded img-fluid" style={{ height: "60px" }} alt="" />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h6 className="mb-1 lh-base"><Link to={item.link} target="_blank" className="text-reset">{item.title}</Link></h6>
                                    <p className="text-muted fs-12 mb-0">{item.pubDate} <i className="mdi mdi-circle-medium align-middle mx-1"></i>{item.time}</p>
                                </div>
                            </div>
                        )): <span className="" >Loading...</span> 
                        }
                        <div className="mt-3 text-center">
                            <Link to="#" className="text-muted text-decoration-underline">View all News</Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default NewsFeed;