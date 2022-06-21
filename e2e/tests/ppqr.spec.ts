import { test, expect, Page } from '@playwright/test'

class Ppqr {
  constructor(private readonly page: Page) {}
  async goto() {
    await this.page.goto('http://localhost:3000')
    await this.page.addStyleTag({ content: '.qr-explosion { display: none; }' })
  }
  async setPromptPayId(id: string) {
    this.page.once('dialog', (d) => d.accept('0812345678'))
    await this.page.click('text=กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์')
  }
  async expectExplanation(text: string) {
    await expect(this.page.locator('data-testid=qr-explanation')).toContainText(
      text,
    )
  }
}

test('generates a QR code', async ({ page }) => {
  const ppqr = new Ppqr(page)
  await ppqr.goto()
  await ppqr.setPromptPayId('0812345678')
  await ppqr.expectExplanation('QR code มีเบอร์โทรศัพท์ของคุณ: 0812345678')
  await page.screenshot({
    animations: 'disabled',
    path: 'e2e/screenshots/Main.png',
  })
})

test('saves PromptPay ID', async ({ page }) => {
  const ppqr = new Ppqr(page)
  await ppqr.goto()
  await ppqr.setPromptPayId('0812345678')
  await page.reload()
  await ppqr.expectExplanation('QR code มีเบอร์โทรศัพท์ของคุณ: 0812345678')
})
