/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {all, list as rlist, RangeLike, range, asUngrouped, composite, parse} from '../range';
import Range from '../range/Range';
import CompositeRange1D from '../range/CompositeRange1D';
import {argSort, argFilter} from '../index';
import {SelectAble, resolve as resolveIDType, IDType} from '../idtype';
import {
  categorical2partitioning,
  ICategorical2PartitioningOptions,
  ICategory,
  ICategoricalValueTypeDesc,
  INumberValueTypeDesc,
  VALUE_TYPE_CATEGORICAL,
  VALUE_TYPE_INT,
  VALUE_TYPE_REAL, IValueTypeDesc
} from '../datatype';
import {
  computeAdvancedStats,
  IAdvancedStatistics,
  IHistogram,
  categoricalHist,
  hist,
  IStatistics,
  computeStats
} from '../math';
import {IVector} from './IVector';
import {IStratification} from '../stratification';
import StratificationVector from './internal/StratificationVector';
import ProjectedAtom from './internal/ProjectedAtom';
import IAtom, {IAtomValue} from '../atom/IAtom';
/**
 * base class for different Vector implementations, views, transposed,...
 * @internal
 */
export abstract class AVector<T,D extends IValueTypeDesc> extends SelectAble {
  constructor(protected root: IVector<T,D>) {
    super();
  }

  get dim() {
    return [this.length];
  }

  abstract data(range?: RangeLike): Promise<any[]>;

  abstract size(): number;

  get length() {
    return this.size();
  }

  view(range: RangeLike = all()): IVector<T,D> {
    return new VectorView(this.root, parse(range));
  }

  async idView(idRange: RangeLike = all()): Promise<IVector<T,D>> {
    const ids = await this.ids();
    return this.view(ids.indexOf(parse(idRange)));
  }

  async stats(range: RangeLike = all()): Promise<IStatistics> {
    if (this.root.valuetype.type !== VALUE_TYPE_INT && this.root.valuetype.type !== VALUE_TYPE_REAL) {
      return Promise.reject('invalid value type: ' + this.root.valuetype.type);
    }
    return computeStats(await this.data(range));
  }

  async statsAdvanced(range: RangeLike = all()): Promise<IAdvancedStatistics> {
    if (this.root.valuetype.type !== VALUE_TYPE_INT && this.root.valuetype.type !== VALUE_TYPE_REAL) {
      return Promise.reject('invalid value type: ' + this.root.valuetype.type);
    }
    return computeAdvancedStats(await this.data(range));
  }

  get indices(): Range {
    return range(0, this.length);
  }

  /**
   * return the range of this vector as a grouped range, depending on the type this might be a single group or multiple ones
   */
  async groups(): Promise<CompositeRange1D> {
    const v = this.root.valuetype;
    if (v.type === VALUE_TYPE_CATEGORICAL) {
      const vc = <ICategoricalValueTypeDesc><any>v;
      const d = await this.data();
      const options: ICategorical2PartitioningOptions = {
        name: this.root.desc.id
      };
      if (typeof vc.categories[0] !== 'string') {
        const vcc = <ICategory[]>vc.categories;
        if (vcc[0].color) {
          options.colors = vcc.map((d) => d.color);
        }
        if (vcc[0].label) {
          options.labels = vcc.map((d) => d.label);
        }
      }
      return categorical2partitioning(d, vc.categories.map((d) => typeof d === 'string' ? d : d.name), options);
    } else {
      return Promise.resolve(composite(this.root.desc.id, [asUngrouped(this.indices.dim(0))]));
    }
  }

  stratification(): Promise<IStratification> {
    return this.asStratification();
  }

  async asStratification(): Promise<IStratification> {
    return new StratificationVector(this.root, await this.groups());
  }

  async hist(bins?: number, range: RangeLike = all()): Promise<IHistogram> {
    const v = this.root.valuetype;
    const d = await this.data(range);
    switch (v.type) {
      case VALUE_TYPE_CATEGORICAL:
        const vc = <ICategoricalValueTypeDesc><any>v;
        return categoricalHist(d, this.indices.dim(0), d.length, vc.categories.map((d) => typeof d === 'string' ? d : d.name),
          vc.categories.map((d) => typeof d === 'string' ? d : d.label || d.name),
          vc.categories.map((d) => typeof d === 'string' ? 'gray' : d.color || 'gray'));
      case VALUE_TYPE_REAL:
      case VALUE_TYPE_INT:
        const vn = <INumberValueTypeDesc><any>v;
        return hist(d, this.indices.dim(0), d.length, bins ? bins : Math.round(Math.sqrt(this.length)), vn.range);
      default:
        return null; //cant create hist for unique objects or other ones
    }
  }

  async every(callbackfn: (value: T, index: number) => boolean, thisArg?: any): Promise<boolean> {
    return (await this.data()).every(callbackfn, thisArg);
  }

  async some(callbackfn: (value: T, index: number) => boolean, thisArg?: any): Promise<boolean> {
    return (await this.data()).some(callbackfn, thisArg);
  }

  async forEach(callbackfn: (value: T, index: number) => void, thisArg?: any) {
    (await this.data()).forEach(callbackfn, thisArg);
  }

  async reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U, thisArg?: any): Promise<U> {
    function helper() {
      return callbackfn.apply(thisArg, Array.from(arguments));
    }

    return (await this.data()).reduce(helper, initialValue);
  }

  async reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U, thisArg?: any): Promise<U> {
    function helper() {
      return callbackfn.apply(thisArg, Array.from(arguments));
    }

    return (await this.data()).reduceRight(helper, initialValue);
  }

  reduceAtom<U, UD extends IValueTypeDesc>(f: (data: T[], ids: Range, names: string[]) => IAtomValue<U>, thisArgument?: any, valuetype?: UD, idtype?: IDType): IAtom<U,UD> {
    const r: IVector<T,D> = <IVector<T,D>>(<any>this);
    return new ProjectedAtom(r, f, thisArgument, valuetype, idtype);
  }

  restore(persisted: any) {
    let r: IVector<T,D> = <IVector<T,D>>(<any>this);
    if (persisted && persisted.f) {
      /* tslint:disable:no-eval */
      return this.reduceAtom(eval(persisted.f), this, persisted.valuetype, persisted.idtype ? resolveIDType(persisted.idtype) : undefined);
      /* tslint:enable:no-eval */
    } else if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }
}

export default AVector;


/**
 * view on the vector restricted by a range
 * @internal
 */
export class VectorView<T,D extends IValueTypeDesc> extends AVector<T,D> {
  /**
   * @param root underlying matrix
   * @param range range selection
   */
  constructor(root: IVector<T,D>, private range: Range) {
    super(root);
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

  size() {
    return this.range.size(this.root.dim)[0];
  }

  at(i: number) {
    const inverted = this.range.invert([i], this.root.dim);
    return this.root.at(inverted[0]);
  }

  data(range: RangeLike = all()) {
    return this.root.data(this.range.preMultiply(parse(range), this.root.dim));
  }

  names(range: RangeLike = all()) {
    return this.root.names(this.range.preMultiply(parse(range), this.root.dim));
  }

  ids(range: RangeLike = all()) {
    return this.root.ids(this.range.preMultiply(parse(range), this.root.dim));
  }

  view(range: RangeLike = all()) {
    const r = parse(range);
    if (r.isAll) {
      return this;
    }
    return new VectorView(this.root, this.range.preMultiply(r, this.dim));
  }

  get valuetype() {
    return this.root.valuetype;
  }

  get idtype() {
    return this.root.idtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  /*get indices() {
   return this.range;
   }*/

  async sort(compareFn?: (a: T, b: T) => number, thisArg?: any): Promise<IVector<T,D>> {
    const d = await this.data();
    const indices = argSort(d, compareFn, thisArg);
    return this.view(rlist(indices));
  }

  async filter(callbackfn: (value: T, index: number) => boolean, thisArg?: any): Promise<IVector<T,D>> {
    const d = await this.data();
    const indices = argFilter(d, callbackfn, thisArg);
    return this.view(rlist(indices));
  }
}

