# Todo App Backend Setup Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+
- npm

## Setup Steps

1. Clone and Install Dependencies
```bash
git clone
cd todo-app-express-backend
npm install
```

2. Configure Environment
Create `.env` file in project root:
```
DATABASE_URL="mysql://todo_user:todo_password@localhost:3306/todo_db"
PORT=3000
```

3. Start Database
```bash
docker compose up -d
```

4. Run Migrations
```bash
npx prisma migrate dev
```

5. Start Application
Development mode:
```bash
npm run dev
```

6. Run Tests
```bash
npm run test
```

## Verify Installation
- API should be running at: http://localhost:3000
- Database should be accessible at: localhost:5432