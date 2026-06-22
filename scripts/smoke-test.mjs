// Local smoke test: build must already exist (run `npm run build` first).
// Boots `vite preview`, loads the app in a headless browser, and asserts the
// React shell mounts without tripping the error boundary — i.e. catches the
// white-screen-of-death class of regression before it ships.
//
// Puppeteer is an optional, local-only tool: if it isn't installed this script
// SKIPS (exit 0) rather than failing, so it never blocks anyone who hasn't set
// it up. Install with: npm i -D puppeteer
import { spawn } from 'node:child_process'

const PORT = 4178
const BASE = '/codeflow/'
const URL = `http://localhost:${PORT}${BASE}`

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

let exitCode = 0
let browser
try {
  // Wait for the preview server to answer.
  let up = false
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(URL)
      if (res.ok) { up = true; break }
    } catch { /* not ready */ }
    await sleep(500)
  }
  if (!up) throw new Error(`preview server never came up at ${URL} (did you run \`npm run build\`?)`)

  browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })
  await page.waitForSelector('#root', { timeout: 10000 })

  // Shell must actually render something, and must not be the crash screen.
  const rootChildren = await page.evaluate(() => document.getElementById('root')?.childElementCount || 0)
  const bodyText = await page.evaluate(() => document.body.innerText || '')

  if (rootChildren === 0) throw new Error('#root mounted nothing — app failed to render.')
  if (bodyText.includes('SOMETHING BROKE')) throw new Error('Error boundary tripped on initial load.')
  if (errors.length) throw new Error(`Uncaught page errors:\n  ${errors.join('\n  ')}`)

  console.log(`smoke: OK — app shell mounted (${rootChildren} root nodes), no crashes.`)
} catch (e) {
  console.error(`smoke: FAILED — ${e.message}`)
  exitCode = 1
} finally {
  if (browser) await browser.close().catch(() => {})
  server.kill('SIGTERM')
}

process.exit(exitCode)
