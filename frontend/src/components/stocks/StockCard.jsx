import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCompactNumber, formatCurrency, formatPercent } from "../../utils/formatters";

export default function StockCard({ stock }) {
  const navigate = useNavigate();
  const positive = stock.change >= 0;

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      className="glass-panel w-full rounded-3xl p-5 text-left transition hover:border-brand-400/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stock.symbol}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{stock.company_name}</h3>
        </div>
        <div className="rounded-2xl border border-white/10 p-2 text-slate-300">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold">{formatCurrency(stock.current_price, stock.currency || "USD")}</p>
          <p className={`mt-2 text-sm ${positive ? "text-emerald-300" : "text-rose-300"}`}>
            {formatPercent(stock.change_percent)}
          </p>
        </div>
        <div className="text-right text-sm text-slate-400">
          <p>{stock.exchange || "NASDAQ"}</p>
          <p>{formatCompactNumber(stock.market_cap)}</p>
        </div>
      </div>
    </motion.button>
  );
}
