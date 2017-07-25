/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */
import {random_id as core_random_id, offline as isOffline, constantTrue} from './index';
import {getAPIJSON, sendAPI} from './ajax';
import {list as listPlugins} from './plugin';
import {IDataDescription, IDataType, DataTypeBase} from './datatype';
import {ITable} from './table';
import {wrapObjects} from './table_impl';

//find all datatype plugins
const available = listPlugins('datatype');

// TODO convert to Map
var cacheById:{ [key : string]: Promise<IDataType> } = {};
var cacheByName:{ [key : string]: Promise<IDataType> } = {};
var cacheByFQName:{ [key : string]: Promise<IDataType> } = {};

export function clearCache(dataset?: IDataType | IDataDescription) {
  if (dataset) {
    const desc : any = (<any>dataset).desc || dataset;
    delete cacheById[desc.id];
    delete cacheByName[desc.name];
    delete cacheByFQName[desc.fqname];
  } else {
    cacheById = {};
    cacheByName = {};
    cacheByFQName = {};
  }
}

function getCachedEntries() : Promise<IDataType[]> {
  return Promise.all(Object.keys(cacheById).map((k) => cacheById[k]));
}

function cached(desc : IDataDescription, result : Promise<IDataType>) {
  cacheById[desc.id] = result;
  cacheByFQName[desc.fqname] = result;
  cacheByName[desc.name] = result;

  return result;
}

/**
 * fix an given id to be used as an HTML id
 * @param id
 * @returns {string|void}
 */
export function fixId(id) {
  var r = id.replace(/[!#$%&'\(\)\*\+,\.\/:;<=>\?@\[\\\]\^`\{\|}~_]/g, ' ');
  //title
  r = r.toLowerCase();
  r = r.split(/\s/).map((s,i) => i === 0 ? s : s[0].toUpperCase() + s.substr(1)).join('');
  return r;
}

export const random_id = core_random_id;

/**
 * create an object out of a description
 * @param desc
 * @returns {*}
 */
function transformEntry(desc: any) : Promise<IDataType> {
  if (desc === undefined) {
    return null;
  }
  desc.id = desc.id || fixId(desc.name+random_id(5));
  desc.fqname = desc.fqname || desc.name;

  if (desc.id in cacheById) {
    return cacheById[desc.id];
  }

  //find matching type
  const plugin = available.filter((p) => p.id === desc.type);
  //no type there create a dummy one
  if (plugin.length === 0) {
    return cached(desc, Promise.resolve(new DataTypeBase(desc)));
  }
  //take the first matching one
  return cached(desc, plugin[0].load().then((p) => {
    return p.factory(desc);
  }));
}

/**
 * returns a promise for getting a map of all available data
 * @returns {Promise<IDataType[]>}
 */
export function list(): Promise<IDataType[]>;
export function list(query : { [key: string] : string }): Promise<IDataType[]>;
export function list(filter : (d: IDataType) => boolean): Promise<IDataType[]>;
export function list(query?: any): Promise<IDataType[]> {
  const f = (typeof query === 'function') ? <(d: IDataType) => boolean>query : constantTrue;
  const q = (typeof query !== 'undefined' && typeof query !== 'function') ? <any>query : {};

  var r = isOffline ? getCachedEntries() : getAPIJSON('/dataset/', q).then(function (descs) {
      //load descriptions and create data out of them
      return <any> Promise.all(descs.map((desc) => transformEntry(desc)));
  });
  if (f !== constantTrue) {
    r = r.then((arr) => arr.filter(f));
  }
  return r;
}

export interface INode {
  name: string;
  children: INode[];
  data: any;
}

/**
 * converts a given list of datasets to a tree
 * @param list
 * @returns {{children: Array, name: string, data: null}}
 */
export function convertToTree(list: IDataType[]) {
  //create a tree out of the list by the fqname
  const root = { children: [], name: '/', data: null};
  list.forEach((entry) => {
    const path = entry.desc.fqname.split('/');
    var act = root;
    path.forEach((node) => {
      var next = act.children.filter((d) => d.name === node)[0];
      if (!next) {
        next = { children: [], name: node, data: null};
        act.children.push(next);
      }
      act = next;
    });
    act.data = entry;
  });

  return root;
}

/**
 * returns a tree of all available datasets
 */
export function tree(): Promise<INode>;
export function tree(query : { [key: string] : string }): Promise<INode>;
export function tree(filter : (d: IDataType) => boolean): Promise<INode>;
export function tree(query ?: any): Promise<INode> {
  return list(query).then(convertToTree);
}

/**
 * returns the first dataset matching the given query
 * @param query
 * @returns {any}
 */
export function getFirst(query: any | string | RegExp) : Promise<IDataType> {
  if (typeof query === 'string' || query instanceof RegExp) {
    return getFirstByName(<string>query);
  }
  query.limit = 1;
  return list(query).then<IDataType>((result) => {
    if (result.length === 0) {
      return Promise.reject({error : 'nothing found, matching', args: query});
    }
    return Promise.resolve(result[0]);
  });
}

/*function escapeRegExp(string){
 return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
 }*/

export function getFirstByName(name: string | RegExp) {
  return getFirstWithCache(name, cacheByName, 'name');
}
export function getFirstByFQName(name: string | RegExp) {
  return getFirstWithCache(name, cacheByFQName, 'fqname');
}

function getFirstWithCache(name: string | RegExp, cache: any, attr = 'name') {
  var r = null,
    inCache = Object.keys(cache).some((n) => {
    if (n.match(<any>name) != null) {
      r = cache[n];
      return true;
    }
    return false;
  });
  if (inCache) {
    return r;
  }
  return getFirst({
    [attr] : typeof name === 'string' ? name : name.source
  });
}

function getById(id: string) {
  if (id in cacheById) {
    return cacheById[id];
  }
  return getAPIJSON('/dataset/'+id+'/desc', {}).then(transformEntry);
}

/**
 * returns a promise for getting a specific dataset
 * @param persisted an id or peristed object containing the id
 * @returns {Promise<IDataType>}
 */
export function get(persisted: any | string) : Promise<IDataType> {
  if (typeof persisted === 'string') {
    return getById(<string>persisted);
  }
  //resolve parent and then resolve it using restore item
  if (persisted.root) {
    return get(persisted.root).then((parent) => {
      return parent ? parent.restore(persisted) : null;
    });
  } else {
    //can't restore non root and non data id
    return Promise.reject('cant restore non root and non data id');
  }
}

/**
 * creates a new dataset for the given description
 * @param desc
 * @returns {Promise<IDataType>}
 */
export function create(desc: any) : Promise<IDataType> {
  return transformEntry(desc);
}

function prepareData(desc: any, file?) {
  const data = new FormData();
  data.append('desc', JSON.stringify(desc));
  if (file) {
    data.append('file',file);
  }
  return data;
}

/**
 * uploads a given dataset description with optional file attachment ot the server
 * @param desc
 * @param file
 * @returns {Promise<*>}
 */
export function upload(desc: any, file?) : Promise<IDataType> {
  const data = prepareData(desc, file);
  return sendAPI('/dataset/',data, 'post').then(transformEntry);
}

/**
 * updates an existing dataset with a new description and optional file
 * @param desc
 * @param file
 * @returns {Promise<*>} returns the update dataset
 */
export function update(entry: IDataType, desc: any, file?) : Promise<IDataType> {
  const data = prepareData(desc, file);
  return sendAPI('/dataset/'+entry.desc.id, data, 'put').then((desc) => {
    clearCache(entry);
    return transformEntry(desc);
  });
}

/**
 * modifies an existing dataset with a new description and optional file, the difference to update is that this should be used for partial changes
 * @param desc
 * @param file
 * @returns {Promise<*>} returns the update dataset
 */
export function modify(entry: IDataType, desc: any, file?) : Promise<IDataType> {
  const data = prepareData(desc, file);
  return sendAPI('/dataset/'+entry.desc.id, data, 'post').then((desc) => {
    clearCache(entry);
    return transformEntry(desc);
  });
}

/**
 * removes a given dataset
 * @param entry
 * @returns {Promise<boolean>}
 */
export function remove(entry: IDataType | IDataDescription): Promise<Boolean> {
  const desc : any = (<any>entry).desc || entry;
  return sendAPI('/dataset/'+desc.id, {}, 'delete').then((result) => {
    clearCache(desc);
    return true;
  });
}

/**
 * utility to convert a list of datatypes to a table compatible datatype object
 * @param list
 * @returns {any}
 */
export function convertToTable(list : IDataType[]) {
  return wrapObjects({
    id : '_data',
    name: 'data',
    fqname: 'custom/data',
    type: 'table',
    idtype: '_data',
    size: [list.length, 4],
    columns: [
      {
        name: 'Name',
        value: {
          type: 'string'
        },
        getter: (d) => d.desc.name
      },
      {
        name: 'Type',
        value: {
          type: 'string'
        },
        getter: (d) => d.desc.type
      },
      {
        name: 'Dimensions',
        value: {
          type: 'string'
        },
        getter: (d) => d.dim.join(' x ')
      },
      {
        name: 'ID Types',
        value: {
          type: 'string'
        },
        getter: (d) => d.idtypes.join(' x ')
      },
    ]
  }, list, (d : IDataType) => d.desc.name);
}

/**
 * utilility function converting all contained tables in their vectors of individual columns
 * @param list
 * @returns {IDataType[]}
 */
export function convertTableToVectors(list: IDataType[]) {
  const r : IDataType[] = [];
  list.forEach((d) => {
    if (d.desc.type === 'table') {
      r.push.apply(r, (<ITable>d).cols());
    } else {
      r.push(d);
    }
  });
  return r;
}

/**
 * lists all datasets and converts them to a table
 * @param tablesAsVectors whether tables should be converted to individual vectors
 * @returns {Promise<*>}
 */
export function listAsTable(tablesAsVectors = false) {
  var l = list();
  if (tablesAsVectors) {
    l = l.then(convertTableToVectors);
  }
  return l.then(convertToTable);
}
