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
import { Text, TextAlignment } from '../text'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Text', () => {
  test('render() flex.1', async () => {
    const text = new Text({ text: 'a'.repeat(10), flex: 1 })
    expect(text.render(8)).toBe('a'.repeat(7) + '…')
  })
  test('render() flex.2', async () => {
    const text = new Text({ text: 'a'.repeat(10) })
    expect(text.render(8)).toBe('a'.repeat(10))
    text.flex = 1
    expect(text.render(8)).toBe('a'.repeat(7) + '…')
  })
  test('align default', async () => {
    const text = new Text({ text: 'abc', flex: 1 })
    expect(text.render(10)).toBe('abc' + ' '.repeat(7))
  })
  test('align center', async () => {
    const text = new Text({ text: 'abc', flex: 1, align: TextAlignment.Center })
    expect(text.render(10)).toBe(' '.repeat(3) + 'abc' + ' '.repeat(4))
  })
  test('align right', async () => {
    const text = new Text({ text: 'abc', flex: 1, align: TextAlignment.Right })
    expect(text.render(10)).toBe(' '.repeat(7) + 'abc')
  })
  test('more', async () => {
    const text = new Text({ text: 'a'.repeat(10), flex: 1, more: '++' })
    expect(text.render(8)).toBe('a'.repeat(6) + '++')
    text.more = '+++'
    expect(text.render(8)).toBe('a'.repeat(5) + '+++')
    expect(text.render(2)).toBe('  ')
    expect(text.render(0)).toBe('')
    text.more = null as any
    expect(text.render(4)).toBe('aaa…')
  })
  test('set text', async () => {
    {
      const text = new Text({ text: 'a'.repeat(4), flex: 1 })
      expect(text.render(8)).toBe('a'.repeat(4) + ' '.repeat(4))
      text.text = 'ABC'
      expect(text.render(8)).toBe('ABC' + ' '.repeat(5))
    }
    {
      const t = new Text()
      expect(t.text).toBe('')
      t.text = 'ABC'
      expect(t.render(8)).toBe('ABC')
      t.text = 10 as any
      expect(t.render(8)).toBe('10')
      t.text = null as any
      expect(t.render(8)).toBe('')
    }
  })
})
