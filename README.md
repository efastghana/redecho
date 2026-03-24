# 🔴 RedEcho - Deployment Ready

**Anonymous storytelling platform - Deploy to internet FREE with Vercel + Render + MongoDB Atlas**

[📖 Full Deployment Guide](DEPLOYMENT.md)
│   │   │   └── StoryDetails.jsx
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string ready)
- npm or yarn

### Setup Backend

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string (default is local):
```
MONGODB_URI=mongodb://localhost:27017/redecho
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run server
```

Expected output:
```
✓ MongoDB connected
🔴 RedEcho Backend running on port 5000
📡 API: http://localhost:5000
```

### Setup Frontend

1. In a new terminal, navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:3000
```

That's it! 🎉

## 🔌 API Endpoints

### Stories
- `GET /api/stories` - Fetch all stories
- `GET /api/stories/:id` - Fetch single story
- `POST /api/stories` - Create new story

**Example POST body:**
```json
{
  "username": "SilentSoul_8392",
  "title": "My Journey",
  "content": "This is my story...",
  "emotion": "Confession"
}
```

### Reactions
- `POST /api/reactions` - Add reaction to story

**Example POST body:**
```json
{
  "storyId": "123...",
  "username": "SilentSoul_8392",
  "reactionType": "relate"
}
```

### Comments
- `GET /api/comments/:storyId` - Fetch comments for story
- `POST /api/comments/:storyId` - Add comment to story

**Example POST body:**
```json
{
  "username": "SilentSoul_8392",
  "content": "You're not alone in this..."
}
```

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (Dark black)
- **Secondary**: `#1a1a1a` (Dark grey)
- **Primary**: `#e50914` (Red)
- **Text**: `#f5f5f5` (White)
- **Text Secondary**: `#a0a0a0` (Light grey)

### Components
- Minimalist rounded cards
- Soft shadows
- Smooth transitions
- Dark mode only

## 🛡️ Moderation Features

- **Profanity Filter** - Basic keyword filter applied to posts and comments
- **Spam Prevention** - Users can post once every 30 seconds
- **Input Validation** - Content length limits (2000 for stories, 1000 for comments)

## 📦 Emotion Tags

Stories can be tagged with one of six emotions:
- 💕 Love
- 💔 Pain
- 😰 Anxiety
- 🤫 Confession
- 😊 Happiness
- 😔 Regret

## 🎯 Reaction Types

- ❤️ **Relate** - "I relate to this"
- 💡 **Helpful** - "This was helpful"
- 🤝 **Support** - "I support you"
- 😢 **Emotional** - "This moved me"

Each user can react once per story (reaction is stored in localStorage).

## 💾 Data Storage

**User**: Stored in localStorage
- Anonymous username generated on first visit
- Format: `AdjjectiveNoun_XXXX` (e.g., `SilentSoul_8392`)

**Stories**: MongoDB
- Username, title, content, emotion tag
- Reaction counters
- Created timestamp

**Comments**: MongoDB
- Story reference, username, content
- Created timestamp

**Reactions**: MongoDB
- Used to prevent duplicate reactions per user per story

## 🚧 Development

### Frontend Development
- HMR (Hot Module Replacement) enabled with Vite
- Tailwind CSS for styling
- React Router for navigation

### Backend Development
- Use `npm run dev` to run with nodemon for auto-restart
- All routes return JSON
- CORS enabled for localhost:3000

## ⚙️ Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/redecho
PORT=5000
NODE_ENV=development
```

### Frontend
- API base URL: `http://localhost:5000/api` (hardcoded in services/api.js)
- Edit if your backend runs on a different port

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**
- Ensure MongoDB is running: `mongod`
- Check connection string in .env file
- Verify MongoDB is accessible on localhost:27017

**Frontend can't reach backend:**
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL in `frontend/src/services/api.js`

**Port already in use:**
- Backend: Change PORT in .env file
- Frontend: Vite will auto-select new port if 3000 is in use

**Stories not loading:**
- Check browser network tab for 500 errors
- Verify MongoDB connection on backend
- Check backend console for error messages

## 📝 License

This project is open source and available for educational purposes.

## 🎓 Learning Resources

This project demonstrates:
- Full-stack web development with MERN stack
- React Context API for state management
- RESTful API design
- MongoDB schema design
- Tailwind CSS dark mode
- Anonymous user sessions
- Form handling and validation

---

**Happy storytelling! 🔴**
