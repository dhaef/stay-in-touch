// useFetch.js
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const useFetch = (url, token) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const componentMounted = useRef(true);

  const fetch = async () => {
    try {
      const { data } = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (componentMounted.current) {
        setData(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetch();
    }

    return () => {
      componentMounted.current = false;
    };
  }, [token, url]);

  return { loading, data, fetch };
};

export default useFetch;
