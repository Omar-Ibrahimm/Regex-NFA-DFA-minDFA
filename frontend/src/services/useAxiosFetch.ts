import { useState, useEffect } from "react";
import axios, { CancelTokenSource } from "axios";

const useAxiosFetch = <T = any>(url: string, payload: any) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!url || !payload) return;

    const source: CancelTokenSource = axios.CancelToken.source();
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post<T>(url, payload, {
          cancelToken: source.token,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e);
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      source.cancel("Component unmounted");
    };
  }, [url, JSON.stringify(payload)]); // re-run if url or payload changes

  return { data, error, loading };
};

export default useAxiosFetch;
