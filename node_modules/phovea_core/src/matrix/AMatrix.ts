/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {IPersistable} from '../index';
import {RangeLike, all, range, parse} from '../range';
import Range from '../range/Range';
import {resolve as resolveIDType} from '../idtype';
import IDType from '../idtype/IDType';
import AProductSelectAble from '../idtype/AProductSelectAble';
import {
  VALUE_TYPE_CATEGORICAL, VALUE_TYPE_INT, VALUE_TYPE_REAL, ICategoricalValueTypeDesc, INumberValueTypeDesc,
  IValueTypeDesc
} from '../datatype';
import {IVector} from '../vector';
import {IStatistics, IHistogram, computeStats, hist, categoricalHist, IAdvancedStatistics, computeAdvancedStats} from '../math';
import {IMatrix, IHeatMapUrlOptions} from './IMatrix';
import SliceColVector from './internal/SliceColVector';
import ProjectedVector from './internal/ProjectedVector';

function flatten<T>(arr: T[][], indices: Range, select: number = 0) {
  let r: T[]= [];
  const dim = [arr.length, arr[0].length];
  if (select === 0) {
    r = r.concat.apply(r, arr);
  } else {
    //stupid slicing
    for (let i = 0; i < dim[1]; ++i) {
      arr.forEach((ai) => {
        r.push(ai[i]);
      });
    }
  }
  return {
    data: r,
    indices: indices.dim(select).repeat(dim[1 - select])
  };
}

/**
 * base class for different Matrix implementations, views, transposed,...
 */
export abstract class AMatrix<T, D extends IValueTypeDesc> extends AProductSelectAble {
  constructor(protected root: IMatrix<T, D>) {
    super();
  }

  abstract size(): number[];

  abstract data(range?: RangeLike): Promise<T[][]>;

  abstract t: IMatrix<T, D>;

  get dim() {
    return this.size();
  }

  get length() {
    return this.nrow * this.ncol;
  }

  get nrow() {
    return this.dim[0];
  }

  get ncol() {
    return this.dim[1];
  }

  get indices(): Range {
    return range([0, this.nrow], [0, this.ncol]);
  }

  view(range: RangeLike = all()): IMatrix<T, D> {
    const r = parse(range);
    if (r.isAll) {
      return this.root;
    }
    return new MatrixView(this.root, r);
  }

  slice(col: number): IVector<T, D> {
    return new SliceColVector(this.root, col);
  }

  async stats(range: RangeLike = all()): Promise<IStatistics> {
    const v = this.root.valuetype;
    if (v.type === VALUE_TYPE_INT || v.type === VALUE_TYPE_REAL) {
      return computeStats(...<any>await this.data(range));
    }
    return Promise.reject('invalid value type: ' + v.type);
  }

  async statsAdvanced(range: RangeLike = all()): Promise<IAdvancedStatistics> {
    const v = this.root.valuetype;
    if (v.type === VALUE_TYPE_INT || v.type === VALUE_TYPE_REAL) {
      return computeAdvancedStats([].concat(...<any>await this.data(range)));
    }
    return Promise.reject('invalid value type: ' + v.type);
  }

  async hist(bins?: number, range: RangeLike = all(), containedIds = 0): Promise<IHistogram> {
    const v = this.root.valuetype;
    const d = await this.data(range);
    const flat = flatten(d, this.indices, containedIds);
    switch (v.type) {
      case VALUE_TYPE_CATEGORICAL:
        const vc = <ICategoricalValueTypeDesc><any>v;
        return categoricalHist<string>(<any[]>flat.data, flat.indices, flat.data.length, vc.categories.map((d) => typeof d === 'string' ? d : d.name),
          vc.categories.map((d) => typeof d === 'string' ? d : d.label || d.name),
          vc.categories.map((d) => typeof d === 'string' ? 'gray' : d.color || 'gray'));
      case VALUE_TYPE_INT:
      case VALUE_TYPE_REAL:
        const vn = <INumberValueTypeDesc><any>v;
        return hist(<any[]>flat.data, flat.indices, flat.data.length, bins ? bins : Math.round(Math.sqrt(this.length)), vn.range);
      default:
        return Promise.reject<IHistogram>('invalid value type: ' + v.type); //cant create hist for unique objects or other ones
    }
  }

  async idView(idRange: RangeLike = all()): Promise<IMatrix<T, D>> {
    const r = parse(idRange);
    if (r.isAll) {
      return Promise.resolve(this.root);
    }
    const ids = await this.ids();
    return this.view(ids.indexOf(r));
  }

  reduce<U, UD extends IValueTypeDesc>(f: (row: T[]) => U, thisArgument?: any, valuetype?: UD, idtype?: IDType): IVector<U,UD> {
    return new ProjectedVector(this.root, f, thisArgument, valuetype, idtype);
  }

  restore(persisted: any): IPersistable {
    if (persisted && persisted.f) {
      /* tslint:disable:no-eval */
      return this.reduce(eval(persisted.f), this, persisted.valuetype, persisted.idtype ? resolveIDType(persisted.idtype) : undefined);
      /* tslint:enable:no-eval */
    } else if (persisted && persisted.range) { //some view onto it
      return this.view(parse(persisted.range));
    } else if (persisted && persisted.transposed) {
      return (<IMatrix<T, D>>(<any>this)).t;
    } else if (persisted && persisted.col) {
      return this.slice(+persisted.col);
    } else if (persisted && persisted.row) {
      return this.t.slice(+persisted.row);
    } else {
      return <IPersistable>(<any>this);
    }
  }

}
export default AMatrix;

// circular dependency thus not extractable
/**
 * view on the matrix restricted by a range
 * @param root underlying matrix
 * @param range range selection
 * @param t optional its transposed version
 * @constructor
 */
export class MatrixView<T, D extends IValueTypeDesc> extends AMatrix<T, D> {
  constructor(root: IMatrix<T, D>, private range: Range, public readonly t: IMatrix<T, D> = null) {
    super(root);
    this.range = range;
    //ensure that there are two dimensions
    range.dim(0);
    range.dim(1);
    if (!t) {
      this.t = new MatrixView(root.t, range.swap(), this);
    }
  }

  get desc() {
    return this.root.desc;
  }

  persist() {
    return {
      root: this.root.persist(),
      range: this.range.toString()
    };
  }

  ids(range: RangeLike = all()) {
    return this.root.ids(this.range.preMultiply(parse(range), this.root.dim));
  }

  cols(range: RangeLike = all()) {
    return this.root.cols(this.range.preMultiply(parse(range), this.root.dim));
  }

  colIds(range: RangeLike = all()) {
    return this.root.colIds(this.range.preMultiply(parse(range), this.root.dim));
  }

  rows(range: RangeLike = all()) {
    return this.root.rows(this.range.preMultiply(parse(range), this.root.dim));
  }

  rowIds(range: RangeLike = all()) {
    return this.root.rowIds(this.range.preMultiply(parse(range), this.root.dim));
  }

  size() {
    return this.range.size(this.root.dim);
  }

  at(i: number, j: number) {
    const inverted = this.range.invert([i, j], this.root.dim);
    return this.root.at(inverted[0], inverted[1]);
  }

  data(range: RangeLike = all()) {
    return this.root.data(this.range.preMultiply(parse(range), this.root.dim));
  }

  hist(bins?: number, range: RangeLike = all(), containedIds = 0): Promise<IHistogram> {
    return this.root.hist(bins, this.range.preMultiply(parse(range), this.root.dim), containedIds);
  }

  stats(range: RangeLike = all()): Promise<IStatistics> {
    return this.root.stats(this.range.preMultiply(parse(range), this.root.dim));
  }

  statsAdvanced(range: RangeLike = all()): Promise<IAdvancedStatistics> {
    return this.root.statsAdvanced(this.range.preMultiply(parse(range), this.root.dim));
  }

  heatmapUrl(range = all(), options: IHeatMapUrlOptions = {}) {
    return this.root.heatmapUrl(this.range.preMultiply(parse(range), this.root.dim), options);
  }

  view(range: RangeLike = all()) {
    const r = parse(range);
    if (r.isAll) {
      return this;
    }
    return new MatrixView(this.root, this.range.preMultiply(r, this.dim));
  }

  get valuetype() {
    return this.root.valuetype;
  }

  get rowtype() {
    return this.root.rowtype;
  }

  get coltype() {
    return this.root.coltype;
  }

  get producttype() {
    return this.root.producttype;
  }

  get idtypes() {
    return this.root.idtypes;
  }
}

