/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * Translator-js - Scripts to facilitate Japanese webnovel
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
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash/merge')

const defaultConfigs = {
  mode: 'development',
  target: 'node',
  entry: './src/index.ts',
  output: {
    pathinfo: false,
    filename: 'index.js',
    path: path.resolve(__dirname, '__tmp__/dist')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true
          }
        }
      }, {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  },
  externals: [
    nodeExternals({
      whitelist: [ /^lodash/ ]
    })
  ]
}

module.exports = [
  merge({}, defaultConfigs, {
    name: 'dev',
    entry: './src/test-run.ts',
    output: {
      filename: 'test-run.js',
      path: path.resolve(__dirname, '__tmp__/dist')
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    }
  }),
  merge({}, defaultConfigs, {
    name: 'minify',
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'dist/')
    }
  })
]
