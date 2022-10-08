// @ts-nocheck
import { log, presets } from '../src'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

test('presets', () => {
  expect(log('Title', 'Code').success('Hello').opts).toMatchObject({
    title: 'Title',
    code: 'Code',
    level: 'SUCCESS',
    color: 'greenBright',
    contents: ['Hello']
  })

  const presetFn1 = (opts, contents) => ({
    params: ['Title', 404, 'magentaBright', 'INFO']
  })

  const presetFn2 = (opts, contents) => ({
    params: ['Title', 404, 'magentaBright', 'INFO'],
    content: ['Force content']
  })

  const presetFn3 = (opts, contents) => ({
    params: ['Title', 404, 'magentaBright', 'INFO'],
    content: ['Before content', ...contents]
  })

  presets.add('test1', presetFn1)
  presets.add('test2', presetFn2)
  presets.add('test3', presetFn3)

  console.log(log().test1('Test').opts)

  expect(log().test1('Test').opts).toMatchObject({
    title: 'Title',
    code: 404,
    level: 'INFO',
    color: 'magentaBright',
    contents: ['Test']
  })

  expect(log().test2('Test').opts).toMatchObject({
    contents: ['Force content']
  })

  expect(log().test2().opts).toMatchObject({
    contents: ['Force content']
  })

  expect(log().test3('Content1', 'Content2').opts).toMatchObject({
    contents: ['Before content', 'Content1', 'Content2']
  })

  expect(log().test3().opts).toMatchObject({
    contents: ['Before content']
  })

  expect(presets.presets[presets.presets.length - 3]).toEqual([
    'test1',
    presetFn1
  ])
  expect(presets.presets[presets.presets.length - 2]).toEqual([
    'test2',
    presetFn2
  ])
  expect(presets.presets[presets.presets.length - 1]).toEqual([
    'test3',
    presetFn3
  ])

  expect(() => log().inexistent()).toThrow(TypeError)
})
