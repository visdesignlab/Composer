/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by sam on 25.02.2015.
 */

import {ILayoutElem} from './layout';
import {list as listPlugins, IPluginDesc} from './plugin';
import {IDataType} from './datatype';
import {IDType} from './idtype';
import {EventHandler, IEventHandler} from './event';
import {Rect} from './geom';


export interface IViewDesc extends IPluginDesc {
  /**
   * view type. support, main
   * default: main
   */
  readonly type: string; //support, main
  /**
   * view location: left, top, bottom, right, center
   * default: center
   */
  readonly location: string;
}

export interface IView extends ILayoutElem, IEventHandler {
  readonly data: IDataType[];
  readonly idtypes: IDType[];
}

export abstract class AView extends EventHandler implements IView {
  private _layoutOptions: any = {};

  abstract setBounds(x: number, y: number, w: number, h: number): Promise<void>|any;

  abstract getBounds(): Rect;

  get data(): IDataType[] {
    return [];
  }

  get idtypes(): IDType[] {
    return [];
  }

  setLayoutOption(name: string, value: any) {
    this._layoutOptions[name] = value;
  }

  layoutOption<T>(name: string, defaultValue: T = null): T {
    if (this._layoutOptions.hasOwnProperty(name)) {
      return this._layoutOptions[name];
    }
    return defaultValue;
  }
}

function convertDesc(desc: IPluginDesc): IViewDesc {
  const d = <any>desc;
  d.type = d.type || 'main';
  d.location = d.location || 'center';
  return d;
}

export function list() {
  return listPlugins('view').map(convertDesc);
}
