import { useState } from "react";
import GlassCard from "../components/shared/GlassCard";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { formatCurrency } from "../utils/formatters";

export default function PortfolioPage() {
  const { data: holdings, loading, error, refetch } = useAsyncData(() => api.getPortfolio(), []);
  const [form, setForm] = useState({ symbol: "", quantity: "", buy_price: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const totalValue = holdings?.reduce((sum, holding) => sum + (holding.market_value ?? holding.quantity * holding.buy_price), 0) || 0;
  const recommendationCount = holdings?.filter((holding) => holding.recommendation && holding.recommendation !== "Data unavailable").length || 0;

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      await api.addPortfolioHolding({
        symbol: form.symbol.toUpperCase(),
        quantity: Number(form.quantity),
        buy_price: Number(form.buy_price)
      });
      setForm({ symbol: "", quantity: "", buy_price: "" });
      setMessage("Holding added.");
      await refetch();
    } catch (submitError) {
      setMessage(submitError.message || "Unable to add holding.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-5">
            <p className="text-sm text-slate-400">Total Holdings</p>
            <p className="mt-3 text-3xl font-bold">{holdings?.length || 0}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-slate-400">Portfolio Value</p>
            <p className="mt-3 text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-slate-400">Recommendations</p>
            <p className="mt-3 text-3xl font-bold text-brand-300">{recommendationCount}</p>
          </GlassCard>
        </div>
        <GlassCard className="p-5">
          <h3 className="text-xl font-semibold">Add Holding</h3>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={form.symbol}
              onChange={(event) => setForm((current) => ({ ...current, symbol: event.target.value }))}
              placeholder="Symbol"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-500"
            />
            <input
              value={form.quantity}
              onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
              placeholder="Quantity"
              type="number"
              step="0.01"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-500"
            />
            <input
              value={form.buy_price}
              onChange={(event) => setForm((current) => ({ ...current, buy_price: event.target.value }))}
              placeholder="Buy price"
              type="number"
              step="0.01"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-brand-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-brand-400 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add to Portfolio"}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
        </GlassCard>
      </div>

      {loading && <p className="text-slate-400">Loading portfolio...</p>}
      {error && <p className="text-rose-300">{error}</p>}
      {holdings && <HoldingsTable holdings={holdings} />}
    </div>
  );
}
