/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Scripts to facilitate Japanese webnovel
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
/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** Describe a flex-progress element */
export interface Element {
  /** Fixed width element */
  width?: number
  /** Mimimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Flexing factor, set both grow and shrink */
  flex: number
  /** Grow factor */
  flexGrow: number
  /** Shrink factor */
  flexShrink: number
  /** Calculate uninhibited width */
  calculateWidth (): number
  /** Render item with max-width */
  render (maxWidth?: number): string
  /** Trigger an update */
  update (): void
}

/** Describe a child element */
export interface ChildElement extends Element {
  parent?: ParentElement
}

/** Describe a parent element */
export interface ParentElement extends Element {
  /** Array of child elements */
  children: ChildElement[]
  /** Add element */
  add (child: ChildElement, atIndex?: number): ChildElement
  /** Remove element */
  remove (child: ChildElement): ChildElement
  /** Clear all elements */
  clear (): void
  /** Add elements to the end.
   * @param {...ChildElement} items of child element
   */
  append (...items: ChildElement[]): void
}

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
  private $willUpdate = false

  constructor (options: ItemOptions = {}) {
    if (options.width != null) {
      this.width = options.width
    }
    this.minWidth = options.minWidth || 0
    this.maxWidth = options.maxWidth || Number.MAX_SAFE_INTEGER
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
  protected wrap (...text: string[]): string {
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
    }
    this.$willUpdate = false
  }

  /** Schedule an update */
  update () {
    if (this.$willUpdate) {
      return
    }
    this.$willUpdate = true
    setImmediate(() => this.handleUpdate())
    return false
  }

  /** Call when parent is set */
  mounted (_parent: ParentElement) { return }
  /** Call when parent is unset */
  willUnmount (_parent: ParentElement) { return }

  /** Render this item */
  render (maxWidth?: number): string {
    if (maxWidth === 0) {
      return ''
    }
    return this.wrap(...castArray(this.handleRender(maxWidth)))
  }

  /** Calculate this item width */
  calculateWidth (): number {
    return this.handleCalculateWidth()
  }

  /** Handle render event */
  abstract handleRender (maxWidth?: number): string | string[]
  /** Handle calculate-width event */
  abstract handleCalculateWidth (): number
}
