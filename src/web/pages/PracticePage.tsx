import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { CourseResponse } from "../../domain/api";
import { getCourse, search } from "../api";
import { PracticePrompt } from "../components/PracticePrompt";
import { AtlasSelect } from "../components/AtlasSelect";
import { readLocalNotes } from "../useLocalNotes";

export function PracticePage() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const courseId = params.get("course") ? `course:${params.get("course")!.toLowerCase()}` : "";
  const workSlug = params.get("work");
  const [revisit, setRevisit] = useState(false);
  const [round, setRound] = useState(0);
  useEffect(() => {
    let active = true;
    search(new URLSearchParams({ type: "course", q: "", limit: "100" }))
      .then((result) => Promise.all(result.results.map((course) => getCourse(course.id.split(":")[1]))))
      .then((result) => { if (active) { setCourses(result); setLoaded(true); } })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  const packCourse = courses.find((course) => course.course.id === courseId);
  const work = workSlug !== null ? packCourse?.coursework.find((item) => item.slug === workSlug) : undefined;
  const coveredSessions = work ? packCourse!.sessions.filter((session) => session.kind === "lecture" && work.sessionIds.includes(session.id)) : [];
  const lectureIds = new Set([...(work?.lectureIds ?? []), ...coveredSessions.flatMap((session) => session.lectureId ? [session.lectureId] : [])]);
  const lectures = work ? packCourse!.lectures.filter((lecture) => lectureIds.has(lecture.id)) : [];
  const conceptIds = new Set([...(work?.conceptIds ?? []), ...lectures.flatMap((lecture) => lecture.conceptIds)]);
  const missingNotes = coveredSessions.filter((session) => !session.lectureId || !lectures.some((lecture) => lecture.id === session.lectureId)).map((session) => session.title);
  const missingLectureCount = [...lectureIds].filter((id) => !lectures.some((lecture) => lecture.id === id) && !coveredSessions.some((session) => session.lectureId === id)).length;
  const invalidPack = loaded && workSlug !== null && !work;
  const all = courses.filter((course) => !courseId || course.course.id === courseId)
    .flatMap((course) => course.questions.map((question, index) => ({ course, question, index })))
    .filter(({ question }) => workSlug === null || Boolean(work) && question.conceptIds.some((id) => conceptIds.has(id)))
    .sort((a, b) => a.index - b.index)
    .filter(({ question }) => !revisit || readLocalNotes(`kth-study:practice:${question.id}`).revisit === "yes");
  const page = Math.min(round, Math.max(0, Math.ceil(all.length / 5) - 1));
  const start = page * 5;
  const selected = all.slice(start, start + 5);

  const courseHref = packCourse ? `/courses/${packCourse.course.code.toLowerCase()}` : "";

  return <article className="page-column practice-page">
    {work && packCourse ? <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to={`${courseHref}#course-lectures`}>{packCourse.course.code} lectures</Link>
      <span aria-hidden="true">/</span>
      <span>Practice</span>
    </nav> : null}
    <h1>{work ? work.title : "Practice"}</h1>
    <p className="lead">{work ? work.description : "Work on paper, compare the method, revisit what needs another try."}</p>
    {packCourse && !work ? <p className="practice-course-lectures"><Link to={`${courseHref}#course-lectures`}>Lectures for {packCourse.course.code}</Link></p> : null}
    {invalidPack ? <p role="alert">Study pack not found. Choose a course and an existing assignment from its outline.</p> : work ? <section className="practice-pack" aria-label="Study pack">
      <p><Link to={`${courseHref}#coursework-${work.slug}`}>Assignment details and official references</Link></p>
      {lectures.length ? <>
        <h2 id="practice-pack-lectures-title">Covered lectures</h2>
        <ul className="lecture-list" aria-labelledby="practice-pack-lectures-title">{lectures.map((lecture) => <li key={lecture.id}>
          <Link className="lecture-list__link" to={`${courseHref}/lectures/${lecture.slug}`}>
            {lecture.title}
            <span className="practice-pack__arrow" aria-hidden="true">→</span>
          </Link>
        </li>)}</ul>
      </> : null}
      {missingNotes.length || missingLectureCount ? <p role="status">Some covered lecture notes are not available yet: {[...missingNotes, ...(missingLectureCount ? [`${missingLectureCount} other linked lecture${missingLectureCount === 1 ? "" : "s"}`] : [])].join("; ")}. This pack is incomplete; check the official material too.</p> : null}
    </section> : null}
    <div className="practice-toolbar">
      <AtlasSelect label="Course" value={courseId} options={[{ value: "", label: "All courses" }, ...courses.map(({ course }) => ({ value: course.id, label: course.code }))]} onChange={(value) => { setParams(value ? { course: value.split(":")[1] } : {}); setRound(0); }} />
      <label className="practice-queue"><input type="checkbox" checked={revisit} onChange={(event) => { setRevisit(event.target.checked); setRound(0); }} />Revisit queue</label>
      {loaded && all.length > 0 ? <nav className="practice-pagination" aria-label="Question sets">
        <span aria-live="polite">{start + 1}–{start + selected.length} <span>of {all.length}</span></span>
        <button type="button" aria-label="Previous question set" disabled={page === 0} onClick={() => setRound(page - 1)}>←</button>
        <button type="button" disabled={start + 5 >= all.length} onClick={() => setRound(page + 1)}>Next set <span aria-hidden="true">→</span></button>
      </nav> : null}
    </div>
    <p className="practice-guidance">{work
      ? conceptIds.size
        ? "Topic-matched self-checks, not a full mock exam or guaranteed exam coverage. Revisit choices stay in this browser."
        : "Topic coverage for this pack is not mapped yet, so no unrelated questions are substituted. These are existing course self-checks, not a mock exam or a mastery score; revisit choices are stored only in this browser."
      : "Existing course self-checks, not a mock exam or a mastery score. Revisit choices are stored only in this browser."}</p>
    {error ? <p role="alert">Practice could not load. Refresh to try again.</p> : !loaded ? <p role="status">Loading practice…</p> : !invalidPack && !all.length ? <p>{revisit ? "No questions marked for another try. Mark a question from any lesson to collect it here." : work ? "No authored self-checks match this pack yet." : "No authored self-checks are available for this course yet."}</p> : null}
    {selected.length ? <section className="practice-questions" aria-labelledby="practice-questions-title">
      <h2 id="practice-questions-title">Practice questions</h2>
      {selected.map(({ course, question }) => <div className="practice-question" key={question.id}>
        {courseId ? null : <p className="practice-course-label"><Link to={`/courses/${course.course.code.toLowerCase()}`}>{course.course.code} · Course outline</Link></p>}
        <PracticePrompt question={question} />
      </div>)}
    </section> : null}
  </article>;
}
