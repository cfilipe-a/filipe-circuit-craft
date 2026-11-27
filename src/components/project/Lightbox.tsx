import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectMediaItem } from "@/data/projects/types";

type LightboxProps = {
  items: readonly ProjectMediaItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const current = index !== null ? items[index] : undefined;

  useEffect(() => {
    if (index === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (items.length <= 1) return;
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, items.length, onClose, onNavigate]);

  if (index === null || !current) return null;

  const captionText = current.caption ?? current.alt;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Imagem ampliada"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ed-bg/95 p-4 backdrop-blur"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg border border-ed-line bg-ed-bg2 text-ed-muted transition hover:border-ed-accent/60 hover:text-ed-accent"
      >
        <X className="h-5 w-5" />
      </button>

      <img
        src={current.src}
        alt={current.alt}
        className="max-h-[78vh] max-w-full rounded-xl border border-ed-line object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="mt-4 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        {items.length > 1 && (
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={() => onNavigate((index - 1 + items.length) % items.length)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ed-line bg-ed-bg2 text-ed-muted transition hover:border-ed-accent/60 hover:text-ed-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <p className="font-mono text-xs text-ed-muted">
          {items.length > 1 && <span className="mr-2 text-ed-accent">{index + 1}/{items.length}</span>}
          {captionText}
        </p>

        {items.length > 1 && (
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={() => onNavigate((index + 1) % items.length)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ed-line bg-ed-bg2 text-ed-muted transition hover:border-ed-accent/60 hover:text-ed-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
