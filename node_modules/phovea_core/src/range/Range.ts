/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import Range1D from './Range1D';

/**
 * multi dimensional version of a RangeDim
 */
export default class Range {
  constructor(public readonly dims: Range1D[] = []) {

  }

  /**
   * checks if this range is all
   * @returns {boolean}
   */
  get isAll() {
    return this.dims.every((dim) => dim.isAll);
  }

  get isNone() {
    return this.dims.every((dim) => dim.isNone);
  }

  /**
   * checks whether there are any wildcards
   */
  get isUnbound() {
    return this.dims.some((dim) => dim.isUnbound);
  }

  get first() {
    return this.dim(0).first;
  }

  get last() {
    return this.dim(0).last;
  }

  /**
   * number of defined dimensions
   * @returns {number}
   */
  get ndim() {
    return this.dims.length;
  }

  eq(other: Range) {
    if (this === other || (this.isAll && other.isAll) || (this.isNone && other.isNone)) {
      return true;
    }
    //TODO more performant comparison
    return this.toString() === other.toString();
  }

  /**
   * combines this range with another and returns a new one
   * this = (1,3,5,7), other = (1,2) -> (1,2)(1,3,5,7) = (3,5)
   * @param other
   * @returns {*}
   */
  preMultiply(other: Range, size?: number[]) {
    if (this.isAll) {
      return other.clone();
    }
    if (other.isAll) {
      return this.clone();
    }
    const r = new Range();
    this.dims.forEach((d, i) => {
      r.dims[i] = d.preMultiply(other.dim(i), size ? size[i] : undefined);
    });
    return r;
  }

  union(other: Range, size?: number[]) {
    if (this.isAll || other.isNone) {
      return this.clone();
    }
    if (other.isAll || this.isNone) {
      return other.clone();
    }
    const r = new Range();
    this.dims.forEach((d, i) => {
      r.dims[i] = d.union(other.dim(i), size ? size[i] : undefined);
    });
    return r;
  }

  /**
   * logical intersection between two ranges
   * @param other
   * @returns {RangeDim}
   */
  intersect(other: Range, size?: number[]) {
    if (this.isNone || other.isNone) {
      return none();
    }
    if (this.isAll) {
      return other.clone();
    }
    if (other.isAll) {
      return this.clone();
    }
    const r = new Range();
    this.dims.forEach((d, i) => {
      r.dims[i] = d.intersect(other.dim(i), size ? size[i] : undefined);
    });
    return r;
  }

  without(without: Range, size?: number[]) {
    if (this.isNone || without.isNone) {
      return this.clone();
    }
    if (without.isAll) {
      return none();
    }
    const r = new Range();
    this.dims.forEach((d, i) => {
      r.dims[i] = d.without(without.dim(i), size ? size[i] : undefined);
    });
    return r;
  }

  /**
   * clones this range
   * @returns {*}
   */
  clone() {
    const r = new Range();
    this.dims.forEach(function (d, i) {
      r.dims[i] = d.clone();
    });
    return r;
  }

  /**
   * create a new range and reverse the dimensions
   */
  swap() {
    return new Range(this.dims.map((d) => d.clone()).reverse());
  }

  /**
   * filter the given multi dimensional data according to the current range
   * @param data
   * @param size the underlying size for negative indices
   * @returns {*}
   */
  filter(data: any[], size?: number[]) {
    if (this.isAll) {
      return data;
    }
    const ndim = this.ndim;
    const that = this;
    //recursive variant for just filtering the needed rows
    const filterDim = (i: number): (d:any)=>any => {
      if (i >= ndim) { //out of range no filtering anymore
        return (d: any) => d;
      }
      const d = that.dim(i);
      const next = filterDim(i + 1); //compute next transform
      const s = size ? size[i] : undefined;
      return (elem: any[]|any) => { //if the value is an array, filter it else return the value
        return Array.isArray(elem) ? d.filter(elem, s, next) : elem;
      };
    };

    const f = filterDim(0);

    return f(data);
  }

  /**
   * return a specific dimension
   * @param dimension
   * @returns {r}
   */
  dim(dimension: number): Range1D {
    const r = this.dims[dimension];
    if (r) {
      return r;
    }
    //not yet existing create one
    this.dims[dimension] = Range1D.all();
    return this.dims[dimension];
  }

  /**
   * transforms the given multi dimensional indices to their parent notation
   * @param indices
   * @param size the underlying size for negative indices
   */
  invert(indices: number[], size?: number[]): number[] {
    if (this.isAll) {
      return indices;
    }
    return indices.map((index, i) => {
      return this.dim(i).invert(index, size ? size[i] : undefined);
    });
  }

  indexRangeOf(r: Range, size?: number[]): Range {
    if (r.isNone || this.isNone) {
      return none();
    }
    if (this.isNone || r.isAll) {
      return this.clone();
    }
    return new Range(this.dims.map((d, i) => d.indexRangeOf(r.dim(i), size ? size[i] : undefined)));
  }

  indexOf(indices: number[]): number[];

  indexOf(index: number): number;

  indexOf(...index: number[]): number[];

  indexOf(r: Range, size?: number[]): Range;

  indexOf(): any {
    if (arguments[0] instanceof Range) {
      return this.indexRangeOf(arguments[0], arguments[1]);
    }
    let arr: number[];
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        return this.dim(0).indexOf(<number>arguments[0]);
      }
      arr = arguments[0];
    } else {
      arr = Array.from(arguments);
    }
    if (arr.length === 0) {
      return [];
    }
    return arr.map((index, i) => this.dim(i).indexOf(index));
  }

  /**
   * returns the range size
   * @param size the underlying size for negative indices
   * @returns {*}
   */
  size(size?: number[]): number[] {
    if (this.isAll) {
      return size;
    }
    return this.dims.map((r, i) => {
      return r.size(size ? size[i] : undefined);
    });
  }

  split(): Range[] {
    return this.dims.map((dim) => {
      return new Range([dim]);
    });
  }

  /**
   * iterates over the product of this range, e.g. (0,1,2),(3) => (0,3),(1,3),(2,3)
   * @param callback
   * @param size
   */
  product(callback: (indices: number[]) => void, size?: number[]) {
    const ndim = this.ndim;
    const iter = (ids: number[]) => {
      const act = ids.length;
      if (act < ndim) {
        const dim = this.dims[act];
        dim.iter(size ? size[act] : null).forEach((id) => {
          ids.push(id);
          iter(ids);
          ids.pop();
        });
      } else {
        callback(ids.slice());
      }
    };
    iter([]);
  }

  /**
   * encoded the given range in a string
   */
  toString() {
    return this.dims.map(function (d) {
      return d.toString();
    }).join(',');
  }
}


/**
 * creates a new range including everything
 * @returns {Range}
 */
export function all() {
  return new Range();
}
export function none() {
  //ensure two dimensions
  return new Range([Range1D.none(), Range1D.none()]);
}
