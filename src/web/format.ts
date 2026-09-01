export function formatStudyDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatStudyDateLong(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function dateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day, date: new Date(Date.UTC(year, month - 1, day)) };
}

export function formatStudyDateRange(start?: string, end?: string): string | undefined {
  if (!start && !end) return undefined;
  if (start && !end) return `From ${formatStudyDate(start)}`;
  if (!start && end) return `Until ${formatStudyDate(end)}`;

  const startParts = dateParts(start!);
  const endParts = dateParts(end!);
  const short = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

  if (startParts.year === endParts.year) {
    return `${short.format(startParts.date)}–${formatStudyDate(end!)}`;
  }
  return `${formatStudyDate(start!)}–${formatStudyDate(end!)}`;
}
