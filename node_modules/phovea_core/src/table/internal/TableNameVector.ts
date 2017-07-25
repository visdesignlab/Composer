/**
 * Created by Samuel Gratzl on 16.03.2017.
 */
import {ITable} from '../';
import {RangeLike, all} from '../../range';
import ANameVector, {IStringVector} from '../../vector/internal/ANameVector';

export default class TableNameVector extends ANameVector<ITable> implements IStringVector {

  constructor(table: ITable) {
    super(table);
    this.root = this;
  }

  get idtype() {
    return this.base.idtype;
  }

  names(range: RangeLike = all()) {
    return this.base.rows(range);
  }

  ids(range: RangeLike = all()) {
    return this.base.rowIds(range);
  }

  size() {
    return this.base.nrow;
  }
}


/**
 * converts the rows of the given table as a string vector
 * @param table
 * @return {IStringVector}
 */
export function asNameVector(table: ITable): IStringVector {
  return new TableNameVector(table);
}
