import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { DeadlinesResponse } from "../../domain/api";
import { entityUrl } from "../../domain/ids";
import { getDeadlines } from "../api";
import { PageError } from "../components/PageError";
import { QuickSearch } from "../components/QuickSearch";
import { currentStudyDate } from "../format";

type WeekEntry = {
  id: string;
  date: string;
  title: string;
  courseCode: string;
  kind: string;
  time?: string;
  endTime?: string;
  location?: string;
  url: string;
};

type WeekDay = { date: string; entries: WeekEntry[] };

const parseDate = (value: string) => new Date(`${value}T12:00:00Z`);
const dateKey = (date: Date) => date.toISOString().slice(0, 10);

export function buildWeekView(data: DeadlinesResponse, today: string) {
  const current = parseDate(today);
  const monday = new Date(current);
  monday.setUTCDate(current.getUTCDate() - ((current.getUTCDay() + 6) % 7));
  const days: WeekDay[] = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    return { date: dateKey(date), entries: [] };
  });
  const courses = new Map(data.courses.map((course) => [course.id, course]));
  const add = (entry: WeekEntry) => {
    const day = days.find((candidate) => candidate.date === entry.date);
    if (day) day.entries.push(entry);
  };

  for (const session of data.sessions) {
    if (!session.date) continue;
    const course = courses.get(session.courseId)!;
    add({
      id: session.id,
      date: session.date,
      title: session.title,
      courseCode: course.code,
      kind: session.kind,
      time: session.time,
      endTime: session.endTime,
      location: session.location,
      url: session.lectureId
        ? `/courses/${course.code.toLowerCase()}/lectures/${session.lectureId.split(":").at(-1)}`
        : entityUrl(session),
    });
  }
  for (const item of data.coursework) {
    if (!item.date) continue;
    add({
      id: item.id,
      date: item.date,
      title: item.title,
      courseCode: courses.get(item.courseId)!.code,
      kind: item.kind,
      time: item.time,
      url: entityUrl(item),
    });
  }
  for (const assessment of data.assessments) {
    if (!assessment.date) continue;
    add({
      id: assessment.id,
      date: assessment.date,
      title: `${assessment.code} · ${assessment.title}`,
      courseCode: courses.get(assessment.courseId)!.code,
      kind: assessment.kind,
      time: assessment.time,
      url: entityUrl(assessment),
    });
  }
  for (const day of days) {
    day.entries.sort((left, right) =>
      `${left.time ?? "00:00"}:${left.courseCode}:${left.title}`.localeCompare(
        `${right.time ?? "00:00"}:${right.courseCode}:${right.title}`,
      ),
    );
  }
  return days;
}

function weekNumber(value: string) {
  const date = parseDate(value);
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4, 12));
  return 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / 604800000);
}

const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });
const dayNumber = new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: "UTC" });
const weekRange = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function HomePage() {
  const [data, setData] = useState<DeadlinesResponse>();
  const [error, setError] = useState(false);
  const today = currentStudyDate();
  const [activeDate, setActiveDate] = useState(today);

  useEffect(() => {
    let active = true;
    getDeadlines().then((result) => active && setData(result)).catch(() => active && setError(true));
    return () => { active = false; };
  }, []);

  const days = useMemo(() => data ? buildWeekView(data, today) : [], [data, today]);
  const weekEntries = days.flatMap((day) => day.entries);

  useEffect(() => {
    if (days.length && !days.some((day) => day.date === activeDate)) {
      setActiveDate(days[0].date);
    }
  }, [activeDate, days]);

  if (error) {
    return <PageError title="Unable to load this week." message="Refresh the page to try again." linkTo="/deadlines" linkLabel="Open deadlines" />;
  }
  if (!data) return <p className="loading">Opening this week…</p>;

  return (
    <section className="home-page page-column" aria-labelledby="home-title">
      <header className="home-intro">
        <p className="eyebrow">Week {weekNumber(today)} · {weekRange.format(parseDate(days[0].date))}–{weekRange.format(parseDate(days.at(-1)!.date))}</p>
        <h1 id="home-title">This week</h1>
        <p className="lead">Lectures, labs, exercises, and deadlines across the current courses.</p>
      </header>

      <div className="week-day-tabs" role="tablist" aria-label="Choose a weekday">
        {days.map((day) => (
          <button
            type="button"
            role="tab"
            aria-selected={day.date === activeDate}
            onClick={() => setActiveDate(day.date)}
            key={day.date}
          >
            <span>{dayName.format(parseDate(day.date))}</span>
            <strong>{dayNumber.format(parseDate(day.date))}</strong>
            {day.entries.length ? <i aria-label={`${day.entries.length} ${day.entries.length === 1 ? "item" : "items"}`} /> : null}
          </button>
        ))}
      </div>
      <div className="week-scroll" tabIndex={0} aria-label="Current week calendar">
        <div className="week-grid">
          {days.map((day) => {
            const next = weekEntries.find((entry) => entry.date > day.date);
            return <section className="week-day" data-active={day.date === activeDate || undefined} data-today={day.date === today || undefined} key={day.date}>
              <time dateTime={day.date}>
                <span>{dayName.format(parseDate(day.date))}</span>
                <strong>{dayNumber.format(parseDate(day.date))}</strong>
              </time>
              {day.entries.length ? (
                <ol>
                  {day.entries.map((entry) => (
                    <li data-kind={entry.kind} key={entry.id}>
                      <Link to={entry.url}>
                        <span>{[
                          entry.courseCode,
                          entry.time && `${entry.time}${entry.endTime ? `–${entry.endTime}` : ""}`,
                          entry.location,
                        ].filter(Boolean).join(" · ")}</span>
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="week-empty">
                  <strong>Nothing today</strong>
                  {next
                    ? <Link to={next.url}>Next: {next.title}</Link>
                    : <span>No more scheduled items this week.</span>}
                </div>
              )}
            </section>;
          })}
        </div>
      </div>

      <section className="home-search-section" aria-labelledby="home-search-title">
        <h2 id="home-search-title">Find course material</h2>
        <QuickSearch
          id="home-search"
          label="Search course material"
          placeholder="Try “quadratic”, “logic gate”, or a course code"
          variant="home"
        />
        <div className="home-links">
          <Link to="/deadlines">All deadlines</Link>
          <Link to="/visuals">Visual atlas</Link>
        </div>
      </section>
    </section>
  );
}
