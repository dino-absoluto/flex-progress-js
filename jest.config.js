/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Progress indicator for Node.js
 * Copyright (C) 2019 Dino <dinoabsoluto+dev@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
    "**/?(*.)+(spec|test).(js)",
    "**/?(*.)+(spec|test).(ts|tsx)"
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
    'json',
    'node'
  ]
}
