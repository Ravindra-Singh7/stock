import GlassCard from "../shared/GlassCard";
import { formatCurrency, formatPercent } from "../../utils/formatters";

const recommendationStyles = {
  Hold: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Watch: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  Review: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  "Take profit": "border-brand-400/20 bg-brand-400/10 text-brand-300",
  "Data unavailable": "border-slate-400/20 bg-slate-400/10 text-slate-300"
};

export default function HoldingsTable({ holdings }) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/5 px-6 py-5">
        <h3 className="text-xl font-semibold">Current Holdings</h3>
        <p className="mt-2 text-sm text-slate-400">Live portfolio values with recommendation signals for each position.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Symbol</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium">Buy Price</th>
              <th className="px-6 py-4 font-medium">Current Price</th>
              <th className="px-6 py-4 font-medium">Market Value</th>
              <th className="px-6 py-4 font-medium">Unrealized</th>
              <th className="px-6 py-4 font-medium">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const currency = holding.symbol?.includes(".NS") ? "INR" : "USD";
              const unrealizedPositive = (holding.unrealized_gain ?? 0) >= 0;
              return (
                <tr key={holding.id} className="border-t border-white/5 text-slate-200">
                  <td className="px-6 py-4 font-semibold">{holding.symbol}</td>
                  <td className="px-6 py-4">{holding.quantity}</td>
                  <td className="px-6 py-4">{formatCurrency(holding.buy_price, currency)}</td>
                  <td className="px-6 py-4">{holding.current_price ? formatCurrency(holding.current_price, currency) : "N/A"}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(holding.market_value ?? holding.quantity * holding.buy_price, currency)}
                  </td>
                  <td className={`px-6 py-4 ${unrealizedPositive ? "text-emerald-300" : "text-rose-300"}`}>
                    <span className="block">{holding.unrealized_gain != null ? formatCurrency(holding.unrealized_gain, currency) : "N/A"}</span>
                    <span className="text-xs text-slate-500">
                      {holding.unrealized_gain_percent != null ? formatPercent(holding.unrealized_gain_percent) : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                        recommendationStyles[holding.recommendation] || recommendationStyles.Watch
                      }`}
                    >
                      {holding.recommendation || "Watch"}
                    </span>
                    <p className="mt-2 max-w-xs text-xs text-slate-500">{holding.recommendation_reason}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
