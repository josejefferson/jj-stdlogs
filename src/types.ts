export interface ISaveFnParams {
  isNew: boolean
  date: Date
  lastUpdate: Date
  length: number
  preview: string
  content: string
}

export type Config = {
  saveFn: null | ((params: ISaveFnParams) => Promise<any>)
}
