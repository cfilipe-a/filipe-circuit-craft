import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Brand } from "@/components/home/Header";
import { resolveProjectBlocks, type ProjectConfig } from "@/data/projects/types";
import { ProjectBlockRenderer } from "./ProjectBlocks";

type ProjectTemplateProps = {
  project: ProjectConfig;
  nextProject?: ProjectConfig | undefined;
};

export function ProjectTemplate({ project, nextProject }: ProjectTemplateProps) {
  const resolvedBlocks = resolveProjectBlocks(project.blocks);

  return (
    <div className="min-h-screen bg-ed-bg font-sans text-ed-fg">
      <header className="sticky top-0 z-40 border-b border-ed-line bg-ed-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link
            to="/"
            hash="projetos"
            className="inline-flex items-center gap-2 text-sm text-ed-muted transition hover:text-ed-fg"
          >
            <ArrowLeft className="h-4 w-4 text-ed-accent" />
            Voltar aos projetos
          </Link>
          <Link to="/" aria-label="Início" className="rounded-sm transition hover:opacity-90">
            <Brand />
          </Link>
        </div>
      </header>

      <section
        aria-labelledby="project-title"
        className="relative overflow-hidden border-b border-ed-line bg-ed-bg"
      >
        <div
          aria-hidden="true"
          className="line-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        />
        <div className="relative mx-auto max-w-5xl px-5 py-14 sm:py-18">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ed-accent">
              {project.category}
            </span>
            <span className="rounded border border-ed-line-strong px-2.5 py-0.5 font-mono text-[11px] text-ed-muted">
              {project.stage}
            </span>
          </div>

          <h1
            id="project-title"
            className="mt-5 font-display text-4xl font-semibold tracking-tight text-ed-fg md:text-5xl"
          >
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ed-muted">{project.summary}</p>

          {project.meta && project.meta.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ed-line bg-ed-line md:grid-cols-4">
              {project.meta.map((item) => (
                <div key={item.label} className="bg-ed-bg2 p-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-ed-muted">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ed-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {resolvedBlocks.length > 0 && (
        <nav aria-label="Índice do projeto" className="border-b border-ed-line bg-ed-bg2/60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ed-muted">
              Seções
            </span>
            {resolvedBlocks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-ed-muted transition hover:text-ed-accent"
              >
                <span className="text-ed-accent">{item.number}</span>
                <span>{item.tocLabel}</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      <main className="mx-auto max-w-5xl space-y-16 px-5 py-12 sm:space-y-20 sm:py-16">
        {project.cover && (
          <figure className="overflow-hidden rounded-xl border border-ed-line bg-ed-bg2">
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              width={1024}
              height={768}
              className="aspect-[16/9] w-full object-cover"
            />
            {project.cover.caption && (
              <figcaption className="border-t border-ed-line px-4 py-3 font-mono text-xs text-ed-muted">
                {project.cover.caption}
              </figcaption>
            )}
          </figure>
        )}

        {resolvedBlocks.map((resolved) => (
          <ProjectBlockRenderer key={resolved.id} resolved={resolved} />
        ))}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ed-line pt-10">
          <Link
            to="/"
            hash="projetos"
            className="inline-flex items-center gap-2 rounded-lg border border-ed-line-strong bg-ed-bg2 px-5 py-3 text-sm text-ed-fg transition hover:border-ed-muted"
          >
            <ArrowLeft className="h-4 w-4 text-ed-accent" />
            Voltar aos projetos
          </Link>

          {nextProject && (
            <Link
              to="/projetos/$slug"
              params={{ slug: nextProject.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-ed-line-strong bg-ed-bg2 px-5 py-3 text-sm text-ed-fg transition hover:border-ed-accent/60 hover:text-ed-accent"
            >
              <span>Próximo: {nextProject.title}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
