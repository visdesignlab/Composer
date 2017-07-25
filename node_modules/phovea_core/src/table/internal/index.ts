/**
 * Created by Samuel Gratzl on 02.03.2017.
 */

import {RangeLike} from '../../range';

export interface IInternalAccess {
  /**
   * @param column
   * @param range
   */
  dataOfColumn<T>(column: string, range?: RangeLike): Promise<T[]>;
}
