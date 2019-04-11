/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progress-js - Progress indicator for Node.js
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
import clamp from 'lodash-es/clamp'

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

interface FlexState {
  width: number
  growRoom: number
  shrinkRoom: number
  grow: number
  shrink: number
  item: FlexItem
}

const grow = (states: FlexState[], deltaW: number, flexSum: number) => {
  const perFlex = deltaW / flexSum
  for (const state of states) {
    if (state.grow === 0) {
      continue
    }
    let adjust = clamp(perFlex * state.grow, 0, Math.min(deltaW, state.growRoom))
    let round = Math.round(adjust)
    deltaW -= round
    state.width += round
    if (deltaW === 0) {
      break
    }
  }
}

const shrink = (states: FlexState[], deltaW: number, flexSum: number) => {
  const perFlex = deltaW / flexSum
  for (const state of states) {
    if (state.shrink === 0) {
      continue
    }
    let adjust = clamp(perFlex * state.shrink, 0, Math.min(deltaW, state.shrinkRoom))
    let round = Math.round(adjust)
    deltaW -= round
    state.width -= round
    if (deltaW === 0) {
      break
    }
  }
}

export const flex = (children: FlexItem[], maxWidth: number) => {
  let states: FlexState[]
  let growSum = 0
  let shrinkSum = 0
  let widthSum = 0
  states = children.map((item) => {
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
    grow(states, maxWidth - widthSum, growSum)
  } else if (widthSum > maxWidth) {
    shrink(states, widthSum - maxWidth, shrinkSum)
  }
  return states
}
