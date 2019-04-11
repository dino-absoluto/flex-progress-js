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
import { flex } from '../flex'

/* code */
describe('flex', () => {
  test('grow.1', async () => {
    const results = flex([
      {
        flexGrow: 0,
        flexShrink: 0,
        calculateWidth () { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth () { return 5 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('grow.2', async () => {
    const results = flex([
      {
        flexGrow: 1000,
        flexShrink: 0,
        calculateWidth () { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth () { return 5 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('grow.3', async () => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth () { return 3 }
      }, {
        flexGrow: .01,
        flexShrink: 0,
        calculateWidth () { return 5 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('grow.4', async () => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth () { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 0,
        calculateWidth () { return 0 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('shrink.1', async () => {
    const results = flex([
      {
        flexGrow: 0,
        flexShrink: 0,
        calculateWidth () { return 3 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth () { return 10 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('shrink.2', async () => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 10,
        calculateWidth () { return 1 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth () { return 40 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('shrink.3', async () => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth () { return 1 }
      }, {
        flexGrow: 1,
        flexShrink: .1,
        calculateWidth () { return 40 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
  test('shrink.4', async () => {
    const results = flex([
      {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth () { return 1 }
      }, {
        flexGrow: 1,
        flexShrink: 1,
        calculateWidth () { return 100000 }
      }
    ], 20)
    expect(results.reduce((acc, item) => acc + item.width, 0)).toBe(20)
  })
})
