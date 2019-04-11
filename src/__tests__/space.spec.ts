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
import { Space } from '../space'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Space', () => {
  test('render()__flex.1', async () => {
    const sp = new Space(10)
    expect(sp.render(6)).toBe(' '.repeat(10))
    expect(sp.render(8)).toBe(' '.repeat(10))
    sp.flex = 1
    expect(sp.render(8)).toBe(' '.repeat(8))
  })
  test('render()__flex.2', async () => {
    const sp = new Space({ flex: 1 })
    expect(sp.render(8)).toBe(' '.repeat(8))
    sp.flex = 1
    expect(sp.render(20)).toBe(' '.repeat(20))
  })
  test('render()__flex.3', async () => {
    const sp = new Space({ minWidth: 5 })
    expect(sp.render(1)).toBe(' '.repeat(5))
    expect(sp.render(8)).toBe(' '.repeat(5))
    expect(sp.render(20)).toBe(' '.repeat(5))
    sp.flex = 1
    expect(sp.render(1)).toBe(' '.repeat(1))
    expect(sp.render(8)).toBe(' '.repeat(8))
  })
})
