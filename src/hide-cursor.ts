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
import { Base } from './base'
import { Output, OutputStream } from './output'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** @public
 * Hide console cursor, this only works when added to `Output` element.
 * When added, this will emit the Escape sequence to hide the cursor.
 * The Escape sequence to show the cursor will be emitted when it's removed.
 */
export class HideCursor extends Base {
  /** HideCursor doesn't accept any options. */
  public constructor () {
    super(undefined)
  }

  /** @internal
   * Set cursor visible state.
   */
  public static setCursor (stream: OutputStream, visible: boolean): void {
    if (!stream.isTTY) {
      return
    }
    if (!visible) {
      stream.write('\x1B[?25l')
    } else {
      stream.write('\x1B[?25h')
    }
  }

  /** @internal */
  protected mounted (): void {
    const { parent } = this
    if (parent instanceof Output) {
      HideCursor.setCursor(parent.stream, false)
    }
  }

  /** @internal */
  protected beforeUnmount (): void {
    const { parent } = this
    if (parent instanceof Output) {
      HideCursor.setCursor(parent.stream, true)
    }
  }

  protected handleCalculateWidth (): 0 {
    return 0
  }

  protected handleRender (): '' {
    return ''
  }
}
