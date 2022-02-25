import React from 'react';
import Layout from './style/layout';
import styled from 'styled-components';
import { Button, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const Banner = styled(Row)`
  width: 100%;
  padding: 7% 16px;
  text-align: center;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled(Typography.Title)`
  font-size: 400% !important;
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

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Banner>
        <Col span={24} style={{ margin: 'auto', maxWidth: '600px' }}>
          <Title level={1}>Stay In Touch With All Your Acquaintances.</Title>
          <Typography.Text style={{ fontSize: '18px', color: '#8c8c8c' }}>
            {/* Never forget to stay in touch with your acquaintances with daily
            reminders.  */}
            A simple system to stay in touch with your acquaintances.
          </Typography.Text>
        </Col>
      </Banner>
      {/* <div style={{ maxWidth: '1000px', margin: 'auto', padding: '0 10px' }}>
        <Link to="/example/report" target="_blank" rel="noopener noreferrer">
          <Image
            src={LiveReport}
            style={{
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px',
            }}
            preview={false}
          />
        </Link>
      </div> */}
      <div
        style={{
          maxWidth: '600px',
          margin: '5% auto',
          textAlign: 'center',
          padding: '5%',
          backgroundColor: '#fafafa',
        }}
      >
        <Text>
          Daily reminders of all the people you should reach out to today.
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
          Free for your first 250 contacts!
          <br />
          $5/month after
        </Typography.Text>
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
                Create your account and add your contacts.
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
                Select what time of day to receive your reminder.
              </Text>
            </div>
          </Col>
          <Col span={24} md={24}>
            <div style={{ width: '300px', margin: 'auto', marginTop: '16px' }}>
              <Text style={{ fontSize: '24px' }}>3. Get Your Reminder</Text>
              <Text
                style={{
                  fontSize: '22px',
                  padding: '16px 0',
                  color: '#8c8c8c',
                }}
              >
                Get your daily reminder and never lose touch again!
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Home;
