import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { APIClient } from '../../helpers/api_helper';
import { Alert} from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';


const TokenUpdate = (props) => {
  const apiClient = new APIClient();
  const updateUrl = `/portfolio/v1/tokens/${props.item.token.id}/update`
  const updateToken = (url, data) => apiClient.put(url, data);

  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);



  const validationSchema = Yup.object({
    tokenname: Yup.string().required('Token Name is required'),
    symbol: Yup.string().required('Symbol is required'),
    ticker: Yup.string(),
    quantity: Yup.number()
      .required('Amount is required')
      .positive('Amount must be a positive number'),
  });

  const initialValues =  {
    tokenname: `${props.item.data.name}`,
    symbol: `${props.item.token.symbol}`,
    ticker: `${props.item.token.ticker}`,
    quantity: `${props.item.token.quantity}`,
  }

  const handleSubmit = (values) => {
    updateToken(updateUrl, values)
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
    
  useEffect(() => {},[success]);

  return (
    <div className=" dropdown overflow-visible">
      <button
        className="btn btn-icon shadow-none btn-ghost-secondary"
        onClick={() => setShowForm(!showForm)}
        style={{ cursor: 'pointer' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
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
              {success && success ? (
                  <>
                      {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white dropdown-item', progress: undefined, toastId: "" })}
                      <ToastContainer autoClose={2000} limit={1} />
                      <Alert color="success">
                          Register User Successfully and Your Redirect To Login Page...
                      </Alert>
                  </>
              ) : null}
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

                  <div className="dropdown-item align-items-center">
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

export default TokenUpdate;