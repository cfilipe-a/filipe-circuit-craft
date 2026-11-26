import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Github, Linkedin, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { openEmail, openWhatsApp, downloadResume, copyEmail, SOCIAL_LINKS } from "@/utils/contact";
import imgEsp32 from "@/assets/proj-esp32.jpg";
import imgStm32 from "@/assets/proj-stm32.jpg";
import imgIot from "@/assets/proj-iot.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "cfilipe. — Filipe Cavalcante | Hardware & Confiabilidade" },
      { name: "description", content: "Engenharia eletrônica, sistemas embarcados e análise de confiabilidade do componente ao dado." },
      { property: "og:title", content: "cfilipe. — Filipe Cavalcante" },
      { property: "og:description", content: "Engenharia eletrônica, sistemas embarcados e análise de confiabilidade do componente ao dado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const nav = [
  { href: "#projetos", label: "Projetos" },
  { href: "#competencias", label: "Competências" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#contato", label: "Contato" },
];

const observedSections = ["inicio", "projetos", "competencias", "trajetoria", "contato"] as const;
type SectionId = (typeof observedSections)[number];

const sectionProgress: Record<SectionId, number> = {
  inicio: 0.2,
  projetos: 0.4,
  competencias: 0.6,
  trajetoria: 0.8,
  contato: 1,
};

function resolveActiveSection(): SectionId {
  const y = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (y < 80) return "inicio";
  if (maxScroll > 0 && y >= maxScroll - 40) return "contato";

  const anchorY = Math.max(120, Math.min(window.innerHeight * 0.35, 260));
  let current: SectionId = "inicio";

  for (const id of observedSections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= anchorY) {
      current = id;
    }
  }

  return current;
}

function useSectionReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, state };
}

function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono text-lg font-bold tracking-tight text-ed-fg ${className}`}>
      cfilipe<span className="text-ed-accent">.</span>
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-[0.45rem] h-[2px] w-4 shrink-0 bg-ed-accent" />
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ed-muted">{children}</span>
    </div>
  );
}

function Section({
  id,
  alt,
  bgOverlay,
  children,
}: {
  id?: string;
  alt?: boolean;
  bgOverlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { ref, state } = useSectionReveal();
  return (
    <section id={id} className={`relative overflow-hidden scroll-mt-16 border-t border-ed-line py-20 sm:py-24 ${alt ? "bg-ed-bg2" : "bg-ed-bg"}`}>
      {bgOverlay}
      <div
        ref={ref}
        data-reveal={state}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-[opacity,transform] duration-500 ease-out ${state === "hidden" ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        {children}
      </div>
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ed-fg sm:text-4xl">{children}</h2>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<SectionId>("inicio");
  const headerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const progress = sectionProgress[activeId];

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
    window.addEventListener("resize", scheduleSync, { passive: true });
    window.addEventListener("hashchange", scheduleSync);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      const elements = observedSections
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

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
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
        <div
          data-testid="scroll-progress"
          className="h-full origin-left bg-ed-accent/85 transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-ed-line bg-ed-bg/85 backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#inicio" aria-label="Início" className="rounded-sm transition hover:opacity-90">
            <Brand />
          </a>
          <nav aria-label="Navegação principal" className="hidden gap-8 md:flex">
            {nav.map((n) => {
              const isActive = activeId === n.href.slice(1);
              return (
                <a
                  key={n.href}
                  href={n.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-1 text-sm transition-colors duration-200 ${isActive ? "text-ed-fg" : "text-ed-muted hover:text-ed-fg"}`}
                >
                  {n.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-ed-accent transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}
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
              {nav.map((n) => {
                const isActive = activeId === n.href.slice(1);
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block border-l-2 py-3 pl-3 text-sm transition-colors duration-150 ${isActive ? "border-ed-accent text-ed-fg" : "border-transparent text-ed-muted hover:text-ed-fg"}`}
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

function PcbIllustration() {
  const pinsH = [0, 1, 2, 3, 4, 5];
  const pinsV = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 400 420" className="h-auto w-full max-w-md" role="img" aria-label="Ilustração técnica de placa de circuito">
      <defs>
        <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#27272a" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="fade"><stop offset="0.4" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
        <mask id="m"><rect width="400" height="420" fill="url(#fade)" /></mask>
      </defs>
      <rect width="400" height="420" fill="url(#g)" mask="url(#m)" opacity="0.6" />
      {/* resistor */}
      <g stroke="#52525b" strokeWidth="2" fill="none">
        <circle cx="70" cy="70" r="3" fill="#09090b" />
        <path d="M73 70H120l6-12 10 24 10-24 10 24 6-12h55" />
        <circle cx="230" cy="70" r="3" fill="#52525b" />
      </g>
      {/* board */}
      <rect x="110" y="120" width="220" height="160" rx="14" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
      {[[126, 136], [314, 136], [126, 264], [314, 264]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="none" stroke="#71717a" strokeWidth="1.5" />
      ))}
      {/* traces */}
      <g stroke="#3f3f46" strokeWidth="1.2" fill="none">
        <path d="M130 170H165M130 190H155l12 12M130 215H190" />
        <path d="M195 130v25M210 130v25" />
        <path d="M290 195v40M235 245v20h40" />
      </g>
      {/* QFP */}
      {pinsH.map((i) => (
        <g key={`h${i}`} fill="#52525b">
          <rect x={185 + i * 9} y="148" width="3" height="8" />
          <rect x={185 + i * 9} y="232" width="3" height="8" />
        </g>
      ))}
      {pinsV.map((i) => (
        <g key={`v${i}`} fill="#52525b">
          <rect x="167" y={168 + i * 11} width="8" height="3" />
          <rect x="245" y={168 + i * 11} width="8" height="3" />
        </g>
      ))}
      <rect x="176" y="157" width="68" height="74" rx="6" fill="#09090b" stroke="#3f3f46" />
      <circle cx="185" cy="166" r="2" fill="#52525b" />
      {/* amber smd */}
      <path d="M253 177H280" stroke="#a16207" strokeWidth="1.2" />
      <rect x="280" y="170" width="24" height="12" rx="2" fill="#f59e0b" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={180 + i * 10} cy="258" r="2" fill="#52525b" />)}
      <circle cx="312" cy="262" r="5" fill="#f59e0b" />
      {/* capacitor */}
      <g stroke="#52525b" strokeWidth="2" fill="none">
        <circle cx="70" cy="340" r="3" fill="#09090b" />
        <path d="M73 340H143M157 340H230M143 324v32M157 324v32" />
        <circle cx="230" cy="340" r="3" fill="#52525b" />
      </g>
    </svg>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden scroll-mt-16 bg-ed-bg pt-16">
      <div
        aria-hidden="true"
        className="line-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_42%,black_30%,transparent_95%)]"
      />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div className="flex justify-center md:order-2"><PcbIllustration /></div>
        <div className="md:order-1">
          <Eyebrow>Engenharia Elétrica • Hardware &amp; Confiabilidade</Eyebrow>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-ed-fg sm:text-6xl">Filipe Cavalcante</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ed-muted">
            Engenharia eletrônica, sistemas embarcados e análise de confiabilidade do componente ao dado.
          </p>
          <a
            href="#contato"
            className="mt-10 inline-flex w-full items-center justify-center rounded-lg bg-ed-accent px-6 py-3.5 font-semibold text-ed-ink transition duration-200 hover:bg-ed-accent-hover active:scale-[0.98] sm:w-auto"
          >
            Entrar em contato
          </a>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const { ref, state } = useSectionReveal();
  const items = [
    ["7+", "Anos de bancada"],
    ["CRT-SP", "Conselho Regional dos Técnicos Industriais de São Paulo · Ativo"],
    ["Eng. Elétrica", "Centro Universitário ENIAC (em andamento)"],
  ];
  return (
    <section className="border-t border-ed-line bg-ed-bg2">
      <div
        ref={ref}
        data-reveal={state}
        className={`mx-auto grid max-w-6xl divide-y divide-ed-line px-5 transition-[opacity,transform] duration-500 ease-out sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${state === "hidden" ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        {items.map(([a, b]) => (
          <div key={a} className="py-10 sm:px-8 sm:first:pl-0">
            <p className="font-display text-3xl font-semibold text-ed-fg">{a}</p>
            <p className="mt-2 text-sm text-ed-muted">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type Stage = "Lab / Protótipo" | "Validado em Bancada" | "Em Produção";
type ProjectItem = { cat: string; t: string; stage: Stage; d: string; tags: string[]; img?: string | undefined };

const projects: ProjectItem[] = [
  { cat: "Embarcados", t: "Controlador IoT com ESP32", stage: "Validado em Bancada", d: "Placa dedicada com ESP32, medição de corrente e envio MQTT com reconexão automática para monitorar cargas remotamente.", tags: ["ESP32", "C++", "MQTT"], img: imgEsp32 },
  { cat: "Hardware & PCB", t: "Placa de aquisição STM32", stage: "Lab / Protótipo", d: "Layout 4 camadas com plano de terra dedicado, filtragem e ADC com DMA para leituras em ambiente industrial ruidoso.", tags: ["STM32", "Altium", "4 camadas"], img: imgStm32 },
  { cat: "Dados", t: "Dashboard de telemetria", stage: "Em Produção", d: "Pipeline de coleta, banco de séries temporais e painéis em Power BI para análise histórica de sensores.", tags: ["Python", "Power BI", "SQL"], img: imgIot },
];
const filters = ["Todos", "Hardware & PCB", "Embarcados", "Dados"];

function ProjectMedia({ img, title, cat }: { img?: string | undefined; title: string; cat: string }) {
  if (img) {
    return (
      <img
        src={img}
        alt={title}
        width={1024}
        height={768}
        loading="lazy"
        className="project-img h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-ed-bg p-4">
      <div className="text-center font-mono text-xs text-ed-muted">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-ed-accent">{cat}</span>
        <span className="mt-1 block">{title}</span>
      </div>
    </div>
  );
}

function Projects() {
  const [f, setF] = useState("Todos");
  const list = projects.filter((p) => f === "Todos" || p.cat === f);
  const [featured, ...secondary] = list;

  return (
    <Section
      id="projetos"
      bgOverlay={
        <div
          aria-hidden="true"
          className="line-grid pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black_15%,transparent_92%)]"
        />
      }
    >
      <Eyebrow>Projetos</Eyebrow>
      <H2>Projetos em destaque</H2>
      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((x) => (
          <button
            key={x}
            type="button"
            aria-pressed={f === x}
            onClick={() => setF(x)}
            className={`shrink-0 rounded-full border bg-ed-bg px-4 py-1.5 font-mono text-xs transition duration-200 active:scale-[0.98] ${f === x ? "border-ed-accent text-ed-accent" : "border-ed-line-strong text-ed-muted hover:border-ed-muted hover:text-ed-fg"}`}
          >
            {x}
          </button>
        ))}
      </div>

      {featured && (
        <article className="project-card group relative mt-8 overflow-hidden rounded-xl border border-ed-line bg-ed-bg2 transition duration-200 hover:-translate-y-0.5 hover:border-ed-line-strong focus-within:ring-2 focus-within:ring-ed-accent">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="aspect-[16/10] overflow-hidden bg-ed-bg md:aspect-auto md:min-h-[280px]">
              <ProjectMedia img={featured.img} title={featured.t} cat={featured.cat} />
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ed-accent">{featured.cat}</span>
                  <span className="rounded border border-ed-line-strong px-2 py-0.5 font-mono text-[11px] text-ed-muted">{featured.stage}</span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-ed-fg sm:text-[1.65rem]">{featured.t}</h3>
                <p className="mt-3 leading-relaxed text-ed-muted">{featured.d}</p>
                <div className="mt-5 flex flex-wrap gap-4 font-mono text-xs text-ed-muted/80">
                  {featured.tags.map((t) => <span key={t}>#{t}</span>)}
                </div>
              </div>
              <Link
                to="/projetos/$slug"
                params={{ slug: "exemplo" }}
                className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-ed-accent transition group-hover:gap-3 after:absolute after:inset-0"
              >
                Ver detalhes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {secondary.length > 0 && (
        <ul className="mt-6 divide-y divide-ed-line border-y border-ed-line">
          {secondary.map((p) => (
            <li
              key={p.t}
              className="project-card group relative -mx-3 rounded-lg bg-ed-bg/90 px-3 py-6 transition duration-200 hover:bg-ed-bg2/90 focus-within:ring-2 focus-within:ring-ed-accent"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-ed-line bg-ed-bg sm:h-24 sm:w-36 sm:aspect-auto">
                    <ProjectMedia img={p.img} title={p.t} cat={p.cat} />
                  </div>
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-ed-fg">{p.t}</h3>
                      <span className="rounded border border-ed-line-strong px-2 py-0.5 font-mono text-[11px] text-ed-muted">{p.stage}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-ed-muted">{p.d}</p>
                    <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs text-ed-muted/80">
                      {p.tags.map((t) => <span key={t}>#{t}</span>)}
                    </div>
                  </div>
                </div>
                <Link
                  to="/projetos/$slug"
                  params={{ slug: "exemplo" }}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ed-accent transition group-hover:gap-3 after:absolute after:inset-0"
                >
                  Ver detalhes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-sm text-ed-muted transition hover:text-ed-fg"
      >
        Ver mais projetos <ArrowRight className="h-4 w-4" />
      </a>
    </Section>
  );
}

const skills = [
  { t: "Hardware & PCB", items: ["Criação de esquemáticos", "Criação de protótipos", "Layout multicamadas", "Análise de defeitos"] },
  { t: "Firmware & Embarcados", items: ["Microcontroladores", "Microprocessadores", "ESP32 · STM32 · Arduino", "FreeRTOS"] },
  { t: "Bancada & Instrumentação", items: ["Diagnóstico em nível de componente", "Retrabalho SMD / PTH", "Osciloscópio e analisador lógico", "Calibração"] },
  { t: "Métodos & Qualidade", items: ["Documentação técnica", "RCA (análise de causa raiz) FMEA", "Normas e segurança"] },
  { t: "Software & Telemetria", items: ["C/C++ embarcado", "Vibe Coding", "SQL", "Power BI"] },
];

function Skills() {
  const [i, setI] = useState(0);
  const cur = skills[i] ?? skills[0]!;
  return (
    <Section id="competencias" alt>
      <Eyebrow>Competências</Eyebrow>
      <H2>Áreas de atuação</H2>
      <div
        role="tablist"
        aria-label="Categorias de competências"
        className="mt-8 flex flex-wrap gap-2 border-b border-ed-line pb-4 lg:flex-nowrap lg:gap-6 lg:pb-0"
      >
        {skills.map((s, k) => (
          <button
            key={s.t}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`rounded-md border px-3 py-2 text-left text-xs leading-snug transition duration-200 active:scale-[0.98] sm:text-sm lg:-mb-px lg:shrink-0 lg:rounded-none lg:border-0 lg:border-b-2 lg:bg-transparent lg:px-0 lg:pb-3 lg:pt-0 ${
              k === i
                ? "border-ed-accent bg-ed-accent/10 text-ed-fg lg:border-ed-accent"
                : "border-ed-line-strong text-ed-muted hover:border-ed-muted hover:text-ed-fg lg:border-transparent"
            }`}
          >
            {s.t}
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-8 grid gap-x-12 sm:grid-cols-2">
        {cur.items.map((x) => (
          <li key={x} className="flex items-center gap-3 border-b border-ed-line py-4 text-ed-fg">
            <span className="h-1 w-1 bg-ed-accent" />{x}
          </li>
        ))}
      </ul>
    </Section>
  );
}

const jobs = [
  { r: "Analista Suporte Técnico em Eletrônica", c: "AIWA Brasil", p: "2022 — Atual", i: ["Análise e resolução de defeitos.", "Monitoramento e controle de indicadores com métricas KPI para gestão de qualidade."] },
  { r: "Técnico de Manutenção Eletrônica", c: "Tv Service", p: "2019 — 2022", i: ["Diagnóstico em nível de componente e leitura de datasheet.", "Retrabalho SMD/PTH."] },
  { r: "Auxiliar Técnico em Eletrônica", c: "Laboratório de Reparos", p: "2017 — 2019", i: ["Montagem, soldagem e testes de placas PTH.", "Organização de bancada e controle de instrumentos."] },
];

function Experience() {
  return (
    <Section id="trajetoria">
      <Eyebrow>Trajetória</Eyebrow>
      <H2>Experiência profissional</H2>
      <ol className="mt-12 ml-1 border-l border-ed-line">
        {jobs.map((j) => (
          <li key={j.r} className="relative pb-12 pl-8 last:pb-0">
            <span className="absolute -left-[4px] top-2 h-[7px] w-[7px] bg-ed-accent" />
            <p className="font-mono text-xs text-ed-muted">{j.p}</p>
            <h3 className="mt-2 text-lg font-semibold text-ed-fg">{j.r}</h3>
            <p className="text-sm text-ed-muted">{j.c}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-ed-muted">
              {j.i.map((x) => <li key={x}>— {x}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Education() {
  const rows = [
    ["Conselho Regional dos Técnicos Industriais de São Paulo (CRT-SP / CFT)", "Técnico em Eletrônica — registro profissional", "Ativo"],
    ["Centro Universitário ENIAC", "Bacharelado em Engenharia Elétrica", "Em andamento"],
    ["Formação Técnica em Eletrônica", "Curso Técnico em Eletrônica", "Concluído"],
  ];
  return (
    <Section alt>
      <Eyebrow>Formação</Eyebrow>
      <H2>Formação e credenciais</H2>
      <div className="mt-10 border-t border-ed-line">
        {rows.map(([a, b, c]) => (
          <div key={a} className="grid gap-1.5 border-b border-ed-line py-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_8.5rem] sm:items-start sm:gap-8">
            <p className="font-medium text-ed-fg">{a}</p>
            <p className="text-ed-muted">{b}</p>
            <p className="font-mono text-xs text-ed-accent sm:pt-1 sm:text-right sm:whitespace-nowrap">{c}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

async function handleEmail() {
  const ok = await copyEmail();
  if (ok) toast("E-mail copiado! Abrindo seu aplicativo de e-mail...");
  openEmail();
}

function Contact() {
  return (
    <Section id="contato">
      <Eyebrow>Contato</Eyebrow>
      <H2>Vamos conversar sobre um projeto ou oportunidade?</H2>
      <p className="mt-4 max-w-xl text-ed-muted">
        Respondo rápido pelo WhatsApp ou e-mail. Conte um pouco sobre o desafio e seguimos a partir daí.
      </p>
      <div className="mt-10 flex max-w-md flex-col gap-3">
        <button
          type="button"
          onClick={openWhatsApp}
          className="rounded-lg bg-ed-accent px-6 py-3.5 font-semibold text-ed-ink transition duration-200 hover:bg-ed-accent-hover active:scale-[0.98]"
        >
          Falar no WhatsApp
        </button>
        <button
          type="button"
          onClick={handleEmail}
          className="rounded-lg border border-ed-line-strong px-6 py-3.5 font-medium text-ed-fg transition duration-200 hover:border-ed-muted active:scale-[0.98]"
        >
          Enviar e-mail
        </button>
      </div>
      <div className="mt-6 flex max-w-md flex-wrap items-center gap-x-6 gap-y-3 border-t border-ed-line pt-6 text-sm text-ed-muted">
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-ed-fg"
        >
          <Github className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>GitHub</span>
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-ed-fg"
        >
          <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
        <button
          type="button"
          onClick={downloadResume}
          className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-ed-fg active:scale-[0.98]"
        >
          <Download className="h-4 w-4 shrink-0 text-ed-accent" aria-hidden="true" />
          <span>Baixar currículo (PDF)</span>
        </button>
      </div>
    </Section>
  );
}

function FootCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Eyebrow>{title}</Eyebrow>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
const linkCls = "text-ed-muted transition hover:text-ed-fg";

function Footer() {
  return (
    <footer className="border-t border-ed-line bg-ed-bg2">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <Brand className="text-xl" />
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          <FootCol title="Navegação">
            <li><a href="#inicio" className={linkCls}>Início</a></li>
            {nav.map((n) => <li key={n.href}><a href={n.href} className={linkCls}>{n.label}</a></li>)}
          </FootCol>
          <FootCol title="Links & Currículo">
            <li><button type="button" onClick={downloadResume} className={linkCls}>Baixar currículo (PDF)</button></li>
            <li><a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>LinkedIn</a></li>
            <li><a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={linkCls}>GitHub</a></li>
          </FootCol>
          <FootCol title="Contato">
            <li><button type="button" onClick={openWhatsApp} className={linkCls}>WhatsApp</button></li>
            <li><button type="button" onClick={handleEmail} className={linkCls}>E-mail</button></li>
          </FootCol>
        </div>
        <p className="mt-14 border-t border-ed-line pt-6 text-xs text-ed-muted">© 2026 Filipe Cavalcante. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen scroll-smooth bg-ed-bg font-sans text-ed-fg">
      <Header />
      <main>
        <Hero />
        <Metrics />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
