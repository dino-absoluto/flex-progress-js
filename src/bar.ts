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
import { Base, BaseOptions } from './base'
import clamp = require('lodash/clamp')

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** @public
 * Describe a progress `Bar` theme.
 */
export interface BarTheme {
  /**
   * Symbols used to render the bar.
   * - Symbol at 0 index means this block is empty.
   * - Symbol at the end means this block is completely filled.
   * - Other symbols in between are divided evenly.
   * NOTE: all symbols must have rendered width equal to `1`.
   */
  symbols: string[]
}

const themeDefault: BarTheme = {
  // symbols: [ '.', '-', '=', '#' ]
  symbols: [ '░', '▒', '▓', '█' ]
}

/** @public
 * Describe options to `Bar` constructor().
 */
export interface BarOptions extends BaseOptions {
  theme?: BarTheme
  ratio?: number
}

/** @public
 * A progress bar.
 * @property ratio the completion progress, clamped to [0, 1]
 * @property theme the theme to apply
 */
export class Bar extends Base {
  public constructor (options: BarOptions = {}) {
    super(options)
    if (options.theme != null) {
      this.theme = options.theme
    }
    if (options.ratio != null) {
      this.ratio = options.ratio
    }
    if (!options.width && !options.minWidth) {
      this.minWidth = 5
    }
  }

  /**
   * Theme to use.
   * @see BarTheme
   */
  public get theme (): BarTheme {
    return this.proxy.theme as BarTheme || themeDefault
  }
  public set theme (theme: BarTheme) {
    this.proxy.theme = theme
  }

  /**
   * The completion ratio, clamped to range from 0 to 1
   */
  public get ratio (): number {
    return this.proxy.ratio as number || 0
  }
  public set ratio (value: number) {
    this.proxy.ratio = clamp(value, 0, 1)
  }

  /** @internal
   * Turn data to display string.
   */
  public static renderBar (symbols: string[], ratio: number, width: number): string[] {
    const stage = symbols.length - 1
    const count = Math.floor(width * stage * ratio)
    const progress = count % stage
    const fill = Math.floor((count - progress) / stage)
    const empty = width - ((progress && 1) || 0) - fill
    return [
      symbols[symbols.length - 1].repeat(fill),
      ((progress && symbols[progress]) || ''),
      symbols[0].repeat(empty)
    ]
  }

  protected handleCalculateWidth (): number {
    return this.minWidth
  }

  protected handleRender (maxWidth?: number): string | string[] {
    let { ratio } = this
    const growable = !!(maxWidth && this.flexGrow)
    /* Dead code */
    // const shrinkable = !!this.flexShrink
    maxWidth = Math.min(maxWidth || Number.MAX_SAFE_INTEGER, this.maxWidth)
    let width = Math.min(maxWidth, this.calculateWidth())
    if (growable && width < maxWidth) {
      width = maxWidth
    // } else if (shrinkable && width > maxWidth) {
    //   width = maxWidth
    }
    return Bar.renderBar(this.theme.symbols, ratio, width)
  }
}
