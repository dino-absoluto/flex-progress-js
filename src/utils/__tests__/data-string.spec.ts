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
import { DataString } from '../data-string'

/* code */
describe('DataString', () => {
  test('simple', () => {
    const s = new DataString('abc', 1)
    expect(s.toString()).toBe('abc')
    expect(s + '').toBe('abc')
    expect('' + s).toBe('abc')
    expect(s.length).toBe(1)
  })
  test.each([
    {
      data: [
        new DataString('abc', 1),
        new DataString('ABC', 2),
        new DataString('!', 1)
      ],
      text: 'abcABC!',
      length: 4
    },
    {
      data: [
        new DataString('abc!', 1),
        'hello ',
        new DataString('world!', 1)
      ],
      text: 'abc!hello world!',
      length: 8
    }
  ])('concat', ({ data, text, length }) => {
    const first = new DataString('', 0)
    const r = first.concat(...data)
    expect(r.toString()).toBe(text)
    expect(r.length).toBe(length)
  })
})
