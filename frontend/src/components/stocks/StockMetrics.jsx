import GlassCard from "../shared/GlassCard";
import { formatCompactNumber, formatCurrency, formatPercent } from "../../utils/formatters";

export default function StockMetrics({ quote, prediction, livePrice, connected }) {
  const cards = [
    {
      label: "Live Price",
      value: formatCurrency(livePrice ?? quote.current_price, quote.currency || "USD"),
      detail: connected ? "WebSocket streaming" : "Polling fallback ready"
    },
    {
      label: "Daily Change",
      value: formatPercent(quote.change_percent),
      detail: formatCurrency(quote.change, quote.currency || "USD")
    },
    {
      label: "Market Cap",
      value: formatCompactNumber(quote.market_cap),
      detail: quote.sector || "Sector unavailable"
    },
    {
      label: "AI Forecast",
      value: prediction ? formatCurrency(prediction.predicted_price, quote.currency || "USD") : "Loading...",
      detail: prediction?.model || "PyTorch Transformer"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <GlassCard key={card.label} className="p-5">
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
        </GlassCard>
      ))}
    </div>
  );
}
