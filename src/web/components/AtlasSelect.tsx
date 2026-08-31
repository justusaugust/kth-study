import { useEffect, useId, useRef, useState } from "react";

export interface AtlasSelectOption {
  value: string;
  label: string;
  detail?: string;
}

export interface AtlasSelectProps {
  label: string;
  value: string;
  options: ReadonlyArray<AtlasSelectOption>;
  onChange: (value: string) => void;
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M4 6.25 8 10.25 12 6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Select-only combobox: a button owns focus and points at the active option
 * with aria-activedescendant, so the listbox never has to steal and return the
 * caret. Values stay plain strings, which lets callers keep them in the URL.
 */
export function AtlasSelect({ label, value, options, onChange }: AtlasSelectProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const triggerId = `${baseId}-trigger`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function openList(offset = 0) {
    const start = selectedIndex + offset;
    setActiveIndex(Math.min(options.length - 1, Math.max(0, start)));
    setOpen(true);
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  }

  function moveTo(index: number) {
    if (options.length === 0) return;
    setActiveIndex(Math.min(options.length - 1, Math.max(0, index)));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) moveTo(activeIndex + 1);
        else openList(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (open) moveTo(activeIndex - 1);
        else openList(-1);
        return;
      case "Home":
        if (!open) return;
        event.preventDefault();
        moveTo(0);
        return;
      case "End":
        if (!open) return;
        event.preventDefault();
        moveTo(options.length - 1);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(activeIndex);
        else openList();
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        close();
        return;
      case "Tab":
        if (open) setOpen(false);
        return;
      default:
    }
  }

  return (
    <div className="atlas-select" ref={rootRef}>
      <span className="atlas-select-label" id={labelId}>
        {label}
      </span>
      <button
        type="button"
        role="combobox"
        id={triggerId}
        ref={triggerRef}
        className="atlas-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={`${labelId} ${triggerId}`}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onKeyDown={onKeyDown}
        onClick={() => (open ? close() : openList())}
      >
        <span className="atlas-select-value">
          <span>{selected?.label ?? ""}</span>
          {selected?.detail ? (
            <small className="atlas-select-value-detail">{selected.detail}</small>
          ) : null}
        </span>
        <Chevron />
      </button>
      {open ? (
        <ul className="atlas-select-list" role="listbox" id={listboxId} aria-labelledby={labelId}>
          {options.map((option, index) => (
            <li
              key={option.value || "__all"}
              id={optionId(index)}
              role="option"
              className="atlas-select-option"
              aria-label={option.detail ? `${option.label} — ${option.detail}` : option.label}
              aria-selected={index === selectedIndex}
              data-active={index === activeIndex ? "" : undefined}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commit(index)}
            >
              <span>{option.label}</span>
              {option.detail ? (
                <small className="atlas-select-option-detail">{option.detail}</small>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
