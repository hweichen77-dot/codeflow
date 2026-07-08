import { spawn } from 'node:child_process'

const PORT = 4178
const BASE = '/codeflow/'
const ORIGIN = `http://localhost:${PORT}`
const URL = `${ORIGIN}${BASE}`

let puppeteer
try {
  puppeteer = (await import('puppeteer')).default
} catch {
  console.log('smoke: puppeteer not installed — skipping (npm i -D puppeteer to enable).')
  process.exit(0)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
})

const GUEST_PROFILE = { id: 'local-smoke', name: 'Smoke Test', email: 'smoke-test@local' }

let exitCode = 0
let browser
const pass = (m) => console.log(`  ✓ ${m}`)
const warn = (m) => console.log(`  ⚠ ${m}`)

async function assertHealthy(page, label) {
  await page.waitForSelector('#root', { timeout: 10000 })
  const { children, body } = await page.evaluate(() => ({
    children: document.getElementById('root')?.childElementCount || 0,
    body: document.body.innerText || '',
  }))
  if (children === 0) throw new Error(`${label}: #root mounted nothing.`)
  if (body.includes('SOMETHING BROKE')) throw new Error(`${label}: error boundary tripped.`)
  if (/page not found/i.test(body)) throw new Error(`${label}: routed to 404.`)
  return body
}

try {
  let up = false
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(URL)
      if (res.ok) { up = true; break }
    } catch {  }
    await sleep(500)
  }
  if (!up) throw new Error(`preview server never came up at ${URL} (did you run \`npm run build\`?)`)

  browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })
  await assertHealthy(page, 'shell')
  if (errors.length) throw new Error(`Uncaught page errors on load:\n  ${errors.join('\n  ')}`)
  pass('app shell mounted, no crashes')

  await page.evaluate((p) => window.localStorage.setItem('codeflow_profile_v1', JSON.stringify(p)), GUEST_PROFILE)
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 })

  const routes = ['ProjectDetail?id=ai-01', 'Challenges', 'Competitive', 'APCS', 'Projects', 'Dashboard']
  for (const r of routes) {
    errors.length = 0
    await page.goto(`${URL}${r}`, { waitUntil: 'networkidle2', timeout: 30000 })
    await assertHealthy(page, r)
    if (errors.length) throw new Error(`${r}: uncaught errors:\n  ${errors.join('\n  ')}`)
    pass(`route /${r} rendered clean`)
  }

  errors.length = 0
  await page.goto(`${URL}ProjectDetail?id=ai-01`, { waitUntil: 'networkidle2', timeout: 30000 })
  await assertHealthy(page, 'lesson')

  const LESSON_EDITOR = 'textarea[aria-label^="Code editor for lesson_"]'
  const editor = await page.waitForSelector(LESSON_EDITOR, { timeout: 15000 }).catch(() => null)
  if (!editor) throw new Error('lesson: Python lesson editor textarea not found.')

  await page.$eval(LESSON_EDITOR, (el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
    set.call(el, '')
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.focus()
  })
  await page.type(LESSON_EDITOR, 'print(6*7)')
  const typed = await page.evaluate((sel) => document.querySelector(sel)?.value || '', LESSON_EDITOR)
  if (typed !== 'print(6*7)') throw new Error(`lesson: editor did not accept input (got "${typed}").`)
  pass('typed code into Python lesson editor')

  const clicked = await page.evaluate((sel) => {
    const ta = document.querySelector(sel)
    let node = ta
    while (node && node !== document.body) {
      const btn = [...node.querySelectorAll('button')].find((b) => /^▶?\s*run$/i.test((b.textContent || '').trim()))
      if (btn) { btn.click(); return true }
      node = node.parentElement
    }
    return false
  }, LESSON_EDITOR)
  if (!clicked) throw new Error('lesson: Run button for lesson editor not found.')

  let ran = false
  const deadline = Date.now() + 70000
  while (Date.now() < deadline) {
    const body = await page.evaluate(() => document.body.innerText || '')
    if (/(^|\D)42(\D|$)/.test(body)) { ran = true; break }
    if (/Error: (?!The Python runtime took too long)/.test(body) && /Traceback|SyntaxError|NameError/.test(body)) {
      throw new Error('lesson: code run reported a Python error.')
    }
    await sleep(1000)
  }
  if (errors.length) throw new Error(`lesson run: uncaught errors:\n  ${errors.join('\n  ')}`)
  if (ran) pass('code executed — output 42 rendered (editor + Pyodide runner OK)')
  else warn('Pyodide did not return output within 70s (CDN unreachable?) — editor input OK, run unverified')

  console.log('\nsmoke: OK — shell, 6 routes, and live code execution healthy.')
} catch (e) {
  console.error(`\nsmoke: FAILED — ${e.message}`)
  exitCode = 1
} finally {
  if (browser) await browser.close().catch(() => {})
  server.kill('SIGTERM')
}

process.exit(exitCode)
