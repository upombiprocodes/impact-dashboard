# Deployment Guide

## 1. Frontend (Vercel)
The frontend is a React app located in the `frontend/` directory.

1.  **Push to GitHub**: Ensure your latest code is on GitHub.
2.  **Go to Vercel**: Log in to [vercel.com](https://vercel.com).
3.  **Add New Project**: Import your `impact-dashboard` repository.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Create React App (should be auto-detected).
    *   **Environment Variables**:
        *   `REACT_APP_API_URL`: Set this to your deployed backend URL (see below). For now, you can leave it empty or point to a mock.
5.  **Deploy**: Click "Deploy".

## 2. Backend (Render)
The backend is a FastAPI app located in the `backend/` directory.

1.  **Go to Render**: Log in to [render.com](https://render.com).
2.  **New Web Service**: Connect your GitHub repo.
3.  **Configure Service**:
    *   **Root Directory**: `backend`
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
4.  **Deploy**: Click "Create Web Service".
5.  **Copy URL**: Once deployed, copy the service URL (e.g., `https://impact-dashboard-api.onrender.com`).
6.  **Update Frontend**: Go back to Vercel -> Settings -> Environment Variables, and set `REACT_APP_API_URL` to `[Your Render URL]/api` (don't forget the `/api` at the end if your endpoints expect it, though the code appends it, so likely just the base URL).
    *   *Correction*: In `api.js`, we use `${API_URL}/dashboard/...`. The default was `.../api`. So set the env var to `https://your-app.onrender.com/api`.

> [!WARNING]
> **Database Persistence**: Render's free tier uses an ephemeral filesystem. The SQLite database (`sql_app.db`) will be reset every time the server restarts (which happens frequently on free tier). For persistent data, use Render's Disk (paid) or a hosted database like PostgreSQL (Supabase/Neon).
