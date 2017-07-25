/**
 * Created by Samuel Gratzl on 14.02.2017.
 */

import {mixin} from '../';
import {IValueTypeDesc, guessValueTypeDesc} from '../datatype';
import IAtom, {IAtomDataDescription, IAtomValue, IInlinedAtomDataDescription, createDefaultAtomDesc} from './IAtom';
import {createLocalAssigner} from '../idtype';
import AAtom from './AAtom';
import {list as rlist, Range} from '../range';

export class Atom<T,D extends IValueTypeDesc> extends AAtom<T,D> implements IAtom<T,D> {

  constructor(desc: IAtomDataDescription<D>, private readonly loaded: IAtomValue<T>) {
    super(desc);
  }

  id() {
    return Promise.resolve(rlist(this.loaded.id));
  }

  name() {
    return Promise.resolve(this.loaded.name);
  }

  data() {
    return Promise.resolve(this.loaded.value);
  }
}

const noValue: IAtomValue<any> = {
  id: -1,
  name: '',
  value: null
};

export function create<T, D extends IValueTypeDesc>(desc: IAtomDataDescription<D>|IInlinedAtomDataDescription<T,D>): IAtom<T,D> {
  if (typeof((<any>desc).data) !== undefined) {
    return new Atom(desc, <IAtomValue<T>>(<any>desc).data);
  }
  return new Atom(desc, noValue);
}

export interface IAsAtomOptions {
  name?: string;
  idtype?: string;
  rowassigner?(ids: string[]): Range;
}

export function asAtom<T>(name: string, value: T, options: IAsAtomOptions = {}) {
  const desc = mixin(createDefaultAtomDesc(), {
    value: guessValueTypeDesc([value])
  }, options);

  const rowAssigner = options.rowassigner || createLocalAssigner();
  const atom = {
    name,
    value,
    id: rowAssigner([name]).first
  };
  return new Atom(desc, atom);
}
