// Single source of truth for content categories.
//
// Every consumer (Projects.jsx, ProjectCard.jsx, Challenges.jsx, schema.js,
// docs) imports CATEGORY_LABELS / CATEGORY_ORDER from here instead of keeping a
// private copy. Add a category in exactly one place: this file.

/** @type {Record<string, string>} category id -> human label */
export const CATEGORY_LABELS = {
  foundations: "Foundations",
  prompting: "Prompting",
  chatbots_agents: "Chatbots & Agents",
  rag_search: "RAG & Search",
  vision_multimodal: "Vision & Multimodal",
  production_ops: "Production & Ops",
  // AP tracks (scoped to their own hub via project.track; never shown on the AI
  // Projects page, which filters to track 'ai').
  apcsp: "AP CS Principles",
  apcsa: "AP CS A",
};

/** @type {string[]} canonical display order of categories */
export const CATEGORY_ORDER = [
  "foundations",
  "prompting",
  "chatbots_agents",
  "rag_search",
  "vision_multimodal",
  "production_ops",
  "apcsp",
  "apcsa",
];

/** @type {string[]} valid difficulty enum for projects/challenges */
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
