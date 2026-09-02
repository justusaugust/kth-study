import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { DeadlinesResponse } from "../../domain/api";
import { entityUrl } from "../../domain/ids";
import { getDeadlines } from "../api";
import { formatStudyDateLong } from "../format";
import { PageError } from "../components/PageError";

type DeadlineItem = {
  id: string;
  entityType: "assessment" | "coursework";
  title: string;
  description: string;
  date?: string;
  time?: string;
  courseCode: string;
  courseTitle: string;
  requirement: string;
  lastChecked: string;
  confidence: string;
  url: string;
  links: Array<{ title: string; url: string }>;
};

const requirementLabels: Record<string, string> = {
  required: "Required",
  recommended: "Recommended",
  scheduled: "Scheduled",
  optional: "Optional",
};

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildDeadlineItems(data: DeadlinesResponse) {
  const courses = new Map(data.courses.map((course) => [course.id, course]));
  const sources = new Map(data.sources.map((source) => [source.id, source]));
  const sourceLinks = (sourceIds: string[]) => sourceIds.flatMap((id) => {
    const source = sources.get(id);
    return source?.url ? [{ title: source.title, url: source.url }] : [];
  });
  const assessments: DeadlineItem[] = data.assessments.map((assessment) => {
    const course = courses.get(assessment.courseId)!;
    return {
      id: assessment.id,
      entityType: "assessment",
      title: `${assessment.code} · ${assessment.title}`,
      description: assessment.description,
      date: assessment.date,
      time: assessment.time,
      courseCode: course.code,
      courseTitle: course.title,
      requirement: assessment.compulsory ? "Compulsory assessment" : "Assessment",
      lastChecked: assessment.lastChecked,
      confidence: assessment.confidence,
      url: entityUrl(assessment),
      links: sourceLinks(assessment.sourceIds),
    };
  });
  const coursework: DeadlineItem[] = data.coursework.map((item) => {
    const course = courses.get(item.courseId)!;
    return {
      id: item.id,
      entityType: "coursework",
      title: item.title,
      description: item.description,
      date: item.date,
      time: item.time,
      courseCode: course.code,
      courseTitle: course.title,
      requirement: requirementLabels[item.requirement] ?? item.requirement,
      lastChecked: item.lastChecked,
      confidence: item.confidence,
      url: entityUrl(item),
      links: [...new Map([
        ...item.materials.flatMap((material) =>
          material.url ? [[material.url, { title: material.title, url: material.url }] as const] : [],
        ),
        ...sourceLinks(item.sourceIds).map((link) => [link.url, link] as const),
      ]).values()],
    };
  });
  return [...assessments, ...coursework];
}

export function buildDeadlineSchedule(data: DeadlinesResponse, today: string) {
  const items = buildDeadlineItems(data);
  const upcoming = items
    .filter((item) => item.date && item.date >= today)
    .sort((left, right) =>
      `${left.date}T${left.time ?? "23:59"}`.localeCompare(
        `${right.date}T${right.time ?? "23:59"}`,
      ),
    );
  const grouped = new Map<string, DeadlineItem[]>();
  for (const item of upcoming) {
    const group = grouped.get(item.date!) ?? [];
    group.push(item);
    grouped.set(item.date!, group);
  }
  return {
    groups: [...grouped.entries()],
    undated: items
      .filter((item) =>
        !item.date &&
        (item.requirement === "Required" || item.requirement === "Compulsory assessment"),
      )
      .sort((left, right) =>
        `${left.courseCode}:${left.title}`.localeCompare(`${right.courseCode}:${right.title}`),
      ),
  };
}

export function DeadlinesPage() {
  const [data, setData] = useState<DeadlinesResponse>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getDeadlines()
      .then((result) => active && setData(result))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, []);

  const { groups, undated } = useMemo(() => {
    return data
      ? buildDeadlineSchedule(data, localDateKey())
      : { groups: [], undated: [] };
  }, [data]);

  if (error) {
    return <PageError title="Unable to load deadlines." message="Refresh the page to try again." linkTo="/" linkLabel="Go to Study Hub" />;
  }
  if (!data) return <p className="loading">Loading deadlines…</p>;

  return (
    <section className="deadlines-page page-column" aria-labelledby="deadlines-title">
      <header className="deadlines-intro">
        <p className="eyebrow">All courses</p>
        <h1 id="deadlines-title">Upcoming deadlines</h1>
        <p className="lead">
          Dated coursework and assessments in one chronological list. Required work without a confirmed date appears separately.
        </p>
      </header>

      {groups.length ? (
        <ol className="deadline-list">
          {groups.map(([date, items], index) => (
            <li className="deadline-group" data-next={index === 0} key={date}>
              <div className="deadline-date">
                <span>{index === 0 ? "Next" : "Due"}</span>
                <strong><time dateTime={date}>{formatStudyDateLong(date)}</time></strong>
              </div>
              <div className="deadline-group__items">
                {items.map((item) => <DeadlineEntry item={item} key={item.id} />)}
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="empty-state">No upcoming dated work is currently recorded.</p>}

      {undated.length ? (
        <section className="deadline-undated" aria-labelledby="undated-title">
          <p className="eyebrow">Keep watching</p>
          <h2 id="undated-title">Required work without a confirmed date</h2>
          <p>These items are part of the course, but the Study Hub does not yet have a reliable deadline for them.</p>
          <div className="deadline-undated-list">
            {undated.map((item) => <DeadlineEntry item={item} key={item.id} compact />)}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function DeadlineEntry({ item, compact = false }: { item: DeadlineItem; compact?: boolean }) {
  const Heading = compact ? "h3" : "h2";
  return (
    <article className="deadline-item">
      <div className="deadline-item__meta">
        <span>{item.courseCode} · {item.courseTitle}</span>
        <span className="deadline-item__kind">{item.requirement}</span>
        {item.time ? <time dateTime={`${item.date}T${item.time}`}>{item.time}</time> : null}
      </div>
      <Heading><Link to={item.url}>{item.title}</Link></Heading>
      <p>{item.description}</p>
      <p className="deadline-item__provenance">
        {item.confidence === "verified" ? "Verified" : "Supported"} · Checked {formatStudyDateLong(item.lastChecked)}
      </p>
      {item.links.length ? (
        <div className="deadline-item__links">
          {item.links.map((link) => (
            <a href={link.url} key={link.url} rel="noreferrer" target="_blank">{link.title}</a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
