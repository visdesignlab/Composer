/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 27.08.2014.
 */

import {mixin} from '../index';
import {IDataType, assignData} from '../datatype';
import {
  IVisMetaData, IVisInstance, IVisPluginDesc, AVisInstance, assignVis, list as listVisses,
  ITransform
} from '../vis';
import {IMultiForm, IMultiFormOptions, addSelectVisChooser, addIconVisChooser} from './IMultiForm';
import {createNode, ProxyMetaData, clearNode, selectVis} from './internal';
import {Range} from '../range';

/**
 * a simple multi form class using a select to switch
 */
export default class MultiForm extends AVisInstance implements IVisInstance, IMultiForm {
  readonly node: HTMLElement;
  /**
   * list of all possibles vis techniques
   */
  readonly visses: IVisPluginDesc[];

  private actVis: IVisInstance;
  private actVisPromise: Promise<any>;

  private actDesc: IVisPluginDesc;
  private content: HTMLElement;

  private readonly _metaData: IVisMetaData = new ProxyMetaData(() => this.actDesc);

  constructor(public readonly data: IDataType, parent: HTMLElement, private options: IMultiFormOptions = {}) {
    super();
    this.options = mixin({
      initialVis: 0,
      all: { //options to all visses

      },
      filter: () => true
    }, options);
    this.node = createNode(parent, 'div', 'multiform');
    assignData(parent, data);
    assignVis(this.node, this);
    //find all suitable plugins
    this.visses = listVisses(data).filter(this.options.filter);

    this.build();
  }

  /**
   * converts this multiform to a vis metadata
   * @return {IVisMetaData}
   */
  get asMetaData() {
    return this._metaData;
  }


  private build() {
    //create select option field

    //create content
    this.content = createNode(this.node, 'div', 'content');
    //switch to first
    this.switchTo(this.options.initialVis);
  }

  destroy() {
    if (this.actVis && typeof(this.actVis.destroy) === 'function') {
      this.actVis.destroy();
    }
    super.destroy();
  }

  persist(): any {
    return {
      id: this.actDesc ? this.actDesc.id : null,
      content: this.actVis && typeof(this.actVis.persist) === 'function' ? this.actVis.persist() : null
    };
  }

  async restore(persisted: any): Promise<MultiForm> {
    const that = this;
    if (persisted.id) {
      const selected = this.visses.find((e) => e.id === persisted.id);
      if (selected) {
        const vis = await this.switchTo(selected);
        if (vis && persisted.content && typeof(vis.restore) === 'function') {
          await Promise.resolve(vis.restore(persisted.content));
        }
        return that;
      }
    }
    return Promise.resolve(that);
  }

  locate(...args: Range[]): Promise<any> {
    const p = this.actVisPromise || Promise.resolve(null);
    return p.then((...aa: IVisInstance[]) => {
      const vis = aa.length > 0 ? aa[0] : undefined;
      if (vis && typeof(vis.locate) === 'function') {
        return vis.locate.apply(vis, args);
      } else {
        return Promise.resolve((aa.length === 1 ? undefined : new Array(args.length)));
      }
    });
  }

  locateById(...args: Range[]): Promise<any> {
    const p = this.actVisPromise || Promise.resolve(null);
    return p.then((...aa: IVisInstance[]) => {
      const vis = aa.length > 0 ? aa[0] : undefined;
      if (vis && typeof(vis.locateById) === 'function') {
        return vis.locateById.apply(vis, args);
      } else {
        return Promise.resolve((aa.length === 1 ? undefined : new Array(args.length)));
      }
    });
  }

  transform(scale?: [number, number], rotate?: number) {
    if (this.actVis) {
      if (arguments.length === 0) {
        return this.actVis.transform();
      } else {
        const t = (event: any, newValue: ITransform, old: ITransform) => {
          this.fire('transform', newValue, old);
        };
        this.actVis.on('transform', t);
        const r = this.actVis.transform(scale, rotate);
        this.actVis.off('transform', t);
        return r;
      }
    }
    if (this.actVisPromise && arguments.length > 0) {
      //2nd try
      this.actVisPromise.then((v) => this.transform(scale, rotate));
    }
    return {
      scale: <[number, number]>[1, 1],
      rotate: 0
    };
  }

  /**
   * returns the current selected vis technique description
   * @returns {plugins.IPluginDesc}
   */
  get act() {
    return this.actDesc;
  }

  get actLoader() {
    return this.actVisPromise;
  }

  get size(): [number, number] {
    if (this.actVis) {
      return this.actVis.size;
    }
    return [100, 100];
  }

  get rawSize(): [number, number] {
    if (this.actVis) {
      return this.actVis.rawSize;
    }
    return [100, 100];
  }

  /**
   * switch to the desired vis technique given by index
   * @param param
   */
  switchTo(param: number|string|IVisPluginDesc): Promise<IVisInstance> {
    const vis: IVisPluginDesc = selectVis(param, this.visses);

    if (vis === this.actDesc) {
      return this.actVisPromise; //already selected
    }
    //gracefully destroy
    if (this.actVis) {
      this.actVis.destroy();
      this.actVis = null;
      this.actVisPromise = null;
    }
    //remove content dom side
    clearNode(this.content);

    //switch and trigger event
    const bak = this.actDesc;
    this.actDesc = vis;
    this.markReady(false);
    this.fire('change', vis, bak);
    this.actVis = null;
    this.actVisPromise = null;

    if (vis) {
      //load the plugin and create the instance
      return this.actVisPromise = vis.load().then((plugin: any) => {
        if (this.actDesc !== vis) { //changed in the meanwhile
          return null;
        }
        this.actVis = plugin.factory(this.data, this.content, mixin({}, this.options.all, this.options[vis.id] || {}));
        if (this.actVis.isBuilt) {
          this.markReady();
        } else {
          this.actVis.on('ready', () => {
            this.markReady();
          });
        }
        this.fire('changed', vis, bak);
        return this.actVis;
      });
    } else {
      return Promise.resolve(null);
    }
  }

  addIconVisChooser(toolbar: HTMLElement) {
    return addIconVisChooser(toolbar, this);
  }

  addSelectVisChooser(toolbar: HTMLElement) {
    return addSelectVisChooser(toolbar);
  }
}

export function create(data: IDataType, parent: HTMLElement, options?: IMultiFormOptions) {
  return new MultiForm(data, parent, options);
}
