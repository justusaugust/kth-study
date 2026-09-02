import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { SearchFilters } from "../components/SearchFilters";
import { MathText } from "../components/MathText";
import { StudyIcon } from "../components/StudyMark";
import { isUserSearchType, searchTypeLabel, visualAtlasUrl, type UserSearchType } from "../searchModel";
import { useLiveSearch } from "../useLiveSearch";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(params.get("q") ?? "");
  const [visibleCount, setVisibleCount] = useState(10);
  const rawType = params.get("type");
  const activeType = isUserSearchType(rawType) ? rawType : null;
  const { results, status } = useLiveSearch(draft, activeType);

  useEffect(() => {
    if (rawType === null || isUserSearchType(rawType)) return;
    const next = new URLSearchParams(params);
    next.delete("type");
    setParams(next, { replace: true });
  }, [params, rawType, setParams]);

  useEffect(() => {
    setDraft(params.get("q") ?? "");
  }, [params]);

  useEffect(() => setVisibleCount(10), [draft, activeType]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params);
      if (draft.trim()) next.set("q", draft.trim());
      else next.delete("q");
      if (next.toString() !== params.toString()) setParams(next, { replace: true });
    }, 160);
    return () => window.clearTimeout(timer);
  }, [draft, params, setParams]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams(params);
    if (draft.trim()) next.set("q", draft.trim());
    else next.delete("q");
    setParams(next);
  }

  function selectType(type: UserSearchType | null) {
    if (type === "explainer") {
      navigate(visualAtlasUrl(draft));
      return;
    }
    const next = new URLSearchParams(params);
    if (type) next.set("type", type);
    else next.delete("type");
    setParams(next);
  }

  if (activeType === "explainer") {
    return <Navigate replace to={visualAtlasUrl(draft)} />;
  }

  return (
    <section className="search-page page-column">
      <p className="search-eyebrow">Courses, lectures, concepts, and examples</p>
      <h1>Search</h1>
      <form className="search-form search-field" onSubmit={submit}>
        <label className="sr-only" htmlFor="page-search">Search query</label>
        <div className="search-input-shell">
          <StudyIcon kind="search" className="search-field-icon" />
          <input
            id="page-search"
            className="global-search"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search a concept, definition, example…"
          />
        </div>
      </form>
      <SearchFilters activeType={activeType} onSelect={selectType} className="filter-row" />
      {status === "error" ? <p role="alert">Unable to search right now. Try again in a moment.</p> : null}
      {!draft.trim() && status !== "error" ? (
        <p className="search-context">Recently added</p>
      ) : null}
      {status === "loading" ? <p className="search-status">Searching…</p> : null}
      {status === "ready" && results.length ? <p className="search-count">{results.length} results</p> : null}
      {status === "ready" && results.length === 0 ? <p className="empty-state">No matches. Try another term or filter.</p> : null}
      <ol className="search-results">
        {results.slice(0, visibleCount).map((hit) => (
          <li key={hit.id}>
            <Link to={hit.url}>{hit.title}</Link>
            <MathText as="p">{hit.summary}</MathText>
            {activeType === null ? (
              <span className="result-type-label" data-type={hit.entityType}>
                {searchTypeLabel(hit.entityType)}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {visibleCount < results.length ? (
        <button className="show-more" type="button" onClick={() => setVisibleCount((count) => count + 10)}>Show 10 more</button>
      ) : null}
    </section>
  );
}
