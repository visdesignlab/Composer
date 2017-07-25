/**
 * Created by sam on 26.12.2016.
 */


import {Range, RangeLike, CompositeRange1D, all, list, Range1DGroup, parse} from '../range';
import {IDataType} from '../datatype';
import {SelectAble} from '../idtype';
import {ICategoricalVector} from '../vector';
import {IHistogram, rangeHist} from '../math';
import {IStratification, IGroup} from './IStratification';

/**
 * root matrix implementation holding the data
 * @internal
 */
export default class StratificationGroup extends SelectAble implements IStratification {
  constructor(private root: IStratification, private groupIndex: number, private groupDesc: IGroup) {
    super();
  }

  get desc() {
    return this.root.desc;
  }

  get groups() {
    return [this.groupDesc];
  }

  get ngroups() {
    return 1;
  }

  group(groupIndex: number): IStratification {
    if (groupIndex === 0) {
      return this;
    }
    return null; //can't sub a single group
  }

  get idtype() {
    return this.root.idtype;
  }

  async hist(bins?: number, range: RangeLike = all()): Promise<IHistogram> {
    //FIXME
    return rangeHist(await this.range());
  }

  vector() {
    return this.asVector();
  }

  asVector(): Promise<ICategoricalVector> {
    return Promise.all<any>([this.root.asVector(), this.rangeGroup()]).then((arr: [ICategoricalVector, Range1DGroup]) => arr[0].view(list(arr[1])));
  }

  origin(): Promise<IDataType> {
    return this.root.origin();
  }

  async range() {
    const g = await this.rangeGroup();
    return new CompositeRange1D(g.name, [g]);
  }

  async idRange() {
    const r = await this.root.idRange();
    const g = r.groups[this.groupIndex];
    return new CompositeRange1D(g.name, [g]);
  }

  async rangeGroup() {
    const r = await this.root.range();
    return r.groups[this.groupIndex];
  }

  async names(range: RangeLike = all()) {
    const g = await this.rangeGroup();
    const r = list(g).preMultiply(parse(range));
    return this.root.names(r);
  }

  async ids(range: RangeLike = all()): Promise<Range> {
    const g = await this.rangeGroup();
    const r = list(g).preMultiply(parse(range));
    return this.root.ids(r);
  }

  idView(idRange: RangeLike = all()): Promise<any> {
    return Promise.reject('not implemented');
  }

  toString() {
    return this.persist();
  }

  get idtypes() {
    return [this.idtype];
  }

  size() {
    return [this.length];
  }

  get length() {
    return this.groupDesc.size;
  }

  get dim() {
    return this.size();
  }

  persist() {
    return {
      root: this.root.persist(),
      group: this.groupIndex
    };
  }

  restore(persisted: any) {
    return this;
  }
}
