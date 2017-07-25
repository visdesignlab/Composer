/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {IPersistable, isFunction, extendClass, mixin, argList} from './index';
import {ISelectAble, SelectAble} from './idtype';
import {all, none, Range1D, Range1DGroup, composite, Range} from './range';

/**
 * basic description elements
 */
export interface IDataDescription {
  /**
   * the unique id
   */
  id: string;
  /**
   * the type of the datatype, e.g. matrix, vector, stratification, ...
   */
  type: string;

  /**
   * the name of the dataset
   */
  name: string;
  /**
   * a fully qualified name, e.g. project_name/name
   */
  fqname: string;

  [extras: string]: any;
}

/**
 * basic data type interface
 */
export interface IDataType extends ISelectAble, IPersistable {
  /**
   * its description
   */
  desc: IDataDescription;
  /**
   * dimensions of this datatype
   * rows, cols, ....
   */
  dim: number[];


  idView(idRange?: Range) : Promise<IDataType>;
}

export function isDataType(v: any) {
  if (v instanceof DataTypeBase) {
    return true;
  }
  //sounds good
  return (isFunction(v.idView) && isFunction(v.persist) && isFunction(v.restore) && v instanceof SelectAble && ('desc' in v) && ('dim' in v));
}

/**
 * utility to assign a dataset to an html element, similar to d3
 * @param node
 * @param data
 */
export function assignData(node: Element, data: IDataType) {
  (<any>node).__data__ = data;
}

/**
 * dummy data type just holding the description
 */
export class DataTypeBase extends SelectAble implements IDataType {
  constructor(public desc: IDataDescription) {
    super();
  }

  get dim() {
    return [];
  }

  ids(range:Range = all()) : Promise<Range> {
    return Promise.resolve(none());
  }

  idView(idRange?: Range) : Promise<DataTypeBase> {
    return Promise.resolve(this);
  }

  get idtypes() {
    return [];
  }

  persist() : any {
    return this.desc.id;
  }

  restore(persisted: any) {
    return this;
  }

  toString() {
    return this.persist();
  }
}

/**
 * transpose the given matrix
 * @param m
 * @returns {*}
 */
export function transpose(m: any[][]) {
  if (m.length === 0 || m[0].length === 0) {
    return [];
  }
  var r = m[0].map((i) => [i]);
  for(var i = 1; i < m.length; ++i) {
     m[i].forEach((v,i) => r[i].push(v));
  }
  return r;
}

function maskImpl(arr: number|number[], missing: number) {
  if (Array.isArray(arr)) {
    let vs = <number[]>arr;
    if (vs.indexOf(missing) >= 0) {
      return vs.map((v) => v === missing ? NaN : v);
    }
  }
  return arr === missing ? NaN : arr;
}

export function mask(arr: any|any[], desc: { type: string; missing?: number}) {
  if (desc.type === 'int' && 'missing' in desc) {
    return maskImpl(arr, desc.missing);
  }
  return arr;
}


/**
 * converts the given categorical data to a grouped range
 * @param data
 * @param categories
 * @param options
 * @return {any}
 */
export function categorical2partitioning<T>(data: T[], categories: T[], options = {}) {
  const m = mixin({
    skipEmptyCategories : true,
    colors: ['gray'],
    labels: null,
    name: 'Partitioning'
  }, options);
  var groups = categories.map((d, i) => {
    return {
      name: m.labels ? m.labels[i] : d,
      color: m.colors[Math.min(i,m.colors.length-1)],
      indices: []
    };
  });
  data.forEach((d, j) => {
    var i = categories.indexOf(d);
    if (i>=0) {
      groups[i].indices.push(j);
    }
  });
  if (m.skipEmptyCategories) {
    groups = groups.filter((g) => g.indices.length > 0);
  }
  var granges = groups.map((g) => {
    return new Range1DGroup(g.name, g.color, Range1D.from(g.indices));
  });
  return composite(m.name, granges);
}

/**
 * utility function to create a datatype, designed for JavaScript usage
 * @param name
 * @param functions the functions to add
 * @return {function(IDataDescription): undefined}
 */
export function defineDataType(name: string, functions: any) {
  function DataType(desc: IDataDescription) {
    DataTypeBase.call(this, desc);
    if (isFunction(this.init)) {
      this.init.apply(this, argList(arguments));
    }
  }
  extendClass(DataType, DataTypeBase);
  DataType.prototype.toString = () => name;
  DataType.prototype = mixin(DataType.prototype, functions);

  return DataType;
}

