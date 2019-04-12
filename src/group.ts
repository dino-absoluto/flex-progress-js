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

interface Container {
  add (item: FlexChild, atIndex?: number): void
  remove (item: ChildElement): void
  append (...items: FlexChild[]): void
  clear (): void
}

export class Group<T extends GroupData = GroupData>
extends Base<T>
implements ParentElement, Container {
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
    this.notify()
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
    this.notify()
    return item
  }

  clear () {
    const { children } = this
    for (const item of children) {
      this.pItemRemoved(item)
    }
    children.length = 0
    this.notify()
  }

  append (...items: FlexChild[]) {
    const { children } = this
    for (const item of items) {
      const child = Group.pCastChild(item)
      children.push(child)
      this.pItemAdded(child)
    }
    this.notify()
  }

  notify (_child?: ChildElement) {
    const { parent } = this
    if (parent) {
      parent.notify(this, this.data, {})
    }
    return
  }
}
