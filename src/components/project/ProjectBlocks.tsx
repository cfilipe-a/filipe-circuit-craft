import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Github,
  PlayCircle,
  Terminal,
  ZoomIn,
} from "lucide-react";
import type {
  CodeBlockData,
  DocumentItem,
  DocumentsBlockData,
  GalleryBlockData,
  OverviewBlockData,
  ProjectMediaItem,
  ResolvedProjectBlock,
  ResultsBlockData,
  SpecsBlockData,
  VideoBlockData,
} from "@/data/projects/types";
import { Lightbox } from "./Lightbox";

export function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="font-mono text-xs text-ed-accent">{number}</span>
      <span className="h-[2px] w-4 shrink-0 bg-ed-accent" />
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ed-fg sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          return;
        }
      }}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-ed-muted transition hover:text-ed-accent"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-ed-accent" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </>
      )}
    </button>
  );
}

function OverviewBlock({ block }: { block: OverviewBlockData }) {
  const paragraphs = block.intro
    ? (Array.isArray(block.intro) ? block.intro : [block.intro]).filter((p) => p.trim().length > 0)
    : [];
  const topics = block.topics ?? [];
  const tags = block.tags ?? [];
  const topicGridCols = topics.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <div className="space-y-6">
      {paragraphs.length > 0 && (
        <div className="max-w-3xl space-y-3 text-base leading-relaxed text-ed-muted">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      )}

      {topics.length > 0 && (
        <div className={`grid gap-5 ${topicGridCols}`}>
          {topics.map((topic) => (
            <div
              key={topic.heading}
              className="rounded-xl border border-ed-line bg-ed-bg2 p-5 sm:p-6"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ed-accent">
                {topic.heading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ed-muted">{topic.text}</p>
            </div>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-ed-line bg-ed-bg2 px-2.5 py-1 font-mono text-[11px] text-ed-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SpecsBlock({ block }: { block: SpecsBlockData }) {
  const groups = block.groups.filter((g) => g.items.length > 0);
  const gridCols = groups.length > 1 ? "md:grid-cols-2" : "";

  return (
    <div className={`grid gap-5 ${gridCols}`}>
      {groups.map((group) => (
        <div key={group.category} className="rounded-xl border border-ed-line bg-ed-bg2 p-5 sm:p-6">
          <h3 className="border-b border-ed-line pb-3 font-mono text-xs uppercase tracking-[0.16em] text-ed-accent">
            {group.category}
          </h3>
          <dl className="divide-y divide-ed-line">
            {group.items.map((item) => (
              <div key={item.label} className="py-3.5 first:pt-4 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-sm text-ed-muted">{item.label}</dt>
                  <dd className="font-mono text-sm text-ed-fg">{item.value}</dd>
                </div>
                {item.note && <p className="mt-1 text-xs text-ed-muted/80">{item.note}</p>}
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function GalleryBlock({ block }: { block: GalleryBlockData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const layout = block.layout ?? "grid";
  const items = block.items;
  const activeItem = items[spotlightIndex] ?? items[0];

  return (
    <>
      <Lightbox
        items={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {layout === "spotlight" && activeItem ? (
        <div className="space-y-4">
          <figure className="overflow-hidden rounded-xl border border-ed-line bg-ed-bg2">
            <button
              type="button"
              onClick={() => setLightboxIndex(spotlightIndex)}
              aria-label={`Ampliar imagem: ${activeItem.alt}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden bg-ed-bg text-left"
            >
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                width={1024}
                height={768}
                className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.01]"
              />
              <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-ed-line bg-ed-bg/85 px-2.5 py-1 font-mono text-[11px] text-ed-fg backdrop-blur">
                <ZoomIn className="h-3.5 w-3.5 text-ed-accent" />
                Ampliar
              </span>
            </button>
            <figcaption className="border-t border-ed-line px-4 py-3 font-mono text-xs text-ed-muted">
              {activeItem.caption ?? activeItem.alt}
            </figcaption>
          </figure>

          {items.length > 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item, idx) => {
                const isSelected = idx === spotlightIndex;
                return (
                  <button
                    key={`${item.src}-${idx}`}
                    type="button"
                    aria-label={`Selecionar ${item.alt}`}
                    aria-pressed={isSelected}
                    onClick={() => setSpotlightIndex(idx)}
                    className={`overflow-hidden rounded-lg border bg-ed-bg2 text-left transition ${
                      isSelected
                        ? "border-ed-accent"
                        : "border-ed-line opacity-80 hover:border-ed-line-strong hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span className="block truncate px-2.5 py-2 font-mono text-[11px] text-ed-muted">
                      {item.caption ?? item.alt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <figure
              key={`${item.src}-${idx}`}
              className="group overflow-hidden rounded-xl border border-ed-line bg-ed-bg2 transition hover:border-ed-line-strong"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(idx)}
                aria-label={`Ampliar imagem: ${item.alt}`}
                className="block w-full cursor-zoom-in overflow-hidden bg-ed-bg"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </button>
              <figcaption className="border-t border-ed-line p-4 font-mono text-xs text-ed-muted">
                {item.caption ?? item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

function resolvePreviewType(item: DocumentItem): "image" | "pdf" | "file" {
  if (item.previewType && item.previewType !== "auto") {
    return item.previewType;
  }
  const cleanSrc = item.src.split(/[?#]/)[0]?.toLowerCase() ?? "";
  if (/\.(png|jpe?g|webp|gif|svg|avif)$/.test(cleanSrc)) return "image";
  if (/\.pdf$/.test(cleanSrc)) return "pdf";
  return "file";
}

function DocumentsBlock({ block }: { block: DocumentsBlockData }) {
  const [previewImage, setPreviewImage] = useState<ProjectMediaItem | null>(null);

  return (
    <>
      <Lightbox
        items={previewImage ? [previewImage] : []}
        index={previewImage ? 0 : null}
        onClose={() => setPreviewImage(null)}
        onNavigate={() => undefined}
      />

      <div className="space-y-5">
        {block.items.map((item, idx) => {
          const canView = item.mode === "view" || item.mode === "both";
          const canDownload = item.mode === "download" || item.mode === "both";
          const previewKind = resolvePreviewType(item);

          return (
            <article
              key={`${item.title}-${idx}`}
              className="overflow-hidden rounded-xl border border-ed-line bg-ed-bg2"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-ed-accent" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-ed-fg">{item.title}</h3>
                    {item.format && (
                      <span className="rounded border border-ed-line-strong px-2 py-0.5 font-mono text-[10px] uppercase text-ed-muted">
                        {item.format}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-ed-muted">{item.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {canView && (
                    <a
                      href={item.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ed-line-strong px-3.5 py-2 font-mono text-xs text-ed-fg transition hover:border-ed-accent/60 hover:text-ed-accent"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Abrir
                    </a>
                  )}
                  {canDownload && (
                    <a
                      href={item.src}
                      download={item.downloadFilename ?? true}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-ed-accent px-3.5 py-2 font-mono text-xs font-medium text-ed-ink transition hover:bg-ed-accent-hover"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Baixar
                    </a>
                  )}
                </div>
              </div>

              {canView && previewKind === "image" && (
                <div className="border-t border-ed-line bg-ed-bg p-4">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewImage({
                        src: item.src,
                        alt: item.title,
                        ...(item.description ? { caption: item.description } : {}),
                      })
                    }
                    aria-label={`Ampliar documento: ${item.title}`}
                    className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-ed-line"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="max-h-[420px] w-full object-contain bg-ed-bg"
                    />
                  </button>
                </div>
              )}

              {canView && previewKind === "pdf" && (
                <div className="border-t border-ed-line bg-ed-bg p-4">
                  <iframe
                    src={item.src}
                    title={item.title}
                    className="h-[460px] w-full rounded-lg border border-ed-line bg-ed-bg"
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}

function CodeBlock({ block }: { block: CodeBlockData }) {
  const snippets = block.snippets ?? [];
  const repo = block.repository;

  return (
    <div className="space-y-5">
      {repo?.url && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ed-line bg-ed-bg2 p-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-ed-accent">
              <Github className="h-4 w-4" aria-hidden="true" />
              <span>Repositório externo</span>
            </div>
            {repo.description && (
              <p className="mt-2 text-sm text-ed-muted">{repo.description}</p>
            )}
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-ed-line-strong px-4 py-2 text-sm font-medium text-ed-fg transition hover:border-ed-accent/60 hover:text-ed-accent"
          >
            <span>{repo.label ?? "Abrir repositório"}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      {snippets.map((snippet, idx) => (
        <div
          key={`${snippet.filename}-${idx}`}
          className="overflow-hidden rounded-xl border border-ed-line bg-ed-bg2"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ed-line bg-ed-bg px-4 py-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-ed-muted">
              <Terminal className="h-3.5 w-3.5 text-ed-accent" aria-hidden="true" />
              {snippet.filename}
            </span>
            <div className="flex items-center gap-3">
              {snippet.language && (
                <span className="rounded border border-ed-accent/30 px-2 py-0.5 font-mono text-[10px] text-ed-accent">
                  {snippet.language}
                </span>
              )}
              {snippet.copyable !== false && <CopyButton text={snippet.content} />}
            </div>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
            {snippet.content.split("\n").map((line, lineIndex) => (
              <div key={lineIndex} className="flex">
                <span className="mr-5 w-6 shrink-0 select-none text-right text-ed-muted/50">
                  {lineIndex + 1}
                </span>
                <code className="text-ed-fg/90">{line || " "}</code>
              </div>
            ))}
          </pre>
        </div>
      ))}
    </div>
  );
}

function VideoBlock({ block }: { block: VideoBlockData }) {
  if (!block.src.trim()) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-ed-line bg-ed-bg2">
      <div className="aspect-video bg-ed-bg">
        <video
          controls
          playsInline
          preload="metadata"
          poster={block.poster}
          src={block.src}
          className="h-full w-full object-contain"
        />
      </div>
      {block.caption && (
        <p className="flex items-center gap-2 border-t border-ed-line px-4 py-3 font-mono text-xs text-ed-muted">
          <PlayCircle className="h-4 w-4 shrink-0 text-ed-accent" aria-hidden="true" />
          {block.caption}
        </p>
      )}
    </div>
  );
}

function ResultsBlock({ block }: { block: ResultsBlockData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const metrics = block.metrics ?? [];
  const comparisons = block.comparisons ?? [];
  const highlights = block.highlights ?? [];
  const media = block.media ?? [];

  return (
    <>
      <Lightbox
        items={media}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <div className="space-y-6">
        {block.summary && (
          <p className="max-w-3xl text-base leading-relaxed text-ed-muted">{block.summary}</p>
        )}

        {metrics.length > 0 && (
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-ed-line bg-ed-bg2 p-5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ed-muted">
                  {metric.label}
                </dt>
                <dd className="mt-2 font-display text-2xl font-semibold text-ed-fg">
                  {metric.value}
                </dd>
                {metric.detail && <p className="mt-2 text-xs text-ed-muted">{metric.detail}</p>}
              </div>
            ))}
          </dl>
        )}

        {comparisons.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-ed-line bg-ed-bg2">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ed-line font-mono text-[11px] uppercase tracking-[0.15em] text-ed-muted">
                  <th className="px-4 py-3 font-normal">Parâmetro</th>
                  <th className="px-4 py-3 font-normal">Antes</th>
                  <th className="px-4 py-3 font-normal text-ed-accent">Depois</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ed-line">
                {comparisons.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3.5 text-ed-fg">
                      <div>{row.label}</div>
                      {row.note && <p className="mt-0.5 text-xs text-ed-muted">{row.note}</p>}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ed-muted">{row.before}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ed-fg">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {highlights.length > 0 && (
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-ed-line bg-ed-bg2 p-4 text-sm text-ed-muted"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ed-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {media.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {media.map((item, idx) => (
              <figure
                key={`${item.src}-${idx}`}
                className="group overflow-hidden rounded-xl border border-ed-line bg-ed-bg2"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Ampliar imagem: ${item.alt}`}
                  className="block w-full cursor-zoom-in overflow-hidden bg-ed-bg"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </button>
                {(item.caption ?? item.alt) && (
                  <figcaption className="border-t border-ed-line p-4 font-mono text-xs text-ed-muted">
                    {item.caption ?? item.alt}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function ProjectBlockRenderer({ resolved }: { resolved: ResolvedProjectBlock }) {
  const { id, number, title, block } = resolved;

  if (block.type === "custom") {
    const CustomComponent = block.component;
    return (
      <section id={id} className="scroll-mt-24">
        {block.title?.trim() && <SectionHeading number={number} title={title} />}
        <CustomComponent />
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-24">
      <SectionHeading number={number} title={title} />
      {block.type === "overview" && <OverviewBlock block={block} />}
      {block.type === "specs" && <SpecsBlock block={block} />}
      {block.type === "gallery" && <GalleryBlock block={block} />}
      {block.type === "documents" && <DocumentsBlock block={block} />}
      {block.type === "code" && <CodeBlock block={block} />}
      {block.type === "video" && <VideoBlock block={block} />}
      {block.type === "results" && <ResultsBlock block={block} />}
    </section>
  );
}
