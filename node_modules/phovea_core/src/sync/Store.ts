/**
 * Created by Samuel Gratzl on 01.12.2016.
 */

import {EventHandler} from '../event';

export interface IChangedHandler {
  (newValue: any, oldValue: any, url: string);
}

function parse(v: string) {
  return v === null ? null: JSON.parse(v);
}

function stringify(v: any) {
  return JSON.stringify(v);
}

export default class Store extends EventHandler {
  static EVENT_CHANGED = '_change';

  constructor(private storage: Storage, private prefix: string) {
    super();

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === storage && event.key.startsWith(prefix)) {
        const key = event.key.substring(prefix.length);
        // send specific and generic event
        const newValue= parse(event.newValue);
        const oldValue = parse(event.oldValue);
        this.fire(key, newValue, oldValue, event.url);
        this.fire(Store.EVENT_CHANGED, key, newValue, oldValue, event.url);
      }
    });
  }

  private toFullKey(key: string) {
    return this.prefix + key;
  }

  setValue(key: string, value: any) {
    key = this.toFullKey(key);
    const bak = this.storage.getItem(key);
    this.storage.setItem(key, stringify(value));
    return bak;
  }

  deleteValue(key: string) {
    key = this.toFullKey(key);
    this.storage.removeItem(key);
  }

  includes(key: string) {
    key = this.toFullKey(key);
    return (this.storage.getItem(key) !== null);
  }

  getValue<T>(key: string, defaultValue: T = null): T {
    key = this.toFullKey(key);
    const v = this.storage.getItem(key);
    return v !== null ? parse(v) : defaultValue;
  }
}
