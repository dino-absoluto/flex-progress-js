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
import clamp = require('lodash/clamp')
import sortedIndex = require('lodash/sortedIndex')

/* code */
// █████▒░░░░░░░░░
// ██████▓░░░░░░░░
// █████████████▓░
// █▓▒░▒▓█

interface FlexItem {
  maxWidth?: number
  minWidth?: number
  flexGrow: number
  flexShrink: number
  calculateWidth (): number
}

interface FlexState<T extends FlexItem> {
  width: number
  growRoom: number
  shrinkRoom: number
  grow: number
  shrink: number
  item: T
  [Symbol.toPrimitive]?: () => number
}

const grow = <T extends FlexItem>(
  states: FlexState<T>[]
  , deltaW: number
  , flexSum: number): number => {
  const perFlex = deltaW / flexSum
  const sortedFractions: FlexState<T>[] = []
  for (const state of states) {
    if (state.grow === 0) {
      continue
    }
    const adjust = clamp(perFlex * state.grow, 0, Math.min(deltaW, state.growRoom))
    const round = Math.round(adjust)
    const fraction = adjust - round
    if (fraction > 0 && state.growRoom > round) {
      state[Symbol.toPrimitive] = (): number => -fraction
      sortedFractions.splice(sortedIndex(sortedFractions, state), 0, state)
    }
    deltaW -= round
    state.width += round
    if (deltaW === 0) {
      break
    }
  }
  if (deltaW > 0) {
    for (const state of sortedFractions) {
      state.width++
      deltaW--
      if (deltaW === 0) {
        break
      }
    }
  }
  return deltaW
}

const shrink = <T extends FlexItem>(
  states: FlexState<T>[]
  , deltaW: number
  , flexSum: number): number => {
  const perFlex = deltaW / flexSum
  const sortedFractions: FlexState<T>[] = []
  for (const state of states) {
    if (state.shrink === 0) {
      continue
    }
    let adjust = clamp(perFlex * state.shrink, 0, Math.min(deltaW, state.shrinkRoom))
    let round = Math.round(adjust)
    const fraction = adjust - round
    if (fraction > 0 && state.shrinkRoom > round) {
      state[Symbol.toPrimitive] = (): number => -fraction
      sortedFractions.splice(sortedIndex(sortedFractions, state), 0, state)
    }
    deltaW -= round
    state.width -= round
    if (deltaW === 0) {
      break
    }
  }
  if (deltaW > 0) {
    for (const state of sortedFractions) {
      state.width--
      deltaW--
      if (deltaW === 0) {
        break
      }
    }
  }
  return deltaW
}

type FlexResult<T extends FlexItem> = FlexState<T>[] & { leftOver?: number }

export const flex = <T extends FlexItem>(children: T[], maxWidth: number):
FlexResult<T> => {
  let states: FlexResult<T>
  let growSum = 0
  let shrinkSum = 0
  let widthSum = 0
  states = children.map((item): FlexState<T> => {
    const width = item.calculateWidth()
    const growRoom = Math.min(item.maxWidth || maxWidth, maxWidth) - width
    const shrinkRoom = width - Math.max(item.minWidth || 0, 0)
    const grow = item.flexGrow * growRoom
    const shrink = Math.min(Math.ceil(item.flexShrink), shrinkRoom) * shrinkRoom
    growSum += grow
    shrinkSum += shrink
    widthSum += width
    return {
      width,
      growRoom,
      shrinkRoom,
      grow,
      shrink,
      item
    }
  })
  if (widthSum < maxWidth) {
    states.leftOver = grow(states, maxWidth - widthSum, growSum)
  } else if (widthSum > maxWidth) {
    states.leftOver = shrink(states, widthSum - maxWidth, shrinkSum)
  }
  return states
}
