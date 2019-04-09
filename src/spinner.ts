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
import { Item, ItemOptions } from './child-element'
import { ParentElement, SYNCING_INTERVAL } from './shared'
import stringWidth from './optional/string-width'
import once from 'lodash-es/once'

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

/** Describe options to class Spinner constructor() */
interface SpinnerOptions extends ItemOptions {
  theme?: SpinnerTheme
}

const themeDots: SpinnerThemeSized = {
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

// const styleLine = {
//   width: 1,
//   interval: 120,
//   frames:
//   [ '~'
//   , '\\'
//   , '|'
//   , '/'
//   ]
// }

/** Busy Spinner */
export class Spinner extends Item {
  width = 1
  private $frame = 0
  private $theme: SpinnerThemeSized = themeDots

  constructor (options: SpinnerOptions = {}) {
    super(options)
    if (options.theme) {
      this.theme = options.theme
    }
  }

  /** Style to display spinner as */
  get theme () { return this.$theme }
  set theme (spinner: SpinnerTheme) {
    if (!spinner.width) {
      spinner.width = stringWidth(spinner.frames[0])
    }
    this.$frame = 0
    this.$theme = spinner as SpinnerThemeSized
  }

  get enabled () { return super.enabled }
  set enabled (value) {
    super.enabled = value
    if (value) {
      this.$start()
    }
  }

  mounted (_parent: ParentElement) {
    this.$start()
  }

  private $startActual () {
    if (this.parent) {
      this.parent.sync().then(this.handleSync)
    }
  }

  private $start = once(() => {
    this.$startActual()
  })

  /** Synchronization function */
  private handleSync = (frame: number) => {
    const { $frame, $theme } = this
    frame = Math.floor(frame / Math.round(($theme.interval / SYNCING_INTERVAL)))
    if ($frame !== frame) {
      this.$frame = frame
      this.update()
    }
    if (this.parent && this.enabled) {
      /* Sync continuing */
      this.parent.sync().then(this.handleSync)
    } else {
      /* Reset sync */
      this.$start = once(() => {
        this.$startActual()
      })
    }
  }

  protected handleCalculateWidth (): number {
    return this.$theme.width
  }

  protected handleRender (maxWidth?: number) {
    if (maxWidth === 0) {
      return ''
    }
    let { $frame, theme: { frames } } = this
    return frames[$frame % frames.length]
  }
}
