import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { asyncPipe, pipe } from '../src/pipe.js'

describe('pipe', () => {
  it('should pipe functions correctly', () => {
    const add = (x: number) => x + 1
    const double = (x: number) => x * 2
    const subtract = (x: number) => x - 3
    const piped = pipe([add, double, subtract])

    assert.strictEqual(piped(5), 9)
  })

  it('should handle a single function', () => {
    const identity = (x: number) => x
    const piped = pipe([identity])

    assert.strictEqual(piped(10), 10)
  })

  it('should handle an empty pipe', () => {
    const piped = pipe([])
    assert.strictEqual(piped(42), 42)
  })

  it('should work with non-number types', () => {
    const toUpper = (str: string) => str.toUpperCase()
    const exclaim = (str: string) => `${str}!`
    const piped = pipe([toUpper, exclaim])

    assert.strictEqual(piped('hello'), 'HELLO!')
  })
})

describe('asyncPipe', () => {
  it('should async pipe functions correctly', async () => {
    const addAsync = (x: number) => Promise.resolve(x + 1)
    const doubleAsync = async (x: number) => Promise.resolve(x * 2)
    const subtractAsync = async (x: number) =>
      new Promise((res) => {
        setTimeout(() => {
          res(x - 3)
        }, 10)
      })
    const piped = asyncPipe([addAsync, doubleAsync, subtractAsync])

    const result = await piped(5)
    assert.strictEqual(result, 9)
  })

  it('should handle a single async function', async () => {
    const identityAsync = async (x: number) => Promise.resolve(x)
    const piped = asyncPipe([identityAsync])

    const result = await piped(10)
    assert.strictEqual(result, 10)
  })

  it('should handle an empty async pipe', async () => {
    const piped = asyncPipe([])
    const result = await piped(42)
    assert.strictEqual(result, 42)
  })

  it('should work with a mix of sync and async', async () => {
    const toUpperAsync = async (str: string) =>
      // eslint-disable-next-line no-return-await
      await Promise.resolve(str.toUpperCase())
    const exclaim = (str: string) => `${str}!`
    const piped = asyncPipe([toUpperAsync, exclaim])

    const result = await piped('hello')
    assert.strictEqual(result, 'HELLO!')
  })
})
