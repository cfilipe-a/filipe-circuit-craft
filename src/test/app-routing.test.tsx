import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { getProjectDoc, projectDocs } from "@/data/projects";
import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches /projetos/$slug for project detail pages", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/projetos/modelo");

    expect(matches.at(-1)?.routeId).toBe("/projetos/$slug");
  });

  it("exposes only the single neutral model project document", () => {
    expect(projectDocs).toHaveLength(1);
    const modelDoc = getProjectDoc("modelo");
    expect(modelDoc).toBeDefined();
    expect(modelDoc?.youtubeId).toBeUndefined();
    expect(getProjectDoc("exemplo")).toBeUndefined();
  });

  it("does not match the removed /v2 route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/v2");

    expect(matches.at(-1)?.routeId).toBe(rootRouteId);
  });
});
