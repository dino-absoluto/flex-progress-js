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
import clamp from 'lodash-es/clamp'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Describe a progress theme to class Bar constructor() */
export interface BarTheme {
  symbols: string[]
}

const themeDefault: BarTheme = {
  // symbols: [ '.', '-', '=', '#' ]
  symbols: [ '░', '▒', '▓', '█' ]
}

/** @public Describe options to class Bar constructor() */
export interface BarOptions extends BaseOptions {
  theme?: BarTheme
  ratio?: number
}

/** @internal data */
export interface BarData extends BaseData {
  ratio: number
  theme: BarTheme
}

/** @public
 * A progress bar
 */
export class Bar<T extends BarData> extends Base<T> {
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

  /** Bar rendering theme */
  public get theme (): BarTheme { return this.proxy.theme || themeDefault }
  public set theme (theme: BarTheme) {
    this.proxy.theme = theme
  }

  /** Completion ratio, range from 0 to 1 */
  public get ratio (): number { return this.proxy.ratio || 0 }
  public set ratio (value: number) {
    this.proxy.ratio = clamp(value, 0, 1)
  }

  /** Turn data to display string */
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

  /** @internal */
  protected handleCalculateWidth (): number {
    return this.minWidth
  }

  /** @internal */
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
