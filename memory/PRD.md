# Disability Pride Connect - Product Requirements Document

## Overview
A global platform for people with disabilities to connect, share experiences, find service providers, and celebrate disability pride.

## Original Problem Statement
Build a platform for people with disability to connect all around the world. The purpose is to help disabled people build social contact, connect with disability service providers, NGOs to increase their reach for supporting globally. Theme based on the Disability Pride Flag (charcoal gray background with red, gold, white, blue, and green stripes representing different disability categories).

## Architecture
- **Frontend**: React 19 with Tailwind CSS, Shadcn UI components
- **Backend**: FastAPI with Python
- **Database**: MongoDB
- **Authentication**: JWT-based email/password

## User Personas
1. **Individuals with Disabilities** - Primary users seeking community and support
2. **Service Providers** - Healthcare, therapy, rehabilitation organizations
3. **NGOs/Non-Profits** - Advocacy and support organizations
4. **Caregivers/Family Members** - Support network

## Core Requirements (Static)
- User registration with disability category selection
- Community forums for discussions
- Service provider directory with search/filter
- Event listings (virtual and in-person)
- Resource library
- Direct messaging
- Profile management

## What's Been Implemented (Feb 22, 2026)

### Backend (100% Complete)
- User authentication (register, login, JWT tokens)
- User CRUD operations with disability categories
- Forum posts with likes and comments
- Service provider directory with services/disability focus
- Events with accessibility features and RSVP
- Resource library with categories and tags
- Direct messaging with conversations
- Platform statistics endpoint

### Frontend (95% Complete)
- Landing page with Disability Pride Flag theme
- Login/Register with disability category selection
- Dashboard with stats, quick actions, recent activity
- Forums page with create post, categories, search
- Service Directory with filters and registration
- Events page with calendar picker, accessibility features
- Resources library with categories
- Messages page with conversations
- Community page with member filtering
- Profile page with edit functionality

### Design Implementation
- Charcoal/dark theme (#121212 background)
- Pride accent colors: Red (#FF5C5C), Gold (#FFD700), White (#F4F4F5), Blue (#38BDF8), Green (#34D399)
- Lexend font for headings, Atkinson Hyperlegible for body (accessibility)
- Diagonal stripe motif representing "cutting across barriers"
- High contrast (WCAG AAA compliance)
- Disability category badges with pride colors

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Image upload for profiles and posts

### P1 - High Priority
- [ ] Real-time messaging (WebSocket)
- [ ] Notifications system
- [ ] Search across all content
- [ ] Admin moderation panel

### P2 - Medium Priority
- [ ] Provider verification system
- [ ] Event reminders
- [ ] Resource bookmarking
- [ ] User blocking/reporting
- [ ] Analytics dashboard

### P3 - Nice to Have
- [ ] Multi-language support
- [ ] Video calling integration
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

## Next Tasks List
1. Add password reset flow
2. Implement email verification with SendGrid/Resend
3. Add image upload for avatars (S3 or similar)
4. Implement real-time messaging with WebSocket
5. Add notification center

## Technical Notes
- Backend running on port 8001
- Frontend running on port 3000
- MongoDB database: test_database
- All API routes prefixed with /api
- JWT expiration: 24 hours
