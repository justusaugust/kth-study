import { useEffect, useState } from "react";
import { search } from "./api";
import {
  userFacingResults,
  type SearchHit,
  type UserSearchType,
} from "./searchModel";

type SearchStatus = "idle" | "loading" | "ready" | "error";

export function useLiveSearch(query: string, activeType: UserSearchType | null) {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");

  useEffect(() => {
    const trimmed = query.trim();
    let active = true;
    setStatus("loading");
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      if (activeType) params.set("type", activeType);
      search(params)
        .then((response) => {
          if (!active) return;
          setResults(userFacingResults(response.results, activeType));
          setStatus("ready");
        })
        .catch(() => {
          if (!active) return;
          setResults([]);
          setStatus("error");
        });
    }, 120);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, activeType]);

  return { results, status };
}
