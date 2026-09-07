import { useEffect, useState } from "react";
import { createStockSocket } from "../services/api";

export function useStockSocket(symbol, initialPrice = null) {
  const [livePrice, setLivePrice] = useState(initialPrice);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!symbol) return undefined;

    const socket = createStockSocket(symbol);

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setLivePrice(payload.price);
    };

    return () => socket.close();
  }, [symbol]);

  useEffect(() => {
    setLivePrice(initialPrice);
  }, [initialPrice]);

  return { livePrice, connected };
}
