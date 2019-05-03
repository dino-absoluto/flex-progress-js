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
import stringWidth from '../optional/string-width'
import truncate from '../utils/truncate'
import clamp = require('lodash/clamp')
import toString = require('lodash/toString')

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** @public
 * Text alignment, have the same meaning as most text editor.
 * This only have meaning of `Text` is flexible and there's more spaces
 * than the set text string.
 */
export const enum TextAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

/** @public
 * Describe options to Text constructor().
 */
export interface TextOptions extends BaseOptions {
  /** Initial text value */
  text?: string
  /** Use this to show that text has been truncated, default to '…' */
  more?: string
  /** Text alignment */
  align?: TextAlignment
}

/** @public
 * A text element.
 * Recommended properties:
 * - `flex` make it stretch
 * - `text` show this
 * - `align` make it center, left or right
 */
export class Text extends Base {
  public constructor (options: TextOptions | string = '') {
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

  /**
   * Text to display.
   */
  public get text (): string { return this.proxy.text as string || '' }
  public set text (value: string) {
    this.proxy.text = toString(value) || ''
  }

  /**
   * Symbol to indicate that text has been truncated.
   */
  public get more (): string { return this.proxy.more as string || '…' }
  public set more (value: string) {
    this.proxy.more = toString(value) || '…'
  }

  /**
   * Text alignement.
   */
  public get align (): TextAlignment {
    return this.proxy.align as TextAlignment || TextAlignment.Left
  }
  public set align (value: TextAlignment) {
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
      }
    }
  }

  /**
   * The raw text width.
   */
  public get length (): number { return stringWidth(this.text) }

  protected handleCalculateWidth (): number {
    return clamp(this.length, this.minWidth, this.maxWidth)
  }

  protected handleRender (maxWidth?: number): string {
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

  /** @internal Grow text to width */
  private grow (width: number): string {
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

  /** @internal Shrink text to width */
  private shrink (width: number): string {
    const { more } = this
    return truncate(this.text, width, { more, pad: true })
  }
}
