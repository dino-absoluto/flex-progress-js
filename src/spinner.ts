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
export interface SpinnerTheme {
  frames: string[]
  interval: number
  width?: number
}

export interface SpinnerThemeSized extends SpinnerTheme {
  width: number
}

export const themeDefault: SpinnerThemeSized = {
  width: 1,
  interval: 80,
  frames:
  [ '⠋',
    '⠙',
    '⠹',
    '⠸',
    '⠼',
    '⠴',
    '⠦',
    '⠧',
    '⠇',
    '⠏'
  ]
}

Object.freeze(themeDefault)
Object.freeze(themeDefault.frames)

export const themeLine = {
  width: 1,
  interval: 120,
  frames:
  [ '~',
    '\\',
    '|',
    '/'
  ]
}

/** Describe options to class Spinner constructor() */
export interface SpinnerOptions extends BaseOptions {
  theme?: SpinnerTheme
  frameOffset?: number
}

export interface SpinnerData extends BaseData {
  theme: SpinnerThemeSized
  autoTicking: boolean
  time: number
  frame: number
  frameOffset: number
}

/** Busy Spinner */
export class Spinner<T extends SpinnerData = SpinnerData> extends Base<T> {
  public constructor (options: SpinnerOptions = {}) {
    super(options)
    if (options.theme != null) {
      this.theme = options.theme
    }
    if (options.frameOffset != null) {
      this.frameOffset = options.frameOffset
    }
  }

  public get time (): number { return this.proxy.time || 0 }
  public set time (time: number) {
    this.proxy.time = time
  }

  public get frame (): number { return this.proxy.frame || 0 }
  public set frame (frame: number) {
    this.proxy.frame = frame
  }

  public get frameOffset (): number { return this.proxy.frameOffset || 0 }
  public set frameOffset (offset: number) {
    this.proxy.frameOffset = offset
  }

  public tick (interval: number = SYNCING_INTERVAL): void {
    const theme = this.theme as SpinnerThemeSized
    const time = (this.time >= 0 ? this.time : 0) +
      (interval >= 0 ? interval : SYNCING_INTERVAL)
    this.time = time
    this.frame =
      Math.floor(Math.round(time / SYNCING_INTERVAL) /
        Math.round((theme.interval / SYNCING_INTERVAL)))
  }

  public get autoTicking (): boolean {
    const auto = this.proxy.autoTicking
    return this.enabled &&
      (auto != null ? auto : true)
  }
  public set autoTicking (auto: boolean) {
    this.proxy.autoTicking = auto
  }

  /** Style to display spinner as */
  public get theme (): SpinnerTheme { return this.proxy.theme || themeDefault }
  public set theme (spinner: SpinnerTheme) {
    if (!spinner.width) {
      spinner.width = stringWidth(spinner.frames[0])
    }
    this.proxy.theme = spinner as SpinnerThemeSized
    // this.pFrame = 0
  }

  private pHandleSync = (frame: number): void => {
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

  protected handleRender (maxWidth?: number): string {
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
