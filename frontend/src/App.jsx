import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppShell from "./components/layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PortfolioPage from "./pages/PortfolioPage";
import RegisterPage from "./pages/RegisterPage";
import StockDetailPage from "./pages/StockDetailPage";
import WatchlistPage from "./pages/WatchlistPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/stock/:symbol" element={<StockDetailPage />} />
      </Route>
    </Routes>
  );
}
