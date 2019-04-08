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
import delay from 'lodash-es/delay'
import * as FlexBar from '.'
/* exports */

const out = new FlexBar.Output()
out.add(new FlexBar.Spinner())
out.add(new FlexBar.Spinner())
out.add(new FlexBar.Space())
out.add(new FlexBar.Text({ text: 'Hello World!' }))
out.add(new FlexBar.Space())
out.add(new FlexBar.Spinner())
out.add(new FlexBar.Spinner())

delay(() => {
  out.clear()
  const elapsed = out.elapsed
  console.log(out.count * 1000 / elapsed, elapsed)
}, 5000)
