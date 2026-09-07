import { Star } from "lucide-react";
import { useState } from "react";
import GlassCard from "../components/shared/GlassCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export default function WatchlistPage() {
  const { data: watchlist, loading, error, refetch } = useAsyncData(() => api.getWatchlist(), []);
  const [symbol, setSymbol] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      await api.addWatchlistItem({ symbol: symbol.toUpperCase() });
      setSymbol("");
      setMessage("Watchlist updated.");
      await refetch();
    } catch (submitError) {
      setMessage(submitError.message || "Unable to update watchlist.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-300/10 p-3 text-amber-300">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Watchlist</h3>
            <p className="text-sm text-slate-400">Pinned names for faster monitoring and deeper chart review.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            placeholder="Add symbol to watchlist"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Symbol"}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
      </GlassCard>

      {loading && <p className="text-slate-400">Loading watchlist...</p>}
      {error && <p className="text-rose-300">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {watchlist?.map((item) => (
          <GlassCard key={item.id} className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Watch item</p>
            <h4 className="mt-3 text-2xl font-bold">{item.symbol}</h4>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
