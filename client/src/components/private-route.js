import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './cognito/account';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    getSession()
      .then(async (session) => {
        setAuth(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [getSession]);
  return <>{!loading && (auth ? children : <Navigate to="/login" />)}</>;
};

export default PrivateRoute;
