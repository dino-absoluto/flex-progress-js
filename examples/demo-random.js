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
// import * as FlexBar from '..'
const FlexBar = require('..')
const chalk = require('chalk')
const delay = require('lodash/delay')
const round = require('lodash/round')
const flip = require('lodash/flip')
const overArgs = require('lodash/overArgs')
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
      (...i /*: string[] */)/*: string */ => i.join('')
      , chalk.green, chalk.yellow, chalk.gray)
})
const bar2 = new FlexBar.Bar({
  width: 20,
  postProcess:
    overArgs(
      flip((...i /*: string[] */)/*: string */ => i.join(''))
      , chalk.green, chalk.yellow, chalk.gray)
})
const message = new FlexBar.Text({
  flex: 1,
  text,
  postProcess: chalk.green
})
const spin1 = new FlexBar.Spinner({ postProcess: chalk.yellow })

out.append(
  new FlexBar.HideCursor()
  , 2
  , spin1
  , new FlexBar.Spinner({ postProcess: chalk.red })
  , new FlexBar.Spinner({ postProcess: chalk.cyan })
  , 1, message, 1
  , new FlexBar.Spinner({ postProcess: chalk.cyan })
  , new FlexBar.Spinner({ postProcess: chalk.red })
  , new FlexBar.Spinner({ postProcess: chalk.yellow })
  , 1, '[', bar1, ']', 1
  , new FlexBar.Spinner({ postProcess: chalk.magenta })
  , 1, '⸨', bar2, '⸩'
)

let count = 0
const int = setInterval(async ()/*: Promise<void> */=> {
  count++
  message.text = text + ' ' + count
  bar1.ratio = (count % 100) / 100
  bar2.ratio = (count * 2 / 3 % 100) / 100
}, 20)

delay(()/*: void */ => {
  spin1.enabled = false
  message.enabled = false
}, 1000)
delay(()/*: void */ => {
  spin1.enabled = true
  message.enabled = true
}, 3000)
delay(()/*: void */ => {
  out.enabled = false
}, 5000)
delay(()/*: void */ => {
  out.enabled = true
}, 7000)

process.on('SIGINT', ()/*: void */ => {
  out.clear(false)
  console.log()
  process.exit(0)
})

delay(()/*: void */ => {
  clearInterval(int)
  out.clear()
  const elapsed = out.elapsed
  console.log(
    chalk.white('FPS'),
    chalk.green(round(out.renderedCount * 1000 / elapsed, 1).toString()),
    chalk.gray('|'),
    chalk.white('Elapsed'),
    chalk.green(elapsed.toString()))
}, 10000)
