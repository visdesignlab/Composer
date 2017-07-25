/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 05.08.2014.
 */
import {IPersistable, uniqueId} from './index';
import {IPluginDesc, list as listPlugins} from './plugin';
import {IDataType} from './datatype';
import {Range} from './range';
import {IEventHandler, EventHandler} from './event';


/**
 * transform description without translation
 */
export interface ITransform {
  /**
   * scale factors (width, height)
   */
  readonly scale: [number, number];

  /**
   * rotation
   */
  readonly rotate: number;
}

/**
 *
 */
export interface ILocateAble {
  /**
   * data represented by this vis
   */
  data: IDataType;

  /**
   * locate method, by convention, when just a single range is given, then return
   * just a promise with this range, else an array
   * the return type should be something convertable using the geom module
   */
  locate(...range: Range[]): Promise<any>;

  locateById(...range: Range[]): Promise<any>;
}

/**
 * metadata for a visualization
 */
export interface IVisMetaData {
  /**
   * scaling behavior
   * possible values:
   * - free (default) - no restrictions
   * - aspect - the initial aspect ratio must be kept, i.e. same scaling values in both dimensions
   * - width-only - only the width can be scaled
   * - height-only - only the height can be scaled
   */
  readonly scaling: string; //'free' (default) | 'aspect' | 'width-only' | 'height-only'

  /**
   * defines the rotation change angles
   * - no / 0 ... no rotation (default)
   * - free / null / NaN ... any rotation
   * - transpose / 90 ... 90 degree
   * - swap / 180 ... 180 degree
   * - <number> any degree
   */
  readonly rotation: number;

  /**
   * indicator, whether the size of this vis depends on the dimensions of the data, i.e. an axis no, a heatmap yes
   */
  readonly sizeDependsOnDataDimension: boolean[];
}

/**
 * formal description of the interface of a plugin description
 */
export interface IVisPluginDesc extends IPluginDesc, IVisMetaData {
  /**
   * determines whether the given data can be represented using this visualization technique
   * @param data
   */
  filter(data: IDataType): boolean;

  /**
   * add all icon information of this vis to the given html element
   * @param node
   */
  iconify(node: HTMLElement): HTMLElement;
}

export interface IVisInstanceOptions {
  rotate?: number;
  scale?: [number, number];
}

/**
 * basic interface of an visualization instance
 */
export interface IVisInstance extends IPersistable, IEventHandler, ILocateAble {
  /**
   * the unique id of this vis instance
   */
  readonly id: number;

  /**
   * the base element of this vis
   */
  readonly node: Element;

  /**
   * the represented data
   */
  readonly data: IDataType;

  /**
   * current size of this vis
   * @returns [width, height]
   */
  readonly size: [number, number];

  /**
   * the size without transformation applied
   */
  readonly rawSize: [number, number];

  /**
   * flag whether the vis if fully built, if not wait for the 'ready' event
   */
  readonly isBuilt: boolean;

  /**
   * returns the current transformation
   */
  transform(): ITransform;

  /**
   * sets the transformation
   * @param scale [w,h]
   * @param rotate
   */
  transform(scale: [number, number], rotate: number): ITransform;

  /**
   * option getter
   * @param name
   */
  option(name: string): any;

  /**
   * option setter
   * @param name
   * @param value
   */
  option(name: string, value: any): any;

  /**
   * updates this vis
   */
  update(): void;

  /**
   * destroy this vis and deregister handlers,...
   */
  destroy(): void;
}

export function assignVis(node: Element, vis: IVisInstance) {
  (<any>node).__vis__ = vis;
}

/**
 * base class for an visualization
 */
export class AVisInstance extends EventHandler {
  readonly id = uniqueId('vis');
  private _built = false;

  option(name: string, value?: any): any {
    //dummy
    //if (value) {
    //  this.fire('option', name, value, null);
    //}
    return null;
  }

  persist(): any {
    return null;
  }

  get isBuilt() {
    return this._built;
  }

  protected markReady(built: boolean = true) {
    this._built = built;
    if (built) {
      this.fire('ready');
    }
  }

  locate(...range: Range[]) {
    if (range.length === 1) {
      return this.locateImpl(range[0]);
    }
    return Promise.all(range.map(this.locateImpl, this));
  }

  async locateById(...range: Range[]) {
    const ids: Range = await (<any>this).data.ids();
    if (range.length === 1) {
      return this.locateImpl(ids.indexOf(range[0]));
    }
    return Promise.all(range.map((r) => this.locateImpl(ids.indexOf(r))));
  }

  locateImpl(range: Range) {
    //no resolution by default
    return Promise.resolve(null);
  }

  restore(persisted: any) {
    return Promise.resolve(this);
  }

  update() {
    //do nothing
  }

  destroy() {
    // nothing to destroy
    const n = (<any>this).node;
    const w = n ? n.ownerDocument.defaultView : null;
    if (n && n.parentNode && !(w && w.event && w.event.type === 'DOMNodeRemoved' && w.event.target === n)) {
      n.parentNode.removeChild(n);
    }
    this.fire('destroyed');
  }

  transform(): ITransform {
    return {
      scale: [1, 1],
      rotate: 0
    };
  }

  get rawSize() {
    return [100, 100];
  }

  get size(): [number, number] {
    const t = this.transform();
    const r = this.rawSize;
    //TODO rotation
    return [r[0] * t.scale[0], r[1] * t.scale[1]];
  }
}

function extrapolateFilter(r: {filter?: string|((data: IDataType) => boolean)}) {
  const v = r.filter;
  if (typeof v === 'undefined') {
    r.filter = () => true;
  } else if (typeof v === 'string') {
    r.filter = (data) => data && data.desc.type && data.desc.type.match(v) != null;
  } else if (Array.isArray(v)) {
    r.filter = (data) => data && data && (data.desc.type && data.desc.type.match(v[0])) && ((<any>data.desc).value === undefined || (<any>data.desc).value.type.match(v[1]));
  }
}

function extrapolateIconify(r: {iconify?(node: HTMLElement): void}) {
  if (typeof r.iconify === 'function') {
    return;
  }
  r.iconify = function iconfiy(this: IVisPluginDesc, node: HTMLElement) {
    node.title = this.name;
    const anyThis = <any>this;
    if (anyThis.iconcss) {
      node.classList.add('phovea-vis-icon');
      node.classList.add(anyThis.iconcss);
    } else if (anyThis.icon) {
      node.classList.add('phovea-vis-icon');
      node.style.width = '1em';
      node.style.display = 'inline-block';
      node.style.textAlign = 'center';
      node.style.backgroundSize = '100%';
      node.style.backgroundRepeat = 'no-repeat';
      //lazy load icon
      anyThis.icon().then((iconData: string) => {
        node.style.backgroundImage = `url(${iconData})`;
      });
      node.innerHTML = '&nbsp';
    } else {
      node.innerText = this.name.substr(0, 1).toUpperCase();
    }
    return node;
  };
}
function extrapolateSize(r: {scaling?: string, sizeDependsOnDataDimension: boolean|[boolean, boolean]}) {
  r.scaling = r.scaling || 'free';

  if (Array.isArray(r.sizeDependsOnDataDimension) && typeof r.sizeDependsOnDataDimension[0] === 'boolean') {
    // ok
  } else if (typeof r.sizeDependsOnDataDimension === 'boolean') {
    r.sizeDependsOnDataDimension = [r.sizeDependsOnDataDimension, r.sizeDependsOnDataDimension];
  } else {
    r.sizeDependsOnDataDimension = [false, false];
  }
}

function extrapolateRotation(r: {rotation: string|number|null}) {
  const m = { //string to text mappings
    free: NaN,
    no: 0,
    transpose: 90,
    swap: 180
  };
  if (typeof r.rotation === 'string' && r.rotation in m) {
    r.rotation = (<any>m)[r.rotation];
  } else if (typeof r.rotation === 'number') {
    r.rotation = +r.rotation;
  } else if (r.rotation === null) {
    r.rotation = NaN;
  } else {
    r.rotation = 0;
  }
}

function toVisPlugin(plugin: IPluginDesc): IVisPluginDesc {
  const r: any = plugin;
  extrapolateFilter(r);
  extrapolateIconify(r);
  extrapolateSize(r);
  extrapolateRotation(r);
  return r;
}

/**
 * list a vis plugins and check in addition whether the match the given data type
 * @param data the data type to visualize
 * @returns {IPluginDesc[]}
 */
export function list(data: IDataType): IVisPluginDesc[] {
  //filter additionally with the filter attribute, which can be a function or the expected data type
  return listPlugins('vis').map(toVisPlugin).filter((desc) => desc.filter(data));
}
