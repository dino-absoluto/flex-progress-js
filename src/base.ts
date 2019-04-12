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
import { ChildElement, ParentElement } from './shared'
import once from 'lodash-es/once'
import clamp from 'lodash-es/clamp'
import castArray from 'lodash-es/castArray'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

export abstract class BaseElement<T extends object = {}> {
  protected proxy: Partial<T>
  protected data: Partial<T> = {}
  private pUpdate: Partial<T> = {}
  private pUpdateTimer?: ReturnType<typeof setImmediate>

  constructor () {
    this.proxy = new Proxy(this.data, {
      get: ($, prop: keyof T) => {
        const { pUpdate } = this
        if (pUpdate[prop] !== undefined) {
          return pUpdate[prop]
        } else {
          return $[prop]
        }
      },
      set: ($, prop: keyof T, value: any) => {
        if ($[prop] === this.pUpdate[prop] && $[prop] != null) {
          return true
        }
        this.pUpdate[prop] = value
        this.pSchedule()
        return true
      }
    })
  }

  private pSchedule = once(() => {
    this.pUpdateTimer = setImmediate(this.flush)
  })

  protected flush = () => {
    let pUpdateTimer
    ;[ pUpdateTimer, this.pUpdateTimer ] = [ this.pUpdateTimer, undefined ]
    if (pUpdateTimer) {
      clearImmediate(pUpdateTimer)
    }
    let data: Partial<T>
    ;[ data, this.pUpdate ] = [ this.pUpdate, {} ]
    this.handleFlush(data)
    Object.assign(this.data, data)
    this.pSchedule = once(() => {
      this.pUpdateTimer = setImmediate(this.flush)
    })
  }

  protected abstract handleFlush (data: Partial<T>): void

}

export type PostProcessFn = (...values: string[]) => string

export interface BaseData {
  minWidth: number
  maxWidth: number
  flexGrow: number
  flexShrink: number
  enabled: boolean
  postProcess?: PostProcessFn
}

export interface BaseOptions {
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

export abstract class Base<T extends BaseData>
extends BaseElement<T>
implements ChildElement {
  private pParent?: ParentElement
  outdated = false

  constructor (options?: BaseOptions) {
    super()
    if (!options) {
      return
    }
    if (options.width != null) {
      this.width = options.width
    }
    if (options.minWidth != null) {
      this.minWidth = options.minWidth
    }
    if (options.maxWidth != null) {
      this.maxWidth = options.maxWidth
    }
    if (options.flex != null) {
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

  get postProcess () { return this.proxy.postProcess }
  set postProcess (fn: PostProcessFn | undefined) {
    this.proxy.postProcess = fn
  }

  get parent () { return this.pParent }
  set parent (parent: ParentElement | undefined) {
    if (this.pParent != null) {
      this.beforeUnmount()
    }
    if (parent != null) {
      this.beforeMount(parent)
      this.pParent = parent
      this.mounted()
    }
  }

  protected beforeMount (_parent: ParentElement) {
    this.flush()
  }

  protected mounted () {
    return
  }

  protected beforeUnmount () {
    return
  }

  handleFlush (data: Partial<BaseData>) {
    const { parent } = this
    if (parent) {
      parent.notify(this, this.data, data)
    }
    this.outdated = true
    return
  }

  get width () { throw new Error('width has no fixed value') }
  set width (value: number) {
    this.minWidth = value
    this.maxWidth = value
  }

  get minWidth () { return this.proxy.minWidth || 0 }
  set minWidth (value: number) {
    this.proxy.minWidth = Math.max(value || 0, 0)
  }

  get maxWidth () { return this.proxy.maxWidth || Number.MAX_SAFE_INTEGER }
  set maxWidth (value: number) {
    this.proxy.maxWidth = Math.min(value || Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER)
  }

  set flex (value: number) {
    this.flexGrow = value
    this.flexShrink = value
  }

  /** Check if item is flexible */
  get isFlexible () {
    return this.minWidth < this.maxWidth
  }

  get flexGrow () { return this.proxy.flexGrow || 0 }
  set flexGrow (value: number) {
    this.proxy.flexGrow = Math.max(0, value || 0)
  }
  get flexShrink () { return this.proxy.flexShrink || 0 }
  set flexShrink (value: number) {
    this.proxy.flexShrink = Math.max(0, value || 0)
  }

  get enabled () { return this.proxy.enabled != null ? this.proxy.enabled : true }
  set enabled (value: boolean) {
    this.proxy.enabled = value
  }

  protected abstract handleCalculateWidth (): number
  protected abstract handleRender (maxWidth?: number): string | string[]

  protected beforeRender (_maxWidth?: number): boolean {
    return this.enabled
  }

  protected rendered (...texts: string[]): string {
    const { postProcess } = this
    if (postProcess) {
      return postProcess(...texts)
    }
    return texts.join('')
  }

  calculateWidth (): number {
    if (!this.enabled) {
      return 0
    }
    return clamp(this.handleCalculateWidth(),
      Math.min(this.minWidth, this.maxWidth),
      this.maxWidth)
  }

  render (maxWidth?: number): string {
    if (!this.beforeRender(maxWidth) || maxWidth === 0) {
      return ''
    }
    return this.rendered(...castArray(this.handleRender(maxWidth)))
  }

}
