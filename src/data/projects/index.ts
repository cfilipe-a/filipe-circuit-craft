import { modeloProject } from "./modelo";
import type { HomeProjectCard, ProjectConfig } from "./types";

export const PROJECTS: ProjectConfig[] = [modeloProject];

function sortHomeProjects(list: readonly ProjectConfig[]): ProjectConfig[] {
  return [...list]
    .filter((project) => project.home.visible)
    .sort((a, b) => {
      const featuredDiff = (b.home.featured ? 1 : 0) - (a.home.featured ? 1 : 0);
      return featuredDiff !== 0 ? featuredDiff : a.home.order - b.home.order;
    });
}

export function getProjectBySlug(
  slug: string,
  list: readonly ProjectConfig[] = PROJECTS,
): ProjectConfig | undefined {
  return list.find((project) => project.slug === slug);
}

export function getVisibleHomeProjects(
  list: readonly ProjectConfig[] = PROJECTS,
): HomeProjectCard[] {
  return sortHomeProjects(list).map((project) => ({
    slug: project.slug,
    category: project.category,
    title: project.title,
    stage: project.stage,
    summary: project.home.summary ?? project.summary,
    tags: project.home.tags ?? [],
    img: project.home.cover ?? project.cover?.src,
    featured: Boolean(project.home.featured),
    order: project.home.order,
  }));
}

export function getAllProjectSlugs(list: readonly ProjectConfig[] = PROJECTS): string[] {
  return list.map((project) => project.slug);
}

export function getNextVisibleProject(
  currentSlug: string,
  list: readonly ProjectConfig[] = PROJECTS,
): ProjectConfig | undefined {
  const visible = sortHomeProjects(list);
  if (visible.length < 2) return undefined;
  const index = visible.findIndex((project) => project.slug === currentSlug);
  if (index === -1) return visible[0];
  return visible[(index + 1) % visible.length];
}

export * from "./types";
