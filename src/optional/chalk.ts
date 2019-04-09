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
import optionalChalk = require('chalk')

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
/** Get a string display width */
const chalk = (() => {
  try {
    const chalk: typeof optionalChalk = require('chalk')
    return chalk
  } catch {
    const obj = {}
    const join = (...argv: string[]) => argv.join()
    const proxy = new Proxy(obj, {
      get () { return join },
      apply (_target, _thisArgv, argv: string[]) {
        return argv.join()
      }
    }) as any
    return proxy
  }
})()

export default chalk
