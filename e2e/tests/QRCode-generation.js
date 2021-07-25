// @ts-check

const { action, defer, getCurrentState } = require('prescript')
const { chromium, devices } = require('playwright')

action('Open browser', async (state) => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ ...devices['iPhone 8'] })
  state.browser = browser
  state.page = await context.newPage()
})
defer('Open browser', async () => {
  await getBrowser().close()
})
action('Open app', async () => {
  await getPage().goto('http://localhost:3000')
})
action('Set PromptPay ID', async () => {
  const page = getPage()
  page.on('dialog', (dialog) => dialog.accept('0812345678'))
  await page.click('text=กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์')

  // This is less than ideal...
  await new Promise((r) => setTimeout(r, 2000))
})
action('Screenshot', async () => {
  require('mkdirp').sync('e2e/screenshots')
  await getPage().screenshot({ path: 'e2e/screenshots/Main.png' })
})

/** @returns {import('playwright').Browser} */
function getBrowser() {
  return /** @type {any} */ (getCurrentState()).browser
}

/** @returns {import('playwright').Page} */
function getPage() {
  return /** @type {any} */ (getCurrentState()).page
}
