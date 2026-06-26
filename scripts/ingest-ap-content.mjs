import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = process.argv[2]
const root = process.cwd()
const data = JSON.parse(readFileSync(OUT, 'utf8'))
const modules = data.result || data

const cspImports = [], cspList = []
const csaImports = [], csaList = []

for (const { id, track, module } of modules) {
  const dir = track === 'apcsp' ? 'csp' : 'csa'
  const varName = id.replace(/[^a-z0-9]/gi, '_')
  const file = join(root, 'src', 'content', dir, `module-${id}.js`)
  writeFileSync(file, `// AUTO-AUTHORED AP module. Edit via the content pipeline.\nexport default ${JSON.stringify(module, null, 2)}\n`)
  const importLine = `import ${varName} from './module-${id}.js'`
  if (track === 'apcsp') { cspImports.push(importLine); cspList.push(varName) }
  else { csaImports.push(importLine); csaList.push(varName) }
}

const cspIndex = `// AP Computer Science Principles — module aggregator.
// Each module exports default { project, lessons } with project.track === 'apcsp'.
// Explicit static imports (Node validate/verify scripts import this).
${cspImports.join('\n')}

export const MODULES = [${cspList.join(', ')}]

export { default as BRIEFS } from './briefs.js'
`
const csaIndex = `// AP Computer Science A — module aggregator (Java).
// Each module exports default { project, lessons } with project.track === 'apcsa'
// and lessons set language 'java' (solutions declare \`public class Main\`).
${csaImports.join('\n')}

export const MODULES = [${csaList.join(', ')}]

export { default as BRIEFS } from './briefs.js'
`
writeFileSync(join(root, 'src', 'content', 'csp', 'index.js'), cspIndex)
writeFileSync(join(root, 'src', 'content', 'csa', 'index.js'), csaIndex)

console.log(`Wrote ${cspList.length} CSP + ${csaList.length} CSA modules.`)
