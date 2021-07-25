const { test, to, action, defer, pending, named } = require('prescript')
const {
  openBrowser,
  goto,
  emulateDevice,
  click,
  prompt,
  accept,
  screenshot,
  closeBrowser,
} = require('taiko')

action('Open browser', async () => {
  await openBrowser()
})
defer('Open browser', async () => {
  await closeBrowser()
})
action('Open app', async () => {
  await emulateDevice('iPhone 8')
  await goto('http://localhost:3000')
})
action('Set PromptPay ID', async () => {
  prompt(/PromptPay/, async () => await accept('0812345678'))
  await click('กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์')

  // This is less than ideal...
  await new Promise((r) => setTimeout(r, 2000))
})
action('Screenshot', async () => {
  require('mkdirp').sync('e2e/screenshots')
  await screenshot({ path: 'e2e/screenshots/Main.png' })
})
