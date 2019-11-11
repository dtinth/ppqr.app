const { action, defer } = require('prescript')
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
snap('Initial')
action('Set PromptPay ID', async () => {
  prompt(
    'Your PromptPay ID (phone number or e-Wallet ID)',
    async () => await accept('0812345678'),
  )
  await click('กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์')

  // This is less than ideal...
  await new Promise(r => setTimeout(r, 2000))
})
snap('Main')

function snap(name) {
  action('Screenshot: ' + name, async () => {
    require('mkdirp').sync('e2e/screenshots')
    await screenshot({ path: `e2e/screenshots/${name}.png` })
  })
}
