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
};

/** @type {string[]} canonical display order of categories */
export const CATEGORY_ORDER = [
  "foundations",
  "prompting",
  "chatbots_agents",
  "rag_search",
  "vision_multimodal",
  "production_ops",
];

/** @type {string[]} valid difficulty enum for projects/challenges */
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
