# Indian Doodh Dairy — MVP

This workspace contains a simple full-stack MVP for a dairy storefront with an admin panel.

Backend (Node/Express): backend/
Frontend (vanilla): frontend/

Run (development):

1. Open a terminal in the project root.
2. Install dependencies for backend:

```powershell
cd backend
npm install
```

3. Start backend:

```powershell
npm run dev
```

Server runs on port defined in `backend/.env` (default 4000). Frontend files are served from `frontend/` when the backend is running.

Seed data: `backend/data/products.json` contains sample products.

Admin credentials (development): set in `backend/.env`:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

API endpoints:
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)
- POST /api/auth/login

Notes & Next steps:
- Currently product images are referenced from `frontend/images/` as placeholders.
- Improvements: image upload, discount/tax logic, orders persistence, pagination, rate-limiting, HTTPS.

