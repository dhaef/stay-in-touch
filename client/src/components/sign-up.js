import React, { useState } from 'react';
import Layout from './style/layout';
import Card from './style/card';
import { Form, Input, Button, Alert } from 'antd';
import UserPool from './cognito/user-pool';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    UserPool.signUp(
      values.email,
      values.password,
      [],
      null,
      async (err, data) => {
        if (err) {
          setError(err.message);
          console.log(err);
          setLoading(false);
          return;
        }
        console.log(data);
        try {
          await axios.put('/api/users', {
            email: data.user.username,
            userSub: data.userSub,
            poolId: data.user.pool.userPoolId,
          });
          navigate(`/confirm?email=${values.email}`);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }
    );
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
        <Card title="Sign Up" style={{ margin: 'auto' }}>
          {error && <Alert message={error} type="error" />}
          <Form name="sign-up" onFinish={onFinish} layout="vertical">
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
              tooltip={
                <ul>
                  <li>A capital letter</li>
                  <li>A lowercase letter</li>
                  <li>A number</li>
                  <li>A special character</li>
                  <li>A length of 8+</li>
                </ul>
              }
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign Up
            </Button>
            <p style={{ marginBottom: '0', marginTop: '14px' }}>
              Already have an account? <Link to="/login">Login</Link>
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

export default SignUp;
