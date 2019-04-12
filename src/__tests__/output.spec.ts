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
import { SYNCING_INTERVAL } from '../shared'
import { Output } from '../output'
import { Spinner } from '../spinner'
import { Writable } from 'stream'
import stripANSI from 'strip-ansi'

const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

class TestStream extends Writable {
  data = ''
  _write (chunk: string | Buffer, _enc: string, cb: (err: Error | null) => void) {
    this.data += chunk.toString()
    cb(null)
  }
}

class TestOutput extends Output {
  i = 0
  end = false
  scheduled = false
  nextFrame (cb: any) {
    this.scheduled = true
    if (this.end) {
      return false
    }
    return super.nextFrame(cb)
  }
  update () {
    this.i++
    if (this.end) {
      return
    }
    super.update()
    if (this.i > 10 || !this.scheduled) {
      this.end = true
      this.stream.end()
    }
    this.scheduled = false
  }
}

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Output', () => {
  test('simple', async () => {
    class Test1 extends TestOutput {
      eCounter = 0
      get elapsed () {
        this.eCounter += SYNCING_INTERVAL
        return this.eCounter
      }
    }
    const stream = new TestStream()
    const p = new Promise(resolve => stream.on('finish', resolve))
    const out = new Test1({ stream })
    out.append('Hello')
    out.append(new Spinner())
    out.clearLine()
    await p
    expect(stripANSI(stream.data)).toBe(
      'Hello⠋Hello⠙Hello⠙Hello⠹Hello⠹Hello⠸Hello⠸Hello⠼Hello⠼Hello⠴Hello⠴')
  })
  test('timer', async () => {
    const stream = new TestStream()
    const out = new TestOutput({ stream })
    const elapsed = out.elapsed
    await delay(10)
    expect(elapsed).toBeLessThan(out.elapsed)
  })
  test('parent & children', async () => {
    const stream = new TestStream()
    const p = new Promise(resolve => stream.on('finish', resolve))
    const out = new TestOutput({ stream })
    expect(() => { out.parent = {} as any }).toThrow()
    out.append(1, 'ABC', 1)
    out.clear()
    out.append(1, '#ABC#', 1)
    await p
    expect(stripANSI(stream.data)).toBe(
      ' #ABC# ')
  })
  test('enabled', async () => {
    const stream = new TestStream()
    const p = new Promise(resolve => stream.on('finish', resolve))
    const out = new TestOutput({ stream })
    out.flexGrow = 0
    out.append('ABC')
    out.notify()
    out.enabled = false
    out.append('#')
    out.notify()
    out.remove(out.children[1])
    out.enabled = true
    out.notify()
    await p
    expect(stripANSI(stream.data)).toBe(
      'ABC')
  })
})
