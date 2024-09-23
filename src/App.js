// src/App.js
import React from 'react';
import UserForm from './components/UserForm';
import UserDashboard from './components/UserDashboard';

const App = () => {
  return (
    <div>
      <h1>User Submission</h1>
      <UserForm />
      <UserDashboard />
    </div>
  );
};

export default App;
