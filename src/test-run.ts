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
import delay from 'lodash-es/delay'
import round from 'lodash-es/round'
import flip from 'lodash-es/flip'
import overArgs from 'lodash-es/overArgs'
import chalk from './optional/chalk'
import * as FlexBar from '.'
/* exports */

const out = new FlexBar.Output()
const bar = new FlexBar.Bar({
  flex: 1,
  postProcess:
    overArgs(
      (...i: string[]) => i.join('')
    , chalk.green, chalk.yellow, chalk.gray)
})
const bar2 = new FlexBar.Bar({
  flex: 1,
  postProcess:
    overArgs(
      flip((...i: string[]) => i.join(''))
    , chalk.green, chalk.yellow, chalk.gray)
})
const msg = new FlexBar.Text({ text: 'Hello World!', postProcess: chalk.green })

out.append(
  new FlexBar.Space({ width: 2 })
, new FlexBar.Spinner({ postProcess: chalk.yellow })
, new FlexBar.Spinner({ postProcess: chalk.red })
, new FlexBar.Spinner({ postProcess: chalk.cyan })
, new FlexBar.Space()
, msg
, new FlexBar.Space()
, new FlexBar.Spinner({ postProcess: chalk.cyan })
, new FlexBar.Spinner({ postProcess: chalk.red })
, new FlexBar.Spinner({ postProcess: chalk.yellow })
, new FlexBar.Space({ width: 4 })
, new FlexBar.Text('⸨')
, bar
, new FlexBar.Text('⸩')
, new FlexBar.Space()
, new FlexBar.Spinner({ postProcess: chalk.magenta })
, new FlexBar.Space()
, new FlexBar.Text('⸨')
, bar2
, new FlexBar.Text('⸩')
)

let count = 0
const int = setInterval(async () => {
  count++
  msg.text = 'Hello World! ' + count
  bar.ratio = (count % 100) / 100
  bar2.ratio = (count * 2 / 3 % 100) / 100
}, 20)

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
}, 5000)
