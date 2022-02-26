import React, { useState } from 'react';
import axios from 'axios';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Typography, Row, Col } from 'antd';
import styled from 'styled-components';
import Card from '../style/card';
import { useNavigate } from 'react-router-dom';

const Title = styled(Typography.Title)`
  margin-top: 0.5rem;
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;

const Plan = styled.div`
  border: 1px solid black;
  padding: 14px;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
    background-color: #f0f0f0;
  }
`;

const Container = styled.div`
  max-width: 500px;
  margin: auto;
  height: 80vh;
  display: flex;
`;

const Checkout = ({ token }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [plan, setPlan] = useState('m');
  const elements = useElements();
  const stripe = useStripe();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsProcessing(true);
    try {
      const cardElement = elements.getElement(CardElement);
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        // billing_details: {}
      });

      const res = await axios.post(
        '/api/stripe/subscription',
        {
          payment_method: paymentMethodReq.paymentMethod.id,
          plan,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { client_secret, status } = res.data;
      if (status === 'requires_action') {
        const confirmPayment = await stripe.confirmCardPayment(
          client_secret.client_secret,
          {
            payment_method: paymentMethodReq.paymentMethod.id,
          }
        );
        console.log(confirmPayment);
      } else {
        console.log('success');
        navigate('/contacts');
      }
    } catch (error) {
      setHasError(error.message);
      console.log(error.message);
    }

    setIsProcessing(false);
  };

  return (
    <Container>
      <Card style={{ margin: 'auto' }} title="Choose a Plan">
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Plan
              onClick={() => setPlan('m')}
              style={{
                backgroundColor: `${plan === 'm' ? '#f0f0f0' : 'white'}`,
              }}
            >
              <Typography.Title level={4}>Monthly</Typography.Title>
              <Typography.Text>$5/month</Typography.Text>
            </Plan>
          </Col>
          <Col span={24} md={12}>
            <Plan
              onClick={() => setPlan('y')}
              style={{
                backgroundColor: `${plan === 'y' ? '#f0f0f0' : 'white'}`,
              }}
            >
              <Typography.Title level={4}>Annual</Typography.Title>
              <Typography.Text>$50/year</Typography.Text>
            </Plan>
          </Col>
        </Row>
        <Title level={2}>Checkout</Title>
        {hasError && <Error>{hasError}</Error>}
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
              },
            },
          }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={isProcessing}
          style={{ marginTop: '15px' }}
        >
          Pay {plan === 'm' ? '$5' : '$50'}
        </Button>
      </Card>
    </Container>
  );
};

export default Checkout;
