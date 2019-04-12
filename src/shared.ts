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

/** Control the rendering synchronization rate */
export const SYNCING_INTERVAL = 40

/** Describe a flex-progress element */
export interface Element {
  /** Fixed width element */
  width?: number
  /** Mimimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Flexing factor, set both grow and shrink */
  flex: number
  /** Grow factor */
  flexGrow: number
  /** Shrink factor */
  flexShrink: number
  /** The active state of the element */
  enabled: boolean
  /** Calculate uninhibited width */
  calculateWidth (): number
  /** Render item with max-width */
  render (maxWidth?: number): string
}

/** Describe a child element */
export interface ChildElement extends Element {
  parent?: ParentElement
}

/** Describe a parent element */
export interface ParentElement extends Element {
  /** Array of child elements */
  children: ChildElement[]
  nextFrame (cb: (frame: number) => void): boolean
  notify (child: ChildElement, before: unknown, patch: unknown): void
}
