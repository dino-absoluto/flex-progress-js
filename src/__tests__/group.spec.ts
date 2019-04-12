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
import { Text } from '../text'
import { Group } from '../group'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Group', () => {
  test('flex.1', async () => {
    const group = new Group()
    const text = new Text({ text: 'a'.repeat(25), flex: 1 })
    group.append('abc')
    group.append(text)
    expect(group.render(20)).toBe('abc' + 'a'.repeat(16) + '…')
    const group2 = new Group()
    group2.append(group)
    expect(group2.render(20)).toBe('abc' + 'a'.repeat(16) + '…')
  })
  test('flex.2', async () => {
    const group = new Group()
    const group2 = new Group()
    group2.append(group)
    const text = new Text({ text: 'a'.repeat(25), flex: 1 })
    group.append('abc')
    group.append(text)
    expect(group.render(20)).toBe('abc' + 'a'.repeat(16) + '…')
    expect(group2.render(20)).toBe('abc' + 'a'.repeat(16) + '…')
  })
})
