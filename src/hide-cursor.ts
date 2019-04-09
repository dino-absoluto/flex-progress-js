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
import { Item } from './child-element'
import { ParentElement } from './shared'
import { Output } from './out'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** Empty space element */
export class HideCursor extends Item {
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

  didMount (parent: ParentElement) {
    if (parent instanceof Output) {
      HideCursor.setCursor(parent.stream, false)
    }
  }

  willUnmount (parent: ParentElement) {
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
