/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Progress indicator for Node.js
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

/** Describe Spinner style */
interface SpinnerStyle {
  frames: string[]
  interval: number
  width?: number
}

/** Describe options to class Spinner constructor() */
interface SpinnerOptions extends ItemOptions {
  style?: SpinnerStyle
}

const styleDots = {
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
  private $style: SpinnerStyle & { width: number } = styleDots

  constructor (options: SpinnerOptions = {}) {
    super(options)
    if (options.style) {
      this.style = options.style
    }
  }

  /** Style to display spinner as */
  get style () { return this.$style }
  set style (spinner: SpinnerStyle) {
    if (!spinner.width) {
      spinner.width = stringWidth(spinner.frames[0])
    }
    this.$frame = 0
    this.$style = spinner as SpinnerStyle & { width: number }
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
    const { $frame, $style } = this
    frame = Math.floor(frame / Math.round(($style.interval / SYNCING_INTERVAL)))
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
    return this.$style.width
  }

  protected handleRender (maxWidth?: number) {
    if (maxWidth === 0) {
      return ''
    }
    let { $frame, style: { frames } } = this
    return frames[$frame % frames.length]
  }
}
