import React, { useState } from 'react';
import Layout from './style/layout';
import styled from 'styled-components';
import { Button, Typography, Row, Col, Input, message, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import isEmail from 'isemail';
import { Link } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
// import LiveReport from '../../live-report.png';

const Banner = styled(Row)`
  width: 100%;
  padding: 7% 16px;
  text-align: center;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled(Typography.Title)`
  font-size: 10%;
  margin-bottom: 16px !important;
`;

const Text = styled(Typography.Text)`
  font-size: 28px;
  display: block;
`;

const Btn = styled(Button)`
  font-size: 150%;
  height: auto !important;
`;

const ExButton = styled(Button)`
  margin-left: 10px;
  font-weight: bold;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const Error = styled.p`
  color: red;
  margin: 0;
`;

const Home = () => {
  const navigate = useNavigate();
  const [exampleEmail, setExampleEmail] = useState('');
  const [exampleEmailError, setExampleEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    // if (exampleEmail && isEmail.validate(exampleEmail)) {
    //   setExampleEmailError('');
    //   setLoading(true);
    //   const res = await axios.post('/api/schedule/example-snapshot', {
    //     email: exampleEmail,
    //   });
    //   if (res.status === 200) {
    //     setExampleEmail('');
    //     message.success('Example snapshot sent!', 5);
    //   }
    //   if (res.status === 400) {
    //     message.error('Example snapshot failed to send!', 5);
    //   }
    //   setLoading(false);
    // } else {
    //   setExampleEmailError('Please add a valid email');
    // }
  };

  return (
    <Layout>
      <Banner>
        <Col span={24} style={{ margin: 'auto', maxWidth: '600px' }}>
          <Title level={1}>Stay In Touch With All Of Your Acquaintances.</Title>
          <Typography.Text style={{ fontSize: '18px', color: '#8c8c8c' }}>
            {/* Never forget to stay in touch with your acquaintances with daily
            reminders.  */}
            A simple system to stay in touch with your acquaintances.
          </Typography.Text>
        </Col>
      </Banner>
      <div style={{ maxWidth: '1000px', margin: 'auto', padding: '0 10px' }}>
        <Link to="/example/report" target="_blank" rel="noopener noreferrer">
          {/* <Image
            src={LiveReport}
            style={{
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px',
            }}
            preview={false}
          /> */}
        </Link>
      </div>
      <div
        style={{
          maxWidth: '600px',
          margin: 'auto',
          textAlign: 'center',
          padding: '7% 0',
        }}
      >
        <Text>
          Get your current{' '}
          <span style={{ fontWeight: 'bolder' }}>
            net worth, account balances, and recent transactions
          </span>{' '}
          on a weekly basis directly in your inbox.
        </Text>
        <Btn
          type="primary"
          style={{
            padding: '12px 16px',
            fontWeight: 'bold',
            fontSize: '24px',
            marginTop: '16px',
          }}
          onClick={() => navigate('/sign-up')}
        >
          Sign Up Now
        </Btn>
        <Typography.Text
          style={{
            fontSize: '18px',
            color: '#8c8c8c',
            display: 'block',
            marginTop: '16px',
          }}
        >
          Get 7 days free, no credit card needed!
          <br />
          $10/month after
        </Typography.Text>
      </div>
      <div
        style={{
          maxWidth: '600px',
          margin: 'auto',
          textAlign: 'center',
          padding: '5% 0',
          backgroundColor: '#fafafa',
          borderRadius: '2px',
        }}
      >
        <Text style={{ marginBottom: '16px' }}>
          Send yourself an Example Snapshot!
        </Text>
        <Input
          placeholder="Email"
          style={{ maxWidth: '400px' }}
          value={exampleEmail}
          type="email"
          onChange={(e) => setExampleEmail(e.target.value)}
        />
        <ExButton type="primary" onClick={onClick} loading={loading}>
          <SendOutlined />
          Send!
        </ExButton>
        {exampleEmailError && <Error>{exampleEmailError}</Error>}
        <Text style={{ marginTop: '16px', fontSize: '20px' }}>
          Or checkout an example <Link to="/example/report">live report</Link>
        </Text>
      </div>
      <div
        style={{
          maxWidth: '800px',
          margin: 'auto',
          textAlign: 'center',
          padding: '7% 0',
        }}
      >
        <Text style={{ marginBottom: '5%', fontWeight: 'bold' }}>
          Simple to setup
        </Text>
        <Row gutter={24}>
          <Col span={24} md={12}>
            <div style={{ width: '300px', margin: 'auto' }}>
              <Text style={{ fontSize: '24px' }}>1. Create An Account</Text>
              <Text
                style={{
                  fontSize: '22px',
                  padding: '16px 0',
                  color: '#8c8c8c',
                }}
              >
                Create your account and connect your bank accounts.
              </Text>
            </div>
          </Col>
          <Col span={24} md={12}>
            <div style={{ width: '300px', margin: 'auto' }}>
              <Text style={{ fontSize: '24px' }}>
                2. Select Your Preferences
              </Text>
              <Text
                style={{
                  fontSize: '22px',
                  padding: '16px 0',
                  color: '#8c8c8c',
                }}
              >
                Select what day of the week you wish to receive your snapshot.
              </Text>
            </div>
          </Col>
          <Col span={24} md={24}>
            <div style={{ width: '300px', margin: 'auto', marginTop: '16px' }}>
              <Text style={{ fontSize: '24px' }}>3. Get Your Snapshot</Text>
              <Text
                style={{
                  fontSize: '22px',
                  padding: '16px 0',
                  color: '#8c8c8c',
                }}
              >
                Get your weekly financial snapshot!
              </Text>
            </div>
          </Col>
        </Row>
      </div>
      <div
        style={{
          maxWidth: '600px',
          margin: 'auto',
          textAlign: 'center',
          padding: '7% 0',
        }}
      >
        <Text>
          With financial data, privacy and safety are an important concern. We
          use the latest technology to secure your data.{' '}
          <Link to="/privacy">View our privacy policy</Link>
        </Text>
      </div>
    </Layout>
  );
};

export default Home;
