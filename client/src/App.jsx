import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Trending } from './pages/Trending';
import { Create } from './pages/Create';
import { Profile } from './pages/Profile';
import { StoryDetails } from './pages/StoryDetails';
import { UserProvider, UserContext } from './context/UserContext';
import './index.css';

function AppContent() {
  const { user } = React.useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <>
      <Navbar user={user} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/search" element={<Search isDarkMode={isDarkMode} />} />
        <Route path="/trending" element={<Trending isDarkMode={isDarkMode} />} />
        <Route path="/create" element={<Create isDarkMode={isDarkMode} />} />
        <Route path="/profile" element={<Profile isDarkMode={isDarkMode} />} />
        <Route path="/story/:id" element={<StoryDetails isDarkMode={isDarkMode} />} />
      </Routes>
      <BottomNav isDarkMode={isDarkMode} />
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
