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
import { ChildElement, ParentElement, FlexChild } from './shared'
import { Base, BaseOptions } from './base'
import { Static } from './static'
import { flex } from './utils/flex'

/* code */
/** @public */
export type GroupOptions = BaseOptions

/** @public
 * A group of elements.
 * `Group` handle how elements are rendered together.
 */
export class Group
  extends Base
  implements ParentElement {
  public readonly children: ChildElement[] = []

  public constructor (options?: BaseOptions) {
    super(Object.assign({
      flex: 1
    }, options))
  }

  protected handleCalculateWidth (): number {
    return this.children.reduce(
      (acc, child): number => acc + child.calculateWidth(), 0)
  }

  protected handleRender (maxWidth?: number): string | string[] {
    if (maxWidth == null) {
      return this.children.map((item): string => item.render())
    }
    const states = flex(this.children, maxWidth)
    const results: string[] & { leftOver?: number } =
    states.map((state): string => {
      return state.item.render(state.width)
    })
    results.leftOver = states.leftOver
    return results
  }

  public nextFrame (cb: (frame: number) => void): boolean {
    if (this.parent) {
      return this.parent.nextFrame(cb)
    }
    return false
  }

  /** @internal */
  private pItemAdded (item: ChildElement): void {
    item.parent = this
  }

  /** @internal */
  private pItemRemoved (item: ChildElement): void {
    item.parent = undefined
  }

  /** @internal */
  private static pCastChild (item: FlexChild): ChildElement {
    if (typeof item === 'string') {
      item = new Static(item)
    }
    if (typeof item === 'number') {
      item = new Static(item)
    }
    return item
  }

  public add (item: FlexChild, atIndex?: number): ChildElement {
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

  public remove (item: ChildElement): ChildElement | undefined {
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

  public clear (): void {
    const { children } = this
    for (const item of children) {
      this.pItemRemoved(item)
    }
    children.length = 0
    this.notify()
  }

  public append (...items: FlexChild[]): void {
    const { children } = this
    for (const item of items) {
      const child = Group.pCastChild(item)
      children.push(child)
      this.pItemAdded(child)
    }
    this.notify()
  }

  public notify (): void {
    const { parent } = this
    if (parent) {
      parent.notify()
    }
  }
}
