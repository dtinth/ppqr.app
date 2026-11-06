import { test, expect, Page } from '@playwright/test'
import { storyboard } from './support'

class Ppqr {
  constructor(private readonly page: Page) {}
  async goto() {
    await this.page.goto('http://localhost:8892')
    await this.page.addStyleTag({ content: '.qr-explosion { display: none; }' })
  }
  async setPromptPayId(id: string) {
    this.page.once('dialog', (d) => d.accept(id))
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
  await storyboard.capture('QR code is shown', page)
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
  await storyboard.capture('PromptPay ID is saved', page)
})

test('works offline', async ({ page }) => {
  const ppqr = new Ppqr(page)
  await ppqr.goto()
  await ppqr.setPromptPayId('0812345678')
  const failed: string[] = []
  await page.context().setOffline(true)
  page.context().on('requestfailed', (r) => {
    if (r.url().startsWith('http://localhost')) {
      failed.push(r.url() + ' ' + r.failure()!.errorText)
    }
  })
  await page.reload()
  await ppqr.expectExplanation('QR code มีเบอร์โทรศัพท์ของคุณ: 0812345678')
  expect(failed).toHaveLength(0)
  await storyboard.capture('App still works offline', page)
})

test('rejects amounts outside 1.00 to 500,000.00', async ({ page }) => {
  const ppqr = new Ppqr(page)
  await ppqr.goto()
  await ppqr.setPromptPayId('0812345678')
  const error = page.getByRole('alert')
  await page.fill('#amount', '500000.01')
  await expect(error).toContainText('กรุณาเลือกจำนวนเงินตั้งแต่ 1.00 ถึง 500,000.00')
  await page.fill('#amount', '0.5')
  await expect(error).toBeVisible()
  await page.fill('#amount', '500000')
  await expect(error).toHaveCount(0)
  await page.fill('#amount', '1')
  await expect(error).toHaveCount(0)
})
