import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { APIClient } from '../../helpers/api_helper';

const DeleteButton = (props) => {
  const apiClient = new APIClient();
  const deleteUrl = `/portfolio/v1/tokens/${props.item.token.id}/delete`
  const deleteToken = (url) => apiClient.delete(url);

  const [showForm, setShowForm] = useState(false);
  const [sucess, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    deleteToken(deleteUrl)
      .then(() => {
        setErrorMessage('');
        setSuccess(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
    }
  useEffect(() => {},[sucess]);

  return (
    <div className=" dropdown">
      <button
        className="btn btn-icon shadow-none btn-ghost-secondary"
        onClick={() => setShowForm(!showForm)}
        style={{ cursor: 'pointer' }}
      ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square-fill" viewBox="0 0 16 16">
      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
    </svg>
    </button>
      {showForm && (
        <>
            <div className="dropdown-menu-lg p-0 dropdown-menu-end dropdown-menu show">
                <Form onSubmit={handleSubmit}>
                    <div className="form-group dropdown-item">
                    <label htmlFor="tokenname">Are you sure about removing token?</label>
                    </div>
                    {errorMessage && (
                    <div className="alert alert-danger dropdown-item" role="alert">
                        {errorMessage}
                    </div>
                    )}
                    <div className="dropdown-item align-items-center">
                    <button type="submit" className="btn btn-primary">
                        Delete
                    </button>
                    </div>
                </Form>
            </div>
        </>
      )}
    </div>
  );
};

export default DeleteButton;