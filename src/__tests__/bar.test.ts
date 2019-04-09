/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Progress indicator for Node.js
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
  test('render().min/maxWidth.1', async () => {
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
})
