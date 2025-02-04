import { join } from 'path'
import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { BrowserWindow, app } from 'electron'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlaywrightService } from './playwright.service'

@Module({
  imports: [ElectronModule.registerAsync({
    useFactory: async () => {
      const isDev = !app.isPackaged
      const win = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
          contextIsolation: true,
          preload: join(__dirname, '../preload/index.js'),
        },
      })

      win.on('closed', () => {
        win.destroy()
      })

      const URL = isDev
        ? process.env.DS_RENDERER_URL
        : `file://${join(app.getAppPath(), 'dist/render/index.html')}`

      win.loadURL(URL)

      return { win }
    },
  })],
  controllers: [AppController],
  providers: [AppService, PlaywrightService],
})
export class AppModule {
  constructor(private readonly playwrightService: PlaywrightService) {
    let asyncOperationDone = false

    app.on('before-quit', async (e) => {
      if (!asyncOperationDone) {
        e.preventDefault()
        await this.playwrightService.close()
        asyncOperationDone = true
        app.quit()
      }
    })
  }
}
