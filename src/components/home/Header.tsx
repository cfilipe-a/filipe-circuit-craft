import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, OBSERVED_SECTIONS, SECTION_PROGRESS, type SectionId } from "@/data/home";

function resolveActiveSection(): SectionId {
  const y = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (y < 80) return "inicio";
  if (maxScroll > 0 && y >= maxScroll - 24) return "contato";

  const anchorY = Math.max(120, Math.min(window.innerHeight * 0.35, 260));
  let current: SectionId = "inicio";

  for (const id of OBSERVED_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= anchorY) {
      current = id;
    }
  }

  return current;
}

function computeSectionProgressRatio(
  targetId: SectionId,
  desktopNav: HTMLElement | null,
  targetEl: HTMLAnchorElement | null | undefined,
  trackEl: HTMLDivElement | null,
): number {
  const fallback = SECTION_PROGRESS[targetId];
  if (!desktopNav || !targetEl || !trackEl) return fallback;

  const desktopNavRect = desktopNav.getBoundingClientRect();
  if (desktopNavRect.width <= 0) return fallback;

  const targetRect = targetEl.getBoundingClientRect();
  const trackRect = trackEl.getBoundingClientRect();
  if (targetRect.width <= 0 || trackRect.width <= 0) return fallback;

  return Math.min(1, Math.max(0, (targetRect.right - trackRect.left) / trackRect.width));
}

export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono text-lg font-bold tracking-tight text-ed-fg ${className}`}>
      cfilipe<span className="text-ed-accent">.</span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<SectionId>("inicio");
  const [progress, setProgress] = useState<number>(SECTION_PROGRESS.inicio);
  const activeIdRef = useRef<SectionId>(activeId);
  activeIdRef.current = activeId;

  const headerRef = useRef<HTMLElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const navItemRefs = useRef<Partial<Record<SectionId, HTMLAnchorElement | null>>>({});
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const next = computeSectionProgressRatio(
      activeId,
      desktopNavRef.current,
      navItemRefs.current[activeId],
      progressTrackRef.current,
    );
    setProgress((prev) => (Math.abs(prev - next) < 0.0005 ? prev : next));
  }, [activeId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let rafId = 0;

    const updateMeasure = () => {
      rafId = 0;
      if (cancelled) return;
      const id = activeIdRef.current;
      const next = computeSectionProgressRatio(
        id,
        desktopNavRef.current,
        navItemRefs.current[id],
        progressTrackRef.current,
      );
      setProgress((prev) => (Math.abs(prev - next) < 0.0005 ? prev : next));
    };

    const scheduleMeasure = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateMeasure);
    };

    window.addEventListener("resize", scheduleMeasure, { passive: true });

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      if (headerRef.current) resizeObserver.observe(headerRef.current);
      if (desktopNavRef.current) resizeObserver.observe(desktopNavRef.current);
      if (progressTrackRef.current) resizeObserver.observe(progressTrackRef.current);
    }

    document.fonts?.ready.then(() => {
      if (!cancelled) scheduleMeasure();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", scheduleMeasure);
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId = 0;

    const syncActiveSection = () => {
      rafId = 0;
      setActiveId(resolveActiveSection());
    };

    const scheduleSync = () => {
      if (!rafId) rafId = window.requestAnimationFrame(syncActiveSection);
    };

    syncActiveSection();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("scrollend", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    window.addEventListener("hashchange", scheduleSync);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      const elements = OBSERVED_SECTIONS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => el !== null,
      );

      if (elements.length > 0) {
        observer = new IntersectionObserver(scheduleSync, {
          rootMargin: "-25% 0px -55% 0px",
          threshold: [0, 0.1],
        });
        for (const el of elements) observer.observe(el);
      }
    }

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("scrollend", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("hashchange", scheduleSync);
      if (rafId) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      <div
        ref={progressTrackRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      >
        <div
          data-testid="scroll-progress"
          data-section={activeId}
          className="h-full origin-left bg-ed-accent/85 transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-ed-line bg-ed-bg/85 backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a
            ref={(el) => {
              navItemRefs.current.inicio = el;
            }}
            href="#inicio"
            aria-label="Início"
            className="rounded-sm transition hover:opacity-90"
          >
            <Brand />
          </a>
          <nav ref={desktopNavRef} aria-label="Navegação principal" className="hidden gap-8 md:flex">
            {NAV_ITEMS.map((n) => {
              const sectionId = n.href.slice(1) as SectionId;
              const isActive = activeId === sectionId;
              return (
                <a
                  key={n.href}
                  ref={(el) => {
                    navItemRefs.current[sectionId] = el;
                  }}
                  href={n.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-1 text-sm transition-colors duration-200 ease-out ${isActive ? "text-ed-fg" : "text-ed-muted hover:text-ed-fg"}`}
                >
                  {n.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-ed-accent transition-opacity duration-200 ease-out ${isActive ? "opacity-100" : "opacity-0"}`}
                  />
                </a>
              );
            })}
          </nav>
          <button
            ref={menuBtnRef}
            type="button"
            className="rounded-md p-1.5 text-ed-fg transition hover:bg-ed-bg2 active:scale-95 md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <div
          id="mobile-nav"
          aria-hidden={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out md:hidden ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
        >
          <nav aria-label="Navegação mobile" className="overflow-hidden border-t border-ed-line bg-ed-bg px-5">
            <div className="py-3">
              {NAV_ITEMS.map((n) => {
                const isActive = activeId === n.href.slice(1);
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block border-l-2 py-3 pl-3 text-sm transition-colors duration-200 ease-out ${isActive ? "border-ed-accent text-ed-fg" : "border-transparent text-ed-muted hover:text-ed-fg"}`}
                  >
                    {n.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
