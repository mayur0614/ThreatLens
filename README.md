# ThreatLens AI

An explainable cyber threat detection platform for phishing, malicious URLs, and prompt injection attacks. Built with FastAPI, scikit-learn, React, and MongoDB.

## Backend Deployment (Render)

1. Create a Web Service on Render.
2. Connect your GitHub repository containing this code.
3. Set the Build Command: `pip install -r backend/requirements.txt`
4. Set the Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add the Environment Variable: `MONGO_URI` pointing to your MongoDB Atlas cluster.

## Frontend Deployment (Vercel)

1. Import the project using Vercel.
2. Select the `frontend` directory as the Root Directory.
3. Vercel will automatically detect Vite. The build command will be `npm run build` and output directory `dist`.
4. Ensure the backend URL in `ScannerPage.jsx`, `AnalyticsPage.jsx`, and `LogsPage.jsx` points to your deployed backend URL instead of `http://localhost:8000`.

## Local Development
- **Backend:** `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
- **Frontend:** `cd frontend && npm install && npm run dev`
