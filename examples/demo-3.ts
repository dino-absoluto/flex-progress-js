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
import clamp = require('lodash/clamp')

const HSY = (h: number, s: number, y: number) => {
  h = clamp(h, 0, 360) % 360
  s = clamp(s, 0, 1)
  y = clamp(y, 0, 1)
  const c = (1 - Math.abs(2 * y - 1)) * s
  const h1 = h / 60
  const x = c * (1 - Math.abs(h1 % 2 - 1))
  let r: [number, number, number]
  switch (Math.floor(h1)) {
    case 0: {
      r = [c, x, 0]
      break
    }
    case 1: {
      r = [x, c, 0]
      break
    }
    case 2: {
      r = [0, c, x]
      break
    }
    case 3: {
      r = [0, x, c]
      break
    }
    case 4: {
      r = [x, 0, c]
      break
    }
    case 5: {
      r = [c, 0, x]
      break
    }
    default: {
      r = [0, 0, 0]
      break
    }
  }
  const m = y - (0.21 * r[0] + 0.72 * r[1] + 0.07 * r[2])
  r = [r[0] + m, r[1] + m, r[2] + m]
  return r
}

/* NOTE: need true color supports */
const colors: typeof chalk.red[] = []
for (let h = 0; h <= 120; h += 10) {
  const [r, g, b ] = HSY(h, .5, .5).map(c => Math.floor(c * 255))
  colors.push(chalk.rgb(r, g, b))
}

let ratio = 0

const colorBar = (fill: string, half: string, empty: string) => {
  const i = Math.floor(ratio * 1 * (colors.length - 1)) % colors.length
  return [ colors[i](fill), colors[Math.max(0, i)](half), chalk.gray(empty) ].join('')
}

const out = new FlexProgress.Output()
const bar = new FlexProgress.Bar({ width: 25, postProcess: colorBar })
const text = new FlexProgress.Text({
  postProcess: chalk.green
})

out.append(
  new FlexProgress.HideCursor()
, 1, new FlexProgress.Spinner({ postProcess: chalk.cyan })
, 1, new FlexProgress.Text({ text: 'Hello World!', postProcess: chalk.green })
, 1, new FlexProgress.Spinner({ postProcess: chalk.magenta })
, 1, '⸨', bar , '⸩'
, 1, text
)

text.text = 'abc!'

let count = 0
const loop = setInterval(() => {
  count++
  ratio = (count % 39) / 38
  text.text = Math.round(ratio * 1000) / 10 + '%'
  bar.ratio = ratio
}, 80)

process.on('SIGINT', () => {
  out.clear(false)
  console.log()
  process.exit(0)
})
