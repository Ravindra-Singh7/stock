# StockIt: Stock Analyzer and Screener

StockIt is a full-stack stock analysis platform with a React + Vite frontend and a FastAPI backend. It includes a premium dark dashboard, stock detail pages with live price streaming, candlestick charts, SMA/RSI indicators, a baseline linear regression prediction service, and SQLite-backed portfolio/watchlist tracking.

## Project Structure

```text
STOCKIT1/
  backend/
    app/
      api/
      core/
      db/
      models/
      schemas/
      services/
    requirements.txt
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      utils/
    package.json
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000` and exposes:

- `GET /api/stock/{symbol}`
- `GET /api/predict/{symbol}`
- `GET /api/market/featured`
- `GET /api/search?query=...`
- `GET /api/portfolio`
- `POST /api/portfolio`
- `GET /api/watchlist`
- `POST /api/watchlist`
- `WS /api/ws/{symbol}`

By default, the backend stores its SQLite database in your system temp directory under `StockIt/stockit.db`. This avoids OneDrive file-locking issues that can break SQLite when the project lives in a synced folder.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Deployment Notes

- Frontend is ready for Vercel. Set `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` to your deployed backend.
- Backend is ready for Render or AWS. Set `DATABASE_URL`, `FRONTEND_URL`, and the demo user env vars as needed.
- For PostgreSQL, change `DATABASE_URL` to a SQLAlchemy-compatible Postgres connection string.

## Current Architecture Highlights

- Modular frontend organization with `components`, `pages`, `hooks`, `services`, and `utils`
- FastAPI service split into routing, market data, indicators, prediction, and seed modules
- Linear regression forecast service for stock prediction
- SQLite persistence for users, watchlist entries, and portfolio holdings
