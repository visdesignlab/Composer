/**
 * Created by sam on 26.12.2016.
 */


import {getAPIJSON} from '../ajax';
import {fire as global_fire} from '../event';
import {defaultSelectionType, IIDType} from './IIDType';
import IDType from './IDType';
import ProductIDType from './ProductIDType';

const cache = new Map<string, IDType|ProductIDType>();
let filledUp = false;


export const EVENT_REGISTER_IDTYPE = 'register.idtype';

function fillUpData(entries: IIDType[]) {
  entries.forEach(function (row) {
    let entry = cache.get(row.id);
    let newOne = false;
    if (entry) {
      if (entry instanceof IDType) {
        (<any>entry).name = row.name;
        (<any>entry).names = row.names;
      }
    } else {
      entry = new IDType(row.id, row.name, row.names);
      newOne = true;
    }
    cache.set(row.id, entry);
    if (newOne) {
      global_fire(EVENT_REGISTER_IDTYPE, entry);
    }
  });
}


function toPlural(name: string) {
  if (name[name.length - 1] === 'y') {
    return name.slice(0, name.length - 1) + 'ies';
  }
  return name + 's';
}

export declare type IDTypeLike = string|IDType;

export function resolve(id: IDTypeLike): IDType {
  if (id instanceof IDType) {
    return id;
  } else {
    const sid = <string>id;
    return <IDType>register(sid, new IDType(sid, sid, toPlural(sid)));
  }
}
export function resolveProduct(...idtypes: IDType[]): ProductIDType {
  const p = new ProductIDType(idtypes);
  return <ProductIDType>register(p.id, p);
}

/**
 * list currently resolved idtypes
 * @returns {Array<IDType|ProductIDType>}
 */
export function list(): IIDType[] {
  return Array.from(cache.values());
}


/**
 * Get a list of all IIDTypes available on both the server and the client.
 * @returns {any}
 */
export async function listAll(): Promise<IIDType[]> {
  if (filledUp) {
    return Promise.resolve(list());
  }
  const c = await <Promise<IIDType[]>>getAPIJSON('/idtype/', {}, []);
  filledUp = true;
  fillUpData(c);
  return list();
}

export function register(id: string, idtype: IDType|ProductIDType): IDType|ProductIDType {
  if (cache.has(id)) {
    return cache.get(id);
  }
  cache.set(id, idtype);
  global_fire('register.idtype', idtype);
  return idtype;
}

export function persist() {
  let r: any = {};

  cache.forEach((v, id) => {
    r[id] = v.persist();
  });
  return r;
}

export function restore(persisted: any) {
  Object.keys(persisted).forEach((id) => {
    resolve(id).restore(persisted[id]);
  });
}

export function clearSelection(type = defaultSelectionType) {
  cache.forEach((v) => v.clear(type));
}


/**
 * whether the given idtype is an internal one or not, i.e. the internal flag is set or it starts with an underscore
 * @param idtype
 * @return {boolean}
 */
export function isInternalIDType(idtype: IIDType) {
  return idtype.internal || idtype.id.startsWith('_');
}
