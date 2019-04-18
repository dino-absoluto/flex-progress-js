/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * Copyright 2019 Dino <dinoabsoluto+dev@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/* eslint-env jest */
/* imports */
import { AbstractElement, Base } from '../base'
import { Group } from '../group'

/* code */
const immediate = (): Promise<void> => {
  return new Promise((resolve): void => void setImmediate(resolve))
}

describe('AbstractElement', (): void => {
  test('simple', async (): Promise<void> => {
    interface TestI {
      a: number
      b: number
      c: number
    }
    class TestE extends AbstractElement {
      public count = 0
      public tProxy = this.proxy
      public tFlush = this.flush
      public constructor (opts: TestI) {
        super()
        Object.assign(this.data, opts)
      }
      public handleFlush (): void {
        this.count++
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
    {
      const temp = tProxy.a
      tProxy.a = temp
    }
    await immediate()
    expect(node.count).toBe(2)
  })
})

describe('Base', (): void => {
  class TestBase extends Base {
    public handleCalculateWidth (): number {
      return 1
    }
    public handleRender (): string[] {
      return ['abc', '#']
    }
  }
  test('simple', async (): Promise<void> => {
    const b = new TestBase()
    expect(b.render()).toBe('abc#')
    b.postProcess = (a, b): string => [ b, a ].join('')
    expect(b.render()).toBe('#abc')
    b.enabled = false
    expect(b.render()).toBe('')
    b.enabled = true
    expect(b.render()).toBe('#abc')
    expect(b.render(0)).toBe('')
  })
  test('options', async (): Promise<void> => {
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
    {
      const b = new TestBase({
        width: 10,
        postProcess: (a, b): string => [ b, a ].join('')
      })
      expect(b.calculateWidth()).toBe(10)
      expect(b.render()).toBe('#abc')
    }
  })
  test('incorrect value', async (): Promise<void> => {
    const b = new TestBase({
      width: 10
    })
    expect(b.minWidth).toBe(10)
    b.minWidth = 'zero' as unknown as number
    expect(b.minWidth).toBe(0)
    expect(b.maxWidth).toBe(10)
    b.maxWidth = 'infinity' as unknown as number
    expect(b.maxWidth).toBe(Number.MAX_SAFE_INTEGER)
    expect((): void => void b.width).toThrow()
    b.flex = 1
    expect(b.flexGrow).toBe(1)
    expect(b.flexShrink).toBe(1)
    b.flex = -1
    expect(b.flexGrow).toBe(0)
    expect(b.flexShrink).toBe(0)
  })
  test('notify', async (): Promise<void> => {
    const b = new TestBase({
      width: 10
    })
    const group = new Group()
    group.append(b)
    expect(b.parent).toBe(group)
    const mockNotify = jest.fn(group.notify)
    group.notify = mockNotify
    b.width = 15
    await immediate()
    expect(mockNotify.mock.calls.length).toBe(1)
  })
})
