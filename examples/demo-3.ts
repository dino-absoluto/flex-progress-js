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
for (let i = 0; i <= 36; i++) {
  const [r, g, b ] = HSY(i * 10, .5, .5).map(c => Math.floor(c * 255))
  colors.push(chalk.rgb(r, g, b))
}

let ratio = 0

const colorBar = (fill: string, half: string, empty: string) => {
  const i = Math.min(colors.length - 1, Math.floor(ratio * colors.length))
  return [ colors[i](fill), colors[Math.max(0, i)](half), chalk.gray(empty) ].join('')
}

const out = new FlexProgress.Output()
const bar = new FlexProgress.Bar({ width: 25, postProcess: colorBar })
const text = new FlexProgress.Text({
  postProcess: chalk.green
})

out.append(
  1, new FlexProgress.Spinner({ postProcess: chalk.cyan })
, 1, 'Hello World!'
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
  process.exit(0)
})

process.on('exit', () => {
  console.log()
})
