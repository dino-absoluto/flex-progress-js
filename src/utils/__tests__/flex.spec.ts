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
import { flex } from '../flex'

/* code */
describe('flex', (): void => {
  test('grow.1', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 0,
        flexShrink: 0,
        calculateWidth (): number { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 5 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('grow.2', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1000,
        flexShrink: 0,
        calculateWidth (): number { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 5 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('grow.3', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 3 }
      }, {
        flexGrow: 0.01,
        flexShrink: 0,
        calculateWidth (): number { return 5 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('grow.4', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 0 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('grow.5', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 6 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 6 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 6 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('grow.6', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 7 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 6 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth (): number { return 6 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('shrink.1', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 0,
        flexShrink: 0,
        calculateWidth (): number { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 10 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('shrink.2', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 10,
        calculateWidth (): number { return 1 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 40 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('shrink.3', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 1 }
      }, {
        flexGrow: 1,
        flexShrink: 0.1,
        calculateWidth (): number { return 40 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('shrink.4', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 1 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 100000 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('shrink.5', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 7 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 7 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 7 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
  test('shrink.6', async (): Promise<void> => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 7 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 7 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth (): number { return 8 }
      }
    ], 20)
    expect(results.reduce((acc, item): number => acc + item.width, 0)).toBe(20)
  })
})
