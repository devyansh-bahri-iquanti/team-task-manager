# Frontend - Task Manager UI

This is the React frontend for the Team Task Management application, built with Vite. It features a modular "Folder-as-Component" architecture.

## Prerequisites

- Node.js (v16 or higher)
- npm

## Local Setup Instructions

**1. Navigate to the frontend directory**

```bash
cd frontend
```

**2. Install Dependencies**

```bash
npm install
npm install react-router-dom
```

**3. Configure Environment Variables**
Create a `.env` file in the root of the `frontend` folder and add the API Base URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

**4. Start the Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`.

## Architecture Notes

- **State Management:** Uses React Context API (`AuthContext`) for global authentication state and standard `useState`/`useEffect` for local component state.
- **Routing:** Uses `react-router-dom` with a custom `<PrivateRoute>` wrapper to protect authenticated views.
- **Styling:** Modular CSS mapped to individual component folders.
