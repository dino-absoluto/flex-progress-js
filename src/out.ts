/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Scripts to facilitate Japanese webnovel
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
import { clearLine, clearScreenDown, cursorTo } from 'readline'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
interface OutputOptions extends ItemOptions {
  stream?: NodeJS.WriteStream
}

export class Output extends Group {
  readonly stream: NodeJS.WriteStream = process.stderr
  readonly isTTY: boolean = true
  private lastColumns = 0
  count = 0
  private createdTime = Date.now()

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

  get elapsed () {
    return Date.now() - this.createdTime
  }

  clearLine () {
    const { stream } = this
    clearLine(stream, 0)
    cursorTo(stream, 0)
    clearScreenDown(stream)
  }

  clear () {
    super.clear()
    this.clearLine()
  }

  get columns () {
    return this.stream.columns || 40
  }

  protected handleUpdate () {
    super.handleUpdate()
    const { stream, columns, lastColumns } = this
    const text = this.render(columns)
    if (lastColumns !== columns) {
      this.lastColumns = columns
      this.clearLine()
    }
    stream.write(text)
    cursorTo(stream, 0)
    this.count++
  }
}
