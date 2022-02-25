import React, { useState } from 'react';
import AddContact from './add-contact';
import BulkAddContacts from './bulk-add-contacts';
import useToken from '../utils/useToken';
import { Spin, Row, Col, Button, Modal } from 'antd';
import Layout from '../style/layout';
import ContactsTable from './contacts-table';
import useFetch from '../../useFetch';
import Settings from './settings';
import { SettingOutlined } from '@ant-design/icons';

const Contacts = ({ token }) => {
  const { loading, data, fetch } = useFetch('/api/contacts/table', token);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (loading) {
    <Spin />;
  }

  return (
    <div style={{ margin: '16px 16px 0 16px' }}>
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
