// @ts-nocheck
import { isColor, isLevel } from '../src/helpers'

test('tests isLevel function', () => {
  expect(isLevel('success')).toBe(true)
  expect(isLevel('Error')).toBe(true)
  expect(isLevel('ERROR  ')).toBe(true)
  expect(isLevel(' deBug\n')).toBe(true)
  expect(isLevel('\t INFO\n')).toBe(true)
  expect(isLevel('WARNING')).toBe(true)
  expect(isLevel('Other')).toBe(false)
  expect(isLevel()).toBe(false)
  expect(isLevel('')).toBe(false)
  expect(isLevel(' ')).toBe(false)
  expect(isLevel(1)).toBe(false)
  expect(isLevel(true)).toBe(false)
  expect(isLevel([])).toBe(false)
  expect(isLevel(['SUCCESS'])).toBe(false)
  expect(isLevel({})).toBe(false)
})

test('tests isColor function', () => {
  expect(isColor('red')).toBe(true)
  expect(isColor('Green')).toBe(false)
  expect(isColor('green ')).toBe(false)
  expect(isColor()).toBe(false)
  expect(isColor('')).toBe(false)
  expect(isColor(' ')).toBe(false)
  expect(isColor(1)).toBe(false)
  expect(isColor(true)).toBe(false)
  expect(isColor([])).toBe(false)
  expect(isColor(['blue'])).toBe(false)
  expect(isColor({})).toBe(false)
})
