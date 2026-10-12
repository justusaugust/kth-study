import { useEffect, useState } from "react";
import { AtlasSelect } from "../AtlasSelect";

export interface ReadingSection { id: string; label: string }

// Open the target (if it is a disclosure) and every disclosure around it, so a
// jump never lands on hidden content.
function reveal(target: HTMLElement) {
  for (let node: HTMLElement | null = target; node; node = node.parentElement?.closest("details") ?? null) {
    if (node instanceof HTMLDetailsElement) node.open = true;
  }
}

function hashTarget() {
  let id = window.location.hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* keep the raw fragment */ }
  return id ? document.getElementById(id) : null;
}

/** `kind` names the page in the contents labels: "In this guide", "Guide contents". */
export function ReadingPosition({ sections, kind = "lesson" }: { sections: ReadingSection[]; kind?: "lesson" | "guide" | "review" }) {
  const label = `In this ${kind}`;
  const [position, setPosition] = useState({ active: "", progress: 0 });
  const sectionKey = sections.map(({ id }) => id).join(" ");
  useEffect(() => {
    const targets = sectionKey.split(" ").flatMap((id) => {
      const target = document.getElementById(id);
      return target ? [target] : [];
    });
    if (!targets.length) return;
    // The browser looks for the URL hash before async content exists; honour
    // it once the sections have rendered. Later native anchor jumps arrive as
    // hashchange, which may point inside a closed disclosure.
    const jumpToHash = () => {
      const target = hashTarget();
      if (!target) return;
      reveal(target);
      target.scrollIntoView({ block: "start" });
    };
    jumpToHash();
    window.addEventListener("hashchange", jumpToHash);
    const update = () => {
      const offset = Math.max(
        (document.querySelector(".study-header")?.getBoundingClientRect().bottom ?? 0) + 24,
        parseFloat(getComputedStyle(targets[0]).scrollMarginTop) || 0,
      ) + 1;
      const first = targets[0].getBoundingClientRect();
      const last = targets[targets.length - 1].getBoundingClientRect();
      const end = Math.max(offset, window.innerHeight - 24);
      const distance = last.bottom - end - (first.top - offset);
      const progress = Math.round(Math.max(0, Math.min(1, (offset - first.top) / Math.max(1, distance))) * 100);
      const active = last.bottom <= end ? targets[targets.length - 1].id
        : targets.filter((target) => target.getBoundingClientRect().top <= offset).at(-1)?.id ?? "";
      setPosition((previous) => previous.active === active && previous.progress === progress ? previous : { active, progress });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    targets.forEach((target) => observer?.observe(target));
    return () => {
      window.removeEventListener("hashchange", jumpToHash);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [sectionKey]);
  return <nav className="lesson-outline" aria-label={`${kind[0].toUpperCase()}${kind.slice(1)} contents`}>
    <div className="lesson-outline__picker">
      <AtlasSelect label={label} value={position.active} options={[
        { value: "", label: "Jump to a section" },
        ...sections.map(({ id, label }) => ({ value: id, label })),
      ]} onChange={(value) => {
        const target = document.getElementById(value);
        if (!target) return;
        reveal(target);
        target.scrollIntoView({ block: "start" });
        const heading = target.querySelector<HTMLElement>('h2, h3, [role="heading"]') ?? target;
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        history.replaceState(history.state, "", `#${target.id}`);
      }} />
    </div>
    <div className="lesson-outline__links">
      <p>{label}</p>
      <ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} onClick={() => { const target = document.getElementById(section.id); if (target) reveal(target); }} aria-current={position.active === section.id ? "location" : undefined}>{section.label}</a></li>)}</ol>
    </div>
    <progress className="lesson-outline__progress" aria-label="Reading position" max={100} value={position.progress} />
  </nav>;
}
