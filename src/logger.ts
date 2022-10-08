import { save } from './config'

class Logger {
  date: Date
  lastUpdate: Date
  length: number
  content: string
  pendingLogContent: string
  preview: string
  previewDone: boolean
  createdOnDB: boolean

  constructor() {
    this.date = new Date()
    this.lastUpdate = new Date()
    this.length = 0
    this.content = ''
    this.pendingLogContent = ''
    this.preview = ''
    this.previewDone = false
    this.createdOnDB = false

    setInterval(this.sendToServer.bind(this), 60000)
  }

  append(str: string) {
    try {
      this.content += str
      this.length += str.length
      this.lastUpdate = new Date()
      this.makePreview(str)
    } catch {}
  }

  makePreview(str: string) {
    if (!this.previewDone) {
      this.preview += str
      if (this.preview.split('\n').length < 20) return
      this.previewDone = true
      this.preview = this.preview.split('\n').slice(0, 20).join('\n')
    }
  }

  async sendToServer() {
    try {
      this.pendingLogContent += this.content
      this.content = ''

      if (this.pendingLogContent === '') return

      await save({
        isNew: !this.createdOnDB,
        date: this.date,
        lastUpdate: this.lastUpdate,
        length: this.length,
        preview: this.preview,
        content: this.pendingLogContent
      })

      this.createdOnDB = true
      this.pendingLogContent = ''
    } catch {}
  }
}

export const logger = new Logger()
