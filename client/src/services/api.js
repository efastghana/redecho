import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Stories
export const fetchStories = async () => {
  const response = await axios.get(`${API_URL}/stories`);
  return response.data;
};

export const fetchStoryById = async (id) => {
  const response = await axios.get(`${API_URL}/stories/${id}`);
  return response.data;
};

export const createStory = async (story) => {
  const response = await axios.post(`${API_URL}/stories`, story);
  return response.data;
};

// Comments
export const fetchComments = async (storyId) => {
  const response = await axios.get(`${API_URL}/comments/${storyId}`);
  return response.data;
};

export const addComment = async (storyId, comment) => {
  const response = await axios.post(`${API_URL}/comments/${storyId}`, comment);
  return response.data;
};

// Reactions
export const addReaction = async (reaction) => {
  const response = await axios.post(`${API_URL}/reactions`, reaction);
  return response.data;
};

// Authentication
export const register = async (email, password, username) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    username
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

export const verifyToken = async (token) => {
  const response = await axios.get(`${API_URL}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Admin
export const getAdminMetrics = async (token) => {
  const response = await axios.get(`${API_URL}/admin/metrics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAdminStories = async (token) => {
  const response = await axios.get(`${API_URL}/admin/stories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteStory = async (storyId, token) => {
  const response = await axios.delete(`${API_URL}/admin/stories/${storyId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const editStory = async (storyId, data, token) => {
  const response = await axios.put(`${API_URL}/admin/stories/${storyId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const boostStory = async (storyId, token) => {
  const response = await axios.patch(`${API_URL}/admin/stories/${storyId}/boost`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const sendAdminMessage = async (storyId, storyAuthor, content, token) => {
  const response = await axios.post(`${API_URL}/admin/messages`, {
    storyId,
    storyAuthor,
    content
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAdminMessages = async (storyId, token) => {
  const response = await axios.get(`${API_URL}/admin/messages/${storyId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// User Messages
export const getUserMessages = async (token) => {
  const response = await axios.get(`${API_URL}/user/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const sendUserReply = async (storyId, content, token) => {
  const response = await axios.post(`${API_URL}/user/messages`, {
    storyId,
    content
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const markMessageAsRead = async (messageId, token) => {
  const response = await axios.patch(`${API_URL}/user/messages/${messageId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;

export default {
  fetchStories,
  fetchStoryById,
  createStory,
  fetchComments,
  addComment,
  addReaction
};
