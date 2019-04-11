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
import { BaseElement } from '../base-element'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

const immediate = () => {
  return new Promise(resolve => setImmediate(resolve))
}

describe('ElementNext', () => {
  test('simple', async () => {
    class TestE<T extends object> extends BaseElement<T> {
      count = 0
      tProxy = this.proxy
      tFlush = this.flush
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
    node.tProxy.a += 10
    node.tProxy.b += 10
    node.tProxy.c += 10
    expect(node.tProxy).toMatchObject({
      a: 10,
      b: 11,
      c: 12
    })
    expect(node.count).toBe(0)
    await immediate()
    expect(node.count).toBe(1)
    node.tProxy.a += 10
    node.tProxy.b += 10
    node.tProxy.c += 10
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
  })
})
