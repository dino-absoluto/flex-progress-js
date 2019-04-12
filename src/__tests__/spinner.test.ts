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
import { Spinner, themeDefault, themeLine } from '../spinner'
import { Group } from '../group'
import { SYNCING_INTERVAL } from '../shared'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Spinner', () => {
  test('render()', async () => {
    const spin = new Spinner()
    expect(spin.calculateWidth()).toBe(1)
    expect(spin.autoTicking).toBe(true)
    for (let i = 0; i < 5; ++i) {
      for (const frame of themeDefault.frames) {
        expect(spin.render()).toBe(frame)
        spin.tick(themeDefault.interval)
      }
    }
  })
  test('render() offset', async () => {
    const spin = new Spinner({ frameOffset: 1 })
    const frames = Array.from(themeDefault.frames)
    frames.push(frames[0])
    frames.shift()
    expect(spin.calculateWidth()).toBe(1)
    for (let i = 0; i < 5; ++i) {
      for (const frame of frames) {
        expect(spin.render()).toBe(frame)
        spin.tick(themeDefault.interval)
      }
    }
  })
  test('theme', async () => {
    const spin = new Spinner({ theme: themeLine })
    expect(spin.calculateWidth()).toBe(1)
    for (let i = 0; i < 5; ++i) {
      for (const frame of themeLine.frames) {
        expect(spin.render()).toBe(frame)
        spin.tick(themeLine.interval)
      }
    }
    spin.theme = {
      interval: themeLine.interval,
      frames: themeLine.frames
    }
    expect(spin.calculateWidth()).toBe(1)
    for (let i = 0; i < 5; ++i) {
      for (const frame of themeLine.frames) {
        expect(spin.render()).toBe(frame)
        spin.tick(themeLine.interval)
      }
    }
  })
  test('theme invalid', async () => {
    const frames = themeLine.frames.map(i => i + i)
    const spin = new Spinner({
      theme: {
        interval: themeLine.interval,
        frames
      }
    })
    expect(spin.calculateWidth()).toBe(2)
    for (let i = 0; i < 5; ++i) {
      for (const frame of frames) {
        expect(spin.render()).toBe(frame)
        spin.tick(themeLine.interval)
      }
    }
    expect(spin.render(1)).toBe('')
  })
  test('values invalid', async () => {
    const spin = new Spinner()
    spin.time = -themeDefault.interval
    expect(spin.render()).toBe(themeDefault.frames[0])
    spin.theme = {
      interval: SYNCING_INTERVAL * 2,
      frames: themeDefault.frames
    }
    spin.tick()
    spin.tick(-themeDefault.interval)
    expect(spin.render()).toBe(themeDefault.frames[1])
  })
  test('nextFrame', () => {
    const group = new Group()
    let i = 0
    group.nextFrame = (cb: (frame: number) => void) => {
      i++
      if (i > 10) {
        return false
      }
      cb(i)
      return true
    }
    const spin = new Spinner()
    group.append(spin)
    expect(group.render()).toBe(themeDefault.frames[0])
    expect(i).toBe(11)
    i = 0
    group.render()
    expect(i).toBe(11)
    spin.autoTicking = false
    expect(spin.autoTicking).toBe(false)
    i = 0
    group.render()
    expect(i).toBe(0)
  })
})
