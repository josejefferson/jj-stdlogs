// @ts-nocheck
import { log } from '../src'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.useFakeTimers().setSystemTime(new Date('2000-01-01T00:00:00.000Z'))
})

test('basic log', () => {
  const logResult = log('Hello World')()

  expect(logResult.opts).toMatchObject({
    date: '2000-01-01T00:00:00.000Z',
    title: 'Hello World',
    contents: []
  })

  return expect(logResult).resolves.toBe(false)
})

test('other logs', () => {
  expect(log('Title')().opts).toMatchObject({ title: 'Title', contents: [] })

  expect(log('Title', 'CODE')().opts).toMatchObject({
    title: 'Title',
    code: 'CODE'
  })

  expect(log('Title', 'CODE')('Content1', 'Content2').opts).toMatchObject({
    title: 'Title',
    code: 'CODE',
    contents: ['Content1', 'Content2']
  })

  expect(
    log('red', 'Title', 'CODE')('Content1', 'Content2').opts
  ).toMatchObject({
    title: 'Title',
    code: 'CODE',
    color: 'red',
    contents: ['Content1', 'Content2']
  })

  expect(log('Title').error().opts).toMatchObject({
    title: 'Title',
    color: 'redBright',
    level: 'ERROR'
  })

  expect(log('Title', 'green').error().opts).toMatchObject({
    title: 'Title',
    color: 'green',
    level: 'ERROR'
  })

  expect(log('info', 'Title', 'black', 'Code')(1).opts).toMatchObject({
    title: 'Title',
    color: 'black',
    code: 'Code',
    level: 'INFO',
    contents: [1]
  })

  expect(log(true)().opts).toMatchObject({
    hideProduction: true
  })

  expect(log(true, true, true)().opts).toMatchObject({
    hideProduction: true,
    hideConsole: true
  })

  expect(log(true, true, true)().opts).toMatchObject({
    hideProduction: true,
    hideConsole: true,
    ignoreLogger: true
  })

  expect(log('Title', 'Code', true, 'red')().opts).toMatchObject({
    title: 'Title',
    code: 'Code',
    color: 'red'
  })

  expect(log('Title', 'Code', true, 'red')().opts).not.toHaveProperty(
    'hideProduction'
  )

  expect(log('Title', { title: 'Other title' })().opts).toMatchObject({
    title: 'Other title'
  })

  expect(log('SUCCESS').error().opts).toMatchObject({
    level: 'SUCCESS',
    color: 'redBright'
  })

  expect(log('SUCCESS', 'greenBright').error().opts).toMatchObject({
    level: 'SUCCESS',
    color: 'greenBright'
  })

  expect(log('SUCCESS', { level: 'INFO' }).error().opts).toMatchObject({
    level: 'INFO',
    color: 'redBright'
  })

  expect(
    log('Title').error('BEFORE', new Error('Test Error'), 'AFTER').opts
  ).toMatchObject({
    title: 'Title',
    contents: ['BEFORE', 'Error: Test Error', 'AFTER'],
    level: 'ERROR',
    color: 'redBright',
    details: {
      errorInfo: {
        name: 'Error',
        message: 'Test Error'
      }
    }
  })

  const error = new Error('Message')
  error.line = 13

  expect(log().error(error).opts).toMatchObject({
    contents: ['Error: Message'],
    details: {
      errorInfo: {
        name: 'Error',
        message: 'Message',
        line: 13
      }
    }
  })
})
