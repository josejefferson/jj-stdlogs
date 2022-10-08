// @ts-nocheck
import { config, errors, log } from '../src'
import { config as configObj, load, save } from '../src/config'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

const env = process.env.NODE_ENV
afterAll(() => {
  process.env.NODE_ENV = env
})

test('set load/save functions', () => {
  expect(() => config.setLoadFn()).toThrow(Error)
  expect(() => config.setSaveFn()).toThrow(Error)
  expect(() => config.setLoadFn(1)).toThrow(Error)
  expect(() => config.setSaveFn(1)).toThrow(Error)
  expect(configObj.loadFn).toBeNull()
  expect(configObj.saveFn).toBeNull()
  expect(() => config.setLoadFn(null)).not.toThrow(Error)
  expect(() => config.setSaveFn(null)).not.toThrow(Error)
  expect(configObj.loadFn).toBeNull()
  expect(configObj.saveFn).toBeNull()
  expect(load()).rejects.toThrow(errors.MissingFunctionError)
  expect(save()).rejects.toThrow(errors.MissingFunctionError)

  const fn1 = () => {}
  const fn2 = () => {}
  config.setLoadFn(fn1)
  config.setSaveFn(fn2)
  expect(configObj.loadFn).toBe(fn1)
  expect(configObj.saveFn).toBe(fn2)
  expect(load()).resolves.toBeUndefined()
  expect(save()).resolves.toBeUndefined()
})

test('use load/save functions', async () => {
  let db = []

  const functions = [
    [
      async () => db,
      async (log) => {
        db.push(log)
      }
    ], // Async functions
    [
      () => db,
      (log) => {
        db.push(log)
      }
    ] // Sync functions
  ]

  for (const [loadFn, saveFn] of functions) {
    db = []
    process.env.NODE_ENV = 'development'
    config.setLoadFn(loadFn)
    config.setSaveFn(saveFn)
    expect(load()).resolves.toBe(db)

    // Log on development (don't save - return false)
    const logResult1 = log('Test')('Hello')
    expect(await logResult1).toEqual(false)
    expect(await load()).toEqual([])

    // Log on production (save - return true)
    process.env.NODE_ENV = 'production'
    const logResult2 = log('Test')('Hello')
    expect(await logResult2).toEqual(true)
    expect(await load()).toEqual([logResult2.opts])

    // Ignore production (but only on console - save - return true)
    const logResult3 = log('Test', true)('Hello')
    expect(await logResult3).toEqual(true)
    expect(await load()).toEqual([logResult2.opts, logResult3.opts])

    // Ignore logger (don't save - return false)
    const logResult4 = log('Test', true, false, true)('Hello')
    expect(await logResult4).toEqual(false)
    expect(await load()).toEqual([logResult2.opts, logResult3.opts])

    process.env.NODE_ENV = env
  }
})
