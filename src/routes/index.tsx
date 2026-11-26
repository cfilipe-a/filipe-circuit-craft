import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { openEmail, openWhatsApp, downloadResume, copyEmail, SOCIAL_LINKS } from "@/utils/contact";

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

function Section({ id, alt, children }: { id?: string; alt?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-16 border-t border-ed-line py-20 sm:py-24 ${alt ? "bg-ed-bg2" : "bg-ed-bg"}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ed-fg sm:text-4xl">{children}</h2>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ed-line bg-ed-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#inicio" aria-label="Início"><Brand /></a>
        <nav className="hidden gap-8 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-ed-muted transition hover:text-ed-fg">{n.label}</a>
          ))}
        </nav>
        <button className="text-ed-fg md:hidden" aria-label="Abrir menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ed-line bg-ed-bg px-5 py-4 md:hidden">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-ed-muted hover:text-ed-fg">{n.label}</a>
          ))}
        </nav>
      )}
    </header>
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
    <section id="inicio" className="bg-ed-bg pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div className="flex justify-center md:order-2"><PcbIllustration /></div>
        <div className="md:order-1">
          <Eyebrow>Engenharia Elétrica • Hardware &amp; Confiabilidade</Eyebrow>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-ed-fg sm:text-6xl">Filipe Cavalcante</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ed-muted">
            Engenharia eletrônica, sistemas embarcados e análise de confiabilidade do componente ao dado.
          </p>
          <a href="#contato" className="mt-10 inline-flex w-full items-center justify-center rounded-lg bg-ed-accent px-6 py-3.5 font-semibold text-ed-ink transition hover:bg-ed-accent-hover sm:w-auto">
            Entrar em contato
          </a>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const items = [
    ["7+", "Anos de bancada"],
    ["CRT-SP", "Conselho Federal dos Técnicos Industriais · Ativo"],
    ["Eng. Elétrica", "Centro Universitário ENIAC (em andamento)"],
  ];
  return (
    <section className="border-t border-ed-line bg-ed-bg2">
      <div className="mx-auto grid max-w-6xl divide-y divide-ed-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
const projects: { cat: string; t: string; stage: Stage; d: string; tags: string[] }[] = [
  { cat: "Embarcados", t: "Controlador IoT com ESP32", stage: "Validado em Bancada", d: "Placa dedicada com ESP32, medição de corrente e envio MQTT com reconexão automática para monitorar cargas remotamente.", tags: ["ESP32", "C++", "MQTT"] },
  { cat: "Hardware & PCB", t: "Placa de aquisição STM32", stage: "Lab / Protótipo", d: "Layout 4 camadas com plano de terra dedicado, filtragem e ADC com DMA para leituras em ambiente industrial ruidoso.", tags: ["STM32", "Altium", "4 camadas"] },
  { cat: "Dados", t: "Dashboard de telemetria", stage: "Em Produção", d: "Pipeline de coleta, banco de séries temporais e painéis em Power BI para análise histórica de sensores.", tags: ["Python", "Power BI", "SQL"] },
];
const filters = ["Todos", "Hardware & PCB", "Embarcados", "Dados"];

function Projects() {
  const [f, setF] = useState("Todos");
  const list = projects.filter((p) => f === "Todos" || p.cat === f);
  return (
    <Section id="projetos">
      <Eyebrow>Projetos</Eyebrow>
      <H2>Projetos em destaque</H2>
      <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-none">
        {filters.map((x) => (
          <button key={x} onClick={() => setF(x)} className={`shrink-0 rounded-full border px-4 py-1.5 font-mono text-xs transition ${f === x ? "border-ed-accent text-ed-accent" : "border-ed-line-strong text-ed-muted hover:text-ed-fg"}`}>
            {x}
          </button>
        ))}
      </div>
      <ul className="mt-6 border-t border-ed-line">
        {list.map((p) => (
          <li key={p.t} className="group border-b border-ed-line py-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-ed-fg">{p.t}</h3>
                  <span className="rounded border border-ed-line-strong px-2 py-0.5 font-mono text-[11px] text-ed-muted">{p.stage}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-ed-muted">{p.d}</p>
                <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-ed-muted/80">
                  {p.tags.map((t) => <span key={t}>#{t}</span>)}
                </div>
              </div>
              <Link to="/projetos/$slug" params={{ slug: "exemplo" }} className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ed-accent transition group-hover:gap-3">
                Ver detalhes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-ed-muted hover:text-ed-fg">
        Ver todos os projetos no GitHub <ArrowRight className="h-4 w-4" />
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
      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-ed-line scrollbar-none">
        {skills.map((s, k) => (
          <button key={s.t} onClick={() => setI(k)} className={`-mb-px shrink-0 border-b-2 pb-3 text-sm transition ${k === i ? "border-ed-accent text-ed-fg" : "border-transparent text-ed-muted hover:text-ed-fg"}`}>
            {s.t}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
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
  ];
  return (
    <Section alt>
      <Eyebrow>Formação</Eyebrow>
      <H2>Formação e credenciais</H2>
      <div className="mt-10 border-t border-ed-line">
        {rows.map(([a, b, c]) => (
          <div key={a} className="grid gap-2 border-b border-ed-line py-6 sm:grid-cols-[1fr_1fr_auto] sm:gap-8">
            <p className="font-medium text-ed-fg">{a}</p>
            <p className="text-ed-muted">{b}</p>
            <p className="font-mono text-xs text-ed-accent sm:pt-1">{c}</p>
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
        <button onClick={openWhatsApp} className="rounded-lg bg-ed-accent px-6 py-3.5 font-semibold text-ed-ink transition hover:bg-ed-accent-hover">
          Falar no WhatsApp
        </button>
        <button onClick={handleEmail} className="rounded-lg border border-ed-line-strong px-6 py-3.5 font-medium text-ed-fg transition hover:border-ed-muted">
          Enviar e-mail
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
            <li><button onClick={downloadResume} className={linkCls}>Baixar currículo (PDF)</button></li>
            <li><a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>LinkedIn</a></li>
            <li><a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={linkCls}>GitHub</a></li>
          </FootCol>
          <FootCol title="Contato">
            <li><button onClick={openWhatsApp} className={linkCls}>WhatsApp</button></li>
            <li><button onClick={handleEmail} className={linkCls}>E-mail</button></li>
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
