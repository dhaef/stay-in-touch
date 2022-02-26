import React, { useState } from 'react';
import AddContact from './add-contact';
import BulkAddContacts from './bulk-add-contacts';
import useToken from '../utils/useToken';
import { Spin, Row, Col, Button, Modal } from 'antd';
import Layout from '../style/layout';
import ContactsTable from './contacts-table';
import useFetch from '../../useFetch';
import Settings from './settings';
import { SettingOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SpinContainer = styled.div`
  margin: 24px;
`;

const Contacts = ({ token }) => {
  const { loading, data, fetch } = useFetch('/api/contacts/table', token);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <SpinContainer>
        <Spin indicator={<LoadingOutlined spin />} />
      </SpinContainer>
    );
  }

  return (
    <div style={{ margin: '16px 16px 0 16px' }}>
      {/* <Button
        icon={<CreditCardOutlined />}
        onClick={() => navigate('/pay')}
        style={{ margin: '0 15px 15px 0' }}
      >
        Unlimited Contacts
      </Button> */}
      <Button
        icon={<SettingOutlined />}
        onClick={() => setIsSettingsOpen(true)}
        style={{ marginBottom: '15px' }}
      >
        Settings
      </Button>
      <Row gutter={24}>
        <Col span={24} md={12}>
          <AddContact token={token} fetch={fetch} />
        </Col>
        <Col span={24} md={12}>
          <BulkAddContacts token={token} fetch={fetch} />
        </Col>
      </Row>
      <ContactsTable token={token} data={data?.data} fetch={fetch} />
      <Modal
        visible={isSettingsOpen}
        footer={false}
        title="Settings"
        onCancel={() => setIsSettingsOpen(false)}
      >
        <Settings token={token} />
      </Modal>
    </div>
  );
};

const ContactsDash = () => {
  const { token, loading } = useToken();

  if (loading) {
    return (
      <Layout>
        <Spin />
      </Layout>
    );
  }

  if (!token) {
    return (
      <Layout>
        <Spin />
      </Layout>
    );
  }

  return (
    <Layout>
      <Contacts token={token} />
    </Layout>
  );
};

export default ContactsDash;
