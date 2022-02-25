import React, { useState, useContext } from 'react';
import Card from '../style/card';
import Layout from '../style/layout';
import { Input, Button, message } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../cognito/account';

const Btn = styled(Button)`
  margin-top: 14px;
`;

const InputItms = styled(Input)`
  margin-top: 14px;
`;

const ChangePassword = () => {
  const navigate = useNavigate();
  const { getSession } = useContext(AccountContext);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onCurrPassChange = (e) => setCurrPassword(e.target.value);
  const onNewPassChange = (e) => setNewPassword(e.target.value);

  const onPasswordClick = async () => {
    const { user } = await getSession();

    user.changePassword(currPassword, newPassword, (err, result) => {
      if (err) {
        console.log('FAILED', err);
        message.error('Failed to change password, please try again.');
      } else {
        console.log('SUCCESS', result);
        message.success('Successfully change password!');
        navigate('/dashboard');
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
          height: '80vh',
          display: 'flex',
        }}
      >
        <Card title="Reset Password" style={{ margin: 'auto' }}>
          <InputItms
            type="password"
            placeholder="Current Password"
            value={currPassword}
            onChange={onCurrPassChange}
          />
          <InputItms
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={onNewPassChange}
          />
          <Btn onClick={onPasswordClick} type="primary">
            Change Password
          </Btn>
        </Card>
      </div>
    </Layout>
  );
};

export default ChangePassword;
