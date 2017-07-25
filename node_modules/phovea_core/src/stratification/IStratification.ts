/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {mixin} from '../index';
import {Range, RangeLike, CompositeRange1D} from '../range';
import {IDataType, IDataDescription, createDefaultDataDesc} from '../datatype';
import {IDType} from '../idtype';
import {IHistogram} from '../math';
import {ICategoricalVector} from '../vector/IVector';

export interface IGroup {
  readonly name: string;
  readonly color: string;
  readonly size: number;
}

export function guessColor(stratification: string, group: string) {
  switch (group.toLowerCase()) {
    case 'male':
      return 'blue';
    case 'female':
      return 'red';
    case 'deceased':
      return '#e41a1b';
    case 'living':
      return '#377eb8';
  }
  return 'gray';
}

export interface IStratificationDataDescription extends IDataDescription {
  readonly idtype: string;
  readonly size: number;
  readonly groups: IGroup[];
  readonly ngroups: number;
  /**
   * fqname of the origin dataset, e.g. vector, table
   */
  readonly origin?: string;
}

export interface IStratification extends IDataType {
  readonly desc: IStratificationDataDescription;
  range(): Promise<CompositeRange1D>;
  idRange(): Promise<CompositeRange1D>;
  /**
   * @deprecated use asVector instead
   */
  vector(): Promise<ICategoricalVector>;
  asVector(): Promise<ICategoricalVector>;

  names(): Promise<string[]>;
  names(range: RangeLike): Promise<string[]>;

  ids(): Promise<Range>;
  ids(range: RangeLike): Promise<Range>;

  hist(bins?: number, range?: RangeLike): Promise<IHistogram>;

  readonly length: number;
  readonly ngroups: number;

  readonly groups: IGroup[];

  readonly idtype: IDType;

  group(group: number): IStratification;

  origin(): Promise<IDataType>;
}
export default IStratification;


export function createDefaultStratificationDesc(): IStratificationDataDescription {
  return <IStratificationDataDescription>mixin(createDefaultDataDesc(), {
    type: 'stratification',
    idtype: '_rows',
    size: 0,
    groups: [],
    ngroups: 0
  });
}
