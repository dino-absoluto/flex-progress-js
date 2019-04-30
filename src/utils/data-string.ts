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

export interface StringLike {
  length: number
  toString (): string
  concat (...args: StringLike[]): StringLike
}

/* code */
export class DataString implements StringLike {
  private text: string
  public length: number
  public constructor (text: string, width: number) {
    this.text = text
    this.length = width
  }

  public concat (...args: DataString[]): DataString {
    let { text, length } = this
    for (const s of args) {
      text += s.text
      length += s.length
    }
    return new DataString(text, length)
  }

  public toString (): string {
    return this.text
  }

  public [Symbol.toPrimitive] (): string {
    return this.text
  }
}
