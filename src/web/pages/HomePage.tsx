import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { DeadlinesResponse } from "../../domain/api";
import { entityUrl } from "../../domain/ids";
import { getDeadlines } from "../api";
import { PageError } from "../components/PageError";
import { QuickSearch } from "../components/QuickSearch";
import { currentStudyDate } from "../format";
import "../styles/home.css";

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
    const sameEvent = data.coursework.find((item) =>
      item.date === session.date && item.kind === "mini-exam" &&
      (session.courseworkIds.includes(item.id) || item.sessionIds.includes(session.id)),
    );
    add({
      id: session.id,
      date: session.date,
      title: session.title,
      courseCode: course.code,
      kind: session.kind,
      time: session.time,
      endTime: session.endTime,
      location: session.location,
      url: entityUrl(sameEvent ?? session),
    });
  }
  for (const item of data.coursework) {
    if (!item.date) continue;
    if (item.kind === "mini-exam" && data.sessions.some((session) =>
      session.date === item.date &&
      (session.courseworkIds.includes(item.id) || item.sessionIds.includes(session.id)),
    )) continue;
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

export type UpcomingExam = {
  id: string;
  date: string;
  time?: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  guideUrl: string;
  practiceUrl: string;
};

// Courses with an authored exam-revision-guide; others are skipped rather than linked to a missing page.
const EXAM_GUIDE_COURSES = new Set(["sf1690", "ie1204"]);

export function buildUpcomingExams(data: DeadlinesResponse, today: string): UpcomingExam[] {
  const courses = new Map(data.courses.map((course) => [course.id, course]));
  return data.assessments.flatMap((assessment) => {
    const course = courses.get(assessment.courseId);
    const code = course?.code.toLowerCase();
    if (!course || !code || !EXAM_GUIDE_COURSES.has(code)) return [];
    if (assessment.kind !== "written-exam" || !assessment.date || assessment.date < today) return [];
    return [{
      id: assessment.id,
      date: assessment.date,
      time: assessment.time,
      title: assessment.title,
      courseCode: course.code,
      courseTitle: course.title,
      guideUrl: `/courses/${code}/exam`,
      practiceUrl: `/practice?course=${code}`,
    }];
  }).sort((left, right) =>
    `${left.date}:${left.time ?? ""}:${left.courseCode}`.localeCompare(`${right.date}:${right.time ?? ""}:${right.courseCode}`),
  );
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
const examDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

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
  const exams = useMemo(() => data ? buildUpcomingExams(data, today) : [], [data, today]);

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
        <h1 id="home-title">{exams.length ? "Exam preparation" : "This week"}</h1>
        <p className="lead">{exams.length
          ? "Revisit the lectures, practise the methods, and prepare for the upcoming written exams."
          : "Lectures, labs, exercises, and deadlines across the current courses."}</p>
      </header>

      {exams.length ? (
        <section className="home-exams" aria-labelledby="home-exams-title">
          <h2 id="home-exams-title">Revision guides</h2>
          <ul>
            {exams.map((exam) => (
              <li key={exam.id}>
                <Link className="home-exams__guide" to={exam.guideUrl}>
                  <span className="home-exams__meta">
                    {exam.courseCode} · {exam.title} · <time dateTime={exam.date}>{examDate.format(parseDate(exam.date))}{exam.time ? `, ${exam.time}` : ""}</time>
                  </span>
                  <strong>{exam.courseTitle}</strong>
                  <span className="home-exams__cta">Open revision guide</span>
                </Link>
                <Link className="home-exams__practice" to={exam.practiceUrl}>
                  Practise {exam.courseCode} questions
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <h2 className="home-week-title">Schedule</h2>
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
                  <strong>No dated events recorded</strong>
                  {next
                    ? <Link to={next.url}>Next: {next.title}</Link>
                    : <span>Check the official timetable for changes.</span>}
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
