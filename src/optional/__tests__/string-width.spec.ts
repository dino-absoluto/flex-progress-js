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

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█
test('no string-width', () => {
  jest.doMock('string-width', () => {
    throw new Error('no string-width')
  })
  expect(() => require('string-width')).toThrow()
  const stringWidth = require('../string-width').default
  expect(stringWidth('abc')).toBe(3)
  expect(stringWidth('古')).toBe('古'.length)
  expect(stringWidth('古')).toBe(1)
  jest.dontMock('string-width')
})

test('with string-width', () => {
  expect(() => require('string-width')).not.toThrow()
  const stringWidth = require('../string-width').default
  expect(stringWidth('abc')).toBe(3)
  expect(stringWidth('古')).toBe(1)
})
