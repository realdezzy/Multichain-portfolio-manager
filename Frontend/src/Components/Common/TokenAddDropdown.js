// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
// import React from 'react';

import React, { useState, useEffect } from 'react';
import { addToken } from '../../helpers/backend_helper'
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

const TokenForm = () => {
//   const dispatch = useDispatch();


  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sucess, setSuccess] = useState(false);



  const validationSchema = Yup.object({
    tokenname: Yup.string().required('Token Name is required'),
    symbol: Yup.string().required('Symbol is required'),
    ticker: Yup.string(),
    quantity: Yup.number()
      .required('Amount is required')
      .positive('Amount must be a positive number'),
  });

  const initialValues =  {
    tokenname: '',
    symbol: '',
    ticker: '',
    quantity: '',
  }

  const handleSubmit = (values) => {
    console.log(values);
    addToken(values)
      .then(() => {
        setErrorMessage('');
        setSuccess(true);
        // setShowForm(!showForm);
        // resetForm();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
    }
  useEffect(() => {},[sucess]);

  return (
    <div className=" dropdown">
      <button
        className="btn btn-icon btn-topbar shadow-none btn-ghost-secondary"
        onClick={() => setShowForm(!showForm)}
        style={{ cursor: 'pointer' }}
      ><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
    </svg>
    </button>
      {showForm && (
        <>
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <div className="dropdown-menu-lg p-0 dropdown-menu-end dropdown-menu show">
                <Form>
                  <div className="form-group dropdown-item">
                    <label htmlFor="tokenname">Token Name</label>
                    <Field
                      type="text"
                      className="form-control"
                      id="tokenname"
                      name="tokenname"
                    />
                    <ErrorMessage
                      name="tokenname"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group dropdown-item">
                    <label htmlFor="symbol">Symbol</label>
                    <Field
                      type="text"
                      className="form-control"
                      id="symbol"
                      name="symbol"
                    />
                    <ErrorMessage
                      name="symbol"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group dropdown-item">
                    <label htmlFor="ticker">Ticker</label>
                    <Field
                      type="text"
                      className="form-control"
                      id="ticker"
                      name="ticker"
                    />
                    <ErrorMessage
                      name="ticker"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group dropdown-item">
                    <label htmlFor="quantity">Amount</label>
                    <Field
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger dropdown-item" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="dropdown-item align-center">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </Form>
              </div>
            </Formik>
        </>
      )}
    </div>
  );
};

export default TokenForm;