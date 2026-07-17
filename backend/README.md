# Backend - Task Manager API

This is the Django REST Framework backend for the Team Task Management application. It serves as an API providing data for Projects, Tasks, Comments, and Users.

## Local Setup Instructions

**1. Navigate to the backend directory**

```bash
cd backend
```

**2. Create and activate a virtual environment**

- **Mac/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**3. Install Dependencies**

```bash
pip install django djangorestframework django-cors-headers
```

**4. Run Database Migrations**

```bash
python manage.py makemigrations task_manager
python manage.py migrate
```

**5. Start the Server**

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`.

---

## API Documentation

All protected endpoints require the following HTTP header:
`Authorization: Token <your_token>`

### Authentication

- **GET** `/api/status/` - Health check endpoint. Returns `{"status": "healthy"}`.
- **POST** `/api/register/` - Register a new user. (Payload: `username`, `password`, `email`)
- **POST** `/api/login/` - Login and receive a token. (Payload: `username`, `password`)

### Projects

- **GET** `/api/projects/` - Retrieve projects owned by or assigned to the user.
- **POST** `/api/projects/` - Create a new project. (Payload: `name`, `description`)
- **GET** `/api/projects/<id>/` - Retrieve details of a specific project.
- **DELETE** `/api/projects/<id>/` - Delete a project (Must be the project owner).

### Tasks

- **GET** `/api/tasks/?project=<id>` - Retrieve tasks for a specific project.
- **POST** `/api/tasks/` - Create a new task. (Payload: `title`, `description`, `due_date`, `priority`, `status`, `project`, `assigned_to`)
- **PUT** `/api/tasks/<id>/` - Fully update a task.
- **PATCH** `/api/tasks/<id>/` - Partially update a task (e.g., changing status to 'Completed').
- **DELETE** `/api/tasks/<id>/` - Delete a task.

### Comments

- **GET** `/api/comments/?task=<id>` - Retrieve all comments for a specific task.
- **POST** `/api/comments/` - Add a comment to a task. (Payload: `task`, `content`)

### Users & Dashboard

- **GET** `/api/users/` - Retrieve a list of registered users for assignment dropdowns.
- **GET** `/api/dashboard/` - Retrieve project and task statistics for the logged-in user.
