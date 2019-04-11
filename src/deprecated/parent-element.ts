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
import clamp from 'lodash-es/clamp'
import once from 'lodash-es/once'
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

interface FlexItem {
  width: number
  basis: number
}

interface FlexState {
  flexGrowSum: number,
  map: Map<ChildElement, FlexItem>,
  wantWidth: number
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
      item = new Space(item)
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

  private $syncActual = async () => {
    const frame = Math.floor((Date.now() - this.$startTime) / SYNCING_INTERVAL)
    return new Promise<number>((resolve) =>
      setTimeout(() => {
        resolve(frame)
        this.$sync = once(this.$syncActual)
      }, SYNCING_INTERVAL))
  }

  private $sync = once(this.$syncActual)

  sync () {
    if (this.parent) {
      return this.parent.sync()
    } else {
      return this.$sync()
    }
  }

  protected handleCalculateWidth () {
    const { children } = this
    return children.reduce((acc, item) => acc + item.calculateWidth(), 0)
  }

  protected handleRender (maxWidth?: number) {
    maxWidth = Math.min(maxWidth || Number.MAX_SAFE_INTEGER, this.maxWidth)
    const state = this.newFlexState()
    const isGrowable = !!(maxWidth && state.flexGrowSum)
    const isShrinkable = !!this.flexShrink
    if (isGrowable && state.wantWidth < maxWidth) {
      this.grow(state, maxWidth)
      // const widths = [...map.entries()].map(([i, w]) => w.width)
      // const sum = widths.reduce((acc, c) => acc + c, 0)
      // if (sum !== 80) {
      //   console.log(sum, widths)
      // }
    } else if (isShrinkable && state.wantWidth > maxWidth) {
      this.shrink(state, maxWidth)
    }
    return [...state.map.entries()].map(([item, { width }]) => {
      return item.render(width)
    })
  }

  private newFlexState (): FlexState {
    const map = new Map<ChildElement, FlexItem>()
    let wantWidth = 0
    let flexGrowSum = 0
    for (const item of this.children) {
      const width = item.calculateWidth()
      wantWidth += width
      if (item.enabled && item.flexGrow > 0) {
        flexGrowSum += item.flexGrow
      }
      map.set(item, {
        width,
        basis: 0
      })
    }
    return {
      flexGrowSum,
      map,
      wantWidth
    }
  }

  private growRound (
    state: FlexState
  , delta: number
  , method: typeof Math.ceil) {
    const { growable } = this
    const { map } = state
    let perFlex = delta / state.flexGrowSum
    for (const item of growable.valuesRight()) {
      if (!item.enabled) {
        continue
      }
      const adjust = clamp(method(item.flexGrow * perFlex), 0, delta)
      const state = map.get(item) as FlexItem
      delta -= adjust
      state.width += adjust
      if (delta === 0) {
        break
      }
    }
    return delta
  }
  private grow (
    state: FlexState
  , maxWidth: number) {
    const { wantWidth } = state
    let delta = maxWidth - wantWidth
    delta = this.growRound(state, delta, Math.floor)
    if (delta > 0) {
      delta = this.growRound(state, delta, Math.ceil)
    }
  }

  private shrinkRound (
    state: FlexState
  , delta: number
  , method: typeof Math.ceil) {
    const { shrinkable } = this
    const { map } = state
    let totalBasis = 0
    for (const item of shrinkable.valuesRight()) {
      const state = map.get(item) as FlexItem
      const basis = state.width * item.flexShrink
      state.basis = basis
      totalBasis += basis
    }
    const perFlex = delta / totalBasis
    for (const item of shrinkable.valuesRight()) {
      const state = map.get(item) as FlexItem
      const adjust = clamp(method(state.basis * perFlex), 0, delta)
      delta -= adjust
      state.width -= adjust
      if (delta === 0) {
        break
      }
    }
    return delta
  }

  private shrink (
    state: FlexState
  , maxWidth: number) {
    const { wantWidth } = state
    let delta = wantWidth - maxWidth
    delta = this.shrinkRound(state, delta, Math.floor)
    // console.log(wantWidth, maxWidth, delta, widths)
    if (delta > 0) {
      delta = this.shrinkRound(state, delta, Math.ceil)
      // console.log(wantWidth, maxWidth, delta, widths)
    }
  }
}