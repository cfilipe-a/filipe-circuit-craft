import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";

async function renderHome() {
  const queryClient = new QueryClient();
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const router = createRouter({ routeTree, history, context: { queryClient } });
  await router.load();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { level: 1, name: "Filipe Cavalcante" })).toBeInTheDocument();
  });
}

describe("Home refinements", () => {
  it("displays the corrected CRT-SP wording and removes temporary branch label", async () => {
    await renderHome();

    expect(
      screen.getByText("Conselho Regional dos Técnicos Industriais de São Paulo · Ativo"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Conselho Federal dos Técnicos Industriais/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Production branch/i)).not.toBeInTheDocument();
  });

  it("renders featured and secondary projects with images, detail links, filters, and renamed more-projects link", async () => {
    await renderHome();

    const section = document.getElementById("projetos");
    expect(section).not.toBeNull();
    const withinProjects = within(section!);

    expect(withinProjects.getByRole("img", { name: "Controlador IoT com ESP32" })).toBeInTheDocument();
    expect(withinProjects.getByRole("img", { name: "Placa de aquisição STM32" })).toBeInTheDocument();
    expect(withinProjects.getByRole("img", { name: "Dashboard de telemetria" })).toBeInTheDocument();
    expect(withinProjects.getAllByRole("link", { name: /Ver detalhes/i })).toHaveLength(3);

    const moreLink = withinProjects.getByRole("link", { name: "Ver mais projetos" });
    expect(moreLink).toHaveAttribute("href", "https://github.com/cfilipe-a");
    expect(withinProjects.queryByText(/Ver todos os projetos no GitHub/i)).not.toBeInTheDocument();

    fireEvent.click(withinProjects.getByRole("button", { name: "Hardware & PCB" }));
    expect(withinProjects.getByRole("heading", { name: "Placa de aquisição STM32" })).toBeInTheDocument();
    expect(withinProjects.queryByRole("heading", { name: "Controlador IoT com ESP32" })).not.toBeInTheDocument();
    expect(withinProjects.queryByRole("heading", { name: "Dashboard de telemetria" })).not.toBeInTheDocument();

    fireEvent.click(withinProjects.getByRole("button", { name: "Todos" }));
    expect(withinProjects.getByRole("heading", { name: "Controlador IoT com ESP32" })).toBeInTheDocument();
    expect(withinProjects.getAllByRole("link", { name: /Ver detalhes/i })).toHaveLength(3);
  });

  it("wraps skills categories without horizontal overflow and switches tabs", async () => {
    await renderHome();

    const tablist = screen.getByRole("tablist", { name: "Categorias de competências" });
    expect(tablist.className).toContain("flex-wrap");
    expect(tablist.className).not.toContain("overflow-x-auto");

    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Criação de esquemáticos")).toBeInTheDocument();

    fireEvent.click(tabs[2]!);
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Diagnóstico em nível de componente")).toBeInTheDocument();
  });

  it("keeps header fixed during scroll and closes mobile menu on outside click, Escape, and internal link click", async () => {
    await renderHome();

    expect(screen.getByTestId("scroll-progress")).toBeInTheDocument();

    const header = document.querySelector("header");
    expect(header).not.toBeNull();
    expect(header!.className).toContain("fixed");
    expect(header!.className).not.toContain("-translate-y-full");

    const originalScrollYDesc = Object.getOwnPropertyDescriptor(window, "scrollY");
    try {
      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });
      fireEvent.scroll(window);
      expect(header!.className).not.toContain("-translate-y-full");
    } finally {
      if (originalScrollYDesc) {
        Object.defineProperty(window, "scrollY", originalScrollYDesc);
      } else {
        Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
      }
    }

    const menuButton = screen.getByRole("button", { name: "Abrir menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileNav = screen.getByRole("navigation", { name: "Navegação mobile" });
    fireEvent.pointerDown(mobileNav);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const main = document.querySelector("main");
    expect(main).not.toBeNull();
    fireEvent.pointerDown(main!);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(within(mobileNav).getByRole("link", { name: "Projetos" }));
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders all education entries in order with consistent column alignment", async () => {
    await renderHome();

    const heading = screen.getByRole("heading", { name: "Formação e credenciais" });
    const section = heading.closest("section");
    expect(section).not.toBeNull();
    const withinEdu = within(section!);

    const eniac = withinEdu.getByText("Centro Universitário ENIAC");
    const tecnico = withinEdu.getByText("Formação Técnica em Eletrônica");
    expect(withinEdu.getByText("Bacharelado em Engenharia Elétrica")).toBeInTheDocument();
    expect(withinEdu.getByText("Curso Técnico em Eletrônica")).toBeInTheDocument();
    expect(withinEdu.getByText("Concluído")).toBeInTheDocument();

    expect(eniac.compareDocumentPosition(tecnico) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const rows = section!.querySelectorAll("div.grid");
    expect(rows).toHaveLength(3);
    for (const row of rows) {
      expect(row.className).toContain("sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_8.5rem]");
      expect(row.className).not.toContain("_auto]");
    }
  });

  it("renders discreet GitHub, LinkedIn, and PDF resume download links in Contact section", async () => {
    await renderHome();

    const section = document.getElementById("contato");
    expect(section).not.toBeNull();
    const withinContact = within(section!);

    expect(withinContact.getByRole("button", { name: "Falar no WhatsApp" })).toBeInTheDocument();
    expect(withinContact.getByRole("button", { name: "Enviar e-mail" })).toBeInTheDocument();

    const githubLink = withinContact.getByRole("link", { name: "GitHub" });
    expect(githubLink).toHaveAttribute("href", "https://github.com/cfilipe-a");

    const linkedinLink = withinContact.getByRole("link", { name: "LinkedIn" });
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/filipe-cavalcante-51338b2aa/",
    );

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    try {
      const pdfButton = withinContact.getByRole("button", { name: "Baixar currículo (PDF)" });
      fireEvent.click(pdfButton);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      const anchor = clickSpy.mock.instances[0] as HTMLAnchorElement;
      expect(anchor.getAttribute("href")).toBe("/docs/cv-7f3a9c2e41b8d605.pdf");
      expect(anchor.download).toBe("Curriculo-Filipe-Cavalcante.pdf");
    } finally {
      clickSpy.mockRestore();
    }
  });

  it("advances and retrocedes top progress bar by section stages in sync with active nav links", async () => {
    const originalScrollHeightDesc = Object.getOwnPropertyDescriptor(
      document.documentElement,
      "scrollHeight",
    );
    const originalScrollYDesc = Object.getOwnPropertyDescriptor(window, "scrollY");

    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });

    await renderHome();

    const bar = screen.getByTestId("scroll-progress");
    expect(bar).toHaveAttribute("data-section", "inicio");
    expect(bar).toHaveStyle({ transform: "scaleX(0.2)" });

    const desktopNav = screen.getByRole("navigation", { name: "Navegação principal" });
    const mobileNav = screen.getByRole("navigation", { name: "Navegação mobile", hidden: true });

    const sectionTops: Record<string, number> = {
      inicio: 0,
      projetos: 800,
      competencias: 1600,
      trajetoria: 2400,
      contato: 3200,
    };

    const spies = Object.keys(sectionTops).map((id) => {
      const el = document.getElementById(id)!;
      return vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
        const top = sectionTops[id]! - window.scrollY;
        return {
          top,
          bottom: top + 500,
          left: 0,
          right: 1000,
          width: 1000,
          height: 500,
          x: 0,
          y: top,
          toJSON: () => ({}),
        } as DOMRect;
      });
    });

    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 4000,
      writable: true,
      configurable: true,
    });

    const scrollToY = (y: number, eventName: "scroll" | "scrollend" | "hashchange" = "scroll") => {
      Object.defineProperty(window, "scrollY", {
        value: y,
        writable: true,
        configurable: true,
      });
      if (eventName === "scroll") fireEvent.scroll(window);
      else fireEvent(window, new Event(eventName));
    };

    try {
      scrollToY(40);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "inicio");
        expect(bar).toHaveStyle({ transform: "scaleX(0.2)" });
      });

      scrollToY(650);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "projetos");
        expect(bar).toHaveStyle({ transform: "scaleX(0.4)" });
        expect(within(desktopNav).getByRole("link", { name: "Projetos" })).toHaveAttribute(
          "aria-current",
          "location",
        );
        expect(
          within(mobileNav).getByRole("link", { name: "Projetos", hidden: true }),
        ).toHaveAttribute("aria-current", "location");
      });

      scrollToY(1100);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "projetos");
        expect(bar).toHaveStyle({ transform: "scaleX(0.4)" });
        expect(within(desktopNav).getByRole("link", { name: "Projetos" })).toHaveAttribute(
          "aria-current",
          "location",
        );
      });

      scrollToY(1450);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "competencias");
        expect(bar).toHaveStyle({ transform: "scaleX(0.6)" });
        expect(within(desktopNav).getByRole("link", { name: "Competências" })).toHaveAttribute(
          "aria-current",
          "location",
        );
      });

      scrollToY(2250);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "trajetoria");
        expect(bar).toHaveStyle({ transform: "scaleX(0.8)" });
        expect(within(desktopNav).getByRole("link", { name: "Trajetória" })).toHaveAttribute(
          "aria-current",
          "location",
        );
      });

      scrollToY(3210);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "contato");
        expect(bar).toHaveStyle({ transform: "scaleX(1)" });
        expect(within(desktopNav).getByRole("link", { name: "Contato" })).toHaveAttribute(
          "aria-current",
          "location",
        );
        expect(
          within(mobileNav).getByRole("link", { name: "Contato", hidden: true }),
        ).toHaveAttribute("aria-current", "location");
      });

      scrollToY(1500, "hashchange");
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "competencias");
        expect(bar).toHaveStyle({ transform: "scaleX(0.6)" });
        expect(within(desktopNav).getByRole("link", { name: "Competências" })).toHaveAttribute(
          "aria-current",
          "location",
        );
      });

      scrollToY(700, "scrollend");
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "projetos");
        expect(bar).toHaveStyle({ transform: "scaleX(0.4)" });
        expect(within(desktopNav).getByRole("link", { name: "Projetos" })).toHaveAttribute(
          "aria-current",
          "location",
        );
      });

      scrollToY(0);
      await waitFor(() => {
        expect(bar).toHaveAttribute("data-section", "inicio");
        expect(bar).toHaveStyle({ transform: "scaleX(0.2)" });
        expect(within(desktopNav).queryByRole("link", { current: "location" })).not.toBeInTheDocument();
      });
    } finally {
      for (const spy of spies) spy.mockRestore();
      if (originalScrollHeightDesc) {
        Object.defineProperty(document.documentElement, "scrollHeight", originalScrollHeightDesc);
      }
      if (originalScrollYDesc) {
        Object.defineProperty(window, "scrollY", originalScrollYDesc);
      }
    }
  });

  it("aligns top progress bar right edge with active desktop header item and falls back on mobile", async () => {
    const originalScrollHeightDesc = Object.getOwnPropertyDescriptor(
      document.documentElement,
      "scrollHeight",
    );
    const originalScrollYDesc = Object.getOwnPropertyDescriptor(window, "scrollY");

    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });

    await renderHome();

    const bar = screen.getByTestId("scroll-progress");
    const track = bar.parentElement as HTMLDivElement;
    const header = document.querySelector("header")!;
    const desktopNav = screen.getByRole("navigation", { name: "Navegação principal" });
    const logoLink = within(header).getByRole("link", { name: "Início" });
    const projLink = within(desktopNav).getByRole("link", { name: "Projetos" });
    const compLink = within(desktopNav).getByRole("link", { name: "Competências" });
    const trajLink = within(desktopNav).getByRole("link", { name: "Trajetória" });
    const contLink = within(desktopNav).getByRole("link", { name: "Contato" });

    let viewportWidth = 1200;
    let desktopVisible = true;
    let rightCoords = {
      inicio: 140,
      projetos: 840,
      competencias: 960,
      trajetoria: 1060,
      contato: 1160,
    };

    const makeRect = (left: number, width: number): DOMRect =>
      ({
        left,
        right: left + width,
        top: 0,
        bottom: 40,
        width,
        height: 40,
        x: left,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const sectionTops: Record<string, number> = {
      inicio: 0,
      projetos: 800,
      competencias: 1600,
      trajetoria: 2400,
      contato: 3200,
    };

    const spies = [
      vi.spyOn(track, "getBoundingClientRect").mockImplementation(() => makeRect(0, viewportWidth)),
      vi.spyOn(desktopNav, "getBoundingClientRect").mockImplementation(() =>
        desktopVisible ? makeRect(780, 380) : makeRect(0, 0),
      ),
      vi.spyOn(logoLink, "getBoundingClientRect").mockImplementation(() =>
        makeRect(40, rightCoords.inicio - 40),
      ),
      vi.spyOn(projLink, "getBoundingClientRect").mockImplementation(() =>
        desktopVisible ? makeRect(rightCoords.projetos - 60, 60) : makeRect(0, 0),
      ),
      vi.spyOn(compLink, "getBoundingClientRect").mockImplementation(() =>
        desktopVisible ? makeRect(rightCoords.competencias - 90, 90) : makeRect(0, 0),
      ),
      vi.spyOn(trajLink, "getBoundingClientRect").mockImplementation(() =>
        desktopVisible ? makeRect(rightCoords.trajetoria - 70, 70) : makeRect(0, 0),
      ),
      vi.spyOn(contLink, "getBoundingClientRect").mockImplementation(() =>
        desktopVisible ? makeRect(rightCoords.contato - 60, 60) : makeRect(0, 0),
      ),
      ...Object.keys(sectionTops).map((id) => {
        const el = document.getElementById(id)!;
        return vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
          const top = sectionTops[id]! - window.scrollY;
          return {
            top,
            bottom: top + 500,
            left: 0,
            right: viewportWidth,
            width: viewportWidth,
            height: 500,
            x: 0,
            y: top,
            toJSON: () => ({}),
          } as DOMRect;
        });
      }),
    ];

    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 4000,
      writable: true,
      configurable: true,
    });

    const scrollToY = (y: number) => {
      Object.defineProperty(window, "scrollY", {
        value: y,
        writable: true,
        configurable: true,
      });
      fireEvent.scroll(window);
    };

    try {
      fireEvent(window, new Event("resize"));
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${140 / 1200})` }),
      );

      scrollToY(650);
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${840 / 1200})` }),
      );

      scrollToY(1450);
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${960 / 1200})` }),
      );

      scrollToY(2250);
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${1060 / 1200})` }),
      );

      scrollToY(3210);
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${1160 / 1200})` }),
      );

      viewportWidth = 1440;
      rightCoords = {
        inicio: 220,
        projetos: 1000,
        competencias: 1140,
        trajetoria: 1260,
        contato: 1360,
      };
      fireEvent(window, new Event("resize"));
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${1360 / 1440})` }),
      );

      scrollToY(650);
      await waitFor(() =>
        expect(bar).toHaveStyle({ transform: `scaleX(${1000 / 1440})` }),
      );

      desktopVisible = false;
      viewportWidth = 390;
      fireEvent(window, new Event("resize"));
      await waitFor(() => expect(bar).toHaveStyle({ transform: "scaleX(0.4)" }));
    } finally {
      for (const spy of spies) spy.mockRestore();
      if (originalScrollHeightDesc) {
        Object.defineProperty(document.documentElement, "scrollHeight", originalScrollHeightDesc);
      }
      if (originalScrollYDesc) {
        Object.defineProperty(window, "scrollY", originalScrollYDesc);
      }
    }
  });
});
