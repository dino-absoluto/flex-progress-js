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
import { SYNCING_INTERVAL } from './shared'
import stringWidth from './optional/string-width'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

/** @public
 * Describe Spinner theme, this theme is compatible with `cli-spinners` package.
 */
export interface SpinnerTheme {
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

/** @public
 * Describe options to Spinner constructor()
 */
export interface SpinnerOptions extends BaseOptions {
  /**
   * Theme to use.
   */
  theme?: SpinnerTheme
  /**
   * By default, all spinners' animation is synced. Use this to offset
   * its syncing value.
   */
  frameOffset?: number
}

/** @public
 * Busy Spinner.
 * @property theme theme used to render
 * @property frameOffset the offset value to be added
 */
export class Spinner extends Base {
  public constructor (options: SpinnerOptions = {}) {
    super(options)
    if (options.theme != null) {
      this.theme = options.theme
    }
    if (options.frameOffset != null) {
      this.frameOffset = options.frameOffset
    }
  }

  /**
   * Internal clock.
   */
  public get time (): number { return this.proxy.time as number || 0 }
  public set time (time: number) {
    this.proxy.time = time
  }

  /**
   * The frame this element is going to be rendered at.
   */
  public get frame (): number { return this.proxy.frame as number || 0 }
  public set frame (frame: number) {
    this.proxy.frame = frame
  }

  /**
   * The offset added to the calculated frame.
   */
  public get frameOffset (): number {
    return this.proxy.frameOffset as number || 0
  }
  public set frameOffset (offset: number) {
    this.proxy.frameOffset = offset
  }

  /**
   * Tick the element internal clock.
   * @param interval the passage of time, in `ms`
   */
  public tick (interval: number = SYNCING_INTERVAL): void {
    const theme = this.theme as SpinnerThemeSized
    const time = (this.time >= 0 ? this.time : 0) +
      (interval >= 0 ? interval : SYNCING_INTERVAL)
    this.time = time
    this.frame =
      Math.floor(Math.round(time / SYNCING_INTERVAL) /
        Math.round((theme.interval / SYNCING_INTERVAL)))
  }

  /**
   * Should Spinner automatically tick according to time passage?
   */
  public get autoTicking (): boolean {
    const auto = this.proxy.autoTicking
    return this.enabled &&
      (auto != null ? !!auto : true)
  }
  public set autoTicking (auto: boolean) {
    this.proxy.autoTicking = auto
  }

  /**
   * Theme to use.
   */
  public get theme (): SpinnerTheme {
    return this.proxy.theme as SpinnerTheme || themeDefault
  }
  public set theme (spinner: SpinnerTheme) {
    if (!spinner.width) {
      spinner.width = stringWidth(spinner.frames[0])
    }
    this.proxy.theme = spinner as SpinnerThemeSized
    // this.pFrame = 0
  }

  /** @internal */
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

  /** @internal */
  protected handleCalculateWidth (): number {
    return (this.theme as SpinnerThemeSized).width
  }

  /** @internal */
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
