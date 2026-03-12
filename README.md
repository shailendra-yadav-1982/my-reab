# MyEnAb

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

**MyEnAb** is a community hub where:
- **Individuals** with disabilities can connect, share experiences, and access resources.
- **Service Providers & NGOs** can list their services and reach those who need them.
- **Caregivers** can find community support and information.

The platform includes forums, a service-provider directory, event management, private messaging, a resource library, and user profiles — all behind JWT-authenticated protected routes.

---

## Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register/Login with JWT, Email Verification, and Google SSO integration |
| 💬 **Forums** | Create posts, comment, and like discussions by category and tags |
| 📂 **Service Directory** | Browse and register disability-focused service providers (Role-restricted) |
| 📅 **Events** | Create and attend in-person or virtual events with accessibility features (Role-restricted) |
| 📨 **Private Messaging** | Direct messaging with **real-time updates**, **typing indicators**, and **online status dots** |
| 📚 **Resources** | Share and discover articles, links, and guides |
| 👤 **Profiles** | View and edit personal profiles with disability categories |
| 🏘️ **Community** | Community directory excluding self-view |
| ♿ **Accessibility** | Dedicated page explaining commitment and features |
| 🔒 **Role-Based UI** | Dynamic dashboards and actions based on user type (NGO, Volunteer, etc.) |
| 📊 **Dashboard** | Personalized activity feed, stats, and role-specific Quick Actions |
| 🤝 **Connections** | Send and manage connection requests; messaging is restricted to connected members |
| 🔑 **Password Reset** | Recover account via email reset link (Resend integration) |
| 🔌 **Real-time** | Multi-instance broadcasting via **WebSockets & RabbitMQ** |

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
| Sonner | Latest | Toasts and notifications |

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
| aio-pika | 9.4 | RabbitMQ integration for WebSockets |
| RabbitMQ | 3.13 | Message broker (Scalable broadcasting) |
| Authlib | Latest | OIDC/SSO integration |

---

## Project Structure

```
myenab/
├── backend/
│   ├── app/
│   │   ├── api/             # API Endpoints (v1)
│   │   ├── core/            # Config, Security, DB, WebSockets
│   │   ├── models/          # Pydantic schemas (User, Message, etc.)
│   │   └── services/        # Business logic (Auth, Messaging, etc.)
│   ├── server.py            # Entry point
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Railway start command
│   └── nixpacks.toml         # Railway build config
├── frontend/
│   ├── src/
│   │   ├── App.js           # Root component with routing
│   │   ├── pages/           # Page-level components
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (AuthContext)
│   │   └── config.js        # Environment-aware configuration
│   ├── package.json
│   ├── craco.config.js      # CRACO configuration
│   └── tailwind.config.js   # Tailwind configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v20+ and **npm**
- **Python** 3.10+
- **MongoDB** instance (local on port 27017 or cloud Atlas)
- **RabbitMQ** (required for real-time features; defaults to in-memory fallback without it)

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

4. **Create a `.env` file** in the `backend/` directory:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=disability_inclusion_connect
   JWT_SECRET=your-secret-key-here
   CORS_ORIGINS=http://localhost:3000
   RABBITMQ_URL=amqp://guest:guest@localhost/
   OIDC_ISSUER_URL=https://accounts.google.com
   OIDC_CLIENT_ID=your-google-client-id
   OIDC_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start RabbitMQ (using Docker):**
   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

6. **Start the server:**
   ```bash
   python server.py
   ```
   The API will be available at `http://localhost:8000`  
   Interactive docs at `http://localhost:8000/docs`

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

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | ✅ | MongoDB connection string |
| `DB_NAME` | ✅ | Database name |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `RABBITMQ_PRIVATE_URL` | ✅ (Prod) | Internal RabbitMQ URL (e.g., `amqp://...internal`) |
| `OIDC_ISSUER_URL` | ✅ | Google/OIDC Issuer URL |
| `OIDC_CLIENT_ID` | ✅ | Google Cloud OAuth Client ID |
| `OIDC_CLIENT_SECRET` | ✅ | Google Cloud OAuth Client Secret |
| `FRONTEND_URL` | ✅ | Public URL of the frontend for SSO redirects |
| `ENVIRONMENT` | ❌ | Set to `production` for secure cookie handling |

---

## Deploying on Railway

### Step 1 — Infrastructure
1. **MongoDB**: Add the MongoDB Plugin.
2. **RabbitMQ**: Add a RabbitMQ service. 
   - **Crucial**: Use the **Private Hostname** (e.g., `rabbitmq.railway.internal`) for the connection string. Public domains like `.up.railway.app` will fail for AMQP traffic.

### Step 2 — Backend Configuration
1. Set `Root Directory` to `backend`.
2. Add variables:
   - `JWT_SECRET`: Random string.
   - `RABBITMQ_PRIVATE_URL`: Your RabbitMQ internal URL.
   - `FRONTEND_URL`: Your frontend domain.
   - `OIDC_...`: Your Google credentials.
   - `ENVIRONMENT`: `production`.

### Step 3 — Frontend Configuration
1. Set `Root Directory` to `frontend`.
2. Add variable:
   - `REACT_APP_BACKEND_URL`: Your backend domain (no trailing slash).
   - **Note**: The frontend uses `config.js` to automatically determine the WebSocket (`ws/wss`) URL based on this API URL.

---

## Real-time Messaging & Presence

The platform uses a **WebSocket + RabbitMQ** architecture to ensure messages are delivered instantly even across multiple server instances.

- **Status Dots**: Users show a green dot when they have an active WebSocket connection.
- **Typing Indicators**: Real-time feedback when a connection partner is typing.
- **Accepted Connections Only**: You can only message users with whom you have an "Accepted" connection status.
- **Production Routing**: The app automatically switches to `wss://` on production for secure, encrypted real-time communication.

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
