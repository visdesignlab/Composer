/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {IdPool} from '../index';
import {Range, list as rlist} from '../range';


export default class LocalIDAssigner {
  private readonly pool = new IdPool();
  private readonly lookup = new Map<string, number>();

  unmapOne(id: number) {
    return this.unmap([id])[0];
  }

  unmap(ids: number[]) {
    const keys = Object.keys(this.lookup);
    return ids.map((id) => {
      for (const k in keys) {
        if (this.lookup.get(k) === id) {
          return k;
        }
      }
      return null;
    });
  }

  mapOne(id: string): number {
    if (this.lookup.has(id)) {
      return this.lookup.get(id);
    }
    this.lookup.set(id, this.pool.checkOut());
    return this.lookup.get(id);
  }

  map(ids: string[]): Range {
    const numbers: number[] = ids.map((d) => this.mapOne(d));
    return rlist(...numbers);
  }
}

export function createLocalAssigner() {
  const r = new LocalIDAssigner();
  return r.map.bind(r);
}
