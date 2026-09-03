import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchPageUrl, searchTypeLabel, visualAtlasUrl, type UserSearchType } from "../searchModel";
import { useLiveSearch } from "../useLiveSearch";
import { SearchFilters } from "./SearchFilters";
import { MathText } from "./MathText";
import { StudyIcon } from "./StudyMark";

interface QuickSearchProps {
  id: string;
  label: string;
  placeholder: string;
  variant: "header" | "home";
  autoFocus?: boolean;
  onDismiss?: () => void;
}

export function QuickSearch({ id, label, placeholder, variant, autoFocus, onDismiss }: QuickSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const listId = `${useId().replaceAll(":", "")}-results`;
  const locationParams = new URLSearchParams(location.search);
  const initialQuery = location.pathname === "/search" ? locationParams.get("q") ?? "" : "";
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<UserSearchType | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);
  const { results, status } = useLiveSearch(query, activeType);
  const suggestions = results.slice(0, 5);

  function dismiss() {
    setOpen(false);
    onDismiss?.();
  }

  useEffect(() => {
    if (location.pathname !== "/search") return;
    setQuery(new URLSearchParams(location.search).get("q") ?? "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    activeIndexRef.current = -1;
    setActiveIndex(-1);
  }, [query, activeType]);

  useEffect(() => {
    if (open) return;
    activeIndexRef.current = -1;
    setActiveIndex(-1);
  }, [open]);

  function highlight(index: number) {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const highlighted = suggestions[activeIndexRef.current];
    if (highlighted) {
      navigate(highlighted.url);
    } else {
      navigate(searchPageUrl(query, activeType));
    }
    dismiss();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      highlight(Math.min(activeIndexRef.current + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      highlight(
        activeIndexRef.current < 0
          ? suggestions.length - 1
          : Math.max(activeIndexRef.current - 1, 0),
      );
    } else if (event.key === "Enter" && suggestions[activeIndexRef.current]) {
      event.preventDefault();
      navigate(suggestions[activeIndexRef.current].url);
      dismiss();
    } else if (event.key === "Escape") {
      highlight(-1);
      dismiss();
    }
  }

  return (
    <div
      className={`quick-search quick-search--${variant} ${variant === "header" ? "header-search" : "home-search"}`}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <form className="search-field" onSubmit={submit} role="search">
        <label className={variant === "home" ? "search-label" : "sr-only"} htmlFor={id}>
          {label}
        </label>
        <div className="search-input-shell">
          <StudyIcon kind="search" className="search-field-icon" />
          <input
            className="global-search"
            id={id}
            type="search"
            autoFocus={autoFocus}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-controls={open ? listId : undefined}
            aria-expanded={open}
            aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          />
        </div>
      </form>

      {open ? (
        <div className="search-popover">
          <SearchFilters
            activeType={activeType}
            onSelect={(type) => {
              if (type === "explainer") {
                navigate(visualAtlasUrl(query));
                dismiss();
                return;
              }
              setActiveType(type);
              setOpen(true);
            }}
          />

          <>
              {!query.trim() && status !== "error" ? (
                <p className="search-popover-kicker">Recently added</p>
              ) : null}
              {status === "loading" ? <p className="search-popover-state">Searching…</p> : null}
              {status === "error" ? <p className="search-popover-state" role="alert">Unable to search right now. Try again in a moment.</p> : null}
              {status === "ready" && suggestions.length === 0 ? (
                <p className="search-popover-state">No matches. Try another term or filter.</p>
              ) : null}
              {suggestions.length ? (
                <ol className="search-suggestions" id={listId} role="listbox">
                  {suggestions.map((hit, index) => (
                    <li
                      key={hit.id}
                      role="none"
                      onMouseEnter={() => highlight(index)}
                    >
                      <Link
                        id={`${listId}-${index}`}
                        className="search-suggestion-target"
                        to={hit.url}
                        role="option"
                        aria-selected={activeIndex === index}
                        onClick={dismiss}
                      >
                        <strong>{hit.title}</strong>
                        <MathText className="suggestion-summary">{hit.summary}</MathText>
                        <span className="suggestion-kind">{searchTypeLabel(hit.entityType)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : null}
              {query.trim() ? (
                <Link className="search-view-all" to={searchPageUrl(query, activeType)} onClick={dismiss}>
                  View all results
                </Link>
              ) : null}
            </>
        </div>
      ) : null}
    </div>
  );
}
