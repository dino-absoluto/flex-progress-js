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
import stringWidth from './optional/string-width'
import defaults from 'lodash-es/defaults'
import clamp from 'lodash-es/clamp'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Text alignment */
export const enum TextAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

/** Describe options to class Text constructor() */
export interface TextOptions extends ItemOptions {
  text?: string
  align?: TextAlignment
}

/** A text element */
export class Text extends Item {
  _text = ''
  align: TextAlignment = TextAlignment.Center
  constructor (options: TextOptions = {}) {
    super(defaults(options, {
      flexShrink: 1
    }))
    if (options) {
      this.text = options.text || this.text
      this.align = options.align || this.align
    }
  }

  /** Text to display */
  get text () { return this._text }
  set text (value: string) {
    this._text = value
    this.update()
  }

  /** The raw text width */
  get length () { return stringWidth(this.text) }

  handleCalculateWidth () {
    return clamp(this.length, this.minWidth, this.maxWidth)
  }

  handleRender (maxWidth?: number) {
    let { text } = this
    const growable = !!(maxWidth && this.flexGrow)
    const shrinkable = !!this.flexShrink
    maxWidth = Math.min(
      maxWidth != null ? maxWidth : Number.MAX_SAFE_INTEGER, this.maxWidth)
    const length = this.length
    if (growable && length < maxWidth) {
      return this.grow(maxWidth)
    } else if (shrinkable && length > maxWidth) {
      return this.shrink(maxWidth)
    }
    const { minWidth } = this
    if (length < minWidth) {
      return this.grow(minWidth)
    }
    return text
  }

  /** Grow text to width */
  grow (width: number) {
    let { text } = this
    const space = width - this.length
    let left = 0
    if (this.align === TextAlignment.Center) {
      left = Math.floor(space / 2)
    } else if (this.align === TextAlignment.Right) {
      left = space
    }
    const right = space - left
    return ' '.repeat(left) + text + ' '.repeat(right)
  }

  /** Shrink text to width */
  shrink (width: number) {
    if (width <= 0) {
      return ''
    }
    return this.text.substr(0, width - 1) + '…'
  }
}
