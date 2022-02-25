import React, { useState } from 'react';
import Card from '../style/card';
import Layout from '../style/layout';
import { Input, Button, message } from 'antd';
import { CognitoUser } from 'amazon-cognito-identity-js';
import Pool from '../cognito/user-pool';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Btn = styled(Button)`
  margin-top: 14px;
`;

const InputItms = styled(Input)`
  margin-top: 14px;
`;

const ResetPassword = () => {
  const history = useNavigate();
  const [stage, setStage] = useState('code');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChange = (e) => setEmail(e.target.value);
  const onCodeChange = (e) => setCode(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const onClick = () => {
    const user = new CognitoUser({
      Username: email,
      Pool,
    });

    user.forgotPassword({
      onSuccess: (data) => {
        console.log('s', data);
        message.success('A code has been sent to your email', 10);
      },
      onFailure: (data) => {
        console.log('f', data);
      },
      inputVerificationCode: (data) => {
        console.log('code:', data);
        setStage('password');
      },
    });
  };

  const onPasswordClick = () => {
    const user = new CognitoUser({
      Username: email,
      Pool,
    });

    user.confirmPassword(code, password, {
      onSuccess: (data) => {
        console.log('s', data);
        history.push('/login');
      },
      onFailure: (data) => {
        console.log('f', data);
      },
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
        <Card title="Reset Password" style={{ margin: 'auto' }}>
          {stage === 'code' && (
            <>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={onEmailChange}
              />
              <Btn onClick={onClick} type="primary">
                Send Code
              </Btn>
            </>
          )}

          {stage === 'password' && (
            <>
              <InputItms
                type="text"
                placeholder="Code"
                value={code}
                onChange={onCodeChange}
              />
              <InputItms
                type="password"
                placeholder="New Password"
                value={password}
                onChange={onPasswordChange}
              />
              <Btn onClick={onPasswordClick} type="primary">
                Reset Password
              </Btn>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
