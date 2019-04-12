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
import { ChildElement, ParentElement } from './shared'
import { Base, BaseData, BaseOptions } from './base'
import { Text } from './text'
import { Space } from './space'
import { flex } from './utils/flex'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

export type GroupData = BaseData
export type GroupOptions = BaseOptions
type FlexChild = string | number | ChildElement

export class Group<T extends GroupData = GroupData>
extends Base<T>
implements ParentElement {
  readonly children: ChildElement[] = []

  constructor (options?: BaseOptions) {
    super(Object.assign({
      flex: 1
    }, options))
  }

  handleCalculateWidth () {
    return this.children.reduce((acc, child) => acc + child.calculateWidth(), 0)
  }

  handleRender (maxWidth?: number) {
    if (maxWidth == null) {
      return this.children.map(item => item.render())
    }
    const states = flex(this.children, maxWidth)
    return states.map(state => {
      return state.item.render(state.width)
    })
  }

  nextFrame (cb: (frame: number) => void) {
    if (this.parent) {
      return this.parent.nextFrame(cb)
    }
    return false
  }

  private pItemAdded (item: ChildElement) {
    item.parent = this
  }

  private pItemRemoved (item: ChildElement) {
    item.parent = undefined
  }

  private static pCastChild (item: FlexChild): ChildElement {
    if (typeof item === 'string') {
      item = new Text(item)
    }
    if (typeof item === 'number') {
      item = new Space(item)
    }
    return item
  }

  add (item: FlexChild, atIndex?: number) {
    item = Group.pCastChild(item)
    const { children } = this
    if (atIndex != null && Number.isInteger(atIndex) && Math.abs(atIndex) < children.length) {
      children.splice(atIndex, 0, item)
      this.pItemAdded(item)
    } else {
      children.push(item)
      this.pItemAdded(item)
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
    this.pItemRemoved(item)
    return item
  }

  clear () {
    const { children } = this
    for (const item of children) {
      this.pItemRemoved(item)
    }
    children.length = 0
  }

  append (...items: FlexChild[]) {
    const { children } = this
    for (const item of items) {
      const child = Group.pCastChild(item)
      children.push(child)
      this.pItemAdded(child)
    }
  }

  notify () {
    return
  }
}
