/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {all, RangeLike} from '../../range';
import CompositeRange1D from '../../range/CompositeRange1D';
import Range from '../../range/Range';
import {IDataType, ADataType, IValueTypeDesc,} from '../../datatype';
import {IHistogram, rangeHist} from '../../math';
import {IVector} from '../IVector';
import {IStratification, IStratificationDataDescription} from '../../stratification';
import StratificationGroup from '../../stratification/StratificationGroup';

/**
 * root matrix implementation holding the data
 * @internal
 */
export default class StratificationVector extends ADataType<IStratificationDataDescription> implements IStratification {

  constructor(private v: IVector<any, IValueTypeDesc>, private r: CompositeRange1D) {
    super({
      id: v.desc.id + '-s',
      name: v.desc.name,
      description: v.desc.description,
      creator: v.desc.creator,
      ts: v.desc.ts,
      fqname: v.desc.fqname,
      type: 'stratification',
      idtype: v.idtype.id,
      size: v.length,
      ngroups: r.groups.length,
      groups: r.groups.map((ri) => ({name: ri.name, color: ri.color, size: ri.length}))
    });
  }

  get idtype() {
    return this.v.idtype;
  }

  get groups() {
    return this.desc.groups;
  }

  group(group: number): IStratification {
    return new StratificationGroup(this, group, this.groups[group]);
  }

  async hist(bins?: number, range: RangeLike = all()): Promise<IHistogram> {
    // FIXME unused parameter
    return rangeHist(await this.range());
  }

  vector() {
    return this.asVector();
  }

  asVector() {
    return Promise.resolve(this.v);
  }

  origin(): Promise<IDataType> {
    return this.asVector();
  }

  range() {
    return Promise.resolve(this.r);
  }

  async idRange() {
    const ids = await this.ids();
    return ids.dim(0).preMultiply(this.r, this.dim[0]);
  }

  names(range: RangeLike = all()) {
    return this.v.names(range);
  }

  ids(range: RangeLike = all()): Promise<Range> {
    return this.v.ids(range);
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return this.desc.size;
  }

  get length() {
    return this.size();
  }

  get ngroups() {
    return this.groups.length;
  }

  get dim() {
    return [this.size()];
  }

  persist() {
    return {
      root: this.v.persist(),
      asstrat: true
    };
  }
}
