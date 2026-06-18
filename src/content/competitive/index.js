// Competitive Coding catalog — C++ problems that teach AI algorithms.
// Each topic file default-exports an array of problems. New topics are added by
// dropping in a file and importing it here.

import search from './search.js'
import dp from './dp.js'
import probability from './probability.js'
import linalg from './linalg.js'
import optimization from './optimization.js'
import graphs from './graphs.js'

// Topic display metadata. `key` matches each problem's `topic` field.
export const COMPETITIVE_TOPICS = [
  { key: 'search', label: 'Search' },
  { key: 'dp', label: 'Dynamic Programming' },
  { key: 'linalg', label: 'Linear Algebra' },
  { key: 'probability', label: 'Probability' },
  { key: 'optimization', label: 'Optimization' },
  { key: 'graphs', label: 'Graphs' },
]

export const COMPETITIVE_DIFFICULTIES = ['easy', 'medium', 'hard']

const ALL = [...search, ...dp, ...probability, ...linalg, ...optimization, ...graphs]

// Stable ordering: topic order, then difficulty tier, then title.
const TOPIC_RANK = Object.fromEntries(COMPETITIVE_TOPICS.map((t, i) => [t.key, i]))
const DIFF_RANK = { easy: 0, medium: 1, hard: 2 }

export const COMPETITIVE = ALL.slice().sort((a, b) => {
  const t = (TOPIC_RANK[a.topic] ?? 99) - (TOPIC_RANK[b.topic] ?? 99)
  if (t) return t
  const d = (DIFF_RANK[a.difficulty] ?? 99) - (DIFF_RANK[b.difficulty] ?? 99)
  if (d) return d
  return String(a.title).localeCompare(String(b.title))
})

export const getCompetitive = (id) => COMPETITIVE.find((p) => p.id === id)
