import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';


const ProfileDropdown = () => {

    const { user } = useSelector(state => ({
        user: state.Profile.user,
    }));

    const [userName, setUserName] = useState("Person");

    useEffect(() => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            setUserName(obj.username === undefined ? obj.username : obj.username);
        }
    }, [userName, user]);

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn shadow-none btn-ghost-secondary">
                    <span className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
                            <p></p>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">

                    <h6 className="dropdown-header">Welcome {userName}!</h6>
                    {/* <DropdownItem href={process.env.PUBLIC_URL + "/profile"}><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Profile</span></DropdownItem> */}
                    <DropdownItem href={process.env.PUBLIC_URL + "/logout"}><i
                        className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle" data-key="t-logout">Logout</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;