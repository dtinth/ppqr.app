import { test, expect } from '@playwright/test'

test('generates a QR code', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.addStyleTag({ content: '.qr-explosion { display: none; }' })
  page.on('dialog', (d) => d.accept('0812345678'))
  await page.click('text=กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์')
  await expect(page.locator('.qr-explanation')).toContainText(
    'QR code มีเบอร์โทรศัพท์ของคุณ: 0812345678',
  )
  await page.screenshot({
    animations: 'disabled',
    path: 'e2e/screenshots/Main.png',
  })
})
