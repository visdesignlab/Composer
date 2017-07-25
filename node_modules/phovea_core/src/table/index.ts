/**
 * Created by sam on 26.12.2016.
 */

import {IAnyVector} from '../vector';
import VectorTable from './internal/VectorTable';
import {IDataDescription} from '../datatype';


export {ITable, IQueryArgs, ITableColumn, ITableDataDescription} from './ITable';
export {asTable, asTableFromArray, IAsTableOptions} from './Table';
export {asNameVector} from './internal/TableNameVector';

export function fromVectors(desc: IDataDescription, vecs: IAnyVector[]) {
  return new VectorTable(desc, vecs);
}
