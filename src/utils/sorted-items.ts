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
import sortedIndex from 'lodash-es/sortedIndex'
import sortedLastIndex from 'lodash-es/sortedLastIndex'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

class SortedWrapper<T> {
  id: number
  item: T
  constructor (id: number, item: T) {
    this.id = id,
    this.item = item
  }

  [Symbol.toPrimitive] () {
    return this.id
  }
}

export class SortedItems<T> {
  private $data: SortedWrapper<T>[] = []

  indexOf (id: number, item: T) {
    const { $data } = this
    const wrapper = new SortedWrapper(id, item)
    const index = sortedIndex($data, wrapper)
    if (index < 0) {
      return index
    }
    const last = sortedLastIndex($data, wrapper)
    for (let i = index; i < last; ++i) {
      if ($data[i].item === item) {
        return i
      }
    }
    return -1
  }

  add (id: number, item: T) {
    const { $data } = this
    const wrapper = new SortedWrapper(id, item)
    const index = sortedIndex($data, wrapper)
    $data.splice(index, 0, wrapper)
    return this
  }

  remove (id: number, item: T) {
    const { $data } = this
    const index = this.indexOf(id, item)
    if (index >= 0) {
      $data.splice(index, 1)
      return item
    }
    return item
  }

  get length () { return this.$data.length }
  clear () {
    this.$data.length = 0
  }

  values () {
    return (function * ($data) {
      for (const item of $data) {
        yield item
      }
    })(this.$data)
  }

  valuesRight () {
    return (function * ($data) {
      const length = $data.length
      for (let i = length - 1; i >= 0; --i) {
        yield $data[i]
      }
    })(this.$data)
  }
}
