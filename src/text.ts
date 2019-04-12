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
import stringWidth from './optional/string-width'
import clamp from 'lodash-es/clamp'
import toString from 'lodash-es/toString'

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
export interface TextOptions extends BaseOptions {
  text?: string
  more?: string
  align?: TextAlignment
}

export interface TextData extends BaseData {
  text: string
  more: string
  align: TextAlignment
}

/** A text element */
export class Text<T extends TextData = TextData> extends Base<T> {
  constructor (options: TextOptions | string = '') {
    super(typeof options !== 'string' ? options : undefined)
    if (typeof options === 'string') {
      this.text = options
    } else {
      if (options.text != null) {
        this.text = options.text
      }
      if (options.align != null) {
        this.align = options.align
      }
      if (options.more != null) {
        this.more = options.more
      }
    }
  }

  /** Text to display */
  get text () { return this.proxy.text || '' }
  set text (value: string) {
    this.proxy.text = toString(value) || ''
  }

  get more () { return this.proxy.more || '…' }
  set more (value: string) {
    this.proxy.more = toString(value) || '…'
  }

  get align () { return this.proxy.align || TextAlignment.Left }
  set align (value: TextAlignment) {
    switch (value) {
      case TextAlignment.Center: {
        this.proxy.align = TextAlignment.Center
        return
      }
      case TextAlignment.Right: {
        this.proxy.align = TextAlignment.Right
        return
      }
      default: {
        this.proxy.align = TextAlignment.Left
        return
      }
    }
  }

  /** The raw text width */
  get length () { return stringWidth(this.text) }

  protected handleCalculateWidth () {
    return clamp(this.length, this.minWidth, this.maxWidth)
  }

  protected handleRender (maxWidth?: number) {
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
    return text
  }

  /** Grow text to width */
  private grow (width: number) {
    let { text, align } = this
    const space = width - this.length
    let left = 0
    if (align === TextAlignment.Center) {
      left = Math.floor(space / 2)
    } else if (align === TextAlignment.Right) {
      left = space
    }
    const right = space - left
    return ' '.repeat(left) + text + ' '.repeat(right)
  }

  /** Shrink text to width */
  private shrink (width: number) {
    const { more } = this
    const length = stringWidth(more)
    if (width <= length) {
      return ' '.repeat(width)
    }
    return this.text.substr(0, width - stringWidth(more)) + more
  }
}
