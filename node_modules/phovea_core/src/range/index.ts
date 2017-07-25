/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import Range1D from './Range1D';
import CompositeRange1D from './CompositeRange1D';
import Range1DGroup from './Range1DGroup';
import {all, default as Range, none} from './Range';
import parseRange from './parser';
export {default as Range, all, none} from './Range';
export {default as Range1D} from './Range1D';
export {default as CompositeRange1D} from './CompositeRange1D';
export {default as Range1DGroup} from './Range1DGroup';


/**
 * Ranges define which elements of a data structure should be considered. They are useful for slicing the relevant
 * aspects out of a dataset. Ranges can be defined with from/to/step operators or by using explicit indices.
 *
 * The current range implementation also understands string-based range definitions, such as '(0,10,2)', which are,
 * however, discouraged to be used by external modules.
 *
 * Ranges can be directly created using the constructors, or can be created using the helper functions in this file.
 *
 * Many functions also accept a RangeLike that is parsed automatically into a proper range.
 */


/**
 * Something that can be parsed as a range:
 * Either a proper range, an array (of an array) of numbers (treated as indices), or a string. See parser.ts for
 * rules on string ranges.
 */
export type RangeLike = Range | number[] | number[][] | string;

/**
 * Interprets the parameter options and returns an appropriate range
 *
 * If it is null, returns a new range with all elements.
 * If the RangeLike is a range, then the range is returned unchanged.
 * If it is an array, the numbers in the array are treated as indices for a range.
 * If it is a string, the range is parsed according to the grammar defined in parser.ts
 *
 * @param arange something like a range
 * @returns {Range}
 */
export function parse(arange: RangeLike = null) {
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
  //join given array as string combined with ,
  return parseRange(Array.from(arguments).map(String).join(','));
}


/**
 * A basic interface used to conveniently create ranges
 */
export interface IRangeSlice {
  from: number;
  to?: number;
  step?: number;
}

/**
 * Creates a new range starting at from and optionally up to 'to' and optionally with a step
 * @param from the index where the range starts (included)
 * @param to the index where the range ends (excluded), defaults to the end of the data structure
 * @param step the step size, defaults to 1
 */
export function range(from: number, to?: number, step?: number): Range;
/**
 * Creates a new multidimensional range using step functions.
 * @param ranges Each array can contain up to three indices, the first is read as 'from',
 * the second as 'to' and the third as 'step'. IRangeSlice explicitly defines from/to/step.
 */
export function range(...ranges: (number[]|IRangeSlice)[]): Range;
/**
 * Creates a new range that includes all elements in the data structure
 * @returns {any}
 */
export function range() {
  if (arguments.length === 0) {
    return all();
  }
  const r = new Range();
  if (Array.isArray(arguments[0])) { //array mode
    Array.from(arguments).forEach((arr: number[], i) => {
      if (arr.length === 0) {
        return;
      }
      r.dim(i).setSlice(arr[0], arr[1], arr[2]);
    });
  } else if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
    // slice object mode
    Array.from(arguments).forEach((slice: IRangeSlice, i) => {
      r.dim(i).setSlice(slice.from, slice.to, slice.step);
    });
  } else if (typeof arguments[0] === 'number') { //single slice mode
    r.dim(0).setSlice(arguments[0], arguments[1], arguments[2]);
  }
  return r;
}

/**
 * Creates a new range from a list of indices
 * @param dimsOrIndicesOrIndexArray
 */
export function list(...dimsOrIndicesOrIndexArray: (Range1D | number[] | number)[]): Range;
export function list(dims: Range1D[]): Range;
export function list(): Range {
  if (arguments.length === 0) {
    return all();
  }
  if (Array.isArray(arguments[0]) && arguments[0][0] instanceof Range1D) {
    return new Range(arguments[0]);
  } else if (Array.isArray(arguments[0])) { //array mode
    const r = new Range();
    Array.from(arguments).forEach((arr: any, i) => {
      if (arr instanceof Range1D) {
        r.dims[i] = arr;
      } else {
        r.dim(i).setList(arr);
      }
    });
    return r;
  } else if (typeof arguments[0] === 'number') { //single slice mode
    const r = new Range();
    r.dim(0).setList(Array.from(arguments));
    return r;
  } else if (arguments[0] instanceof Range1D) {
    return new Range(Array.from(arguments));
  }
  return none();
}

/**
 * Joins the specified ranges into a multidimensional range. If no ranges are provided as parameter,
 * returns a new range that includes all elements.
 * @param ranges the ranges to be joined. If the supplied range is a multidimensional range,
 * then the first one is used, the rest is ignored.
 * @return a multidimensional range.
 */
export function join(ranges: Range[]): Range;
export function join(...ranges: Range[]): Range;
export function join() {
  if (arguments.length === 0) {
    return all();
  }
  let ranges = arguments[0];
  if (!Array.isArray(ranges)) { //array mode
    ranges = Array.from(arguments);
  }
  return new Range(ranges.map((r: Range) => r.dim(0)));
}

/**
 * TODO document
 * @param range
 * @return {Range1DGroup}
 */
export function asUngrouped(range: Range1D) {
  return new Range1DGroup('unnamed', 'gray', range);
}

/**
 * TODO document
 * @param name
 * @param groups
 * @return {CompositeRange1D}
 */
export function composite(name: string, groups: Range1DGroup[]) {
  return new CompositeRange1D(name, groups);
}

/**
 * Tests if the given object is a range
 */
export function is(obj: any) {
  return obj instanceof Range;
}

/**
 * TODO document
 * @param dimIndices
 * @return {any}
 */
export function cell(...dimIndices: number[]) {
  return new Range(dimIndices.map(Range1D.single));
}
