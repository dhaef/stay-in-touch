import React, { useState } from 'react';
import Card from './style/card';
import { Form, Input, Button, Alert } from 'antd';
import Pool from './cognito/user-pool';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Layout from './style/layout';
import { useNavigate } from 'react-router-dom';

const Confirm = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = queryString.parse(location.search);

  const onFinish = (values) => {
    const userData = {
      Username: email,
      Pool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(values.code, true, (err, result) => {
      if (err) {
        setError(err.message);
      } else {
        console.log(result);
        navigate('/login');
      }
    });
  };
  return (
    <Layout>
      <div
        style={{
          maxWidth: '400px',
          padding: '14px',
          margin: 'auto',
          height: '85vh',
          display: 'flex',
        }}
      >
        <Card title="Verification" style={{ margin: 'auto' }}>
          {error && <Alert message={error} type="error" />}
          <Form
            name="confirm"
            onFinish={onFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: 'Please input your code!' }]}
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default Confirm;
