/**
 * Created by Samuel Gratzl on 16.03.2017.
 */
import {IAnyMatrix} from '../';
import {RangeLike, all} from '../../range';
import ANameVector, {IStringVector} from '../../vector/internal/ANameVector';

export default class MatrixColumnNameVector extends ANameVector<IAnyMatrix> implements IStringVector {

  constructor(matrix: IAnyMatrix) {
    super(matrix);
    this.root = this;
  }

  get idtype() {
    return this.base.coltype;
  }

  names(range: RangeLike = all()) {
    return this.base.cols(range);
  }

  ids(range: RangeLike = all()) {
    return this.base.colIds(range);
  }

  size() {
    return this.base.ncol;
  }

  persist() {
    return {
      root: this.base.persist(),
      names: 'column'
    };
  }
}


/**
 * converts the cols of the given matrix as a string vector
 * @param matrix
 * @return {IStringVector}
 */
export function asNameVector(matrix: IAnyMatrix): IStringVector {
  return new MatrixColumnNameVector(matrix);
}
