"use client";

import { createContext, useContext } from "react";
import type { Catalog } from "@/lib/types";

const CatalogContext = createContext<Catalog>({ missions: [], lessons: [] });

// Makes the index of missions and lessons, prepared on the server, available to every page.
export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: React.ReactNode;
}) {
  return <CatalogContext value={catalog}>{children}</CatalogContext>;
}

export const useCatalog = () => useContext(CatalogContext);
