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
/* eslint-env jest */
/* imports */
import { SortedItems } from '../sorted-items'

/* code */
describe('SortedItems', (): void => {
  test('simple', async (): Promise<void> => {
    let array = new SortedItems()
    array.add(5, 'five')
    array.add(2, 'two')
    array.add(4, 'four')
    array.add(1, 'one')
    array.add(6, 'six')
    array.add(3, 'three')
    array.add(0, 'zero')
    array.add(10, 'ten')
    array.add(8, 'eight')
    array.add(9, 'nine')
    array.add(7, 'seven')
    const values = [...array.values()]
    const samples = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten'
    ]
    for (const [ index, { id, item } ] of values.entries()) {
      expect(id).toBe(index)
      expect(item).toBe(samples[index])
    }
    const right = [...array.valuesRight()].reverse()
    for (const [ index, value ] of values.entries()) {
      expect(value).toBe(right[index])
    }
    expect(array.indexOf(20, 'abc')).toBe(-1)
    expect(array.indexOf(8, 'abc')).toBe(-1)
    expect(array.indexOf(8, 'eight')).toBe(8)
    expect(array.length).toBe(11)
    array.remove(8, 'abc')
    expect(array.length).toBe(11)
    expect(array.indexOf(8, 'eight')).toBe(8)
    array.remove(8, 'eight')
    expect(array.length).toBe(10)
    expect(array.indexOf(8, 'eight')).toBe(-1)
    array.clear()
    expect(array.length).toBe(0)
  })
})
