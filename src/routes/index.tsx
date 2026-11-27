import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { Brand, Header } from "@/components/home/Header";
import { PcbIllustration } from "@/components/home/PcbIllustration";
import { Toaster } from "@/components/ui/sonner";
import {
  EDUCATION,
  HOME_PROJECTS,
  JOBS,
  METRICS,
  NAV_ITEMS,
  PROJECT_FILTERS,
  SKILLS,
} from "@/data/home";
import { copyEmail, downloadResume, openEmail, openWhatsApp, SOCIAL_LINKS } from "@/utils/contact";

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
  return (
    <section className="border-t border-ed-line bg-ed-bg2">
      <div
        ref={ref}
        data-reveal={state}
        className={`mx-auto grid max-w-6xl divide-y divide-ed-line px-5 transition-[opacity,transform] duration-500 ease-out sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${state === "hidden" ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        {METRICS.map(([a, b]) => (
          <div key={a} className="py-10 sm:px-8 sm:first:pl-0">
            <p className="font-display text-3xl font-semibold text-ed-fg">{a}</p>
            <p className="mt-2 text-sm text-ed-muted">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

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
  const list = HOME_PROJECTS.filter((p) => f === "Todos" || p.cat === f);
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
        {PROJECT_FILTERS.map((x) => (
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
                params={{ slug: featured.slug }}
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
                  params={{ slug: p.slug }}
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

function Skills() {
  const [i, setI] = useState(0);
  const cur = SKILLS[i] ?? SKILLS[0]!;
  return (
    <Section id="competencias" alt>
      <Eyebrow>Competências</Eyebrow>
      <H2>Áreas de atuação</H2>
      <div
        role="tablist"
        aria-label="Categorias de competências"
        className="mt-8 flex flex-wrap gap-2 border-b border-ed-line pb-4 lg:flex-nowrap lg:gap-6 lg:pb-0"
      >
        {SKILLS.map((s, k) => (
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

function Experience() {
  return (
    <Section id="trajetoria">
      <Eyebrow>Trajetória</Eyebrow>
      <H2>Experiência profissional</H2>
      <ol className="mt-12 ml-1 border-l border-ed-line">
        {JOBS.map((j) => (
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
  return (
    <Section alt>
      <Eyebrow>Formação</Eyebrow>
      <H2>Formação e credenciais</H2>
      <div className="mt-10 border-t border-ed-line">
        {EDUCATION.map(([a, b, c]) => (
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
            {NAV_ITEMS.map((n) => <li key={n.href}><a href={n.href} className={linkCls}>{n.label}</a></li>)}
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
