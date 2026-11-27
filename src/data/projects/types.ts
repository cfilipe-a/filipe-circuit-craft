import type { ComponentType } from "react";

export type ProjectCategory = "Hardware & PCB" | "Embarcados" | "Dados";

export type ProjectStage = "Lab / Protótipo" | "Validado em Bancada" | "Em Produção";

export const SPEC_CATEGORIES = {
  electrical: "Elétrica & Alimentação",
  hardware: "Hardware & PCB",
  firmware: "Firmware & Comunicação",
  mechanical: "Mecânica & Bancada",
  data: "Software & Dados",
} as const;

export type ProjectMetaItem = {
  label: string;
  value: string;
};

export type ProjectCover = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectHomeConfig = {
  visible: boolean;
  featured?: boolean;
  order: number;
  summary?: string;
  tags?: string[];
  cover?: string;
};

export type ProjectMediaItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type OverviewBlockData = {
  type: "overview";
  id?: string;
  title?: string;
  intro?: string | string[];
  topics?: { heading: string; text: string }[];
  tags?: string[];
};

export type SpecItem = {
  label: string;
  value: string;
  note?: string;
};

export type SpecGroup = {
  category: string;
  items: SpecItem[];
};

export type SpecsBlockData = {
  type: "specs";
  id?: string;
  title?: string;
  groups: SpecGroup[];
};

export type GalleryBlockData = {
  type: "gallery";
  id?: string;
  title?: string;
  layout?: "grid" | "spotlight";
  items: ProjectMediaItem[];
};

export type DocumentItem = {
  title: string;
  description?: string;
  format?: string;
  src: string;
  mode: "view" | "download" | "both";
  downloadFilename?: string;
  previewType?: "image" | "pdf" | "auto";
};

export type DocumentsBlockData = {
  type: "documents";
  id?: string;
  title?: string;
  items: DocumentItem[];
};

export type CodeSnippet = {
  filename: string;
  language?: string;
  content: string;
  copyable?: boolean;
};

export type CodeRepositoryLink = {
  label?: string;
  url: string;
  description?: string;
};

export type CodeBlockData = {
  type: "code";
  id?: string;
  title?: string;
  snippets?: CodeSnippet[];
  repository?: CodeRepositoryLink;
};

export type VideoBlockData = {
  type: "video";
  id?: string;
  title?: string;
  src: string;
  poster?: string;
  caption?: string;
};

export type ResultsMetric = {
  label: string;
  value: string;
  detail?: string;
};

export type ResultsComparison = {
  label: string;
  before: string;
  after: string;
  note?: string;
};

export type ResultsBlockData = {
  type: "results";
  id?: string;
  title?: string;
  summary?: string;
  highlights?: string[];
  metrics?: ResultsMetric[];
  comparisons?: ResultsComparison[];
  media?: ProjectMediaItem[];
};

export type CustomBlockData = {
  type: "custom";
  id: string;
  title?: string;
  tocLabel?: string;
  component: ComponentType;
};

export type ProjectBlock =
  | OverviewBlockData
  | SpecsBlockData
  | GalleryBlockData
  | DocumentsBlockData
  | CodeBlockData
  | VideoBlockData
  | ResultsBlockData
  | CustomBlockData;

export type ProjectConfig = {
  slug: string;
  title: string;
  category: ProjectCategory;
  stage: ProjectStage;
  summary: string;
  meta?: ProjectMetaItem[];
  cover?: ProjectCover;
  home: ProjectHomeConfig;
  blocks: ProjectBlock[];
};

export type HomeProjectCard = {
  slug: string;
  category: ProjectCategory;
  title: string;
  stage: ProjectStage;
  summary: string;
  tags: string[];
  img?: string | undefined;
  featured: boolean;
  order: number;
};

export type ResolvedProjectBlock = {
  id: string;
  number: string;
  title: string;
  tocLabel: string;
  block: ProjectBlock;
};

export const DEFAULT_BLOCK_META: Record<ProjectBlock["type"], { id: string; title: string }> = {
  overview: { id: "visao-geral", title: "Visão geral" },
  specs: { id: "especificacoes", title: "Especificações técnicas" },
  gallery: { id: "galeria", title: "Galeria" },
  documents: { id: "documentacao", title: "Esquemático & documentação" },
  code: { id: "codigo", title: "Código & firmware" },
  video: { id: "video", title: "Vídeo demonstrativo" },
  results: { id: "resultados", title: "Resultados" },
  custom: { id: "secao", title: "Seção personalizada" },
};

function hasNonEmptyText(value: string | string[] | undefined): boolean {
  if (!value) return false;
  if (Array.isArray(value)) return value.some((item) => item.trim().length > 0);
  return value.trim().length > 0;
}

export function isBlockRenderable(block: ProjectBlock): boolean {
  switch (block.type) {
    case "overview":
      return (
        hasNonEmptyText(block.intro) ||
        (block.topics?.length ?? 0) > 0 ||
        (block.tags?.length ?? 0) > 0
      );
    case "specs":
      return block.groups.some((group) => group.items.length > 0);
    case "gallery":
      return block.items.length > 0;
    case "documents":
      return block.items.length > 0;
    case "code":
      return (block.snippets?.length ?? 0) > 0 || Boolean(block.repository?.url.trim());
    case "video":
      return block.src.trim().length > 0;
    case "results":
      return (
        hasNonEmptyText(block.summary) ||
        (block.highlights?.length ?? 0) > 0 ||
        (block.metrics?.length ?? 0) > 0 ||
        (block.comparisons?.length ?? 0) > 0 ||
        (block.media?.length ?? 0) > 0
      );
    case "custom":
      return true;
  }
}

export function resolveProjectBlocks(blocks: readonly ProjectBlock[]): ResolvedProjectBlock[] {
  const usedIds = new Map<string, number>();
  const resolved: ResolvedProjectBlock[] = [];

  for (const block of blocks) {
    if (!isBlockRenderable(block)) continue;

    const defaults = DEFAULT_BLOCK_META[block.type];
    const baseId = (block.id?.trim() || defaults.id).replace(/^#/, "");
    const count = (usedIds.get(baseId) ?? 0) + 1;
    usedIds.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    const title = block.title?.trim() || defaults.title;
    const tocLabel = block.type === "custom" ? block.tocLabel?.trim() || title : title;

    resolved.push({
      id,
      number: String(resolved.length + 1).padStart(2, "0"),
      title,
      tocLabel,
      block,
    });
  }

  return resolved;
}
