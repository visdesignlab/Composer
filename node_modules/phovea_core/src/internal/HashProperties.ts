/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import PropertyHandler from './PropertyHandler';
/**
 * manages the hash location property helper
 */
export default class HashProperties extends PropertyHandler {
  private updated = () => {
    this.parse(location.hash);
  }

  constructor() {
    super();
    const bak = history.state;
    if (bak) {
      Object.keys(bak).forEach((k) => this.map.set(k, bak[k]));
    } else {
      this.parse(location.hash);
    }
    window.addEventListener('hashchange', this.updated, false);
  }

  setInt(name: string, value: number, update = true) {
    let v = String(value);
    if (value > 100) {
      //idea encode the the using a different radix
      v = value.toString(36);
    }
    this.setProp(name, String(value), update);
  }

  setProp(name: string, value: string, update = true) {
    this.map.set(name, value);
    if (update) {
      this.update();
    }
  }

  removeProp(name: string, update = true) {
    if (this.map.has(name)) {
      this.map.delete(name);
      if (update) {
        this.update();
      }
      return true;
    }
    return false;
  }

  private toObject() {
    const r: any = {};
    this.map.forEach((v, k) => r[k] = v);
    return r;
  }

  private update() {
    window.removeEventListener('hashchange', this.updated, false);
    history.pushState(this.toObject(), 'State ' + Date.now(), '#' + this.toString());
    window.addEventListener('hashchange', this.updated, false);
  }
}
