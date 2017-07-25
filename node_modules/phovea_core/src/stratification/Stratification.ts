/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {mixin} from '../index';
import {parse, RangeLike, Range, CompositeRange1D, all} from '../range';
import {resolve as resolveIDType, createLocalAssigner} from '../idtype';
import {ADataType, IDataType, VALUE_TYPE_CATEGORICAL, ICategory} from '../datatype';
import {getFirstByFQName} from '../data';
import {ICategoricalVector} from '../vector';
import {rangeHist, IHistogram} from '../math';
import {IStratification, IStratificationDataDescription, createDefaultStratificationDesc} from './IStratification';
import StratificationGroup from './StratificationGroup';
import {IStratificationLoader, viaAPILoader, viaDataLoader} from './loader';
import StratificationVector from './StratificationVector';
/**
 * root matrix implementation holding the data
 * @internal
 */
export default class Stratification extends ADataType<IStratificationDataDescription> implements IStratification {
  private _v: Promise<ICategoricalVector>;

  constructor(desc: IStratificationDataDescription, private loader: IStratificationLoader) {
    super(desc);
  }

  get idtype() {
    return resolveIDType(this.desc.idtype);
  }

  get groups() {
    return this.desc.groups;
  }

  group(group: number): IStratification {
    return new StratificationGroup(this, group, this.groups[group]);
  }

  async hist(bins?: number, range?: Range): Promise<IHistogram> {
    //TODO
    return rangeHist(await this.range());
  }

  vector() {
    return this.asVector();
  }

  asVector(): Promise<ICategoricalVector> {
    if (!this._v) {
      this._v = this.loader(this.desc).then((data) => new StratificationVector(this, data.range));
    }
    return this._v;
  }

  origin(): Promise<IDataType> {
    if ('origin' in this.desc) {
      return getFirstByFQName(this.desc.origin);
    }
    return Promise.reject('no origin specified');
  }

  async range() {
    return (await this.loader(this.desc)).range;
  }

  async idRange() {
    const data = await this.loader(this.desc);
    const ids = data.rowIds.dim(0);
    const range = data.range;
    return ids.preMultiply(range, this.dim[0]);
  }

  async names(range: RangeLike = all()) {
    return parse(range).filter((await this.loader(this.desc)).rows, this.dim);
  }

  async ids(range: RangeLike = all()): Promise<Range> {
    return (await this.loader(this.desc)).rowIds.preMultiply(parse(range), this.dim);
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return this.desc.size;
  }

  get length() {
    return this.dim[0];
  }

  get ngroups() {
    return this.desc.ngroups;
  }

  get dim() {
    return [this.size()];
  }

  persist() {
    return this.desc.id;
  }
}

/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {IVector}
 */
export function create(desc: IStratificationDataDescription): Stratification {
  return new Stratification(desc, viaAPILoader());
}

export function wrap(desc: IStratificationDataDescription, rows: string[], rowIds: number[], range: CompositeRange1D) {
  return new Stratification(desc, viaDataLoader(rows, rowIds, range));
}

export interface IAsStratifcationOptions {
  name?: string;
  idtype?: string;
  rowassigner?(ids: string[]): Range;
}

export function asStratification(rows: string[], range: CompositeRange1D, options: IAsStratifcationOptions = {}) {
  const desc = mixin(createDefaultStratificationDesc(), {
    size: 0,
    groups: range.groups.map((r) => ({name: r.name, color: r.color, size: r.length})),
    ngroups: range.groups.length
  }, options);

  const rowAssigner = options.rowassigner || createLocalAssigner();
  return new Stratification(desc, viaDataLoader(rows, rowAssigner(rows), range));
}

export function wrapCategoricalVector(v: ICategoricalVector) {
  if (v.valuetype.type !== VALUE_TYPE_CATEGORICAL) {
    throw new Error('invalid vector value type: ' + v.valuetype.type);
  }
  const toGroup = (g: string|ICategory) => {
    if (typeof g === 'string') {
      return {name: <string>g, color: 'gray', size: NaN};
    }
    const cat = <ICategory>g;
    return {name: cat.name, color: cat.color || 'gray', size: NaN};
  };
  const cats = v.desc.value.categories.map(toGroup);
  const desc: IStratificationDataDescription = {
    id: v.desc.id + '-s',
    type: 'stratification',
    name: v.desc.name + '-s',
    fqname: v.desc.fqname + '-s',
    description: v.desc.description,
    idtype: v.idtype.id,
    ngroups: cats.length,
    groups: cats,
    size: v.length,
    creator: v.desc.creator,
    ts: v.desc.ts
  };

  function loader() {
    return Promise.all<any>([v.groups(), v.ids(), v.names()]).then((args) => {
      const range = <CompositeRange1D>args[0];
      range.groups.forEach((g, i) => cats[i].size = g.length);
      return {
        range: args[0],
        rowIds: args[1],
        rows: args[2]
      };
    });
  }

  return new Stratification(desc, loader);
}
