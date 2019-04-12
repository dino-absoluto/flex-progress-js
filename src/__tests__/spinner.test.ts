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
import { Spinner, themeDefault, themeLine } from '../spinner'
import { Group } from '../group'

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
  })
})
