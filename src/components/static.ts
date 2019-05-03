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
import { ChildElement, ParentElement, StringLike } from '../common'
import { DataString } from '../utils/data-string'
import stringWidth from '../optional/string-width'
/* exports */

/** @public
 * A static element, rendered content will never change.
 * This element implements `ChildElement` interface.
 * All calculation is forgone. The rendered result is always the same.
 *
 * Static accept a `string` or `number` as its value, which as the same meaning
 * as `FlexChild`.
 * Optionally, you can provide a visual width of this string. This is
 * useful when you're using Escape code.
 */
export class Static implements ChildElement {
  public parent?: ParentElement
  public readonly text: StringLike
  public constructor (text: string | number, width?: number) {
    if (typeof text === 'number') {
      width = text
      text = ' '.repeat(text)
    }
    if (width == null) {
      width = stringWidth(text)
    }
    this.text = new DataString(text, width)
  }

  public render (_maxWidth?: number): StringLike {
    void (_maxWidth)
    return this.text
  }

  public calculateWidth (): number {
    return this.text.length
  }
  public markDirty (): void {}
  public get enabled (): true { return true }
  public get flexShrink (): 0 { return 0 }
  public get flexGrow (): 0 { return 0 }
  public get maxWidth (): number { return this.text.length }
  public get minWidth (): number { return this.text.length }
  public set flex (_value: number) {
    throw new Error('static cannot set flex')
  }
}
