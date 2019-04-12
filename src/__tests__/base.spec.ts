/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progress-js - Progress indicator for Node.js
 * Copyright (C) 2019 Dino <dinoabsoluto+dev@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
/* imports */
import { BaseElement, Base, BaseData } from '../base'

/* code */
const immediate = () => {
  return new Promise(resolve => setImmediate(resolve))
}

describe('BaseElement', () => {
  test('simple', async () => {
    interface TestI {
      a: number
      b: number
      c: number
    }
    class TestE<T extends TestI> extends BaseElement<T> {
      count = 0
      tProxy = this.proxy
      tFlush = this.flush
      constructor (opts: TestI) {
        super()
        Object.assign(this.data, opts)
      }
      handleFlush () {
        this.count++
        return
      }
    }
    const node = new TestE({
      a: 0,
      b: 1,
      c: 2
    })
    expect(node.count).toBe(0)
    expect(node.tProxy).toMatchObject({
      a: 0,
      b: 1,
      c: 2
    })
    const tProxy = node.tProxy as TestI
    tProxy.a += 10
    tProxy.b += 10
    tProxy.c += 10
    expect(tProxy).toMatchObject({
      a: 10,
      b: 11,
      c: 12
    })
    expect(node.count).toBe(0)
    await immediate()
    expect(node.count).toBe(1)
    tProxy.a += 10
    tProxy.b += 10
    tProxy.c += 10
    expect(node.tProxy).toMatchObject({
      a: 20,
      b: 21,
      c: 22
    })
    expect(node.count).toBe(1)
    node.tFlush()
    expect(node.count).toBe(2)
    await immediate()
    expect(node.count).toBe(2)
    tProxy.a = tProxy.a
    await immediate()
    expect(node.count).toBe(2)
  })
})

describe('Base', () => {
  class TestBase extends Base<BaseData> {
    handleCalculateWidth () {
      return 1
    }
    handleRender () {
      return ['abc', '#']
    }
  }
  test('simple', async () => {
    const b = new TestBase()
    expect(b.render()).toBe('abc#')
    b.postProcess = (a, b) => [ b, a ].join('')
    expect(b.render()).toBe('#abc')
    b.enabled = false
    expect(b.render()).toBe('')
    b.enabled = true
    expect(b.render()).toBe('#abc')
    expect(b.render(0)).toBe('')
  })
  test('options', async () => {
    {
      const b = new TestBase({
        width: 10,
        flex: 1
      })
      expect(b.minWidth).toBe(10)
      expect(b.maxWidth).toBe(10)
      expect(b.isFlexible).toBe(false)
    }
    {
      const b = new TestBase({
        minWidth: 10,
        maxWidth: 20,
        flex: {
          grow: 1,
          shrink: 1
        }
      })
      expect(b.minWidth).toBe(10)
      expect(b.maxWidth).toBe(20)
      expect(b.isFlexible).toBe(true)
      b.enabled = false
      expect(b.calculateWidth()).toBe(0)
    }
  })
  test('incorrect value', async () => {
    const b = new TestBase({
      width: 10
    })
    expect(b.minWidth).toBe(10)
    b.minWidth = 'zero' as any
    expect(b.minWidth).toBe(0)
    expect(b.maxWidth).toBe(10)
    b.maxWidth = 'infinity' as any
    expect(b.maxWidth).toBe(Number.MAX_SAFE_INTEGER)
    expect(() => b.width).toThrow()
  })
})
