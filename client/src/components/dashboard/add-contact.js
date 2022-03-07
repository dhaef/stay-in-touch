import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography, Alert } from 'antd';
import axios from 'axios';
import Card from '../style/card';
import { Link } from 'react-router-dom';

const AddContact = ({ token, fetch }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState({ status: false });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        '/api/contacts',
        { ...values },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      form.resetFields();
      fetch();
    } catch (error) {
      console.log(error);
      if (error.response.data.msg === 'contacts limit reached') {
        setLimitError({
          status: true,
          count: error.response.data.contactsCount,
        });
      }
    }
    setLoading(false);
  };

  return (
    <Card title="Add Contact">
      {/* <div style={{ maxWidth: '400px', margin: 'auto' }}> */}
      {limitError.status && (
        <Alert
          type="error"
          style={{ marginBottom: '14px' }}
          message={
            <Typography.Text>
              Free tier limit reached: 250 contacts.{' '}
              <Link to="/pay" style={{ fontWeight: '700' }}>
                Join now
              </Link>{' '}
              to add unlimited contacts. Current contacts count:{' '}
              <span style={{ fontWeight: '700' }}>{limitError?.count}</span>
            </Typography.Text>
          }
        />
      )}
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
              rules={[{ required: true, message: 'Province is required' }]}
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
              rules={[{ required: true, message: 'Street is required' }]}
            >
              <Input type="number" style={{ width: '50%' }} />
            </Form.Item>
          </Input.Group>
          {/* <Input type="number" placeholder="Frequency" min={0} step={0.01} /> */}
        </Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          Add
        </Button>
      </Form>
      {/* </div> */}
    </Card>
  );
};

export default AddContact;
