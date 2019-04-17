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
      [ 10, 10 ],
      [ 0, 0 ],
      [ 1, 1 ],
      [ 2, 2 ],
      [ 3, 3 ],
      [ 4, 4 ],
      [ 5, 5 ],
      [ 6, 6 ],
      [ 7, 7 ],
      [ 8, 8 ],
      [ 9, 9 ],
      [ 11, 10 ],
      [ 12, 10 ],
      [ 13, 10 ],
      [ 14, 10 ],
      [ 15, 10 ]
    ].forEach(([width, exp]) => {
      expect(bar.render(width)).toBe('░'.repeat(exp))
    })
  })
  test('render() ratio', async () => {
    const bar = new Bar({ ratio: 0.2 })
    expect(bar.render(10)).toBe('█'.repeat(1) + '░'.repeat(4))
    bar.minWidth = 10
    bar.ratio = 0.2
    expect(bar.render(10)).toBe('█'.repeat(2) + '░'.repeat(8))
    bar.ratio = 0.23
    expect(bar.render(10)).toBe('█'.repeat(2) + '░'.repeat(8))
    bar.ratio = 0.25
    expect(bar.render(10)).toBe('█'.repeat(2) + '▒' + '░'.repeat(7))
    bar.ratio = 0.27
    expect(bar.render(10)).toBe('█'.repeat(2) + '▓' + '░'.repeat(7))
    bar.ratio = 0.29
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
    bar.ratio = 0.2
    expect(bar.render(20)).toBe('#'.repeat(2) + '.'.repeat(8))
    bar.ratio = 0.25
    expect(bar.render(20)).toBe('#'.repeat(2) + '-' + '.'.repeat(7))
    bar.theme = {
      symbols: [ '0', '1', '2' ]
    }
    expect(bar.render(20)).toBe('2'.repeat(2) + '1' + '0'.repeat(7))
  })
  test('shrink', async () => {
    const bar = new Bar({ minWidth: 5 })
    expect(bar.render(1)).toBe('░')
    expect(bar.render()).toBe('░'.repeat(5))
    expect(bar.render(10)).toBe('░'.repeat(5))
    bar.flex = 1
    expect(bar.render(10)).toBe('░'.repeat(10))
    bar.minWidth = 15
    expect(bar.render(10)).toBe('░'.repeat(10))
  })
})
