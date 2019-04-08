/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Progress indicator for Node.js
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
import { Item, ItemOptions } from './child-element'
import clamp from 'lodash-es/clamp'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Describe options to class Bar constructor() */
interface BarOptions extends ItemOptions {
  symbols?: string[]
  ratio?: number
}

/** A progress bar */
export class Bar extends Item {
  symbols = [ '░', '▒', '▓', '█' ]
  // symbols = [ '.', '-', '=', '#' ]
  private $ratio = 0

  constructor (options: BarOptions = {}) {
    super(options)
    if (options.symbols != null) {
      this.symbols = options.symbols
    }
    if (options.ratio != null) {
      this.$ratio = options.ratio
    }
    if (!options.width && options.minWidth) {
      this.minWidth = 5
    }
  }

  /** Completion ratio, range from 0 to 1 */
  get ratio () { return this.$ratio }
  set ratio (value: number) {
    this.$ratio = clamp(value, 0, 1)
    this.update()
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
    return clamp(0, this.minWidth, this.maxWidth)
  }

  protected handleRender (maxWidth?: number) {
    if (maxWidth === 0) {
      return ''
    }
    let { ratio } = this
    const growable = !!(maxWidth && this.flexGrow)
    const shrinkable = !!this.flexShrink
    maxWidth = Math.min(maxWidth || Number.MAX_SAFE_INTEGER, this.maxWidth)
    let width = this.calculateWidth()
    if (growable && width < maxWidth) {
      width = maxWidth
    } else if (shrinkable && width > maxWidth) {
      width = maxWidth
    }
    return Bar.renderBar(this.symbols, ratio, width)
  }
}
