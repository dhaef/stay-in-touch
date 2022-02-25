// useToken.js
import { useEffect, useState, useRef, useContext } from 'react';
import { AccountContext } from '../cognito/account';

const useToken = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getSession } = useContext(AccountContext);
  const componentMounted = useRef(true);

  useEffect(() => {
    async function getToken() {
      setLoading(true);
      try {
        const { session } = await getSession();
        if (componentMounted.current) {
          setToken(session.idToken.jwtToken);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getToken();

    return () => {
      componentMounted.current = false;
    };
  }, [getSession]);

  return { loading, token };
};

export default useToken;
