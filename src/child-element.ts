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
import castArray from 'lodash-es/castArray'
import clamp from 'lodash-es/clamp'
import { ChildElement
, ParentElement } from './shared'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** Describe options to class Item constructor() */
export interface ItemOptions {
  /** Fixed width element */
  width?: number
  /** Mimimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Flexing factor, set both grow and shrink */
  flex?: {
    /** Grow factor */
    grow?: number
    /** Shrink factor */
    shrink?: number
  } | number
  /** Post process values */
  postProcess?: (...values: string[]) => string
}

/** Abstract class implementing the most basic functions for a ChildElement. */
export abstract class Item implements ChildElement {
  private $parent?: ParentElement
  private $minWidth: number = 0
  private $maxWidth: number = Number.MAX_SAFE_INTEGER
  private $flexGrow: number = 0
  private $flexShrink: number = 0
  private $postProcess?: (...values: string[]) => string
  private $updating = false
  private $enabled: boolean = true

  constructor (options: ItemOptions = {}) {
    if (options.width != null) {
      this.width = options.width
    }
    if (options.minWidth != null) {
      this.minWidth = options.minWidth || 0
    }
    if (options.maxWidth != null) {
      this.maxWidth = options.maxWidth || Number.MAX_SAFE_INTEGER
    }
    this.$postProcess = options.postProcess
    if (options.flex) {
      const { flex } = options
      if (typeof flex === 'number') {
        this.flex = flex
      } else {
        if (flex.grow != null) {
          this.flexGrow = flex.grow
        }
        if (flex.shrink != null) {
          this.flexShrink = flex.shrink
        }
      }
    }
  }

  /** The active state of the element */
  get enabled () { return this.$enabled }
  set enabled (value: boolean) {
    this.$enabled = value
  }

  /** Mimimum width */
  get minWidth () { return this.$minWidth }
  set minWidth (width: number) {
    this.$minWidth = Math.max(width || 0, 0)
  }

  /** Maximum width */
  get maxWidth () { return this.$maxWidth }
  set maxWidth (width: number) {
    this.$maxWidth = Math.min(width || Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER)
  }

  /** Set fixed width item */
  set width (width: number) {
    this.minWidth = width
    this.maxWidth = width
  }

  /** Check if item is flexible */
  get isFlexible () {
    return this.minWidth < this.maxWidth
  }

  /** Flex grow factor */
  get flexGrow () { return this.isFlexible ? this.$flexGrow : 0 }
  set flexGrow (flex: number) {
    this.$flexGrow = Math.max(0, flex || 0)
  }

  /** Flex shrink factor */
  get flexShrink () { return this.isFlexible ? this.$flexShrink : 0 }
  set flexShrink (flex: number) {
    this.$flexShrink = Math.max(0, flex || 0)
  }

  /** Flexing factor, set both grow and shrink */
  set flex (flex: number) {
    this.flexGrow = flex
    this.flexShrink = flex
  }

  /** Set/unset parent element */
  get parent () { return this.$parent }
  set parent (parent: ParentElement | undefined) {
    const { $parent } = this
    if ($parent) {
      this.willUnmount($parent)
    }
    this.$parent = parent
    if (parent) {
      this.mounted(parent)
    }
  }

  /** Results wrapper */
  private wrap (...text: string[]): string {
    if (this.$postProcess) {
      return this.$postProcess(...text)
    }
    return text.join('')
  }

  /** Handle update events */
  protected handleUpdate () {
    const { parent } = this
    if (parent) {
      parent.update()
      parent.sync().then(() => { this.$updating = false })
      // this.$updating = false
    } else {
      this.$updating = false
    }
  }

  /** Schedule an update */
  update () {
    if (this.$updating || !this.enabled) {
      return
    }
    this.$updating = true
    setImmediate(() => this.handleUpdate())
  }

  /** Call when parent is set */
  mounted (_parent: ParentElement) { return }
  /** Call when parent is unset */
  willUnmount (_parent: ParentElement) { return }

  /** Render this item */
  render (maxWidth?: number): string {
    if (maxWidth === 0 || !this.enabled) {
      return ''
    }
    return this.wrap(...castArray(this.handleRender(maxWidth)))
  }

  /** Calculate this item width */
  calculateWidth (): number {
    if (!this.enabled) {
      return 0
    }
    return clamp(this.handleCalculateWidth(),
      Math.min(this.minWidth, this.maxWidth),
      this.maxWidth)
  }

  /** Handle render event */
  protected abstract handleRender (maxWidth?: number): string | string[]
  /** Handle calculate-width event */
  protected abstract handleCalculateWidth (): number
}
