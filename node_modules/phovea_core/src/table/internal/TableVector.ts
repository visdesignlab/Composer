/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {argFilter, argSort} from '../../index';
import {all, parse, RangeLike, list as rlist} from '../../range';
import {IValueTypeDesc} from '../../datatype';
import {IVector, IVectorDataDescription} from '../../vector';
import {ITable, ITableColumn} from '../ITable';
import AVector from '../../vector/AVector';

/**
 * root matrix implementation holding the data
 * @internal
 */
export default class TableVector<T,D extends IValueTypeDesc> extends AVector<T,D> implements IVector<T,D> {
  readonly desc: IVectorDataDescription<D>;
  readonly column: string;

  constructor(private table: ITable, private index: number, desc: ITableColumn<D>) {
    super(null);
    this.column = desc.column;
    this.root = this;
    this.desc = {
      type: 'vector',
      id: table.desc.id + '_' + desc.name,
      name: desc.name,
      description: desc.description || '',
      fqname: table.desc.fqname + '/' + desc.name,
      idtype: table.idtype.id,
      size: table.nrow,
      value: desc.value,
      creator: table.desc.creator,
      ts: table.desc.ts
    };
  }

  get valuetype() {
    return this.desc.value;
  }

  get idtype() {
    return this.table.idtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  persist() {
    return {
      root: this.table.persist(),
      col: this.index
    };
  }

  restore(persisted: any) {
    let r: IVector<T,D> = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  /**
   * access at a specific position
   * @param i
   * @returns {*}
   */
  at(i: number) {
    return this.table.at(i, this.index);
  }

  data(range: RangeLike = all()) {
    return this.table.colData(this.column, range);
  }

  names(range: RangeLike = all()) {
    return this.table.rows(range);
  }

  ids(range: RangeLike = all()) {
    return this.table.rowIds(range);
  }

  size() {
    return this.table.nrow;
  }

  async sort(compareFn?: (a: T, b: T) => number, thisArg?: any): Promise<IVector<T,D>> {
    const d = await this.data();
    const indices = argSort(d, compareFn, thisArg);
    return this.view(rlist(indices));
  }

  async filter(callbackfn: (value: T, index: number) => boolean, thisArg?: any): Promise<IVector<T,D>> {
    const d = await this.data();
    const indices = argFilter(d, callbackfn, thisArg);
    return this.view(rlist(indices));
  }
}

