import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Copy, X, FileText, Github, PlayCircle, Terminal, CheckCircle2 } from "lucide-react";
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

function Gallery({ items }: { items: { src: string; caption: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const step = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("figure") as HTMLElement | null;
    const w = card ? card.offsetWidth + 20 : el.clientWidth;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    drag.current = { down: true, startX: e.clientX, startScroll: ref.current.scrollLeft, moved: false };
    ref.current.style.scrollSnapType = "none";
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !ref.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 3) d.moved = true;
    ref.current.scrollLeft = d.startScroll - dx;
  };
  const onUp = () => {
    const d = drag.current;
    const el = ref.current;
    if (!d.down || !el) return;
    d.down = false;
    const card = el.querySelector("figure") as HTMLElement | null;
    const w = card ? card.offsetWidth + 20 : el.clientWidth;
    const delta = el.scrollLeft - d.startScroll;
    const base = Math.round(d.startScroll / w);
    const target = Math.abs(delta) > w * 0.15 ? base + Math.sign(delta) : base;
    el.style.scrollSnapType = "";
    el.scrollTo({ left: target * w, behavior: "smooth" });
  };

  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, items.length]);

  return (
    <section>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Foto ampliada" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <button type="button" aria-label="Fechar" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:border-primary/60 hover:text-primary"><X className="h-5 w-5" /></button>
          <img src={items[open]!.src} alt={items[open]!.caption} className="max-h-[80vh] max-w-full rounded-xl border object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="mt-4 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Foto anterior" onClick={() => setOpen((open - 1 + items.length) % items.length)} className="grid h-10 w-10 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:border-primary/60 hover:text-primary"><ChevronLeft className="h-5 w-5" /></button>
            <p className="font-mono text-xs text-muted-foreground"><span className="text-primary">{open + 1}/{items.length}</span> — {items[open]!.caption}</p>
            <button type="button" aria-label="Próxima foto" onClick={() => setOpen((open + 1) % items.length)} className="grid h-10 w-10 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:border-primary/60 hover:text-primary"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <SectionLabel n="02">Galeria de bancada</SectionLabel>
        <div className="flex gap-2 lg:hidden">
          {[
            { dir: -1, Icon: ChevronLeft, label: "Foto anterior" },
            { dir: 1, Icon: ChevronRight, label: "Próxima foto" },
          ].map(({ dir, Icon, label }) => (
            <button
              key={dir}
              type="button"
              aria-label={label}
              onClick={() => step(dir)}
              className="grid h-9 w-9 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="scrollbar-none -mx-6 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 select-none active:cursor-grabbing lg:mx-0 lg:grid lg:cursor-auto lg:grid-cols-3 lg:overflow-visible lg:px-0"
      >
        {items.map((g, idx) => (
          <figure key={g.caption} onClick={() => { if (!drag.current.moved) setOpen(idx); }} className="card-hover group w-[85%] cursor-zoom-in shrink-0 snap-start overflow-hidden rounded-2xl border bg-card sm:w-[calc(50%-10px)] lg:w-auto">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={g.src} alt={g.caption} loading="lazy" draggable={false} width={1024} height={768} className="pointer-events-none h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <figcaption className="p-4 font-mono text-xs text-muted-foreground">{g.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { return; }
      }}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition hover:text-primary"
    >
      {done ? <><Check className="h-3.5 w-3.5 text-primary" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
    </button>
  );
}

function ProjectPage() {
  const { project: p } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>
          <span className="font-mono text-xs text-muted-foreground">/projetos/{p.slug}</span>
        </div>
      </header>

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
        <figure className="overflow-hidden rounded-2xl border bg-card">
          <img src={p.cover} alt={p.title} width={1024} height={768} className="aspect-[16/9] w-full object-cover" />
        </figure>

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

        <Gallery items={p.gallery} />

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
                  <CopyButton text={p.code.content} />
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
