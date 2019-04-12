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
    expect(text.align).toBe(TextAlignment.Left)
    expect(text.render(10)).toBe('abc' + ' '.repeat(7))
    text.align = 'random' as any
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
