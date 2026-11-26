import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

  it("renders featured and secondary projects with images, detail links, and working category filters", async () => {
    await renderHome();

    const section = document.getElementById("projetos");
    expect(section).not.toBeNull();
    const withinProjects = within(section!);

    expect(withinProjects.getByRole("img", { name: "Controlador IoT com ESP32" })).toBeInTheDocument();
    expect(withinProjects.getByRole("img", { name: "Placa de aquisição STM32" })).toBeInTheDocument();
    expect(withinProjects.getByRole("img", { name: "Dashboard de telemetria" })).toBeInTheDocument();
    expect(withinProjects.getAllByRole("link", { name: /Ver detalhes/i })).toHaveLength(3);

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

  it("renders scroll progress bar and manages mobile menu open, Escape, and link close", async () => {
    await renderHome();

    expect(screen.getByTestId("scroll-progress")).toBeInTheDocument();

    const menuButton = screen.getByRole("button", { name: "Abrir menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByRole("navigation", { name: "Navegação mobile" });
    fireEvent.click(within(mobileNav).getByRole("link", { name: "Projetos" }));
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
