// import * as FlexProgress from '..'
import * as FlexProgress from '@dinoabsoluto/flex-progress'

const out = new FlexProgress.Output()
const text = new FlexProgress.Text('ABC!')

out.append(
  1 , new FlexProgress.Spinner()
, 1 , 'Hello World!'
, 1 , new FlexProgress.Spinner()
// , 1, '⸨', bar , '⸩'
, 1, text
)

text.text = 'abc!'

let count = 0
const loop = setInterval(() => {
  count++
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
