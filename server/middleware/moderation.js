// Simple profanity filter
const PROFANITY_LIST = [
  'badword1', 'badword2', 'hate', 'abuse', 'spam'
];

const filterProfanity = (text) => {
  let filtered = text;
  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
};

// Spam prevention - store user timestamps
const userLastPostTime = {};

const checkSpamLimit = (username) => {
  const now = Date.now();
  const lastTime = userLastPostTime[username];
  
  if (lastTime && now - lastTime < 30000) { // 30 seconds
    return false;
  }
  
  userLastPostTime[username] = now;
  return true;
};

module.exports = { filterProfanity, checkSpamLimit };
