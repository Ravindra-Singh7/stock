import { motion } from "framer-motion";
import GlassCard from "../components/shared/GlassCard";
import StockCard from "../components/stocks/StockCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { fadeUp, staggerContainer } from "../utils/motion";

export default function DashboardPage() {
  const { data: stocks, loading, error } = useAsyncData(() => api.getFeaturedStocks(), []);

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="show">
      <motion.section
        variants={fadeUp}
        className="glass-panel ticker-sheen relative overflow-hidden rounded-[2rem] p-8"
      >
        <motion.div
          className="absolute right-8 top-6 hidden h-40 w-40 rounded-full border border-white/10 bg-white/5 lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-8 right-20 hidden h-16 w-16 rounded-full bg-brand-400/20 blur-2xl lg:block"
          animate={{ x: [0, 18, -12, 0], y: [0, -12, 16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Market intelligence</p>
          <h3 className="mt-4 text-4xl font-bold leading-tight">
            A cinematic market workspace for screening, charting, and portfolio clarity.
          </h3>
          <p className="mt-4 text-lg text-slate-300">
            Follow NSE and US leaders, inspect transformer forecasts, and move through a faster, more tactile stock dashboard.
          </p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300"
            variants={staggerContainer}
          >
            {["NSE + US Focus", "Live Price Stream", "Glass UI", "Transformer Signals"].map((pill) => (
              <motion.span
                key={pill}
                variants={fadeUp}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
              >
                {pill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-4 md:grid-cols-3">
        {[
          ["Live Streaming", "WebSocket-powered quote updates on the stock detail page."],
          ["Technical Indicators", "SMA and RSI are computed on the backend and ready for chart overlays."],
          ["AI Forecasts", "Prediction insights are available directly on each stock detail page."]
        ].map(([title, body]) => (
          <GlassCard key={title} className="p-5">
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="mt-2 text-sm text-slate-400">{body}</p>
          </GlassCard>
        ))}
      </motion.section>

      <motion.section variants={fadeUp}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Featured Stocks</h3>
            <p className="text-sm text-slate-400">A richer card grid with motion tuned for a premium market terminal feel.</p>
          </div>
        </div>
        {loading && <p className="text-slate-400">Loading featured market data...</p>}
        {error && <p className="text-rose-300">{error}</p>}
        <motion.div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" variants={staggerContainer}>
          {stocks?.map((stock) => (
            <motion.div key={stock.symbol} variants={fadeUp}>
              <StockCard stock={stock} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
