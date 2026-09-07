import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function CandlestickChart({ data, sma }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data?.length) return undefined;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: { background: { color: "transparent" }, textColor: "#94a3b8" },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.06)" },
        horzLines: { color: "rgba(255,255,255,0.06)" }
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: { borderColor: "rgba(255,255,255,0.08)" }
    });

    const series = chart.addCandlestickSeries({
      upColor: "#20c997",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#20c997",
      wickDownColor: "#f43f5e"
    });

    series.setData(
      data.map((point) => ({
        time: point.time,
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close
      })),
    );

    if (sma?.length) {
      const smaSeries = chart.addLineSeries({
        color: "#7dd3fc",
        lineWidth: 2
      });
      smaSeries.setData(sma);
    }

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [data, sma]);

  return <div ref={containerRef} className="h-[420px] w-full" />;
}
