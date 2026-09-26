import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  center?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            inverted ? "text-primary" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 text-3xl font-bold sm:text-4xl ${
          inverted ? "text-ink-foreground" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`mt-4 text-base leading-relaxed ${
            inverted ? "text-ink-foreground/70" : "text-muted-foreground"
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
