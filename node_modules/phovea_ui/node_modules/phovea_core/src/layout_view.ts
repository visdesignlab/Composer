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
import {Rect, rect} from './geom';


export interface IViewDesc extends IPluginDesc {
  type: string; //support, main
  location: string; //left, top, bottom, right, center
}

export interface IView extends ILayoutElem, IEventHandler {
  data : IDataType[];
  idtypes : IDType[];

}

export class AView extends EventHandler implements IView {
  private _layoutOptions : any = {};

  constructor() {
    super();
  }

  get data() {
    return [];
  }

  get idtypes() {
    return  [];
  }

  setBounds(x:number, y:number, w:number, h:number) {
    //implement
    return null;
  }

  getBounds(): Rect {
    return rect(0,0,0,0);
  }

  setLayoutOption(name: string, value: any) {
    this._layoutOptions[name] = value;
  }

  layoutOption<T>(name: string, default_: T = null) : T {
    if (this._layoutOptions.hasOwnProperty(name)) {
      return this._layoutOptions[name];
    }
    return default_;
  }
}

function convertDesc(desc: IPluginDesc) : IViewDesc {
  var d = <any>desc;
  d.type = d.type || 'main';
  d.location = d.location || 'center';
  return d;
}

export function list() {
  return listPlugins('view').map(convertDesc);
}
