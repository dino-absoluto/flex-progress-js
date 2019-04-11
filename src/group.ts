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
import { Base, BaseData } from './base'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

export class Group<T extends BaseData = BaseData>
extends Base<BaseData>
implements ParentElement {
  readonly children: ChildElement[] = []
  handleCalculateWidth () {
    return 0
  }

  handleRender () {
    return ''
  }

  nextFrame () {
    return false
  }

  notify (child: ChildElement
  , before: Readonly<BaseData>
  , after: Readonly<Partial<BaseData>>) {
    return
  }
}
