/**
 * Created by Samuel Gratzl on 16.03.2017.
 */
import {IStratification} from '../';
import {RangeLike, all} from '../../range';
import ANameVector, {IStringVector} from '../../vector/internal/ANameVector';

export default class StratificationNameVector extends ANameVector<IStratification> implements IStringVector {

  constructor(strat: IStratification) {
    super(strat);
    this.root = this;
  }

  get idtype() {
    return this.base.idtype;
  }

  names(range: RangeLike = all()) {
    return this.base.names(range);
  }

  ids(range: RangeLike = all()) {
    return this.base.ids(range);
  }

  size() {
    return this.base.length;
  }
}


/**
 * converts the rows of the given stratification as a string vector
 * @param stratification
 * @return {IStringVector}
 */
export function asNameVector(stratification: IStratification): IStringVector {
  return new StratificationNameVector(stratification);
}

