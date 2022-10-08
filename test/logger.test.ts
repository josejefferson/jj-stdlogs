// @ts-nocheck
import { config, getLogs, log } from '../src'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

test('set load/save functions', async () => {
  process.env.NODE_ENV = 'production'
  expect(await getLogs()).toEqual([])

  const savedLog = {
    opts: {
      date: '2000-01-01T00:00:00.000Z',
      title: 'Test 1',
      contents: ['Hello 1']
    }
  }

  const nonSyncedLog = log('Test 2')('Hello 2')
  await nonSyncedLog

  const db = [savedLog.opts]

  const loadFn = async () => db
  const saveFn = async (log) => {
    db.push(log)
  }
  config.setLoadFn(loadFn)
  config.setSaveFn(saveFn)

  expect(await getLogs()).toEqual([nonSyncedLog.opts])
  expect(await getLogs(true)).toEqual([nonSyncedLog.opts, savedLog.opts])
})
