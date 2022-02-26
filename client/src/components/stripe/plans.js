import React from 'react';
import { Typography, Row, Col } from 'antd';
import styled from 'styled-components';
import Card from '../style/card';

const Plan = styled.div`
  border: 1px solid black;
  padding: 14px;
  &:hover {
    cursor: pointer;
    background-color: #f0f0f0;
  }
`;

const Plans = ({ setPlan }) => {
  return (
    <Card>
      <Typography.Title level={2}>Choose a Plan</Typography.Title>
      <Row gutter={24}>
        <Col span={24} md={12}>
          <Plan onClick={() => setPlan('m')}>
            <Typography.Title level={4}>Monthly</Typography.Title>
            <Typography.Text>$5/month</Typography.Text>
          </Plan>
        </Col>
        <Col span={24} md={12}>
          <Plan onClick={() => setPlan('y')}>
            <Typography.Title level={4}>Annual</Typography.Title>
            <Typography.Text>$50/year</Typography.Text>
          </Plan>
        </Col>
      </Row>
    </Card>
  );
};

export default Plans;
