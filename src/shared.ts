/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * flex-progressjs - Scripts to facilitate Japanese webnovel
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
  /** Calculate uninhibited width */
  calculateWidth (): number
  /** Render item with max-width */
  render (maxWidth?: number): string
  /** Trigger an update */
  update (): void
}

/** Describe a child element */
export interface ChildElement extends Element {
  parent?: ParentElement
}

/** Describe a parent element */
export interface ParentElement extends Element {
  /** Array of child elements */
  children: ChildElement[]
  /** Add element */
  add (child: ChildElement, atIndex?: number): ChildElement
  /** Remove element */
  remove (child: ChildElement): ChildElement | undefined
  /** Clear all elements */
  clear (): void
  /** Add elements to the end.
   * @param {...ChildElement} items ... of child element
   */
  append (...items: ChildElement[]): void
  /** Syncing events */
  sync (): Promise<number>
}
