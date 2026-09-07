const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000/api/ws";
let authUserId = null;

export function setAuthUserId(userId) {
  authUserId = userId;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authUserId ? { "X-User-Id": authUserId } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  getFeaturedStocks: () => request("/market/featured"),
  searchStocks: (query) => request(`/search?query=${encodeURIComponent(query)}`),
  getStock: (symbol) => request(`/stock/${symbol}`),
  getPrediction: (symbol) => request(`/predict/${symbol}`),
  getPortfolio: () => request("/portfolio"),
  addPortfolioHolding: (payload) => request("/portfolio", { method: "POST", body: JSON.stringify(payload) }),
  getWatchlist: () => request("/watchlist"),
  addWatchlistItem: (payload) => request("/watchlist", { method: "POST", body: JSON.stringify(payload) })
};

export function createStockSocket(symbol) {
  return new WebSocket(`${WS_BASE_URL}/${symbol}`);
}
