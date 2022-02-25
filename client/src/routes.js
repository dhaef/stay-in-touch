import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/private-route';
import SignUp from './components/sign-up';
import Login from './components/login';
import Confirm from './components/confirm';
import Home from './components/home';
import ResetPassword from './components/password/reset-password';
import ChangePassword from './components/password/change-password';
import NotFound from './components/not-found';
import Contact from './components/contact';
import Contacts from './components/dashboard/contacts';

const Router = () => {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/help" element={<Contact />} />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/contacts"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/contacts"
        element={
          <PrivateRoute>
            <Contacts />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
