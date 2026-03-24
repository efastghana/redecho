import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

export default {
  fetchStories,
  fetchStoryById,
  createStory,
  fetchComments,
  addComment,
  addReaction
};
