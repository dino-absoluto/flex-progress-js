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
import stringWidth from './optional/string-width'
/* exports */

export class Static implements ChildElement {
  parent?: ParentElement
  readonly text: string
  readonly width: number
  constructor (text: string | number, width?: number) {
    if (typeof text === 'number') {
      width = text
      text = ' '.repeat(text)
    }
    if (width == null) {
      width = stringWidth(text)
    }
    this.width = width
    this.text = text
  }

  render (_maxWidth?: number): string {
    return this.text
  }

  calculateWidth (): number {
    return this.width
  }
  get enabled () { return true }
  get flexShrink () { return 0 }
  get flexGrow () { return 0 }
  get maxWidth () { return this.width }
  get minWidth () { return this.width }
  set flex (_value: number) {
    throw new Error('static cannot set flex')
  }
}
