/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {Range, CompositeRange1D} from './range';
import {IDType} from './idtype';
import {IDataType} from './datatype';
import {IStratification} from './stratification';
import {IStatistics, IHistogram} from './math';

export interface IVector extends IDataType {
  /**
   * length of the vector
   */
  length : number;
  /**
   * type of the value - to be specified
   */
  valuetype:any;
  /**
   * id type
   */
  idtype:IDType;

  /**
   * return the associated ids of this vector
   */
  names(range?:Range) : Promise<string[]>;
  /**
   * creates a new view on this matrix specified by the given range
   * @param range
   */
  view(range?:Range) : IVector;
  /**
   * returns a promise for getting one cell
   * @param i
   * @param j
   */
  at(i:number) : Promise<any>;
  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  data(range?:Range) : Promise<any[]>;

  stats() : Promise<IStatistics>;

  hist(bins? : number, range?:Range) : Promise<IHistogram>;


  /**
   * Sorts an array.
   * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  sort(compareFn?: (a: any, b: any) => number, thisArg?: any): Promise<IVector>;

  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  every(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<boolean>;

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  some(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<boolean>;

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: any, index: number) => void, thisArg?: any): void;

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U>(callbackfn: (value: any, index: number) => U, thisArg?: any): Promise<IVector>;

  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  filter(callbackfn: (value: any, index: number) => boolean, thisArg?: any): Promise<IVector>;

  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  reduce<T>(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue?: T, thisArg?: any): Promise<T>;
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  reduce<T,U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U, thisArg?: any): Promise<U>;

  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  reduceRight<T>(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue?: T, thisArg?: any): Promise<T>;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  reduceRight<T,U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U, thisArg?: any): Promise<U>;


  /**
   * return the range of this vector as a grouped range, depending on the type this might be a single group or multiple ones
   */
  groups(): Promise<CompositeRange1D>;

  stratification(): Promise<IStratification>;
}
