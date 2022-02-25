import React, { useState, useContext } from 'react';
import Layout from './style/layout';
import Card from './style/card';
import { Form, Input, Button, Alert } from 'antd';
import { AccountContext } from './cognito/account';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authenticate } = useContext(AccountContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await authenticate(values.email, values.password);
      navigate('/contacts');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <div
        style={{
          maxWidth: '400px',
          padding: '14px',
          margin: 'auto',
          height: '80vh',
          display: 'flex',
        }}
      >
        <Card title="Login" style={{ margin: 'auto' }}>
          {error && <Alert message={error} type="error" />}
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
            <p style={{ marginBottom: '0', marginTop: '14px' }}>
              Don't have an account? <Link to="/sign-up">Sign Up</Link>
            </p>
            <p>
              Forgot your password? <Link to="/reset-password">Reset it</Link>
            </p>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
