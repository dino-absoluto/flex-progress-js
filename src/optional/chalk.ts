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
import optionalChalk = require('chalk')

/* code */
/** Get a string display width */
const chalk = ((): typeof optionalChalk => {
  try {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const chalk: typeof optionalChalk = require('chalk')
    return chalk
  } catch {
    const obj = {}
    const join = (...argv: string[]): string => argv.join()
    const proxy = new Proxy(obj, {
      get (): typeof join { return join },
      apply (_target, _thisArgv, argv: string[]): string {
        return argv.join()
      }
    })
    return proxy as unknown as typeof optionalChalk
  }
})()

export default chalk
