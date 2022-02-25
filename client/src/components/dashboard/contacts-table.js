import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Card from '../style/card';

const ContactsTable = ({ token, data, fetch }) => {
  const [contacts, setContacts] = useState([data?.contacts]);
  const [nextKey, setNextKey] = useState(data?.nextKey);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(false);

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
      render: (nextContact) => dayjs.unix(nextContact).format('DD/MM/YYYY'),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (id) => <DeleteOutlined onClick={() => onDelete(id)} />,
    },
  ];

  if (!contacts) {
    return null;
  }

  return (
    <div>
      <Card title="Contacts Table">
        <Table
          columns={columns}
          dataSource={contacts[pageNumber]}
          rowKey="id"
          pagination={false}
        />
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
    </div>
  );
};

export default ContactsTable;
