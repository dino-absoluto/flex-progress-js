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
import { Base, BaseOptions, BaseData } from './base'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

export type SpaceData = BaseData
export type SpaceOptions = BaseOptions

/** Empty space element */
export class Space<T extends SpaceData = SpaceData> extends Base<T> {
  constructor (options: BaseOptions | number = 1) {
    super(typeof options === 'number' ? undefined : options)
    if (typeof options === 'number') {
      this.width = options
    }
  }

  protected handleCalculateWidth () {
    return this.minWidth
  }

  protected handleRender (maxWidth?: number) {
    const growable = !!(maxWidth && this.flexGrow)
    const shrinkable = !!this.flexShrink
    maxWidth = Math.min(
      maxWidth != null ? maxWidth : Number.MAX_SAFE_INTEGER, this.maxWidth)
    const width = this.calculateWidth()
    if ((growable && width < maxWidth) ||
      (shrinkable && width > maxWidth)) {
      return ' '.repeat(maxWidth)
    }
    return ' '.repeat(width)
  }
}
