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
import { flex } from './utils/flex'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

export interface GroupData extends BaseData {
}

export interface GroupOptions extends BaseOptions {
}

export class Group<T extends GroupData = GroupData>
extends Base<T>
implements ParentElement {
  readonly children: ChildElement[] = []

  constructor (options: BaseOptions) {
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

  append (...items: (string | ChildElement)[]) {
    const { children } = this
    for (const item of items) {
      let child
      if (typeof item === 'string') {
        child = new Text(item)
      } else {
        child = item
      }
      children.push(child)
      child.parent = this
    }
  }

  notify () {
    return
  }
}
