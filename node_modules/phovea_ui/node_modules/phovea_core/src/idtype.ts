/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {IPersistable, argList, IdPool} from './index';
import {getAPIJSON} from './ajax';
import {EventHandler, IEventHandler, IEvent, IEventListener, fire as global_fire} from './event';
import {none, all, Range, join, RangeLike, parse, Range1D, list as rlist} from './range';

// TODO convert to Map
const cache:{ [id: string] : IDType|ProductIDType } = {};
var filledUp = false;

export const defaultSelectionType = 'selected';
export const hoverSelectionType = 'hovered';

export enum SelectOperation {
  SET, ADD, REMOVE
}

/**
 * converts the given mouse event to a select operation
 * @param event the mouse event to examine
 */
export function toSelectOperation(event:any);
/**
 * converts the given key modifiers to select operation
 * @param ctryKey
 * @param altKey
 * @param shiftKey
 * @param metaKey
 */
export function toSelectOperation(ctryKey:boolean, altKey:boolean, shiftKey:boolean, metaKey:boolean);
export function toSelectOperation(event:any) {
  var ctryKeyDown, shiftDown, altDown, metaDown;
  if (typeof event === 'boolean') {
    ctryKeyDown = event;
    altDown = arguments[1] || false;
    shiftDown = arguments[2] || false;
    metaDown = arguments[3] || false;
  } else {
    ctryKeyDown = event.ctrlKey || false;
    altDown = event.altKey || false;
    shiftDown = event.shiftKey || false;
    metaDown = event.metaKey || false;
  }
  if (ctryKeyDown || shiftDown) {
    return SelectOperation.ADD;
  } else if (altDown || metaDown) {
    return SelectOperation.REMOVE;
  }
  return SelectOperation.SET;
}

export interface IIDType extends IEventHandler, IPersistable {
  id: string;
  name: string;
  names: string;
  internal: boolean;
  toString(): string;

  selectionTypes(): string[];

  clear();
  clear(type:string);
}

/**
 * An IDType is a semantic aggregation of an entity type, like Patient and Gene.
 *
 * An entity is tracked by a unique identifier (integer) within the system,
 * which is mapped to a common, external identifier or name (string) as well.
 */
export class IDType extends EventHandler implements IIDType {
  /**
   * the current selections
   * @type {{}}
   */
  // TODO convert to Map
  private sel = {};

  // TODO: is this cache ever emptied, or do we assume a reasonable upper bound on the entities in IDType?
  // TODO convert to Map
  private name2id_cache:{ [k:string] : number } = {};
  // TODO convert to Map
  private id2name_cache:{ [k:number] : string } = {};

  private canBeMappedTo: Promise<IDType[]> = null;

  /**
   * @param id the system identifier of this IDType
   * @param name the name of this IDType for external presentation
   * @param names the plural form of above name
   * @param internal whether this is an internal type or not
   */
  constructor(public id:string, public name:string, public names:string, public internal = false) {
    super();
  }

  persist() {
    var s = {};
    Object.keys(this.sel).forEach((type) => s[type] = this.sel[type].toString());
    return {
      sel: s,
      name: this.name,
      names: this.names
    };
  }

  restore(persisted:any) {
    this.name = persisted.name;
    this.names = persisted.names;
    Object.keys(persisted.sel).forEach((type) => this.sel[type] = parse(persisted.sel[type]));
    return this;
  }

  toString() {
    return this.name;
  }

  selectionTypes() {
    return Object.keys(this.sel);
  }

  /**
   * return the current selections of the given type
   * @param type optional the selection type
   * @returns {Range}
   */
  selections(type = defaultSelectionType) {
    if (this.sel.hasOwnProperty(type)) {
      return this.sel[type];
    }
    return this.sel[type] = none();
  }

  /**
   * select the given range as
   * @param range
   */
  select(range:RangeLike);
  select(range:RangeLike, op:SelectOperation);
  select(type:string, range:RangeLike);
  select(type:string, range:RangeLike, op:SelectOperation);
  select() {
    const a = argList(arguments);
    const type = (typeof a[0] === 'string') ? a.shift() : defaultSelectionType,
      range = parse(a[0]),
      op = asSelectOperation(a[1]);
    return this.selectImpl(range, op, type);
  }

  private selectImpl(range:Range, op = SelectOperation.SET, type:string = defaultSelectionType) {
    const b = this.selections(type);
    var new_:Range = none();
    switch (op) {
      case SelectOperation.SET:
        new_ = range;
        break;
      case SelectOperation.ADD:
        new_ = b.union(range);
        break;
      case SelectOperation.REMOVE:
        new_ = b.without(range);
        break;
    }
    if (b.eq(new_)) {
      return b;
    }
    this.sel[type] = new_;
    var added = op !== SelectOperation.REMOVE ? range : none();
    var removed = (op === SelectOperation.ADD ? none() : (op === SelectOperation.SET ? b : range));
    this.fire('select', type, new_, added, removed, b);
    this.fire('select-' + type, new_, added, removed, b);
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
  fillMapCache(ids:number[], names:string[]) {
    ids.forEach((id, i) => {
      const name = names[i];
      this.name2id_cache[name] = id;
      this.id2name_cache[id] = name;
    });
  }

  /**
   * returns the list of idtypes that this type can be mapped to
   * @returns {Promise<IDType[]>}
   */
  getCanBeMappedTo() {
    if (this.canBeMappedTo === null) {
      this.canBeMappedTo = getAPIJSON('/idtype/'+this.id+'/').then((list) => list.map(resolve));
    }
    return this.canBeMappedTo;
  }

  mapToFirstName(ids_:Range | number[], to_idtype: string|IDType):Promise<string[]> {
    const target = resolve(to_idtype);
    const ids = ids_ instanceof Range ? <Range>ids_ : rlist(<number[]>ids_);
    return getAPIJSON(`/idtype/${this.id}/${target.id}`, { ids: ids.toString(), mode : 'first'  });
  }

  mapToName(ids_:Range | number[], to_idtype: string|IDType):Promise<string[][]> {
    const target = resolve(to_idtype);
    const ids = ids_ instanceof Range ? <Range>ids_ : rlist(<number[]>ids_);
    return getAPIJSON(`/idtype/${this.id}/${target.id}`, { ids: ids.toString() });
  }

  mapToFirstID(ids_:Range | number[], to_idtype: string|IDType):Promise<number[]> {
    const target = resolve(to_idtype);
    const ids = ids_ instanceof Range ? <Range>ids_ : rlist(<number[]>ids_);
    return getAPIJSON(`/idtype/${this.id}/${target.id}/map`, { ids: ids.toString(), mode : 'first'  });
  }

  mapToID(ids_:Range | number[], to_idtype: string|IDType):Promise<number[][]> {
    const target = resolve(to_idtype);
    const ids = ids_ instanceof Range ? <Range>ids_ : rlist(<number[]>ids_);
    return getAPIJSON(`/idtype/${this.id}/${target.id}/map`, { ids: ids.toString() });
  }

  /**
   * Request the system identifiers for the given entity names.
   * @param names the entity names to resolve
   * @returns a promise of system identifiers that match the input names
   */
  map(names:string[]):Promise<number[]> {
    var to_resolve = names.filter((name) => !(name in this.name2id_cache));
    if (to_resolve.length === 0) {
      return Promise.resolve(names.map((name) => this.name2id_cache[name]));
    }
    return getAPIJSON(`/idtype/${this.id}/map`, {ids: to_resolve}).then((ids) => {
      to_resolve.forEach((name, i) => {
        this.name2id_cache[name] = ids[i];
      });
      return names.map((name) => this.name2id_cache[name]);
    });
  }

  /**
   * Request the names for the given entity system identifiers.
   * @param ids the entity names to resolve
   * @returns a promise of system identifiers that match the input names
   */
  unmap(ids_:Range | number[]):Promise<string[]> {
    var ids = ids_ instanceof Range ? <Range>ids_ : rlist(<number[]>ids_);
    var to_resolve = [];
    ids.dim(0).forEach((name) => !(name in this.id2name_cache) ? to_resolve.push(name) : null);
    if (to_resolve.length === 0) {
      var r = [];
      ids.dim(0).forEach((name) => r.push(this.id2name_cache[name]));
      return Promise.resolve(r);
    }
    return getAPIJSON(`/idtype/${this.id}/unmap`, {ids: rlist(to_resolve).toString()}).then((result) => {
      to_resolve.forEach((name, i) => {
        this.id2name_cache[name] = result[i];
      });
      var r = [];
      ids.dim(0).forEach((name) => r.push(this.id2name_cache[name]));
      return r;
    });
  }
}

//function indicesCompare(a: number[], b: number[]) {
//  //assert a.length = b.length
//  for(let i = 0; i < a.length; ++i) {
//    if (a[i] !== b[i]) {
//      return a[i] - b[i];
//    }
//  }
//  return 0;
//}
//
//function compressPairs(pairs: number[][]): Range[] {
//  return pairs.map((a) => rlist(...a));
//}

function overlaps(r:Range, with_:Range, ndim:number) {
  if (with_.ndim === 0) {
    return true; //catch all
  }
  for (let i = 0; i < Math.min(r.ndim, ndim); ++i) {
    let ri = r.dim(i);
    var wi = with_.dim(i);
    if (wi.isAll || ri.isAll) {
      return true;
    }
    if (!ri.isUnbound && ri.asList().every((rii) => !wi.contains(rii))) {
      //it the ids at dimension i are not overlapping can't overlap in others
      return false;
    }
    //TODO
  }
  return false;
}

function removeCells(b:Range[], without:Range[], ndim:number) {
  if (without.length === 0) {
    return b;
  }
  var r:Range[] = [];
  b.forEach((bi) => {
    if (without.some((w) => w.eq(bi))) {
      //skip
    } else if (without.some((w) => overlaps(bi, w, ndim))) {
      //TODO
    } else {
      r.push(bi);
    }
  });
  return r;
}
/**
 * a product idtype is a product of multiple underlying ones, e.g. patient x gene.
 */
export class ProductIDType extends EventHandler implements IIDType {
  // TODO convert to Map
  private sel:{ [type: string] : Range[] } = {};

  private isOn = false;
  private selectionListener = (event:IEvent, type:string, act:Range, added:Range, removed:Range) => {
    this.fire('selectDim,selectProduct', this.elems.indexOf(<IDType>event.currentTarget), type, act, added, removed);
    this.fire('selectDim-' + type + ',selectProduct-' + type, this.elems.indexOf(<IDType>event.currentTarget), act, added, removed);
  };

  constructor(public elems:IDType[], public internal = false) {
    super();
  }

  on(events:any, listener?:IEventListener) {
    if (!this.isOn) {
      this.enable();
      this.isOn = true;
    }
    return super.on(events, listener);
  }

  get id() {
    return this.elems.map((e) => e.id).join('X');
  }

  get name() {
    return this.elems.map((e) => e.name).join(' x ');
  }

  get names() {
    return this.elems.map((e) => e.names).join(' x ');
  }

  private enable() {
    this.elems.forEach((elem) => elem.on('select', this.selectionListener));
  }

  private disable() {
    this.elems.forEach((elem) => elem.off('select', this.selectionListener));
  }

  persist() {
    var s = {};
    Object.keys(this.sel).forEach((type) => s[type] = this.sel[type].map((r) => r.toString()));
    return {
      sel: s
    };
  }

  restore(persisted:any) {
    Object.keys(persisted.sel).forEach((type) => this.sel[type] = persisted.sel[type].map(parse));
    return this;
  }

  toString() {
    return this.name;
  }

  selectionTypes() {
    return Object.keys(this.sel);
  }

  /**
   * return the current selections of the given type
   * @param type optional the selection type
   * @returns {Range[]}
   */
  selections(type = defaultSelectionType):Range[] {
    if (this.sel.hasOwnProperty(type)) {
      return this.sel[type].slice();
    }
    this.sel[type] = [];
    return [];
  }

  productSelections(type = defaultSelectionType /*, wildcardLookup: (idtype: IDType) => Promise<number> */):Range[] {
    const cells = this.selections(type);
    const usedCells = this.toPerDim(cells);
    this.elems.forEach((e, i) => {
      const s = e.selections(type);
      //remove all already used rows / columns as part of the cells
      const wildcard = s.without(usedCells[i]);
      if (!wildcard.isNone) {
        //create wildcard cells, e.g., the remaining ones are row/column selections
        cells.push(rlist(this.elems.map((e2) => e === e2 ? wildcard.dim(0) : Range1D.all())));
      }
    });

    return cells;
    /* TODO no duplicates
     if (cells.every((c) => !c.isUnbound)) {
     //all cells are bound, just cells
     return Promise.resolve(cells);
     }
     //we need to resolve some wildcards
     return Promise.all(this.elems.map((elem, i) => {
     if (cells.some((c) => c.dim(i).isUnbound)) {
     return wildcardLookup(elem);
     } else {
     return Promise.resolve(0);
     }
     })).then((size: number[]) => {
     const fullCells : any = {};
     cells.forEach((cell) => {
     cell.product((indices: number[]) => {
     const id = indices.join('_');
     fullCells[id] = indices;
     });
     }, size);
     //fullCells contains all cells that we have to take care of
     const pairs = Object.keys(fullCells).map((k) => fullCells[k]).sort(indicesCompare);
     return compressPairs(pairs);
     });
     */
  }

  /**
   * select the given range as
   * @param range
   */
  select(range:RangeLike[]);
  select(range:RangeLike[], op:SelectOperation);
  select(type:string, range:RangeLike[]);
  select(type:string, range:RangeLike[], op:SelectOperation);
  select() {
    const a = argList(arguments);
    const type = (typeof a[0] === 'string') ? a.shift() : defaultSelectionType,
      range = a[0].map(parse),
      op = asSelectOperation(a[1]);
    return this.selectImpl(range, op, type);
  }

  private selectImpl(cells:Range[], op = SelectOperation.SET, type:string = defaultSelectionType) {
    const rcells = cells.map(parse);

    const b = this.selections(type);

    var new_:Range[] = [];

    switch (op) {
      case SelectOperation.SET:
        new_ = rcells;
        break;
      case SelectOperation.ADD:
        new_ = b.concat(rcells);
        break;
      case SelectOperation.REMOVE:
        new_ = removeCells(b, rcells, this.elems.length);
        break;
    }
    //if (b.eq(new_)) {
    //  return b;
    //}
    this.sel[type] = new_;

    //individual selection per dimension
    const perDimSelections = this.toPerDim(new_);
    this.disable();
    this.elems.forEach((e, i) => e.select(type, perDimSelections[i]));
    this.enable();

    var added = op !== SelectOperation.REMOVE ? rcells : [];
    var removed = (op === SelectOperation.ADD ? [] : (op === SelectOperation.SET ? b : rcells));
    this.fire('select', type, new_, added, removed, b);
    this.fire('selectProduct', -1, type, new_, added, removed, b);
    this.fire('select-' + type, new_, added, removed, b);
    this.fire('selectProduct-' + type, -1, new_, added, removed, b);
    return b;
  }

  private toPerDim(sel:Range[]) {
    return this.elems.map((elem, i) => {
      if (sel.length === 0) {
        return none();
      }
      const dimselections = sel.map((r) => r.dim(i));
      const selection = dimselections.reduce((p, a) => p ? p.union(a) : a, null);
      return rlist(selection);
    });
  }

  clear(type = defaultSelectionType) {
    return this.selectImpl([], SelectOperation.SET, type);
  }
}

export interface IHasUniqueId {
  id: number;
}

export function toId(elem:IHasUniqueId) {
  return elem.id;
}

export function isId(id:number) {
  return (elem:IHasUniqueId) => elem && elem.id === id;
}

/**
 * IDType with an actual collection of entities.
 * Supports selections.
 */
export class ObjectManager<T extends IHasUniqueId> extends IDType {
  private instances:T[] = [];
  private pool = new IdPool();

  constructor(id:string, name:string) {
    super(id, name, name + 's', true);
  }

  nextId(item?:T) {
    const n = this.pool.checkOut();
    if (item) {
      item.id = n;
      this.instances[n] = item;
      this.fire('add', n, item);
    }
    return n;
  }

  push(...items:T[]) {
    items.forEach((item) => {
      this.instances[item.id] = item;
      this.fire('add', item.id, item);
    });
  }

  byId(id:number) {
    return this.instances[id];
  }

  forEach(callbackfn:(value:T) => void, thisArg?:any):void {
    this.instances.forEach((item, i) => this.pool.isCheckedOut(i) ? callbackfn.call(thisArg, item) : null);
  }

  get entries() {
    return this.instances.filter((item, i) => this.pool.isCheckedOut(i));
  }

  remove(id:number);
  remove(item:T);
  remove(item:any):T {
    var old = null;
    if (typeof item.id === 'number') {
      item = item.id;
    }
    if (typeof item === 'number') {
      old = this.instances[item];
      delete this.instances[item];
      this.fire('remove', item, old);
    }
    //clear from selections
    this.selectionTypes().forEach((type) => {
      this.select(type, [item], SelectOperation.REMOVE);
    });
    this.pool.checkIn(item);
    return old;
  }

  selectedObjects(type = defaultSelectionType) {
    const s = this.selections(type);
    return s.filter(this.instances);
  }
}

export class LocalIDAssigner {
  private pool = new IdPool();
  private lookup:{  [key:string] : number } = {};

  unmapOne(id:number) {
    return this.unmap([id])[0];
  }

  unmap(ids:number[]) {
    const keys = Object.keys(this.lookup);
    return ids.map((id) => {
      for (let k in keys) {
        if (this.lookup[k] === id) {
          return k;
        }
      }
      return null;
    });
  }

  mapOne(id:string):number {
    if (id in this.lookup) {
      return this.lookup[id];
    }
    this.lookup[id] = this.pool.checkOut();
    return this.lookup[id];
  }

  map(ids:string[]):Range {
    const numbers : number[] = ids.map((d) => this.mapOne(d));
    return rlist(...numbers);
  }
}

export function createLocalAssigner() {
  const pool = new IdPool();
  const lookup:{  [key:string] : number } = {};

  function mapOne(id:string):number {
    if (id in lookup) {
      return lookup[id];
    }
    lookup[id] = pool.checkOut();
    return lookup[id];
  }

  return (ids:string[]) => rlist(...ids.map(mapOne));
}

function asSelectOperation(v:any) {
  if (!v) {
    return SelectOperation.SET;
  }
  if (typeof v === 'string') {
    switch (v.toLowerCase()) {
      case 'add' :
        return SelectOperation.ADD;
      case 'remove' :
        return SelectOperation.REMOVE;
      default :
        return SelectOperation.SET;
    }
  }
  return +v;
}

function fillWithNone(r:Range, ndim:number) {
  while (r.ndim < ndim) {
    r.dims[r.ndim] = Range1D.none();
  }
  return r;
}

export interface ISelectAble extends IEventHandler {
  ids(range?:Range):Promise<Range>;

  fromIdRange(idRange?:Range);

  idtypes:IDType[];

  selections(type?:string);

  select(range:RangeLike);
  select(range:RangeLike, op:SelectOperation);
  select(type:string, range:RangeLike);
  select(type:string, range:RangeLike, op:SelectOperation);
  select(dim:number, range:RangeLike);
  select(dim:number, range:RangeLike, op:SelectOperation);
  select(dim:number, type:string, range:RangeLike);
  select(dim:number, type:string, range:RangeLike, op:SelectOperation);

  /**
   * clear the specific selection (type) and dimension
   */
  clear();
  clear(type:string);
  clear(dim:number);
  clear(dim:number, type:string);
}


export class SelectAble extends EventHandler implements ISelectAble {
  private numSelectListeners = 0;
  private selectionListeners = [];
  private singleSelectionListener = (event:any, type:string, act:Range, added:Range, removed:Range) => {
    this.ids().then((ids:Range) => {
      //filter to the right ids and convert to indices format
      //given all ids convert the selected ids to the indices in the data type
      act = ids.indexOf(act);
      added = ids.indexOf(added);
      removed = ids.indexOf(removed);
      if (act.isNone && added.isNone && removed.isNone) {
        return;
      }
      //ensure the right number of dimensions
      fillWithNone(act, ids.ndim);
      fillWithNone(added, ids.ndim);
      fillWithNone(removed, ids.ndim);

      this.fire('select', type, act, added, removed);
      this.fire('select-' + type, act, added, removed);
    });
  };
  private selectionCache = [];
  private accumulateEvents = -1;

  ids(range?:Range):Promise<Range> {
    throw new Error('not implemented');
  }

  fromIdRange(idRange:Range = all()) {
    return this.ids().then((ids) => {
      return ids.indexOf(idRange);
    });
  }

  get idtypes():IDType[] {
    throw new Error('not implemented');
  }

  private selectionListener(idtype:IDType, index:number, total:number) {
    const selectionListener = (event:any, type:string, act:Range, added:Range, removed:Range) => {
      this.selectionCache[index] = {
        act: act, added: added, removed: removed
      };
      if (this.accumulateEvents < 0 || (++this.accumulateEvents) === total) {
        this.fillAndSend(type, index);
      }
    };
    return selectionListener;
  }

  private fillAndSend(type:string, trigger:number) {
    var ids = this.idtypes;
    var full = ids.map((id, i) => {
      var entry = this.selectionCache[i];
      if (entry) {
        return entry;
      }
      return {
        act: id.selections(type),
        added: none(),
        removed: none()
      };
    });

    var act = join(full.map((entry) => entry.act));
    var added = join(full.map((entry) => entry.added));
    var removed = join(full.map((entry) => entry.removed));

    this.selectionCache = [];
    this.accumulateEvents = -1; //reset

    this.ids().then((ids:Range) => {
      //filter to the right ids and convert to indices format
      act = ids.indexOf(act);
      added = ids.indexOf(added);
      removed = ids.indexOf(removed);
      if (act.isNone && added.isNone && removed.isNone) {
        return;
      }
      //ensure the right number of dimensions
      fillWithNone(act, ids.ndim);
      fillWithNone(added, ids.ndim);
      fillWithNone(removed, ids.ndim);

      this.fire('select', type, act, added, removed);
      this.fire('select-' + type, act, added, removed);
    });
  }

  on(events, handler?) {
    if (typeof events === 'string' && (events === 'select' || events.slice(0, 'select-'.length) === 'select-')) {
      this.numSelectListeners++;
      if (this.numSelectListeners === 1) {
        const idt = this.idtypes;
        if (idt.length === 1) {
          this.selectionListeners.push(this.singleSelectionListener);
          idt[0].on('select', this.singleSelectionListener);
        } else {
          idt.forEach((idtype, i) => {
            const s = this.selectionListener(idtype, i, idt.length);
            this.selectionListeners.push(s);
            idtype.on('select', s);
          });
        }
      }
    }
    return super.on(events, handler);
  }

  off(events, handler?) {
    if (typeof events === 'string' && events === 'select' || events.match('^select-') === 'select-') {
      this.numSelectListeners--;
      if (this.numSelectListeners === 0) {
        this.idtypes.forEach((idtype, i) => idtype.off('select', this.selectionListeners[i]));
        this.selectionListeners = [];
      }
    }
    return super.off(events, handler);
  }

  selections(type = defaultSelectionType) {
    return this.ids().then((ids:Range) => {
      const r = join(this.idtypes.map((idtype) => idtype.selections(type)));
      return ids.indexRangeOf(r);
    });
  }

  select(range:RangeLike);
  select(range:RangeLike, op:SelectOperation);
  select(type:string, range:RangeLike);
  select(type:string, range:RangeLike, op:SelectOperation);
  select(dim:number, range:RangeLike);
  select(dim:number, range:RangeLike, op:SelectOperation);
  select(dim:number, type:string, range:RangeLike);
  select(dim:number, type:string, range:RangeLike, op:SelectOperation);
  select() {
    const a = argList(arguments);
    const dim = (typeof a[0] === 'number') ? +a.shift() : -1,
      type = (typeof a[0] === 'string') ? a.shift() : defaultSelectionType,
      range = parse(a[0]),
      op = asSelectOperation(a[1]);
    return this.selectImpl(range, op, type, dim);
  }

  private selectImpl(range:Range, op = SelectOperation.SET, type:string = defaultSelectionType, dim = -1) {
    return this.ids().then((ids:Range) => {
      const types = this.idtypes;
      if (dim === -1) {
        range = ids.preMultiply(range);
        this.accumulateEvents = 0;
        var r = join(range.split().map((r, i) => types[i].select(type, r, op)));
        if (this.accumulateEvents > 0) { //one event has not been fires, so do it manually
          this.fillAndSend(type, -1);
        }
        while (r.ndim < types.length) {
          r.dim(r.ndim); //create intermediate ones
        }
        return ids.indexRangeOf(r);
      } else {
        //just a single dimension
        ids = ids.split()[dim];
        range = ids.preMultiply(range);
        types[dim].select(type, range, op);
        return ids.indexRangeOf(range);
      }
    });
  }

  /**
   * clear the specific selection (type) and dimension
   */
  clear();
  clear(type:string);
  clear(dim:number);
  clear(dim:number, type:string);
  clear() {
    const a = argList(arguments);
    const dim = (typeof a[0] === 'number') ? +a.shift() : -1;
    const type = (typeof a[0] === 'string') ? a[0] : defaultSelectionType;
    return this.selectImpl(none(), SelectOperation.SET, type, dim);
  }
}

export interface IProductSelectAble extends ISelectAble {
  producttype: ProductIDType;
  productSelections(type?:string): Promise<Range[]>;

  selectProduct(range:RangeLike[], op?:SelectOperation);
  selectProduct(type:string, range:RangeLike[], op?:SelectOperation);
}

export class ProductSelectAble extends SelectAble {
  private numProductSelectListeners = 0;

  private productSelectionListener = (event:IEvent, index:number, type:string) => {
    const cells = this.producttype.productSelections(type);
    if (cells.length === 0) {
      this.fire('selectProduct', type, []);
      this.fire('selectProduct-' + type, []);
      return;
    }

    this.ids().then((ids:Range) => {
      var act = cells.map((c) => ids.indexOf(c)).filter((c) => !c.isNone);
      if (act.length === 0) {
        return;
      }
      //ensure the right number of dimensions
      act.forEach((a) => fillWithNone(a, ids.ndim));

      this.fire('selectProduct', type, act);
      this.fire('selectProduct-' + type, act);
    });
  };

  get producttype():ProductIDType {
    return null;
  }

  on(events, handler?) {
    if (typeof events === 'string' && (events === 'select' || events === 'selectProduct' || events.slice(0, 'select-'.length) === 'select-')) {
      this.numProductSelectListeners++;
      if (this.numProductSelectListeners === 1) {
        this.producttype.on('selectProduct', this.productSelectionListener);
      }
    }
    return super.on(events, handler);
  }

  off(events, handler?) {
    if (typeof events === 'string' && (events === 'select' || events === 'selectProduct' || events.slice(0, 'select-'.length) === 'select-')) {
      this.numProductSelectListeners--;
      if (this.numProductSelectListeners === 0) {
        this.producttype.off('selectProduct', this.productSelectionListener);
      }
    }
    return super.off(events, handler);
  }

  productSelections(type = defaultSelectionType):Promise<Range[]> {
    return this.ids().then((ids:Range) => {
      const cells = this.producttype.productSelections(type);
      var act = cells.map((c) => ids.indexRangeOf(c)).filter((c) => !c.isNone);
      //ensure the right number of dimensions
      act.forEach((a) => fillWithNone(a, ids.ndim));
      return act;
    });
  }

  selectProduct(range:RangeLike[], op?:SelectOperation);
  selectProduct(type:string, range:RangeLike[], op?:SelectOperation);
  selectProduct() {
    const a = argList(arguments);
    const type = (typeof a[0] === 'string') ? a.shift() : defaultSelectionType,
      range = a[0].map(parse),
      op = asSelectOperation(a[1]);
    return this.selectProductImpl(range, op, type);
  }

  private selectProductImpl(cells:Range[], op = SelectOperation.SET, type:string = defaultSelectionType) {
    return this.ids().then((ids:Range) => {
      cells = cells.map((c) => ids.preMultiply(c));
      this.producttype.select(type, cells, op);
    });
  }

  /**
   * clear the specific selection (type) and dimension
   */
  clear();
  clear(type:string);
  clear(dim:number);
  clear(dim:number, type:string);
  clear() {
    const a = argList(arguments);
    if (typeof a[0] === 'number') {
      a.shift();
    }
    const type = (typeof a[0] === 'string') ? a[0] : defaultSelectionType;
    return this.selectProductImpl([], SelectOperation.SET, type || defaultSelectionType);
  }
}

function fillUpData(entries) {
  entries.forEach(function (row) {
    var entry = cache[row.id];
    var new_ = false;
    if (entry) {
      if (entry instanceof IDType) {
        entry.name = row.name;
        entry.names = row.names;
      }
    } else {
      entry = new IDType(row.id, row.name, row.names);
      new_ = true;
    }
    cache[row.id] = entry;
    if (new_) {
      global_fire('register.idtype', entry);
    }
  });
}

function fillUp() {
  if (filledUp) {
    return;
  }
  filledUp = true;
  getAPIJSON('/idtype', {}, []).then(function (c) {
    fillUpData(c);
    return cache;
  });
}

function toPlural(name:string) {
  if (name[name.length - 1] === 'y') {
    return name.slice(0, name.length - 1) + 'ies';
  }
  return name + 's';
}

export function resolve(id:string|IDType):IDType {
  if (id instanceof IDType) {
    return id;
  } else {
    return <IDType>register(<string>id, new IDType(<string>id, <string>id, toPlural(<string>id)));
  }
}
export function resolveProduct(...idtypes:IDType[]):ProductIDType {
  const p = new ProductIDType(idtypes);
  return <ProductIDType>register(p.id, p);
}

/**
 * list all known
 * @returns {{}|HTTPCache|xm.http.HTTPCache|boolean}
 */
export function list() {
  fillUp(); //trigger loading of the meta data
  return Object.keys(cache).map((d) => cache[d]);
}

export function register(id:string, idtype:IDType|ProductIDType):IDType|ProductIDType {
  fillUp(); //trigger loading of the meta data
  if (cache.hasOwnProperty(id)) {
    return cache[id];
  }
  cache[id] = idtype;
  global_fire('register.idtype', idtype);
  return idtype;
}

export function persist() {
  var r = {};
  Object.keys(cache).forEach((id) => {
    r[id] = cache[id].persist();
  });
  return r;
}

export function restore(persisted:any) {
  Object.keys(persisted).forEach((id) => {
    resolve(id).restore(persisted[id]);
  });
}

export function clearSelection(type = defaultSelectionType) {
  Object.keys(cache).forEach((id) => cache[id].clear(type));
}
