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

interface Target {
  columns: number
  clearLine (): void
  update (text: string): void
}

export class TargetTTY implements Target {
  readonly stream: OutputStream = process.stderr
  readonly isTTY: boolean = true
  private pLastColumns = 0
  private pLastWidth = 0
  constructor (stream: OutputStream) {
    this.stream = stream
    if (!stream.isTTY) {
      throw new Error('stream is not TTY')
    }
  }

  /** Clear display line */
  clearLine () {
    const { stream } = this
    clearLine(stream, 0)
    cursorTo(stream, 0)
  }

  get columns () {
    return this.stream.columns || 40
  }

  update (text: string) {
    const { stream, columns, pLastColumns } = this
    {
      const width = stringWidth(text)
      if (width !== this.pLastWidth) {
        this.clearLine()
      }
      this.pLastWidth = width
    }
    if (pLastColumns !== columns) {
      this.pLastColumns = columns
      this.clearLine()
      clearScreenDown(stream)
    }
    stream.write(text)
    // if (!this.flexGrow) {
    //   clearLine(stream, 1)
    // }
    cursorTo(stream, 0)
    return text
  }
}

/** Actual output to stderr */
export class Output<T extends OutputData = OutputData> extends Group<T> {
  readonly stream: OutputStream
  readonly isTTY: boolean = true
  private pCreatedTime = Date.now()
  private pNextFrameCBs = new Set<FrameCB>()
  private pTarget: Target
  renderedCount = 0

  constructor (options?: OutputOptions) {
    super(options)
    if (options && options.stream) {
      const { stream } = options
      this.stream = stream
      this.isTTY = !!stream.isTTY
    } else {
      this.stream = process.stderr
      this.isTTY = !!this.stream.isTTY
    }
    this.pTarget = new TargetTTY(this.stream)
  }

  get parent () { return undefined }
  set parent (_value: undefined) {
    throw new Error('class Output cannot have parent')
  }

  get enabled () { return super.enabled }
  set enabled (value: boolean) {
    if (!value) {
      this.pTarget.clearLine()
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

  clear (clearLine = true) {
    super.clear()
    if (clearLine) {
      this.pTarget.clearLine()
    }
  }

  clearLine () {
    this.pTarget.clearLine()
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

  protected update () {
    this.renderedCount++
    const { pTarget } = this
    const text = this.render(pTarget.columns)
    this.pTarget.update(text)
  }
}
