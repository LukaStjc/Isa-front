import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivateAccountComponent = () => {
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const activationCode = searchParams.get('text');

    if (activationCode) {
      axios.get(`http://localhost:8082/api/activate?text=${activationCode}`)
        .then(response => {
          console.log(response.data);
          setMessage(response.data);
          setIsError(false);
        })
        .catch(error => {
          console.error(error.response.data);
          setMessage(error.response.data);
          setIsError(true);
        });
    }
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <h3>Account Activation</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10vh' }}>
        {message && (
          <div style={{ color: isError ? 'red' : 'green', textAlign: 'center' }}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateAccountComponent;
