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
/* eslint-env jest */
/* imports */
import { Space } from '../space'

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
describe('Space', (): void => {
  test('constructor', async (): Promise<void> => {
    const sp = new Space()
    expect(sp.render()).toBe(' ')
    expect(sp.render(2)).toBe(' ')
    expect(sp.render(0)).toBe('')
  })
  test('render() flex.1', async (): Promise<void> => {
    const sp = new Space(10)
    expect(sp.render(6)).toBe(' '.repeat(10))
    expect(sp.render(8)).toBe(' '.repeat(10))
    sp.flex = 1
    expect(sp.render(8)).toBe(' '.repeat(8))
  })
  test('render() flex.2', async (): Promise<void> => {
    const sp = new Space({ flex: 1 })
    expect(sp.render(8)).toBe(' '.repeat(8))
    sp.flex = 1
    expect(sp.render(20)).toBe(' '.repeat(20))
  })
  test('render() flex.3', async (): Promise<void> => {
    const sp = new Space({ minWidth: 5 })
    expect(sp.render(1)).toBe(' '.repeat(5))
    expect(sp.render(8)).toBe(' '.repeat(5))
    expect(sp.render(20)).toBe(' '.repeat(5))
    sp.flex = 1
    expect(sp.render(1)).toBe(' '.repeat(1))
    expect(sp.render(8)).toBe(' '.repeat(8))
  })
})
