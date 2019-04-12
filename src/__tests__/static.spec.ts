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
import { Static } from '../static'
/* exports */

describe('Static', () => {
  test('constructor with string', async () => {
    const TEXT = 'abc'
    const i = new Static(TEXT)
    expect(i.render(0)).toBe(TEXT)
    expect(i.render(1)).toBe(TEXT)
    expect(i.render(2)).toBe(TEXT)
    expect(i.enabled).toBe(true)
    expect(() => { (i as any).enabled = false }).toThrow()
    expect(() => { (i as any).flex = 1 }).toThrow()
    expect(i.flexShrink).toBe(0)
    expect(i.flexGrow).toBe(0)
    expect(i.minWidth).toBe(TEXT.length)
    expect(i.maxWidth).toBe(TEXT.length)
  })
})
