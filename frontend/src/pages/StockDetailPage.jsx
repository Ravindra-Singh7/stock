import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import CandlestickChart from "../components/charts/CandlestickChart";
import GlassCard from "../components/shared/GlassCard";
import StockMetrics from "../components/stocks/StockMetrics";
import { useAsyncData } from "../hooks/useAsyncData";
import { useStockSocket } from "../hooks/useStockSocket";
import { api } from "../services/api";
import { formatCurrency } from "../utils/formatters";
import { fadeUp, staggerContainer } from "../utils/motion";

export default function StockDetailPage() {
  const { symbol } = useParams();
  const { data: stockData, loading, error } = useAsyncData(() => api.getStock(symbol), [symbol]);
  const { data: prediction } = useAsyncData(() => api.getPrediction(symbol), [symbol]);
  const { livePrice, connected } = useStockSocket(symbol, stockData?.quote?.current_price);

  if (loading) {
    return <p className="text-slate-400">Loading stock detail...</p>;
  }

  if (error || !stockData) {
    return <p className="text-rose-300">{error || "Unable to load stock details."}</p>;
  }

  const { quote, ohlc, indicators } = stockData;

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="show">
      <motion.section variants={fadeUp} className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{quote.symbol}</p>
            <h3 className="mt-3 text-4xl font-bold">{quote.company_name}</h3>
            <p className="mt-3 max-w-2xl text-slate-400">
              Live analysis workspace with chart-ready OHLC data, backend-computed technical indicators, and an AI-assisted directional estimate.
            </p>
          </div>
          <motion.div
            animate={{ boxShadow: connected ? "0 0 40px rgba(32,201,151,0.18)" : "0 0 0 rgba(0,0,0,0)" }}
            transition={{ duration: 0.5 }}
          >
          <GlassCard className="p-5 xl:min-w-80">
            <p className="text-sm text-slate-400">Streaming price</p>
            <motion.p
              key={livePrice ?? quote.current_price}
              initial={{ opacity: 0.55, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-4xl font-bold"
            >
              {formatCurrency(livePrice ?? quote.current_price, quote.currency || "USD")}
            </motion.p>
            <p className={`mt-2 text-sm ${connected ? "text-emerald-300" : "text-amber-300"}`}>
              {connected ? "Connected to live WebSocket feed" : "Waiting for live stream"}
            </p>
          </GlassCard>
          </motion.div>
        </div>
        <StockMetrics quote={quote} prediction={prediction} livePrice={livePrice} connected={connected} />
      </motion.section>

      <motion.section variants={fadeUp}>
        <GlassCard className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-semibold">Candlestick Chart</h4>
              <p className="text-sm text-slate-400">Daily OHLC candles with SMA 20 overlay.</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <CandlestickChart data={ohlc} sma={indicators.sma_20} />
          </motion.div>
        </GlassCard>
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <GlassCard className="p-6">
          <h4 className="text-xl font-semibold">Indicator Snapshot</h4>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
              <p className="text-sm text-slate-400">Latest SMA 20</p>
              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(indicators.sma_20[indicators.sma_20.length - 1]?.value, quote.currency || "USD")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
              <p className="text-sm text-slate-400">Latest RSI 14</p>
              <p className="mt-2 text-2xl font-bold">
                {indicators.rsi_14[indicators.rsi_14.length - 1]?.value?.toFixed(2) || "N/A"}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-xl font-semibold">Prediction Engine</h4>
          <motion.div
            className="mt-4 rounded-2xl border border-brand-400/20 bg-brand-400/10 p-4"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-sm text-brand-200">Next close estimate</p>
            <p className="mt-2 text-3xl font-bold">
              {prediction ? formatCurrency(prediction.predicted_price, quote.currency || "USD") : "Loading..."}
            </p>
          </motion.div>
        </GlassCard>
      </motion.section>
    </motion.div>
  );
}
