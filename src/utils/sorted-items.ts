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
