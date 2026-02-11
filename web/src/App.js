import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Train from './pages/Train.jsx';
import User from './pages/User.jsx';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/train" element={<Train />} />
          <Route path="/user" element={<User />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
