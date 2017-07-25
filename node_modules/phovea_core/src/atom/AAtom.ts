/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {all, list as rlist, Range, RangeLike, none, parse} from '../range';
import {SelectAble, resolve} from '../idtype';
import {IValueTypeDesc} from '../datatype';
import IAtom, {IAtomDataDescription} from './IAtom';

/**
 * base class for different Atom implementations
 * @internal
 */
export abstract class AAtom<T,D extends IValueTypeDesc> extends SelectAble {

  constructor(public readonly desc: IAtomDataDescription<D>) {
    super();
  }

  get dim() {
    return [1];
  }

  get valuetype() {
    return this.desc.value;
  }

  get idtype() {
    return resolve(this.desc.idtype);
  }

  get idtypes() {
    return [this.idtype];
  }

  ids(range = all()): Promise<Range> {
    range = parse(range);
    if (range.isNone) {
      return Promise.resolve(none());
    }
    return this.id();
  }

  idView(idRange?: RangeLike): Promise<IAtom<T,D>> {
    return Promise.resolve(<IAtom<T,D>><any>this);
  }

  abstract id(): Promise<Range>;

  persist() {
    return this.desc.id;
  }

  restore(persisted: any) {
    return this;
  }
}

export default AAtom;
