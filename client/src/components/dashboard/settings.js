import React, { useState, useEffect } from 'react';
import { Select, Form, Button, Spin } from 'antd';
import axios from 'axios';

const times = [
  { value: 0, label: `00:00 UTC` },
  { value: 3, label: `03:00 UTC` },
  { value: 6, label: `06:00 UTC` },
  { value: 9, label: `09:00 UTC` },
  { value: 12, label: `12:00 UTC` },
  { value: 15, label: `15:00 UTC` },
  { value: 18, label: `18:00 UTC` },
  { value: 21, label: `21:00 UTC` },
];

const Settings = ({ token }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSettings = async () => {
    try {
      const { data } = await axios.get(`/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSettings(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/users/reminder-time`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSettings(data?.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSettings();
  }, []);

  if (!settings) {
    return <Spin />;
  }

  return (
    <Form
      onFinish={onFinish}
      initialValues={{ reminderTime: settings?.reminderTime }}
    >
      <Form.Item name="reminderTime" label="Reminder Time">
        <Select>
          {times.map((t) => (
            <Select.Option key={t.value} value={t.value}>
              {t.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Button htmlType="submit" loading={loading}>
        Save
      </Button>
    </Form>
  );
};

export default Settings;
