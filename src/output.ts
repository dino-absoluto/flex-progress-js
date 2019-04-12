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
export interface OutputStream extends NodeJS.WritableStream {
  isTTY?: boolean
  columns?: number
  rows?: number
}

/** Describe options to class Output constructor() */
export interface OutputOptions extends GroupOptions {
  stream?: OutputStream
}

export type OutputData = GroupData

type FrameCB = (frame: number) => void

/** Actual output to stderr */
export class Output<T extends OutputData = OutputData> extends Group<T> {
  readonly stream: OutputStream = process.stderr
  readonly isTTY: boolean = true
  private $lastColumns = 0
  private $lastWidth = 0
  private pCreatedTime = Date.now()
  private pNextFrameCBs = new Set<FrameCB>()
  renderedCount = 0

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

  get parent () { return undefined }
  set parent (_value: undefined) {
    throw new Error('class Output cannot have parent')
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
      /* Frame has to be updated after callbacks */
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
    this.renderedCount++
  }
}
