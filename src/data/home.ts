export const NAV_ITEMS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#competencias", label: "Competências" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#contato", label: "Contato" },
] as const;

export const OBSERVED_SECTIONS = [
  "inicio",
  "projetos",
  "competencias",
  "trajetoria",
  "contato",
] as const;

export type SectionId = (typeof OBSERVED_SECTIONS)[number];

export const SECTION_PROGRESS: Record<SectionId, number> = {
  inicio: 0.2,
  projetos: 0.4,
  competencias: 0.6,
  trajetoria: 0.8,
  contato: 1,
};

export const METRICS = [
  ["7+", "Anos de bancada"],
  ["CRT-SP", "Conselho Regional dos Técnicos Industriais de São Paulo · Ativo"],
  ["Eng. Elétrica", "Centro Universitário ENIAC (em andamento)"],
] as const;

export const PROJECT_FILTERS = ["Todos", "Hardware & PCB", "Embarcados", "Dados"] as const;

export const SKILLS = [
  {
    t: "Hardware & PCB",
    items: [
      "Criação de esquemáticos",
      "Criação de protótipos",
      "Layout multicamadas",
      "Análise de defeitos",
    ],
  },
  {
    t: "Firmware & Embarcados",
    items: [
      "Microcontroladores",
      "Microprocessadores",
      "ESP32 · STM32 · Arduino",
      "FreeRTOS",
    ],
  },
  {
    t: "Bancada & Instrumentação",
    items: [
      "Diagnóstico em nível de componente",
      "Retrabalho SMD / PTH",
      "Osciloscópio e analisador lógico",
      "Calibração",
    ],
  },
  {
    t: "Métodos & Qualidade",
    items: [
      "Documentação técnica",
      "RCA (análise de causa raiz) FMEA",
      "Normas e segurança",
    ],
  },
  {
    t: "Software & Telemetria",
    items: ["C/C++ embarcado", "Vibe Coding", "SQL", "Power BI"],
  },
] as const;

export const JOBS = [
  {
    r: "Analista Suporte Técnico em Eletrônica",
    c: "AIWA Brasil",
    p: "2022 — Atual",
    i: [
      "Análise e resolução de defeitos.",
      "Monitoramento e controle de indicadores com métricas KPI para gestão de qualidade.",
    ],
  },
  {
    r: "Técnico de Manutenção Eletrônica",
    c: "Tv Service",
    p: "2019 — 2022",
    i: [
      "Diagnóstico em nível de componente e leitura de datasheet.",
      "Retrabalho SMD/PTH.",
    ],
  },
  {
    r: "Auxiliar Técnico em Eletrônica",
    c: "Laboratório de Reparos",
    p: "2017 — 2019",
    i: [
      "Montagem, soldagem e testes de placas PTH.",
      "Organização de bancada e controle de instrumentos.",
    ],
  },
] as const;

export const EDUCATION = [
  [
    "Conselho Regional dos Técnicos Industriais de São Paulo (CRT-SP / CFT)",
    "Técnico em Eletrônica — registro profissional",
    "Ativo",
  ],
  ["Centro Universitário ENIAC", "Bacharelado em Engenharia Elétrica", "Em andamento"],
  ["Formação Técnica em Eletrônica", "Curso Técnico em Eletrônica", "Concluído"],
] as const;
