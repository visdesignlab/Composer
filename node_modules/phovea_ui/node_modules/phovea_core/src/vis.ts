/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 05.08.2014.
 */
import {IPersistable, uniqueId, isFunction, constantTrue} from './index';
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
  scale: number[];

  /**
   * rotation
   */
  rotate: number;
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

  locateById(... range: Range[]): Promise<any>;
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
  scaling: string; //'free' (default) | 'aspect' | 'width-only' | 'height-only'

  /**
   * defines the rotation change angles
   * - no / 0 ... no rotation (default)
   * - free / null / NaN ... any rotation
   * - transpose / 90 ... 90 degree
   * - swap / 180 ... 180 degree
   * - <number> any degree
   */
  rotation: number;

  /**
   * indicator, whether the size of this vis depends on the dimensions of the data, i.e. an axis no, a heatmap yes
   */
  sizeDependsOnDataDimension : boolean[];
}

/**
 * formal description of the interface of a plugin description
 */
export interface IVisPluginDesc extends IPluginDesc, IVisMetaData {
  /**
   * determines whether the given data can be represented using this visualization technique
   * @param data
   */
  filter(data: IDataType) : boolean;

  /**
   * add all icon information of this vis to the given html element
   * @param node
   */
  iconify(node: HTMLElement);
}

/**
 * basic interface of an visualization instance
 */
export interface IVisInstance extends IPersistable, IEventHandler, ILocateAble {
  /**
   * the unique id of this vis instance
   */
  id: number;

  /**
   * the base element of this vis
   */
  node: Element;

  /**
   * the represented data
   */
  data: IDataType;

  /**
   * current size of this vis
   * @returns [width, height]
   */
  size: [number, number];

  /**
   * the size without transformation applied
   */
  rawSize: [number, number];

  /**
   * returns the current transformation
   */
  transform(): ITransform;

  /**
   * sets the transformation
   * @param scale [w,h]
   * @param rotate
   */
  transform(scale: number[], rotate: number) : ITransform;

  /**
   * option getter
   * @param name
   */
  option(name: string) : any;

  /**
   * option setter
   * @param name
   * @param value
   */
  option(name: string, value: any) : any;

  /**
   * updates this vis
   */
  update();

  /**
   * destroy this vis and deregister handlers,...
   */
  destroy();
}

export function assignVis(node: Element, vis: IVisInstance) {
  (<any>node).__vis__ = vis;
}

/**
 * base class for an visualization
 */
export class AVisInstance extends EventHandler {
  id = uniqueId('vis');
  private _built = false;

  option(name: string, value?: any) {
    //dummy
    //if (value) {
    //  this.fire('option', name, value, null);
    //}
    return null;
  }

  persist() {
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

  locate(...range:Range[]) {
    if (range.length === 1) {
      return this.locateImpl(range[0]);
    }
    return Promise.all(range.map(this.locateImpl, this));
  }

  locateById(...range:Range[]) {
    return (<any>this).data.ids().then((ids) => {
      if (range.length === 1) {
        return this.locateImpl(ids.indexOf(range[0]));
      }
      return Promise.all(range.map((r) => this.locateImpl(ids.indexOf(r))));
    });
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
    if (n && n.parentNode && !(window.event && window.event.type === 'DOMNodeRemoved' && window.event.target === n)) {
      n.parentNode.removeChild(n);
    }
    this.fire('destroyed');
  }

  transform() {
    return {
      scale: [1,1],
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

function extrapolateFilter(r: any) {
  const v = r.filter;
  if (typeof v === 'undefined') {
    r.filter = constantTrue;
  } else if (typeof v === 'string') {
    r.filter = (data) => data && data.desc.type && data.desc.type.match(v);
  } else if (Array.isArray(v)) {
    r.filter = (data) => data && data && (data.desc.type && data.desc.type.match(v[0])) && (!data.desc.value || data.desc.value.type.match(v[1]));
  }
}

function extrapolateIconify(r: any) {
  if (isFunction(r.iconify)) {
    return;
  }
  r.iconify = function iconfiy(node: HTMLElement) {
    node.title = this.name;
    if(this.iconcss) {
      node.classList.add('phovea-vis-icon');
      node.classList.add(this.iconcss);
    } else if (this.icon) {
      node.classList.add('phovea-vis-icon');
      node.style.width = '1em';
      node.style.display = 'inline-block';
      node.style.textAlign = 'center';
      node.style.backgroundSize = '100%';
      node.style.backgroundRepeat = 'no-repeat';
      //lazy load icon
      this.icon().then((iconData) => {
        node.style.backgroundImage = `url(${iconData})`;
      });
      node.innerHTML = '&nbsp';
    } else {
      node.innerText = this.name.substr(0, 1).toUpperCase();
    }
  };
}
function extrapolateSize(r : any) {
  r.scaling = r.scaling || 'free';

  if (Array.isArray(r.sizeDependsOnDataDimension) && typeof r.sizeDependsOnDataDimension[0] === 'boolean') {
    // ok
  } else if (typeof r.sizeDependsOnDataDimension === 'boolean') {
    r.sizeDependsOnDataDimension = [r.sizeDependsOnDataDimension, r.sizeDependsOnDataDimension];
  } else {
    r.sizeDependsOnDataDimension = [false, false];
  }
}

function extrapolateRotation(r : any) {
  const m = { //string to text mappings
    free : NaN,
    no : 0,
    transpose: 90,
    swap: 180
  };
  if (typeof r.rotation === 'string' && r.rotation in m) {
    r.rotation = m[r.rotation];
  } else if (typeof r.rotation === 'number') {
    r.rotation = + r.rotation;
  } else if (r.rotation === null) {
    r.rotation = NaN;
  } else {
    r.rotation = 0;
  }
}

function toVisPlugin(plugin : IPluginDesc) : IVisPluginDesc {
  const r : any = plugin;
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
export function list(data:IDataType): IVisPluginDesc[] {
  //filter additionally with the filter attribute, which can be a function or the expected data type
  return listPlugins('vis').map(toVisPlugin).filter((desc) => desc.filter(data));
}
