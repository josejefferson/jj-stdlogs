// @ts-nocheck
import { log } from '../src'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

const env = process.env.NODE_ENV
afterAll(() => {
  process.env.NODE_ENV = env
})

test('console', () => {
  const consoleLogs = () => console.log.mock.calls.length

  process.env.NODE_ENV = 'development'
  expect(consoleLogs()).toBe(0)
  log('Title')('Hello')
  expect(consoleLogs()).toBe(1)
  log('Title', true)('Hello') // Hide production (but is development)
  expect(consoleLogs()).toBe(2)
  log('Title', true, true)('Hello') // Hide console
  expect(consoleLogs()).toBe(2)
  log('Title', false, false, true)('Hello') // Hide log (but no console)
  expect(consoleLogs()).toBe(3)

  process.env.NODE_ENV = 'production'
  log('Title')('Hello')
  expect(consoleLogs()).toBe(4)
  log('Title', true)('Hello')
  expect(consoleLogs()).toBe(4) // Hide production
  log('Title', false, true)('Hello')
  expect(consoleLogs()).toBe(4) // Hide console
  log('Title', true, false, true)('Hello')
  expect(consoleLogs()).toBe(4) // Hide production and logger
})
