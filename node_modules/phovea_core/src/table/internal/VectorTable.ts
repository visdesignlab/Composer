/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {IPersistable} from '../../index';
import {all, parse, RangeLike} from '../../range';
import IDType from '../../idtype/IDType';
import {IDataDescription} from '../../datatype';
import {ITable, ITableDataDescription, IQueryArgs} from '../ITable';
import ATable from '../ATable';
import {IAnyVector} from '../../vector/IVector';

/**
 * @internal
 */
export default class VectorTable extends ATable implements ITable {
  readonly idtype: IDType;
  readonly desc: ITableDataDescription;

  constructor(desc: IDataDescription, private vectors: IAnyVector[]) {
    super(null);
    this.root = this;
    const ref = vectors[0].desc;
    // generate the description extras
    const d = <any>desc;
    d.idtype = ref.idtype;
    d.size = [vectors[0].length, vectors.length];
    d.columns = vectors.map((v) => {
      v.desc.column = v.desc.column || v.desc.name;
      return v.desc;
    });
    this.desc = d;
    this.idtype = vectors[0].idtype;
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

  at(i: number, j: number) {
    return this.col(i).at(j);
  }

  data(range: RangeLike = all()) {
    return Promise.all(this.vectors.map((v) => v.data(range))).then((arr: any[][]) => {
      const r = arr[0].map((i) => ([i]));
      arr.slice(1).forEach((ai) => ai.forEach((d, i) => r[i].push(d)));
      return r;
    });
  }

  colData(column: string, range: RangeLike = all()) {
    return this.dataOfColumn(column, range);
  }

  dataOfColumn(column: string, range: RangeLike = all()) {
    return this.vectors.find((d) => d.desc.name === column).data(range);
  }



  objects(range: RangeLike = all()) {
    return Promise.all(this.vectors.map((v) => v.data(range))).then((arr: any[][]) => {
      const names = this.vectors.map((d) => d.desc.name);
      const r = arr[0].map((i) => ( {[ names[0]]: i}));
      arr.slice(1).forEach((ai, j) => {
        const name = names[j + 1];
        ai.forEach((d, i) => r[i][name] = d);
      });
      return r;
    });
  }

  /**
   * return the row ids of the matrix
   * @returns {*}
   */
  rows(range: RangeLike = all()): Promise<string[]> {
    return this.col(0).names(range);
  }

  rowIds(range: RangeLike = all()) {
    return this.col(0).ids(range);
  }

  ids(range: RangeLike = all()) {
    return this.rowIds(range);
  }

  size() {
    return [this.col(0).length, this.vectors.length];
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

  queryView(name: string, args: IQueryArgs): ITable {
    throw Error('not implemented');
  }
}
