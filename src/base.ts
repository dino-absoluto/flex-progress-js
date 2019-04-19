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
import { ChildElement, ParentElement } from './shared'
import once = require('lodash/once')
import clamp = require('lodash/clamp')
import castArray = require('lodash/castArray')

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** @public */
export interface AbstractData {
  [ key: string ]: unknown
}

/** @public */
export abstract class AbstractElement {
  protected proxy: AbstractData
  protected data: AbstractData = {}
  /** @internal */
  private pUpdate: AbstractData = {}
  /** @internal */
  private pUpdateTimer?: ReturnType<typeof setImmediate>

  public constructor () {
    this.proxy = new Proxy(this.data, {
      get: ($, prop: string): unknown => {
        const { pUpdate } = this
        if (pUpdate[prop] !== undefined) {
          return pUpdate[prop]
        } else {
          return $[prop]
        }
      },
      set: ($, prop: string, value: unknown): boolean => {
        if ($[prop] === value ||
          ($[prop] === this.pUpdate[prop] && $[prop] != null)) {
          return true
        }
        this.pUpdate[prop] = value
        this.pSchedule()
        return true
      }
    })
  }

  /** @internal */
  private pSchedule = once((): void => {
    this.pUpdateTimer = setImmediate(this.flush)
  })

  protected flush = (): void => {
    let pUpdateTimer
    ;[ pUpdateTimer, this.pUpdateTimer ] = [ this.pUpdateTimer, undefined ]
    if (pUpdateTimer) {
      clearImmediate(pUpdateTimer)
    }
    let data: AbstractData
    ;[ data, this.pUpdate ] = [ this.pUpdate, {} ]
    this.handleFlush(data)
    Object.assign(this.data, data)
    this.pSchedule = once((): void => {
      this.pUpdateTimer = setImmediate(this.flush)
    })
  }

  /** @internal */
  protected abstract handleFlush (data: AbstractData): void
}

/** @public Post processing function */
export type PostProcessFn = (...values: string[]) => string | string[]

/** @public Basic options elements should accept */
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
  postProcess?: PostProcessFn
}

/**
 * @public Base class for element.
 *
 * This implements almost all functionality for elements except rendering.
 * You need to implement `handleCalculateWidth()` and `handleRender()`
 * when subclassing this class.
 */
export abstract class Base
  extends AbstractElement
  implements ChildElement {
  /** @internal */
  private pParent?: ParentElement
  /** @internal */
  // protected outdated = false

  public constructor (options?: BaseOptions) {
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
    if (options.postProcess) {
      this.postProcess = options.postProcess
    }
  }

  /** Post process the rendered output */
  public get postProcess (): PostProcessFn | undefined {
    return this.proxy.postProcess as PostProcessFn
  }
  public set postProcess (fn: PostProcessFn | undefined) {
    this.proxy.postProcess = fn
  }

  /** Parent element */
  public get parent (): ParentElement | undefined { return this.pParent }
  public set parent (parent: ParentElement | undefined) {
    if (this.pParent != null) {
      this.beforeUnmount()
    }
    if (parent != null) {
      this.beforeMount(parent)
      this.pParent = parent
      this.mounted()
    }
  }

  /** @internal
   * Call before mounting
   */
  protected beforeMount (_parent: ParentElement): void {
    void (_parent)
    this.flush()
  }

  /** @internal
   * Call after mounting
   */
  protected mounted (): void {
  }

  /** @internal
   * Call before unmounting
   */
  protected beforeUnmount (): void {
  }

  /** @internal
   * Handle flush event
   */
  protected handleFlush (data: AbstractData): void {
    void (data)
    const { parent } = this
    if (parent) {
      parent.notify()
    }
    // this.outdated = true
  }

  /** The wanted width of the element */
  public get width (): number { throw new Error('width has no fixed value') }
  public set width (value: number) {
    this.minWidth = value
    this.maxWidth = value
  }

  /** Minimum necessary width */
  public get minWidth (): number { return this.proxy.minWidth as number || 0 }
  public set minWidth (value: number) {
    this.proxy.minWidth = value >= 0 ? value : 0
  }

  /** Maximum necessary width */
  public get maxWidth (): number {
    return this.proxy.maxWidth as number || Number.MAX_SAFE_INTEGER
  }
  public set maxWidth (value: number) {
    this.proxy.maxWidth = Math.min(value >= 0 ? value : Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER)
  }

  public set flex (value: number) {
    this.flexGrow = value
    this.flexShrink = value
  }

  /** Check if item is flexible */
  public get isFlexible (): boolean {
    return this.minWidth < this.maxWidth
  }

  /** How much the element will grow */
  public get flexGrow (): number {
    return (this.enabled && this.proxy.flexGrow as number) || 0
  }
  public set flexGrow (value: number) {
    this.proxy.flexGrow = value >= 0 ? value : 0
  }

  /** How much the element will shrink */
  public get flexShrink (): number {
    return (this.enabled && this.proxy.flexShrink as number) || 0
  }
  public set flexShrink (value: number) {
    this.proxy.flexShrink = value >= 0 ? value : 0
  }

  /** Is the element enabled? */
  public get enabled (): boolean {
    return this.proxy.enabled != null ? !!this.proxy.enabled : true
  }
  public set enabled (value: boolean) {
    this.proxy.enabled = value
  }

  /** @public
   * This function should return the desired width of this element.
   */
  protected abstract handleCalculateWidth (): number
  /** @public
   * This function should return the rendered text of this element.
   */
  protected abstract handleRender (maxWidth?: number): string | string[]

  /** @internal
   * This function will be called before rendering.
   */
  protected beforeRender (_maxWidth?: number): boolean {
    void (_maxWidth)
    return this.enabled
  }

  /** @internal
   * This function will be called after rendered.
   */
  protected rendered (texts: string[]): string {
    const { postProcess } = this
    if (postProcess) {
      texts = castArray(postProcess(...texts))
    }
    return texts.join('')
  }

  public calculateWidth (): number {
    if (!this.enabled) {
      return 0
    }
    return clamp(this.handleCalculateWidth(),
      Math.min(this.minWidth, this.maxWidth),
      this.maxWidth)
  }

  public render (maxWidth?: number): string {
    if (!this.beforeRender(maxWidth) || maxWidth === 0) {
      return ''
    }
    return this.rendered(castArray(this.handleRender(maxWidth)))
  }
}
