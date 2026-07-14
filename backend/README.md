# Backend - Task Manager API

This is the Django REST Framework backend for the Team Task Management application. It serves as an API providing data for Projects, Tasks, Comments, and Users.

## Prerequisites

- Python 3.8 or higher

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

- **Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**3. Install Dependencies**

```bash
pip install django djangorestframework django-cors-headers
```

**4. Run Database Migrations**
This will generate the local `db.sqlite3` file and build the tables.

```bash
python manage.py makemigrations task_manager
python manage.py migrate
```

**5. Start the Development Server**

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`.

## Architecture Notes

- **Authentication:** Uses `rest_framework.authtoken`. Tokens must be passed in the `Authorization` header as `Token <your_token>`.
- **Permissions:** Secured globally via `IsAuthenticated`. Object-level permissions are explicitly checked in `views.py`.
