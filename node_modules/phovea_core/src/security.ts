/**
 * Created by sam on 27.02.2017.
 */


import {retrieve, store, remove} from './session';
import {fire} from './event';

export const GLOBAL_EVENT_USER_LOGGED_IN = 'USER_LOGGED_IN';
export const GLOBAL_EVENT_USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export interface IUser {
  /**
   * user name
   */
  readonly name: string;
  /**
   * list of roles the user is associated with
   */
  readonly roles: string[];
}

export const ANONYMOUS_USER: IUser = {name: 'anonymous', roles: ['anonymous']};

/**
 * resets the stored session data that will be automatically filled during login
 */
export function reset() {
  remove('logged_in');
  remove('username');
  remove('user');
}

/**
 * whether the user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return retrieve('logged_in') === true;
}

/**
 * stores the given user information
 * @param user
 */
export function login(user: IUser) {
  store('logged_in', true);
  store('username', user.name);
  store('user', user);
  fire(GLOBAL_EVENT_USER_LOGGED_IN, user);
}

/**
 * logs the current user out
 */
export function logout() {
  const wasLoggedIn = isLoggedIn();
  reset();
  if (wasLoggedIn) {
    fire(GLOBAL_EVENT_USER_LOGGED_OUT);
  }
}


/**
 * returns the current user or null
 * @returns {any}
 */
export function currentUser(): IUser|null {
  if (!isLoggedIn()) {
    return null;
  }
  return retrieve('user', ANONYMOUS_USER);
}

/**
 * returns the current user name else an anonymous user name
 */
export function currentUserNameOrAnonymous() {
  const u = currentUser();
  return u ? u.name : ANONYMOUS_USER.name;
}


export enum EPermission {
  READ = 4, WRITE = 2, EXECUTE = 1
}

export enum EEntity {
  USER, GROUP, OTHERS
}

function toNumber(p: Set<EPermission>) {
  return (p.has(EPermission.READ) ? 4 : 0) + (p.has(EPermission.WRITE) ? 2 : 0) + (p.has(EPermission.EXECUTE) ? 1 : 0);
}

function toString(p: Set<EPermission>) {
  return (p.has(EPermission.READ) ? 'r' : '-') + (p.has(EPermission.WRITE) ? 'w' : '-') + (p.has(EPermission.EXECUTE) ? 'x' : '-');
}

function fromNumber(p: number) {
  const r = new Set<EPermission>();
  if (p >= 4) {
    r.add(EPermission.READ);
    p -= 4;
  }
  if (p >= 2) {
    r.add(EPermission.WRITE);
    p -= 2;
  }
  if (p >= 1) {
    r.add(EPermission.EXECUTE);
  }
  return r;
}

/**
 * by default only the creator has all permissions
 * @type {number}
 */
export const ALL_READ_READ = 744;
export const ALL_NONE_NONE = 700;
export const ALL_READ_NONE = 740;
export const DEFAULT_PERMISSION = ALL_READ_READ;


export interface ISecureItem {
  /**
   * creator / owner of the item
   */
  readonly creator: string;
  /**
   * group he is sharing this item
   */
  readonly group?: string;
  /**
   * detailed permissions, by default 744
   */
  readonly permissions?: number;
}

export class Permission {
  constructor(public readonly user: Set<EPermission>, public readonly group: Set<EPermission>, public readonly others: Set<EPermission>) {

  }

  encode() {
    return encode(this.user, this.group, this.others);
  }

  toString() {
    const userEncoded = toString(this.user);
    const groupEncoded = toString(this.group);
    const othersEncoded = toString(this.others);
    return userEncoded + groupEncoded + othersEncoded;
  }

  getPermissions(entity: EEntity) {
    switch(entity) {
      case EEntity.USER: return this.user;
      case EEntity.GROUP: return this.group;
      case EEntity.OTHERS: return this.others;
    }
  }

  hasPermission(entity: EEntity, permission: EPermission) {
    const permissions = this.getPermissions(entity);
    return permissions.has(permission);
  }
}

export function encode(user: Set<EPermission>, group: Set<EPermission>, others: Set<EPermission>) {
  const userEncoded = toNumber(user);
  const groupEncoded = toNumber(group);
  const othersEncoded = toNumber(others);
  return userEncoded * 100 + groupEncoded * 10 + othersEncoded;
}

export function decode(permission = DEFAULT_PERMISSION) {
  if (typeof permission !== 'number') {
    permission = DEFAULT_PERMISSION;
  }
  const others = fromNumber(permission % 10);
  const group = fromNumber(Math.floor(permission / 10) % 10);
  const user = fromNumber(Math.floor(permission / 100) % 10);
  return new Permission(user, group, others);
}

function isEqual(a: string, b: string) {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a.localeCompare(b) === 0;
}

function includes(items: string[], item: string) {
  if (!item) {
    return false;
  }
  return items.some((r) => isEqual(item, r));
}

function can(item: ISecureItem, permission: EPermission, user = currentUser()): boolean {
  if (!user) {
    user = ANONYMOUS_USER;
  }
  const permissions = decode(item.permissions);

  // I'm the creator
  if (isEqual(user.name, item.creator)) {
    return permissions.user.has(permission);
  }

  // check if I'm in the group
  if (item.group && includes(user.roles, item.group)) {
    return permissions.group.has(permission);
  }

  // check others
  return permissions.others.has(permission);
}

/**
 * check whether the given user can read the given item
 * @param item the item to check
 * @param user the user by default the current user
 * @returns {boolean}
 */
export function canRead(item: ISecureItem, user = currentUser()) {
  return can(item, EPermission.READ, user);
}


/**
 * check whether the given user can write the given item
 * @param item the item to check
 * @param user the user by default the current user
 * @returns {boolean}
 */
export function canWrite(item: ISecureItem, user = currentUser()) {
  return can(item, EPermission.WRITE, user);
}


/**
 * check whether the given user can execute the given item
 * @param item the item to check
 * @param user the user by default the current user
 * @returns {boolean}
 */
export function canExecute(item: ISecureItem, user = currentUser()) {
  return can(item, EPermission.EXECUTE, user);
}


export function hasPermission(item: ISecureItem, entity: EEntity = EEntity.USER, permission: EPermission = EPermission.READ) {
  const permissions = decode(item.permissions);
  return permissions.hasPermission(entity, permission);
}
