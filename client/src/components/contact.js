import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import Card from './style/card';
import Layout from './style/layout';
import axios from 'axios';

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { email, subject, msg } = values;
    try {
      setLoading(true);
      await axios.post('/api/help', { email, subject, message: msg });
      form.resetFields();
      message.success('Message sent!');
    } catch (error) {
      message.error('Message failed to send please try again.');
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div
        style={{
          padding: '16px',
          maxWidth: '700px',
          margin: 'auto',
        }}
      >
        <Card title="Contact Us">
          <Form
            form={form}
            onFinish={onFinish}
            {...{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please input a subject!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="msg"
              label="Message"
              rules={[
                { required: true, message: 'Please input your message!' },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send
            </Button>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;
