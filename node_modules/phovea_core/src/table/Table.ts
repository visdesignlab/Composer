/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {IPersistable, mixin} from '../index';
import {Range, all, list as rlist, parse, RangeLike} from '../range';
import {resolve as idtypes_resolve, createLocalAssigner} from '../idtype';
import {IValueType, VALUE_TYPE_INT, VALUE_TYPE_REAL, guessValueTypeDesc, IValueTypeDesc} from '../datatype';
import {ITable, ITableColumn, ITableDataDescription, createDefaultTableDesc} from './ITable';
import ATable from './ATable';
import TableVector from './internal/TableVector';
import {ITableLoader, ITableLoader2, adapterOne2Two, viaAPI2Loader, viaDataLoader} from './loader';
import {IInternalAccess} from './internal';

/**
 * root matrix implementation holding the data
 * @internal
 */
export default class Table extends ATable implements ITable {
  private vectors: TableVector<any, IValueTypeDesc>[];

  constructor(public readonly desc: ITableDataDescription, private loader: ITableLoader2) {
    super(null);
    // set default column
    desc.columns.forEach((col) => col.column = col.column || col.name);
    this.root = this;
    this.vectors = desc.columns.map((cdesc, i) => new TableVector(this, i, cdesc));
  }

  get idtype() {
    return idtypes_resolve(this.desc.idtype || (<any>this.desc).rowtype);
  }

  get idtypes() {
    return [this.idtype];
  }

  col(i: number) {
    return this.vectors[i];
  }

  cols(range: RangeLike = all()) {
    return parse(range).filter(this.vectors, [this.ncol]);
  }

  async at(row: number, col: number) {
    return (await this.colData(this.col(col).column, rlist(row)))[0];
  }

  queryView(name: string, args: any) {
    return new Table(this.desc, adapterOne2Two(this.loader.view(this.desc, name, args)));
  }

  data(range: RangeLike = all()) {
    return this.loader.data(this.desc, parse(range));
  }

  colData(column: string, range: RangeLike = all()) {
    return this.dataOfColumn(column, range);
  }

  dataOfColumn(column: string, range: RangeLike = all()) {
    return this.loader.col(this.desc, column, parse(range));
  }

  objects(range: RangeLike = all()) {
    return this.loader.objs(this.desc, parse(range));
  }

  rows(range: RangeLike = all()): Promise<string[]> {
    return this.loader.rows(this.desc, parse(range));
  }

  rowIds(range: RangeLike = all()) {
    return this.loader.rowIds(this.desc, parse(range));
  }

  ids(range: RangeLike = all()) {
    return this.rowIds(range);
  }

  size() {
    return this.desc.size;
  }

  persist() {
    return this.desc.id;
  }

  restore(persisted: any): IPersistable {
    if (persisted && typeof persisted.col === 'number') {
      return this.col(persisted.col);
    }
    return super.restore(persisted);
  }
}


/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {ITable}
 */
export function create(desc: ITableDataDescription, loader?: ITableLoader): ITable {
  if (loader) {
    return new Table(desc, adapterOne2Two(loader));
  }
  return new Table(desc, viaAPI2Loader());
}

export function wrapObjects(desc: ITableDataDescription, data: any[], nameProperty: string|((obj: any) => string)) {
  return new Table(desc, adapterOne2Two(viaDataLoader(data, nameProperty)));
}

function toObjects(data: any[][], cols: string[]) {
  return data.map((row) => {
    const r: any = {};
    cols.forEach((col, i) => r[col] = row[i]);
    return r;
  });
}
function toList(objs: any[], cols: string[]) {
  return objs.map((obj) => cols.map((c) => obj[c]));
}

/**
 * Interface for the parsing options for a table
 */
export interface IAsTableOptions {
  name?: string;
  idtype?: string;
  rowassigner?(ids: string[]): Range;
  keyProperty?: string;
}


function asTableImpl(columns: ITableColumn<any>[], rows: string[], objs: any[], data: IValueType[][], options: IAsTableOptions = {}) {
  const desc = mixin(createDefaultTableDesc(), {
    columns,
    size: [rows.length, columns.length]
  }, options);

  const rowAssigner = options.rowassigner || createLocalAssigner();
  const loader: ITableLoader = () => {
    const r = {
      rowIds: rowAssigner(rows),
      rows,
      objs,
      data
    };
    return Promise.resolve(r);
  };
  return new Table(desc, adapterOne2Two(loader));
}

export function asTableFromArray(data: any[][], options: IAsTableOptions = {}): ITable {
  const rows = data.map((r) => r[0]);
  const cols = data[0].slice(1);
  const tableData = data.slice(1).map((r) => r.slice(1));

  const columns = cols.map((col, i) => {
    return {
      name: col,
      column: col,
      value: guessValueTypeDesc(tableData.map((row) => row[i]))
    };
  });

  const realData = tableData.map((row) => columns.map((col, i) => (col.value.type === VALUE_TYPE_REAL || col.value.type === VALUE_TYPE_INT) ? parseFloat(row[i]) : row[i]));
  const objs = toObjects(realData, cols);

  return asTableImpl(columns, rows, objs, realData, options);
}

/**
 * Creates a new table from an array of arrays of data and an optional options data structure.
 * TODO: explain the relationship of this function and the "magic" JSON file.
 * @param data
 * @param options TODO - explain what these options are
 * @returns {Table}
 */
export function asTable(data: any[], options: IAsTableOptions = {}): ITable {
  const keyProperty = options.keyProperty || '_id';

  const rows = data.map((r, i) => String(r[keyProperty] || i));
  const cols = Object.keys(data[0]);
  const objs = data;
  const realData = toList(objs, cols);

  const columns = cols.map((col, i) => {
    return {
      name: col,
      column: col,
      value: guessValueTypeDesc(realData.map((row) => row[i]))
    };
  });
  return asTableImpl(columns, rows, objs, realData, options);
}
