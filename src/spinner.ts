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
import { SYNCING_INTERVAL } from './shared'
import stringWidth from './optional/string-width'
// import once from 'lodash-es/once'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** Describe Spinner theme */
interface SpinnerTheme {
  frames: string[]
  interval: number
  width?: number
}

interface SpinnerThemeSized extends SpinnerTheme {
  width: number
}

export const themeDefault: SpinnerThemeSized = {
  width: 1,
  interval: 80,
  frames:
  [ '⠋'
  , '⠙'
  , '⠹'
  , '⠸'
  , '⠼'
  , '⠴'
  , '⠦'
  , '⠧'
  , '⠇'
  , '⠏'
  ]
}

Object.freeze(themeDefault)
Object.freeze(themeDefault.frames)

export const themeLine = {
  width: 1,
  interval: 120,
  frames:
  [ '~'
  , '\\'
  , '|'
  , '/'
  ]
}

/** Describe options to class Spinner constructor() */
interface SpinnerOptions extends BaseOptions {
  theme?: SpinnerTheme
  frameOffset?: number
}

interface SpinnerData extends BaseData {
  theme: SpinnerThemeSized
  autoTicking: boolean
  time: number
  frame: number
  frameOffset: number
}

/** Busy Spinner */
export class Spinner<T extends SpinnerData = SpinnerData> extends Base<T> {
  constructor (options: SpinnerOptions = {}) {
    super(options)
    if (options.theme != null) {
      this.theme = options.theme
    }
    if (options.frameOffset != null) {
      this.frameOffset = options.frameOffset
    }
  }

  get time () { return this.proxy.time || 0 }
  set time (time: number) {
    this.proxy.time = time
  }

  get frame () { return this.proxy.frame || 0 }
  set frame (frame: number) {
    this.proxy.frame = frame
  }

  get frameOffset () { return this.proxy.frameOffset || 0 }
  set frameOffset (offset: number) {
    this.proxy.frameOffset = offset
  }

  tick (interval: number = SYNCING_INTERVAL) {
    const theme = this.theme as SpinnerThemeSized
    const time = (this.time >= 0 ? this.time : 0) +
      (interval >= 0 ? interval : SYNCING_INTERVAL)
    this.time = time
    this.frame =
      Math.floor(Math.round(time / SYNCING_INTERVAL)
        / Math.round((theme.interval / SYNCING_INTERVAL)))
  }

  get autoTicking () {
    const auto = this.proxy.autoTicking
    return this.enabled &&
      (auto != null ? auto : true)
  }
  set autoTicking (auto: boolean) {
    this.proxy.autoTicking = auto
    // if (auto) {
    //   this.pStart()
    // }
  }

  /** Style to display spinner as */
  get theme () { return this.proxy.theme || themeDefault }
  set theme (spinner: SpinnerTheme) {
    if (!spinner.width) {
      spinner.width = stringWidth(spinner.frames[0])
    }
    this.proxy.theme = spinner as SpinnerThemeSized
    // this.pFrame = 0
  }

  private pHandleSync = (frame: number) => {
    if (this.parent && this.autoTicking) {
      const { frame: oldFrame, theme } = this
      frame = Math.floor(frame / Math.round((theme.interval / SYNCING_INTERVAL)))
      if (oldFrame !== frame) {
        this.frame = frame
      }
      this.parent.nextFrame(this.pHandleSync)
    }
  }

  protected handleCalculateWidth (): number {
    return (this.theme as SpinnerThemeSized).width
  }

  protected handleRender (maxWidth?: number) {
    const { frame, frameOffset, parent } = this
    const theme = this.theme as SpinnerThemeSized
    if (maxWidth != null && maxWidth < theme.width) {
      return ''
    }
    if (this.autoTicking && parent) {
      parent.nextFrame(this.pHandleSync)
    }
    return theme.frames[(frame + frameOffset) % theme.frames.length]
  }
}
