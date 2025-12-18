# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tour Booking Application** - A full-stack web application for tour/car booking services currently in initial development phase. The project uses a multi-agent development system with specialized agents for different aspects of development.

**Repository**: https://github.com/tazabekov/tour-booking_room-2

## Architecture

### Multi-Agent Development System

This project uses a structured multi-agent orchestration system defined in `.claude/agent-coordinator.md`. When working on tasks:

1. **Read context first**: Always check `.claude/task-context.md` before starting any work
2. **Follow workflows**: Use the workflow patterns defined in `.claude/agent-coordinator.md`
3. **Update context**: Update `.claude/task-context.md` after completing tasks
4. **Use specialized agents**: Delegate to appropriate agents based on the task

### Agent Responsibilities

- **backend-developer**: FastAPI, PostgreSQL, SQLAlchemy, API endpoints, database migrations
- **frontend-developer**: React, TypeScript, component implementation, state management
- **ui-ux-designer**: Design systems, component specs, accessibility (must run BEFORE frontend implementation)
- **test-engineer**: Test infrastructure, unit/integration tests, coverage analysis
- **code-reviewer**: Code quality, security, maintainability (run BEFORE committing)
- **devops-engineer**: Docker, CI/CD, deployment, infrastructure

### Technology Stack

#### Backend (planned/in-progress)
- **Framework**: FastAPI (async-first, type hints)
- **Database**: PostgreSQL + SQLAlchemy 2.0 async + asyncpg
- **Migrations**: Alembic (REQUIRED for all schema changes)
- **Validation**: Pydantic v2
- **Configuration**: pydantic-settings + .env files
- **Testing**: pytest + pytest-asyncio + httpx AsyncClient

#### Frontend (planned/in-progress)
- **Core**: React 18+, TypeScript (strict mode), Vite
- **Routing**: React Router
- **Server State**: TanStack Query + Axios
- **Client State**: Zustand (global), Context (scoped)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest, React Testing Library

#### Infrastructure
- **Local Development**: Docker Compose
- **Environment**: .env files (never commit secrets)

## Project Structure

```
/
├── .claude/                    # Multi-agent system configuration
│   ├── agent-coordinator.md    # Orchestration rules and workflows
│   ├── task-context.md         # Live task context (READ THIS FIRST)
│   └── agents/                 # Individual agent specifications
├── backend/                    # FastAPI backend (currently empty)
├── plan/                       # Project planning documents
└── readme.md                   # Project documentation
```

## Development Workflow

### Starting Any Task

1. Read `.claude/task-context.md` to understand current state
2. Identify the appropriate workflow pattern from `.claude/agent-coordinator.md`
3. Select and invoke the appropriate specialized agent(s)
4. Update `.claude/task-context.md` with progress

### Backend Development

**Technology**: FastAPI + PostgreSQL + SQLAlchemy 2.0

**Critical Requirements**:
- Use async/await for ALL I/O operations
- ALL database schema changes through Alembic migrations
- Password hashing with bcrypt/passlib (NEVER plaintext)
- Input validation through Pydantic schemas
- Secrets in .env files only (ensure .env in .gitignore)
- Type hints on all functions
- No SQL string concatenation (ORM or parameterized queries only)

**Architecture Pattern** (adapt based on scale):
- Simple (<5 models): Routers → DB directly
- Medium (5-20 models): Routers → Services → DB
- Complex (>20 models): Routers → Services → Repositories → DB

**Setup Commands** (when backend is implemented):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend Development

**Technology**: React + TypeScript + Vite

**Critical Requirements**:
- TypeScript strict mode, avoid `any` types
- Functional components + hooks only
- Sanitize user inputs (DOMPurify for HTML)
- Never store tokens in localStorage (use httpOnly cookies)
- Environment variables for endpoints (never hardcode)
- Explicit loading/error/empty states for async operations
- No console.log in committed code

**Data Flow**:
- Server state → TanStack Query
- URL state → Router search params
- Form state → React Hook Form + Zod
- Global UI state → Zustand (minimize usage)
- Component state → useState/useReducer

**Setup Commands** (when frontend is implemented):
```bash
cd frontend
npm install
npm run dev
```

### Testing

**Backend**:
```bash
cd backend
pytest                        # Run all tests
pytest tests/test_file.py     # Run specific file
pytest -v --cov=app           # With coverage
```

**Frontend**:
```bash
cd frontend
npm test                      # Run all tests
npm run test:coverage         # With coverage
```

## Security Requirements

### Never Commit
- Plaintext passwords
- API keys or secrets in code
- .env files with real credentials
- Tokens in localStorage

### Always Validate
- All user inputs through schemas (Pydantic backend, Zod frontend)
- All external data at runtime
- SQL queries through ORM or parameterized queries

### Authentication
- Passwords hashed with bcrypt/passlib
- Tokens in httpOnly cookies or memory only
- CORS with explicit origins (no wildcards in production)

## Quality Gates

### Before Any Commit
- Code reviewed by code-reviewer agent
- Tests exist and pass (or test-engineer consulted)
- No security vulnerabilities flagged
- Follows existing patterns

### Before Production
- All quality gates above
- DevOps engineer verified configuration
- Health endpoints implemented
- Monitoring configured

## Common Patterns

### Full-Stack Feature Implementation
1. **ui-ux-designer** → Design flows and component specs
2. **backend-developer** → API endpoints and database schema
3. **frontend-developer** → UI components and integration
4. **test-engineer** → Comprehensive tests
5. **code-reviewer** → Review all changes
6. **devops-engineer** (if needed) → Update deployment configs

### Bug Fix
1. Analyze and locate bug
2. Appropriate developer agent fixes
3. **test-engineer** → Add regression test
4. **code-reviewer** → Verify fix

## Agent Invocation

When delegating to agents:
- Prepare context using the protocol in `.claude/agent-coordinator.md`
- Clearly state task and expected output
- Choose model (haiku for simple, sonnet for complex)
- Use parallel execution for independent tasks

## Notes

- This is a greenfield project in early development
- Backend directory currently empty (setup pending)
- Follow the multi-agent system for all significant work
- Always update `.claude/task-context.md` with progress
- Prioritize security and type safety throughout
