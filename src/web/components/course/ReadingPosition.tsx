import { useEffect, useState } from "react";
import { AtlasSelect } from "../AtlasSelect";

export interface ReadingSection { id: string; label: string }

export function ReadingPosition({ sections }: { sections: ReadingSection[] }) {
  const [position, setPosition] = useState({ active: "", progress: 0 });
  useEffect(() => {
    const targets = sections.flatMap(({ id }) => {
      const target = document.getElementById(id);
      return target ? [target] : [];
    });
    if (!targets.length) return;
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
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [sections]);
  return <nav className="lesson-outline" aria-label="Lesson contents">
    <div className="lesson-outline__picker">
      <AtlasSelect label="In this lesson" value={position.active} options={[
        { value: "", label: "Jump to a section" },
        ...sections.map(({ id, label }) => ({ value: id, label })),
      ]} onChange={(value) => {
        const target = document.getElementById(value);
        if (!target) return;
        target.scrollIntoView({ block: "start" });
        const heading = target.querySelector<HTMLElement>('h2, h3, [role="heading"]') ?? target;
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        history.replaceState(history.state, "", `#${target.id}`);
      }} />
    </div>
    <div className="lesson-outline__links">
      <p>In this lesson</p>
      <ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} aria-current={position.active === section.id ? "location" : undefined}>{section.label}</a></li>)}</ol>
    </div>
    <progress className="lesson-outline__progress" aria-label="Lesson scroll progress" max={100} value={position.progress} />
  </nav>;
}
