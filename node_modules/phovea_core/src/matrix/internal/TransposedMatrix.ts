/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {RangeLike, all, parse} from '../../range';
import {IValueTypeDesc, transpose} from '../../datatype';
import {IMatrix, IHeatMapUrlOptions} from '../IMatrix';
import AMatrix, {MatrixView} from '../AMatrix';
import SliceRowVector from './SliceRowVector';
import {IVector} from '../../vector';
import {IHistogram, IAdvancedStatistics, IStatistics} from '../../math';

/**
 * view on the underlying matrix as transposed version
 * @param base
 * @constructor
 */
export default class TransposedMatrix<T, D extends IValueTypeDesc> extends AMatrix<T,D> {
  readonly t: IMatrix<T,D>;

  constructor(base: IMatrix<T,D>) {
    super(base);
    this.t = base;
  }

  get desc() {
    return this.root.desc;
  }

  persist() {
    return {
      root: this.root.persist(),
      transposed: true
    };
  }

  get valuetype() {
    return this.root.valuetype;
  }

  get rowtype() {
    return this.root.coltype;
  }

  get coltype() {
    return this.root.rowtype;
  }

  get producttype() {
    return this.root.producttype;
  }

  get idtypes() {
    return [this.rowtype, this.coltype];
  }

  async ids(range: RangeLike = all()) {
    const ids = await this.t.ids(range ? parse(range).swap() : undefined);
    return ids.swap();
  }

  cols(range: RangeLike = all()): Promise<string[]> {
    return this.t.rows(range ? parse(range).swap() : undefined);
  }

  colIds(range: RangeLike = all()) {
    return this.t.rowIds(range ? parse(range).swap() : undefined);
  }

  rows(range: RangeLike = all()): Promise<string[]> {
    return this.t.cols(range ? parse(range).swap() : undefined);
  }

  rowIds(range: RangeLike = all()) {
    return this.t.colIds(range ? parse(range).swap() : undefined);
  }

  view(range: RangeLike = all()): IMatrix<T,D> {
    const r = parse(range);
    if (r.isAll) {
      return this;
    }
    return new MatrixView(this.root, r.swap()).t;
  }

  slice(col: number): IVector<T,D> {
    return new SliceRowVector(this.root, col);
  }

  size() {
    const s = this.t.dim;
    return [s[1], s[0]]; //swap dimension
  }

  at(i: number, j: number) {
    return this.t.at(j, i);
  }

  async data(range: RangeLike = all()) {
    return transpose(await this.t.data(range ? parse(range).swap() : undefined));
  }

  hist(bins?: number, range: RangeLike = all(), containedIds = 0): Promise<IHistogram> {
    return this.t.hist(bins, range ? parse(range).swap() : undefined, 1 - containedIds);
  }

  stats(range: RangeLike = all()): Promise<IStatistics> {
    return this.t.stats(range ? parse(range).swap() : undefined);
  }

  statsAdvanced(range: RangeLike = all()): Promise<IAdvancedStatistics> {
    return this.t.statsAdvanced(range ? parse(range).swap() : undefined);
  }

  heatmapUrl(range: RangeLike = all(), options: IHeatMapUrlOptions = {}) {
    options.transpose = options.transpose !== true;
    return this.t.heatmapUrl(range ? parse(range).swap() : undefined, options);
  }
}
