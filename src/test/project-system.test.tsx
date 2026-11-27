import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectTemplate } from "@/components/project/ProjectTemplate";
import {
  getNextVisibleProject,
  getProjectBySlug,
  getVisibleHomeProjects,
  SPEC_CATEGORIES,
  type ProjectConfig,
} from "@/data/projects";
import { discoverProjectSlugs } from "@/data/projects/discover-slugs";
import { routeTree } from "@/routeTree.gen";

async function renderProjectRoute(path = "/projetos/modelo") {
  const queryClient = new QueryClient();
  const history = createMemoryHistory({ initialEntries: [path] });
  const router = createRouter({ routeTree, history, context: { queryClient } });
  await router.load();

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

function CustomTestSection() {
  return <div data-testid="custom-block-content">Bloco customizado de teste</div>;
}

describe("Reusable project system", () => {
  it("renders /projetos/modelo header without buttons or external links and builds matching TOC", async () => {
    await renderProjectRoute("/projetos/modelo");

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: "Projeto Modelo" })).toBeInTheDocument();
    });

    const titleHeading = screen.getByRole("heading", { level: 1, name: "Projeto Modelo" });
    const heroSection = titleHeading.closest("section")!;
    expect(within(heroSection).queryAllByRole("button")).toHaveLength(0);
    expect(within(heroSection).queryAllByRole("link")).toHaveLength(0);

    const toc = screen.getByRole("navigation", { name: "Índice do projeto" });
    const tocLinks = within(toc).getAllByRole("link");
    expect(tocLinks.map((link) => link.getAttribute("href"))).toEqual([
      "#visao-geral",
      "#especificacoes",
      "#galeria",
      "#documentacao",
      "#codigo",
      "#resultados",
    ]);

    for (const link of tocLinks) {
      const targetId = link.getAttribute("href")!.slice(1);
      expect(document.getElementById(targetId)).not.toBeNull();
    }

    expect(document.querySelector("video")).toBeNull();
  });

  it("supports custom block ordering, block omission, empty video omission, and custom blocks", async () => {
    const queryClient = new QueryClient();
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const router = createRouter({ routeTree, history, context: { queryClient } });
    await router.load();

    const customProject: ProjectConfig = {
      slug: "teste-composicao",
      title: "Projeto Composição",
      category: "Embarcados",
      stage: "Validado em Bancada",
      summary: "Resumo de teste.",
      home: { visible: false, order: 1 },
      blocks: [
        {
          type: "results",
          summary: "Resumo de resultados antes do restante.",
          metrics: [{ label: "Latência", value: "12 ms", detail: "Média em bancada" }],
          comparisons: [{ label: "Consumo", before: "120 mA", after: "45 mA", note: "Sleep ativo" }],
          highlights: ["Validação concluída"],
          media: [{ src: "/img/res.jpg", alt: "Captura de validação", caption: "Forma de onda" }],
        },
        {
          type: "video",
          src: "   ",
        },
        {
          type: "custom",
          id: "diagrama-especial",
          title: "Diagrama Especial",
          tocLabel: "Diagrama",
          component: CustomTestSection,
        },
        {
          type: "specs",
          groups: [
            {
              category: SPEC_CATEGORIES.firmware,
              items: [{ label: "RTOS", value: "FreeRTOS" }],
            },
            {
              category: "Categoria Customizada",
              items: [{ label: "Taxa", value: "1 kHz" }],
            },
          ],
        },
      ],
    };

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          InnerWrap={({ children }) => (
            <>
              {children}
              <ProjectTemplate project={customProject} />
            </>
          )}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("custom-block-content")).toBeInTheDocument();
    });

    const toc = screen.getByRole("navigation", { name: "Índice do projeto" });
    const tocLinks = within(toc).getAllByRole("link");
    expect(tocLinks).toHaveLength(3);
    expect(tocLinks.map((a) => a.textContent)).toEqual([
      "01Resultados",
      "02Diagrama",
      "03Especificações técnicas",
    ]);
    expect(document.getElementById("video")).toBeNull();
    expect(screen.getByText("12 ms")).toBeInTheDocument();
    expect(screen.getByText("120 mA")).toBeInTheDocument();
    expect(screen.getByText("45 mA")).toBeInTheDocument();
    expect(screen.getByText("Categoria Customizada")).toBeInTheDocument();
  });

  it("supports gallery grid/spotlight switching and lightbox controls", async () => {
    const queryClient = new QueryClient();
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const router = createRouter({ routeTree, history, context: { queryClient } });
    await router.load();

    const project: ProjectConfig = {
      slug: "teste-midia",
      title: "Projeto Mídia",
      category: "Hardware & PCB",
      stage: "Lab / Protótipo",
      summary: "Teste de galeria, documentos, código e vídeo.",
      home: { visible: true, order: 1 },
      blocks: [
        {
          type: "gallery",
          layout: "spotlight",
          items: [
            { src: "/a.jpg", alt: "Foto A", caption: "Legenda A" },
            { src: "/b.jpg", alt: "Foto B", caption: "Legenda B" },
          ],
        },
        {
          type: "gallery",
          id: "galeria-grade",
          title: "Galeria em Grade",
          layout: "grid",
          items: [{ src: "/c.jpg", alt: "Foto C", caption: "Legenda C" }],
        },
        {
          type: "documents",
          items: [
            {
              title: "Esquemático PDF",
              format: "PDF",
              src: "/docs/esquematico.pdf",
              mode: "view",
            },
            {
              title: "Pacote Gerber",
              format: "ZIP",
              src: "/docs/gerber.zip",
              mode: "download",
              downloadFilename: "gerber-v1.zip",
            },
            {
              title: "Diagrama de Blocos",
              format: "PNG",
              src: "/docs/blocos.png",
              mode: "both",
            },
          ],
        },
        {
          type: "code",
          repository: {
            label: "GitHub do Projeto",
            url: "https://github.com/cfilipe-a/teste",
            description: "Código-fonte completo",
          },
          snippets: [
            {
              filename: "main.c",
              language: "C",
              content: "int main(void) { return 0; }",
              copyable: true,
            },
          ],
        },
        {
          type: "video",
          src: "/videos/bancada.mp4",
          caption: "Teste em bancada",
        },
      ],
    };

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          InnerWrap={() => <ProjectTemplate project={project} />}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Selecionar Foto B" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Selecionar Foto B" }));
    expect(screen.getByRole("button", { name: "Ampliar imagem: Foto B" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ampliar imagem: Foto B" }));
    expect(screen.getByRole("dialog", { name: "Imagem ampliada" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Imagem ampliada" })).not.toBeInTheDocument();

    const pdfIframe = screen.getByTitle("Esquemático PDF");
    expect(pdfIframe.tagName).toBe("IFRAME");

    const gerberCard = screen.getByText("Pacote Gerber").closest("article")!;
    expect(within(gerberCard).getByRole("link", { name: /Baixar/i })).toHaveAttribute(
      "download",
      "gerber-v1.zip",
    );
    expect(within(gerberCard).queryByRole("link", { name: /Abrir/i })).not.toBeInTheDocument();

    const diagramCard = screen.getByText("Diagrama de Blocos").closest("article")!;
    expect(within(diagramCard).getByRole("link", { name: /Abrir/i })).toBeInTheDocument();
    expect(within(diagramCard).getByRole("link", { name: /Baixar/i })).toBeInTheDocument();

    const repoLink = screen.getByRole("link", { name: /GitHub do Projeto/i });
    expect(repoLink).toHaveAttribute("href", "https://github.com/cfilipe-a/teste");
    fireEvent.click(screen.getByRole("button", { name: /Copiar/i }));
    expect(writeText).toHaveBeenCalledWith("int main(void) { return 0; }");
    await waitFor(() => {
      expect(screen.getByText("Copiado")).toBeInTheDocument();
    });

    const videoEl = document.querySelector("video");
    expect(videoEl).not.toBeNull();
    expect(videoEl).toHaveAttribute("src", "/videos/bancada.mp4");
  });

  it("controls Home visibility, featured sorting, order, and preserves direct access for hidden projects", () => {
    const sampleProjects: ProjectConfig[] = [
      {
        slug: "p-oculto",
        title: "Projeto Oculto",
        category: "Dados",
        stage: "Em Produção",
        summary: "Acessível apenas por link direto.",
        home: { visible: false, featured: true, order: 0 },
        blocks: [],
      },
      {
        slug: "p-ordem-2",
        title: "Projeto Ordem 2",
        category: "Embarcados",
        stage: "Lab / Protótipo",
        summary: "Segundo na ordem.",
        home: { visible: true, featured: false, order: 2 },
        blocks: [],
      },
      {
        slug: "p-ordem-1",
        title: "Projeto Ordem 1",
        category: "Hardware & PCB",
        stage: "Validado em Bancada",
        summary: "Primeiro sem destaque.",
        home: { visible: true, featured: false, order: 1 },
        blocks: [],
      },
      {
        slug: "p-destaque",
        title: "Projeto Destaque",
        category: "Dados",
        stage: "Em Produção",
        summary: "Destaque na Home.",
        home: { visible: true, featured: true, order: 5 },
        blocks: [],
      },
    ];

    const homeCards = getVisibleHomeProjects(sampleProjects);
    expect(homeCards.map((c) => c.slug)).toEqual(["p-destaque", "p-ordem-1", "p-ordem-2"]);
    expect(homeCards.find((c) => c.slug === "p-oculto")).toBeUndefined();

    const hiddenProject = getProjectBySlug("p-oculto", sampleProjects);
    expect(hiddenProject).toBeDefined();
    expect(hiddenProject?.title).toBe("Projeto Oculto");

    expect(getNextVisibleProject("p-destaque", sampleProjects)?.slug).toBe("p-ordem-1");
  });

  it("discovers registered project slugs including hidden projects for static prerendering", () => {
    const slugs = discoverProjectSlugs();
    expect(slugs).toContain("modelo");
  });
});
