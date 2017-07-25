/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {IPersistable} from '../index';
import {Range, all, parse, RangeLike, list as rlist} from '../range';
import {SelectAble, resolve as idtypes_resolve, IDType} from '../idtype';
import {IVector} from '../vector';
import {ITable, IQueryArgs} from './ITable';
import MultiTableVector from './internal/MultiTableVector';
import {IValueType, IValueTypeDesc} from '../datatype';
import {IInternalAccess} from './internal';

/**
 * base class for different Table implementations, views, transposed,...
 * @internal
 */
export abstract class ATable extends SelectAble implements IInternalAccess {
  constructor(protected root: ITable & IInternalAccess) {
    super();
  }

  get dim() {
    return this.size();
  }

  get nrow() {
    return this.dim[0];
  }

  get ncol() {
    return this.dim[1];
  }

  abstract size(): number[];

  view(range: RangeLike = all()): ITable {
    return new TableView(this.root, parse(range));
  }

  abstract dataOfColumn<T>(column: string, range?: RangeLike): Promise<T[]>;

  abstract queryView(name: string, args: IQueryArgs): ITable;

  async idView(idRange: RangeLike = all()): Promise<ITable> {
    return this.view((await this.ids()).indexOf(parse(idRange)));
  }

  reduce<T, D extends IValueTypeDesc>(f: (row: IValueType[]) => T, thisArgument?: any, valuetype?: D, idtype?: IDType): IVector<T,D> {
    return new MultiTableVector(this.root, f, thisArgument, valuetype, idtype);
  }

  restore(persisted: any): IPersistable {
    if (persisted && persisted.f) {
      /* tslint:disable:no-eval */
      return this.reduce(eval(persisted.f), this, persisted.valuetype, persisted.idtype ? idtypes_resolve(persisted.idtype) : undefined);
      /* tslint:enable:no-eval */
    } else if (persisted && persisted.range) { //some view onto it
      return this.view(parse(persisted.range));
    } else {
      return <IPersistable>(<any>this);
    }
  }
}

export default ATable;

// circular dependency thus not extractable

/**
 * @internal
 */
export class TableView extends ATable implements ITable {
  private vectors: IVector<any, IValueTypeDesc>[];

  constructor(root: ITable & IInternalAccess, private range: Range) {
    super(root);
    this.range = range;
    this.vectors = this.root.cols(rlist(range.dim(1))).map((v) => v.view(rlist(range.dim(0))));
  }

  get desc() {
    return this.root.desc;
  }

  persist() {
    return {
      root: this.root.persist(),
      range: this.range.toString()
    };
  }

  restore(persisted: any) {
    let r: ITable = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  size() {
    return this.range.size(this.root.dim);
  }

  at(row: number, col: number) {
    const inverted = this.range.invert([row, col], this.root.dim);
    return this.root.at(inverted[0], inverted[1]);
  }

  col(i: number) {
    return this.vectors[i];
  }

  cols(range: RangeLike = all()) {
    return parse(range).filter(this.vectors, [this.ncol]);
  }

  data(range: RangeLike = all()) {
    return this.root.data(this.range.preMultiply(parse(range), this.root.dim));
  }

  colData<T>(column: string, range: RangeLike = all()) {
    return this.dataOfColumn(column, range);
  }

  dataOfColumn<T>(column: string, range: RangeLike = all()) {
    // since we directly accessing the column by name there is no need for the column part of the range
    const rowRange = this.range.dim(0).preMultiply(parse(range).dim(0), this.root.dim[0]);
    return this.root.dataOfColumn<T>(column, new Range([rowRange]));
  }

  objects(range: RangeLike = all()) {
    return this.root.objects(this.range.preMultiply(parse(range), this.root.dim));
  }

  rows(range: RangeLike = all()) {
    return this.root.rows(this.range.preMultiply(parse(range), this.root.dim));
  }

  rowIds(range: RangeLike = all()) {
    return this.root.rowIds(this.range.preMultiply(parse(range), this.root.dim));
  }

  ids(range: RangeLike = all()) {
    return this.rowIds(range);
  }

  view(range: RangeLike = all()) {
    const r = parse(range);
    if (r.isAll) {
      return this;
    }
    return new TableView(this.root, this.range.preMultiply(r, this.dim));
  }

  get idtype() {
    return this.root.idtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  queryView(name: string, args: any): ITable {
    throw new Error('not implemented');
  }
}

