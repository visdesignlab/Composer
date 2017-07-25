/**
 * Created by Samuel Gratzl on 14.02.2017.
 */

import {mixin} from '../index';
import {Range} from '../range';
import {IDType, IDTypeLike} from '../idtype';
import {
  IDataType, IValueTypeDesc, IDataDescription, createDefaultDataDesc,
  INumberValueTypeDesc, ICategoricalValueTypeDesc, IStringValueTypeDesc
} from '../datatype';

export interface IAtomValue<T> {
  name: string;
  id: number;
  value: T;
}

export interface IAtomDataDescription<D extends IValueTypeDesc> extends IDataDescription {
  readonly value: D;
  readonly idtype: IDTypeLike;
}

export interface IInlinedAtomDataDescription<T, D extends IValueTypeDesc> extends IAtomDataDescription<D> {
  readonly data: IAtomValue<T>;
}

export interface IAtom<T, D extends IValueTypeDesc> extends IDataType {
  readonly desc: IAtomDataDescription<D>;
  /**
   * id type
   */
  readonly idtype: IDType;
  readonly valuetype: D;

  name(): Promise<string>;

  id(): Promise<Range>;

  data(): Promise<T>;
}

export default IAtom;


export declare type INumericalAtom = IAtom<number, INumberValueTypeDesc>;
export declare type ICategoricalAtom = IAtom<string, ICategoricalValueTypeDesc>;
export declare type IStringAtom = IAtom<string, IStringValueTypeDesc>;
export declare type IAnyAtom = IAtom<any, IValueTypeDesc>;

export function createDefaultAtomDesc(): IAtomDataDescription<IValueTypeDesc> {
  return <IAtomDataDescription<IValueTypeDesc>>mixin(createDefaultDataDesc(), {
    type: 'atom',
    idtype: '_rows',
    value: {
      type: 'string'
    }
  });
}
