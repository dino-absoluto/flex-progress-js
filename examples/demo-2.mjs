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
// import * as FlexProgress from '..'
import * as FlexProgress from '@dinoabsoluto/flex-progress'
import chalk from 'chalk'
import flip from 'lodash/flip'
import overArgs from 'lodash/overArgs'

const MESSAGE = 'Hello World!'
/** An output instance */
const out = new FlexProgress.Output()
const msg = new FlexProgress.Text({
  text: MESSAGE,
  align: FlexProgress.TextAlignment.Center,
  /** Allow the element to stretch */
  flex: 1
})
const bar1 = new FlexProgress.Bar({
  width: 15,
  /** The output text will be pass to this function */
  postProcess:
    overArgs((...texts /*: string[] */) => texts.join(''),
      [chalk.green, chalk.yellow, chalk.gray])
})
const bar2 = new FlexProgress.Bar({
  width: 25,
  postProcess:
    overArgs(flip((...texts /*: string[] */) => texts.join('')),
      [chalk.green, chalk.yellow, chalk.gray])
})

/* Add elements to output */
out.append(
  /* HideCursor make the cursor invisible */
  new FlexProgress.HideCursor(),
  /* Add 1 space, brackets and progress bar no.1 */
  1, '⸨', bar1, '⸩',
  /* Add 1 space, a spinner in cyan color */
  1, new FlexProgress.Spinner({ postProcess: chalk.cyan }),
  /* Add 1 space, a simple text message */
  1, msg,
  /* Add 1 space, a spinner in magenta color */
  1, new FlexProgress.Spinner({ postProcess: chalk.magenta }),
  /* Add 1 space, brackets and progress bar no.2 */
  1, '⸨', bar2, '⸩'
)

/* Simulate progress in a loop */
let count = 0
const loop = setInterval(() => {
  count++
  bar1.ratio = (count % 40) / 39
  bar2.ratio = ((2 * count) % 40) / 39
}, 80)

/* End the loop */
if (!(process.argv.indexOf('--loop') >= 0)) {
  setTimeout(() => {
    clearInterval(loop)
    /* Clear elements from output */
    out.clear()
  }, 10000)
}

/* Call out.clear() on SIGINT to restore the cursor con Ctrl+C */
process.on('SIGINT', () => {
  out.clear(false)
  console.log()
  process.exit(0)
})
