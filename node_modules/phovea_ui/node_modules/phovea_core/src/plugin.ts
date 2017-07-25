/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

import {mixin, constantTrue, search, uniqueString} from './index';

/**
 * basic interface of a plugin
 */
export interface IPluginDesc {
  /**
   * type of plugin, a name by convention for identifying different plugin types
   */
  type : string;
  /**
   * name of the plugin, should be unique within a type
   */
  id : string;

  /**
   * human readable name of this plugin
   */
  name: string;

  /**
   * version of this plugin
   * @default 1.0
   */
  version: string;
  /**
   * optional description of this plugin   *
   */
  description: string;

  /**
   * name of the method, which is the entry point of this plugin
   * @default create
   */
  factory: string;

  /**
   * function for loading this plugin
   * @returns a promise for the loaded plugin
   */
  load() : Promise<IPlugin>;

  /**
   * anything custom
   */
  [key: string]: any;
}

/**
 * basic plugin element
 */
export interface IPlugin {
  /**
   * underlying plugin description
   */
  desc: IPluginDesc;
  /**
   * link to the referenced method as described in the description
   */
  factory(...args:any[]): any;
}

const registry : IPluginDesc[] = [];
//TODO convert to Map
const knownPlugins = {};


function push(type: string, id_or_loader: string | (()=>any), desc_or_loader: any, desc?: any) {
  const id = typeof id_or_loader === 'string' ? <string>id_or_loader : uniqueString(type);
  const loader = typeof id_or_loader === 'string' ? <()=>any>desc_or_loader : <()=>any>desc_or_loader;
  const p: IPluginDesc = mixin({
    type: type,
    id: id,
    name: id,
    factory: 'create',
    description: '',
    version: '1.0.0',
    load: ()=> Promise.resolve(loader()).then((instance) => ({ desc: p, factory: instance[p.factory]}))
  }, typeof desc_or_loader === 'function' ? desc: desc_or_loader);

  registry.push(p);
}

export interface IRegistry {
  push(type: string, loader: ()=>any, desc?: any);
  push(type: string, id: string, loader: ()=>any, desc?: any);
  push(type: string, id_or_loader: string | (()=>any), desc_or_loader: any, desc?: any);
}

export function register(plugin: string, generator?: (registry: IRegistry) => void) {
  if (typeof generator !== 'function') {
     //wrong type - not a function, maybe a dummy inline
    return;
  }
  if (plugin in knownPlugins) {
    return; // don't call it twice
  }
  knownPlugins[plugin] = true;

  generator({
    push: push
  });
}

/**
 * returns a list of matching plugin descs
 * @param filter
 * @returns {IPluginDesc[]}
 */
export function list(filter : (string | ((desc:IPluginDesc)=>boolean)) = constantTrue) {
  if (typeof filter === 'string') {
    const v = filter;
    filter = (desc) => desc.type === v;
  }
  if (filter === constantTrue) {
    return registry.slice();
  }
  return registry.filter(<any>filter);
}

/**
 * returns an extension identified by type and id
 * @param type
 * @param id
 * @returns {IPluginDesc}
 */
export function get(type: string, id : string) : IPluginDesc {
  return search(registry, (d) => d.type === type && d.id === id);
}

export function load(desc: IPluginDesc[]) {
  return Promise.all(desc.map((d) => d.load()));
}
