# REST API Based To-Do Application

A full-stack MERN To-Do application demonstrating REST APIs, MongoDB database integration, CRUD operations, validation, responsive design, and modern CSS.

## Tech Stack
- Frontend: React + Vite + Axios
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Styling: CSS

## Features
- Add, edit, delete, and complete tasks
- Search tasks
- Filter by All / Active / Completed
- Task validation
- REST API
- MongoDB persistence
- Responsive modern UI
- Error/loading/empty states

## Project Structure
```
todo-full-stack/
├── backend/
│   ├── models/
│   │   └── Todo.js
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TodoForm.jsx
    │   │   └── TodoItem.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    └── package.json
```

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection

## Run Backend
```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on http://localhost:5000

## Run Frontend
Open another terminal:
```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, normally http://localhost:5173.

## API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/todos | Get all todos |
| GET | /api/todos/:id | Get one todo |
| POST | /api/todos | Create todo |
| PUT | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |
| PATCH | /api/todos/:id/toggle | Toggle completion |
| GET | /api/health | API health check |

### Example POST
```json
{
  "title": "Complete full stack project",
  "description": "Finish the REST API based To-Do application",
  "priority": "high"
}
```

## MongoDB
Default local database:
`mongodb://127.0.0.1:27017/todo_app`

Collection:
`todos`

## Submission
The project is intentionally kept simple and readable for a practical full-stack development submission.
