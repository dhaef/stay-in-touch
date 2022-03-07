import React, { useState, useRef, useEffect } from 'react';
import Layout from './style/layout';
import Card from './style/card';
import { Form, Input, Button, Alert, Row, Col } from 'antd';
import UserPool from './cognito/user-pool';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const PasswordItem = styled.div`
  color: ${(props) => (props.type ? 'black' : '#c4c4c4')};
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });
  const emailInput = useRef(null);

  useEffect(() => {
    if (emailInput.current) {
      emailInput.current.focus();
    }
  }, [emailInput]);

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

  const onChange = ({ target: { value } }) => {
    setPassword({
      length: value?.length > 7 ? true : false,
      upper: /[A-Z]/.test(value) ? true : false,
      lower: /[a-z]/.test(value) ? true : false,
      number: /\d/.test(value) ? true : false,
    });
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
              <Input ref={emailInput} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              style={{ marginBottom: '5px' }}
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
              <Input.Password onChange={onChange} />
            </Form.Item>
            <Row gutter={24} style={{ marginBottom: '20px', fontSize: '10px' }}>
              <Col span={12}>
                <PasswordItem type={password?.length}>
                  {password?.length ? (
                    <CheckCircleOutlined />
                  ) : (
                    <MinusCircleOutlined />
                  )}{' '}
                  8 characters
                </PasswordItem>
                <PasswordItem type={password?.number}>
                  {password?.number ? (
                    <CheckCircleOutlined />
                  ) : (
                    <MinusCircleOutlined />
                  )}{' '}
                  Number
                </PasswordItem>
              </Col>
              <Col span={12}>
                <PasswordItem type={password?.upper}>
                  {password?.upper ? (
                    <CheckCircleOutlined />
                  ) : (
                    <MinusCircleOutlined />
                  )}{' '}
                  Uppercase letter
                </PasswordItem>
                <PasswordItem type={password?.lower}>
                  {password?.lower ? (
                    <CheckCircleOutlined />
                  ) : (
                    <MinusCircleOutlined />
                  )}{' '}
                  Lowercase letter
                </PasswordItem>
              </Col>
            </Row>
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
