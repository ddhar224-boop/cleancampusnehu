import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="container-page max-w-3xl py-16">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
      <div className="mt-10 grid gap-8 text-[15px] leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-2 [&_p]:text-muted-foreground [&_ul]:mt-2 [&_ul]:grid [&_ul]:gap-1 [&_ul]:text-muted-foreground">
        {children}
      </div>
    </article>
  );
}
