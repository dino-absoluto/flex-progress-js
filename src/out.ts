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
import { ItemOptions } from './child-element'
import { Group } from './parent-element'
import {
  clearLine
, clearScreenDown
, cursorTo } from 'readline'
import stringWidth from './optional/string-width'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Describe options to class Output constructor() */
interface OutputOptions extends ItemOptions {
  stream?: NodeJS.WriteStream
}

/** Actual output to stderr */
export class Output extends Group {
  readonly stream: NodeJS.WriteStream = process.stderr
  readonly isTTY: boolean = true
  private $lastColumns = 0
  private $lastWidth = 0
  private $createdTime = Date.now()
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
      this.update()
    }
    super.enabled = value
  }

  /** Elapsed time since creation */
  get elapsed () {
    return Date.now() - this.$createdTime
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

  /** Get display width */
  get columns () {
    return this.stream.columns || 40
  }

  protected handleUpdate () {
    super.handleUpdate()
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
