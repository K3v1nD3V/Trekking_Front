import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from './layouts/admin';

const App = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
};

export default App;
