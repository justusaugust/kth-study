import { useState } from "react";

export function readLocalNotes(key: string): Record<string, string> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch {
    return {};
  }
}

export function useLocalNotes(key: string) {
  const [notes, setNotes] = useState(() => readLocalNotes(key));
  const [saved, setSaved] = useState(true);
  function update(field: string, value: string) {
    const next = { ...notes, [field]: value };
    setNotes(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }
  return { notes, update, saved };
}
