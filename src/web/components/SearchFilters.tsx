import { SEARCH_FILTERS, type UserSearchType } from "../searchModel";
import { StudyIcon, type StudyIconKind } from "./StudyMark";

interface SearchFiltersProps {
  activeType: UserSearchType | null;
  onSelect: (type: UserSearchType | null) => void;
  className?: string;
}

export function SearchFilters({
  activeType,
  onSelect,
  className = "",
}: SearchFiltersProps) {
  return (
    <div className={`search-filter-row ${className}`.trim()} aria-label="Search filters">
      {SEARCH_FILTERS.map(({ label, type }) => (
        <button
          key={label}
          type="button"
          aria-pressed={activeType === type}
          onClick={() => onSelect(type)}
        >
          <StudyIcon kind={(type ?? "all") as StudyIconKind} />
          {label}
        </button>
      ))}
    </div>
  );
}
