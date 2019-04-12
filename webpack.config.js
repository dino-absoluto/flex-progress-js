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
  },
  module: {
    rules: [
      {
        use: {
          options: {
            compilerOptions: {
              removeComments: true
            }
          }
        }
      }
    ]
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
