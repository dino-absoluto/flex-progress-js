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
/* exports */
module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest/global-setup.js',
  roots: [
    '<rootDir>/src/',
    '<rootDir>/tests/'
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/jest/mods'
  ],
  globals: {
    'ts-jest': {
      tsConfig: {
        allowJs: true
      }
    }
  },
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es/.*)'
  ],
  testMatch: [
    '**/?(*.)+(spec|test).(js)',
    '**/?(*.)+(spec|test).(ts|tsx)'
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
    'json',
    'node'
  ]
}
