import imgEsp32 from "@/assets/proj-esp32.jpg";
import imgBench from "@/assets/proj-bench.jpg";
import imgStm32 from "@/assets/proj-stm32.jpg";
import imgIot from "@/assets/proj-iot.jpg";

export type ProjectDoc = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  cover: string;
  meta: { label: string; value: string }[];
  stack: string[];
  overview: { heading: string; text: string }[];
  gallery: { src: string; caption: string }[];
  code?: { language: string; filename: string; content: string };
  youtubeId?: string;
  videoPlaceholder?: string;
  results: string[];
};

export const projectDocs: ProjectDoc[] = [
  {
    slug: "modelo",
    category: "Hardware & PCB",
    title: "Projeto Modelo",
    subtitle: "Resumo curto do projeto: objetivo principal, arquitetura adotada e resultado obtido em bancada.",
    cover: imgEsp32,
    meta: [
      { label: "Data", value: "2026" },
      { label: "Plataforma", value: "A definir" },
      { label: "Ferramentas", value: "A definir" },
      { label: "Status", value: "Modelo" },
    ],
    stack: ["Tag 1", "Tag 2", "Tag 3"],
    overview: [
      {
        heading: "Contexto & problema",
        text: "Espaço reservado para descrever o problema real encontrado em bancada ou em campo, o impacto e as restrições do projeto.",
      },
      {
        heading: "Solução adotada",
        text: "Espaço reservado para explicar a solução escolhida envolvendo hardware, firmware ou software e como ela resolve o problema.",
      },
      {
        heading: "Arquitetura",
        text: "Espaço reservado para detalhar os blocos do sistema, escolhas técnicas e decisões de projeto.",
      },
    ],
    gallery: [
      { src: imgBench, caption: "Imagem modelo 01 — legenda da foto de bancada" },
      { src: imgStm32, caption: "Imagem modelo 02 — legenda do hardware ou placa" },
      { src: imgIot, caption: "Imagem modelo 03 — legenda de testes ou medições" },
    ],
    code: {
      language: "Código",
      filename: "arquivo-modelo — Trecho principal",
      content: `Espaço reservado para trecho de código, firmware ou script do projeto.
Substitua pelo conteúdo real durante a documentação do Projeto 1.`,
    },
    videoPlaceholder: "Espaço reservado para o vídeo demonstrativo do projeto",
    results: [
      "Resultado mensurável 1 — substitua por uma métrica ou validação real.",
      "Resultado mensurável 2 — substitua por um ganho técnico observado.",
      "Próximo passo ou aprendizado técnico obtido no projeto.",
    ],
  },
];

export const getProjectDoc = (slug: string) => projectDocs.find((p) => p.slug === slug);
