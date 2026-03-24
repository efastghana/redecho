import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem('redecho_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Generate new anonymous user
      const newUser = {
        username: generateAnonymousUsername()
      };
      setUser(newUser);
      localStorage.setItem('redecho_user', JSON.stringify(newUser));
    }
  }, []);

  const generateAnonymousUsername = () => {
    const adjectives = ['Silent', 'Wandering', 'Quiet', 'Brave', 'Honest', 'Free', 'Calm', 'Wise'];
    const nouns = ['Soul', 'Heart', 'Voice', 'Spirit', 'Echo', 'Dream', 'Fire', 'Light'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 10000);
    
    return `${adjective}${noun}_${number}`;
  };

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
