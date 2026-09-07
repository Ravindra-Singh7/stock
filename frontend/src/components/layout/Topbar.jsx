import { Search, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handle = setTimeout(async () => {
      try {
        const items = await api.searchStocks(query);
        setResults(items);
      } catch {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="relative flex flex-col gap-4 rounded-[2rem] pb-6 pt-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Global investing, elevated</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Welcome to <span className="gradient-text">StockIt</span>
        </h2>
      </div>
      <div className="relative w-full max-w-xl">
        <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by symbol or company"
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            <Wifi className="h-3 w-3" />
            Live
          </div>
        </div>
        {results.length > 0 && (
          <div className="glass-panel absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-2xl">
            {results.map((result) => (
              <button
                key={result.symbol}
                type="button"
                onClick={() => {
                  navigate(`/stock/${result.symbol}`);
                  setQuery("");
                  setResults([]);
                }}
                className="flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left transition last:border-0 hover:bg-white/5"
              >
                <span>
                  <span className="block font-medium">{result.symbol}</span>
                  <span className="text-sm text-slate-400">{result.name}</span>
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Open</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
