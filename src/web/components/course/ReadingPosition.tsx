import { useEffect, useRef, useState } from "react";

export interface ReadingSection {
  id: string;
  label: string;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/*
 * Reading-position instrument. Collapsed it is a bare line of type naming the
 * active section. Open, it becomes a full typographic contents layer on the
 * page canvas — not a floating card — with the current teaching week as one
 * destination.
 */
export function ReadingPosition({
  sections,
  currentWeek,
}: {
  sections: ReadingSection[];
  currentWeek?: number;
}) {
  const [activeId, setActiveId] = useState<string | undefined>(sections[0]?.id);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!targets.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size) {
          const [topmost] = [...visible.entries()].sort((a, b) => a[1] - b[1]);
          setActiveId(topmost[0]);
        }
      },
      { rootMargin: "-10% 0px -55% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!open) {
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false;
        toggleRef.current?.focus();
      }
      return;
    }
    function close() {
      restoreFocusRef.current = true;
      setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    rootRef.current
      ?.querySelector<HTMLElement>(".reading-position__panel")
      ?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!sections.length) return null;

  const activeLabel =
    sections.find((section) => section.id === activeId)?.label ??
    sections[0].label;

  function jumpTo(id: string, focusHeading = false) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    setOpen(false);
    if (focusHeading) {
      const heading = target.querySelector("h3") as HTMLElement | null;
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    }
  }

  return (
    <nav
      className="reading-position"
      aria-label="Reading position"
      ref={rootRef}
      data-open={open || undefined}
    >
      {open ? (
        <div
          className="reading-position__panel"
          data-open="true"
          tabIndex={-1}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              restoreFocusRef.current = true;
              setOpen(false);
            }
          }}
        >
          <header className="reading-position__panel-head">
            <p className="reading-position__kicker">Jump to</p>
            <button type="button" className="reading-position__close" onClick={() => setOpen(false)}>Close</button>
          </header>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  aria-current={section.id === activeId ? "true" : undefined}
                  onClick={() => jumpTo(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
            {currentWeek ? (
              <li className="reading-position__week">
                <button
                  type="button"
                  onClick={() => jumpTo(`ledger-week-${currentWeek}`, true)}
                >
                  This week · {currentWeek}
                </button>
              </li>
            ) : null}
          </ol>
        </div>
      ) : null}
      <button
        type="button"
        className="reading-position__toggle"
        ref={toggleRef}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="reading-position__label">Jump to · {activeLabel}</span>
      </button>
    </nav>
  );
}
