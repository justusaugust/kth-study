import type { ReactNode } from "react";
import {
  BookLinearIcon,
  BookmarkLinearIcon,
  CalculatorLinearIcon,
  CalendarLinearIcon,
  CheckCircleLinearIcon,
  ChatRoundDotsLinearIcon,
  DiplomaLinearIcon,
  DocumentTextLinearIcon,
  GalleryLinearIcon,
  HistoryLinearIcon,
  InfoCircleLinearIcon,
  LibraryLinearIcon,
  LightbulbLinearIcon,
  ListLinearIcon,
  MagnifierLinearIcon,
  MoonLinearIcon,
  NotebookLinearIcon,
  PenNewSquareLinearIcon,
  QuestionCircleLinearIcon,
  SquareAcademicCapLinearIcon,
  SunLinearIcon,
  UndoLeftLinearIcon,
  WidgetLinearIcon,
} from "@solar-icons/react";

export type StudyIconKind =
  | "all"
  | "course"
  | "lecture"
  | "concept"
  | "definition"
  | "example"
  | "question"
  | "explainer"
  | "date"
  | "period"
  | "explanation"
  | "check"
  | "state"
  | "outcome"
  | "source"
  | "notation"
  | "interpretation"
  | "ask"
  | "undo"
  | "search"
  | "theme-dark"
  | "theme-light";

const icons = {
  all: WidgetLinearIcon,
  course: SquareAcademicCapLinearIcon,
  lecture: NotebookLinearIcon,
  concept: LightbulbLinearIcon,
  definition: BookLinearIcon,
  example: PenNewSquareLinearIcon,
  question: QuestionCircleLinearIcon,
  explainer: GalleryLinearIcon,
  date: CalendarLinearIcon,
  period: HistoryLinearIcon,
  explanation: DocumentTextLinearIcon,
  check: CheckCircleLinearIcon,
  state: BookmarkLinearIcon,
  outcome: DiplomaLinearIcon,
  source: LibraryLinearIcon,
  notation: CalculatorLinearIcon,
  interpretation: InfoCircleLinearIcon,
  ask: ChatRoundDotsLinearIcon,
  undo: UndoLeftLinearIcon,
  search: MagnifierLinearIcon,
  "theme-dark": MoonLinearIcon,
  "theme-light": SunLinearIcon,
} satisfies Record<StudyIconKind, typeof ListLinearIcon>;

export function StudyIcon({
  kind,
  size = 17,
  className,
}: {
  kind: StudyIconKind;
  size?: number;
  className?: string;
}) {
  const Icon = icons[kind] ?? ListLinearIcon;
  return (
    <Icon
      aria-hidden="true"
      className={className}
      focusable="false"
      size={size}
      strokeWidth={1.5}
    />
  );
}

export function StudyMark({
  kind,
  children,
  className = "",
}: {
  kind: StudyIconKind;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`study-mark ${className}`.trim()}
      data-entity-mark={kind}
    >
      <StudyIcon kind={kind} />
      <span>{children}</span>
    </span>
  );
}

export function SectionMarker({
  kind,
  number,
}: {
  kind: StudyIconKind;
  number: string;
}) {
  return (
    <span className="section-marker" data-section-marker aria-hidden="true">
      <StudyIcon kind={kind} size={18} />
      <span>{number}</span>
    </span>
  );
}
