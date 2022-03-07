import React from 'react';
import Layout from './style/layout';
import styled from 'styled-components';
import { Button, Typography, Row, Col, Image } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import EmailPic from '../keep-in-touch-email.PNG';
import { CheckCircleOutlined } from '@ant-design/icons';

const Banner = styled(Row)`
  width: 100%;
  padding: 5% 16px;
  text-align: center;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled(Typography.Title)`
  font-size: 400% !important;
  margin-bottom: 16px !important;

  @media (max-width: 768px) {
    font-size: 300% !important;
  }
`;

const Text = styled(Typography.Text)`
  font-size: 28px;
  display: block;
`;

const Btn = styled(Button)`
  font-size: 150%;
  height: auto !important;
`;

const Img = styled(Image)`
  width: 50%;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 10px;

  @media (max-width: 990px) {
    margin-top: 10%;
  }
`;

const FeatureItem = styled(Typography.Text)`
  font-size: 18px;
  line-height: 2;
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Banner>
        <Col span={24} lg={14} style={{ margin: 'auto', maxWidth: '600px' }}>
          <Title level={1}>
            Keep In Touch With All Your Acquaintances.
            {/* The simpliest way to Keep In Touch with all your acquaintances. */}
          </Title>
          <div
            style={{
              maxWidth: '450px',
              margin: 'auto',
            }}
          >
            <Typography.Text
              style={{
                fontSize: '18px',
                color: '#8c8c8c',
              }}
            >
              Daily reminders for everyone you should reach out to today,
              helping you to never forget to maintain strong relationships.
              {/* A simple system to never lose touch with your acquaintances. */}
            </Typography.Text>
          </div>
          <div>
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
              Sign-Up For Free!
            </Btn>
            <Typography.Text
              style={{
                fontSize: '12px',
                color: '#8c8c8c',
                display: 'block',
                marginTop: '10px',
              }}
            >
              No Credit Card Required
            </Typography.Text>
          </div>
        </Col>
        <Col span={24} lg={10}>
          <Img src={EmailPic} preview={false} />
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
          margin: '2.5% auto 5% auto',
          textAlign: 'center',
          padding: '5%',
        }}
      >
        <Text>
          Insipred by{' '}
          <a href="https://sive.rs/hundreds" target="_blank" rel="noreferrer">
            Derek Sivers
          </a>{' '}
          and{' '}
          <a
            href="https://jakobgreenfeld.com/stay-in-touch"
            target="_blank"
            rel="noreferrer"
          >
            Jakob Greenfields
          </a>{' '}
          systems to keep in touch and stay top of mind of those around you.{' '}
          <Link to="/sign-up" style={{ fontWeight: 'bolder' }}>
            Keep-In-Touch
          </Link>{' '}
          empowers you to easily build your own custom system.
        </Text>
      </div>
      <div
        style={{
          maxWidth: '600px',
          margin: '5% auto',
          textAlign: 'center',
          padding: '5%',
          backgroundColor: '#fafafa',
        }}
      >
        <Typography.Title level={2}>Features</Typography.Title>
        <div>
          <FeatureItem>
            <CheckCircleOutlined /> Build your own system with custom timeframes
          </FeatureItem>
        </div>
        <div>
          <FeatureItem>
            <CheckCircleOutlined /> Add contact info and notes on each contact
          </FeatureItem>
        </div>
        <div>
          <FeatureItem>
            <CheckCircleOutlined /> Import contacts from a .csv file
          </FeatureItem>
        </div>
        <div>
          <FeatureItem>
            <CheckCircleOutlined /> Choose your preferred reminder time (every 3
            hours)
          </FeatureItem>
        </div>
        {/* 
        
          - Build your own system with custom timeframes
          - Add contact info and notes on each contact
          - Import contacts from a .csv file
          - Choose your preferred reminder time (Every 3 hours)
        
        */}
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
                Create your account and add your contacts with custom
                timeframes.
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
