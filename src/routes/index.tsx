import { createFileRoute, Link } from "@tanstack/react-router";
import { SOCIAL_LINKS, openEmail, openWhatsApp, downloadResume } from "@/utils/contact";
import { useState } from "react";
import {
  ArrowRight, Download, Cpu, CircuitBoard, Activity, BarChart3, Menu, X, Mail, Linkedin,
  Github, MessageCircle, ShieldCheck, GraduationCap, Wrench, Code2, ClipboardCheck, ExternalLink, Award,
} from "lucide-react";
import imgEsp32 from "@/assets/proj-esp32.jpg";
import imgBench from "@/assets/proj-bench.jpg";
import imgStm32 from "@/assets/proj-stm32.jpg";
import imgIot from "@/assets/proj-iot.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Filipe Cavalcante — Técnico em Eletrônica | Graduando em Engenharia Elétrica" },
      { name: "description", content: "Portfólio de Filipe Cavalcante: projeto de PCB, firmware C/C++, bancada, instrumentação e telemetria. Registro ativo no CRT-SP / CFT." },
      { property: "og:title", content: "Filipe Cavalcante — Técnico em Eletrônica | Graduando em Engenharia Elétrica" },
      { property: "og:description", content: "Da bancada ao firmware: eletrônica que resolve problemas reais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["Sobre", "#sobre"], ["Projetos", "#projetos"], ["Competências", "#competencias"],
  ["Experiência", "#experiencia"], ["Contato", "#contato"],
] as const;

function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "primary" }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] ${tone === "primary" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground"}`}>
      {children}
    </span>
  );
}

function SectionHead({ tag, title, desc }: { tag: string; title: React.ReactNode; desc?: string }) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">// {tag}</p>
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground">{desc}</p>}
    </div>
  );
}

/* PCB corner trace decoration */
function PcbCorner({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute text-primary/25 ${className}`} width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden>
      <path d="M0 20H60L80 40H160" stroke="currentColor" />
      <path d="M0 50H40L60 70V160" stroke="currentColor" />
      <path d="M20 0V10L30 20" stroke="currentColor" />
      <circle cx="80" cy="40" r="3" fill="currentColor" />
      <circle cx="60" cy="70" r="3" fill="currentColor" />
      <rect x="140" y="36" width="8" height="8" rx="1" stroke="currentColor" />
    </svg>
  );
}

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5" aria-label="Filipe Cavalcante — início">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/40 bg-card font-display text-sm font-bold text-primary">
        FC
        <span className="absolute -right-1 top-1/2 h-px w-2 bg-primary" />
        <span className="absolute -right-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber" />
      </span>
      <span className="hidden font-display text-sm font-semibold sm:block">Filipe Cavalcante</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map(([l, h]) => (
            <a key={h} href={h} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 sm:inline-flex">
            <Download className="h-4 w-4" /> Currículo (PDF)
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-lg border md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background px-5 py-4 md:hidden">
          {nav.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2 text-muted-foreground">{l}</a>
          ))}
          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
            <Download className="h-4 w-4" /> Currículo (PDF)
          </button>
        </nav>
      )}
    </header>
  );
}

const focus = [
  { icon: CircuitBoard, t: "Projeto de PCB", d: "Esquemático, layout e DFM" },
  { icon: Cpu, t: "Firmware C/C++", d: "ESP32 · STM32 · RTOS" },
  { icon: Activity, t: "Bancada & Instrumentação", d: "Diagnóstico, medição, reparo" },
  { icon: BarChart3, t: "Telemetria & Dados", d: "IoT, Python, Power BI" },
];

function Hero() {
  return (
    <section id="sobre" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="line-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_40%,black_35%,transparent_100%)]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-10 bg-primary" /> Engenharia Aplicada &amp; PD&amp;I
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">Filipe Cavalcante</h1>
          <p className="mt-5 text-2xl font-medium leading-snug text-primary sm:text-3xl">Engenharia Eletrônica &amp; Desenvolvimento Tecnológico</p>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">Da bancada ao firmware: eletrônica que resolve problemas reais.</p>
          <p className="mt-8 font-mono text-sm text-muted-foreground">Hardware • Firmware • Software</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projetos" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110">
              Ver projetos <ArrowRight className="h-4 w-4" />
            </a>
            <button type="button" onClick={downloadResume} className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 text-sm font-medium transition hover:border-primary/50">
              <Download className="h-4 w-4" /> Baixar currículo
            </button>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="ml-2 grid h-11 w-11 place-items-center text-foreground transition hover:text-primary"><Linkedin className="h-5 w-5" /></a>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center text-foreground transition hover:text-primary"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Proofs() {
  const items = [
    ["7+", "Anos de Bancada"],
    ["CRT-SP", "Conselho Federal dos Técnicos Industriais\nAtivo"],
    ["Engenharia Elétrica", "Centro Universitário ENIAC (Em andamento)"],
  ];
  return (
    <section className="border-y bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col px-5 sm:flex-row sm:items-start sm:justify-between">
        {items.map(([a, b], i) => (
          <div key={b} className={`py-8 text-center ${i === 0 ? "sm:text-left" : i === 2 ? "sm:text-right" : ""}`}>
            <p className="whitespace-nowrap font-display text-2xl font-semibold text-primary sm:text-3xl">
              {a === "CRT-SP" ? <abbr title="Conselho Regional dos Técnicos Industriais de São Paulo" className="no-underline">{a}</abbr> : a}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const projects = [
  { img: imgEsp32, cat: "Embarcados", t: "Controlador IoT com ESP32", p: "Monitorar cargas remotamente sem acesso físico ao painel.", s: "Placa dedicada com ESP32, medição de corrente e envio MQTT com reconexão automática.", stack: ["ESP32", "C++", "MQTT", "KiCad"] },
  { img: imgStm32, cat: "PCB", t: "Placa de aquisição STM32", p: "Leituras analógicas ruidosas em ambiente industrial.", s: "Layout 4 camadas com plano de terra dedicado, filtragem e ADC com DMA.", stack: ["STM32", "C", "Altium", "4 camadas"] },
  { img: imgBench, cat: "Instrumentação", t: "Bancada de testes automatizada", p: "Inspeção manual lenta e sujeita a erros na validação de placas.", s: "Rotina de teste com instrumentos controlados, registro de medidas e relatório.", stack: ["Python", "SCPI", "Osciloscópio"] },
  { img: imgIot, cat: "Telemetria", t: "Dashboard de telemetria", p: "Dados de sensores dispersos e sem análise histórica.", s: "Pipeline de coleta, banco de séries temporais e painéis em Power BI.", stack: ["Python", "Power BI", "SQL"] },
];

function Projects() {
  return (
    <section id="projetos" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead tag="projetos" title={<>Projetos em <span className="text-gradient">destaque</span></>} desc="Problemas, soluções e ideias de cada projeto!" />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.t} className="card-hover group overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.t} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full border border-primary/30 bg-background/80 px-3 py-1 font-mono text-[11px] text-primary backdrop-blur">{p.cat}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{p.t}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt className="inline font-mono text-xs text-amber">Problema: </dt><dd className="inline text-muted-foreground">{p.p}</dd></div>
                  <div><dt className="inline font-mono text-xs text-primary">Solução: </dt><dd className="inline text-muted-foreground">{p.s}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                <Link to="/projetos/$slug" params={{ slug: "exemplo" }} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                  Ver detalhes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 text-sm transition hover:border-primary/50">
            <Github className="h-4 w-4" /> Ver mais no GitHub
          </button>
        </div>
      </div>
    </section>
  );
}

const skills = [
  { icon: CircuitBoard, t: "Hardware & PCB", items: ["Criação de esquemáticos", "Criação de protótipos", "Layout multicamadas ", "Análise de defeitos"] },
  { icon: Cpu, t: "Firmware & Embarcados", items: ["Microcontroladores", "Microprocessadores", "ESP32 · STM32 · Arduino", "FreeRTOS"] },
  { icon: Activity, t: "Bancada & Instrumentação", items: ["Diagnóstico em nível de componente", "Retrabalho SMD / PTH", "Osciloscópio e analisador lógico", "Calibração"] },
  { icon: ClipboardCheck, t: "Métodos & Qualidade", items: ["Documentação técnica", "Documentação técnica", "RCA (análise de causa raiz) FMEA", "Normas e segurança"] },
  { icon: Code2, t: "Software & Telemetria", items: ["C/C++ embarcado", "Vibe Coding", "SQL", "Power BI"] },
];

function Skills() {
  return (
    <section id="competencias" className="relative border-t bg-card/30 py-24">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHead tag="competências" title="Matriz de competências técnicas" desc="Competência aplicada em projetos reais." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map(({ icon: I, t, items }, i) => (
            <div key={t} className="card-hover rounded-2xl border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{t}</h3>
              <ul className="mt-4 space-y-2">
                {items.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-primary" />{s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const jobs = [
  { r: "Analista Suporte Técnico em Eletrônica", c: "AIWA Brasil", p: "2022 — Atual", i: ["\nAnalise e resolução de defeitos.", "\nMonitoramento e controle de indicadores com métricas KPI para gestão de qualidade"] },
  { r: "Técnico de Manutenção Eletrônica", c: "Tv Service", p: "2019 — 2022", i: ["\nDiagnóstico em nível de componente e Leitura de Datasheet ", "\nRetrabalho SMD/PTH"] },
  { r: "Auxiliar Técnico em Eletrônica", c: "Laboratório de Reparos", p: "2017 — 2019", i: ["\nMontagem, soldagem e testes de placas PTH", "Organização de bancada e controle de instrumentos"] },
];

function Experience() {
  return (
    <section id="experiencia" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead tag="trajetória" title="Experiência profissional" />
        <ol className="relative ml-3 border-l">
          {jobs.map((j) => (
            <li key={j.r} className="relative mb-10 pl-8 last:mb-0">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <div className="card-hover rounded-2xl border bg-card p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold">{j.r}</h3>
                  <span className="font-mono text-xs text-primary">{j.p}</span>
                </div>
                <p className="text-sm text-muted-foreground">{j.c}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {j.i.map((x) => <li key={x} className="flex gap-2"><span className="text-amber">›</span>{x}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="border-t bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead tag="formação" title="Formação e credenciais" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-hover relative overflow-hidden rounded-2xl border bg-card p-7">
            <PcbCorner className="-right-10 -top-10 opacity-60" />
            <Award className="h-7 w-7 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Técnico em Eletrônica</h3>
            <p className="mt-2 text-sm text-muted-foreground">Formação técnica concluída, com registro profissional ativo.</p>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <p className="text-sm">
                Registro ativo no <strong>Conselho Regional dos Técnicos Industriais de São Paulo (CRT-SP / CFT)</strong>
              </p>
            </div>
          </div>
          <div className="card-hover relative overflow-hidden rounded-2xl border bg-card p-7">
            <PcbCorner className="-right-10 -top-10 opacity-60" />
            <GraduationCap className="h-7 w-7 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Bacharelado em Engenharia Elétrica</h3>
            <p className="mt-2 text-sm text-muted-foreground">Centro Universitário ENIAC (graduação em andamento)</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip tone="primary">Em andamento</Chip>
              <Chip>Circuitos</Chip><Chip>Sistemas de Potência</Chip><Chip>Controle</Chip>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const tools = ["KiCad", "Altium Designer", "VS Code", "PlatformIO", "Git", "STM32CubeIDE", "Arduino IDE", "Osciloscópio", "", "Multímetro", "Fonte Banc", "Estação de Retrabalho", "Python", "Power BI"];

function Tools() {
  return (
    <section className="overflow-hidden border-y py-10" aria-label="Ferramentas e equipamentos">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Ferramentas & Equipamentos</p>
      <div className="flex w-max animate-marquee gap-3">
        {[...tools, ...tools].map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 font-mono text-sm text-muted-foreground">
            <Wrench className="h-3.5 w-3.5 text-primary" />{t}
          </span>
        ))}
      </div>
    </section>
  );
}

const contacts: { icon: typeof Mail; t: string; d: string; href?: string; onClick?: () => void }[] = [
  { icon: Mail, t: "E-mail", d: "Clique para enviar um e-mail", onClick: openEmail },
  { icon: Linkedin, t: "LinkedIn", d: "Conectar no LinkedIn", href: SOCIAL_LINKS.linkedin },
  { icon: Github, t: "GitHub", d: "Acessar repositórios", href: SOCIAL_LINKS.github },
  { icon: MessageCircle, t: "WhatsApp", d: "Iniciar conversa no WhatsApp", onClick: openWhatsApp },
];

function Contact() {
  return (
    <section id="contato" className="relative py-24">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHead tag="contato" title={<>Vamos conversar sobre seu <span className="text-gradient">próximo projeto</span></>} desc="Busco oportunidades em P&D, hardware e sistemas embarcados." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ icon: I, t, d, href, onClick }) => {
            const cls = "card-hover group block w-full cursor-pointer rounded-2xl border bg-card p-6 text-left";
            const inner = (<>
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></span>
                <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </div>
              <p className="mt-5 font-semibold">{t}</p>
              <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{d}</p>
            </>);
            return href ? (
              <a key={t} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <button key={t} type="button" onClick={onClick} className={cls}>{inner}</button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3"><Logo /></div>
        <p className="text-xs">
          Técnico em Eletrônica com registro ativo no Conselho Regional dos Técnicos Industriais de São Paulo (CRT-SP / CFT).
        </p>
        <p className="font-mono text-xs">© {new Date().getFullYear()} Filipe Cavalcante</p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Proofs />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Tools />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
