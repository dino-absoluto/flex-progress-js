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
