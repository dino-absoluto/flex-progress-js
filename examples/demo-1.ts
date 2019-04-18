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
import * as FlexProgress from '..'
// import * as FlexProgress from '@dinoabsoluto/flex-progress'

const out = new FlexProgress.Output()
const bar = new FlexProgress.Bar({ width: 25 })

out.append(
  1, new FlexProgress.Spinner(),
  1, 'Hello World!',
  1, new FlexProgress.Spinner(),
  1, '⸨', bar, '⸩'
)

let count = 0
const loop = setInterval((): void => {
  count++
  bar.ratio = (count % 39) / 38
}, 80)

/* End the loop */
if (!(process.argv.indexOf('--loop') >= 0)) {
  setTimeout((): void => {
    clearInterval(loop)
    /* Clear elements from output */
    out.clear()
  }, 10000)
}
