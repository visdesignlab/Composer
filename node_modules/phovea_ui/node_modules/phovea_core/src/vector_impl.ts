/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {isFunction, argList, argSort, argFilter} from './index';
import {getAPIJSON} from './ajax';
import {all, Range, range, CompositeRange1D, list as rlist, asUngrouped, composite, parse} from './range';
import {SelectAble, resolve, IDType} from './idtype';
import {IDataDescription, categorical2partitioning, IDataType, mask, DataTypeBase} from './datatype';
import {computeStats, IStatistics, IHistogram, categoricalHist, hist, rangeHist} from './math';
import {IVector} from './vector';
import {IStratification,IGroup, StratificationGroup} from './stratification';

/**
 * base class for different Vector implementations, views, transposed,...
 */
export class VectorBase extends SelectAble {
  constructor(public _root:IVector) {
    super();
  }

  get dim() {
    return [this.length];
  }

  data(range?:Range) : Promise<any[]> {
    throw new Error('not implemented');
  }

  size():number {
    throw new Error('not implemented');
  }

  get length() {
    return this.size();
  }

  view(range:Range = all()):IVector {
    return new VectorView(this._root, range);
  }

  idView(idRange:Range = all()) : Promise<IVector> {
    return this.ids().then((ids) => this.view(ids.indexOf(idRange)));
  }

  stats() : Promise<IStatistics> {
    return this.data().then((d) => computeStats(d));
  }

  get indices() : Range {
    return range(0, this.length);
  }

  /**
   * return the range of this vector as a grouped range, depending on the type this might be a single group or multiple ones
   */
  groups(): Promise<CompositeRange1D> {
    var v = this._root.valuetype;
    if (v.type === 'categorical') {
      return this.data().then((d) => {
        var options: any = {
          name: this._root.desc.id
        };
        if (v.categories[0].color) {
          options.colors = v.categories.map((d) => d.color);
        }
        if (v.categories[0].label) {
          options.labels = v.categories.map((d) => d.label);
        }
        return categorical2partitioning(d, v.categories.map((d) => typeof d === 'string' ? d : d.name), options);
      });
    } else {
      return Promise.resolve(composite(this._root.desc.id, [ asUngrouped(this.indices.dim(0))]));
    }
  }

  stratification(): Promise<IStratification> {
    return this.groups().then((range) => {
      return new StratificationVector(<IVector><any>this, range);
    });
  }

  hist(bins? : number, range = all()) : Promise<IHistogram> {
    var v = this._root.valuetype;
    return this.data(range).then((d) => {
      switch(v.type) {
      case 'categorical':
          return categoricalHist(d, this.indices.dim(0), d.length, v.categories.map((d) => typeof d === 'string' ? d : d.name),
          v.categories.map((d) => typeof d === 'string' ? d : d.name || d.label),
          v.categories.map((d) => typeof d === 'string' ? 'gray' : d.color || 'gray'));
      case 'real':
      case 'int':
        return hist(d, this.indices.dim(0), d.length, bins ? bins : Math.round(Math.sqrt(this.length)), v.range);
      default:
          return null; //cant create hist for unique objects or other ones
      }
    });
  }

  every(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<boolean> {
    return this.data().then((d) => d.every(callbackfn, thisArg));
  }

  some(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<boolean> {
    return this.data().then((d) => d.some(callbackfn, thisArg));
  }

  forEach(callbackfn: (value: any, index: number) => void, thisArg?: any): void {
    this.data().then((d) => d.forEach(callbackfn, thisArg));
  }

  reduce<T,U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U, thisArg?: any): Promise<U> {
    function helper() {
      return callbackfn.apply(thisArg, argList(arguments));
    }
    return this.data().then((d) => d.reduce(helper, initialValue));
  }

  reduceRight<T,U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U, thisArg?: any): Promise<U> {
    function helper() {
      return callbackfn.apply(thisArg, argList(arguments));
    }
    return this.data().then((d) => d.reduceRight(helper, initialValue));
  }

  restore(persisted: any) {
    var r : IVector = <IVector>(<any>this);
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }
}

export interface IVectorLoader {
  (desc: IDataDescription) : Promise<{
    rowIds : Range;
    rows : string[];
    data : any[];
  }>;
}


function viaAPILoader() {
  var _loader = undefined;
  return (desc) => {
    if (_loader) { //in the cache
      return _loader;
    }
    return _loader = getAPIJSON('/dataset/'+desc.id).then(function (data) {
      data.rowIds = parse(data.rowIds);
      return data;
    });
  };
}

function viaDataLoader(rows: string[], rowIds: number[], data: any[]) {
  var _data = undefined;
  return (desc) => {
    if (_data) { //in the cache
      return Promise.resolve(_data);
    }
    _data = {
      rowIds : parse(rowIds),
      rows: rows,
      data: data
    };
    return Promise.resolve(_data);
  };
}

/**
 * root matrix implementation holding the data
 */
export class Vector extends VectorBase implements IVector {
  valuetype:any;
  _idtype:IDType;

  constructor(public desc:IDataDescription, private loader : IVectorLoader) {
    super(null);
    this._root = this;
    var d = <any>desc;
    this.valuetype = d.value;
    this._idtype = resolve(d.idtype);
  }

  get idtype() {
    return this._idtype;
  }

  /**
   * loads all the underlying data in json format
   * TODO: load just needed data and not everything given by the requested range
   * @returns {*}
   */
  load() : Promise<any> {
    return this.loader(this.desc);
  }

  /**
   * access at a specific position
   * @param i
   * @param j
   * @returns {*}
   */
  at(i) {
    return this.load().then(function (d) {
      return d.data[i];
    });
  }

  data(range:Range = all()) {
    var that = this;
    return this.load().then(function (data) {
      return mask(range.filter(data.data, that.dim), that.valuetype);
    });
  }

  names(range:Range = all()) {
    var that = this;
    return this.load().then(function (data) {
      return range.filter(data.rows, that.dim);
    });
  }
  ids(range:Range = all()): Promise<Range> {
    var that = this;
    return this.load().then(function (data) {
      return data.rowIds.preMultiply(range, that.dim);
    });
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return (<any>this.desc).size;
  }

  sort(compareFn?: (a: any, b: any) => number, thisArg?: any): Promise<IVector> {
    return this.data().then((d) => {
      var indices = argSort(d, compareFn, thisArg);
      return this.view(rlist(indices));
    });
  }

  map<U>(callbackfn: (value: any, index: number) => U, thisArg?: any): Promise<IVector> {
    //FIXME
    return null;
  }

  filter(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<IVector> {
    return this.data().then((d) => {
      var indices = argFilter(d, callbackfn, thisArg);
      return this.view(rlist(indices));
    });
  }

  persist() {
    return this.desc.id;
  }
}

/**
 * view on the vector restricted by a range
 * @param root underlying matrix
 * @param range range selection
 * @param t optional its transposed version
 * @constructor
 */
class VectorView extends VectorBase implements IVector {
  constructor(root:IVector, private range:Range) {
    super(root);
  }

  get desc() {
    return this._root.desc;
  }

  persist() {
    return {
      root: this._root.persist(),
      range: this.range.toString()
    };
  }

  size() {
    return this.range.size(this._root.dim)[0];
  }

  at(i:number) {
    var inverted = this.range.invert([i], this._root.dim);
    return this._root.at(inverted[0]);
  }

  data(range:Range = all()) {
    return this._root.data(this.range.preMultiply(range, this._root.dim));
  }

  names(range:Range = all()) {
    return this._root.names(this.range.preMultiply(range, this._root.dim));
  }
  ids(range:Range = all()) {
    return this._root.ids(this.range.preMultiply(range, this._root.dim));
  }

  view(range:Range = all()) {
    if (range.isAll) {
      return this;
    }
    return new VectorView(this._root, this.range.preMultiply(range, this.dim));
  }

  get valuetype() {
    return this._root.valuetype;
  }

  get idtype() {
    return this._root.idtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  /*get indices() {
    return this.range;
  }*/

  sort(compareFn?: (a: any, b: any) => number, thisArg?: any): Promise<IVector> {
    return this.data().then((d) => {
      var indices = argSort(d, compareFn, thisArg);
      return this.view(this.range.preMultiply(rlist(indices)));
    });
  }

  map<U>(callbackfn: (value: any, index: number) => U, thisArg?: any): Promise<IVector> {
    //FIXME
    return null;
  }

  filter(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<IVector> {
    return this.data().then((d) => {
      var indices = argFilter(d, callbackfn, thisArg);
      return this.view(this.range.preMultiply(rlist(indices)));
    });
  }
}


/**
 * root matrix implementation holding the data
 */
export class StratificationVector extends DataTypeBase implements IStratification {

  constructor(private v: IVector, private r: CompositeRange1D) {
    super({
      id: v.desc.id+'-s',
      name: v.desc.name,
      fqname: v.desc.fqname,
      type: 'stratification',
      size: v.dim,
      ngroups: r.groups.length,
      groups : r.groups.map((ri) => ({ name: ri.name, color: ri.color, size: ri.length }))
    });
  }

  get idtype() {
    return this.v.idtype;
  }

  get groups() {
    return <IGroup[]>(<any>this.desc).groups;
  }

  group(group:number):IStratification {
    return new StratificationGroup(this, group, this.groups[group]);
  }

  hist(bins?:number, range=all()):Promise<IHistogram> {
    return this.range().then((r) => {
      return rangeHist(r);
    });
  }

  vector() {
    return Promise.resolve(this.v);
  }

  origin():Promise<IDataType> {
    return this.vector();
  }

  range() {
    return Promise.resolve(this.r);
  }

  idRange() {
    var that = this;
    return this.ids().then((ids) => {
      const range = this.r;
      return ids.dim(0).preMultiply(range, that.dim[0]);
    });
  }

  names(range:Range = all()) {
    return this.v.names(range);
  }

  ids(range:Range = all()):Promise<Range> {
    return this.v.ids(range);
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return (<any>this.desc).size;
  }

  get length() {
    return this.size()[0];
  }

  get ngroups() {
    return (<any>this.desc).ngroups;
  }

  get dim() {
    return this.size();
  }

  persist() {
    return {
      root: this.v.persist(),
      asstrat: true
    };
  }
}


/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {IVector}
 */
export function create(desc: IDataDescription): IVector {
  if (isFunction((<any>desc).loader)) {
    return new Vector(desc, (<any>desc).loader);
  }
  return new Vector(desc, viaAPILoader());
}

export function wrap(desc: IDataDescription, rows: string[], rowIds: number[], data: any[]) {
  return new Vector(desc, viaDataLoader(rows, rowIds, data));
}
