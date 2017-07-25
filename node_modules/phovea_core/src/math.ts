/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 29.08.2014.
 */

import {none, list, Range, Range1D, CompositeRange1D} from './range';
/**
 * simple number statistics similar to DoubleStatistics in Caleydo
 * TODO use a standard library for that
 */
export interface IStatistics {
  readonly min: number;
  readonly max: number;
  readonly sum: number;
  readonly mean: number;
  readonly var: number;
  readonly sd: number;
  readonly n: number;
  readonly nans: number;
  readonly moment2: number;
  readonly moment3: number;
  readonly moment4: number;
  readonly kurtosis: number;
  readonly skewness: number;
}

export interface IAdvancedStatistics extends IStatistics {
  readonly median: number;
  readonly q1: number;
  readonly q3: number;
}


export interface IIterable<T> {
  forEach(callbackfn: (value: T) => void, thisArg?: any): void;
}

export interface IHistogram extends IIterable<number> {
  readonly bins: number;
  readonly largestFrequency: number;
  /**
   * largest frequency without missing
   */
  readonly largestBin: number;
  readonly count: number;
  /**
   * number of valid entries;
   */
  readonly validCount: number;

  frequency(bin: number): number;
  range(bin: number): Range;

  binOf(value: any): number;

  readonly missing: number;
  readonly missingRange: Range;

  forEach(callbackfn: (value: number, index: number) => void, thisArg?: any): void;
}

export interface ICatHistogram extends IHistogram {
  readonly categories: string[];
  readonly colors: string[];
}

class Statistics implements IStatistics {
  min: number = NaN;
  max: number = NaN;
  sum: number = 0;
  mean: number = 0;
  private _var: number = 0;
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
    if (typeof x !== 'number') {
      x = Number.NaN;
    }

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
      const meanMinus1 = this.mean;
      this.mean = meanMinus1 + (x - meanMinus1) / this.n;
      this._var = this._var + (x - meanMinus1) * (x - this.mean);

      const delta = x - meanMinus1;
      const deltaN = delta / this.n;
      const deltaNSquare = deltaN * deltaN;
      const term1 = delta * deltaN * (this.n - 1);
      this.moment4 += term1 * deltaNSquare * (this.n * this.n - 3 * this.n + 3) + 6 * deltaNSquare * this.moment2 - 4 * deltaN * this.moment3;
      this.moment3 += term1 * deltaN * (this.n - 2) - 3 * deltaN * this.moment2;
      this.moment2 += term1;
    }
  }
}

class AdvancedStatistics extends Statistics implements IAdvancedStatistics {
  constructor(public readonly median: number, public readonly q1: number, public readonly q3: number) {
    super();
  }
}

export function computeStats(...arr: IIterable<number>[]): IStatistics {
  const r = new Statistics();
  arr.forEach((a) => a.forEach(r.push, r));
  return r;
}

function quantile(arr: number[], percentile: number) {
  const n = arr.length;
  if (n === 0) {
    return NaN;
  }
  if (n < 2 || percentile <= 0) {
    return arr[0];
  }
  if (percentile >= 1) {
    return arr[n - 1];
  }
  const target = percentile * (n - 1);
  const targetIndex = Math.floor(target);
  const a = arr[targetIndex], b = arr[targetIndex + 1];
  return a + (b - a) * (target - targetIndex);
}

export function computeAdvancedStats(arr: number[]): IAdvancedStatistics {
  arr = arr.slice().sort((a, b) => a - b);

  const r = new AdvancedStatistics(quantile(arr, 0.5), quantile(arr, 0.25), quantile(arr, 0.75));
  arr.forEach((a) => r.push(a));
  return r;
}

export function hist(arr: IIterable<number>, indices: Range1D, size: number, bins: number, range: number[]): IHistogram {
  const r = new Histogram(bins, range);
  r.pushAll(arr, indices, size);
  return r;
}

export function categoricalHist<T>(arr: IIterable<T>, indices: Range1D, size: number, categories: T[], labels: string[], colors: string[]): IHistogram {
  const r = new CatHistogram(categories, labels, colors);
  r.pushAll(arr, indices, size);
  return r;
}

export function rangeHist(range: CompositeRange1D) {
  return new RangeHistogram(range);
}
export function wrapHist(hist: number[], valueRange: number[]) {
  return new Histogram(hist.length, valueRange, hist);
}

class AHistogram implements IHistogram {
  private _bins: number[];
  private _missing: number = 0;
  private _ranges: Range[];
  private _missingRange = none();

  constructor(bins: number, hist?: number[]) {
    this._bins = [];
    for (let i = 0; i < bins; ++i) {
      this._bins.push(hist && hist.length > i ? hist[i] : 0);
    }
  }

  get largestFrequency() {
    return Math.max(Math.max.apply(Math, this._bins), this._missing);
  }

  get largestBin() {
    return Math.max.apply(Math, this._bins);
  }

  get count() {
    return this.validCount + this._missing;
  }

  get validCount() {
    return this._bins.reduce((p, s) => p + s, 0);
  }

  get bins() {
    return this._bins.length;
  }

  binOf(value: any) {
    return -1;
  }

  frequency(bin: number) {
    return this._bins[bin];
  }

  range(bin: number) {
    return this._ranges ? this._ranges[bin] : none();
  }

  get missing() {
    return this._missing;
  }

  get missingRange() {
    return this._missingRange;
  }

  pushAll(arr: IIterable<any>, indices?: Range1D, size?: number) {
    const binindex: number[][] = [], missingindex: number[] = [];
    for (let i = this.bins - 1; i >= 0; --i) {
      binindex.push([]);
    }
    if (indices) {
      const it = indices.iter(size);
      arr.forEach((x) => {
        const index = it.next();
        const bin = this.binOf(x);
        if (bin < 0) {
          this._missing++;
          missingindex.push(index);
        } else {
          this._bins[bin]++;
          binindex[bin].push(index);
        }
      });
      //build range and remove duplicates
      this._ranges = binindex.map((d) => list(d.sort().filter((di, i, a) => di !== a[i - 1])));
      this._missingRange = list(missingindex.sort().filter((di, i, a) => di !== a[i - 1]));
    } else {
      arr.forEach((x) => {
        const bin = this.binOf(x);
        if (bin < 0) {
          this._missing++;
        } else {
          this._bins[bin]++;
        }
      });
      this._ranges = null;
      this._missingRange = null;
    }
  }

  forEach(callbackfn: (value: number, index: number) => void, thisArg?: any) {
    return this._bins.forEach(callbackfn, thisArg);
  }
}

class Histogram extends AHistogram {
  constructor(bins: number, private valueRange: number[], hist?: number[]) {
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
    const n = (value - this.valueRange[0]) / (this.valueRange[1] - this.valueRange[0]);
    let bin = Math.round(n * (this.bins - 1));
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
  constructor(private values: any[], public readonly categories: string[], public readonly colors: string[]) {
    super(values.length);
  }

  binOf(value: any) {
    return this.values.indexOf(value);
  }
}


class RangeHistogram implements ICatHistogram {
  constructor(private readonly _range: CompositeRange1D) {
  }

  get categories() {
    return this._range.groups.map((g) => g.name);
  }

  get colors() {
    return this._range.groups.map((g) => g.color);
  }

  get largestFrequency() {
    return Math.max.apply(Math, this._range.groups.map((g) => g.length));
  }

  get largestBin() {
    return this.largestFrequency;
  }

  get count() {
    return this._range.length;
  }

  get validCount() {
    return this.count;
  }

  get bins() {
    return this._range.groups.length;
  }

  binOf(value: any) {
    return this._range.groups.findIndex((g) => g.name === value);
  }

  frequency(bin: number) {
    return this._range.groups[bin].length;
  }

  range(bin: number) {
    return list(this._range.groups[bin]);
  }

  get missing() {
    return 0;
  }

  get missingRange() {
    return none();
  }

  forEach(callbackfn: (value: number, index: number) => void, thisArg?: any) {
    return this._range.groups.forEach((g, i) => callbackfn.call(thisArg, g.length, i));
  }
}

/**
 * computes the extent [min, max] for the given array, in case of empty array [NaN, NaN] is returned
 * @param arr the array
 * @return {[number,number]} [min, max]
 */
export function extent(arr: IIterable<number>): [number, number] {
  let min = NaN, max = NaN;
  arr.forEach((v) => {
    if (isNaN(v)) {
      return;
    }
    if (isNaN(min) || min > v) {
      min = v;
    }
    if (isNaN(max) || min < v) {
      max = v;
    }
  });
  return [min, max];
}
