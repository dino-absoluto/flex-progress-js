import * as FlexProgress from '@dinoabsoluto/flex-progress-js'
import chalk from 'chalk'
import flip = require('lodash/flip')
import overArgs = require('lodash/overArgs')

const out = new FlexProgress.Output()
const bar1 = new FlexProgress.Bar({
  width: 10,
  postProcess: (...s: string[]) =>
    chalk.green(s[0]) + chalk.yellow(s[1]) + chalk.gray(s[2])
})
const bar2 = new FlexProgress.Bar({
  width: 15,
  postProcess:
    overArgs(flip((...s: string[]) => s.join('')),
      [chalk.green, chalk.yellow, chalk.gray])
})

out.append(
  1, '⸨', bar1 , '⸩'
, 1, new FlexProgress.Spinner({ postProcess: chalk.cyan })
, 1, 'Hello World!'
, 1, new FlexProgress.Spinner({ postProcess: chalk.magenta })
, 1, '⸨', bar2 , '⸩'
)

let count = 0
const loop = setInterval(() => {
  count++
  bar1.ratio = (count % 39) / 38
  bar2.ratio = ((2 * count) % 39) / 38
}, 80)

setTimeout(() => {
  clearInterval(loop)
  out.clear()
}, 5000)
