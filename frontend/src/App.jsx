import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { StoryDetails } from './pages/StoryDetails';
import { UserProvider, UserContext } from './context/UserContext';
import './index.css';

function AppContent() {
  const { user } = React.useContext(UserContext);

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<StoryDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
