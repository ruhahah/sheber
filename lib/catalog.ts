// The light index of every mission and lesson, which the layout hands to all pages.
// For the server only: importing this file from browser code would bundle both full
// catalogs into the page. Browser code reads the index through useCatalog() instead.

import { lessons } from "./lessons";
import { missions } from "./missions";
import type { Catalog } from "./types";

export const catalog: Catalog = {
  missions: missions.map(({ id, level, lesson, faultType, title }) => ({
    id,
    level,
    lesson,
    faultType,
    title,
  })),
  lessons: lessons.map(({ slug, title, summary }) => ({ slug, title, summary })),
};
