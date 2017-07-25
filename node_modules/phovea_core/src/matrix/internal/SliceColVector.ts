/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {argSort, argFilter} from '../../index';
import {list as rlist, RangeLike, Range, all, parse, Range1D} from '../../range';
import {IValueTypeDesc} from '../../datatype';
import {IVector, IVectorDataDescription} from '../../vector';
import AVector from '../../vector/AVector';
import {IMatrix} from '../IMatrix';

/**
 * a simple projection of a matrix columns to a vector
 */
export default class SliceColVector<T, D extends IValueTypeDesc> extends AVector<T, D> implements IVector<T, D> {
  readonly desc: IVectorDataDescription<D>;
  private colRange: Range1D;

  constructor(private m: IMatrix<T, D>, private col: number) {
    super(null);
    this.colRange = Range1D.from([this.col]);
    this.desc = {
      name: m.desc.name + '-c' + col,
      fqname: m.desc.fqname + '-c' + col,
      id: m.desc.id + '-c' + col,
      type: 'vector',
      idtype: m.rowtype,
      size: m.nrow,
      value: m.valuetype,
      description: m.desc.description,
      creator: m.desc.creator,
      ts: m.desc.ts
    };
    this.root = this;
  }

  persist() {
    return {
      root: this.m.persist(),
      col: this.col
    };
  }

  restore(persisted: any) {
    let r: IVector<T, D> = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  get valuetype() {
    return this.m.valuetype;
  }

  get idtype() {
    return this.m.rowtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return this.m.nrow;
  }

  /**
   * return the associated ids of this vector
   */
  names(range?: Range): Promise<string[]> {
    return this.m.rows(range);
  }

  ids(range?: RangeLike) {
    return this.m.rowIds(range);
  }

  /**
   * returns a promise for getting one cell
   * @param i
   */
  at(i: number): Promise<T> {
    return this.m.at(i, this.col);
  }

  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  async data(range: RangeLike = all()): Promise<T[]> {
    const rr = parse(range);
    const r = rlist(rr.dim(0), this.colRange);
    const d = await this.m.data(r);
    if (d.length === 0) {
      return [];
    }
    if (Array.isArray(d[0])) {
      return d.map((di) => di[0]);
    }
    return <any>d;
  }

  async sort(compareFn?: (a: T, b: T) => number, thisArg?: any): Promise<IVector<T, D>> {
    const d = await this.data();
    const indices = argSort(d, compareFn, thisArg);
    return this.view(rlist(indices));
  }

  async filter(callbackfn: (value: T, index: number) => boolean, thisArg?: any): Promise<IVector<T, D>> {
    const d = await this.data();
    const indices = argFilter(d, callbackfn, thisArg);
    return this.view(rlist(indices));
  }
}
