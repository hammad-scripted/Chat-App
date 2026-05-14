import React from 'react';
import { Navbar } from './components/Navbar';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
export const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};
