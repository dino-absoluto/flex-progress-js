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
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash/merge')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const defaultConfigs = {
  mode: 'development',
  target: 'node',
  entry: './src/index.ts',
  output: {
    pathinfo: false,
    filename: 'index.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '__tmp__/lib')
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

const dev = (_env) => merge(defaultConfigs, {
  entry: './src/demo/test-run.ts',
  output: {
    filename: 'test-run.js',
    path: path.resolve(__dirname, '__tmp__/bin')
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
})

const mini = (_env) => merge({}, defaultConfigs, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib/')
  }
})

module.exports = (env = {}) => {
  let cfg
  if (env.prod) {
    cfg = mini(env)
  } else {
    cfg = dev(env)
  }
  if (env.bundleAnalyze) {
    merge(cfg, {
      plugins: [
        new BundleAnalyzerPlugin()
      ]
    })
  }
  return cfg
}
