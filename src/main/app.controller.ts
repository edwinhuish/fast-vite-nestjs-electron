import { Controller } from '@nestjs/common'
import { IpcHandle, Window } from '@doubleshot/nest-electron'

import { BrowserWindow } from 'electron'
import { AppService } from './app.service'
import { PlaywrightService } from './playwright.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly playwrightService: PlaywrightService,
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
    const page = await this.playwrightService.newPage()

    await page.goto(url)
  }
}
