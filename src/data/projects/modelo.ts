import imgBench from "@/assets/proj-bench.jpg";
import imgEsp32 from "@/assets/proj-esp32.jpg";
import imgIot from "@/assets/proj-iot.jpg";
import imgStm32 from "@/assets/proj-stm32.jpg";
import { SPEC_CATEGORIES, type ProjectConfig } from "./types";

export const modeloProject: ProjectConfig = {
  slug: "modelo",
  title: "Projeto Modelo",
  category: "Hardware & PCB",
  stage: "Lab / Protótipo",
  summary:
    "Página modelo reutilizável para documentar projetos reais do portfólio com estrutura flexível de blocos.",
  meta: [
    { label: "Ano", value: "2026" },
    { label: "Plataforma", value: "A definir" },
    { label: "Ferramentas", value: "A definir" },
    { label: "Status", value: "Modelo" },
  ],
  cover: {
    src: imgEsp32,
    alt: "Imagem principal do Projeto Modelo",
    caption: "Capa ilustrativa — substitua pela foto principal do projeto real.",
  },
  home: {
    visible: true,
    featured: true,
    order: 1,
    summary:
      "Página modelo reservada para documentar o primeiro projeto real do portfólio — escopo, hardware, firmware e resultados em bancada.",
    tags: ["Modelo", "Documentação", "Em construção"],
    cover: imgEsp32,
  },
  blocks: [
    {
      type: "overview",
      intro:
        "Espaço reservado para uma introdução objetiva do projeto real, contextualizando escopo, restrições e objetivo principal.",
      topics: [
        {
          heading: "Contexto & problema",
          text: "Espaço reservado para descrever o problema real encontrado em bancada ou em campo, o impacto e as restrições do projeto.",
        },
        {
          heading: "Solução proposta",
          text: "Espaço reservado para explicar a solução escolhida envolvendo hardware, firmware ou software e como ela resolve o problema.",
        },
        {
          heading: "Arquitetura",
          text: "Espaço reservado para detalhar os blocos do sistema, escolhas técnicas e decisões de projeto.",
        },
      ],
      tags: ["Tag 1", "Tag 2", "Tag 3"],
    },
    {
      type: "specs",
      groups: [
        {
          category: SPEC_CATEGORIES.hardware,
          items: [
            { label: "Controlador / núcleo", value: "A definir" },
            { label: "Interface principal", value: "A definir" },
          ],
        },
        {
          category: SPEC_CATEGORIES.electrical,
          items: [
            { label: "Alimentação", value: "A definir" },
            { label: "Proteções", value: "A definir" },
          ],
        },
      ],
    },
    {
      type: "gallery",
      layout: "spotlight",
      items: [
        {
          src: imgBench,
          alt: "Imagem modelo 01 em bancada",
          caption: "Imagem modelo 01 — legenda da foto de bancada",
        },
        {
          src: imgStm32,
          alt: "Imagem modelo 02 do hardware",
          caption: "Imagem modelo 02 — legenda do hardware ou placa",
        },
        {
          src: imgIot,
          alt: "Imagem modelo 03 de testes ou medições",
          caption: "Imagem modelo 03 — legenda de testes ou medições",
        },
      ],
    },
    {
      type: "documents",
      items: [
        {
          title: "Diagrama / documentação técnica (exemplo)",
          description: "Exemplo de item com visualização na página e download habilitados.",
          format: "Imagem",
          src: imgStm32,
          mode: "both",
          downloadFilename: "diagrama-modelo.jpg",
          previewType: "image",
        },
      ],
    },
    {
      type: "code",
      snippets: [
        {
          filename: "arquivo-modelo — Trecho principal",
          language: "Texto",
          copyable: true,
          content: `Espaço reservado para trecho de código, firmware ou script do projeto.
Substitua pelo conteúdo real durante a documentação do Projeto 1.`,
        },
      ],
    },
    {
      type: "results",
      summary:
        "Espaço reservado para registrar validações em bancada, aprendizados e ganhos mensuráveis reais quando o projeto for preenchido.",
      highlights: [
        "Resultado real ou validação observada em bancada.",
        "Aprendizado técnico ou próximo passo planejado.",
      ],
    },
  ],
};
