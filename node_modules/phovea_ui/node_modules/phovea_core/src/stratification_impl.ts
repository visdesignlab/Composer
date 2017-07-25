/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {argFilter, argSort} from './index';
import {getAPIJSON} from './ajax';
import {parse, Range1DGroup, composite, Range, list as rlist, CompositeRange1D, all} from './range';
import {IDType, resolve as resolveIDType} from './idtype';
import {IDataDescription, DataTypeBase, IDataType} from './datatype';
import {getFirstByFQName} from './data';
import {IVector} from './vector';
import {VectorBase} from './vector_impl';
import {rangeHist, IHistogram} from './math';
import {IStratification, IGroup, StratificationGroup} from './stratification';

export interface IStratificationLoader {
  (desc:IDataDescription) : Promise<{
    rowIds : Range;
    rows: string[];
    range: CompositeRange1D;
  }>;
}

function createRangeFromGroups(name:string, groups:any[]) {
  return composite(name, groups.map((g) => {
    var r = new Range1DGroup(g.name, g.color || 'gray', parse(g.range).dim(0));
    return r;
  }));
}

function viaAPILoader() {
  var _data = undefined;
  return (desc) => {
    if (_data) { //in the cache
      return _data;
    }
    _data = getAPIJSON('/dataset/' + desc.id).then(function (data) {
      var d = {
        rowIds: parse(data.rowIds),
        rows: data.rows,
        range: createRangeFromGroups(desc.name, data.groups)
      };
      return d;
    });
    return _data;
  };
}

function viaDataLoader(rows:string[], rowIds:number[], range:CompositeRange1D) {
  var _data = undefined;
  return (desc) => {
    if (_data) { //in the cache
      return Promise.resolve(_data);
    }
    _data = {
      rowIds: rlist(rowIds),
      rows: rows,
      range: range
    };
    return Promise.resolve(_data);
  };
}

/**
 * root matrix implementation holding the data
 */
export class Stratification extends DataTypeBase implements IStratification {
  private _idtype:IDType;
  private _v:Promise<IVector>;

  constructor(public desc:IDataDescription, private loader:IStratificationLoader) {
    super(desc);
    var d = <any>desc;
    this._idtype = resolveIDType(d.idtype);
  }

  get idtype() {
    return this._idtype;
  }

  get groups() {
    return <IGroup[]>(<any>this.desc).groups;
  }

  group(group:number):IStratification {
    return new StratificationGroup(this, group, this.groups[group]);
  }

  /**
   * loads all the underlying data in json format
   * TODO: load just needed data and not everything given by the requested range
   * @returns {*}
   */
  private load():Promise<{
    rowIds : Range;
    rows: string[];
    range: CompositeRange1D;
  }> {
    return this.loader(this.desc);
  }

  hist(bins?:number, range?:Range):Promise<IHistogram> {
    //TODO
    return this.range().then((r) => {
      return rangeHist(r);
    });
  }

  vector():Promise<IVector> {
    if (this._v) {
      return this._v;
    }
    this._v = this.load().then((data) => new StratificationVector(this, data.range, this.desc));
    return this._v;
  }

  origin():Promise<IDataType> {
    if ('origin' in this.desc) {
      return getFirstByFQName((<any>this.desc).origin);
    }
    return Promise.reject('no origin specified');
  }

  range() {
    return this.load().then(function (data) {
      return data.range;
    });
  }

  idRange() {
    var that = this;
    return this.load().then(function (data) {
      const ids = data.rowIds.dim(0);
      const range = data.range;
      return ids.preMultiply(range, that.dim[0]);
    });
  }

  names(range:Range = all()) {
    var that = this;
    return this.load().then(function (data) {
      return range.filter(data.rows, that.dim);
    });
  }

  ids(range:Range = all()):Promise<Range> {
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
    return this.desc.id;
  }
}

/**
 * root matrix implementation holding the data
 */
export class StratificationVector extends VectorBase implements IVector {
  valuetype:any;
  desc:IDataDescription;

  private _cache:Promise<string[]> = null;

  constructor(private strat:Stratification, private range:CompositeRange1D, desc:IDataDescription) {
    super(null);
    this._root = this;
    this.valuetype = {
      type: 'categorical',
      categories: range.groups.map((g) => {
        return {name: g.name, label: g.name, color: g.color};
      })
    };
    this.desc = {
      name: desc.name,
      fqname: desc.fqname,
      id: desc.id,
      type: 'vector',
      value: this.valuetype
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

  restore(persisted:any) {
    var r:IVector = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  private load():Promise<any[]> {
    if (this._cache !== null) {
      return this._cache;
    }
    const r:string[] = [];
    this.range.groups.forEach((g) => {
      g.forEach(() => r.push(g.name));
    });
    return this._cache = Promise.resolve(r);
  }

  /**
   * access at a specific position
   * @param i
   * @returns {*}
   */
  at(i) {
    return this.load().then(function (d) {
      return d[i];
    });
  }

  data(range:Range = all()) {
    var that = this;
    return this.load().then(function (data) {
      return range.filter(data, that.dim);
    });
  }

  names(range:Range = all()) {
    return this.strat.names(range);
  }

  ids(range:Range = all()) {
    return this.strat.ids(range);
  }

  size() {
    return this.strat.size();
  }

  sort(compareFn?:(a:any, b:any) => number, thisArg?:any):Promise<IVector> {
    return this.data().then((d) => {
      var indices = argSort(d, compareFn, thisArg);
      return this.view(rlist(indices));
    });
  }

  map<U>(callbackfn:(value:any, index:number) => U, thisArg?:any):Promise<IVector> {
    //FIXME
    return null;
  }

  filter(callbackfn:(value:any, index:number) => boolean, thisArg?:any):Promise<IVector> {
    return this.data().then((d) => {
      var indices = argFilter(d, callbackfn, thisArg);
      return this.view(rlist(indices));
    });
  }
}

/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {IVector}
 */
export function create(desc:IDataDescription):Stratification {
  return new Stratification(desc, viaAPILoader());
}

export function wrap(desc:IDataDescription, rows:string[], rowIds:number[], range:CompositeRange1D) {
  return new Stratification(desc, viaDataLoader(rows, rowIds, range));
}


export function wrapCategoricalVector(v: IVector) {
  var desc : IDataDescription = {
    id: v.desc.id+'-s',
    type: 'stratification',
    name: v.desc.name+'-s',
    fqname: v.desc.fqname+'-s',
    ngroups: (<any>v.desc).value.categories.length,
    size: v.dim
  };
  function loader() {
    return Promise.all<any>([v.groups(), v.ids(), v.names()]).then((args) => {
      return {
        range: args[0],
        rowIds: args[1],
        rows: args[2]
      };
    });
  }
  return new Stratification(desc, loader);
}
