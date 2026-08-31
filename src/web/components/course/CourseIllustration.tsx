export function CourseIllustration({
  src,
  label,
  overlay = "geometry",
}: {
  src: string;
  label: string;
  overlay?: "geometry" | "signal" | "flow";
}) {
  return (
    <div className="course-artwork">
      <img src={src} alt={label} loading="eager" decoding="async" />
      <svg
        className="course-artwork__overlay"
        viewBox="0 0 2100 749"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        data-testid="course-artwork-overlay"
        data-overlay={overlay}
      >
        {overlay === "geometry" ? (
          <>
            <path d="M782 546 H1320" />
            <path d="M1320 546 L1608 354" />
            <circle cx="1320" cy="546" r="11" />
          </>
        ) : null}
        {overlay === "signal" ? (
          <>
            <path d="M682 545 H910 V430 H1138 V545 H1366 V430 H1594" />
            <circle cx="910" cy="430" r="11" />
          </>
        ) : null}
        {overlay === "flow" ? (
          <>
            <path d="M620 540 C820 540 830 430 1040 430 C1250 430 1260 540 1460 540" />
            <path d="M1460 540 L1418 514 M1460 540 L1418 566" />
            <circle cx="1040" cy="430" r="11" />
          </>
        ) : null}
      </svg>
    </div>
  );
}
