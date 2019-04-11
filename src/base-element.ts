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
import once from 'lodash-es/once'
import castArray from 'lodash-es/castArray'
import { ChildElement, ParentElement } from './shared'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

export abstract class BaseElement<T extends object = {}> {
  constructor (data: T) {
    this.data = data
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
        if ($[prop] === this.pUpdate[prop]) {
          return true
        }
        this.pUpdate[prop] = value
        this.pSchedule()
        return true
      }
    })
  }
  protected proxy: T
  protected schedule = setImmediate
  protected data: T
  private pUpdate: Partial<T> = {}
  private pSchedule = once(() => {
    this.schedule(this.pFlush)
  })

  private pFlush = () => {
    let data: Partial<T>
    ;[ data, this.pUpdate ] = [ this.pUpdate, {} ]
    this.handleFlush(data)
    Object.assign(this.data, data)
    this.pSchedule = once(() => {
      this.schedule(this.pFlush)
    })
  }

  protected abstract handleFlush (data: Partial<T>): void

}

interface BaseData {
  minWidth: number
  maxWidth: number
  flexGrow: number
  flexShrink: number
  enabled: boolean
}

export abstract class Base<T extends BaseData>
extends BaseElement<T>
implements ChildElement {
  parent?: ParentElement
  outdated = false

  handleFlush (data: Partial<BaseData>) {
    const { parent } = this
    if (parent) {
      parent.notify(this, data)
    }
    this.outdated = true
    return
  }

  get width () { throw new Error('width has no fixed value') }
  set width (value: number) {
    this.minWidth = value
    this.maxWidth = value
  }

  get minWidth () { return this.proxy.minWidth }
  set minWidth (value: number) {
    this.proxy.minWidth = Math.max(value || 0, 0)
  }

  get maxWidth () { return this.proxy.maxWidth }
  set maxWidth (value: number) {
    this.proxy.maxWidth = Math.min(value || Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER)
  }

  set flex (value: number) {
    this.flexGrow = value
    this.flexShrink = value
  }

  get flexGrow () { return this.proxy.flexGrow }
  set flexGrow (value: number) {
    this.proxy.flexGrow = Math.max(0, value || 0)
  }
  get flexShrink () { return this.proxy.flexShrink }
  set flexShrink (value: number) {
    this.proxy.flexShrink = Math.max(0, value || 0)
  }

  get enabled () { return this.proxy.enabled }
  set enabled (value: boolean) {
    this.proxy.enabled = value
  }

  protected abstract handleCalculateWidth (): number
  protected abstract handleRender (maxWidth?: number): string | string[]

  protected beforeRender (_maxWidth?: number): boolean {
    return this.enabled
  }

  protected rendered (...texts: string[]): string {
    return texts.join('')
  }

  calculateWidth (): number {
    if (!this.enabled) {
      return 0
    }
    return this.handleCalculateWidth()
  }

  render (maxWidth?: number): string {
    if (!this.beforeRender(maxWidth) || maxWidth === 0) {
      return ''
    }
    return this.rendered(...castArray(this.render(maxWidth)))
  }
}
