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
import { SYNCING_INTERVAL } from '../../common'
import { Output, TargetTTY } from '../output'
import { Spinner } from '../../components/spinner'
import { Writable } from 'stream'
import stripANSI from 'strip-ansi'

const delay = (time: number): Promise<void> => {
  return new Promise((resolve): void => void setTimeout(resolve, time))
}

class TestStream extends Writable {
  public data = ''
  public _write (chunk: string | Buffer,
    _enc: string,
    cb: (err: Error | null) => void): void {
    this.data += chunk.toString()
    cb(null)
  }
}

class TestStreamTTY extends TestStream {
  public readonly isTTY = true
}

class TestOutput extends Output {
  public i = 0
  public end = false
  public scheduled = false
  public nextFrame (cb: (frame: number) => void): boolean {
    this.scheduled = true
    if (this.end) {
      return false
    }
    return super.nextFrame(cb)
  }
  public update (): void {
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
describe('Output as TTY', (): void => {
  test('constructor', async (): Promise<void> => {
    const isTTY = process.stderr.isTTY
    process.stderr.isTTY = true
    const out = new Output()
    process.stderr.isTTY = isTTY
    out.clear()
  })
  test('simple', async (): Promise<void> => {
    class Test1 extends TestOutput {
      public eCounter = 0
      public get elapsed (): number {
        this.eCounter += SYNCING_INTERVAL
        return this.eCounter
      }
    }
    const stream = new TestStreamTTY()
    const p = new Promise((resolve): void => void stream.on('finish', resolve))
    const out = new Test1({ stream })
    out.append('ABC')
    out.append(new Spinner())
    out.clearLine()
    await p
    expect(stripANSI(stream.data)).toBe(
      'ABC⠋ABC⠙ABC⠹ABC⠸ABC⠼ABC⠴ABC⠦ABC⠧ABC⠇ABC⠏ABC⠋')
  })
  test('timer', async (): Promise<void> => {
    const stream = new TestStreamTTY()
    const out = new TestOutput({ stream })
    const elapsed = out.elapsed
    await delay(10)
    expect(elapsed).toBeLessThan(out.elapsed)
  })
  test('parent & children', async (): Promise<void> => {
    const stream = new TestStreamTTY()
    const p = new Promise((resolve): void => void stream.on('finish', resolve))
    const out = new TestOutput({ stream })
    expect((): void => { out.parent = {} as unknown as undefined }).toThrow()
    out.append(1, 'ABC', 1)
    out.clear()
    out.append(1, '#ABC#', 1)
    await p
    expect(stripANSI(stream.data)).toBe(
      ' #ABC# ')
  })
  test('enabled', async (): Promise<void> => {
    const stream = new TestStreamTTY()
    const p = new Promise((resolve): void => void stream.on('finish', resolve))
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
  test('log', async (): Promise<void> => {
    class Test1 extends TestOutput {
      public eCounter = 0
      public get elapsed (): number {
        this.eCounter += SYNCING_INTERVAL
        return this.eCounter
      }
    }
    const stream = new TestStreamTTY()
    const p = new Promise((resolve): void => void stream.on('finish', resolve))
    const out = new Test1({ stream })
    out.flexGrow = 0
    out.append(new Spinner())
    out.nextFrame(() => {
      out.nextFrame(() => {
        out.log('log!')
        out.warn('warn!')
        out.error('error!')
      })
    })
    await p
    expect(stripANSI(stream.data)).toBe(
      '⠋log!\n⠋warn!\n⠋error!\n⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏⠋'
    )
  })
})

describe('Output as write-only', (): void => {
  test('simple', async (): Promise<void> => {
    class Test1 extends TestOutput {
      public eCounter = 0
      public get elapsed (): number {
        this.eCounter += SYNCING_INTERVAL
        return this.eCounter
      }
    }
    const stream = new TestStream()
    const p = new Promise((resolve): void => void stream.on('finish', resolve))
    const out = new Test1({ stream })
    out.append('ABC')
    out.append(new Spinner())
    out.clearLine()
    await p
    expect(stream.data).toBe(
      '\nABC⠋\nABC⠙\nABC⠹\nABC⠸\nABC⠼\nABC⠴\nABC⠦\nABC⠧\nABC⠇\nABC⠏\nABC⠋\n')
  })
})

describe('TargetTTY', (): void => {
  test('constructor', async (): Promise<void> => {
    expect((): TargetTTY => new TargetTTY(new TestStream())).toThrow()
  })
})
