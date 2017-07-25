/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {isFunction, argSort, argFilter, IPersistable} from './index';
import {getAPIJSON, api2absURL, getAPIData} from './ajax';
import {list as rlist, Range, all, range, join, Range1D, parse} from './range';
import {IDType, ProductSelectAble, resolve as resolveIDType, resolveProduct, ProductIDType} from './idtype';
import {IDataDescription, mask, transpose} from './datatype';
import {IVector} from './vector';
import {VectorBase} from './vector_impl';
import {IStatistics, IHistogram, computeStats, hist, categoricalHist, wrapHist} from './math';
import {IMatrix} from './matrix';

function flatten(arr : any[][], indices: Range, select: number = 0) {
  var r = [], dim = [arr.length, arr[0].length];
  if (select === 0) {
    r = r.concat.apply(r, arr);
  } else {
    //stupid slicing
    for(var i = 0; i < dim[1]; ++i) {
      arr.forEach((ai) => {
        r.push(ai[i]);
      });
    }
  }
  return {
    data : r,
    indices: indices.dim(select).repeat(dim[1-select])
  };
}


/**
 * base class for different Matrix implementations, views, transposed,...
 */
export class MatrixBase extends ProductSelectAble {
  constructor(public _root:IMatrix) {
    super();
  }

  size():number[] {
    throw new Error('not implemented');
  }

  get dim() {
    return this.size();
  }

  get length() {
    return this.nrow * this.ncol;
  }

  get nrow() {
    return this.dim[0];
  }

  get ncol() {
    return this.dim[1];
  }

  get indices() : Range {
    return range([0, this.nrow], [0, this.ncol]);
  }

  data() : Promise<any[]> {
    throw new Error('not implemented');
  }

  view(): IMatrix;
  view(range:Range) : IMatrix;
  //view(filter: string): Promise<IMatrix>;
  view(): any {
    if (typeof arguments[0] === 'string') {
      return this.dynview(<string>arguments[0]);
    }
    var range : Range = arguments.length === 0 ? all() : arguments[0];
    if (range.isAll) {
      return this._root;
    }
    return new MatrixView(this._root, range);
  }

  dynview(filter: string): Promise<IMatrix> {
    return null;
  }

  slice(col: number) : IVector {
    return new SliceColVector((<IMatrix><any>this), col);
  }

  stats() : Promise<IStatistics> {
    return this.data().then((d) => computeStats(...d));
  }

  hist(bins? : number, range:Range = all(), containedIds = 0) : Promise<IHistogram> {
    var v = this._root.valuetype;
    return this.data().then((d) => {
      var flat = flatten(d, this.indices, containedIds);
      switch(v.type) {
        case 'categorical':
          return categoricalHist(flat.data, flat.indices, flat.data.length, v.categories.map((d) => typeof d === 'string' ? d : d.name),
          v.categories.map((d) => typeof d === 'string' ? d : d.name || d.label),
          v.categories.map((d) => typeof d === 'string' ? 'gray' : d.color || 'gray'));
        case 'real':
        case 'int':
          return hist(flat.data, flat.indices, flat.data.length, bins ? bins : Math.round(Math.sqrt(this.length)), v.range);
        default:
          return null; //cant create hist for unique objects or other ones
      }
    });
  }

  idView(idRange:Range = all()) : Promise<IMatrix> {
    if (idRange.isAll) {
      return Promise.resolve(this._root);
    }
    return this.ids().then((ids) => this.view(ids.indexOf(idRange)));
  }

  reduce(f : (row : any[]) => any, this_f? : any, valuetype? : any, idtype? : IDType) : IVector {
    return new ProjectedVector(<IMatrix>(<any>this), f, this_f, valuetype, idtype);
  }

  restore(persisted: any) : IPersistable {
    if (persisted && persisted.f) {
      /* tslint:disable:no-eval */
      return this.reduce(eval(persisted.f), this, persisted.valuetype, persisted.idtype ? resolveIDType(persisted.idtype) : undefined);
      /* tslint:enable:no-eval */
    } else if (persisted && persisted.range) { //some view onto it
      return this.view(parse(persisted.range));
    } else if (persisted && persisted.transposed) {
      return (<IMatrix>(<any>this)).t;
    } else if (persisted && persisted.col) {
      return this.slice(+persisted.col);
    } else if (persisted && persisted.row) {
      return (<IMatrix>(<any>this)).t.slice(+persisted.row);
    } else {
      return <IPersistable>(<any>this);
    }
  }

}

export interface IMatrixLoader {
  (desc: IDataDescription) : Promise<{
    rowIds : Range;
    rows : string[];
    colIds : Range;
    cols : string[];
    ids: Range;
    data : any[][];
  }>;
}

export interface IMatrixLoader2 {
  rowIds(desc: IDataDescription, range: Range) : Promise<Range>;
  rows(desc: IDataDescription, range: Range) : Promise<string[]>;
  colIds(desc: IDataDescription, range: Range) : Promise<Range>;
  cols(desc: IDataDescription, range: Range) : Promise<string[]>;
  ids(desc: IDataDescription, range: Range) : Promise<Range>;
  at(desc: IDataDescription, i, j) : Promise<any>;
  hist?(desc: IDataDescription, range: Range, bins?: number): Promise<IHistogram>;
  data(desc: IDataDescription, range: Range) : Promise<any[][]>;
  heatmapUrl?(desc: IDataDescription, range:Range, options: { format?: string; transpose?: boolean; range?: [number,number]; palette?: string}): string;
}

function adapterOne2Two(loader: IMatrixLoader): IMatrixLoader2 {
  return {
    rowIds: (desc: IDataDescription, range: Range) => loader(desc).then((d) => range.preMultiply(d.rowIds, (<any>desc).size)),
    rows: (desc: IDataDescription, range: Range) => loader(desc).then((d) => range.dim(0).filter(d.rows, (<any>desc).size[0])),
    colIds: (desc: IDataDescription, range: Range) => loader(desc).then((d) => range.preMultiply(d.colIds, (<any>desc).size)),
    cols: (desc: IDataDescription, range: Range) => loader(desc).then((d) => range.dim(1).filter(d.cols, (<any>desc).size[1])),
    ids: (desc: IDataDescription, range:Range) => loader(desc).then((data) => range.preMultiply(data.ids, (<any>desc).size)),
    at: (desc: IDataDescription, i, j) => loader(desc).then((data) => data[i][j]),
    data: (desc: IDataDescription ,range: Range) => loader(desc).then((d) => range.filter(d.data, (<any>desc).size))
  };
}

function maskIt(desc: IDataDescription) {
  return (v) => mask(v, desc);
}

function viaAPI2Loader() {
  var rowIds = null,
    rows = null,
    colIds = null,
    cols = null,
    data = null,
    hist = null;
  var r = {
    rowIds: (desc:IDataDescription, range:Range) => {
      if (rowIds == null) {
        rowIds = getAPIJSON('/dataset/matrix/'+desc.id+'/rowIds').then((ids) => {
          return parse(ids);
        });
      }
      return rowIds.then((d) => {
        return d.preMultiply(range, (<any>desc).size);
      });
    },
    rows: (desc:IDataDescription, range:Range) => {
      if (rows == null) {
        rows = getAPIJSON('/dataset/matrix/' + desc.id + '/rows');
      }
      return rows.then((d) => range.dim(0).filter(d, (<any>desc).size[0]));
    },
    colIds: (desc:IDataDescription, range:Range) => {
      if (colIds == null) {
        colIds = getAPIJSON('/dataset/matrix/' + desc.id + '/colIds').then((ids) => parse(ids));
      }
      return colIds.then((d) => d.preMultiply(range, (<any>desc).size));
    },
    cols: (desc:IDataDescription, range:Range) => {
      if (cols == null) {
        cols = getAPIJSON('/dataset/matrix/' + desc.id + '/cols');
      }
      return cols.then((d) => range.dim(1).filter(d, (<any>desc).size[1]));
    },
    ids: (desc:IDataDescription, range:Range) => {
      if (range.ndim === 1) {
        return r.rowIds(desc, range);
      }
      range.dim(0); //ensure two dim
      range.dim(1); //ensure two dim
      var split = range.split();
      return Promise.all([r.rowIds(desc, split[0] || all()), r.colIds(desc, split[1] || all())]).then((idsA: Range[]) => {
        return join(idsA);
      });
    },
    hist: (desc:IDataDescription, range: Range, bins: number = NaN) => {
      if (range.isAll && isNaN(bins)) {
        if (hist == null) {
          hist = getAPIJSON('/dataset/matrix/' + desc.id + '/hist').then((hist:number[]) => wrapHist(hist, (<any>desc).value.range));
        }
        return hist;
      }
      const args : any= {
        range: range.toString()
      };
      if (!isNaN(bins)) {
        args.bins = bins;
      }
      return getAPIJSON('/dataset/matrix/'+desc.id+'/hist', args).then((hist: number[]) => {
        return wrapHist(hist, (<any>desc).value.range);
      });
    },
    at: (desc:IDataDescription, i, j) => r.data(desc, rlist([i],[j])).then((data) => mask(data[0][0], desc)),
    data: (desc:IDataDescription, range:Range) => {
      if (range.isAll) {
        if (data == null) {
          data = getAPIJSON('/dataset/matrix/' + desc.id + '/raw').then(maskIt(desc));
        }
        return data;
      }
      if (data != null) { //already loading all
        return data.then((d) => range.filter(d, (<any>desc).size));
      }
      const size = (<any>desc).size;
      if (size[0] * size[1] < 1000 || (<any>desc).loadAtOnce ) { //small file load all
        data = getAPIJSON('/dataset/matrix/' + desc.id + '/raw').then(maskIt(desc));
        return data.then((d) => range.filter(d, (<any>desc).size));
      }
      //server side slicing
      return getAPIData('/dataset/matrix/'+desc.id+'/raw', {
        range: range.toString()
      }).then(maskIt(desc));
    },
    heatmapUrl: (desc:IDataDescription, range:Range, options: { format?: string; transpose?: boolean; range?: [number,number]; palette?: string}) => {
      var args : any = {
        format: options.format || 'png',
        range: range.toString()
      };
      if (options.transpose === true) {
        args.format_transpose = true;
      }
      if (options.range) {
        args.format_min = options.range[0];
        args.format_max = options.range[1];
      }
      if (options.palette) {
        args.format_palette = options.palette;
      }
      return api2absURL(`/dataset/matrix/${desc.id}/data`, args);
    }
  };
  return r;
}

/**
 * root matrix implementation holding the data
 */
export class Matrix extends MatrixBase implements IMatrix {
  t:IMatrix;
  valuetype:any;
  rowtype:IDType;
  coltype:IDType;
  private producttype_: ProductIDType;

  constructor(public desc: IDataDescription, private loader: IMatrixLoader2) {
    super(null);
    this._root = this;
    var d = <any>desc;
    this.valuetype = d.value;
    this.rowtype = resolveIDType(d.rowtype);
    this.coltype = resolveIDType(d.coltype);
    this.producttype_ = resolveProduct(this.rowtype, this.coltype);
    this.t = new TransposedMatrix(this);
  }

  get producttype() {
    return this.producttype_;
  }

  get idtypes() {
    return [this.rowtype, this.coltype];
  }

  /**
   * access at a specific position
   * @param i
   * @param j
   * @returns {*}
   */
  at(i, j) {
    return this.loader.at(this.desc, i, j);
  }

  data(range: Range = all()) {
    return this.loader.data(this.desc, range);
  }
  ids(range:Range = all()) {
    return this.loader.ids(this.desc, range);
  }


  /**
   * return the column ids of the matrix
   * @returns {*}
   */
  cols(range: Range= all()) : Promise<string[]> {
    return this.loader.cols(this.desc, range);
  }
  colIds(range:Range = all()) {
    return this.loader.colIds(this.desc, range);
  }

  /**
   * return the row ids of the matrix
   * @returns {*}
   */
  rows(range: Range = all()) : Promise<string[]> {
    return this.loader.rows(this.desc, range);
  }
  rowIds(range:Range = all()) {
    return this.loader.rowIds(this.desc, range);
  }

  hist(bins? : number, range:Range = all(), containedIds = 0) : Promise<IHistogram> {
    if (this.loader.hist) {
      return this.loader.hist(this.desc, range, bins);
    }
    return super.hist(bins, range, containedIds);
  }

  size() {
    return (<any>this.desc).size;
  }

  persist() {
    return this.desc.id;
  }

  heatmapUrl(range = all(), options : any = {}) {
    if (this.loader.heatmapUrl) {
      return this.loader.heatmapUrl(this.desc, range, options);
    }
    return null;
  }
}

/**
 * view on the underlying matrix as transposed version
 * @param base
 * @constructor
 */
class TransposedMatrix extends MatrixBase  implements IMatrix {
  t:IMatrix;

  constructor(base:Matrix) {
    super(base);
    this.t = base;
  }

  get desc() {
    return this._root.desc;
  }

  persist() {
    return {
      root: this._root.persist(),
      transposed: true
    };
  }

  get valuetype() {
    return this._root.valuetype;
  }

  get rowtype() {
    return this._root.coltype;
  }

  get coltype() {
    return this._root.rowtype;
  }

  get producttype() {
    return this._root.producttype;
  }

  get idtypes() {
    return [this.rowtype, this.coltype];
  }

  ids(range:Range = all()) {
    return this.t.ids(range ? range.swap() : undefined).then((ids) => ids.swap());
  }

  cols(range:Range = all()): Promise<string[]> {
    return this.t.rows(range ? range.swap() : undefined);
  }
  colIds(range:Range = all()) {
    return this.t.rowIds(range ? range.swap() : undefined);
  }

  rows(range:Range = all()): Promise<string[]> {
    return this.t.cols(range ? range.swap() : undefined);
  }
  rowIds(range:Range = all()) {
    return this.t.colIds(range ? range.swap() : undefined);
  }

  view(range:Range = all()) : IMatrix {
    if (range.isAll) {
      return this;
    }
    return new MatrixView(this._root, range.swap()).t;
  }
  slice(col: number): IVector {
    return new SliceRowVector(this._root, col);
  }

  size() {
    var s = this.t.dim;
    return [s[1], s[0]]; //swap dimension
  }

  at(i:number, j:number) {
    return this.t.at(j, i);
  }

  data(range:Range = all()) {
    return this.t.data(range ? range.swap() : undefined).then((data : any[][]) => transpose(data));
  }

  hist(bins? : number, range: Range = all(), containedIds = 0) : Promise<IHistogram> {
    return this.t.hist(bins, range ? range.swap() : undefined, 1-containedIds);
  }

  heatmapUrl(range = all(), options : any = {}) {
    options.transpose = options.transpose !== true;
    return this.t.heatmapUrl(range ? range.swap() : undefined, options);
  }
}

/**
 * view on the matrix restricted by a range
 * @param root underlying matrix
 * @param range range selection
 * @param t optional its transposed version
 * @constructor
 */
class MatrixView extends MatrixBase implements IMatrix {
  constructor(root: IMatrix, private range: Range, public t: IMatrix = null) {
    super(root);
    this.range = range;
    //ensure that there are two dimensions
    range.dim(0);
    range.dim(1);
    if (!t) {
      this.t = new MatrixView(root.t, range.swap(), this);
    }
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

  ids(range: Range = all()) {
    return this._root.ids(this.range.preMultiply(range, this._root.dim));
  }

  cols(range: Range = all()) {
    return this._root.cols(this.range.preMultiply(range, this._root.dim));
  }
  colIds(range: Range = all()) {
    return this._root.colIds(this.range.preMultiply(range, this._root.dim));
  }

  rows(range: Range = all()) {
    return this._root.rows(this.range.preMultiply(range, this._root.dim));
  }
  rowIds(range: Range = all()) {
    return this._root.rowIds(this.range.preMultiply(range, this._root.dim));
  }

  size() {
    return this.range.size(this._root.dim);
  }

  at(i: number, j : number) {
    var inverted = this.range.invert([i, j], this._root.dim);
    return this._root.at(inverted[0], inverted[1]);
  }

  data(range: Range = all()) {
    return this._root.data(this.range.preMultiply(range, this._root.dim));
  }

  hist(bins? : number, range: Range = all(), containedIds = 0) : Promise<IHistogram> {
    return this._root.hist(bins, this.range.preMultiply(range, this._root.dim), containedIds);
  }

  heatmapUrl(range = all(), options : any = {}) {
    return this._root.heatmapUrl(this.range.preMultiply(range, this._root.dim), options);
  }

  view(range: Range = all()) {
    if (range.isAll) {
      return this;
    }
    return new MatrixView(this._root, this.range.preMultiply(range, this.dim));
  }

  get valuetype() {
    return this._root.valuetype;
  }

  get rowtype() {
    return this._root.rowtype;
  }

  get coltype() {
    return this._root.coltype;
  }

  get producttype() {
    return this._root.producttype;
  }

  get idtypes() {
    return this._root.idtypes;
  }
}


/**
 * a simple projection of a matrix columns to a vector
 */
class SliceColVector extends VectorBase implements IVector {
  desc : IDataDescription;
  private colRange: Range1D;
  constructor(private m : IMatrix, private col: number) {
    super(null);
    this.colRange = Range1D.from([this.col]);
    this.desc = {
      name : m.desc.name+'-c'+col,
      fqname : m.desc.fqname+'-c'+col,
      id : m.desc.id+'-c'+col,
      type : 'vector',
      size: this.dim,
      value: this.valuetype
    };
    this._root = this;
  }

  persist() {
    return {
      root: this.m.persist(),
      col: this.col
    };
  }

  restore(persisted: any) {
    var r : IVector = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  get valuetype() {
    return this.m.valuetype;
  }

  get idtype() {
    return this.m.rowtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return this.m.nrow;
  }
  /**
   * return the associated ids of this vector
   */
  names(range?:Range) : Promise<string[]> {
    return this.m.rows(range);
  }
  ids(range?:Range) {
    return this.m.rowIds(range);
  }

  /**
   * returns a promise for getting one cell
   * @param i
   */
  at(i:number) : Promise<any> {
    return this.m.at(i, this.col);
  }
  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  data(range:Range = all()) : Promise<any[]> {
    const r = rlist(range.dim(0),this.colRange);
    return this.m.data(r).then((d)=> {
      if (d.length > 0 && Array.isArray(d[0])) {
        return d.map((di) => di[0]);
      }
      return d;
    });
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
}


/**
 * a simple projection of a matrix columns to a vector
 */
class SliceRowVector extends VectorBase implements IVector {
  desc : IDataDescription;
  private rowRange: Range1D;
  constructor(private m : IMatrix, private row: number) {
    super(null);
    this.rowRange = Range1D.from([this.row]);
    this.desc = {
      name : m.desc.name+'-r'+row,
      fqname : m.desc.fqname+'-r'+row,
      id : m.desc.id+'-r'+row,
      type : 'vector',
      size: this.dim,
      value: this.valuetype
    };
    this._root = this;
  }

  persist() {
    return {
      root: this.m.persist(),
      row: this.row
    };
  }

  restore(persisted: any) {
    var r : IVector = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  get valuetype() {
    return this.m.valuetype;
  }

  get idtype() {
    return this.m.coltype;
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return this.m.ncol;
  }
  /**
   * return the associated ids of this vector
   */
  names(range?:Range) : Promise<string[]> {
    return this.m.cols(range);
  }
  ids(range?:Range) {
    return this.m.colIds(range);
  }

  /**
   * returns a promise for getting one cell
   * @param i
   */
  at(i:number) : Promise<any> {
    return this.m.at(this.row, i);
  }
  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  data(range:Range = all()) : Promise<any[]> {
    const r = rlist(this.rowRange,range.dim(0));
    return this.m.data(r).then((d)=> {
      return d[0];
    });
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
}

/**
 * a simple projection of a matrix columns to a vector
 */
class ProjectedVector extends VectorBase implements IVector {
  desc : IDataDescription;

  constructor(private m : IMatrix, private f : (row : any[]) => any, private this_f = m, public valuetype = m.valuetype, private _idtype = m.rowtype) {
    super(null);
    this.desc = {
      name : m.desc.name+'-p',
      fqname : m.desc.fqname+'-p',
      type : 'vector',
      id : m.desc.id+'-p',
      size: this.dim,
      value: this.valuetype
    };
    this._root = this;
  }

  persist() {
    return {
      root: this.m.persist(),
      f: this.f.toString(),
      valuetype: this.valuetype === this.m.valuetype ? undefined : this.valuetype,
      idtype: this.idtype === this.m.rowtype ? undefined: this.idtype.name
    };
  }

  restore(persisted: any) {
    var r : IVector = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  get idtype() {
    return this._idtype;
  }

  get idtypes() {
    return [this._idtype];
  }

  size() {
    return this.m.nrow;
  }
  /**
   * return the associated ids of this vector
   */
  names(range?:Range) : Promise<string[]> {
    return this.m.rows(range);
  }
  ids(range?:Range) {
    return this.m.rowIds(range);
  }

  /**
   * returns a promise for getting one cell
   * @param i
   * @param j
   */
  at(i:number) : Promise<any> {
    return this.m.data(rlist(i)).then((d)=> {
      return this.f.call(this.this_f, d[0]);
    });
  }
  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  data(range?:Range) : Promise<any[]> {
    return this.m.data(range).then((d)=> {
      return d.map(this.f, this.this_f);
    });
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
}

/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {IMatrix}
 */
export function create(desc: IDataDescription, loader?: IMatrixLoader2): IMatrix {
  if (isFunction((<any>desc).loader)) {
    return new Matrix(desc, adapterOne2Two((<any>desc).loader));
  }
  return new Matrix(desc, loader ? loader: viaAPI2Loader());
}
