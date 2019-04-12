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
import { Group, GroupData, GroupOptions } from './group'
import {
  clearLine
, clearScreenDown
, cursorTo } from 'readline'
import stringWidth from './optional/string-width'
import { SYNCING_INTERVAL } from './shared'
import once from 'lodash-es/once'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Describe options to class Output constructor() */
interface OutputOptions extends GroupOptions {
  stream?: NodeJS.WriteStream
}

export type OutputData = GroupData

type FrameCB = (frame: number) => void

/** Actual output to stderr */
export class Output<T extends OutputData> extends Group<T> {
  readonly stream: NodeJS.WriteStream = process.stderr
  readonly isTTY: boolean = true
  private $lastColumns = 0
  private $lastWidth = 0
  private pCreatedTime = Date.now()
  private pNextFrameCBs = new Set<FrameCB>()
  count = 0

  constructor (options?: OutputOptions) {
    super(options)
    if (options) {
      const { stream } = options
      if (stream) {
        this.stream = stream
        this.isTTY = !!stream.isTTY
      }
    }
  }

  get enabled () { return super.enabled }
  set enabled (value: boolean) {
    if (!value) {
      this.clearLine()
    } else {
      this.pScheduleFrame()
    }
    super.enabled = value
  }

  notify () {
    this.pScheduleFrame()
  }

  /** Elapsed time since creation */
  get elapsed () {
    return Date.now() - this.pCreatedTime
  }

  /** Clear display line */
  clearLine () {
    const { stream } = this
    clearLine(stream, 0)
    cursorTo(stream, 0)
  }

  clear (clearLine = true) {
    super.clear()
    if (clearLine) {
      this.clearLine()
    }
  }

  nextFrame (cb: (frame: number) => void) {
    const { pNextFrameCBs } = this
    pNextFrameCBs.add(cb)
    this.pScheduleFrame()
    return true
  }

  private pProcessFrame = () => {
    setTimeout(() => {
      const { pNextFrameCBs } = this
      const frame = Math.round(this.elapsed / SYNCING_INTERVAL)
      for (const cb of pNextFrameCBs) {
        cb(frame)
      }
      pNextFrameCBs.clear()
      this.pScheduleFrame = once(this.pProcessFrame)
      this.update()
    }, SYNCING_INTERVAL).unref()
  }

  private pScheduleFrame = once(this.pProcessFrame)

  /** Get display width */
  get columns () {
    return this.stream.columns || 40
  }

  protected update () {
    const { stream, columns, $lastColumns } = this
    const text = this.render(columns)
    {
      const width = stringWidth(text)
      if (width !== this.$lastWidth) {
        this.clearLine()
      }
      this.$lastWidth = width
    }
    if ($lastColumns !== columns) {
      this.$lastColumns = columns
      this.clearLine()
      clearScreenDown(stream)
    }
    stream.write(text)
    if (!this.flexGrow) {
      clearLine(stream, 1)
    }
    cursorTo(stream, 0)
    this.count++
  }
}
