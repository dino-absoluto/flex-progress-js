import * as FlexProgress from '@dinoabsoluto/flex-progress'

const out = new FlexProgress.Output()
const bar = new FlexProgress.Bar({ width: 25 })

out.append(
  1 , new FlexProgress.Spinner()
, 1 , 'Hello World!'
, 1 , new FlexProgress.Spinner()
, 1, '⸨', bar , '⸩'
)

let count = 0
const loop = setInterval(() => {
  count++
  bar.ratio = (count % 39) / 38
}, 80)

setTimeout(() => {
  clearInterval(loop)
}, 2000)

process.on('SIGINT', () => {
  process.exit(0)
})

process.on('exit', () => {
  console.log()
})
