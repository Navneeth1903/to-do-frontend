import { QueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "./api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url, params] = queryKey;
        let fullUrl = buildApiUrl(url as string);
        if (params && typeof params === 'object') {
          const search = new URLSearchParams(params as any).toString();
          fullUrl += `?${search}`;
        }
        const userId = localStorage.getItem('userId');
        const res = await fetch(fullUrl, {
          headers: userId ? { 'x-user-id': userId } : {},
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status}: ${text}`);
        }
        return res.json();
      },
    },
  },
});
