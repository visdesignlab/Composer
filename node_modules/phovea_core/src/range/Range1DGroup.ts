/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import Range1D from './Range1D';

export default class Range1DGroup extends Range1D {
  constructor(public name: string, public color: string, base?: Range1D) {
    super(base);
  }

  preMultiply(sub: Range1D, size?: number): Range1DGroup {
    const r = super.preMultiply(sub, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  union(other: Range1D, size?: number): Range1DGroup {
    const r = super.union(other, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  intersect(other: Range1D, size?: number): Range1DGroup {
    const r = super.intersect(other, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  without(without: Range1D, size?: number): Range1DGroup {
    const r = super.without(without, size);
    return new Range1DGroup(this.name, this.color, r);
  }

  clone(): Range1DGroup {
    return new Range1DGroup(this.name, this.color, super.clone());
  }

  toString() {
    return '"' + this.name + '""' + this.color + '"' + super.toString();
  }

  toSet(size?: number): Range1DGroup {
    return new Range1DGroup(this.name, this.color, super.toSet(size));
  }

  fromLike(indices: number[]) {
    return new Range1DGroup(this.name, this.color, super.fromLike(indices));
  }
}
