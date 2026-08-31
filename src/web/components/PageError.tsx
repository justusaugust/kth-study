import { Link } from "react-router-dom";

export function PageError({
  title,
  message,
  linkTo,
  linkLabel,
}: {
  title: string;
  message: string;
  linkTo: string;
  linkLabel: string;
}) {
  return (
    <section className="page-state page-column" role="alert">
      <h1>{title}</h1>
      <p>{message}</p>
      <Link to={linkTo}>{linkLabel}</Link>
    </section>
  );
}
