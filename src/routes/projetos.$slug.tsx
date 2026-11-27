import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProjectTemplate } from "@/components/project/ProjectTemplate";
import { getNextVisibleProject, getProjectBySlug } from "@/data/projects";

export const Route = createFileRoute("/projetos/$slug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return {
      slug: project.slug,
      title: project.title,
      summary: project.summary,
    };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} — Filipe Cavalcante` : "Projeto — Filipe Cavalcante";
    const d = loaderData?.summary ?? "Documentação técnica de projeto.";
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
    <div className="grid min-h-screen place-items-center bg-ed-bg px-5 text-center text-ed-fg">
      <div>
        <p className="font-mono text-xs text-ed-accent">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Projeto não encontrado</h1>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-ed-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </Link>
      </div>
    </div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useLoaderData();
  const project = getProjectBySlug(slug);
  if (!project) return null;

  const nextProject = getNextVisibleProject(slug);

  return <ProjectTemplate project={project} nextProject={nextProject} />;
}
