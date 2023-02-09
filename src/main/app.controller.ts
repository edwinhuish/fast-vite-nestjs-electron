import { Controller } from '@nestjs/common'
import { IpcHandle, Window } from '@doubleshot/nest-electron'
import { chromium } from 'playwright'

import { BrowserWindow } from 'electron'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Window() private readonly mainWin: BrowserWindow,
  ) { }

  @IpcHandle('msg')
  public async handleSendMsg(msg: string): Promise<string> {
    const { webContents } = this.mainWin
    webContents.send('reply-msg', 'this is msg from webContents.send')
    return `The main process received your message: ${msg} at time: ${this.appService.getTime()}`
  }

  @IpcHandle('open-web')
  public async handleOpenWeb(url: string): Promise<void> {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(url)
  }
}
