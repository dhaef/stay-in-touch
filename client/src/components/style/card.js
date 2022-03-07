import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

const CardDiv = styled.div`
  padding: 0.5rem;
  margin: auto auto 24px auto;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 5px;
  width: 100%;
  text-align: center;
`;
// border-top: 3px solid #1890ff;
// border-radius: 0 0 5px 5px;

const Title = styled(Typography.Title)`
  margin: 10px !important;
`;
// margin: 0 0 5px 0 !important;
const Card = ({ title, children, style }) => {
  return (
    <CardDiv style={style}>
      <Title level={3}>{title}</Title>
      {children}
    </CardDiv>
  );
};

export default Card;
