import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Copy, FileText, Github, PlayCircle, Terminal, CheckCircle2 } from "lucide-react";
import { getProjectDoc } from "@/data/projects";

export const Route = createFileRoute("/projetos/$slug")({
  loader: ({ params }) => {
    const project = getProjectDoc(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.project.title} — Filipe Cavalcante` : "Projeto — Filipe Cavalcante";
    const d = loaderData?.project.subtitle ?? "Documentação técnica de projeto.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-mono text-xs text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Projeto não encontrado</h1>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-primary"><ArrowLeft className="h-4 w-4" /> Voltar ao início</Link>
      </div>
    </div>
  ),
  component: ProjectPage,
});

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="font-mono text-xs text-primary">{n}</span>
      <span className="h-px w-8 bg-primary/40" />
      <h2 className="text-2xl font-semibold">{children}</h2>
    </div>
  );
}

function ProjectPage() {
  const { project: p } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>
          <span className="font-mono text-xs text-muted-foreground">/projetos/{p.slug}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="line-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-20">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">{p.category}</span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{p.subtitle}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
            {p.meta.map((m) => (
              <div key={m.label} className="bg-card p-4">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              <Github className="h-4 w-4" /> Repositório
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm transition hover:border-primary/50">
              <FileText className="h-4 w-4" /> Esquemático (PDF)
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl space-y-20 px-5 py-16">
        {/* Cover */}
        <figure className="overflow-hidden rounded-2xl border bg-card">
          <img src={p.cover} alt={p.title} width={1024} height={768} className="aspect-[16/9] w-full object-cover" />
        </figure>

        {/* Overview */}
        <section>
          <SectionLabel n="01">Visão geral</SectionLabel>
          <div className="grid gap-5 md:grid-cols-3">
            {p.overview.map((o) => (
              <div key={o.heading} className="card-hover rounded-2xl border bg-card p-6">
                <h3 className="font-mono text-xs uppercase tracking-wider text-primary">{o.heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-md border bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">{s}</span>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section>
          <SectionLabel n="02">Galeria de bancada</SectionLabel>
          <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {p.gallery.map((g) => (
              <figure key={g.caption} className="card-hover group w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border bg-card sm:w-[calc(50%-10px)] lg:w-auto">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={g.src} alt={g.caption} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <figcaption className="p-4 font-mono text-xs text-muted-foreground">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Code */}
        {p.code && (
          <section>
            <SectionLabel n="03">Código & firmware</SectionLabel>
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-center justify-between border-b bg-secondary px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                  </div>
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground"><Terminal className="h-3.5 w-3.5 text-primary" />{p.code.filename}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded border border-primary/30 px-2 py-0.5 font-mono text-[10px] text-primary">{p.code.language}</span>
                  <button className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition hover:text-primary"><Copy className="h-3.5 w-3.5" /> Copiar</button>
                </div>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                {p.code.content.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-5 w-6 shrink-0 select-none text-right text-muted-foreground/50">{i + 1}</span>
                    <code className="text-foreground/90">{line || " "}</code>
                  </div>
                ))}
              </pre>
            </div>
          </section>
        )}

        {/* Video */}
        {p.youtubeId && (
          <section>
            <SectionLabel n="04">Vídeo demonstrativo</SectionLabel>
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${p.youtubeId}`}
                  title={`Vídeo — ${p.title}`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <p className="flex items-center gap-2 border-t p-4 font-mono text-xs text-muted-foreground"><PlayCircle className="h-4 w-4 text-primary" /> Funcionamento em bancada</p>
            </div>
          </section>
        )}

        {/* Results */}
        <section>
          <SectionLabel n="05">Resultados</SectionLabel>
          <ul className="space-y-3">
            {p.results.map((r) => (
              <li key={r} className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{r}
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t pt-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 text-sm transition hover:border-primary/50">
            <ArrowLeft className="h-4 w-4" /> Voltar ao portfólio
          </Link>
        </div>
      </main>
    </div>
  );
}
