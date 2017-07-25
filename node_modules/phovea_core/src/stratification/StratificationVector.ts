/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {argFilter, argSort} from '../index';
import {parse, RangeLike, list as rlist, CompositeRange1D, all} from '../range';
import {ICategoricalValueTypeDesc, VALUE_TYPE_CATEGORICAL} from '../datatype';
import {ICategoricalVector, IVectorDataDescription} from '../vector';
import AVector from '../vector/AVector';
import Stratification from './Stratification';


/**
 * root matrix implementation holding the data
 * @internal
 */
export default class StratificationVector extends AVector<string, ICategoricalValueTypeDesc> implements ICategoricalVector {
  readonly valuetype: ICategoricalValueTypeDesc;
  readonly desc: IVectorDataDescription<ICategoricalValueTypeDesc>;

  private _cache: string[] = null;

  constructor(private strat: Stratification, private range: CompositeRange1D) {
    super(null);
    this.root = this;
    this.valuetype = {
      type: <any>VALUE_TYPE_CATEGORICAL,
      categories: range.groups.map((g) => ({name: g.name, label: g.name, color: g.color}))
    };
    const d = strat.desc;
    this.desc = {
      name: d.name,
      fqname: d.fqname,
      description: d.description,
      id: d.id + '-v',
      type: 'vector',
      size: d.size,
      idtype: d.idtype,
      value: this.valuetype,
      creator: d.creator,
      ts: d.ts
    };
  }

  get idtype() {
    return this.strat.idtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  persist() {
    return {
      root: this.strat.persist()
    };
  }

  restore(persisted: any) {
    let r: ICategoricalVector = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  private load(): string[] {
    if (!this._cache) {
      const r: string[] = [];
      this.range.groups.forEach((g) => {
        g.forEach(() => r.push(g.name));
      });
      this._cache = r;
    }
    return this._cache;
  }

  /**
   * access at a specific position
   * @param i
   * @returns {*}
   */
  at(i: number) {
    return Promise.resolve(this.load()[i]);
  }

  data(range: RangeLike = all()) {
    const data = this.load();
    return Promise.resolve(parse(range).filter(data, this.dim));
  }

  names(range: RangeLike = all()) {
    return this.strat.names(range);
  }

  ids(range: RangeLike = all()) {
    return this.strat.ids(range);
  }

  size() {
    return this.strat.size();
  }

  async sort(compareFn?: (a: string, b: string) => number, thisArg?: any): Promise<ICategoricalVector> {
    const d = await this.data();
    const indices = argSort(d, compareFn, thisArg);
    return this.view(rlist(indices));
  }

  async  filter(callbackfn: (value: string, index: number) => boolean, thisArg?: any): Promise<ICategoricalVector> {
    const d = await this.data();
    const indices = argFilter(d, callbackfn, thisArg);
    return this.view(rlist(indices));
  }
}
