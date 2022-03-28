import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Select, Input } from 'antd';
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Card from '../style/card';
import styled from 'styled-components';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const TableContainer = styled.div`
  overflow-y: auto;
`;

const Edit = styled(EditOutlined)`
  margin-right: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const EditContact = ({
  visible,
  contact,
  setContact,
  setIsEditingContact,
  token,
  fetch,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { frequency, ...rest } = values;
    const input = {
      ...contact,
      ...rest,
      frequency: frequency.frequency,
      frequencyType: frequency.frequencyType,
    };

    try {
      setLoading(true);
      await axios.post(
        `/api/contacts/update`,
        {
          input,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetch();
      setContact(null);
      setIsEditingContact(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      ...contact,
      frequency: {
        frequency: contact?.frequency,
        frequencyType: contact?.frequencyType,
      },
    });
  }, [form, contact]);

  return (
    <Modal
      visible={visible}
      title="Edit Contact"
      footer={false}
      onCancel={() => {
        setContact(null);
        setIsEditingContact(false);
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input a name.' }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item name="contactInfo" label="Contact Info">
          <Input type="text" />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="frequency"
          label="Frequency of reminder"
          // rules={[{ required: true, message: 'Please add a frequency.' }]}
        >
          <Input.Group compact>
            <Form.Item
              name={['frequency', 'frequencyType']}
              noStyle
              rules={[
                { required: true, message: 'Frequency Type is required' },
              ]}
            >
              <Select
                placeholder="Select Frequency Type"
                style={{ width: '50%' }}
              >
                <Select.Option value="day">day</Select.Option>
                <Select.Option value="week">week</Select.Option>
                <Select.Option value="month">month</Select.Option>
                <Select.Option value="year">year</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['frequency', 'frequency']}
              noStyle
              rules={[{ required: true, message: 'Frequency is required' }]}
            >
              <Input type="number" style={{ width: '50%' }} />
            </Form.Item>
          </Input.Group>
          {/* <Input type="number" placeholder="Frequency" min={0} step={0.01} /> */}
        </Form.Item>
        <div style={{ display: 'flex' }}>
          <div style={{ margin: 'auto' }}>
            <Button htmlType="submit" type="primary" loading={loading}>
              Update
            </Button>
            <Button
              type="default"
              onClick={() => {
                setContact(null);
                setIsEditingContact(false);
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

const ContactsTable = ({ token, data, fetch }) => {
  const [contacts, setContacts] = useState([data?.contacts]);
  const [nextKey, setNextKey] = useState(data?.nextKey);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    setContacts([data?.contacts]);
    setNextKey(data?.nextKey);
  }, [data]);

  const onDelete = (id) => {
    Modal.confirm({
      title: 'Do you Want to delete this contact?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        try {
          await axios.delete(`/api/contacts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetch();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const onNextClick = async () => {
    if (!contacts[pageNumber + 1]) {
      try {
        setLoading(true);
        const { data: nextData } = await axios.post(
          '/api/contacts/table',
          { nextKey },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPageNumber(pageNumber + 1);
        setContacts([...contacts, nextData?.data?.contacts]);
        setNextKey(nextData?.data?.nextKey);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setPageNumber(pageNumber + 1);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Info',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (frequency, record) => (
        <span>
          {frequency} {record?.frequencyType}
        </span>
      ),
    },
    {
      title: 'Next Contact',
      dataIndex: 'nextContact',
      key: 'nextContact',
      render: (nextContact) =>
        dayjs.unix(nextContact).utc().format('DD/MM/YYYY'),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (id, contact) => {
        return (
          <>
            <Edit
              onClick={() => {
                setContact(contact);
                setIsEditingContact(true);
              }}
            />
            <DeleteOutlined onClick={() => onDelete(id)} />
          </>
        );
      },
    },
  ];

  if (!contacts) {
    return null;
  }

  return (
    <div>
      <Card title="Contacts Table">
        <TableContainer>
          <Table
            columns={columns}
            dataSource={contacts[pageNumber]}
            rowKey="id"
            pagination={false}
          />
        </TableContainer>
        <div style={{ marginTop: '10px' }}>
          <Button
            type="default"
            disabled={pageNumber <= 0}
            onClick={() => setPageNumber(pageNumber - 1)}
            style={{ marginRight: '10px' }}
          >
            <LeftOutlined />
          </Button>
          <Button
            type="default"
            onClick={onNextClick}
            disabled={contacts.length === pageNumber + 1 && !nextKey}
            loading={loading}
          >
            <RightOutlined />
          </Button>
        </div>
      </Card>
      <EditContact
        visible={isEditingContact}
        contact={contact}
        setIsEditingContact={setIsEditingContact}
        setContact={setContact}
        token={token}
        fetch={fetch}
      />
    </div>
  );
};

export default ContactsTable;
