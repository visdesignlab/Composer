/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 *
 * This module provides access functions for dataset stored on a server, including functions to list all datasets,
 * to retrieve datasets by names, id types, ids, etc.
 *
 * See IDataDescriptionMetaData in datatype.ts for various legal parameters
 */
import {offline as isOffline, fixId, randomId} from './index';
import {getAPIJSON, sendAPI} from './ajax';
import {list as listPlugins} from './plugin';
import {IDataDescription, IDataType, DummyDataType} from './datatype';
import {ITable} from './table';
import {wrapObjects} from './table/Table';
export {random_id, fixId} from './index';

//find all datatype plugins
const available = listPlugins('datatype');

const cacheById = new Map<string, Promise<IDataType>>();
const cacheByName = new Map<string, Promise<IDataType>>();
const cacheByFQName = new Map<string, Promise<IDataType>>();

export function clearCache(dataset?: IDataType | IDataDescription) {
  if (dataset) {
    const desc: IDataDescription = (<IDataType>dataset).desc || <IDataDescription>dataset;
    cacheById.delete(desc.id);
    cacheByName.delete(desc.name);
    cacheByFQName.delete(desc.fqname);
  } else {
    cacheById.clear();
    cacheByName.clear();
    cacheByFQName.clear();
  }
}

function getCachedEntries(): Promise<IDataType[]> {
  return Promise.all(Array.from(cacheById.values()));
}

function cached(desc: IDataDescription, result: Promise<IDataType>) {
  cacheById.set(desc.id, result);
  cacheByFQName.set(desc.fqname, result);
  cacheByName.set(desc.name, result);
  return result;
}

/**
 * create an object out of a description
 * @param desc
 * @returns {*}
 */
async function transformEntry(desc: IDataDescription): Promise<IDataType> {
  if (desc === undefined) {
    return null;
  }
  (<any>desc).id = desc.id || fixId(desc.name + randomId(5));
  (<any>desc).fqname = desc.fqname || desc.name;
  (<any>desc).description = desc.description || '';
  (<any>desc).creator = desc.creator || 'Anonymous';
  (<any>desc).ts = desc.ts || 0;

  if (cacheById.has(desc.id)) {
    return cacheById.get(desc.id);
  }

  //find matching type
  const plugin = available.filter((p) => p.id === desc.type);
  //no type there create a dummy one
  if (plugin.length === 0) {
    return cached(desc, Promise.resolve(new DummyDataType(desc)));
  }
  //take the first matching one
  return cached(desc, plugin[0].load().then((d) =>d.factory(desc)));
}

/**
 * returns a promise for getting a map of all available data
 * @param filter optional filter either a function or a server side interpretable filter object
 * @returns {Promise<IDataType[]>}
 */
export async function list(filter?: ({[key: string]: string})|((d: IDataType) => boolean)): Promise<IDataType[]> {
  const f = (typeof filter === 'function') ? <(d: IDataType) => boolean>filter : null;
  const q = (typeof filter !== 'undefined' && typeof filter !== 'function') ? <any>filter : {};

  let r: Promise<IDataType[]>;

  if (isOffline) {
    r = getCachedEntries();
  } else {
    //load descriptions and create data out of them
    r = getAPIJSON('/dataset/', q).then((r) => Promise.all(r.map(transformEntry)));
  }

  if (f !== null) {
    r = r.then((d) => d.filter(f));
  }
  return r;
}

export interface INode {
  readonly name: string;
  readonly children: INode[];
  data: IDataType;
}

/**
 * converts a given list of datasets to a tree
 * @param list
 * @returns {{children: Array, name: string, data: null}}
 */
export function convertToTree(list: IDataType[]): INode {
  //create a tree out of the list by the fqname
  const root :INode = {children: [], name: '/', data: null};

  list.forEach((entry) => {
    const path = entry.desc.fqname.split('/');
    let act = root;
    path.forEach((node) => {
      let next = act.children.find((d) => d.name === node);
      if (!next) {
        next = {children: [], name: node, data: null};
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
export async function tree(filter?: ({[key: string]: string})|((d: IDataType) => boolean)): Promise<INode> {
  return convertToTree(await list(filter));
}

/**
 * Returns the first dataset matching the given query
 * @param query
 * @returns {any}
 */
export async function getFirst(query: {[key: string]: string} | string | RegExp): Promise<IDataType> {
  if (typeof query === 'string' || query instanceof RegExp) {
    return getFirstByName(<string|RegExp>query);
  }
  const q = <any>query;
  q.limit = 1;

  const result = await list(q);
  if (result.length === 0) {
    return Promise.reject({error: 'nothing found, matching', args: q});
  }
  return Promise.resolve(result[0]);
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

function getFirstWithCache(name: string | RegExp, cache: Map<string, Promise<IDataType>>, attr: string) {
  const r = typeof name === 'string' ? new RegExp(<string>name) : name;
  for (const [k, v] of Array.from(cache.entries())) {
    if (r.test(k)) {
      return v;
    }
  }
  return getFirst({
    [attr]: typeof name === 'string' ? name : name.source
  });
}

/**
 * Returns a promise for getting dataset based on a specific ID.
 * @param id the ID, as defined in IDataDescriptionData#id
 * @returns {Promise<any>}
 */
async function getById(id: string) {
  if (cacheById.has(id)) {
    return cacheById.get(id);
  }
  return transformEntry(await getAPIJSON(`/dataset/${id}/desc`));
}

/**
 * Returns a promise for getting a specific dataset
 * @param a persisted id or persisted object containing the id
 * @returns {Promise<IDataType>}
 */
export async function get(persisted: any | string): Promise<IDataType> {
  if (typeof persisted === 'string') {
    return getById(<string>persisted);
  }
  //resolve parent and then resolve it using restore item
  if (persisted.root) {
    const parent = await get(persisted.root);
    return parent ? <IDataType>parent.restore(persisted) : null;
  } else {
    //can't restore non root and non data id
    return Promise.reject('cannot restore non root and non data id');
  }
}

/**
 * creates a new dataset for the given description
 * @param desc
 * @returns {Promise<IDataType>}
 */
export function create(desc: IDataDescription): Promise<IDataType> {
  return transformEntry(desc);
}

function prepareData(desc: any, file?: File) {
  const data = new FormData();
  data.append('desc', JSON.stringify(desc));
  if (file) {
    data.append('file', file);
  }
  return data;
}

/**
 * uploads a given dataset description with optional file attachment ot the server
 * @param data
 * @param file
 * @returns {Promise<*>}
 */
export async function upload(data: any, file?: File): Promise<IDataType> {
  data = prepareData(data, file);
  return transformEntry(await sendAPI('/dataset/', data, 'POST'));
}

/**
 * updates an existing dataset with a new description and optional file
 * @returns {Promise<*>} returns the update dataset
 */
export async function update(entry: IDataType, data: any, file?: File): Promise<IDataType> {
  data = prepareData(data, file);
  const desc = await sendAPI(`/dataset/${entry.desc.id}`, data, 'PUT');
  // clear existing cache
  clearCache(entry);
  //update with current one
  return transformEntry(desc);
}

/**
 * modifies an existing dataset with a new description and optional file, the difference to update is that this should be used for partial changes
 * @returns {Promise<*>} returns the update dataset
 */
export async function modify(entry: IDataType, data: any, file?: File): Promise<IDataType> {
  data = prepareData(data, file);
  const desc = await sendAPI(`/dataset/${entry.desc.id}`, data, 'POST');
  clearCache(entry);
  return transformEntry(desc);
}

/**
 * removes a given dataset
 * @param entry
 * @returns {Promise<boolean>}
 */
export async function remove(entry: IDataType | IDataDescription): Promise<Boolean> {
  const desc: IDataDescription = (<IDataType>entry).desc || <IDataDescription>entry;

  await sendAPI(`/dataset/${desc.id}`, {}, 'DELETE');
  clearCache(desc);
  return true;
}

/**
 * utility to convert a list of datatypes to a table compatible datatype object
 * @param list
 * @returns {any}
 */
export function convertToTable(list: IDataType[]) {
  return wrapObjects({
    id: '_data' + randomId(5),
    name: 'data',
    description: 'list of data types',
    fqname: 'custom/data',
    creator: 'Anonymous',
    ts: Date.now(),
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
  }, list, (d: IDataType) => d.desc.name);
}

/**
 * utility function converting all contained tables in their vectors of individual columns
 * @param list
 * @returns {IDataType[]}
 */
export function convertTableToVectors(list: IDataType[]) {
  const r: IDataType[] = [];
  list.forEach((d) => {
    if (d.desc.type === 'table') {
      r.push(...(<ITable>d).cols());
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
export async function listAsTable(tablesAsVectors = false) {
  let l = await list();
  if (tablesAsVectors) {
    l = convertTableToVectors(l);
  }
  return convertToTable(l);
}
