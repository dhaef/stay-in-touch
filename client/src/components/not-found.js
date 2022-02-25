import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  text-align: center;
  padding-top: 25px;
`;

const Icon = styled(InfoCircleOutlined)`
  color: #1890ff;
  font-size: 20px;
`;

const Title = styled.h2`
  margin: 0 0 0 10px;
  display: inline-block;
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Icon />
      <Title>The page you're looking for doesn't exist</Title>
      <h3>
        <Link to="/">Go Back</Link>
      </h3>
    </NotFoundContainer>
  );
};

export default NotFound;
