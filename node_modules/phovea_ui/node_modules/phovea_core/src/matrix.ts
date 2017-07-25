/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {Range} from './range';
import {IProductSelectAble, IDType} from './idtype';
import {IDataType} from './datatype';
import {IVector} from './vector';
import {IHistogram, IStatistics} from './math';

export const IDTYPE_ROW = 0;
export const IDTYPE_COLUMN = 1;
export const IDTYPE_CELL = 2;

export interface IMatrix extends IDataType, IProductSelectAble {
  /**
   * nrow * ncol
   */
  length : number;
  /**
   * number of rows
   */
  nrow: number;
  /**
   * number of cols
   */
  ncol : number;
  /**
   * type of the value - to be specified
   */
  valuetype:any;

  /**
   * row id type
   */
  rowtype:IDType;

  /**
   * column id type
   */
  coltype:IDType;

  /**
   * creates a new view on this matrix specified by the given range
   * @param range
   */
  view(range?:Range) : IMatrix;

  slice(col:number): IVector;

  //view(filter: string): Promise<IMatrix>;

  /**
   * reduces the current matrix to a vector using the given reduce function
   * @param f the reduce function
   * @param this_f the this context for the function default the matrix
   * @param valuetype the new value type by default the same as matrix valuetype
   * @param idtype the new vlaue type by default the same as matrix rowtype
   */
  reduce(f:(row:any[]) => any, this_f?:any, valuetype?:any, idtype?:IDType) : IVector;
  /**
   * transposed version of this matrix
   */
  t : IMatrix;
  /**
   * returns a promise for getting the col names of the matrix
   * @param range
   * @returns {IPromise<string[]>}
   */
  cols(range?:Range) : Promise<string[]>;
  colIds(range?:Range) : Promise<Range>;
  /**
   * returns a promise for getting the row names of the matrix
   * @param range
   */
  rows(range?:Range) : Promise<string[]>;
  rowIds(range?:Range) : Promise<Range>;

  /**
   * returns a promise for getting one cell
   * @param i
   * @param j
   */
  at(i:number, j:number) : Promise<any>;
  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  data(range?:Range) : Promise<any[][]>;

  stats() : Promise<IStatistics>;

  hist(bins?:number, range?:Range, containedIds?:number) : Promise<IHistogram>;


  heatmapUrl(range?:Range, options?:{ format?: string; transpose?: boolean; range?: [number,number]}): string;
}
