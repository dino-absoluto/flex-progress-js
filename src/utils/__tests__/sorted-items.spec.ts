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
import { SortedItems } from '../sorted-items'

/* code */
describe('SortedItems', () => {
  test('simple', async () => {
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
      'zero'
    , 'one'
    , 'two'
    , 'three'
    , 'four'
    , 'five'
    , 'six'
    , 'seven'
    , 'eight'
    , 'nine'
    , 'ten'
    ]
    for (const [ index, { id, item } ] of values.entries()) {
      expect(id).toBe(index)
      expect(item).toBe(samples[index])
    }
    expect(array.indexOf(8, 'abc')).toBe(-1)
    expect(array.indexOf(8, 'eight')).toBe(8)
    expect(array.length).toBe(11)
    array.remove(8, 'abc')
    expect(array.length).toBe(11)
    expect(array.indexOf(8, 'eight')).toBe(8)
    array.remove(8, 'eight')
    expect(array.length).toBe(10)
    expect(array.indexOf(8, 'eight')).toBe(-1)
  })
})
