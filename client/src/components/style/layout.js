import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from '../cognito/account';
import styled from 'styled-components';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Container = styled.div`
  background-color: #fafafa;
`;

const Nav = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: large;
  padding: 0.5rem 16px;
  margin: 0;
  display: inline-block;
  color: black;
`;

const RightNav = styled.div`
  margin: auto 16px auto auto;
`;

const LinkContainer = styled.div`
  margin: auto 16px auto auto;
`;

const Footer = styled.div`
  max-width: 1200px;
  margin: auto;
  text-align: center;
  padding: 1% 0;
`;

const FooterFull = styled.div`
  background-color: #fafafa;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  min-height: 90vh;
`;

const Contact = styled.span``;

const Layout = ({ children }) => {
  const [status, setStatus] = useState(false);

  const { getSession, logout } = useContext(AccountContext);

  useEffect(() => {
    getSession().then(async (session) => {
      setStatus(true);
    });
  }, [getSession]);
  return (
    <div>
      <Container>
        <Nav>
          <Link to="/">
            <Title level={3}>Stay-In-Touch</Title>
          </Link>
          {status ? (
            <RightNav>
              <Link to="/contacts" style={{ marginRight: '14px' }}>
                <Contact>Contacts</Contact>
              </Link>
              <Button className="ant-btn-outline" type="ghost" onClick={logout}>
                Logout
              </Button>
            </RightNav>
          ) : (
            <LinkContainer>
              <Link to="/login">Login</Link> or{' '}
              <Link to="/sign-up">Sign Up</Link>
            </LinkContainer>
          )}
        </Nav>
      </Container>
      <Wrapper>{children}</Wrapper>
      <FooterFull>
        <Footer>
          <Link to="/contact">Contact Us</Link>
          {/* {new Date().getFullYear()} - Financial Snapshot */}
        </Footer>
      </FooterFull>
    </div>
  );
};

export default Layout;
