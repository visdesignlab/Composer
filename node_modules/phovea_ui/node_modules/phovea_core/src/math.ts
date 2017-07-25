/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 29.08.2014.
 */

import {none, list, Range, Range1D, CompositeRange1D} from './range';
import {indexOf} from './index';
/**
 * simple number statistics similar to DoubleStatistics in Caleydo
 * TODO use a standard library for that
 */
export interface IStatistics {
  min: number;
  max: number;
  sum: number;
  mean: number;
  var : number;
  sd: number;
  n: number;
  nans: number;
  moment2: number;
  moment3: number;
  moment4: number;
  kurtosis: number;
  skewness: number;
}


export interface IIterable<T> {
  forEach(callbackfn: (value: T) => void, thisArg?: any): void;
}

export interface IHistogram extends IIterable<number> {
  bins: number;
  largestFrequency : number;
  /**
   * largest frequency without missing
   */
  largestBin: number;
  count: number;
  /**
   * number of valid entries;
   */
  validCount: number;

  frequency(bin: number) : number;
  range(bin: number): Range;

  binOf(value: any) : number;

  missing: number;
  missingRange: Range;

  forEach(callbackfn: (value: number, index: number) => void, thisArg?: any): void;
}

export interface ICatHistogram extends IHistogram {
  categories: string[];
  colors: string[];
}


class Statistics implements IStatistics {
  min: number = NaN;
  max: number = NaN;
  sum: number = 0;
  mean: number = 0;
  private _var : number = 0;
  n: number = 0;
  nans: number = 0;
  moment2: number = NaN;
  moment3: number = NaN;
  moment4: number = NaN;

  get var() {
    return this.n > 1 ? this._var / (this.n - 1) : 0;
  }

  /** Returns the standard deviation */
  get sd() {
    return Math.sqrt(this.var);
  }

  get kurtosis() {
    if (this.n === 0) {
      return 0;
    }
    return (this.n * this.moment4) / (this.moment2 * this.moment2) - 3;
  }

  get skewness() {
    if (this.n === 0) {
      return 0;
    }
    return Math.sqrt(this.n) * this.moment3 / (Math.pow(this.moment2, 3. / 2.));
  }

  push(x: number) {
    x = +x;
    if (isNaN(x)) {
      this.nans++;
      return;
    }

    this.n++;
    this.sum += x;
    if (x < this.min || isNaN(this.min)) {
      this.min = x;
    }
    if (this.max < x || isNaN(this.max)) {
      this.max = x;
    }
    // http://www.johndcook.com/standard_deviation.html
    // See Knuth TAOCP vol 2, 3rd edition, page 232
    // http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Higher-order_statistics

    if (this.n === 1) {
      this.mean = x;
      this._var = 0;
      this.moment2 = this.moment3 = this.moment4 = 0;
    } else {
      const mean_m1 = this.mean;
      this.mean = mean_m1 + (x - mean_m1) / this.n;
      this._var = this._var + (x - mean_m1) * (x - this.mean);

      const delta = x - mean_m1;
      const delta_n = delta / this.n;
      const delta_n2 = delta_n * delta_n;
      const term1 = delta * delta_n * (this.n - 1);
      this.moment4 += term1 * delta_n2 * (this.n * this.n - 3 * this.n + 3) + 6 * delta_n2 * this.moment2 - 4 * delta_n * this.moment3;
      this.moment3 += term1 * delta_n * (this.n - 2) - 3 * delta_n * this.moment2;
      this.moment2 += term1;
    }
  }
}

export function computeStats(...arr: IIterable<number>[]) : IStatistics {
  var r = new Statistics();
  arr.forEach((a) => a.forEach(r.push,r));
  return r;
}

export function hist(arr: IIterable<number>, indices: Range1D, size: number, bins: number, range: number[]) : IHistogram {
  const r = new Histogram(bins, range);
  r.pushAll(arr, indices, size);
  return r;
}

export function categoricalHist<T>(arr: IIterable<T>, indices: Range1D, size: number, categories: T[], labels: string[], colors: string[]) : IHistogram {
  const r = new CatHistogram(categories, labels, colors);
  r.pushAll(arr, indices, size);
  return r;
}

export function rangeHist(range: CompositeRange1D) {
  return new RangeHistogram(range);
}
export function wrapHist(hist: number[], value_range: number[]) {
  return new Histogram(hist.length, value_range, hist);
}

class AHistogram implements IHistogram {
  private bins_ : number[];
  private missing_ : number = 0;
  private ranges_ : Range[];
  private missingRange_  = none();

  constructor(bins: number, hist?: number[]) {
    this.bins_ = [];
    for(var i = 0; i < bins; ++i) {
      this.bins_.push(hist && hist.length > i ? hist[i] : 0);
    }
  }

  get largestFrequency() {
    return Math.max(Math.max.apply(Math,this.bins_), this.missing_);
  }

  get largestBin() {
    return Math.max.apply(Math,this.bins_);
  }

  get count() {
    return this.validCount + this.missing_;
  }

  get validCount() {
    return this.bins_.reduce((p,s) => p+s, 0);
  }

  get bins() {
    return this.bins_.length;
  }

  binOf(value: any) {
    return -1;
  }

  frequency(bin: number) {
    return this.bins_[bin];
  }

  range(bin:number) {
    return this.ranges_ ? this.ranges_[bin] : none();
  }

  get missing() {
    return this.missing_;
  }

  get missingRange() {
    return this.missingRange_;
  }

  pushAll(arr: IIterable<any>, indices: Range1D, size: number) {
    var binindex = [], missingindex = [];
    for(var i = this.bins-1; i>=0; --i) {
      binindex.push([]);
    }
    if (indices) {
      const it = indices.iter(size);
      arr.forEach((x) => {
        const index = it.next();
        const bin = this.binOf(x);
        if (bin < 0) {
          this.missing_++;
          missingindex.push(index);
        } else {
          this.bins_[bin]++;
          binindex[bin].push(index);
        }
      });
      //build range and remove duplicates
      this.ranges_ = binindex.map((d) => list(d.sort().filter((di, i, a) => di !== a[i-1])));
      this.missingRange_ = list(missingindex.sort().filter((di, i, a) => di !== a[i-1]));
    } else {
      arr.forEach((x) => {
        const bin = this.binOf(x);
        if (bin < 0) {
          this.missing_++;
        } else {
          this.bins_[bin]++;
        }
      });
      this.ranges_ = null;
      this.missingRange_ = null;
    }
  }

  forEach(callbackfn: (value: number, index: number) => void, thisArg?: any) {
    return this.bins_.forEach(callbackfn, thisArg);
  }
}

class Histogram extends AHistogram {
  constructor(bins: number, private value_range: number[], hist?: number[]) {
    super(bins, hist);
  }

  binOf(value: any) {
    if (typeof value === 'number') {
      return this.binOfImpl(<number>value);
    }
    return -1;
  }

  private binOfImpl(value: number) {
    if (isNaN(value)) {
      return -1;
    }
    const n = (value - this.value_range[0]) / (this.value_range[1] - this.value_range[0]);
    var bin = Math.round(n * (this.bins - 1));
    if (bin < 0) {
      bin = 0;
    }
    if (bin >= this.bins) {
      bin = this.bins - 1;
    }
    return isNaN(bin) ? -1 : bin;
  }
}

class CatHistogram extends AHistogram implements ICatHistogram {
  constructor(private values: any[], public categories: string[], public colors: string[]) {
    super(values.length);
  }

  binOf(value: any) {
    return this.values.indexOf(value);
  }
}


class RangeHistogram implements ICatHistogram {
  constructor(private range_: CompositeRange1D) {
  }

  get categories() {
    return this.range_.groups.map((g) => g.name);
  }

  get colors() {
    return this.range_.groups.map((g) => g.color);
  }

  get largestFrequency() {
    return Math.max.apply(Math, this.range_.groups.map((g) => g.length));
  }

  get largestBin() {
    return this.largestFrequency;
  }

  get count() {
    return this.range_.length;
  }

  get validCount() {
    return this.count;
  }

  get bins() {
    return this.range_.groups.length;
  }

  binOf(value: any) {
    return indexOf(this.range_.groups, (g) => g.name === value);
  }

  frequency(bin: number) {
    return this.range_.groups[bin].length;
  }

  range(bin:number) {
    return list(this.range_.groups[bin]);
  }

  get missing() {
    return 0;
  }

  get missingRange() {
    return none();
  }

  forEach(callbackfn: (value: number, index: number) => void, thisArg?: any) {
    return this.range_.groups.forEach((g,i) => callbackfn.call(thisArg, g.length, i));
  }
}
