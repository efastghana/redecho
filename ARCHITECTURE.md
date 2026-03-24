# 🏗️ RedEcho Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      INTERNET / USERS                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼──────────┐        ┌────────▼────────┐
│  VERCEL          │        │  RENDER         │
│  CDN + Hosting   │        │  Backend Server │
│                  │        │                 │
│ ┌──────────────┐ │        │ ┌─────────────┐ │
│ │ React App    │ │        │ │ Express API │ │
│ │ (dist/)      │ │        │ │             │ │
│ │              │◄┼────────┼►│ Port: 10000 │ │
│ │ - Home page  │ │        │ │             │ │
│ │ - Story feed │ │        │ │ /api/stories│ │
│ │ - Details    │ │        │ │ /api/react..│ │
│ └──────────────┘ │        │ └─────────────┘ │
│                  │        │                 │
│  ENV VARS:       │        │  ENV VARS:      │
│  - VITE_API_URL  │        │  - MONGODB_URI  │
│    ↓↓↓           │        │  - PORT         │
│  https://        │        │  - NODE_ENV     │
│    redecho-      │        │                 │
│    backend.      │        │                 │
│    onrender.com  │        │                 │
└──────────────────┘        └────────┬────────┘
                                     │
                                     │HTTP/TCP
                                     │
                        ┌────────────▼────────┐
                        │ MONGODB ATLAS       │
                        │ (Cloud Database)    │
                        │                     │
                        │ Collections:        │
                        │ - users             │
                        │ - stories           │
                        │ - comments          │
                        │ - reactions         │
                        │                     │
                        │ Storage: 512MB      │
                        └─────────────────────┘
```

---

## Data Flow Diagram

### Creating a Story
```
USER (Browser)
    │ Input story text
    ↓
React Component (StoryForm)
    │ Validates input (max 2000 chars)
    ↓
API Request (Axios)
    │ POST to https://redecho-backend.onrender.com/api/stories
    │ Body: {title, content, emotion, username}
    ↓
Express Backend
    ├─ Validate input
    ├─ Check profanity
    ├─ Check spam (30-sec cooldown)
    ↓
MongoDB
    │ Insert Story document
    ├─ Store title, content, emotion
    ├─ Initialize reactions = {relate: 0, helpful: 0, ...}
    ↓
API Response
    │ Return created story with _id and timestamp
    ↓
React State Update (UserContext)
    │ Add story to stories list
    ↓
Browser UI
    │ Display story in feed
    │ Store reactions in localStorage
```

### Adding a Reaction
```
USER (Browser)
    │ Click reaction button (e.g., "Relate ❤️")
    ↓
React Handler (StoryDetails.jsx)
    ├─ OPTIMISTIC: Immediately update UI
    ├─ Show loading state
    ├─ Update localStorage
    ↓
API Request (POST /api/reactions)
    │ Body: {storyId, username, reactionType}
    ↓
Express Backend
    ├─ Check if reaction exists
    ├─ If new: Insert reaction doc
    ├─ If exists: Delete reaction doc (toggle)
    ├─ Recalculate story.reactions counts
    ↓
MongoDB
    │ Update Story.reactions count
    ↓
API Response
    │ Return updated story with new reaction counts
    ↓
React Update
    │ Update story state with server data
    ↓
Browser UI
    │ Display updated reaction counts
    │ Buttons remain responsive (no lag)
```

---

## Component Hierarchy

```
App.jsx (Router setup + UserProvider)
│
├─ Navbar.jsx
│  └─ Displays: username, branding
│
├─ Home.jsx (Feed)
│  ├─ StoryForm.jsx
│  │  └─ Creates new story
│  │
│  └─ StoryCard.jsx (loop)
│     ├─ Shows: title, emotion, date
│     ├─ Shows: reaction counts
│     ├─ Links to: StoryDetails
│
└─ StoryDetails.jsx (Story page)
   ├─ Full story content
   ├─ Reaction buttons (4 types)
   │  └─ Optimistic UI + loading
   ├─ CommentSection.jsx
   │  ├─ List comments
   │  └─ Add comment form
   │
   └─ Back to Home link
```

---

## State Management

```
App.jsx
│
└─ UserContext.Provider
   │
   ├─ value: { username }
   │  └─ Generated on first visit
   │  └─ Persisted in localStorage
   │
   └─ Child components access via useContext(UserContext)
      ├─ Navbar.jsx (display username)
      ├─ StoryForm.jsx (attach to new stories)
      ├─ StoryCard.jsx (show author)
      └─ StoryDetails.jsx (track reactions per user)
```

Local state (per component):
```
StoryDetails.jsx:
├─ story (from API)
├─ comments (from API)
├─ userReactions (from localStorage)
├─ isLoading (form state)
├─ reactingTo (loading state for buttons)
└─ error (error message)

Home.jsx:
├─ stories (from API)
├─ isLoading
└─ error
```

---

## API Architecture

```
Express Server (server.js)
│
├─ Middleware
│  ├─ cors() - Allow cross-origin requests
│  ├─ express.json() - Parse JSON body
│  └─ custom error handler
│
├─ Routes
│  ├─ /api/stories (stories.js)
│  │  ├─ GET / → List all stories
│  │  ├─ GET /:id → Get one story
│  │  └─ POST / → Create story
│  │
│  ├─ /api/reactions (reactions.js)
│  │  └─ POST / → Add/remove reaction
│  │
│  ├─ /api/comments (comments.js)
│  │  ├─ GET /:storyId → List comments
│  │  └─ POST /:storyId → Add comment
│  │
│  └─ /api/health → Server status
│
├─ Models (Mongoose schemas)
│  ├─ User (username)
│  ├─ Story (title, content, emotion, reactions)
│  ├─ Comment (storyId, username, content)
│  └─ Reaction (storyId, username, reactionType)
│
└─ Middleware (moderation.js)
   ├─ filterProfanity()
   └─ checkSpam()
```

---

## Request/Response Flow

### Example: Create Story

**Request**:
```
POST https://redecho-backend.onrender.com/api/stories
Content-Type: application/json

{
  "username": "SilentSoul_8392",
  "title": "My Journey",
  "content": "Today was...",
  "emotion": "Love"
}
```

**Backend Processing**:
```
1. Validate request body
   └─ title: required, string
   └─ content: required, string, max 2000
   └─ emotion: required, enum
   
2. Check profanity
   └─ Filter bad words
   
3. Check spam
   └─ Is this user's last story < 30 sec old?
   
4. Create Story in MongoDB
   └─ Insert document
   └─ Auto-populate: reactions, timestamps, _id
   
5. Return response
```

**Response**:
```
201 Created
Content-Type: application/json

{
  "_id": "507f1f77bcf86cd799439011",
  "username": "SilentSoul_8392",
  "title": "My Journey",
  "content": "Today was...",
  "emotion": "Love",
  "reactions": {
    "relate": 0,
    "helpful": 0,
    "support": 0,
    "emotional": 0
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Frontend Handling**:
```
1. If status 201:
   └─ Add story to UI list
   └─ Clear form
   └─ Show success message
   
2. If status 400:
   └─ Show validation error
   └─ Highlight problematic field
   
3. If status 429:
   └─ Show "Wait 30 seconds" message
   
4. If error:
   └─ Show error message
   └─ Keep form data
```

---

## Authentication Flow (Anonymous)

```
First Visit to App
│
├─ Check localStorage for "username"
├─ If not found:
│  └─ Generate random: "{Adjective}{Noun}_{4-digit-number}"
│  └─ Examples:
│     ├─ "SilentSoul_8392"
│     ├─ "BraveHeart_5621"
│     ├─ "QuietMind_3847"
│  └─ Store in localStorage["username"]
│
├─ If found:
│  └─ Reuse existing username
│
└─ Provide username to UserContext
   └─ Available to all components via useContext()
```

No server-side authentication needed - completely anonymous!

---

## Database Schema Relationships

```
User (1) ──────┬───→ (many) Story
               │     └─ Stories posted by user
               │
               └───→ (many) Comment
                     └─ Comments by user
                     
Story (1) ──────┬───→ (many) Comment
                │     └─ Comments on story
                │
                └───→ (many) Reaction
                      └─ Reactions to story
                      
Reaction (many) ──→ (1) Story
└─ Track which story, who reacted, reaction type
└─ Unique constraint: (storyId, username)
   └─ Only 1 reaction per user per story
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│         GITHUB REPOSITORY (source code)             │
│                                                     │
│  ├─ server/  (backend)                              │
│  ├─ client/  (frontend)                             │
│  └─ docs/    (documentation)                        │
└──────────────┬──────────────────────────────────────┘
               │ (GitHub webhooks on push)
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼────────┐  ┌──────▼──────┐
│   RENDER     │  │   VERCEL    │
│   Webhook    │  │   Webhook   │
└────┬────────┘  └──────┬───────┘
     │                  │
┌────▼────────────┐ ┌──▼──────────┐
│ CI/CD Pipeline: │ │ CI/CD:      │
│                 │ │             │
│ 1. Pull code    │ │ 1. Pull code│
│ 2. npm install  │ │ 2. npm i    │
│ 3. npm start    │ │ 3. npm build│
│ 4. Auto-deploy  │ │ 4. Deploy   │
└────┬────────────┘ └──┬──────────┘
     │                 │
┌────▼──────────────────▼─────┐
│  Production Environment     │
│                             │
│  Backend: port 10000        │
│  Frontend: CDN + Server     │
│  Database: MongoDB Atlas    │
└─────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────┐
│     BROWSER (Frontend)          │
│                                 │
│ - All secrets stored in .env    │
│ - No credentials in HTML        │
│ - HTTPS only (Vercel/Render)    │
└──────────────┬──────────────────┘
               │ HTTPS
               │
┌──────────────▼──────────────────┐
│   EXPRESS API (Backend)         │
│                                 │
│ ├─ CORS whitelist               │
│ ├─ Input validation             │
│ ├─ Profanity filter             │
│ ├─ Rate limiting (30-sec)       │
│ └─ Environment variables only   │
│    └─ MONGODB_URI               │
│    └─ PORT                      │
│    └─ NODE_ENV                  │
└──────────────┬──────────────────┘
               │ MongoDB Driver
               │
┌──────────────▼──────────────────┐
│  MONGODB ATLAS                  │
│                                 │
│ ├─ IP Whitelist (0.0.0.0/0)     │
│ ├─ Database user + password     │
│ ├─ Encryption in transit        │
│ ├─ Version control              │
│ │  └─ .env in .gitignore        │
│ └─ Automatic backups            │
└─────────────────────────────────┘
```

---

## Error Handling Flow

```
Any Error Occurs
│
├─ Frontend Error
│  ├─ Axios interceptor catches
│  ├─ Check status code
│  ├─ Display user-friendly message
│  ├─ Log to console (dev mode)
│  └─ Optional: Send to error tracking
│
├─ Backend Error
│  ├─ Express error middleware
│  ├─ Log error with context
│  ├─ Return appropriate HTTP status
│  │  ├─ 400: Bad request (validation)
│  │  ├─ 429: Too many requests (spam)
│  │  ├─ 500: Server error
│  │  └─ etc.
│  └─ Send error message to frontend
│
├─ Database Error
│  ├─ MongoDB driver catches
│  ├─ Express error handler logs
│  ├─ Return 500 to frontend
│  └─ Optional: Retry logic
│
└─ Network Error
   ├─ Axios timeout/no response
   ├─ UI shows "No connection" message
   └─ Optional: Offline queue/retry
```

---

## Performance Considerations

```
Frontend Optimization:
├─ Vite bundling (tree-shaking)
├─ Code splitting (route-based)
├─ CSS optimization (Tailwind purge)
├─ Image optimization (CDN via Vercel)
├─ LocalStorage caching (reactions)
└─ Lazy loading (React.lazy for routes)

Backend Optimization:
├─ MongoDB indexing:
│  ├─ Story: createdAt (for sorting)
│  ├─ Comment: storyId (for filtering)
│  └─ Reaction: (storyId, username)
├─ Query optimization (lean queries)
├─ Caching headers (Vercel CDN)
├─ Connection pooling (Mongoose default)
└─ Gzip compression (Express)

Database Optimization:
├─ 512MB storage limit (M0 free tier)
├─ Auto-scaling disabled (free tier)
├─ Connection limits: 500 concurrent
└─ Automatic backups hourly
```

---

## Scaling Considerations (Future)

If RedEcho grows beyond free tier limits:

```
1. Database
   └─ Upgrade MongoDB Atlas tier
   └─ Add replication for redundancy
   └─ Consider sharding for >2GB data

2. Backend
   └─ Switch from Render to AWS/GCP
   └─ Add load balancer
   └─ Horizontal scaling (multiple instances)
   └─ Consider message queue (Bull, RabbitMQ)

3. Frontend
   └─ Add CDN edge caching
   └─ Service workers for offline
   └─ Progressive image loading

4. General
   └─ Add monitoring (Sentry, DataDog)
   └─ Add analytics
   └─ Add API rate limiting
   └─ Implement JWT auth (private stories)
   └─ Add admin dashboard
```

---

**For detailed deployment steps, see [DEPLOYMENT.md](DEPLOYMENT.md)**
