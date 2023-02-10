import type { Browser } from 'playwright'
import { Injectable } from '@nestjs/common'
import { chromium } from 'playwright'

@Injectable()
export class PlaywrightService {
  private browser: Browser

  public async getBrowser(): Promise<Browser> {
    if (!this.browser)
      this.browser = await chromium.launch({ headless: false })

    return this.browser
  }

  public async close() {
    if (this.browser)
      await this.browser.close()
  }

  public async newPage() {
    const browser = await this.getBrowser()
    const context = await browser.newContext()
    const page = await context.newPage()

    return page
  }
}
