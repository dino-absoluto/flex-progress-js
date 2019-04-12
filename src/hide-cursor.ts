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
import { Base, BaseData } from './Base'
import { Output } from './output'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** Hide console cursor, this can only work when added to an Output stream. */
export class HideCursor extends Base<BaseData> {
  /** HideCursor doesn't accept any options */
  constructor () {
    super()
  }

  /** Set cursor visible state */
  static setCursor (stream: NodeJS.WriteStream, visible: boolean) {
    if (!stream.isTTY) {
      return
    }
    if (!visible) {
      stream.write('\x1B[?25l')
    } else {
      stream.write('\x1B[?25h')
    }
  }

  mounted () {
    const { parent } = this
    if (parent instanceof Output) {
      HideCursor.setCursor(parent.stream, false)
    }
  }

  beforeUnmount () {
    const { parent } = this
    if (parent instanceof Output) {
      HideCursor.setCursor(parent.stream, true)
    }
  }

  protected handleCalculateWidth () {
    return 0
  }

  protected handleRender (_maxWidth?: number) {
    return ''
  }
}
