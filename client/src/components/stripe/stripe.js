import React, { useState, useContext, useEffect } from 'react';
import Checkout from './checkout';
import Layout from '../style/layout';
import { AccountContext } from '../cognito/account';

const Stripe = () => {
  const [token, setToken] = useState(null);
  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    async function getToken() {
      const { session } = await getSession();
      setToken(session.idToken.jwtToken);
    }
    getToken();
  }, [getSession]);
  return (
    <Layout>
      <Checkout token={token} />
    </Layout>
  );
};

export default Stripe;
