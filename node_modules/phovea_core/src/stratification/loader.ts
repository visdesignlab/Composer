/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {getAPIJSON} from '../ajax';
import {parse, Range1DGroup, composite, Range, list as rlist, CompositeRange1D} from '../range';
import {IStratificationDataDescription} from './IStratification';
import {resolve} from '../idtype';

export interface ILoadedStratification {
  readonly rowIds: Range;
  readonly rows: string[];
  readonly range: CompositeRange1D;
}

export interface IStratificationLoader {
  (desc: IStratificationDataDescription): Promise<ILoadedStratification>;
}

function createRangeFromGroups(name: string, groups: any[]) {
  return composite(name, groups.map((g) => {
    return new Range1DGroup(g.name, g.color || 'gray', parse(g.range).dim(0));
  }));
}

export function viaAPILoader(): IStratificationLoader {
  let _data: Promise<ILoadedStratification> = undefined;
  return (desc) => {
    if (!_data) { //in the cache
      _data = getAPIJSON('/dataset/' + desc.id).then((data) => {
        const idType = resolve(desc.idtype);
        const rowIds = parse(data.rowIds);
        idType.fillMapCache(rowIds.dim(0).asList(data.rows.length), data.rows);
        return {
          rowIds,
          rows: data.rows,
          range: createRangeFromGroups(desc.name, data.groups)
        };
      });
    }
    return _data;
  };
}

export function viaDataLoader(rows: string[], rowIds: number[], range: CompositeRange1D): IStratificationLoader {
  let _data: Promise<ILoadedStratification> = undefined;
  return () => {
    if (!_data) { //in the cache
      _data = Promise.resolve({
        rowIds: rlist(rowIds),
        rows,
        range
      });
    }
    return _data;
  };
}
