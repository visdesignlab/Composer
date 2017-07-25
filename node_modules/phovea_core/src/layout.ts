/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 15.12.2014.
 */
import {Rect, rect} from './geom';

export interface ILayoutElem {
  setBounds(x: number, y: number, w: number, h: number): Promise<void>|null;

  getBounds(): Rect;

  layoutOption<T>(name: string): T;
  layoutOption<T>(name: string, defaultValue: T): T;
}

export interface ILayoutOptions {
  /**
   * preferred x position
   * default NaN
   */
  prefX?: number;
  /**
   * preferred y position
   * default NaN
   */
  prefY?: number;
  /**
   * preferred width
   * default NaN
   */
  prefWidth?: number;
  /**
   * preferred height
   * default NaN
   */
  prefHeight?: number;
  /**
   * border attachment for BorderLayout, possible values: center, top, left, right, bottom
   * default: center
   */
  border?: string;
}

export class ALayoutElem {
  constructor(private options: ILayoutOptions = {}) {

  }

  getBounds(): Rect {
    return rect(0, 0, 0, 0);
  }

  getLocation() {
    return this.getBounds().xy;
  }

  getSize() {
    return this.getBounds().size;
  }

  layoutOption<T>(name: string, defaultValue: T = null): T {
    if (this.options.hasOwnProperty(name)) {
      return (<any>this.options)[name];
    }
    return defaultValue;
  }
}

export interface IHTMLLayoutOptions extends ILayoutOptions {
  // px
  unit?: string;
}

class HTMLLayoutElem extends ALayoutElem implements ILayoutElem {
  constructor(private node: HTMLElement, options: IHTMLLayoutOptions = {}) {
    super(options);
  }

  setBounds(x: number, y: number, w: number, h: number): Promise<void>|null {
    const unit = this.layoutOption('unit', 'px'),
      style = this.node.style;
    style.left = x + unit;
    style.top = y + unit;
    style.width = w + unit;
    style.height = h + unit;
    return null;
  }

  getBounds() {
    const unit = this.layoutOption('unit', 'px'),
      style = this.node.style;

    function v(f: string) {
      if (f.length >= unit.length && f.substring(f.length - unit.length) === unit) {
        f = f.substring(0, f.length - unit.length);
        return parseFloat(f);
      }
      return 0;
    }

    return rect(v(style.left), v(style.top), v(style.width), v(style.height));
  }
}

export function wrapDOM(node: HTMLElement, options: any = {}) {
  return new HTMLLayoutElem(node, options);
}

export interface IPadding {
  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly bottom: number;
}

export function padding(v: number): IPadding {
  return {top: v, left: v, right: v, bottom: v};
}

export const noPadding = padding(0);

export interface ILayout {
  (elems: ILayoutElem[], w: number, h: number, parent: ILayoutElem): Promise<boolean>;
}

function isDefault(v: number) {
  return v < 0 || isNaN(v);
}

function grab(definition: number, v: number) {
  return isDefault(definition) ? v : definition;
}

function waitFor(promises: Promise<any>[], redo: boolean = false): Promise<boolean> {
  promises = promises.filter((p) => p != null);
  if (promises.length === 0) {
    return Promise.resolve(redo);
  } else if (promises.length === 1) {
    return promises[0].then(() => redo);
  }
  return Promise.all(promises).then(() => redo);
}

export function layers(elems: ILayoutElem[], w: number, h: number, parent: ILayoutElem) {
  return waitFor(elems.map((elem) => {
    const x = grab(elem.layoutOption('prefX', Number.NaN), 0);
    const y = grab(elem.layoutOption('prefY', Number.NaN), 0);
    return elem.setBounds(x, y, w - x, h - y);
  }));
}

export function flowLayout(horizontal: boolean, gap: number, padding = {top: 0, left: 0, right: 0, bottom: 0}) {
  function getSize(w: number, h: number, child: ILayoutElem, value: number) {
    if (horizontal) {
      return [value, grab(child.layoutOption('prefHeight', Number.NaN), h)];
    } else {
      return [grab(child.layoutOption('prefWidth', Number.NaN), w), value];
    }
  }

  function FlowLayout(elems: ILayoutElem[], w: number, h: number, parent: ILayoutElem) {
    w -= padding.left + padding.right;
    h -= padding.top + padding.bottom;
    const freeSpace = (horizontal ? w : h) - gap * (elems.length - 1);
    let unbound = 0, fixUsed = 0, ratioSum = 0;

    // count statistics
    elems.forEach((elem) => {
      const fix = elem.layoutOption(horizontal ? 'prefWidth' : 'prefHeight', Number.NaN);
      const ratio = elem.layoutOption('ratio', Number.NaN);
      if (isDefault(fix) && isDefault(ratio)) {
        unbound++;
      } else if (fix >= 0) {
        fixUsed += fix;
      } else {
        ratioSum += ratio;
      }
    });

    const ratioMax = (ratioSum < 1) ? 1 : ratioSum;
    const unboundedSpace = (freeSpace - fixUsed - freeSpace * ratioSum / ratioMax) / unbound;

    // set all sizes
    const sizes = elems.map((elem) => {
      const fix = elem.layoutOption(horizontal ? 'prefWidth' : 'prefHeight', Number.NaN);
      const ratio = elem.layoutOption('ratio', Number.NaN);
      if (isDefault(fix) && isDefault(ratio)) {
        return getSize(w, h, elem, unboundedSpace);
      } else if (fix >= 0) {
        return getSize(w, h, elem, fix);
      } else { // (ratio > 0)
        const value = (ratio / ratioMax) * freeSpace;
        return getSize(w, h, elem, value);
      }
    });
    // set all locations
    let xAccumulator = padding.left;
    let yAccumulator = padding.top;
    const promises : Promise<void>[] = [];
    elems.forEach((elem, i) => {
      const s = sizes[i];
      promises.push(elem.setBounds(xAccumulator, yAccumulator, s[0], s[1]));
      if (horizontal) {
        xAccumulator += s[0] + gap;
      } else {
        yAccumulator += s[1] + gap;
      }
    });
    return waitFor(promises);
  }

  return FlowLayout;
}

export function distributeLayout(horizontal: boolean, defaultValue: number, padding = noPadding) {
  function setBounds(x: number, y: number, w: number, h: number, child: ILayoutElem, value: number) {
    if (horizontal) {
      return child.setBounds(x, y, value, grab(child.layoutOption('prefHeight', Number.NaN), h));
    } else {
      return child.setBounds(x, y, grab(child.layoutOption('prefWidth', Number.NaN), w), value);
    }
  }

  function DistributeLayout(elems: ILayoutElem[], w: number, h: number, parent: ILayoutElem) {
    w -= padding.left + padding.right;
    h -= padding.top + padding.bottom;
    const freeSpace = (horizontal ? w : h);
    let fixUsed = 0;

    // count statistics
    elems.forEach((elem) => {
      let fix = elem.layoutOption(horizontal ? 'prefWidth' : 'prefHeight', Number.NaN);
      if (isDefault(fix)) {
        fix = defaultValue;
      }
      fixUsed += fix;
    });

    const gap = (freeSpace - fixUsed) / (elems.length - 1);

    let xAccumulator = padding.left;
    let yAccumulator = padding.top;

    if (elems.length === 1) { //center the single one
      if (horizontal) {
        xAccumulator += (freeSpace - fixUsed) / 2;
      } else {
        yAccumulator += (freeSpace - fixUsed) / 2;
      }
    }

    const promises: Promise<any>[] = [];
    elems.forEach((elem) => {
      let fix = elem.layoutOption(horizontal ? 'prefWidth' : 'prefHeight', Number.NaN);
      if (isDefault(fix)) {
        fix = defaultValue;
      }
      promises.push(setBounds(xAccumulator, yAccumulator, w, h, elem, fix));
      if (horizontal) {
        xAccumulator += fix + gap;
      } else {
        yAccumulator += fix + gap;
      }
    });
    return waitFor(promises);
  }

  return DistributeLayout;
}

//     top
//------------
// l |      | r
// e |      | i
// f |center| g
// t |      | h
//   |      | t
//-------------
//   bottom

export function borderLayout(horizontal: boolean, gap: number, percentages: IPadding = {
  top: 0.2,
  left: 0.2,
  right: 0.2,
  bottom: 0.2
}, padding: IPadding = noPadding) {
  function BorderLayout(elems: ILayoutElem[], w: number, h: number, parent: ILayoutElem) {
    w -= padding.left + padding.right;
    h -= padding.top + padding.bottom;
    let x = padding.top, y = padding.left, wc = w, hc = h;
    const pos = new Map<string, ILayoutElem[]>();
    pos.set('top', []);
    pos.set('center', []);
    pos.set('left', []);
    pos.set('right', []);
    pos.set('bottom', []);
    elems.forEach((elem) => {
      let border = elem.layoutOption('border', 'center');
      if (!pos.has(border)) {
        border = 'center'; //invalid one
      }
      pos.get(border).push(elem);
    });

    const promises = [];
    if (pos.get('top').length > 0) {
      y += h * percentages.top;
      hc -= h * percentages.top;
      promises.push(flowLayout(true, gap)(pos.get('top'), w, h * percentages.top, parent));
    }
    if (pos.get('bottom').length > 0) {
      hc -= h * percentages.bottom;
      promises.push(flowLayout(true, gap)(pos.get('bottom'), w, h * percentages.bottom, parent));
    }
    if (pos.get('left').length > 0) {
      x += w * percentages.left;
      wc -= w * percentages.left;
      promises.push(flowLayout(false, gap)(pos.get('left'), w * percentages.left, hc, parent));
    }
    if (pos.get('right').length > 0) {
      wc -= w * percentages.right;
      promises.push(flowLayout(false, gap)(pos.get('right'), w * percentages.right, hc, parent));
    }
    if (pos.get('center').length > 0) {
      promises.push(flowLayout(true, gap)(pos.get('center'), wc, hc, parent));
    }

    return waitFor(promises);
  }

  return BorderLayout;
}
