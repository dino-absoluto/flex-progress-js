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

/** @public
 * Describe a flex-progress element.
 */
export interface Element {
  /**
   * Fixed width element. This is substantially the same as setting
   * `minWidth` and `maxWidth` to the same value
   */
  width?: number
  /**
   * Mimimum width. This element should not be shorter than this.
   */
  minWidth?: number
  /**
   * Maximum width. This element should not be longer than this.
   */
  maxWidth?: number
  /**
   * Flexing factor, set both grow and shrink.
   * Value should be greater than 0 and less than `maxWidth`.
   */
  flex: number
  /** Grow factor. */
  flexGrow: number
  /** Shrink factor. */
  flexShrink: number
  /**
   * The active state of the element.
   * Setting this to false stop the element from rendering.
   */
  enabled: boolean
  /**
   * Calculate the uninhibited width of this element.
   *
   * This function will return the desired width if there's no restriction
   * to its length.
   *
   * If there's no desired width, or if it can grow to infinity if necessary,
   * it returns `minWidth`.
   */
  calculateWidth (): number
  /**
   * Render item with `maxWidth`.
   * The visual length of the returned string will not exceed maxWidth.
   * @param maxWidth - maximum allowed width, undefined for unlimited
   */
  render (maxWidth?: number): string
}

/** @public
 * Describe a child element.
 * ChildElement is meant to be added as sub-element.
 */
export interface ChildElement extends Element {
  parent?: ParentElement
}

/** @public
 * Describe a value that can be use in place of ChildElement.
 * - a `string` will be converted to a text element.
 * - a `number` will be converted to a empty spaces equaling its value.
 */
export type FlexChild = string | number | ChildElement

/** @public
 * Describe a parent element.
 * A parent element contains ChildElement and render them together.
 */
export interface ParentElement extends Element {
  /** Array of child elements. */
  children: ChildElement[]
  /**
   * Schedule a callback for next frame.
   * The scheduled function will be called before next frame is rendered.
   *
   * The callback function receive a number representing that frame.
   * This number is usually equal to the previous value + 1.
   * Since all callbacks before rendering will be called with the same
   * value, you can use it as hint to synchronize animation.
   *
   * @param frame - callback function
   * @returns `true` if the callback has been scheduled, false otherwise
   */
  nextFrame (cb: (frame: number) => void): boolean
  /**
   * Notify this element that it should be updated.
   * This function schedule an update.
   * This feature has not been completed yet and should not be relied upon.
   */
  notify (): void
  /**
   * Add a sub-element.
   * @param item - element to be added
   * @param atIndex - the position to be added, zero-based, at the end if not specified
   */
  add (item: FlexChild, atIndex?: number): void
  /**
   * Remove a sub-element.
   * @param item - element to be removed
   * @returns the removed element, undefined if not found.
   */
  remove (item: ChildElement): ChildElement | undefined
  /**
   * Add elements at the end
   * This is the same as `add` but without `atIndex` and many elements
   * can be added instead.
   * @param items - elements to be added.
   */
  append (...items: FlexChild[]): void
  /**
   * Remove all sub-elements.
   */
  clear (): void
}
