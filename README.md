# Disability Pride Connect

A full-stack community platform designed to connect individuals with disabilities, service providers, NGOs, and caregivers. The platform fosters community, resources sharing, event coordination, and peer support in an accessible, inclusive environment.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Authentication](#authentication)
- [Contributing](#contributing)

---

## Overview

**Disability Pride Connect** is a community hub where:
- **Individuals** with disabilities can connect, share experiences, and access resources.
- **Service Providers & NGOs** can list their services and reach those who need them.
- **Caregivers** can find community support and information.

The platform includes forums, a service-provider directory, event management, private messaging, a resource library, and user profiles — all behind JWT-authenticated protected routes.

---

## Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register / Login with JWT tokens; bcrypt password hashing |
| 💬 **Forums** | Create posts, comment, and like discussions by category and tags |
| 📂 **Service Directory** | Browse and register disability-focused service providers |
| 📅 **Events** | Create and attend in-person or virtual events with accessibility features |
| 📨 **Private Messaging** | Direct messaging between community members |
| 📚 **Resources** | Share and discover articles, links, and guides |
| 👤 **Profiles** | View and edit personal profiles with disability categories |
| 🏘️ **Community** | Community overview dashboard |
| 📊 **Dashboard** | Personalized activity feed and stats |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| shadcn/ui + Radix UI | Latest | Accessible component library |
| Axios | 1.8 | HTTP client |
| Recharts | 3 | Data visualisation |
| React Hook Form + Zod | Latest | Form management and validation |
| CRACO | 7 | Create React App config override |
| Lucide React | Latest | Icon set |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.110 | REST API framework |
| Uvicorn | 0.25 | ASGI server |
| Motor | 3.3 | Async MongoDB driver |
| MongoDB | — | Primary database |
| PyJWT | 2.10 | JWT authentication |
| bcrypt | 4.1 | Password hashing |
| Pydantic | 2.6 | Data validation & serialisation |
| python-dotenv | 1.0 | Environment configuration |

---

## Project Structure

```
my-reab/
├── backend/
│   ├── server.py            # FastAPI application & all API routes
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js           # Root component with routing
│   │   ├── pages/           # Page-level components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Forums.jsx
│   │   │   ├── ForumPost.jsx
│   │   │   ├── Directory.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Community.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── public/
│   ├── package.json
│   ├── craco.config.js
│   └── tailwind.config.js
├── tests/                   # Test files
├── backend_test.py          # Backend integration tests
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and **Yarn** v1.22+
- **Python** 3.10+
- **MongoDB** instance (local or cloud, e.g. MongoDB Atlas)

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file** in the `backend/` directory (see [Environment Variables](#environment-variables)):
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=disability_pride_connect
   JWT_SECRET=your-secret-key-here
   CORS_ORIGINS=http://localhost:3000
   ```

5. **Start the server:**
   ```bash
   uvicorn server:app --reload --port 8001
   ```
   The API will be available at `http://localhost:8001`  
   Interactive docs at `http://localhost:8001/docs`

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   yarn start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production:**
   ```bash
   yarn build
   ```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | ✅ | MongoDB connection string |
| `DB_NAME` | ✅ | Database name |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `CORS_ORIGINS` | ❌ | Comma-separated allowed origins (default: `*`) |

---

## API Reference

All API routes are prefixed with `/api`.

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `PUT` | `/api/auth/me` | ✅ | Update current user profile |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | ❌ | List users (filter by type, disability, location) |
| `GET` | `/api/users/{id}` | ❌ | Get a single user |

### Forums
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/forums` | ❌ | List all posts (filter by category, tag, search) |
| `POST` | `/api/forums` | ✅ | Create a new forum post |
| `GET` | `/api/forums/{id}` | ❌ | Get a single post |
| `POST` | `/api/forums/{id}/like` | ✅ | Toggle like on a post |
| `GET` | `/api/forums/{id}/comments` | ❌ | List comments on a post |
| `POST` | `/api/forums/{id}/comments` | ✅ | Add a comment |

### Service Directory
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/providers` | ❌ | List providers (filter by service, focus, location, search) |
| `POST` | `/api/providers` | ✅ | Register a new service provider |
| `GET` | `/api/providers/{id}` | ❌ | Get a single provider |

### Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/events` | ❌ | List events (filter by type, virtual, location) |
| `POST` | `/api/events` | ✅ | Create a new event |
| `GET` | `/api/events/{id}` | ❌ | Get a single event |
| `POST` | `/api/events/{id}/attend` | ✅ | Toggle attendance on an event |

### Messages
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/messages/conversations` | ✅ | List all conversations |
| `GET` | `/api/messages/{user_id}` | ✅ | Get messages with a specific user |
| `POST` | `/api/messages` | ✅ | Send a message |

### Resources
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/resources` | ❌ | List resources (filter by category, tag, search) |
| `POST` | `/api/resources` | ✅ | Create a new resource |
| `GET` | `/api/resources/{id}` | ❌ | Get a single resource (increments view count) |

### Stats
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/stats` | ❌ | Platform-wide statistics (users, providers, events, etc.) |

---

## Pages & Routes

| Route | Auth Required | Page |
|---|---|---|
| `/` | ❌ | Landing page (public home) |
| `/login` | ❌ | Login form |
| `/register` | ❌ | Registration form with user type & disability categories |
| `/dashboard` | ✅ | Personalised dashboard |
| `/forums` | ✅ | Forum listing |
| `/forums/:postId` | ✅ | Single forum post with comments |
| `/directory` | ✅ | Service provider directory |
| `/events` | ✅ | Events listing and management |
| `/resources` | ✅ | Resource library |
| `/messages` | ✅ | Private messaging inbox |
| `/community` | ✅ | Community overview |
| `/profile` | ✅ | User profile and settings |

> Public routes redirect authenticated users to `/dashboard`. Protected routes redirect unauthenticated users to `/login`.

---

## Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

- Tokens are issued on **register** and **login**, valid for **24 hours**.
- The token must be sent in the `Authorization` header as a `Bearer` token for protected routes.
- The frontend stores the token and manages auth state via `AuthContext`.
- User types: `individual`, `service_provider`, `ngo`, `caregiver`
- Disability categories: `physical`, `cognitive`, `invisible`, `psychiatric`, `sensory`, `multiple`, `prefer_not_to_say`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure code follows existing style conventions and all tests pass before submitting a PR.

---

*Built with ❤️ for the disability community.*
