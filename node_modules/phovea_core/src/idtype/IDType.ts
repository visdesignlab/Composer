/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */


import {getAPIJSON, sendAPI} from '../ajax';
import {EventHandler} from '../event';
import {none, Range, RangeLike, parse, list as rlist} from '../range';
import {IIDType, defaultSelectionType, SelectOperation, asSelectOperation} from './IIDType';
import {resolve} from './manager';
/**
 * An IDType is a semantic aggregation of an entity type, like Patient and Gene.
 *
 * An entity is tracked by a unique identifier (integer) within the system,
 * which is mapped to a common, external identifier or name (string) as well.
 */
export default class IDType extends EventHandler implements IIDType {
  static readonly EVENT_SELECT = 'select';
  /**
   * the current selections
   */
  private readonly sel = new Map<string, Range>();

  // TODO: is this cache ever emptied, or do we assume a reasonable upper bound on the entities in IDType?
  private readonly name2idCache = new Map<string, number>();
  private readonly id2nameCache = new Map<number, string>();

  private canBeMappedTo: Promise<IDType[]> = null;

  /**
   * @param id the system identifier of this IDType
   * @param name the name of this IDType for external presentation
   * @param names the plural form of above name
   * @param internal whether this is an internal type or not
   */
  constructor(public id: string, public readonly name: string, public readonly names: string, public readonly internal = false) {
    super();
  }

  persist() {
    const s: any = {};
    this.sel.forEach((v, k) => s[k] = v.toString());
    return {
      sel: s,
      name: this.name,
      names: this.names
    };
  }

  restore(persisted: any) {
    (<any>this).name = persisted.name;
    (<any>this).names = persisted.names;
    Object.keys(persisted.sel).forEach((type) => this.sel.set(type, persisted.sel[type]));
    return this;
  }

  toString() {
    return this.name;
  }

  selectionTypes() {
    return Array.from(this.sel.keys());
  }

  /**
   * return the current selections of the given type
   * @param type optional the selection type
   * @returns {Range}
   */
  selections(type = defaultSelectionType) {
    if (this.sel.has(type)) {
      return this.sel.get(type);
    }
    const v = none();
    this.sel.set(type, v);
    return v;
  }

  /**
   * select the given range as
   * @param range
   */
  select(range: RangeLike): Range;
  select(range: RangeLike, op: SelectOperation): Range;
  select(type: string, range: RangeLike): Range;
  select(type: string, range: RangeLike, op: SelectOperation): Range;
  select() {
    const a = Array.from(arguments);
    const type = (typeof a[0] === 'string') ? a.shift() : defaultSelectionType,
      range = parse(a[0]),
      op = asSelectOperation(a[1]);
    return this.selectImpl(range, op, type);
  }

  private selectImpl(range: Range, op = SelectOperation.SET, type: string = defaultSelectionType) {
    const b = this.selections(type);
    let newValue: Range = none();
    switch (op) {
      case SelectOperation.SET:
        newValue = range;
        break;
      case SelectOperation.ADD:
        newValue = b.union(range);
        break;
      case SelectOperation.REMOVE:
        newValue = b.without(range);
        break;
    }
    if (b.eq(newValue)) {
      return b;
    }
    this.sel.set(type, newValue);
    const added = op !== SelectOperation.REMOVE ? range : none();
    const removed = (op === SelectOperation.ADD ? none() : (op === SelectOperation.SET ? b : range));
    this.fire(IDType.EVENT_SELECT, type, newValue, added, removed, b);
    this.fire(`${IDType.EVENT_SELECT}-${type}`, newValue, added, removed, b);
    return b;
  }

  clear(type = defaultSelectionType) {
    return this.selectImpl(none(), SelectOperation.SET, type);
  }

  /**
   * Cache identifier <-> name mapping in bulk.
   * @param ids the entity identifiers to cache
   * @param names the matching entity names to cache
   */
  fillMapCache(ids: number[], names: string[]) {
    ids.forEach((id, i) => {
      const name = names[i];
      this.name2idCache.set(name, id);
      this.id2nameCache.set(id, name);
    });
  }

  /**
   * returns the list of idtypes that this type can be mapped to
   * @returns {Promise<IDType[]>}
   */
  getCanBeMappedTo() {
    if (this.canBeMappedTo === null) {
      this.canBeMappedTo = getAPIJSON(`/idtype/${this.id}/`).then((list) => list.map(resolve));
    }
    return this.canBeMappedTo;
  }

  mapToFirstName(ids: RangeLike, toIDType: string|IDType): Promise<string[]> {
    const target = resolve(toIDType);
    const r = parse(ids);
    return chooseRequestMethod(`/idtype/${this.id}/${target.id}`, {ids: r.toString(), mode: 'first'});
  }

  mapToName(ids: RangeLike, toIDType: string|IDType): Promise<string[][]> {
    const target = resolve(toIDType);
    const r = parse(ids);
    return chooseRequestMethod(`/idtype/${this.id}/${target.id}`, {ids: r.toString()});
  }

  mapToFirstID(ids: RangeLike, toIDType: string|IDType): Promise<number[]> {
    const target = resolve(toIDType);
    const r = parse(ids);
    return chooseRequestMethod(`/idtype/${this.id}/${target.id}/map`, {ids: r.toString(), mode: 'first'});
  }

  mapToID(ids: RangeLike, toIDType: string|IDType): Promise<number[][]> {
    const target = resolve(toIDType);
    const r = parse(ids);
    return chooseRequestMethod(`/idtype/${this.id}/${target.id}/map`, {ids: r.toString()});
  }

  /**
   * Request the system identifiers for the given entity names.
   * @param names the entity names to resolve
   * @returns a promise of system identifiers that match the input names
   */
  async map(names: string[]): Promise<number[]> {
    const toResolve = names.filter((name) => !this.name2idCache.has(name));
    if (toResolve.length === 0) {
      return Promise.resolve(names.map((name) => this.name2idCache.get(name)));
    }
    const ids: number[] = await chooseRequestMethod(`/idtype/${this.id}/map`, {ids: toResolve});
    toResolve.forEach((name, i) => {
      this.name2idCache.set(name, ids[i]);
      this.id2nameCache.set(ids[i], name);
    });
    return names.map((name) => this.name2idCache.get(name));
  }

  /**
   * Request the names for the given entity system identifiers.
   * @param ids the entity names to resolve
   * @returns a promise of system identifiers that match the input names
   */
  async unmap(ids: RangeLike): Promise<string[]> {
    const r = parse(ids);
    const toResolve: number[] = [];
    r.dim(0).forEach((name) => !(this.id2nameCache.has(name)) ? toResolve.push(name) : null);
    if (toResolve.length === 0) {
      const result: string[] = [];
      r.dim(0).forEach((name) => result.push(this.id2nameCache.get(name)));
      return Promise.resolve(result);
    }
    const result: string[] = await chooseRequestMethod(`/idtype/${this.id}/unmap`, {ids: rlist(toResolve).toString()});
    toResolve.forEach((id, i) => {
      this.id2nameCache.set(id, result[i]);
      this.name2idCache.set(result[i], id);
    });
    const out: string[] = [];
    r.dim(0).forEach((name) => out.push(this.id2nameCache.get(name)));
    return out;
  }

  /**
   * search for all matching ids for a given pattern
   * @param pattern
   * @param limit maximal number of results
   * @return {Promise<void>}
   */
  async search(pattern: string, limit = 10): Promise<IDPair[]> {
   const result: IDPair[] = await getAPIJSON(`/idtype/${this.id}/search`, {q: pattern, limit});
    // cache results
    result.forEach((pair) => {
      this.id2nameCache.set(pair.id, pair.name);
      this.name2idCache.set(pair.name, pair.id);
    });
    return result;
  }

  /**
   * search for all matching ids for a given pattern
   * @param pattern
   * @param limit maximal number of results
   * @return {Promise<void>}
   */
  searchMapping(pattern: string, toIDType: string|IDType, limit = 10): Promise<{match: string, to: string}[]> {
    const target = resolve(toIDType);
    return getAPIJSON(`/idtype/${this.id}/${target.id}/search`, {q: pattern, limit});
  }
}

/**
 * chooses whether a GET or POST request based on the expected url length
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
function chooseRequestMethod(url: string, data: any = {}) {
  const dataLengthGuess = JSON.stringify(data);
  const lengthGuess = url.length + dataLengthGuess.length;

  const method = lengthGuess < 2000 ? 'GET' : 'POST';
  return sendAPI(url, data, method);
}


export interface IDPair {
  readonly name: string;
  readonly id: number;
}
