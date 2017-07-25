/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {argList, identity} from './index';
import {IIterator, Iterator, single, concat, forList, range as iRange} from './iterator';

export interface IRangeElem {
  isAll : boolean;
  isUnbound: boolean;
  isSingle : boolean;
  size(size?:number):number;
  clone() : IRangeElem;
  invert(index:number, size?:number);
  __iterator__: IIterator<number>;
  iter(size?:number):IIterator<number>;
  toString();
  from: number;
  step: number;
  to: number;
  reverse() : IRangeElem;
  contains(value:number, size?:number);
}


/**
 * fix negative indices given the total size
 * @param v
 * @param size
 * @returns {number}
 */
function fix(v:number, size:number) {
  return v < 0 ? (size + 1 + v) : v;
}

export class RangeElem implements IRangeElem {
  constructor(public from:number, public to = -1, public step = 1) {
    /*if (step !== 1 && step !== -1) {
      throw new Error('currently just +1 and -1 are valid steps');
    }*/
  }

  get isAll() {
    return this.from === 0 && this.to === -1 && this.step === 1;
  }

  get isSingle() {
    return (this.from + this.step) === this.to;
  }

  get isUnbound() {
    return this.from < 0 || this.to < 0;
  }

  static all() {
    return new RangeElem(0, -1, 1);
  }

  static none() {
    return new RangeElem(0, 0, 1);
  }

  static single(val:number) {
    return new SingleRangeElem(val);
  }

  static range(from:number, to = -1, step = 1) {
    if ((from + step) === to) {
      return RangeElem.single(from);
    }
    return new RangeElem(from, to, step);
  }

  size(size?:number):number {
    const t = fix(this.to, size), f = fix(this.from, size);
    if (this.step === 1) {
      return Math.max(t - f, 0);
    } else if (this.step === -1) {
      return Math.max(f - t, 0);
    }
    const d = this.step > 0 ? (t - f + 1) : (f - t + 1);
    const s = Math.abs(this.step);
    if (d <= 0) { //no range
      return 0;
    }
    return Math.floor(d / s);
  }

  clone() {
    return new RangeElem(this.from, this.to, this.step);
  }

  reverse() {
    const t = this.from < 0 ? this.from : this.from + 1;
    const f = this.to < 0 ? this.to : this.to - 1;
    return new RangeElem(f, t, -this.step);
  }

  invert(index:number, size?:number) {
    if (this.isAll) {
      return index;
    }
    return fix(this.from, size) + index * this.step;
  }

  /**
   * creates an iterator of this range
   * @param size the underlying size for negative indices
   */
  iter(size?:number):IIterator<number> {
    return iRange(fix(this.from, size), fix(this.to, size), this.step);
  }

  get __iterator__() {
    return this.iter();
  }

  contains(value:number, size?:number) {
    const f = fix(this.from, size);
    const t = fix(this.to, size);
    if (this.step === -1) {
      return (value <= f) && (value > t);
    } else { //+1
      return (value >= f) && (value < t);
    }
  }

  toString() {
    if (this.isAll) {
      return '';
    }
    if (this.isSingle) {
      return this.from.toString();
    }
    var r = this.from + ':' + this.to;
    if (this.step !== 1) {
      r += ':' + this.step;
    }
    return r;
  }

  static parse(code:string) {
    if (code.length === 0) {
      return RangeElem.all();
    }
    const parts = code.split(':');
    if (parts.length === 1) {
      return RangeElem.single(parseFloat(parts[0]));
    } else if (parts.length === 2) {
      return new RangeElem(parseFloat(parts[0]), parseFloat(parts[1]));
    }
    return new RangeElem(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
  }
}

export class SingleRangeElem implements IRangeElem {
  constructor(public from:number) {
  }

  get step() {
    return 1;
  }

  get to() {
    return this.from + 1;
  }

  get isAll() {
    return false;
  }

  get isSingle() {
    return true;
  }

  get isUnbound() {
    return false;
  }

  size(size?:number):number {
    return 1;
  }

  clone() {
    return new SingleRangeElem(this.from);
  }

  contains(value:number, size?:number) {
    return fix(this.from, size) === value;
  }

  reverse() {
    return this.clone();
  }

  invert(index:number, size?:number) {
    return fix(this.from, size) + index;
  }

  iter(size?:number):IIterator<number> {
    return single(fix(this.from, size));
  }

  get __iterator__() {
    return this.iter();
  }

  toString() {
    return this.from.toString();
  }
}

export class Range1D {
  private arr:IRangeElem[];

  constructor();
  constructor(base:Range1D);
  constructor(arr:IRangeElem[]);
  constructor(arg?:any) {
    if (arg instanceof Range1D) {
      this.arr = (<Range1D>arg).arr;
    } else if (Array.isArray(arg)) {
      this.arr = <IRangeElem[]>arg;
    } else {
      this.arr = [];
    }
  }

  get length() {
    return this.size();
  }

  static all() {
    return new Range1D([RangeElem.all()]);
  }

  static single(item: number) {
    return new Range1D([RangeElem.single(item)]);
  }

  static none() {
    return new Range1D();
  }

  static from(indices:number[]) {
    return new Range1D(Range1D.compress(indices));
  }

  private static compress(indices:number[]) {
    if (indices.length === 0) {
      return [];
    } else if (indices.length === 1) {
      return [RangeElem.single(indices[0])];
    }
    //return indices.map(RangeElem.single);
    var r = new Array<IRangeElem>(),
      deltas = indices.slice(1).map((e, i) => e - indices[i]),
      start = 0, act = 1, i = 0;
    while (act < indices.length) {
      while (deltas[start] === deltas[act - 1] && act < indices.length) { //while the same delta
        act++;
      }
      if (act === start + 1) { //just a single item used
        r.push(RangeElem.single(indices[start]));
      } else {
        //+1 since end is excluded
        //fix while just +1 -1 is allowed
        if (Math.abs(deltas[start]) === 1) {
          r.push(RangeElem.range(indices[start], indices[act - 1] + deltas[start], deltas[start]));
        } else {
          for (i = start; i < act; i++) {
            r.push(RangeElem.single(indices[i]));
          }
        }
      }
      start = act;
      act += 1;
    }
    while (start < indices.length) { //corner case by adding act+1, it might happen that the last one isnt considered
      r.push(RangeElem.single(indices[start++]));
    }
    return r;
  }

  get isAll() {
    return this.arr.length === 1 && this.at(0).isAll;
  }

  get isNone() {
    return this.arr.length === 0;
  }

  get isUnbound() {
    return this.arr.some((d) => d.isUnbound);
  }

  private get isList() {
    return this.arr.every((d) => d.isSingle);
  }

  push(...items:string[]):number;

  push(...items:IRangeElem[]):number;

  push(...items:any[]):number {
    function p(item:any) {
      if (typeof item === 'string') {
        return RangeElem.parse(item.toString());
      } else if (typeof item === 'number') {
        return RangeElem.single(<number>item);
      } else if (Array.isArray(item)) {
        return new RangeElem(item[0], item[1], item[2]);
      }
      return <RangeElem>item;
    }

    return this.arr.push.apply(this.arr, items.map(p));
  }

  pushSlice(from:number, to:number = -1, step:number = 1) {
    this.arr.push(new RangeElem(from, to, step));
  }

  pushList(indices:number[]) {
    this.arr.push.apply(this.arr, Range1D.compress(indices));
  }

  setSlice(from:number, to:number = -1, step:number = 1) {
    this.arr.length = 0;
    this.pushSlice(from, to, step);
  }

  setList(indices:number[]) {
    this.arr.length = 0;
    this.pushList(indices);
  }

  at(index:number):IRangeElem {
    if (index < 0) {
      index += this.length;
    }
    if (index < 0 || index >= this.arr.length) {
      return RangeElem.none();
    }
    return this.arr[index];
  }

  size(size?:number) {
    const t = this.arr.map((d) => d.size(size));
    return t.reduce((a, b) => a + b, 0);
  }

  /**
   * whether this range is the identity, i.e. the first natural numbers starting with 0
   * @return {boolean}
   */
  get isIdentityRange() {
    return this.arr.length === 1 && this.arr[0].from === 0 && this.arr[0].step === 1;
  }

  repeat(ntimes = 1) {
    if (ntimes === 1) {
      return this;
    }
    const r = this.arr.slice();
    //push n times
    for(let i = 1; i < ntimes; ++i) {
      r.push.apply(r, this.arr);
    }
    return new Range1D(r);
  }

  /**
   * combines this range with another and returns a new one
   * this = (1,3,5,7), sub = (1,2) -> (1,2)(1,3,5,7) = (3,5)
   * @param other
   * @returns {*}
   */
  preMultiply(sub:Range1D, size?:number):Range1D {
    if (this.isAll) {
      return sub.clone();
    }
    if (sub.isAll) {
      return this.clone();
    }
    if (sub.isNone || this.isNone) {
      return Range1D.none();
    }
    if (this.isIdentityRange) { //identity lookup
      return sub.clone();
    }
    //TODO optimize
    const l = this.iter(size).asList();
    const mapImpl = (sub) => {
      const s = sub.iter(l.length);
      var r = [];
      s.forEach((i) => {
        if (i >= 0 && i < l.length) { //check for out of range
          r.push(l[i]);
        }
      });
      return sub.fromLike(r);
    };

    if (sub instanceof CompositeRange1D) {
      return composite(sub.name, sub.groups.map(mapImpl));
    } else {
      return mapImpl(sub);
    }
  }

  /**
   * logical union between two ranges
   * @param other
   * @returns {RangeDim}
   */
  union(other:Range1D, size?:number):Range1D {
    if (this.isAll || other.isNone) {
      return this.clone();
    }
    if (other.isAll || this.isNone) {
      return other.clone();
    }
    const r = this.iter(size).asList();
    const it2 = other.iter(size);
    it2.forEach((i) => {
      if (r.indexOf(i) < 0) {
        r.push(i);
      }
    });
    return other.fromLike(r.sort());
  }

  /**
   * logical intersection between two ranges
   * @param other
   * @returns {RangeDim}
   */
  intersect(other:Range1D, size?:number) {
    if (this.isNone || other.isNone) {
      return Range1D.none();
    }
    if (this.isAll) {
      return other.clone();
    }
    if (other.isAll) {
      return this.clone();
    }
    const it1 = this.iter(size).asList();
    const it2 = other.iter(size);
    var r = [];
    it2.forEach((i) => {
      if (it1.indexOf(i) >= 0) {
        r.push(i);
      }
    });
    return other.fromLike(r.sort());
  }

  toSet(size?:number) {
    return this.removeDuplicates(size);
  }

  /**
   * logical difference between two ranges
   * @param without
   * @returns {RangeDim}
   */
  without(without:Range1D, size?:number) {
    if (this.isNone || without.isNone) {
      return this.clone();
    }
    if (without.isAll) {
      return Range1D.none();
    }
    const it1 = this.iter(size);
    const it2 = without.iter(size).asList();
    var r = [];
    it1.forEach((i) => {
      if (it2.indexOf(i) < 0) {
        r.push(i);
      }
    });
    return Range1D.from(r.sort());
  }

  /**
   * clones this range
   * @returns {RangeDim}
   */
  clone() {
    return new Range1D(this.arr.map((d) => d.clone()));
  }

  /**
   * inverts the given index to the original range
   * @param index
   * @param size the underlying size for negative indices
   * @returns {*}
   */
  invert(index:number, size?:number) {
    if (this.isAll) {
      return index;
    }
    if (this.isNone) {
      return -1; //not mapped
    }
    var act = 0, s = this.arr[0].size(size), total:number = s;
    while (total > index && act < this.length) {
      act++;
      s = this.arr[act].size(size);
      total += s;
    }
    if (act >= this.arr.length) {
      return -1; //not mapped
    }
    return this.arr[act - 1].invert(index - total + s, size);
  }

  indexOf(indices:number[]):number[];

  indexOf(index:number):number;

  indexOf(...index:number[]):number[];

  indexOf(r:Range1D, size?:number):Range1D;

  /**
   * returns the index(ices) of the given elements
   * @return {*}
   */
  indexOf():any {
    if (arguments[0] instanceof Range) {
      return this.indexRangeOf(arguments[0], arguments[1]);
    }
    var arr:number[];
    var base = this.iter().asList();
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        return base.indexOf(<number>arguments[0]);
      }
      arr = arguments[0];
    } else {
      arr = argList(arguments);
    }
    if (arr.length === 0) {
      return [];
    }
    return arr.map((index, i) => base.indexOf(index));
  }

  /**
   * returns the range representing the indices of the given range within the current data
   * @param r
   * @param size
   * @return {Range1D}
   */
  indexRangeOf(r:Range1D, size?:number) {
    if (r.isNone || this.isNone) {
      return r.fromLike([]);
    }
    if (r.isAll) { //index of all is still all
      return Range1D.all();
    }
    //
    var mapImpl;
    if (this.isIdentityRange) {
      let end = this.arr[0].to;
      mapImpl = (d, result) => {
        if (d >= 0 && d < end) {
          result.push(d);
        }
      };
    } else {
      var arr = this.iter().asList();
      mapImpl = (d, result) => {
        var i = arr.indexOf(d);
        if (i >= 0) {
          result.push(i);
        }
      };
    }
    if (r instanceof CompositeRange1D) {
      return composite(r.name, r.groups.map((g) => {
        var result = [];
        g.forEach((d) => mapImpl(d, result));
        return g.fromLike(result);
      }));
    } else {
      var result = [];
      r.forEach((d) => mapImpl(d, result));
      return r.fromLike(result);
    }
  }

  /**
   * filters the given data according to this range
   * @param data
   * @param size the total size for resolving negative indices
   * @returns {*}
   */
  filter(data:any[], size?:number, transform:(any) => any = identity) {
    if (this.isAll) {
      return data.map(transform);
    }
    var it = this.iter(size);
    //optimization
    if (it.byOne && it instanceof Iterator) {
      return data.slice((<Iterator><any>it).from, (<Iterator><any>it).to).map(transform);
      //} else if (it.byMinusOne) {
      //  var d = data.slice();
      //  d.reverse();
      //  return d;
    } else {
      var r = [];
      while (it.hasNext()) {
        r.push(transform(data[it.next()]));
      }
      return r;
    }
  }

  /**
   * creates an iterator of this range
   * @param size the underlying size for negative indices
   */
  iter(size?:number):IIterator<number> {
    if (this.isList) {
      return forList(this.arr.map((d) => (<any>d).from));
    }
    const its : IIterator<number>[] = this.arr.map((d) => d.iter(size));
    return concat.apply(null, its);
  }

  get __iterator__() {
    return this.iter();
  }

  asList(size?:number):number[] {
    return this.iter(size).asList();
  }

  get first() {
    if (this.isNone) {
      return null;
    }
    return this.arr[0].from;
  }

  get last() {
    if (this.isNone) {
      return null;
    }
    return this.arr[this.arr.length-1].from;
  }

  /**
   * for each element
   * @param callbackfn
   * @param thisArg
   */
  forEach(callbackfn:(value:number, index: number) => void, thisArg?:any):void {
    return this.iter().forEach(callbackfn, thisArg);
  }

  contains(value:number, size?:number):boolean {
    return this.arr.some((elem) => elem.contains(value, size));
  }

  /**
   * sort
   * @param cmp
   * @return {Range1D}
   */
  sort(cmp:(a:number, b:number) => number = (a,b) => a-b):Range1D {
    var arr = this.iter().asList();
    var r = arr.sort(cmp);
    return this.fromLike(r);
  }

  private removeDuplicates(size?:number): Range1D {
    var arr = this.iter().asList();
    arr = arr.sort();
    arr = arr.filter((di, i) => di !== arr[i-1]); //same value as before, remove
    return Range1D.from(arr);
  }

  /**
   * reverts the order of this range
   */
  reverse():Range1D {
    var a = this.arr.map((r) => r.reverse());
    a.reverse();
    return new Range1D(a);
  }

  toString() {
    if (this.isAll) {
      return '';
    }
    if (this.length === 1) {
      return this.arr[0].toString();
    }
    return '(' + this.arr.join(',') + ')';
  }

  eq(other:Range1D) {
    if (this === other || (this.isAll && other.isAll) || (this.isNone && other.isNone)) {
      return true;
    }
    //TODO more performant comparison
    return this.toString() === other.toString();
  }

  fromLike(indices: number[]) {
    return Range1D.from(indices);
  }
}

export class Range1DGroup extends Range1D {
  constructor(public name:string, public color:string, base?:Range1D) {
    super(base);
  }

  preMultiply(sub:Range1D, size?:number):Range1DGroup {
    var r = super.preMultiply(sub, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  union(other:Range1D, size?:number):Range1DGroup {
    var r = super.union(other, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  intersect(other:Range1D, size?:number):Range1DGroup {
    var r = super.intersect(other, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  without(without:Range1D, size?:number):Range1DGroup {
    var r = super.without(without, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  clone():Range1DGroup {
    return new Range1DGroup(this.name, this.color, super.clone());
  }

  toString() {
    return '"' + this.name + '""' + this.color + '"' + super.toString();
  }

  toSet(size?:number): Range1DGroup {
    return new Range1DGroup(this.name, this.color, super.toSet(size));
  }

  fromLike(indices: number[]) {
    return new Range1DGroup(this.name, this.color, super.fromLike(indices));
  }
}

export function asUngrouped(range:Range1D) {
  return new Range1DGroup('unnamed', 'gray', range);
}

export function composite(name:string, groups:Range1DGroup[]) {
  return new CompositeRange1D(name, groups);
}

function toBase(groups:Range1DGroup[]) {
  if (groups.length === 1) {
    return groups[0];
  }
  var r = groups[0].iter().asList();
  groups.slice(1).forEach((g) => {
    g.iter().forEach((i) => {
      if (r.indexOf(i) < 0) {
        r.push(i);
      }
    });
  });
  return Range1D.from(r);
}

export class CompositeRange1D extends Range1D {
  constructor(public name:string, public groups:Range1DGroup[], base?:Range1D) {
    super(base ? base : toBase(groups));
  }

  preMultiply(sub:Range1D, size?:number):Range1D {
    var r = this.groups.length > 1 ? super.preMultiply(sub, size) : undefined;
    return new CompositeRange1D(this.name, this.groups.map((g) => <Range1DGroup>g.preMultiply(sub, size)), r);
  }

  union(other:Range1D, size?:number) {
    var r = this.groups.length > 1 ? super.union(other, size) : undefined;
    return new CompositeRange1D(this.name, this.groups.map((g) => <Range1DGroup>g.union(other, size)), r);
  }

  intersect(other:Range1D, size?:number) {
    var r = this.groups.length > 1 ? super.intersect(other, size) : undefined;
    return new CompositeRange1D(this.name, this.groups.map((g) => <Range1DGroup>g.intersect(other, size)), r);
  }

  without(without:Range1D, size?:number) {
    var r = this.groups.length > 1 ? super.without(without, size) : undefined;
    return new CompositeRange1D(this.name, this.groups.map((g) => <Range1DGroup>g.without(without, size)), r);
  }

  clone() {
    var r = this.groups.length > 1 ? super.clone() : undefined;
    return new CompositeRange1D(name, this.groups.map((g) => <Range1DGroup>g.clone()), r);
  }

  sort(cmp?:(a:number, b:number) => number):Range1D {
    var r = this.groups.length > 1 ? super.sort(cmp) : undefined;
    return new CompositeRange1D(this.name, this.groups.map((g) => <Range1DGroup>g.sort(cmp)), r);
  }

  toSet(size?:number): CompositeRange1D {
    var r = this.groups.length > 1 ? super.toSet(size) : undefined;
    return new CompositeRange1D(this.name, this.groups.map((g) => <Range1DGroup>g.toSet(size)), r);
  }

  toString() {
    return '"' + this.name + '"{' + this.groups.join(',') + '}';
  }
}

/**
 * multi dimensional version of a RangeDim
 */
export class Range {
  constructor(public dims = new Array<Range1D>()) {

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

  eq(other:Range) {
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
  preMultiply(other:Range, size?:number[]) {
    if (this.isAll) {
      return other.clone();
    }
    if (other.isAll) {
      return this.clone();
    }
    var r = new Range();
    this.dims.forEach((d, i) => {
      r.dims[i] = d.preMultiply(other.dim(i), size ? size[i] : undefined);
    });
    return r;
  }

  union(other:Range, size?:number[]) {
    if (this.isAll || other.isNone) {
      return this.clone();
    }
    if (other.isAll || this.isNone) {
      return other.clone();
    }
    var r = new Range();
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
  intersect(other:Range, size?:number[]) {
    if (this.isNone || other.isNone) {
      return none();
    }
    if (this.isAll) {
      return other.clone();
    }
    if (other.isAll) {
      return this.clone();
    }
    var r = new Range();
    this.dims.forEach((d, i) => {
      r.dims[i] = d.intersect(other.dim(i), size ? size[i] : undefined);
    });
    return r;
  }

  /**
   * logical difference between two ranges
   * @param other
   * @returns {RangeDim}
   */
  without(without:Range, size:number[]) {
    if (this.isNone || without.isNone) {
      return this.clone();
    }
    if (without.isAll) {
      return none();
    }
    var r = new Range();
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
    var r = new Range();
    this.dims.forEach(function (d, i) {
      r.dims[i] = d.clone();
    });
    return r;
  }

  /**
   * create a new range and reverse the dimensions
   */
  swap() {
    var r = new Range();
    r.dims = this.dims.map((d) => d.clone()).reverse();
    return r;
  }

  /**
   * filter the given multi dimensional data according to the current range
   * @param data
   * @param size the underlying size for negative indices
   * @returns {*}
   */
  filter(data:any[], size?:number[]) {
    if (this.isAll) {
      return data;
    }
    var ndim = this.ndim;
    var that = this;
    //recursive variant for just filtering the needed rows
    function filterDim(i:number) {
      if (i >= ndim) { //out of range no filtering anymore
        return identity;
      }
      var d = that.dim(i);
      var next = filterDim(i + 1); //compute next transform
      var s = size ? size[i] : undefined;
      return (elem) => { //if the value is an array, filter it else return the value
        return Array.isArray(elem) ? d.filter(elem, s, next) : elem;
      };
    }

    var f = filterDim(0);

    return f(data);
  }

  /**
   * return a specific dimension
   * @param dimension
   * @returns {r}
   */
  dim(dimension:number):Range1D {
    var r = this.dims[dimension];
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
  invert(indices:number[], size?:number[]):number[] {
    if (this.isAll) {
      return indices;
    }
    return indices.map((index, i) => {
      return this.dim(i).invert(index, size ? size[i] : undefined);
    });
  }

  indexRangeOf(r:Range, size?:number[]):Range {
    if (r.isNone || this.isNone) {
      return none();
    }
    if (this.isNone || r.isAll) {
      return this.clone();
    }
    return new Range(this.dims.map((d, i) => d.indexRangeOf(r.dim(i), size ? size[i] : undefined)));
  }

  indexOf(indices:number[]):number[];

  indexOf(index:number):number;

  indexOf(...index:number[]):number[];

  indexOf(r:Range, size?:number[]):Range;

  indexOf():any {
    if (arguments[0] instanceof Range) {
      return this.indexRangeOf(arguments[0], arguments[1]);
    }
    var arr:number[];
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        return this.dim(0).indexOf(<number>arguments[0]);
      }
      arr = arguments[0];
    } else {
      arr = argList(arguments);
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
  size(size?:number[]):number[] {
    if (this.isAll) {
      return size;
    }
    return this.dims.map((r, i) => {
      return r.size(size ? size[i] : undefined);
    });
  }

  split():Range[] {
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
        let dim = this.dims[act];
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
  var r = new Range();
  r.dims = [Range1D.none(), Range1D.none()];
  return r;
}

/**
 * test if the given object is a range
 */
export function is(obj:any) {
  return obj instanceof Range;
}

export function range(from:number, to?:number, step?:number)
export function range(...ranges:number[][]);
export function range() {
  if (arguments.length === 0) {
    return all();
  }
  var r = new Range();
  if (Array.isArray(arguments[0])) { //array mode
    argList(arguments).forEach((arr:number[], i) => {
      if (arr.length === 0) {
        return;
      }
      r.dim(i).setSlice(arr[0], arr[1], arr[2]);
    });
  }
  if (typeof arguments[0] === 'number') { //single slice mode
    r.dim(0).setSlice(arguments[0], arguments[1], arguments[2]);
  }
  return r;
}
export function join(ranges:Range[]);
export function join(...ranges:Range[]);
export function join() {
  if (arguments.length === 0) {
    return all();
  }
  var r = new Range();
  var ranges = arguments[0];
  if (!Array.isArray(ranges)) { //array mode
    ranges = argList(arguments);
  }
  r.dims = ranges.map((r) => r.dim(0));
  return r;
}

export function list(...dims_indices_indexarray:(Range1D | number[] | number)[]):Range;
export function list(dims:Range1D[]):Range;
export function list():Range {
  if (arguments.length === 0) {
    return all();
  }
  var r = new Range();
  if (Array.isArray(arguments[0]) && arguments[0][0] instanceof Range1D) {
    r.dims = arguments[0];
  } else if (Array.isArray(arguments[0])) { //array mode
    argList(arguments).forEach((arr:any, i) => {
      if (arr instanceof Range1D) {
        r.dims[i] = arr;
      } else {
        r.dim(i).setList(arr);
      }
    });
  } else if (typeof arguments[0] === 'number') { //single slice mode
    r.dim(0).setList(argList(arguments));
  } else if (arguments[0] instanceof Range1D) {
    r.dims = argList(arguments);
  }
  return r;
}

//Range EBNF grammar
//R   = Dim { ',' Dim }
//Dim = '' | SR | '(' SR { ',' SR ' } ')'
//SR  = N [ ':' N [ ':' N ] ]
//N   = '0'...'9'
//Str =  '"' literal '"'
//Name= Str
//Col = Str
//GDim= Name Col Dim
//CDim= Name '{' GDim { ',' GDim } '}'


/**
 * parse the give code created toString
 * @param code
 * @returns {Range}
 */
function parseRange(code:string) {
  var act = 0, c:string;
  var dims = new Array<Range1D>(), t;
  code = code.trim();
  while (act < code.length) {
    c = code.charAt(act);
    switch (c) {
      case '"' :
        t = parseNamedRange1D(code, act);
        act = t.act + 1; //skip ,
        dims.push(t.dim);
        break;
      case ',' :
        act++;
        dims.push(Range1D.all());
        break;
      default:
        if (c.match(/\s/)) {
          act++;
        } else {
          t = parseRange1D(code, act);
          act = t.act + 1; //skip ,
          dims.push(t.dim);
        }
        break;
    }
  }
  if (code.charAt(code.length-1) === ',') { //last is an empty one
    dims.push(Range1D.all());
  }
  var r = new Range(dims);
  return r;
}

function parseNamedRange1D(code:string, act:number):{ dim : Range1D; act: number} {
  act += 1; //skip "
  var end = code.indexOf('"', act);
  var name = code.slice(act, end);
  var r;
  act = end + 1;
  switch (code.charAt(act)) {
    case '"':
      end = code.indexOf('"', act + 1);
      r = parseRange1D(code, end + 1);
      return {
        dim: new Range1DGroup(name, code.slice(act + 1, end), r.dim),
        act: r.act
      };
    case '{':
      var groups = [];
      while (code.charAt(act) !== '}') {
        r = parseNamedRange1D(code, act + 1);
        groups.push(r.dim);
        act = r.act;
      }
      return {
        dim: new CompositeRange1D(name, groups),
        act: r.act + 1
      };
    default: //ERROR
      return {
        dim: Range1D.all(),
        act: act
      };
  }
}

function parseRange1D(code:string, act:number) {
  var next, r = new Range1D();
  switch (code.charAt(act)) {
    case ',':
    case '}':
      next = act;
      r = Range1D.all();
      break;
    case '(':
      next = code.indexOf(')', act);
      if (next > act+1) { //not ()
        r.push.apply(r, code.slice(act + 1, next).split(',').map(RangeElem.parse));
      }
      next += 1; //skip )
      break;
    default:
      next = code.indexOf('}', act);
      let n2 = code.indexOf(',', act);
      if (next >= 0 && n2 >= 0) {
        next = Math.min(next, n2);
      } else if (next < 0) {
        next = n2;
      }

      if (next < 0) {
        next = code.length;
      }
      r = new Range1D([RangeElem.parse(code.slice(act, next))]);
      break;
  }
  return {
    act: next,
    dim: r
  };
}

/**
 * something that can be parsed as a range
 */
export type RangeLike = Range | number[] | number[][] | string;

/**
 * parses the given encoded string created by toString to a range object
 * @param arange something like a range
 * @returns {Range}
 */
export function parse(arange:RangeLike = null) {

  if (arange === null) {
    return all();
  }
  if (arange instanceof Range) {
    return <Range>arange;
  }
  if (Array.isArray(arange)) {
    if (Array.isArray(arange[0])) {
      return list(...<number[][]>arange);
    }
    return list(<number[]>arange);
  }
  return parseRange(argList(arguments).map(String).join(','));
}

export function cell(...dim_indices: number[]) {
  return new Range(dim_indices.map(Range1D.single));
}
