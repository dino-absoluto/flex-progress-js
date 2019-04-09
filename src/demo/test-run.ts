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
import delay from 'lodash-es/delay'
import round from 'lodash-es/round'
import flip from 'lodash-es/flip'
import overArgs from 'lodash-es/overArgs'
import chalk from '../optional/chalk'
import * as FlexBar from '..'
/* exports */

const text =
  'Hello World!'
  // 'Hello World! Welcome! To the Beyond!'
const out = new FlexBar.Output()
const bar1 = new FlexBar.Bar({
  theme: {
    symbols: [ '.', ':', '=', '#' ]
  },
  minWidth: 15,
  flex: 1,
  postProcess:
    overArgs(
      (...i: string[]) => i.join('')
    , chalk.green, chalk.yellow, chalk.gray)
})
const bar2 = new FlexBar.Bar({
  width: 20,
  postProcess:
    overArgs(
      flip((...i: string[]) => i.join(''))
    , chalk.green, chalk.yellow, chalk.gray)
})
const message = new FlexBar.Text({
  flex: 1,
  text,
  postProcess: chalk.green
})
const spin1 = new FlexBar.Spinner({ postProcess: chalk.yellow })

out.append(
  2
, spin1
, new FlexBar.Spinner({ postProcess: chalk.red })
, new FlexBar.Spinner({ postProcess: chalk.cyan })
, 1 , message , 1
, new FlexBar.Spinner({ postProcess: chalk.cyan })
, new FlexBar.Spinner({ postProcess: chalk.red })
, new FlexBar.Spinner({ postProcess: chalk.yellow })
, 1 , '[' , bar1 , ']', 1
, new FlexBar.Spinner({ postProcess: chalk.magenta })
, 1 , '⸨' , bar2 , '⸩'
)

let count = 0
const int = setInterval(async () => {
  count++
  message.text = text + ' ' + count
  bar1.ratio = (count % 100) / 100
  bar2.ratio = (count * 2 / 3 % 100) / 100
}, 20)

delay(() => {
  spin1.enabled = false
  message.enabled = false
}, 1000)
delay(() => {
  spin1.enabled = true
  message.enabled = true
}, 3000)
delay(() => {
  out.enabled = false
}, 5000)
delay(() => {
  out.enabled = true
}, 7000)

delay(() => {
  clearInterval(int)
  out.clear()
  const elapsed = out.elapsed
  console.log(
    chalk.white('FPS'),
    chalk.green(round(out.count * 1000 / elapsed, 1).toString()),
    chalk.gray('|'),
    chalk.white('Elapsed'),
    chalk.green(elapsed.toString()))
}, 10000)
