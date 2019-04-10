import * as FlexProgress from '@dinoabsoluto/flex-progress-js'
import chalk from 'chalk'
import flip = require('lodash/flip')
import overArgs = require('lodash/overArgs')

const MESSAGE = 'Hello World!'
/** An output instance */
const out = new FlexProgress.Output()
const msg = new FlexProgress.Text({
  text: MESSAGE,
  /** Allow the element to stretch */
  flex: 1
})
const bar1 = new FlexProgress.Bar({
  width: 10,
  /** The output text will be pass to this function */
  postProcess:
    overArgs((...s: string[]) => s.join(''),
      [chalk.green, chalk.yellow, chalk.gray])
})
const bar2 = new FlexProgress.Bar({
  width: 15,
  postProcess:
    overArgs(flip((...s: string[]) => s.join('')),
      [chalk.green, chalk.yellow, chalk.gray])
})

/* Add elements to output */
out.append(
  /* HideCursor make the cursor invisible */
  new FlexProgress.HideCursor()
/* Add 1 space, brackets and progress bar no.1 */
, 1, '⸨', bar1 , '⸩'
/* Add 1 space, a spinner in cyan color */
, 1, new FlexProgress.Spinner({ postProcess: chalk.cyan })
/* Add 1 space, a simple text message */
, 1, msg
/* Add 1 space, a spinner in magenta color */
, 1, new FlexProgress.Spinner({ postProcess: chalk.magenta })
  /* Add 1 space, brackets and progress bar no.2 */
, 1, '⸨', bar2 , '⸩'
)

/* Simulate progress in a loop */
let count = 0
const loop = setInterval(() => {
  count++
  bar1.ratio = (count % 39) / 38
  bar2.ratio = ((2 * count) % 39) / 38
}, 80)

/* End the loop */
setTimeout(() => {
  clearInterval(loop)
  /* Clear elements from output */
  out.clear()
}, 10000)

/* Call out.clear() on SIGINT to restore the cursor con Ctrl+C */
process.on('SIGINT', () => {
  out.clear(false)
  process.exit(0)
})
