# Team Task Management Application

A full-stack web application designed for teams to create projects, manage tasks via a Kanban-style board, assign work, and discuss progress through comments.

This project was built as a Full-Stack Assignment utilizing **Django REST Framework** for the backend and **React JS (Vite)** for the frontend.

## Features Implemented (Days 1-6)

- **Secure Authentication:** DRF Token Authentication with password hashing and protected React routing.
- **Project Management:** Users can create, view, and delete projects. (Privacy enforced: users only see their own projects).
- **Task Management:** Create, edit, delete, and assign tasks to registered users.
- **Kanban Board:** Dynamic UI allowing users to move tasks between _Todo_, _In Progress_, and _Completed_ statuses via `PATCH` requests.
- **Task Comments:** Dedicated task view where users can discuss tasks in real-time.
- **Security & Authorization:** Strict Object-Level Permissions enforcing that users can only modify or delete data if they are the Project Owner, Task Creator, or Task Assignee.
- **Robust Error Handling:** Full `try/catch` coverage on the frontend and backend, ensuring graceful degradation and 500 error handling without server crashes.

## Tech Stack

- **Backend:** Python, Django, Django REST Framework, SQLite
- **Frontend:** JavaScript, React, Vite, React Router, Context API

## Project Structure

This repository is configured as a monorepo containing two distinct applications:

- `/backend` - The Django REST API
- `/frontend` - The React User Interface

Please see the respective `README.md` files inside the `/backend` and `/frontend` folders for detailed instructions on how to run them locally.
