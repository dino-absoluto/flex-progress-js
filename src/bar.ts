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
import { Base, BaseOptions, BaseData } from './base'
import clamp from 'lodash-es/clamp'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Describe a progress theme to class Bar constructor() */
interface BarTheme {
  symbols: string[]
}

const defaultTheme: BarTheme = {
  // symbols: [ '.', '-', '=', '#' ]
  symbols: [ '░', '▒', '▓', '█' ]
}

/** Describe options to class Bar constructor() */
interface BarOptions extends BaseOptions {
  theme?: BarTheme
  ratio?: number
}

interface BarData extends BaseData {
  ratio: number
  theme: BarTheme
}

/** A progress bar */
export class Bar<T extends BarData> extends Base<T> {
  constructor (options: BarOptions = {}) {
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

  get theme () { return this.proxy.theme || defaultTheme }
  set theme (theme: BarTheme) {
    this.proxy.theme = theme
  }

  /** Completion ratio, range from 0 to 1 */
  get ratio () { return this.proxy.ratio || 0 }
  set ratio (value: number) {
    this.proxy.ratio = clamp(value, 0, 1)
  }

  /** Turn data to display string */
  static renderBar (symbols: string[], ratio: number, width: number): string[] {
    const stage = symbols.length - 1
    const count = Math.floor(width * stage * ratio)
    const progress = count % stage
    const fill = Math.floor((count - progress) / stage)
    const empty = width - ((progress && 1) || 0) - fill
    return [
      symbols[symbols.length - 1].repeat(fill),
      (progress && symbols[progress] || ''),
      symbols[0].repeat(empty)
    ]
  }

  protected handleCalculateWidth () {
    return this.minWidth
  }

  protected handleRender (maxWidth?: number) {
    if (maxWidth === 0) {
      return ''
    }
    let { ratio } = this
    const growable = !!(maxWidth && this.flexGrow)
    const shrinkable = !!this.flexShrink
    maxWidth = Math.min(maxWidth || Number.MAX_SAFE_INTEGER, this.maxWidth)
    let width = Math.min(maxWidth, this.calculateWidth())
    if (growable && width < maxWidth) {
      width = maxWidth
    } else if (shrinkable && width > maxWidth) {
      width = maxWidth
    }
    return Bar.renderBar(this.theme.symbols, ratio, width)
  }
}
