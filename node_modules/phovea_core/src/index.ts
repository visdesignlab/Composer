/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

export {argFilter, argList, argSort, indexOf, search} from './internal/array';
export {copyDnD, hasDnDType, updateDropEffect} from './internal/dnd';
export {flagId, uniqueId, uniqueString} from './internal/unique';
export {default as IdPool} from './internal/IdPool';
import RemoveNodeObserver from './internal/RemoveNodeObserver';
import HashProperties from './internal/HashProperties';
import PropertyHandler from './internal/PropertyHandler';
import {__extends} from 'tslib';

/**
 * version of the core
 */
declare const __VERSION__: string;
export const version = __VERSION__;

/**
 * whether the standard api calls should be prevented
 * @type {boolean}
 */
export let offline = false;
declare const __APP_CONTEXT__: string;

/* tslint:disable:variable-name */
/**
 * server prefix ofr api calls
 * @type {string}
 */
export let server_url: string = (__APP_CONTEXT__ || '/') + 'api';
/**
 * server suffix for api calls
 * @type {string}
 */
export let server_json_suffix: string = '';
/* tslint:enable:variable-name */

/**
 * initializes certain properties of the core
 * @param config
 */
export function init(config: {offline?: boolean, server_url?: string, server_json_suffix?: string} = {}) {
  config = mixin({
    offline,
    server_url,
    server_json_suffix
  }, config);
  offline = config.offline;
  server_url = config.server_url;
  server_json_suffix = config.server_json_suffix;
}

/**
 * initializes itself based on script data attributes
 * @private
 */
function _init() {
  function find(name: string, camelCaseName = name.slice(0, 1).toUpperCase() + name.slice(1)) {
    const node: HTMLElement = <HTMLElement>document.currentScript || <HTMLElement>document.querySelector(`script[data-phovea-${name}]`);
    if (!node) {
      return undefined;
    }
    return node.dataset['phovea' + camelCaseName];
  }

  const config: any = {};
  if ('true' === find('offline')) {
    config.offline = true;
  }
  let v;
  if ((v = find('server-url', 'ServerUrl')) !== undefined) {
    config.server_url = v;
  }
  if ((v = find('server-json-suffix', 'ServerJsonSuffix')) !== undefined) {
    config.server_json_suffix = v;
  }
  //init myself
  init(config);
}
_init();

/**
 * integrate b into a and override all duplicates
 * @param {Object} a
 * @param {Object} bs
 * @returns {Object} a with extended b
 */
export function mixin<T, U>(a: T, b: U, ...bs: any[]): T & U {
  bs.unshift(b);
  function extend(r: any, b: any) {
    Object.keys(b).forEach((key) => {
      const v = b[key];
      if (Object.prototype.toString.call(v) === '[object Object]') {
        r[key] = (r[key] != null) ? extend(r[key], v) : v;
      } else {
        r[key] = v;
      }
    });
    return r;
  }

  bs.forEach((b) => {
    if (b) {
      a = extend(a, b);
    }
  });
  return <any>a;
}

/**
 * @deprecated use obj === undefined directly
 * @param obj
 * @return {boolean}
 */
export function isUndefined(obj: any) {
  return typeof obj === 'undefined';
}


//fixes a javascript bug on using "%" with negative numbers
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * binds the given function to the given context / this arg
 * @deprecated use Function.prototype.bind directly
 * @param f
 * @param thisArg
 * @returns {function(): any}
 */
export function bind(f: () => any, thisArg: any, ...args: any[]) {
  return f.bind(thisArg, ...args);
}

/**
 * getter generator by name or index
 * @deprecated too simple to write
 */
export function getter(...attr: (number|string)[]) {
  if (attr.length === 1) {
    return (obj: any) => obj[attr[0]];
  }
  return (obj: any) => attr.map((a) => obj[a]);
}

/**
 * @deprecated use `typeof(f) === 'function`
 * @param f
 * @return {boolean}
 */
export function isFunction(f: any) {
  return typeof(f) === 'function';
}

/**
 * @deprecated use `(d) => d`
 * identity function
 */
export function identity(d: any) {
  return d;
}

/**
 * a dummy function, which does exactly nothing, i.e. used as default
 * @deprecated use `()=>undefined`
 */
export function noop() {
  //no op
}

/**
 * just returns the argument in any case
 * @deprecated use `() => x`
 * @param r - the value to return
 * @returns {*}
 */
export function constant(r: any) {
  if (typeof r === 'boolean' && r === true) {
    return constantTrue;
  }
  if (typeof r === 'boolean' && r === false) {
    return constantFalse;
  }
  return () => r;
}

/**
 * special constant function which returns always true, i.e., as a default for a filter function
 * @deprecated use ()=>true
 * @returns {boolean}
 */
export function constantTrue() {
  return true;
}

/**
 * special constant function which returns always false, i.e., as a default for a filter function
 * @deprecated use ()=>false
 * @returns {boolean}
 */
export function constantFalse() {
  return false;
}

/**
 * copies a plain object into a function and call a specific method onto direct call
 * @param obj - the
 * @param f
 * @deprecated
 */
export function callable(obj: any, f: string) {
  //assert this.isPlainObject(obj);
  function CallAbleFactory() {
    let that: any;

    function CallAble() {
      that[f].apply(that, Array.from(arguments));
    }

    that = CallAble;
    mixin(CallAble, obj);
    return CallAble;
  }

  return CallAbleFactory;
}

/**
 * generates a random id of the given length
 * @param length length of the id
 * @returns {string}
 */
export function randomId(length = 8) {
  let id = '';
  while (id.length < length) {
    id += Math.random().toString(36).slice(-8);
  }
  return id.substr(0, length);
}
/* tslint:disable:variable-name */
/**
 * @deprecated
 */
export const random_id = randomId;
/* tslint:enable:variable-name */

/**
 * fixes a given name by converting it to plain camelcase
 * @param name
 * @return {string}
 */
export function fixId(name: string) {
  const clean = name.replace(/[\s!#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~_-]/g, ' ');
  const words = clean.trim().split(/\s+/); //remove heading and trailing spaces and combine multiple one during split
  return words.map((w, i) => (i === 0 ? w[0].toLowerCase() : w[0].toUpperCase()) + w.slice(1)).join('');
}

/* tslint:disable:variable-name */
/**
 * @deprecated
 */
export const fix_id = fixId;
/* tslint:enable:variable-name */


const removeNodeObserver = new RemoveNodeObserver();

/**
 * utility function to get notified, when the given dom element is removed from its parent
 * @param node
 * @param callback
 */
export function onDOMNodeRemoved(node: Element|Element[], callback: () => void, thisArg?: any) {
  if (Array.isArray(node)) {
    node.forEach((nodeid) => removeNodeObserver.observe(nodeid, callback, thisArg));
  } else {
    removeNodeObserver.observe(node, callback, thisArg);
  }
}

/**
 * extends class copied from TypeScript compiler
 * @param subClass
 * @param baseClass
 */
export function extendClass(subClass: any, baseClass: any) {
  __extends(subClass, baseClass);
}


export interface IPersistable {
  /**
   * persist the current configuration and return
   */
  persist(): any;
  /**
   * restores from stored persisted state
   * @param persisted a result of a previous persist call
   * @return the restored view or null if it could be in place restored
   */
  restore(persisted: any): IPersistable|Promise<IPersistable>;
}


/**
 * access to hash parameters and set them, too
 * @type {HashProperties}
 */
export const hash = new HashProperties();
/**
 * access to get parameters
 * @type {PropertyHandler}
 */
export const param = new PropertyHandler(location.search);


/**
 * create a delayed call, can be called multiple times but only the last one at most delayed by timeToDelay will be executed
 * @param callback
 * @param thisCallback
 * @param timeToDelay
 * @return {function(...[any]): undefined}
 */
export function delayedCall(this: any, callback: () => void, timeToDelay = 100, thisCallback = this) {
  let tm = -1;
  return (...args: any[]) => {
    if (tm >= 0) {
      clearTimeout(tm);
      tm = -1;
    }
    args.unshift(thisCallback);
    tm = setTimeout(callback.bind.apply(callback, args), timeToDelay);
  };
}


/**
 * computes the absolute offset of the given element
 * @param element
 * @return {{left: number, top: number, width: number, height: number}}
 */
export function offset(element: Element) {
  if (!element) {
    return {left: 0, top: 0, width: 0, height: 0};
  }
  const obj = element.getBoundingClientRect();
  const w = element.ownerDocument.defaultView;
  return {
    left: obj.left + w.pageXOffset,
    top: obj.top + w.pageYOffset,
    width: obj.width,
    height: obj.height
  };
}

/**
 * returns the bounding box of a given element similar to offset
 * @param element
 * @returns {{x: number, y: number, w: number, h: number}}
 */
export function bounds(element: Element) {
  if (!element) {
    return {x: 0, y: 0, w: 0, h: 0};
  }
  const obj = element.getBoundingClientRect();
  return {
    x: obj.left,
    y: obj.top,
    w: obj.width,
    h: obj.height
  };
}

/**
 * returns a promise that resolves in the given number of milliseconds
 * @param milliseconds the number of milliseconds to resolve
 */
export function resolveIn(milliseconds: number): Promise<void> {
  if (milliseconds <= 0) {
    return Promise.resolve<void>(null);
  }
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
