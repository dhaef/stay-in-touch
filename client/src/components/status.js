import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from './cognito/account';
import axios from 'axios';

const Status = () => {
  const [status, setStatus] = useState(false);

  const { getSession, logout } = useContext(AccountContext);

  useEffect(() => {
    getSession().then(async (session) => {
      setStatus(true);
      // const user = await axios.get('/api/user', {
      //   headers: {
      //     'x-auth-token': session.idToken.jwtToken,
      //   },
      // });
    });
  }, [getSession]);

  return (
    <div>
      {status ? <button onClick={logout}>Logout</button> : 'please login'}
    </div>
  );
};

export default Status;
