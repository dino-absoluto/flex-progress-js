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
import { Bar } from '../bar'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Bar', () => {
  test('render() min/maxWidth', async () => {
    const bar = new Bar()
    expect(bar.render(10)).toBe('░'.repeat(5))
    bar.minWidth = 3
    expect(bar.render(10)).toBe('░'.repeat(3))
    /* Prefer maxWidth */
    bar.minWidth = 15
    bar.maxWidth = 10
    expect(bar.render(10)).toBe('░'.repeat(10))
    expect(bar.render(20)).toBe('░'.repeat(10))
    expect(bar.render(5)).toBe('░'.repeat(5))
  })
  test('render() flex', async () => {
    const bar = new Bar()
    bar.flex = 1
    bar.maxWidth = 10
    ;[
      [ 10, 10 ]
    , [ 0, 0 ]
    , [ 1, 1 ]
    , [ 2, 2 ]
    , [ 3, 3 ]
    , [ 4, 4 ]
    , [ 5, 5 ]
    , [ 6, 6 ]
    , [ 7, 7 ]
    , [ 8, 8 ]
    , [ 9, 9 ]
    , [ 11, 10 ]
    , [ 12, 10 ]
    , [ 13, 10 ]
    , [ 14, 10 ]
    , [ 15, 10 ]
    ].forEach(([width, exp]) => {
      expect(bar.render(width)).toBe('░'.repeat(exp))
    })
  })
  test('render() ratio', async () => {
    const bar = new Bar({ ratio: .2 })
    expect(bar.render(10)).toBe('█'.repeat(1) + '░'.repeat(4))
    bar.minWidth = 10
    bar.ratio = .2
    expect(bar.render(10)).toBe('█'.repeat(2) + '░'.repeat(8))
    bar.ratio = .23
    expect(bar.render(10)).toBe('█'.repeat(2) + '░'.repeat(8))
    bar.ratio = .25
    expect(bar.render(10)).toBe('█'.repeat(2) + '▒' + '░'.repeat(7))
    bar.ratio = .27
    expect(bar.render(10)).toBe('█'.repeat(2) + '▓' + '░'.repeat(7))
    bar.ratio = .29
    expect(bar.render(10)).toBe('█'.repeat(2) + '▓' + '░'.repeat(7))
  })
  test('theme', async () => {
    const bar = new Bar({
      theme: {
        symbols: ['.', '-', '#']
      }
    })
    bar.minWidth = 10
    expect(bar.render(20)).toBe('.'.repeat(10))
    bar.ratio = .2
    expect(bar.render(20)).toBe('#'.repeat(2) + '.'.repeat(8))
    bar.ratio = .25
    expect(bar.render(20)).toBe('#'.repeat(2) + '-' + '.'.repeat(7))
    bar.theme = {
      symbols: [ '0', '1', '2' ]
    }
    expect(bar.render(20)).toBe('2'.repeat(2) + '1' + '0'.repeat(7))
  })
  test('shrink', async () => {
    const bar = new Bar({ minWidth: 5 })
    expect(bar.render(1)).toBe('░')
  })
})
