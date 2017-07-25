/**
 * Created by sam on 26.12.2016.
 */

export {
  IMatrix,
  IDTYPE_CELL,
  IDTYPE_COLUMN,
  IDTYPE_ROW,
  IHeatMapUrlOptions,
  IMatrixDataDescription,
  INumericalMatrix,
  IAnyMatrix,
  ICategoricalMatrix
} from './IMatrix';

export {asMatrix, IAsMatrixOptions} from './Matrix';
export {asNameVector as asColumnNameVector} from './internal/MatrixColumnNameVector';
export {asNameVector as asRowNameVector} from './internal/MatrixRowNameVector';
