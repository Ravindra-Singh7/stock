import { useCallback, useEffect, useState } from "react";

export function useAsyncData(loader, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const next = await loader();
      setData(next);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, loading, refetch: run };
}
