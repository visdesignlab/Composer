/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

/**
 * search item in array by function
 * @param arr
 * @param f
 * @deprecated use Array.prototype.find
 * @return {T}
 */
export function search<T>(arr: T[], f: (v: T) => boolean): T {
  let r: T = undefined;
  arr.some((v) => {
    if (f(v)) {
      r = v;
      return true;
    }
    return false;
  });
  return r;
}

/**
 *
 * @deprecated use Array.prototype.findIndex
 * @param arr
 * @param f
 * @return {number}
 */
export function indexOf<T>(arr: T[], f: (v: T) => boolean): number {
  let r = -1;
  arr.some((v, i) => {
    if (f(v)) {
      r = i;
      return true;
    }
    return false;
  });
  return r;
}

/**
 * converts the given arguments object into an array
 * @param args
 * @deprecated use Array.from(arguments) instead
 * @internal
 * @returns {*|Array}
 */
export function argList(args: IArguments) {
  if (arguments.length > 1) {
    return Array.prototype.slice.call(arguments);
  } else {
    return Array.prototype.slice.call(args);
  }
}

/**
 * array with indices of 0...n-1
 * @param n
 * @returns {any[]}
 */
function indexRange(n: number): number[] {
  //http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.apply(null, {length: n}).map(Number.call, Number);
}

/**
 * returns the sorted indices of this array, when sorting by the given function
 * @param arr
 * @param compareFn
 * @param thisArg
 */
export function argSort<T>(arr: T[], compareFn?: (a: T, b: T) => number, thisArg?: any): number[] {
  const indices = indexRange(arr.length);
  return indices.sort((a: any, b: any) => {
    return compareFn.call(thisArg, arr[a], arr[b]);
  });
}


/**
 * returns the indices, which remain when filtering the given array
 * @param arr
 * @param callbackfn
 * @param thisArg
 */
export function argFilter<T>(arr: T[], callbackfn: (value: T, index: number) => boolean, thisArg?: any): number[] {
  const indices = indexRange(arr.length);
  return indices.filter((value: number, index: number) => {
    return callbackfn.call(thisArg, arr[value], index);
  });
}
