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
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Railway start command
│   └── nixpacks.toml         # Railway build config
├── frontend/
│   ├── src/
│   │   ├── App.js           # Root component with routing
│   │   ├── pages/           # Page-level components
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── public/
│   ├── package.json
│   ├── craco.config.js      # CRACO configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── Procfile             # Railway start command
│   └── nixpacks.toml         # Railway build config
├── tests/                   # Test files
├── backend_test.py          # Backend integration tests
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v20+ and **npm**
- **Python** 3.10+
- **MongoDB** instance (local on port 27017 or cloud Atlas)

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
   python -m uvicorn server:app --reload --port 8001
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
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` is required for dependency resolution)*

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
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

## Deploying on Railway

The project deploys as **3 Railway services**: **Backend** (FastAPI), **Frontend** (React static), and **MongoDB** (plugin).

> All necessary Railway config files (`Procfile`, `nixpacks.toml`) are already included in the repository.

---

### Step 1 — Create a Railway Project

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project → Empty Project**.

---

### Step 2 — Add MongoDB

1. In your project, click **+ New → Database → Add MongoDB**.
2. Railway will provision a MongoDB instance and expose a `MONGO_URL` variable — this is automatically injected into any service in the same project.

---

### Step 3 — Deploy the Backend

1. Click **+ New → GitHub Repo**, select your repository, and set the **Root Directory** to `backend`.
2. Railway will detect `nixpacks.toml` and build automatically.
3. Once deployed, go to **Settings → Networking → Generate Domain** to get the backend public URL (e.g. `https://backend-xxx.railway.app`).
4. Under **Variables**, add:

| Variable | Value |
|---|---|
| `DB_NAME` | `disability_pride_connect` |
| `JWT_SECRET` | A long random string (e.g. run `openssl rand -hex 32`) |
| `CORS_ORIGINS` | *(set this after your frontend URL is known — see Step 4)* |

> `MONGO_URL` and `PORT` are automatically provided by Railway — do **not** add them manually.

---

### Step 4 — Deploy the Frontend

1. Click **+ New → GitHub Repo**, select the **same repository**, and set **Root Directory** to `frontend`.
2. **Before the first deploy**, go to **Variables** and add:

| Variable | Value |
|---|---|
| `REACT_APP_BACKEND_URL` | The backend public URL from Step 3 (no trailing slash) |

> ⚠️ **This must be set before the build runs.** React bakes env vars into the static bundle at build time. If you forget, set the variable and trigger a manual redeploy.

3. Once deployed, generate a domain for the frontend too (e.g. `https://frontend-xxx.railway.app`).

---

### Step 5 — Update CORS on the Backend

Now that you know the frontend URL, go back to the **backend service → Variables** and set:

```
CORS_ORIGINS=https://frontend-xxx.railway.app
```

Then **redeploy the backend** (Railway → Deployments → Redeploy).

---

### Step 6 — Verify

| Check | Expected result |
|---|---|
| `GET https://<backend>/api/` | `{"message": "Disability Pride Connect API", "status": "healthy"}` |
| `https://<backend>/docs` | FastAPI Swagger UI loads |
| `https://<frontend>/` | Landing page loads |
| Register + Login | Redirects to dashboard; JWT stored in localStorage |
| No CORS errors | DevTools → Network: no red CORS failures on API requests |

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
