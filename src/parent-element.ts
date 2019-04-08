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
import clamp from 'lodash-es/clamp'
import throttle from 'lodash-es/throttle'
import sortedIndexBy from 'lodash-es/sortedIndexBy'
import sortedLastIndexBy from 'lodash-es/sortedLastIndexBy'
import { Text } from './text'
import { Space } from './space'
import { Item } from './child-element'
import { ChildElement
  , ParentElement
  , SYNCING_INTERVAL } from './shared'

/* code */
const sortedIndexOfBy = <T, K extends keyof T>(
  array: ArrayLike<T>
, value: T
, iteratee: K): number => {
  const start = sortedIndexBy<T>(array, value, iteratee)
  const end = sortedLastIndexBy<T>(array, value, iteratee)
  for (let i = start; i < end; ++i) {
    if (array[i] === value) {
      return i
    }
  }
  return -1
}

class SortedObjects<T, K extends keyof T> {
  private $data: T[] = []
  private $identity: K
  constructor (identity: K) {
    this.$identity = identity
  }

  add (item: T) {
    const { $data, $identity } = this
    const index = sortedIndexBy($data, item, $identity)
    $data.splice(index, 0, item)
    return this
  }

  remove (item: T) {
    const { $data, $identity } = this
    const index = sortedIndexOfBy($data, item, $identity)
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

interface FlexState {
  width: number
  basis: number
}

type FlexChild = ChildElement | string | number

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** A group of ChildElement */
export class Group
  extends Item
  implements ParentElement {
  /* data */
  readonly children: ChildElement[] = []
  private flexGrowSum: number = 0
  private growable = new SortedObjects<ChildElement, 'flexGrow'>('flexGrow')
  private shrinkable = new SortedObjects<ChildElement, 'flexShrink'>('flexShrink')
  private $startTime = Date.now()

  get flexGrow () {
    return this.flexGrowSum && this.growable.length
  }
  get flexShrink () {
    return this.shrinkable.length / this.children.length
  }

  private $added (item: ChildElement) {
    item.parent = this
    if (item.flexGrow > 0) {
      this.flexGrowSum += item.flexGrow
      this.growable.add(item)
    }
    if (item.flexShrink > 0) {
      this.shrinkable.add(item)
    }
  }

  private $removed (item: ChildElement) {
    item.parent = undefined
    if (item.flexGrow > 0) {
      this.flexGrowSum -= item.flexGrow
      this.growable.remove(item)
    }
    if (item.flexShrink > 0) {
      this.shrinkable.remove(item)
    }
  }

  private static $castChild (item: FlexChild): ChildElement {
    if (typeof item === 'string') {
      item = new Text(item)
    }
    if (typeof item === 'number') {
      item = new Space({ width: item })
    }
    return item
  }

  add (item: FlexChild, atIndex?: number) {
    item = Group.$castChild(item)
    const { children } = this
    if (atIndex != null && Number.isInteger(atIndex) && Math.abs(atIndex) < children.length) {
      children.splice(atIndex, 0, item)
      this.$added(item)
    } else {
      children.push(item)
      this.$added(item)
    }
    return item
  }

  remove (item: ChildElement) {
    if (item.parent !== this) {
      return
    }
    const { children } = this
    const index = children.indexOf(item)
    children.splice(index, 1)
    this.$removed(item)
    return item
  }

  append (...items: FlexChild[]) {
    const { children } = this
    for (let item of items) {
      item = Group.$castChild(item)
      children.push(item)
      this.$added(item)
    }
  }

  clear () {
    const { children, growable, shrinkable } = this
    growable.clear()
    shrinkable.clear()
    for (const item of children) {
      this.$removed(item)
    }
    children.length = 0
  }

  private $sync = throttle(async () => {
    const frame = Math.floor((Date.now() - this.$startTime) / SYNCING_INTERVAL)
    return new Promise<number>((resolve) =>
      setTimeout(() => resolve(frame), SYNCING_INTERVAL))
  }, SYNCING_INTERVAL)

  sync () {
    if (this.parent) {
      return this.parent.sync()
    } else {
      return this.$sync()
    }
  }

  handleCalculateWidth () {
    const { children } = this
    return children.reduce((acc, item) => acc + item.calculateWidth(), 0)
  }

  handleRender (maxWidth?: number) {
    const isGrowable = !!(maxWidth && this.flexGrow)
    const isShrinkable = !!this.flexShrink
    maxWidth = Math.min(maxWidth || Number.MAX_SAFE_INTEGER, this.maxWidth)
    const { map, wantWidth } = this.newFlowState()
    if (isGrowable && wantWidth < maxWidth) {
      this.grow(map, wantWidth, maxWidth)
    } else if (isShrinkable && wantWidth > maxWidth) {
      this.shrink(map, wantWidth, maxWidth)
    }
    return [...map.entries()].map(([item, { width }]) => {
      return item.render(width)
    })
  }

  private newFlowState () {
    const map = new Map<ChildElement, FlexState>()
    let wantWidth = 0
    for (const item of this.children) {
      const width = item.calculateWidth()
      wantWidth += width
      map.set(item, {
        width,
        basis: 0
      })
    }
    return {
      map,
      wantWidth
    }
  }

  private growRound (map: Map<ChildElement, FlexState>
  , delta: number
  , method: typeof Math.ceil) {
    const { growable } = this
    let perFlex = delta / this.flexGrowSum
    for (const item of growable.valuesRight()) {
      const adjust = clamp(method(item.flexGrow * perFlex), 0, delta)
      const state = map.get(item) as FlexState
      delta -= adjust
      state.width += adjust
      if (delta === 0) {
        break
      }
    }
    return delta
  }
  private grow (map: Map<ChildElement, FlexState>
  , wantWidth: number
  , maxWidth: number) {
    let delta = maxWidth - wantWidth
    delta = this.growRound(map, delta, Math.floor)
    if (delta > 0) {
      delta = this.growRound(map, delta, Math.ceil)
    }
  }

  private shrinkRound (map: Map<ChildElement, FlexState>
  , delta: number
  , method: typeof Math.ceil) {
    const { shrinkable } = this
    let totalBasis = 0
    for (const item of shrinkable.valuesRight()) {
      const state = map.get(item) as FlexState
      const basis = state.width * item.flexShrink
      state.basis = basis
      totalBasis += basis
    }
    const perFlex = delta / totalBasis
    for (const item of shrinkable.valuesRight()) {
      const state = map.get(item) as FlexState
      const adjust = clamp(method(state.basis * perFlex), 0, delta)
      delta -= adjust
      state.width -= adjust
      if (delta === 0) {
        break
      }
    }
    return delta
  }

  private shrink (map: Map<ChildElement, FlexState>
  , wantWidth: number
  , maxWidth: number) {
    let delta = wantWidth - maxWidth
    delta = this.shrinkRound(map, delta, Math.floor)
    // console.log(wantWidth, maxWidth, delta, widths)
    if (delta > 0) {
      delta = this.shrinkRound(map, delta, Math.ceil)
      // console.log(wantWidth, maxWidth, delta, widths)
    }
  }
}
