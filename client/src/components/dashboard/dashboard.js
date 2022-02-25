import React from 'react';
import { Spin } from 'antd';
import Layout from '../style/layout';
import useToken from '../utils/useToken';

import ContactsTable from './contacts-table';

const Dashboard = () => {
  const { token, loading } = useToken();

  if (loading) {
    return <Spin />;
  }

  if (!token) {
    return null;
  }

  return (
    <Layout>
      <ContactsTable token={token} />
    </Layout>
  );
};

export default Dashboard;
